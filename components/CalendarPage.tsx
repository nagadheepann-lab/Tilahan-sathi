import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getCalendarEvents, getCalendarSummary } from '../services/geminiService';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { CalendarEvent, Crop } from '../types';
import { CROPS } from '../constants';
import SowingIcon from './icons/SowingIcon';
import DropIcon from './icons/DropIcon';
import FertilizerIcon from './icons/FertilizerIcon';
import HarvestingIcon from './icons/HarvestingIcon';
import BugIcon from './icons/BugIcon';
import InfoIcon from './icons/InfoIcon';
import AudioIconButton from './common/AudioIconButton';

interface CalendarPageProps {
    location: string;
}

const categoryStyles: { [key in CalendarEvent['category'] | 'default']: { bg: string; text: string; } } = {
    'Sowing': { bg: 'bg-emerald-500/80', text: 'text-emerald-100' },
    'Irrigation': { bg: 'bg-sky-500/80', text: 'text-sky-100' },
    'Fertilizing': { bg: 'bg-amber-600/80', text: 'text-amber-100' },
    'Harvesting': { bg: 'bg-yellow-500/80', text: 'text-yellow-100' },
    'Pest Control': { bg: 'bg-red-500/80', text: 'text-red-100' },
    'General': { bg: 'bg-indigo-500/80', text: 'text-indigo-100' },
    'default': { bg: 'bg-gray-500/80', text: 'text-gray-100' },
};

const getCategoryIcon = (category: CalendarEvent['category']) => {
    const className = "h-10 w-10";
    switch (category) {
        case 'Sowing': return <SowingIcon className={className} />;
        case 'Irrigation': return <DropIcon className={className} />;
        case 'Fertilizing': return <FertilizerIcon className={className} />;
        case 'Harvesting': return <HarvestingIcon className={className} />;
        case 'Pest Control': return <BugIcon className={className} />;
        case 'General': return <InfoIcon className={className} />;
        default: return <InfoIcon className={className} />;
    }
};


const CalendarPage: React.FC<CalendarPageProps> = ({ location }) => {
    const { t, language } = useLocalization();
    const oilseedCrops = CROPS.filter(c => c.type === 'Oilseed');
    const [selectedCrop, setSelectedCrop] = useState<string>(oilseedCrops[0]?.id || '');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const getCropName = (crop: Crop) => {
        switch(language) {
            case 'hi': return crop.localized.hi;
            case 'ta': return crop.localized.ta;
            case 'mr': return crop.localized.mr;
            case 'bn': return crop.localized.bn;
            default: return crop.name;
        }
    };

    useEffect(() => {
        if (selectedCrop && location) {
            const fetchEvents = async () => {
                setIsLoading(true);
                setError('');
                setEvents([]);
                try {
                    const crop = CROPS.find(c => c.id === selectedCrop);
                    const cropName = crop ? getCropName(crop) : selectedCrop;
                    const calendarEvents = await getCalendarEvents(cropName, location, language);
                    if (calendarEvents) {
                        setEvents(calendarEvents);
                    } else {
                        setError('Could not fetch calendar events. Please try again.');
                    }
                } catch (err) {
                    setError('An error occurred while fetching the calendar.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEvents();
        }
    }, [selectedCrop, location, language, t]);
    
    const crop = CROPS.find(c => c.id === selectedCrop);
    const cropDisplayName = crop ? getCropName(crop) : '';
    const subtitle = t('calendarSubtitle', { crop: cropDisplayName, location });

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('calendarTitle')}</h1>
                <p className="text-gray-300">{subtitle}</p>
            </header>

            <Card>
                <FormControl label={t('oilseedCrop')} htmlFor="crop-select">
                    <InputField as="select" id="crop-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                        {oilseedCrops.map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
                    </InputField>
                </FormControl>
            </Card>

            {isLoading && (
                <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('fetchingCalendar')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}

            {!isLoading && events.length > 0 && (
                <>
                <Card className="!py-2">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-white">Your Calendar Summary</p>
                        <AudioIconButton textToSpeak={() => getCalendarSummary(events, cropDisplayName, location, language)} />
                    </div>
                </Card>
                <div className="space-y-3">
                    {events.map((event, index) => {
                        const style = categoryStyles[event.category] || categoryStyles.default;
                        return (
                            <Card key={index} className="!p-0 overflow-hidden">
                                <div className="flex">
                                    <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center text-center p-3 ${style.bg} ${style.text}`}>
                                        {getCategoryIcon(event.category)}
                                        <p className="mt-2 text-sm font-bold leading-tight">{event.date}</p>
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <p className="font-bold text-lg text-white">{event.title}</p>
                                        <p className="text-gray-300">{event.description}</p>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
                </>
            )}
        </div>
    );
};

export default CalendarPage;