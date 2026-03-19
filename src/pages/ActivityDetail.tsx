import { useParams } from 'react-router-dom';
import { MapPin, Clock, Users, Volume2, CheckCircle2, Circle, LogIn, Gamepad2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useActivities } from '@/hooks/useActivities';

const ActivityDetail = () => {
  const { id } = useParams();
  const { activities, joinActivity, toggleTask } = useActivities();
  const activity = activities.find(a => a.id === Number(id));

  if (!activity) {
    return (
      <div className="pb-24">
        <PageHeader title="活動不存在" showBack />
        <div className="p-8 text-center text-muted-foreground text-lg">找不到此活動，請返回活動列表。</div>
      </div>
    );
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW';
      u.rate = 0.9;
      speechSynthesis.speak(u);
      toast.success('正在朗讀中...');
    }
  };

  const handleJoin = () => {
    joinActivity(activity.id);
    toast.success('已成功加入活動！');
  };

  return (
    <div className="pb-24">
      <PageHeader title={activity.title} showBack />

      <div className="p-4 space-y-4">
        {/* Info card */}
        <div className="card-accessible space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{activity.title}</h2>
              {activity.quiz.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-1">
                  <Gamepad2 size={12} /> 含 {activity.quiz.length} 題問答挑戰
                </span>
              )}
            </div>
            <button
              onClick={() => speak(`${activity.title}。${activity.content}。時間：${activity.date}。地點：${activity.location}`)}
              className="w-12 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
              aria-label="朗讀活動內容"
            >
              <Volume2 size={24} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock size={16} />{activity.date}</span>
            <span className="flex items-center gap-1"><MapPin size={16} />{activity.location}</span>
            <span className="flex items-center gap-1"><Users size={16} />{activity.participants} 人已加入</span>
          </div>

          {/* Room code */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(activity.roomCode);
              toast.success(`房間代碼 ${activity.roomCode} 已複製！`);
            }}
            className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 active:scale-95 transition-transform"
          >
            <span className="text-xs text-muted-foreground">房間代碼</span>
            <span className="font-bold text-foreground tracking-widest">{activity.roomCode}</span>
            <Copy size={14} className="text-muted-foreground" />
          </button>

          <div className="pt-2 border-t border-border">
            <p className="text-foreground leading-relaxed">{activity.content}</p>
          </div>
        </div>

        {/* Join button */}
        {!activity.joined ? (
          <Button onClick={handleJoin} className="w-full h-14 text-lg font-bold rounded-2xl gap-2" size="lg">
            <LogIn size={22} /> 加入活動
          </Button>
        ) : (
          <div className="bg-primary/10 text-primary rounded-2xl p-4 text-center font-bold text-lg">
            ✅ 您已加入此活動
          </div>
        )}

        {/* Tasks preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground">📋 活動任務</h3>
          {!activity.joined && (
            <p className="text-sm text-muted-foreground">加入活動後即可進入任務房間</p>
          )}

          {activity.tasks.map(task => (
            <div key={task.id} className={`card-accessible flex items-start gap-3 ${!activity.joined ? 'opacity-60' : ''}`}>
              <button
                disabled={!activity.joined}
                onClick={() => {
                  toggleTask(activity.id, task.id);
                  toast.success(task.completed ? '已取消完成' : '任務已完成！');
                }}
                className="mt-0.5 flex-shrink-0"
              >
                {task.completed ? <CheckCircle2 size={28} className="text-primary" /> : <Circle size={28} className="text-muted-foreground" />}
              </button>
              <div className="flex-1">
                <p className={`font-bold text-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.desc}</p>
              </div>
            </div>
          ))}

          {activity.joined && (
            <Link to={`/activities/${activity.id}/room`} className="block">
              <Button variant="secondary" className="w-full h-14 text-lg font-bold rounded-2xl gap-2">
                🚪 進入任務房間
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
