import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getCropRotationPlan } from '../services/geminiService';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { CropRotationPlan, Crop } from '../types';
import { CROPS, SOIL_TYPES } from '../constants';
import AudioIconButton from './common/AudioIconButton';

const CropRotationPlannerPage: React.FC<{ location: string }> = ({ location }) => {
    const { t, language } = useLocalization();
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [soilType, setSoilType] = useState<string>(SOIL_TYPES[0]);
    const [result, setResult] = useState<CropRotationPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleCropToggle = (cropId: string) => {
        setSelectedCrops(prev =>
            prev.includes(cropId)
                ? prev.filter(id => id !== cropId)
                : [...prev, cropId]
        );
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
        if (selectedCrops.length === 0) {
            setError('Please select at least one crop.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const cropNames = selectedCrops.map(id => {
                const crop = CROPS.find(c => c.id === id);
                return crop ? getCropName(crop) : id;
            });
            const plan = await getCropRotationPlan(cropNames, soilType, location, language);
            if (plan) {
                setResult(plan);
            } else {
                setError('Failed to generate a plan. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while generating the plan.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('rotationPlannerTitle')}</h1>
                <p className="text-gray-300">{t('rotationPlannerSubtitle')}</p>
            </header>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormControl label={t('yourCrops')} htmlFor="crops">
                        <p className="text-xs text-gray-400 mb-2">{t('yourCropsDesc')}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CROPS.map(crop => (
                                <label key={crop.id} className={`flex items-center space-x-2 p-2 rounded-md transition-colors cursor-pointer ${selectedCrops.includes(crop.id) ? 'bg-brand-yellow/30' : 'bg-black/30'}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCrops.includes(crop.id)}
                                        onChange={() => handleCropToggle(crop.id)}
                                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-yellow focus:ring-brand-yellow"
                                    />
                                    <span className="text-sm font-medium text-white">{getCropName(crop)}</span>
                                </label>
                            ))}
                        </div>
                    </FormControl>
                    <FormControl label={t('soilType')} htmlFor="soilType">
                        <InputField as="select" id="soilType" value={soilType} onChange={e => setSoilType(e.target.value)}>
                            {SOIL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </InputField>
                    </FormControl>
                    <button type="submit" disabled={isLoading || selectedCrops.length === 0} className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-600">
                        {isLoading ? t('fetchingPlan') : t('generatePlan')}
                    </button>
                </form>
            </Card>

            {isLoading && (
                <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('fetchingPlan')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}

            {result && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center text-white">{t('rotationPlanForYou')}</h2>
                    {result.plan.map(step => (
                        <Card key={step.year}>
                            <p className="text-sm font-bold text-brand-yellow">YEAR {step.year}</p>
                            <h3 className="text-xl font-bold text-white mt-1">{step.crop}</h3>
                            <p className="text-gray-300 mt-2">{step.justification}</p>
                        </Card>
                    ))}
                     <Card title={t('planSummary')}>
                        <div className="flex justify-between items-start">
                            <p className="text-gray-300 flex-1 pr-4">{result.summary}</p>
                            <AudioIconButton textToSpeak={result.summary} />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CropRotationPlannerPage;