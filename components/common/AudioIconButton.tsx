import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateSpeech, playAudio } from '../../services/ttsService';
import SpeakerIcon from '../icons/SpeakerIcon';
import SpeakerOffIcon from '../icons/SpeakerOffIcon';
import { useLocalization } from '../../hooks/useLocalization';

interface AudioIconButtonProps {
    textToSpeak: string | (() => Promise<string>);
}

// Global audio context and source to prevent multiple playbacks
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
// Store a reference to the currently active setIsPlaying function to turn off other buttons
let activeSetIsPlaying: React.Dispatch<React.SetStateAction<boolean>> | null = null;

const AudioIconButton: React.FC<AudioIconButtonProps> = ({ textToSpeak }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { language } = useLocalization();
    const componentIsMounted = useRef(true);

    useEffect(() => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    const stopCurrentAudio = useCallback(() => {
        if (currentSource) {
            currentSource.onended = null;
            currentSource.stop();
            currentSource = null;
        }
        if (activeSetIsPlaying) {
            activeSetIsPlaying(false);
            activeSetIsPlaying = null;
        }
    }, []);

    const handlePlay = async () => {
        if (isLoading) return;

        if (isPlaying) {
            stopCurrentAudio();
            return;
        }
        
        stopCurrentAudio();
        activeSetIsPlaying = setIsPlaying;
        setIsLoading(true);

        try {
            const text = typeof textToSpeak === 'function' ? await textToSpeak() : textToSpeak;
            if (!text) throw new Error("No text to speak");

            const base64Audio = await generateSpeech(text, language);
            if (!base64Audio || !audioContext || !componentIsMounted.current) {
                if (activeSetIsPlaying === setIsPlaying) activeSetIsPlaying = null;
                return;
            };
            
            setIsPlaying(true);
            currentSource = await playAudio(base64Audio, audioContext, () => {
                if(componentIsMounted.current) setIsPlaying(false);
                if (activeSetIsPlaying === setIsPlaying) activeSetIsPlaying = null;
                currentSource = null;
            });
        } catch (error) {
            console.error("Error in audio playback:", error);
            if (activeSetIsPlaying === setIsPlaying) activeSetIsPlaying = null;
        } finally {
            if(componentIsMounted.current) setIsLoading(false);
        }
    };
    
    useEffect(() => {
      return () => {
        if (isPlaying) {
          stopCurrentAudio();
        }
      }
    }, [isPlaying, stopCurrentAudio]);

    const Icon = isPlaying ? SpeakerOffIcon : SpeakerIcon;
    const color = isPlaying ? 'text-brand-yellow' : 'text-gray-300';

    return (
        <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors duration-200 hover:bg-white/10 disabled:opacity-50 ${color}`}
            aria-label={isPlaying ? 'Stop audio' : 'Play audio summary'}
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Icon className="h-6 w-6" />
            )}
        </button>
    );
};

export default AudioIconButton;