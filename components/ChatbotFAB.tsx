import React, { useState, useRef, useEffect } from 'react';
import Card from './common/Card';
import { askGemini } from '../services/geminiService';
// FIX: Imported SpeechRecognition and SpeechRecognitionEvent types to resolve 'Cannot find name' errors.
import { ChatMessage, SpeechRecognition, SpeechRecognitionEvent } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import MicrophoneIcon from './icons/MicrophoneIcon';
import ChatIcon from './icons/ChatIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ChatbotModalProps {
    onClose: () => void;
    location: string;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose, location }) => {
    const { language, t } = useLocalization();
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            switch (language) {
                case 'hi': recognition.lang = 'hi-IN'; break;
                case 'ta': recognition.lang = 'ta-IN'; break;
                case 'mr': recognition.lang = 'mr-IN'; break;
                case 'bn': recognition.lang = 'bn-IN'; break;
                default: recognition.lang = 'en-US';
            }

            recognition.onstart = () => setIsRecording(true);
            recognition.onend = () => setIsRecording(false);
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setQuestion(transcript);
            };
            recognitionRef.current = recognition;
        }
    }, [language]);

    const handleAsk = async () => {
        if (!question.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: question };
        setHistory(prev => [...prev, userMessage]);
        setQuestion('');
        setIsLoading(true);

        try {
            const responseText = await askGemini(history, question, language, location);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, something went wrong." };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };
    
    const titleElement = (
      <div className="flex items-center text-white">
        <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors mr-3 p-1 -ml-2" aria-label="Back">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <span>{t('fasalSalah')}</span>
      </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="w-full h-full max-w-2xl flex flex-col">
                <Card title={titleElement} className="flex-grow flex flex-col !bg-gray-900/70">
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-black/20 rounded-lg space-y-4">
                        {history.length === 0 && (
                            <div className="text-center text-gray-400 h-full flex items-center justify-center">
                                <p>{t('initialBotMessage')}</p>
                            </div>
                        )}
                        {history.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-green-light text-white' : 'bg-gray-700 text-white'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-lg bg-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        {recognitionRef.current && (
                            <button 
                                onClick={handleVoiceInput}
                                className={`w-full flex justify-center items-center gap-2 p-2 rounded-lg text-white font-semibold transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-green hover:bg-brand-green-light'}`}
                                disabled={isLoading}>
                                <MicrophoneIcon className="h-5 w-5" />
                                <span>{isRecording ? t('stopRecording') : t('startRecording')}</span>
                            </button>
                        )}
                        <div className="flex">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                                placeholder={t('askQuestionPlaceholder')}
                                className="flex-grow p-3 border border-white/20 bg-black/30 text-white placeholder-gray-400 rounded-l-lg focus:ring-brand-yellow focus:border-brand-yellow"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAsk}
                                className="bg-brand-yellow text-brand-dark font-bold px-4 rounded-r-lg hover:opacity-90 disabled:bg-gray-600"
                                disabled={isLoading || !question.trim()}
                            >
                                {t('send')}
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
};

interface ChatbotFABProps {
    location: string;
}

const ChatbotFAB: React.FC<ChatbotFABProps> = ({ location }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 bg-brand-yellow text-brand-dark p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110 z-30"
                aria-label="Open AI Advisor"
            >
                <ChatIcon className="h-8 w-8" />
            </button>
            {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} location={location} />}
        </>
    );
};

export default ChatbotFAB;