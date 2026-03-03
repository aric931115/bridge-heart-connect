import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

/**
 * Auto-reads the provided text when voice assistant is enabled.
 * Call this hook in any page to announce content on mount.
 */
export const useVoiceAssistant = (text: string) => {
  const { settings } = useAppContext();

  useEffect(() => {
    if (!settings.voiceAssistant || !text) return;
    if (!('speechSynthesis' in window)) return;

    // Small delay so the page renders first
    const timer = setTimeout(() => {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }, 400);

    return () => {
      clearTimeout(timer);
      speechSynthesis.cancel();
    };
  }, [settings.voiceAssistant, text]);
};
