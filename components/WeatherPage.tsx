import React from 'react';
import Card from './common/Card';
import { WEATHER_DATA } from '../constants';
import { useLocalization } from '../hooks/useLocalization';

interface WeatherPageProps {
    location: string;
}

const WeatherPage: React.FC<WeatherPageProps> = ({ location }) => {
    const { t } = useLocalization();
    const weather = WEATHER_DATA[location] || WEATHER_DATA['Gujarat'];

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('weatherForecast')}</h1>
                <p className="text-gray-300">{t('weatherAdvisoryFor').replace('{location}', location)}</p>
            </header>

            <Card>
                <div className="flex flex-col items-center text-center space-y-4 p-4">
                    <div className="text-8xl">{weather.icon}</div>
                    <div>
                        <p className="text-5xl font-bold text-white">{weather.temp}</p>
                        <p className="text-2xl text-gray-300">{weather.condition}</p>
                    </div>
                </div>
            </Card>

            <Card title="Advisory">
                 <p className="text-gray-200">{weather.advisory}</p>
            </Card>

            {/* In a real app, this would be dynamic data */}
            <Card title="5-Day Forecast">
                <div className="flex justify-between text-center">
                    <div className="space-y-1">
                        <p className="font-semibold">Mon</p>
                        <p className="text-3xl">☀️</p>
                        <p>35°C</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">Tue</p>
                        <p className="text-3xl">⛅️</p>
                        <p>34°C</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">Wed</p>
                        <p className="text-3xl">🌦️</p>
                        <p>32°C</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">Thu</p>
                        <p className="text-3xl">☀️</p>
                        <p>36°C</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">Fri</p>
                        <p className="text-3xl">☀️</p>
                        <p>37°C</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WeatherPage;