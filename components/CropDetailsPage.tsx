import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CROPS } from '../constants';
import Card from './common/Card';
import { Crop } from '../types';
import SunIcon from './icons/SunIcon';
import DropIcon from './icons/DropIcon';
import VideoLessonModal from './VideoLessonModal';
import PlayIcon from './icons/PlayIcon';

interface CropDetailsPageProps {
    cropId: string;
    onBack: () => void;
    onUnlockBadge: (cropId: string) => void;
}

const CropDetailsPage: React.FC<CropDetailsPageProps> = ({ cropId, onBack, onUnlockBadge }) => {
    const { language, t } = useLocalization();
    const [showVideoModal, setShowVideoModal] = useState(false);
    const crop = CROPS.find(c => c.id === cropId);

    if (!crop) {
        return <div className="p-4 text-center">Crop not found.</div>;
    }

    const getCropName = (c: Crop) => {
        switch(language) {
          case 'hi': return c.localized.hi;
          case 'ta': return c.localized.ta;
          case 'mr': return c.localized.mr;
          case 'bn': return c.localized.bn;
          default: return c.name;
        }
    };

    const handleCloseVideo = () => {
        setShowVideoModal(false);
        onUnlockBadge(crop.id);
    };

    const cropName = getCropName(crop);
    const thumbnail = `https://picsum.photos/seed/${crop.id}/800/400`;

    return (
        <div className="space-y-4 py-4">
            <img src={thumbnail} alt={cropName} className="w-full h-48 object-cover" />
            <header className="text-center px-4 -mt-12">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{cropName}</h1>
                <p className="text-gray-200 drop-shadow-md mt-2">{crop.description}</p>
            </header>
            
            <div className="p-4 space-y-4">
                <Card>
                    <button onClick={() => setShowVideoModal(true)} className="w-full flex items-center justify-center bg-brand-green hover:bg-brand-green-light text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        <PlayIcon className="h-6 w-6 mr-2" />
                        {t('generateVideo')}
                    </button>
                </Card>
                <Card title={t('idealConditions')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                            <DropIcon className="h-8 w-8 text-sky-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-white">Soil</h3>
                                <p className="text-gray-300">{crop.idealConditions.soil}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <SunIcon className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-white">Climate</h3>
                                <p className="text-gray-300">{crop.idealConditions.climate}</p>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card title={t('varieties')}>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {crop.popularVarieties.map(v => <li key={v}>{v}</li>)}
                    </ul>
                </Card>

                <Card title={t('cultivationPractices')}>
                     <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {crop.cultivationPractices.map(p => <li key={p}>{p}</li>)}
                    </ul>
                </Card>
            </div>
            {showVideoModal && (
                <VideoLessonModal 
                    topic={`A detailed guide on cultivating ${cropName}`} 
                    onClose={handleCloseVideo}
                />
            )}
        </div>
    );
};

export default CropDetailsPage;