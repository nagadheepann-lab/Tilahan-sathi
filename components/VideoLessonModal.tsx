import React, { useState, useEffect, useRef } from 'react';
import { generateVideo } from '../services/videoService';
import { useLocalization } from '../hooks/useLocalization';
import Toast from './common/Toast';
import { ToastMessage } from '../types';

interface VideoLessonModalProps {
    topic: string;
    onClose: () => void;
}

const VideoLessonModal: React.FC<VideoLessonModalProps> = ({ topic, onClose }) => {
    const { t } = useLocalization();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const hasInitiated = useRef(false);

    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastMessage['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    useEffect(() => {
        const generateWithRetry = async () => {
            setIsLoading(true);
            setError('');
        
            try {
                const url = await generateVideo(`Create a short, informative video lesson for an Indian farmer about: ${topic}. The video should be simple and easy to understand.`);
                if (url) {
                    setVideoUrl(url);
                    setIsLoading(false);
                } else {
                    setError(t('videoFailed'));
                    setIsLoading(false);
                }
            } catch (err: any) {
                if (err.message === 'API_KEY_NOT_FOUND') {
                    addToast("API Key invalid. Please select a valid key.", 'error');
                    await window.aistudio.openSelectKey();
                    // We assume user selects a key. Now we retry.
                    addToast("Retrying with new key...", 'info');
                    generateWithRetry(); // The function calls itself to retry. isLoading remains true.
                } else {
                    console.error(err);
                    setError(t('videoFailed'));
                    setIsLoading(false);
                }
            }
        };

        const checkApiKeyAndStart = async () => {
            if (hasInitiated.current) return;
            hasInitiated.current = true;
            
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                addToast("You need to select an API key to generate videos.", 'info');
                await window.aistudio.openSelectKey();
            }
            
            addToast("Video generation can take a few minutes. Please be patient.", 'info');
            generateWithRetry();
        };

        checkApiKeyAndStart();
        
        // Cleanup object URL on unmount
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };

    }, [topic, t]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{topic}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-4 aspect-video bg-black flex items-center justify-center">
                    {isLoading && (
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-gray-300">{t('generatingVideo')}</p>
                        </div>
                    )}
                    {error && <p className="text-red-400">{error}</p>}
                    {videoUrl && (
                        <video src={videoUrl} controls autoPlay className="w-full h-full" />
                    )}
                </div>
            </div>
            <div className="fixed top-4 right-4 space-y-2">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(x => x.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

export default VideoLessonModal;