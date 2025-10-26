import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getFertilizerRecommendations } from '../services/geminiService';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { FertilizerRecommendation, Crop } from '../types';
import { CROPS } from '../constants';
import AudioIconButton from './common/AudioIconButton';

const FertilizerCalculatorPage: React.FC = () => {
    const { t, language } = useLocalization();
    const oilseedCrops = CROPS.filter(c => c.type === 'Oilseed');

    const [cropId, setCropId] = useState<string>(oilseedCrops[0]?.id || '');
    const [landSize, setLandSize] = useState<number>(1);
    const [result, setResult] = useState<FertilizerRecommendation | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const crop = CROPS.find(c => c.id === cropId);
            const cropName = crop ? getCropName(crop) : cropId;
            const recommendations = await getFertilizerRecommendations(cropName, landSize, language);
            if (recommendations) {
                setResult(recommendations);
            } else {
                setError('Failed to get recommendations. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getSummaryForTTS = (res: FertilizerRecommendation | null): string => {
        if (!res) return "";
        const parts = res.recommendations.map(r => `${r.fertilizer}: ${r.amount}`).join(', ');
        return `Recommendations are: ${parts}. Advice: ${res.advice}`;
    };

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('fertilizerCalculator')}</h1>
                <p className="text-gray-300">{t('fertilizerCalculatorDesc')}</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormControl label={t('oilseedCrop')} htmlFor="cropId">
                            <InputField as="select" id="cropId" name="cropId" value={cropId} onChange={e => setCropId(e.target.value)}>
                                {oilseedCrops.map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
                            </InputField>
                        </FormControl>
                        <FormControl label={t('landSizeAcres')} htmlFor="landSize">
                            <InputField type="number" id="landSize" name="landSize" value={landSize} onChange={e => setLandSize(Number(e.target.value))} min="0.1" step="0.1" />
                        </FormControl>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-600">
                        {isLoading ? t('fetchingRecs') : t('calculateFertilizer')}
                    </button>
                </form>
            </Card>
            
            {isLoading && (
                 <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('fetchingRecs')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {result && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold text-white">
                           {t('recommendedDosageFor', { landSize: landSize, cropName: getCropName(CROPS.find(c=>c.id === cropId)!) })}
                       </h2>
                       <AudioIconButton textToSpeak={async () => getSummaryForTTS(result)} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-200 uppercase bg-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('fertilizer')}</th>
                                    <th scope="col" className="px-6 py-3">{t('amount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.recommendations.map((rec, index) => (
                                    <tr key={index} className="border-b border-white/10">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{rec.fertilizer}</th>
                                        <td className="px-6 py-4 font-semibold">{rec.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <h3 className="font-bold text-white mb-2">{t('applicationAdvice')}</h3>
                        <p className="text-gray-300">{result.advice}</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default FertilizerCalculatorPage;