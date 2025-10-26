import React, { useState } from 'react';
import { SCHEMES } from '../constants';
import Card from './common/Card';
import { useLocalization } from '../hooks/useLocalization';

const Schemes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLocalization();

  const filteredSchemes = SCHEMES.filter(scheme =>
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">{t('schemesTitle')}</h1>
        <p className="text-gray-300">{t('schemesSubtitle')}</p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('searchSchemes')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-white/20 bg-black/30 rounded-lg shadow-sm focus:ring-brand-yellow focus:border-brand-yellow text-white placeholder-gray-400"
        />
      </div>

      <div className="space-y-4">
        {filteredSchemes.map(scheme => (
          <Card key={scheme.id}>
            <h2 className="text-xl font-bold text-white mb-2">{scheme.name}</h2>
            <p className="text-gray-300 mb-3">{scheme.description}</p>
            <p className="text-sm text-gray-400 mb-4">
              <span className="font-semibold text-gray-200">{t('eligibility')}:</span> {scheme.eligibility}
            </p>
            <a 
              href={scheme.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block text-brand-dark bg-brand-yellow hover:bg-opacity-90 font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              {t('learnMore')}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schemes;