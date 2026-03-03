import { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';

type View = 'main' | 'login' | 'signup' | 'forgot' | 'changePw';

const Account = () => {
  const [view, setView] = useState<View>('main');
  const [showPw, setShowPw] = useState(false);

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
          <p className="text-muted-foreground text-center">請使用學校信箱註冊，並完成信箱驗證。</p>
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
          <div className="space-y-2">
            <label className="font-bold">目前密碼</label>
            <input type="password" placeholder="輸入目前密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          </div>
          <div className="flex items-center justify-center text-muted-foreground">
            <ArrowRight size={28} />
          </div>
          <div className="space-y-2">
            <label className="font-bold">新密碼</label>
            <input type="password" placeholder="輸入新密碼" className="w-full min-h-[60px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
          </div>
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
        <button onClick={() => setView('login')} className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-3 py-7 text-xl">
          <LogIn size={32} /> 登入
        </button>
        <button onClick={() => setView('signup')} className="accessible-btn w-full bg-secondary text-secondary-foreground flex items-center justify-center gap-3 py-7 text-xl">
          <UserPlus size={32} /> 註冊
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
