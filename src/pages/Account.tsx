import { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, Eye, EyeOff, ArrowRight, Trophy, Coins, History } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useAppContext } from '@/contexts/AppContext';

type View = 'main' | 'login' | 'signup' | 'forgot' | 'changePw' | 'career';

const Account = () => {
  const [view, setView] = useState<View>('main');
  const [showPw, setShowPw] = useState(false);
  const { user } = useAppContext();

  useVoiceAssistant(
    view === 'main' ? `帳戶管理。目前身份：${user.role === 'organizer' ? '活動發起者' : '參與者'}，累積${user.points}積分。`
    : view === 'login' ? '登入頁面。請輸入學校信箱和密碼。'
    : view === 'signup' ? '註冊頁面。請輸入學校信箱和密碼。'
    : view === 'forgot' ? '找回密碼頁面。'
    : view === 'career' ? '個人生涯頁面，查看歷史參與與成就。'
    : '更改密碼頁面。'
  );

  if (view === 'career') {
    return (
      <div className="pb-24">
        <PageHeader title="我的生涯" showBack />
        <div className="p-4 space-y-5">
          <div className="card-accessible bg-primary text-primary-foreground flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Coins size={32} />
            </div>
            <div>
              <p className="text-sm opacity-80">累積積分</p>
              <p className="text-3xl font-bold">{user.points}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2"><Trophy size={20} /> 歷史成就</h2>
            {user.achievements.map(a => (
              <div key={a.id} className="card-accessible flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">🏆</div>
                <div className="flex-1">
                  <p className="font-bold">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.unlockedAt}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2"><History size={20} /> 歷史參與紀錄</h2>
            {user.history.map(h => (
              <div key={h.activityId} className="card-accessible flex items-center justify-between">
                <div>
                  <p className="font-bold">{h.title}</p>
                  <p className="text-sm text-muted-foreground">完成於 {h.completedAt}</p>
                </div>
                <span className="text-primary font-bold">+{h.pointsEarned}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="pb-24">
        <PageHeader title="登入" showBack />
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="font-bold">學校信箱</label>
            <input placeholder="student@school.edu.tw" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="font-bold">密碼</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="輸入密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 pr-14 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="顯示密碼">
                {showPw ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          <button onClick={() => toast.success('登入成功！')} className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-2">
            <LogIn size={24} /> 登入
          </button>
          <button onClick={() => setView('forgot')} className="w-full text-center text-primary font-bold py-2 active:opacity-70">
            忘記密碼？
          </button>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="pb-24">
        <PageHeader title="註冊" showBack />
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="font-bold">學校信箱</label>
            <input placeholder="student@school.edu.tw" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="font-bold">密碼</label>
            <input type="password" placeholder="設定密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          </div>
          <button onClick={() => toast.success('已發送驗證信至您的信箱！')} className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-2">
            <Mail size={24} /> 發送驗證信
          </button>
        </div>
      </div>
    );
  }

  if (view === 'forgot') {
    return (
      <div className="pb-24">
        <PageHeader title="找回密碼" showBack />
        <div className="p-6 space-y-5">
          <p className="text-muted-foreground text-lg">輸入您的學校信箱，我們將發送驗證碼給您。</p>
          <input placeholder="student@school.edu.tw" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          <button onClick={() => toast.success('驗證碼已發送！')} className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-2">
            <Mail size={24} /> 發送驗證碼
          </button>
        </div>
      </div>
    );
  }

  if (view === 'changePw') {
    return (
      <div className="pb-24">
        <PageHeader title="更改密碼" showBack />
        <div className="p-6 space-y-5">
          <input type="password" placeholder="目前密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          <div className="flex items-center justify-center text-muted-foreground"><ArrowRight size={28} /></div>
          <input type="password" placeholder="新密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          <button onClick={() => toast.success('密碼已更新！')} className="accessible-btn w-full bg-primary text-primary-foreground">
            確認更改
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="帳戶管理" />
      <div className="p-6 space-y-5">
        {/* 個人資料卡 */}
        <div className="card-accessible flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">👤</div>
          <div className="flex-1">
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">ID：{user.id}</p>
            <p className="text-sm font-bold text-primary">💎 {user.points} 積分</p>
          </div>
        </div>

        <button onClick={() => setView('career')} className="accessible-btn w-full bg-secondary text-secondary-foreground flex items-center justify-center gap-3">
          <Trophy size={24} /> 我的生涯
        </button>
        <button onClick={() => setView('login')} className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-3">
          <LogIn size={24} /> 登入
        </button>
        <button onClick={() => setView('signup')} className="accessible-btn w-full border-2 border-border text-foreground flex items-center justify-center gap-3">
          <UserPlus size={24} /> 註冊
        </button>
        <button onClick={() => setView('changePw')} className="accessible-btn w-full border-2 border-border text-foreground flex items-center justify-center gap-3">
          <KeyRound size={24} /> 更改密碼
        </button>
        <button onClick={() => setView('forgot')} className="accessible-btn w-full border-2 border-border text-foreground flex items-center justify-center gap-3">
          <Mail size={24} /> 找回密碼
        </button>
      </div>
    </div>
  );
};

export default Account;
