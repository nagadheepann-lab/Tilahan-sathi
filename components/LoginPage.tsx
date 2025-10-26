import React, { useState } from 'react';
import Card from './common/Card';
import FormControl from './common/FormControl';
import InputField from './common/InputField';
import { useLocalization } from '../hooks/useLocalization';
import { INDIAN_STATES } from '../constants';
import { Language } from '../types';

interface LoginPageProps {
  onLogin: (name: string, language: Language, location: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [location, setLocation] = useState('Gujarat');
  const { t, setLanguage: setGlobalLanguage } = useLocalization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, language, location);
    }
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLang = e.target.value as Language;
      setLanguage(newLang);
      setGlobalLanguage(newLang);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full animate-fade-in-up">
        <Card>
          <div className="text-center text-white">
             <h1 className="text-3xl font-bold">{t('loginTitle')}</h1>
             <p className="text-gray-300 mt-1">{t('loginSubtitle')}</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormControl label={t('name')} htmlFor="name">
              <InputField
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('namePlaceholder')}
              />
            </FormControl>
            <FormControl label={t('language')} htmlFor="language">
              <InputField
                as="select"
                id="language"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </InputField>
            </FormControl>
            <FormControl label={t('location')} htmlFor="location">
              <InputField
                as="select"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </InputField>
            </FormControl>
            <div>
              <button
                type="submit"
                className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-500 disabled:opacity-50"
                disabled={!name.trim()}
              >
                {t('login')}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;