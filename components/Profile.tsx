import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { User } from '../types';
import Card from './common/Card';
import { BADGES } from '../constants';

interface ProfileProps {
    user: User;
    onLogout: () => void;
    unlockedBadges: string[];
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, unlockedBadges }) => {
    const { t } = useLocalization();

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-300">Manage your account details.</p>
            </header>
            <Card>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400">{t('name')}</p>
                        <p className="text-lg text-white font-semibold">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">{t('location')}</p>
                        <p className="text-lg text-white font-semibold">{user.location}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">{t('language')}</p>
                        <p className="text-lg text-white font-semibold">{user.language.toUpperCase()}</p>
                    </div>
                </div>
            </Card>

            <Card title={t('myBadges')}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 text-center">
                    {BADGES.map(badge => {
                        const isUnlocked = unlockedBadges.includes(badge.cropId);
                        return (
                            <div key={badge.id} className="flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 transition-all duration-300 ${isUnlocked ? 'bg-brand-yellow/20' : 'bg-gray-700'}`}>
                                    <span className={!isUnlocked ? 'filter grayscale opacity-50' : ''}>
                                        {badge.id === 'mustard-master' ? '🏆' : badge.id === 'groundnut-guru' ? '🥜' : '🌱'}
                                    </span>
                                </div>
                                <p className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</p>
                            </div>
                        )
                    })}
                </div>
            </Card>

            <Card>
                <button
                    onClick={onLogout}
                    className="w-full bg-red-600/80 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </Card>
        </div>
    );
};

export default Profile;