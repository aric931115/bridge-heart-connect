import { useState } from 'react';
import { QrCode, Plus, Hand, Image, Keyboard, Gamepad2, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useActivities } from '@/hooks/useActivities';

type View = 'main' | 'join' | 'create';

const Games = () => {
  const [view, setView] = useState<View>('main');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const { joinByCode } = useActivities();

  const voiceText = view === 'main' ? '遊玩頁面。你可以選擇加入房間、創建房間或建立新活動。'
    : view === 'join' ? '加入房間頁面。可以掃描 QR Code 或輸入房間代碼。'
    : '創建房間頁面。可以選擇遊戲模式。';
  useVoiceAssistant(voiceText);

  const handleJoinByCode = () => {
    if (!roomCode.trim()) {
      toast.error('請輸入房間代碼');
      return;
    }
    const activity = joinByCode(roomCode.trim());
    if (activity) {
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

  if (view === 'create') {
    return (
      <div className="pb-24">
        <PageHeader title="創建房間" showBack />
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground text-lg">選擇遊戲模式：</p>
          <button
            onClick={() => toast.success('已創建「簡單手勢任務」房間！')}
            className="accessible-btn w-full bg-primary text-primary-foreground flex items-center gap-4 px-6"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Hand size={32} />
            </div>
            <div className="text-left">
              <div className="text-lg">簡單手勢任務</div>
              <div className="text-sm opacity-80 font-normal">模仿手勢，完成挑戰！</div>
            </div>
          </button>
          <button
            onClick={() => toast.success('已創建「圖像配對遊戲」房間！')}
            className="accessible-btn w-full bg-secondary text-secondary-foreground flex items-center gap-4 px-6"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
              <Image size={32} />
            </div>
            <div className="text-left">
              <div className="text-lg">圖像配對遊戲</div>
              <div className="text-sm opacity-70 font-normal">找到相同的圖片配對！</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="遊玩" />
      <div className="p-6 space-y-5">
        <button
          onClick={() => setView('join')}
          className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-3 py-8 text-xl"
        >
          <Keyboard size={36} /> 加入房間
        </button>
        <button
          onClick={() => setView('create')}
          className="accessible-btn w-full bg-secondary text-secondary-foreground flex items-center justify-center gap-3 py-8 text-xl"
        >
          <Gamepad2 size={36} /> 創建房間
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
