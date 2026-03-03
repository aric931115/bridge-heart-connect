import { useState } from 'react';
import { Search, QrCode, UserPlus, Trophy, Star, Music, Palette, BookOpen } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';

const friends = [
  { id: 1, name: '小明', avatar: '🧑', status: '在線', interests: ['music', 'art'] },
  { id: 2, name: '小華', avatar: '👩', status: '在線', interests: ['reading', 'music'] },
  { id: 3, name: '阿德', avatar: '👦', status: '離線', interests: ['art', 'star'] },
  { id: 4, name: '小芳', avatar: '👧', status: '在線', interests: ['star', 'reading'] },
];

const interestIcons: Record<string, { icon: typeof Star; label: string }> = {
  music: { icon: Music, label: '音樂' },
  art: { icon: Palette, label: '藝術' },
  reading: { icon: BookOpen, label: '閱讀' },
  star: { icon: Star, label: '明星' },
};

type View = 'list' | 'add' | 'profile' | 'achievements';

const Social = () => {
  const [view, setView] = useState<View>('list');
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [searchId, setSearchId] = useState('');

  if (view === 'add') {
    return (
      <div className="pb-24">
        <PageHeader title="加入好友" showBack />
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="font-bold text-lg">輸入好友 ID</label>
            <div className="flex gap-3">
              <input
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="輸入 ID..."
                className="flex-1 min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-ring"
              />
              <button
                onClick={() => { if (searchId) toast.success('已發送好友邀請！'); }}
                className="accessible-btn bg-primary text-primary-foreground px-6"
              >
                <Search size={24} />
              </button>
            </div>
          </div>
          <button
            onClick={() => toast.info('QR Code 掃描功能（原型展示）')}
            className="accessible-btn w-full bg-secondary text-secondary-foreground flex items-center justify-center gap-3"
          >
            <QrCode size={28} /> 掃描 QR Code 加好友
          </button>
        </div>
      </div>
    );
  }

  if (view === 'profile') {
    return (
      <div className="pb-24">
        <PageHeader title="好友資料" showBack />
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl">
              {selectedFriend.avatar}
            </div>
            <h2 className="text-2xl font-bold">{selectedFriend.name}</h2>
            <span className={`px-4 py-1 rounded-full font-bold text-sm ${selectedFriend.status === '在線' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
              {selectedFriend.status}
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-lg">興趣標籤</h3>
            <div className="flex flex-wrap gap-3">
              {selectedFriend.interests.map(i => {
                const info = interestIcons[i];
                if (!info) return null;
                const Icon = info.icon;
                return (
                  <div key={i} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl font-bold">
                    <Icon size={22} /> {info.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'achievements') {
    const achievements = [
      { title: '社交蝴蝶', desc: '加入 5 位好友', done: true },
      { title: '遊戲高手', desc: '完成 10 場遊戲', done: false },
      { title: '活動達人', desc: '參加 3 場活動', done: true },
    ];
    return (
      <div className="pb-24">
        <PageHeader title="成就功能" showBack />
        <div className="p-6 space-y-4">
          {achievements.map(a => (
            <div key={a.title} className={`card-accessible flex items-center gap-4 ${a.done ? '' : 'opacity-50'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${a.done ? 'bg-secondary' : 'bg-muted'}`}>
                {a.done ? '🏆' : '🔒'}
              </div>
              <div>
                <div className="font-bold text-lg">{a.title}</div>
                <div className="text-muted-foreground">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="社交" />
      <div className="p-4 space-y-4">
        <div className="flex gap-3">
          <button onClick={() => setView('add')} className="accessible-btn flex-1 bg-primary text-primary-foreground flex items-center justify-center gap-2">
            <UserPlus size={24} /> 加好友
          </button>
          <button onClick={() => setView('achievements')} className="accessible-btn flex-1 bg-secondary text-secondary-foreground flex items-center justify-center gap-2">
            <Trophy size={24} /> 成就
          </button>
        </div>
        <h2 className="font-bold text-lg pt-2">好友列表</h2>
        {friends.map(f => (
          <button
            key={f.id}
            onClick={() => { setSelectedFriend(f); setView('profile'); }}
            className="card-accessible w-full flex items-center gap-4 text-left"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-3xl flex-shrink-0">
              {f.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg">{f.name}</div>
              <span className={`text-sm font-bold ${f.status === '在線' ? 'text-success' : 'text-muted-foreground'}`}>
                {f.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Social;
