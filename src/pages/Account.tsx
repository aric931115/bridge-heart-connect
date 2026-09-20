import { FormEvent, useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, Eye, EyeOff, ArrowRight, Trophy, Coins, History, Save } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useAppContext } from '@/contexts/AppContext';
import { useActivities } from '@/hooks/useActivities';

type View = 'main' | 'login' | 'signup' | 'forgot' | 'changePw' | 'career' | 'profile';

const Account = () => {
  const [view, setView] = useState<View>('main');
  const [showPw, setShowPw] = useState(false);
  const { user, updateProfile } = useAppContext();
  const { activities } = useActivities();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  useVoiceAssistant(
    view === 'main' ? `帳戶管理。目前身份：${user.role === 'organizer' ? '活動發起者' : '參與者'}，累積${user.points}積分。`
    : view === 'login' ? '登入頁面。請輸入學校信箱和密碼。'
    : view === 'signup' ? '註冊頁面。請輸入學校信箱和密碼。'
    : view === 'forgot' ? '找回密碼頁面。'
    : view === 'career' ? '個人生涯頁面，查看歷史參與與成就。'
    : view === 'profile' ? '編輯個人資料。'
    : '更改密碼頁面。'
  );

  if (view === 'career') {
    const sortedHistory = [...user.history].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
    const selectedHistory = sortedHistory.find((entry, index) => `${entry.activityId}-${index}` === selectedHistoryId);
    const selectedActivity = selectedHistory ? activities.find(activity => activity.id === selectedHistory.activityId) : undefined;
    return (
      <div className="pb-24">
        <PageHeader title="我的生涯" showBack />
        <div className="p-4 space-y-5">
          <div className="card-accessible bg-secondary text-foreground flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
              <Coins size={32} />
            </div>
            <div>
              <p className="text-sm opacity-80">總積分</p>
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
            {sortedHistory.length === 0 ? (
              <div className="card-accessible text-center space-y-3">
                <p className="font-bold">還沒參加活動嗎？快去參加吧！</p>
                <button onClick={() => window.history.back()} className="text-primary font-bold">返回</button>
              </div>
            ) : sortedHistory.map((h, index) => (
              <div key={`${h.activityId}-${index}`} className={`rounded-2xl ${h.completed ? '' : 'bg-slate-300/80 dark:bg-slate-700/80 p-1'}`}>
                <button
                  onClick={() => setSelectedHistoryId(selectedHistoryId === `${h.activityId}-${index}` ? null : `${h.activityId}-${index}`)}
                  className={`card-accessible w-full flex items-center justify-between text-left ${h.completed ? '' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div>
                    <p className="font-bold">{h.title}</p>
                    <p className="text-sm text-muted-foreground">參加日期：{h.joinedAt}</p>
                    {h.completed && <p className="text-xs font-bold text-primary">已完成</p>}
                    {!h.completed && <p className="text-xs font-bold text-slate-600 dark:text-slate-300">尚未完成</p>}
                  </div>
                  <span className="text-primary font-bold">+{h.pointsEarned}</span>
                </button>
                {selectedHistoryId === `${h.activityId}-${index}` && selectedActivity && (
                  <div className="px-4 pb-4 pt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">活動時間：{selectedActivity.date}{selectedActivity.endDate !== selectedActivity.date ? `–${selectedActivity.endDate}` : ''} {selectedActivity.startTime}–{selectedActivity.endTime}</p>
                    <p className="text-sm text-muted-foreground">活動地點：{selectedActivity.location}</p>
                    <p className="text-xs text-muted-foreground">僅供查看歷史活動資訊，不能重新進入任務房間。</p>
                  </div>
                )}
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

  if (view === 'profile') {
    const saveProfile = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = String(form.get('name') || '').trim();
      const id = String(form.get('id') || '').trim();
      const department = String(form.get('department') || '').trim();
      if (!name || Array.from(name).length > 10 || !/^[\u4e00-\u9fffA-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~ ]+$/.test(name)) {
        toast.error('名字不可空白，且最多 10 個字，只能使用中英文、數字或符號。');
        return;
      }
      if (!/^[A-Za-z0-9]{1,7}$/.test(id)) {
        toast.error('ID 必須是 1 至 7 個英文或數字，不可包含符號。');
        return;
      }
      updateProfile({ name, id, department, avatar: avatarPreview });
      toast.success('個人資料已更新');
      setView('main');
    };
    return (
      <div className="pb-24">
        <PageHeader title="編輯個人資料" showBack />
        <form onSubmit={saveProfile} className="p-6 space-y-5">
          {[
            ['name', '名字', user.name, '最多 10 個字，可使用中文、英文、數字與符號'],
            ['id', 'ID', user.id, '最多 7 個字，只能使用英文與數字'],
            ['department', '科系', user.department, '例如：資訊工程學系'],
          ].map(([field, label, value, hint]) => (
            <div key={field} className="space-y-2">
              <label className="font-bold">{label}</label>
              <input name={field} defaultValue={value} className="w-full min-h-[52px] rounded-2xl border-2 border-input bg-background px-4 text-lg focus:outline-none focus:ring-4 focus:ring-ring" />
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
          <div className="space-y-2">
            <label className="font-bold">頭像圖片</label>
            <div className="flex items-center gap-4">
              {avatarPreview.startsWith('data:image/') || avatarPreview.startsWith('http')
                ? <img src={avatarPreview} alt="目前頭像" className="h-20 w-20 rounded-full object-cover bg-muted" />
                : <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-3xl">{avatarPreview}</span>}
              <input
                type="file"
                accept="image/*"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    toast.error('請選擇圖片檔。');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setAvatarPreview(String(reader.result));
                  reader.readAsDataURL(file);
                }}
                className="min-w-0 flex-1 text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">可上傳 JPG、PNG、GIF 等圖片格式。</p>
          </div>
          <button type="submit" className="accessible-btn w-full bg-primary text-primary-foreground flex items-center justify-center gap-2">
            <Save size={22} /> 儲存個人資料
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="帳戶管理" />
      <div className="p-6 space-y-5">
        {/* 個人資料卡 */}
        <button onClick={() => setView('profile')} className="card-accessible flex items-center gap-4 w-full text-left">
          {user.avatar.startsWith('data:image/') || user.avatar.startsWith('http')
            ? <img src={user.avatar} alt="個人頭像" className="h-16 w-16 rounded-full object-cover bg-muted" />
            : <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">{user.avatar}</div>}
          <div className="flex-1">
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">ID：{user.id}</p>
            <p className="text-sm font-bold text-primary">💎 {user.points} 積分</p>
            <span className="text-primary text-sm font-bold">編輯</span>
            </div>
          </button>

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
