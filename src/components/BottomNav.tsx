import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Gamepad2, Users, UserCircle, Settings } from 'lucide-react';

const tabs = [
  { path: '/activities', label: '活動', icon: Calendar },
  { path: '/games', label: '遊玩', icon: Gamepad2 },
  { path: '/social', label: '社交', icon: Users },
  { path: '/account', label: '帳戶', icon: UserCircle },
  { path: '/settings', label: '設定', icon: Settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border safe-area-bottom">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-150 active:scale-90
                ${active 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={28} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
