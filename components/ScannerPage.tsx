import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { analyzeImageWithGemini, getScannerSummary } from '../services/geminiService';
import Card from './common/Card';
import { AnalysisResult } from '../types';
import WarningIcon from './icons/WarningIcon';
import AudioIconButton from './common/AudioIconButton';

const ScannerPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = useCallback(async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setImageSrc(null);
                    setAnalysisResult(null);
                    setError('');
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setError("Could not access the camera. Please check permissions.");
            }
        }
    }, []);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const takePhoto = useCallback(async () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImageSrc(dataUrl);
                stopCamera();
                
                setIsLoading(true);
                setAnalysisResult(null);
                setError('');
                try {
                    const base64Data = dataUrl.split(',')[1];
                    const result = await analyzeImageWithGemini(base64Data, language);
                    if (result) {
                        setAnalysisResult(result);
                    } else {
                        setError("Failed to get analysis. The result was not in the expected format.");
                    }
                } catch (err) {
                    setError("Failed to analyze image.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }, [language]);

    const handleRetake = () => {
        startCamera();
    };
    
    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera]);

    const severityStyles = {
        High: { bg: 'bg-red-500/20', text: 'text-red-300', icon: 'text-red-400' },
        Medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', icon: 'text-yellow-400' },
        Low: { bg: 'bg-green-500/20', text: 'text-green-300', icon: 'text-green-400' },
    };
    
    const currentSeverityStyle = analysisResult ? (severityStyles[analysisResult.severity] || severityStyles.Medium) : null;

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('scannerTitle')}</h1>
                <p className="text-gray-300">{t('scannerInstruction')}</p>
            </header>

            <Card>
                <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                    )}
                     {!imageSrc && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-3/4 h-3/4 border-4 border-dashed border-white border-opacity-50 rounded-lg" />
                        </div>
                    )}
                </div>
                {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </Card>

            <div className="flex justify-center">
                {imageSrc ? (
                    <button
                        onClick={handleRetake}
                        className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity"
                    >
                        {t('retakePhoto')}
                    </button>
                ) : (
                    <button
                        onClick={takePhoto}
                        className="w-full bg-brand-green-light text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-brand-green transition-colors"
                    >
                        {t('takePhoto')}
                    </button>
                )}
            </div>

            {(isLoading || analysisResult) && (
                <div className="space-y-4">
                    {isLoading && (
                        <Card>
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-2 text-gray-300">{t('analyzing')}</p>
                            </div>
                        </Card>
                    )}
                    {analysisResult && currentSeverityStyle && (
                        <div className="space-y-4">
                            <Card>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-2">
                                        <h2 className="text-2xl font-bold text-white mb-2">{analysisResult.diseaseName}</h2>
                                    </div>
                                    <AudioIconButton textToSpeak={() => getScannerSummary(analysisResult, language)} />
                                </div>
                                <div className={`flex items-center p-2 rounded-lg ${currentSeverityStyle.bg} ${currentSeverityStyle.text}`}>
                                    <WarningIcon className={`h-6 w-6 mr-2 ${currentSeverityStyle.icon}`} />
                                    <span className="font-semibold">Severity: {analysisResult.severity}</span>
                                </div>
                                <p className="text-gray-300 mt-4">{analysisResult.description}</p>
                            </Card>

                            <Card title="Immediate Measures">
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    {analysisResult.immediateMeasures.map((measure, index) => (
                                        <li key={`immediate-${index}`}>{measure}</li>
                                    ))}
                                </ul>
                            </Card>
                            
                            <Card title="Preventive Measures">
                                 <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    {analysisResult.preventiveMeasures.map((measure, index) => (
                                        <li key={`preventive-${index}`}>{measure}</li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScannerPage;