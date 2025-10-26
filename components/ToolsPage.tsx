import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import Card from './common/Card';
import { NavItem } from '../types';
import CameraIcon from './icons/CameraIcon';
import SoilIcon from './icons/SoilIcon';
import CalendarIcon from './icons/CalendarIcon';
import CalculatorIcon from './icons/CalculatorIcon';
import WeatherIcon from './icons/WeatherIcon';
import RotationIcon from './icons/RotationIcon';
import StoreIcon from './icons/StoreIcon';
import FertilizerBagIcon from './icons/FertilizerBagIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import LiveIcon from './icons/LiveIcon';

interface ToolsPageProps {
    onSelectTool: (tool: NavItem) => void;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ onSelectTool }) => {
    const { t } = useLocalization();

    const tools = [
        { id: 'live-conversation', title: t('liveConversation'), description: t('liveConversationDesc'), icon: LiveIcon, navId: 'live-conversation' },
        { id: 'scanner', title: t('pestScanner'), description: t('pestScannerDesc'), icon: CameraIcon, navId: 'scanner' },
        { id: 'soil', title: t('soilHealth'), description: t('soilHealthDesc'), icon: SoilIcon, navId: 'soil' },
        { id: 'calendar', title: t('cropCalendar'), description: t('cropCalendarDesc'), icon: CalendarIcon, navId: 'calendar' },
        { id: 'fertilizer-calculator', title: t('fertilizerCalculator'), description: t('fertilizerCalculatorDesc'), icon: FertilizerBagIcon, navId: 'fertilizer-calculator' },
        { id: 'mandi-price-tracker', title: t('mandiPriceTracker'), description: t('mandiPriceTrackerDesc'), icon: TrendingUpIcon, navId: 'mandi-price-tracker' },
        { id: 'profit-simulator', title: t('profitSimulator'), description: t('profitSimulatorDesc'), icon: CalculatorIcon, navId: 'profit-simulator' },
        { id: 'crop-rotation', title: t('cropRotation'), description: t('cropRotationDesc'), icon: RotationIcon, navId: 'crop-rotation' },
        { id: 'weather', title: t('weatherForecast'), description: t('weatherDesc'), icon: WeatherIcon, navId: 'weather' },
        { id: 'dealer-locator', title: t('dealerLocator'), description: t('dealerLocatorDesc'), icon: StoreIcon, navId: 'dealer-locator' },
    ];

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('tools')}</h1>
                <p className="text-gray-300">{t('toolsDesc')}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map(tool => (
                    <Card key={tool.id} onClick={() => onSelectTool(tool.navId as NavItem)} className="!bg-black/60 hover:!border-brand-yellow/50">
                        <div className="flex items-start space-x-4">
                            <div className="bg-brand-yellow/10 p-3 rounded-lg">
                                <tool.icon className="h-8 w-8 text-brand-yellow" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{tool.title}</h2>
                                <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ToolsPage;