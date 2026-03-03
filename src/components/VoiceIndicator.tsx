import { Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const VoiceIndicator = () => {
  const { settings } = useAppContext();

  if (!settings.voiceAssistant) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-pulse">
      <Volume2 size={20} />
      <span className="text-sm font-bold">語音助手已啟用</span>
    </div>
  );
};

export default VoiceIndicator;
