import { useState } from 'react';
import { QrCode, Plus, Hand, Image, ArrowLeft, Keyboard } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';

type View = 'main' | 'join' | 'create';

const Games = () => {
  const [view, setView] = useState<View>('main');
  const [roomCode, setRoomCode] = useState('');

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
                onChange={e => setRoomCode(e.target.value)}
                placeholder="輸入代碼..."
                className="flex-1 min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-ring"
              />
              <button
                onClick={() => { if (roomCode) toast.success(`已加入房間 ${roomCode}！`); }}
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
      <div className="p-6 space-y-6">
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
          <Plus size={36} /> 創建房間
        </button>
      </div>
    </div>
  );
};

export default Games;
