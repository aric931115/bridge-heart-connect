import { Volume2, MapPin, Clock, Users, Gamepad2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Link } from 'react-router-dom';
import { useActivities } from '@/hooks/useActivities';

const Activities = () => {
  const { activities } = useActivities();

  useVoiceAssistant(`校園活動頁面。共有${activities.length}個活動：${activities.map(e => e.title).join('、')}。`);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW';
      u.rate = 0.9;
      speechSynthesis.speak(u);
      toast.success('正在朗讀中...');
    } else {
      toast.error('您的瀏覽器不支援語音功能');
    }
  };

  return (
    <div className="pb-24">
      <PageHeader title="校園活動" />
      <div className="p-4 space-y-4">
        <div className="bg-secondary text-secondary-foreground rounded-2xl p-4 font-bold text-center text-lg">
          📢 最新公告：園遊會攤位報名延長至3月10日！
        </div>

        {activities.map(e => (
          <Link
            key={e.id}
            to={`/activities/${e.id}`}
            className="card-accessible space-y-3 block"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">{e.title}</h2>
                {e.quiz.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-1">
                    <Gamepad2 size={12} /> 含問答挑戰
                  </span>
                )}
              </div>
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  speak(`${e.title}。${e.desc}。時間：${e.date}。地點：${e.location}`);
                }}
                className="w-12 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
                aria-label={`朗讀 ${e.title}`}
              >
                <Volume2 size={24} />
              </button>
            </div>
            <p className="text-muted-foreground">{e.desc}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={16} />{e.date}</span>
              <span className="flex items-center gap-1"><MapPin size={16} />{e.location}</span>
              <span className="flex items-center gap-1"><Users size={16} />{e.participants} 人已加入</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Activities;
