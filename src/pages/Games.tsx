import { useState } from 'react';
import { QrCode, Keyboard, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useActivities } from '@/hooks/useActivities';
import { useAppContext } from '@/contexts/AppContext';

type View = 'main' | 'join';

const Games = () => {
  const [view, setView] = useState<View>('main');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const { joinByCode } = useActivities();
  const { addHistoryEntry } = useAppContext();

  const voiceText = view === 'main' ? '創造與加入頁面。你可以加入活動房間或建立新活動。'
    : '加入房間頁面。可以輸入房間代碼。';
  useVoiceAssistant(voiceText);

  const handleJoinByCode = () => {
    if (!roomCode.trim()) {
      toast.error('請輸入房間代碼');
      return;
    }
    const activity = joinByCode(roomCode.trim());
    if (activity) {
      addHistoryEntry({
        activityId: activity.id,
        title: activity.title,
        date: activity.date,
        pointsEarned: 0,
        joinedAt: new Date().toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: false,
      });
      toast.success(`已加入「${activity.title}」！`);
      navigate(`/activities/${activity.id}/room`);
    } else {
      toast.error('找不到此房間代碼，請確認後重試');
    }
  };

  if (view === 'join') {
    return (
      <div className="pb-24">
        <PageHeader title="加入房間" showBack />
        <div className="p-6 space-y-6">
          <button
            onClick={() => toast.info('QR Code 掃描功能（原型展示）')}
            className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-3 px-6"
          >
            <QrCode size={28} /> 掃描 QR Code
          </button>
          <div className="space-y-3">
            <label className="font-bold text-lg">或輸入房間代碼</label>
            <div className="flex gap-3">
              <input
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                placeholder="輸入代碼..."
                className="flex-1 min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-ring"
                maxLength={6}
              />
              <button
                onClick={handleJoinByCode}
                className="accessible-btn bg-secondary text-secondary-foreground px-6"
              >
                加入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="創造與加入" />
      <div className="p-6 space-y-5">
        <button
          onClick={() => setView('join')}
          className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-3 py-8 text-xl"
        >
          <Keyboard size={36} /> 加入房間
        </button>
        <div className="relative flex items-center py-2">
          <div className="flex-1 border-t border-border" />
          <span className="px-4 text-sm text-muted-foreground">活動連結</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <button
          onClick={() => navigate('/activities/create')}
          className="accessible-btn w-full border-2 border-dashed border-primary/40 text-primary flex items-center justify-center gap-3 py-8 text-xl hover:bg-primary/5"
        >
          <CalendarPlus size={36} /> 建立新活動
        </button>
      </div>
    </div>
  );
};

export default Games;
