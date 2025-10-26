import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CROPS } from '../constants';
import { Crop } from '../types';
import Card from './common/Card';
import { useLocalization } from '../hooks/useLocalization';

const ProfitabilitySimulatorPage: React.FC<{ location: string }> = ({ location }) => {
  const { t, language } = useLocalization();
  const [landSize, setLandSize] = useState<number>(5);
  const [traditionalCropId, setTraditionalCropId] = useState<string>('paddy');
  const [oilseedCropId, setOilseedCropId] = useState<string>('mustard');

  const getCropName = (crop: Crop) => {
    switch(language) {
      case 'hi': return crop.localized.hi;
      case 'ta': return crop.localized.ta;
      case 'mr': return crop.localized.mr;
      case 'bn': return crop.localized.bn;
      default: return crop.name;
    }
  };

  const traditionalCrop = useMemo(() => CROPS.find(c => c.id === traditionalCropId) as Crop, [traditionalCropId]);
  const oilseedCrop = useMemo(() => CROPS.find(c => c.id === oilseedCropId) as Crop, [oilseedCropId]);

  const [yieldMultiplier, setYieldMultiplier] = useState(1);
  const [priceMultiplier, setPriceMultiplier] = useState(1);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const calculateProfit = (crop: Crop, ym: number, pm: number) => {
    const revenue = crop.avgYield * ym * crop.avgPrice * pm;
    return revenue - crop.inputCost;
  };

  const traditionalProfit = useMemo(() => calculateProfit(traditionalCrop, 1, 1), [traditionalCrop]);
  const oilseedProfit = useMemo(() => calculateProfit(oilseedCrop, yieldMultiplier, priceMultiplier), [oilseedCrop, yieldMultiplier, priceMultiplier]);
  
  const totalTraditionalProfit = traditionalProfit * landSize;
  const totalOilseedProfit = oilseedProfit * landSize;
  const profitDifference = totalOilseedProfit - totalTraditionalProfit;

  const chartData = [
    { name: getCropName(traditionalCrop), Profit: traditionalProfit },
    { name: getCropName(oilseedCrop), Profit: oilseedProfit },
  ];
    
  const profitSummaryText = t('profitSummary')
    .replace('{oilseedCrop}', getCropName(oilseedCrop))
    .replace('{traditionalCrop}', getCropName(traditionalCrop))
    .replace('{changeType}', profitDifference >= 0 ? t('increase') : t('decrease'))
    .replace('{amount}', formatCurrency(Math.abs(profitDifference)))
    .replace('{landSize}', landSize.toString());
    
  const inputStyles = "mt-1 block w-full rounded-md border-white/20 bg-black/30 text-white shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2";

  return (
    <div className="p-4 space-y-6">
       <header className="text-center">
            <h1 className="text-3xl font-bold text-white">{t('profitSimulator')}</h1>
            <p className="text-gray-300">{t('profitSimulatorDesc')}</p>
        </header>
      
      <Card title={t('comparativeEconomics')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('landSizeAcres')}</label>
            <input type="number" value={landSize} onChange={e => setLandSize(Number(e.target.value))} className={inputStyles}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('traditionalCrop')}</label>
            <select value={traditionalCropId} onChange={e => setTraditionalCropId(e.target.value)} className={inputStyles}>
              {CROPS.filter(c => c.type === 'Traditional').map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('oilseedCrop')}</label>
            <select value={oilseedCropId} onChange={e => setOilseedCropId(e.target.value)} className={inputStyles}>
              {CROPS.filter(c => c.type === 'Oilseed').map(c => <option key={c.id} value={c.id}>{getCropName(c)}</option>)}
            </select>
          </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="name" tick={{ fill: '#E5E7EB' }} />
              <YAxis tickFormatter={(tick) => formatCurrency(tick)} tick={{ fill: '#E5E7EB' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF' }}
                formatter={(value: number) => [formatCurrency(value), t('profitPerAcre')]} 
               />
              <Legend wrapperStyle={{ color: '#FFFFFF' }}/>
              <Bar dataKey="Profit" fill="#3A9D86" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center p-3 bg-brand-yellow/10 border border-brand-yellow/20 rounded-lg">
            <p className="text-base font-semibold text-yellow-200">
                {profitSummaryText}
            </p>
        </div>
      </Card>
      
      <Card title={t('profitabilitySimulator')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('yieldAdjustment')}: {Math.round(yieldMultiplier * 100)}%</label>
            <input type="range" min="0.5" max="1.5" step="0.05" value={yieldMultiplier} onChange={e => setYieldMultiplier(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-yellow"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('marketPriceAdjustment')}: {Math.round(priceMultiplier * 100)}%</label>
            <input type="range" min="0.5" max="1.5" step="0.05" value={priceMultiplier} onChange={e => setPriceMultiplier(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-yellow"/>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfitabilitySimulatorPage;