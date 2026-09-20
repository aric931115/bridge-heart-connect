import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettings {
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  voiceAssistant: boolean;
}

export type UserRole = 'organizer' | 'participant';

export interface UserAchievement {
  id: string;
  title: string;
  desc: string;
  unlockedAt: string;
}

export interface UserHistoryEntry {
  activityId: number;
  title: string;
  date: string;
  pointsEarned: number;
  joinedAt: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  department: string;
  avatar: string;
  role: UserRole;
  points: number;
  achievements: UserAchievement[];
  history: UserHistoryEntry[];
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  addPoints: (amount: number) => void;
  addHistoryEntry: (entry: UserHistoryEntry) => void;
  unlockAchievement: (a: UserAchievement) => void;
  updateProfile: (profile: Pick<UserProfile, 'id' | 'name' | 'department' | 'avatar'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  id: 'USR-0001',
  name: '同學',
  department: '尚未填寫科系',
  avatar: '👤',
  role: 'participant',
  points: 0,
  achievements: [],
  history: [],
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>({
    textSize: 'medium',
    highContrast: false,
    voiceAssistant: false,
  });
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateSettings = (s: Partial<AppSettings>) =>
    setSettings(prev => ({ ...prev, ...s }));

  const setRole = (role: UserRole) => setUser(u => ({ ...u, role }));
  const addPoints = (amount: number) => setUser(u => ({ ...u, points: u.points + amount }));
  const addHistoryEntry = (entry: UserHistoryEntry) =>
    setUser(u => u.history.some(historyEntry => historyEntry.activityId === entry.activityId)
      ? u
      : { ...u, history: [entry, ...u.history] });
  const unlockAchievement = (a: UserAchievement) =>
    setUser(u => u.achievements.some(x => x.id === a.id) ? u : { ...u, achievements: [a, ...u.achievements] });
  const updateProfile = (profile: Pick<UserProfile, 'id' | 'name' | 'department' | 'avatar'>) =>
    setUser(u => ({ ...u, ...profile }));

  return (
    <AppContext.Provider value={{ settings, updateSettings, user, setRole, addPoints, addHistoryEntry, unlockAchievement, updateProfile }}>
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
