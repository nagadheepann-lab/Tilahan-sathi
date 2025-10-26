import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from "@google/genai";
import { useLocalization } from '../hooks/useLocalization';
import Card from './common/Card';

// Audio Encoding & Decoding Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

type ConversationStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'ended';

const LiveConversationPage: React.FC = () => {
    const { t } = useLocalization();
    const [status, setStatus] = useState<ConversationStatus>('idle');
    const [transcript, setTranscript] = useState<string[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextsRef = useRef<{ input: AudioContext | null, output: AudioContext | null }>({ input: null, output: null });
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');
    
    const cleanup = useCallback(() => {
        setStatus('idle');
        
        // Stop all audio sources
        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        // Disconnect script processor
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
            scriptProcessorRef.current = null;
        }

        // Stop media stream tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        // Close audio contexts
        if (audioContextsRef.current.input) {
            audioContextsRef.current.input.close();
            audioContextsRef.current.input = null;
        }
        if (audioContextsRef.current.output) {
            audioContextsRef.current.output.close();
            audioContextsRef.current.output = null;
        }
    }, []);

    const startConversation = async () => {
        setTranscript([]);
        setStatus('connecting');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextsRef.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextsRef.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (!audioContextsRef.current.input || !streamRef.current) return;
                        setStatus('listening');
                        const source = audioContextsRef.current.input.createMediaStreamSource(streamRef.current);
                        scriptProcessorRef.current = audioContextsRef.current.input.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(audioContextsRef.current.input.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && audioContextsRef.current.output) {
                            setStatus('speaking');
                            const outputCtx = audioContextsRef.current.output;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            
                            sourcesRef.current.add(source);
                            source.onended = () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) {
                                    setStatus('listening');
                                }
                            };
                        }

                         if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const input = currentInputTranscription.current.trim();
                            const output = currentOutputTranscription.current.trim();
                            if (input) setTranscript(prev => [...prev, `You: ${input}`]);
                            if (output) setTranscript(prev => [...prev, `AI: ${output}`]);
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('ended');
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                         setStatus('ended');
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                },
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (error) {
            console.error("Failed to start conversation:", error);
            setStatus('ended');
            cleanup();
        }
    };

    const stopConversation = () => {
        sessionPromiseRef.current?.then(session => session.close());
        cleanup();
        setStatus('ended');
    };
    
    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, []);

    const getStatusText = () => {
        switch(status) {
            case 'idle': return '';
            case 'connecting': return t('connecting');
            case 'listening': return t('speakNow');
            case 'speaking': return t('modelIsSpeaking');
            case 'ended': return t('conversationEnded');
        }
    }
    
    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('liveConvTitle')}</h1>
                <p className="text-gray-300">{t('liveConvSubtitle')}</p>
            </header>

            <Card className="flex flex-col h-[60vh]">
                 <div className="flex-grow bg-black/30 rounded-lg p-4 overflow-y-auto mb-4 space-y-2">
                    {transcript.map((line, index) => (
                        <p key={index} className={`text-lg ${line.startsWith('You:') ? 'text-brand-yellow' : 'text-white'}`}>{line}</p>
                    ))}
                    {transcript.length === 0 && status !== 'idle' && status !== 'ended' && (
                        <p className="text-gray-400 italic">Transcription will appear here...</p>
                    )}
                </div>
                
                <div className="text-center mb-4 min-h-[24px]">
                    <p className="text-xl font-semibold text-gray-200">{getStatusText()}</p>
                </div>
                
                <button
                    onClick={status === 'idle' || status === 'ended' ? startConversation : stopConversation}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 text-white
                        ${status === 'idle' || status === 'ended' ? 'bg-brand-green hover:bg-brand-green-light' : ''}
                        ${status === 'connecting' ? 'bg-gray-500 cursor-not-allowed' : ''}
                        ${status === 'listening' || status === 'speaking' ? 'bg-red-600 hover:bg-red-700' : ''}
                    `}
                    disabled={status === 'connecting'}
                >
                    {status === 'idle' || status === 'ended' ? t('startConversation') : t('stopConversation')}
                </button>
            </Card>
        </div>
    );
};

export default LiveConversationPage;