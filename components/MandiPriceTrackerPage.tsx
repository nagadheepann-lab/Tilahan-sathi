import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getMandiPriceTrend } from '../services/geminiService';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { MandiPriceData, Crop } from '../types';
import { CROPS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AudioIconButton from './common/AudioIconButton';

interface MandiPriceTrackerPageProps {
    location: string;
}

const MandiPriceTrackerPage: React.FC<MandiPriceTrackerPageProps> = ({ location }) => {
    const { t, language } = useLocalization();
    const oilseedCrops = CROPS.filter(c => c.type === 'Oilseed');
    const [selectedCropId, setSelectedCropId] = useState<string>(oilseedCrops[0]?.id || '');
    const [result, setResult] = useState<MandiPriceData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

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
        if (selectedCropId) {
            const fetchTrend = async () => {
                setIsLoading(true);
                setError('');
                setResult(null);
                try {
                    const crop = CROPS.find(c => c.id === selectedCropId);
                    const cropName = crop ? getCropName(crop) : selectedCropId;
                    const data = await getMandiPriceTrend(cropName, location, language);
                    if (data) {
                        setResult(data);
                    } else {
                        setError('Failed to get price trends. Please try again.');
                    }
                } catch (err) {
                    setError('An error occurred. Please try again.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTrend();
        }
    }, [selectedCropId, location, language]);

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('mandiPriceTrackerTitle')}</h1>
                <p className="text-gray-300">{t('mandiPriceTrackerSubtitle')}</p>
            </header>

            <Card>
                <FormControl label={t('oilseedCrop')} htmlFor="crop-select">
                    <InputField as="select" id="crop-select" value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)}>
                        {oilseedCrops.map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
                    </InputField>
                </FormControl>
            </Card>

             {isLoading && (
                 <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('fetchingTrends')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {result && (
                <div className="space-y-4">
                    <Card title={t('lastSixMonths')}>
                         <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={result.trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                    <XAxis dataKey="month" tick={{ fill: '#E5E7EB' }} />
                                    <YAxis tickFormatter={(tick) => formatCurrency(tick)} tick={{ fill: '#E5E7EB' }} domain={['dataMin - 100', 'dataMax + 100']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF' }}
                                        formatter={(value: number) => [formatCurrency(value), t('pricePerQuintal')]} 
                                    />
                                    <Line type="monotone" dataKey="price" stroke="#FFC700" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <Card title={t('trendAnalysis')}>
                        <div className="flex justify-between items-start">
                            <p className="text-gray-300 flex-1 pr-4">{result.analysis}</p>
                            <AudioIconButton textToSpeak={result.analysis} />
                        </div>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default MandiPriceTrackerPage;