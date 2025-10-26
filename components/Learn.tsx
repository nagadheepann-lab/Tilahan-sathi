import React from 'react';
import { CROPS, LEARNING_CONTENT } from '../constants';
import Card from './common/Card';
import { useLocalization } from '../hooks/useLocalization';
import { NavItem, Language, Crop, LearningContent } from '../types';
import AudioIconButton from './common/AudioIconButton';

interface LearnProps {
    onSelectCrop: (cropId: string) => void;
    onSelectTool: (tool: NavItem) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-3">
        <h2 className="text-2xl font-bold text-white px-4">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
            {children}
        </div>
    </section>
);

const GuideCard: React.FC<{ crop: Crop; onClick: () => void; language: Language }> = ({ crop, onClick, language }) => {
    const getCropName = (c: Crop) => {
        switch(language) {
          case 'hi': return c.localized.hi;
          case 'ta': return c.localized.ta;
          case 'mr': return c.localized.mr;
          case 'bn': return c.localized.bn;
          default: return c.name;
        }
    };
    const cropName = getCropName(crop);
    const thumbnail = LEARNING_CONTENT.find(c => c.cropId === crop.id)?.thumbnail || `https://picsum.photos/seed/${crop.id}/200/200`;
    return (
        <div onClick={onClick} className="flex-shrink-0 w-36 cursor-pointer group">
            <div className="relative">
                <img src={thumbnail} alt={cropName} className="w-full h-36 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="font-bold text-lg drop-shadow-md">{cropName}</h3>
                </div>
            </div>
        </div>
    );
};

const ContentCard: React.FC<{ item: LearningContent; onSelectTool: (tool: NavItem) => void; }> = ({ item, onSelectTool }) => {
    const { t } = useLocalization();
    const isScheme = item.navId === 'schemes';
    const title = isScheme ? t('schemesTitle') : item.title;

    const renderIcon = (type: 'video' | 'article' | 'guide') => {
        if (isScheme) return '🏛️';
        switch (type) {
            case 'video': return '🎬';
            case 'article': return '📄';
            case 'guide': return '📘';
            default: return null;
        }
    };
    
    const handleClick = () => {
        if (item.navId) {
            onSelectTool(item.navId);
        }
    };
    
    const textToSpeak = `${item.type}: ${title}.`;

    return (
        <div className="flex-shrink-0 w-64 group">
            <Card className="h-full !p-0 overflow-hidden !bg-black/50 flex flex-col">
                <div onClick={handleClick} className="cursor-pointer">
                    <img src={item.thumbnail} alt={title} className="w-full h-32 object-cover" />
                    <div className="p-3">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                            <span className="mr-1">{renderIcon(item.type)}</span>
                            <span className="uppercase font-semibold">{isScheme ? 'Government Info' : item.type}</span>
                            {!isScheme && (item.duration || item.readTime) && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>{item.duration || item.readTime}</span>
                                </>
                            )}
                        </div>
                        <h3 className="font-bold text-white leading-tight">{title}</h3>
                    </div>
                </div>
                <div className="p-2 mt-auto border-t border-white/10 flex justify-end">
                    <AudioIconButton textToSpeak={textToSpeak} />
                </div>
            </Card>
        </div>
    );
};


const Learn: React.FC<LearnProps> = ({ onSelectCrop, onSelectTool }) => {
    const { t, language } = useLocalization();
    const oilseedCrops = CROPS.filter(c => c.type === 'Oilseed');
    const generalContent = LEARNING_CONTENT.filter(c => !c.cropId);

    return (
        <div className="space-y-6 py-4">
            <header className="text-center px-4">
                <h1 className="text-3xl font-bold text-white">{t('learnTitle')}</h1>
                <p className="text-gray-300">{t('learnSubtitle')}</p>
            </header>
            
            <Section title={t('oilseedCropGuides')}>
                {oilseedCrops.map(crop => (
                    <GuideCard key={crop.id} crop={crop} onClick={() => onSelectCrop(crop.id)} language={language} />
                ))}
            </Section>

            <Section title={t('generalLearning')}>
                {generalContent.map(item => (
                    <ContentCard key={item.id} item={item} onSelectTool={onSelectTool} />
                ))}
            </Section>
        </div>
    );
};

export default Learn;