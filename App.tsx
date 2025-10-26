import React, { useState } from 'react';
import { Language, NavItem, ToastMessage, User } from './types';
import { LanguageProvider } from './hooks/useLocalization';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Learn from './components/Learn';
import Schemes from './components/Schemes';
import Community from './components/Community';
import Profile from './components/Profile';
import DashboardIcon from './components/icons/DashboardIcon';
import LearnIcon from './components/icons/LearnIcon';
import SchemeIcon from './components/icons/SchemeIcon';
import CommunityIcon from './components/icons/CommunityIcon';
import ProfileIcon from './components/icons/ProfileIcon';
import ChatbotFAB from './components/ChatbotFAB';
import CropDetailsPage from './components/CropDetailsPage';
import ToolsPage from './components/ToolsPage';
import ToolsIcon from './components/icons/ToolsIcon';
import ScannerPage from './components/ScannerPage';
import SoilPage from './components/SoilPage';
import CalendarPage from './components/CalendarPage';
import ProfitabilitySimulatorPage from './components/ProfitabilitySimulatorPage';
import WeatherPage from './components/WeatherPage';
import CropRotationPlannerPage from './components/CropRotationPlannerPage';
import DealerLocatorPage from './components/DealerLocatorPage';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';
import Toast from './components/common/Toast';
import { useLocalization } from './hooks/useLocalization';
import FertilizerCalculatorPage from './components/FertilizerCalculatorPage';
import MandiPriceTrackerPage from './components/MandiPriceTrackerPage';
import LiveConversationPage from './components/LiveConversationPage';

const AppContent: React.FC = () => {
    const { t } = useLocalization();
    const [user, setUser] = useState<User | null>(null);
    const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
    const [cropDetailsId, setCropDetailsId] = useState<string | null>(null);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastMessage['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const handleUnlockBadge = (cropId: string) => {
        if (!unlockedBadges.includes(cropId)) {
            setUnlockedBadges(prev => [...prev, cropId]);
            addToast(t('badgeUnlocked'), 'success');
        }
    };

    const handleLogin = (name: string, language: Language, location: string) => {
        setUser({ name, language, location });
    };

    const handleLogout = () => {
        setUser(null);
        setActiveNav('dashboard');
    };

    const handleSelectCrop = (cropId: string) => {
        setCropDetailsId(cropId);
        setActiveNav('crop-details');
    };
    
    const handleBack = () => {
        const toolPages: NavItem[] = ['scanner', 'soil', 'calendar', 'profit-simulator', 'weather', 'crop-rotation', 'dealer-locator', 'fertilizer-calculator', 'mandi-price-tracker', 'live-conversation'];
        if (activeNav === 'crop-details') {
            setActiveNav('learn');
        } else if (toolPages.includes(activeNav)) {
            setActiveNav('tools');
        } else {
            setActiveNav('dashboard');
        }
        setCropDetailsId(null);
    };

    const renderContent = () => {
        if (!user) return null;

        switch (activeNav) {
            case 'dashboard': return <Dashboard location={user.location} />;
            case 'learn': return <Learn onSelectCrop={handleSelectCrop} onSelectTool={setActiveNav} />;
            case 'schemes': return <Schemes />;
            case 'community': return <Community user={user} unlockedBadges={unlockedBadges} />;
            case 'profile': return <Profile user={user} onLogout={handleLogout} unlockedBadges={unlockedBadges} />;
            case 'crop-details': return cropDetailsId && <CropDetailsPage cropId={cropDetailsId} onBack={handleBack} onUnlockBadge={handleUnlockBadge} />;
            case 'tools': return <ToolsPage onSelectTool={setActiveNav} />;
            case 'scanner': return <ScannerPage />;
            case 'soil': return <SoilPage />;
            case 'calendar': return <CalendarPage location={user.location} />;
            case 'profit-simulator': return <ProfitabilitySimulatorPage location={user.location} />;
            case 'weather': return <WeatherPage location={user.location} />;
            case 'crop-rotation': return <CropRotationPlannerPage location={user.location} />;
            case 'dealer-locator': return <DealerLocatorPage location={user.location} />;
            case 'fertilizer-calculator': return <FertilizerCalculatorPage />;
            case 'mandi-price-tracker': return <MandiPriceTrackerPage location={user.location} />;
            case 'live-conversation': return <LiveConversationPage />;
            default: return <Dashboard location={user.location} />;
        }
    };
    
    const isSubPage = ['crop-details', 'scanner', 'soil', 'calendar', 'profit-simulator', 'weather', 'crop-rotation', 'dealer-locator', 'fertilizer-calculator', 'mandi-price-tracker', 'live-conversation'].includes(activeNav);

    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.85)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    return (
        <div style={backgroundStyle} className="min-h-screen font-sans text-gray-200">
            {!user ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <div className="relative pb-20">
                   {isSubPage && (
                       <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md p-2 shadow-md">
                           <button onClick={handleBack} className="flex items-center text-white font-semibold">
                               <ArrowLeftIcon className="h-6 w-6 mr-2" />
                               Back
                           </button>
                       </header>
                   )}
                    <main className="container mx-auto max-w-4xl">{renderContent()}</main>
                    <ChatbotFAB location={user.location} />
                    <BottomNavBar activeNav={activeNav} setActiveNav={setActiveNav} />
                </div>
            )}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(x => x.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    // LanguageProvider needs to wrap the component that uses the useLocalization hook
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
};


interface BottomNavBarProps {
    activeNav: NavItem;
    setActiveNav: (nav: NavItem) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeNav, setActiveNav }) => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: DashboardIcon },
        { id: 'learn', label: 'Learn', icon: LearnIcon },
        { id: 'tools', label: 'Tools', icon: ToolsIcon },
        { id: 'community', label: 'Community', icon: CommunityIcon },
        { id