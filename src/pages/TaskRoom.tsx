import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle, MessageCircle, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { useActivities } from '@/hooks/useActivities';

const TaskRoom = () => {
  const { id } = useParams();
  const { activities, toggleTask } = useActivities();
  const activity = activities.find(a => a.id === Number(id));

  if (!activity) {
    return (
      <div className="pb-24">
        <PageHeader title="房間不存在" showBack />
        <div className="p-8 text-center text-muted-foreground text-lg">找不到此任務房間。</div>
      </div>
    );
  }

  const completedCount = activity.tasks.filter(t => t.completed).length;
  const progress = activity.tasks.length > 0 ? Math.round((completedCount / activity.tasks.length) * 100) : 0;

  return (
    <div className="pb-24">
      <PageHeader title={`${activity.title} — 任務房間`} showBack />

      <div className="p-4 space-y-4">
        {/* Room info */}
        <div className="card-accessible space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">🚪 任務房間</h2>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users size={16} />{activity.participants} 人
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">任務進度</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              已完成 {completedCount} / {activity.tasks.length} 項任務
            </p>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground">📋 任務清單</h3>
          {activity.tasks.map(task => (
            <div key={task.id} className="card-accessible flex items-start gap-3">
              <button
                onClick={() => {
                  toggleTask(activity.id, task.id);
                  toast.success(task.completed ? '已取消完成' : '做得好！任務已完成 🎉');
                }}
                className="mt-0.5 flex-shrink-0"
                aria-label={task.completed ? '取消完成' : '標記為完成'}
              >
                {task.completed ? (
                  <CheckCircle2 size={28} className="text-primary" />
                ) : (
                  <Circle size={28} className="text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <p className={`font-bold text-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-muted-foreground">{task.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat hint */}
        <div className="card-accessible flex items-center gap-3 bg-muted/50">
          <MessageCircle size={24} className="text-primary flex-shrink-0" />
          <div>
            <p className="font-bold text-foreground">房間討論區</p>
            <p className="text-sm text-muted-foreground">與其他參與者交流任務進度與心得（即將推出）</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskRoom;
