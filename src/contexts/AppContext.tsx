import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettings {
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  voiceAssistant: boolean;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>({
    textSize: 'medium',
    highContrast: false,
    voiceAssistant: false,
  });

  const updateSettings = (s: Partial<AppSettings>) =>
    setSettings(prev => ({ ...prev, ...s }));

  return (
    <AppContext.Provider value={{ settings, updateSettings }}>
      <div className={`${settings.highContrast ? 'high-contrast' : ''} text-size-${settings.textSize}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be within AppProvider');
  return ctx;
};
