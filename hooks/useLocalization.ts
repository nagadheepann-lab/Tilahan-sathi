import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { localizedStrings, Language, LocalizationContextType, StringKey } from '../types';

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode, initialLanguage?: Language }> = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage || 'en');
  
  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const t = (key: StringKey, replacements?: { [key: string]: string | number }): string => {
    let str = localizedStrings[language][key] || localizedStrings.en[key];
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        const value = replacements[rKey];
        str = str.replace(new RegExp(`\\{${rKey}\\}`, 'g'), String(value));
      });
    }
    return str;
  };

  return React.createElement(
    LocalizationContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LanguageProvider');
  }
  return context;
};