import React from 'react';
import Card from './common/Card';
import { MARKET_PRICES } from '../constants';
import { useLocalization } from '../hooks/useLocalization';
import { MarketPrice } from '../types';

const MarketPrices: React.FC = () => {
    const { t, language } = useLocalization();
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

    const getCropName = (item: MarketPrice) => {
        switch(language) {
          case 'hi': return item.localized.hi;
          case 'ta': return item.localized.ta;
          case 'mr': return item.localized.mr;
          case 'bn': return item.localized.bn;
          default: return item.name;
        }
    };

    const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        const trendText = t(trend);
        switch (trend) {
            case 'up':
                return (
                    <div className="flex items-center font-semibold text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4l-8 8h16l-8-8z" />
                        </svg>
                        <span>{trendText}</span>
                    </div>
                );
            case 'down':
                return (
                     <div className="flex items-center font-semibold text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 20l-8-8h16l-8 8z" />
                        </svg>
                         <span>{trendText}</span>
                    </div>
                );
            case 'stable':
                return (
                    <div className="flex items-center font-semibold text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 11h16v2H4z" />
                        </svg>
                        <span>{trendText}</span>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <Card title={t('liveMarketPrices')}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-200 uppercase bg-white/5">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('crop')}</th>
                            <th scope="col" className="px-6 py-3">{t('pricePerQuintal')}</th>
                            <th scope="col" className="px-6 py-3">{t('trend')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MARKET_PRICES.map((item) => (
                            <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{getCropName(item)}</th>
                                <td className="px-6 py-4 font-semibold">{formatCurrency(item.price)}</td>
                                <td className="px-6 py-4">{renderTrendIcon(item.trend)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MarketPrices;