import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getSoilRecommendations, getSoilAnalysisSummary } from '../services/geminiService';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { SoilData, SoilAnalysisResult, Crop } from '../types';
import { CROPS } from '../constants';
import AudioIconButton from './common/AudioIconButton';

const SoilPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [soilData, setSoilData] = useState<SoilData>({
        ph: 7.0,
        nitrogen: 'Medium',
        phosphorus: 'Medium',
        potassium: 'Medium',
        organicMatter: 1.5,
        targetCrop: 'mustard',
    });
    const [result, setResult] = useState<SoilAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const oilseedCrops = CROPS.filter(c => c.type === 'Oilseed');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSoilData(prev => ({ ...prev, [name]: name === 'ph' || name === 'organicMatter' ? parseFloat(value) : value }));
    };

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
            const crop = CROPS.find(c => c.id === soilData.targetCrop);
            const cropName = crop ? getCropName(crop) : soilData.targetCrop;
            const analysis = await getSoilRecommendations({...soilData, targetCrop: cropName}, language);

            if (analysis) {
                setResult(analysis);
            } else {
                setError(t('soilAnalysisError'));
            }
        } catch (err) {
            setError(t('soilAnalysisError'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('soilAnalysisTitle')}</h1>
                <p className="text-gray-300">{t('soilAnalysisSubtitle')}</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormControl label={t('targetCrop')} htmlFor="targetCrop">
                            <InputField as="select" id="targetCrop" name="targetCrop" value={soilData.targetCrop} onChange={handleInputChange}>
                                {oilseedCrops.map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
                            </InputField>
                        </FormControl>
                         <FormControl label={`${t('phLevel')} (0-14)`} htmlFor="ph">
                            <InputField type="number" id="ph" name="ph" value={soilData.ph} onChange={handleInputChange} step="0.1" min="0" max="14" />
                        </FormControl>
                        <FormControl label={`${t('organicMatter')} (%)`} htmlFor="organicMatter">
                            <InputField type="number" id="organicMatter" name="organicMatter" value={soilData.organicMatter} onChange={handleInputChange} step="0.1" min="0" max="10" />
                        </FormControl>
                        <FormControl label={t('nitrogenLevel')} htmlFor="nitrogen">
                            <InputField as="select" id="nitrogen" name="nitrogen" value={soilData.nitrogen} onChange={handleInputChange}>
                                <option value="Low">{t('low')}</option>
                                <option value="Medium">{t('medium')}</option>
                                <option value="High">{t('high')}</option>
                            </InputField>
                        </FormControl>
                        <FormControl label={t('phosphorusLevel')} htmlFor="phosphorus">
                             <InputField as="select" id="phosphorus" name="phosphorus" value={soilData.phosphorus} onChange={handleInputChange}>
                                <option value="Low">{t('low')}</option>
                                <option value="Medium">{t('medium')}</option>
                                <option value="High">{t('high')}</option>
                            </InputField>
                        </FormControl>
                        <FormControl label={t('potassiumLevel')} htmlFor="potassium">
                             <InputField as="select" id="potassium" name="potassium" value={soilData.potassium} onChange={handleInputChange}>
                                <option value="Low">{t('low')}</option>
                                <option value="Medium">{t('medium')}</option>
                                <option value="High">{t('high')}</option>
                            </InputField>
                        </FormControl>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-600">
                        {isLoading ? t('analyzing') : t('analyzeSoil')}
                    </button>
                </form>
            </Card>

            {isLoading && (
                 <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('analyzing')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}

            {result && (
                <div className="space-y-4">
                    <Card>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Your Soil Recommendations</h2>
                            <AudioIconButton textToSpeak={() => getSoilAnalysisSummary(result, language)} />
                        </div>
                    </Card>
                    <Card title={t('fertilizerRecs')}>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {result.fertilizerRecs.map((rec, index) => <li key={`fert-${index}`}>{rec}</li>)}
                        </ul>
                    </Card>
                    <Card title={t('amendmentRecs')}>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                           {result.amendmentRecs.map((rec, index) => <li key={`amend-${index}`}>{rec}</li>)}
                        </ul>
                    </Card>
                    <Card title={t('generalAdvice')}>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                           {result.generalAdvice.map((rec, index) => <li key={`advice-${index}`}>{rec}</li>)}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SoilPage;