import { Volume2, MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

const events = [
  { id: 1, title: '校園愛心園遊會', date: '3月15日（六）', location: '活動中心廣場', desc: '一起來參加愛心園遊會，有各種攤位和表演！' },
  { id: 2, title: '共融運動日', date: '3月20日（四）', location: '操場', desc: '適合所有同學的趣味運動會，歡迎報名！' },
  { id: 3, title: '手語工作坊', date: '3月25日（二）', location: '圖書館 B1', desc: '學習基本手語，認識聽障朋友的世界。' },
  { id: 4, title: '繪畫比賽', date: '4月1日（二）', location: '美術教室', desc: '以「友誼」為題，畫出你心中的溫暖。' },
];

const Activities = () => {
  useVoiceAssistant(`校園活動頁面。最新公告：園遊會攤位報名延長至3月10日。共有${events.length}個活動：${events.map(e => e.title).join('、')}。`);

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
        {events.map(e => (
          <div key={e.id} className="card-accessible space-y-3">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-foreground">{e.title}</h2>
              <button
                onClick={() => speak(`${e.title}。${e.desc}。時間：${e.date}。地點：${e.location}`)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
