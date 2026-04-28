import { useParams, useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, Circle, Award, BarChart3, StopCircle, Copy, QrCode, Gift } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useActivities, TASK_TYPE_LABELS } from '@/hooks/useActivities';

const ManageActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, verifyTask, endActivity, distributeRewards } = useActivities();
  const activity = activities.find(a => a.id === Number(id));

  if (!activity) {
    return (
      <div className="pb-24">
        <PageHeader title="活動不存在" showBack />
        <div className="p-8 text-center text-muted-foreground text-lg">找不到此活動。</div>
      </div>
    );
  }

  const completedCount = activity.participantList.filter(p => p.completed).length;
  const avgProgress = activity.participantList.length > 0
    ? Math.round(activity.participantList.reduce((s, p) => s + p.progress, 0) / activity.participantList.length)
    : 0;
  const completionRate = activity.participantList.length > 0
    ? Math.round((completedCount / activity.participantList.length) * 100)
    : 0;
  const totalPointsIssued = completedCount * activity.rewardPoints;

  return (
    <div className="pb-24">
      <PageHeader title={`管理：${activity.title}`} showBack />
      <div className="p-4 space-y-4">
        {/* 狀態與代碼 */}
        <div className="card-accessible space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">📣 活動狀態</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              activity.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {activity.status === 'active' ? '進行中' : '已結束'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(activity.roomCode); toast.success('已複製代碼！'); }}
              className="flex-1 flex items-center justify-center gap-2 bg-muted rounded-xl px-3 py-3 active:scale-95"
            >
              <span className="text-sm text-muted-foreground">代碼</span>
              <span className="font-bold tracking-widest">{activity.roomCode}</span>
              <Copy size={14} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => toast.info('QR Code 分享（原型）')}
              className="bg-muted rounded-xl px-4 active:scale-95"
              aria-label="QR Code"
            >
              <QrCode size={20} />
            </button>
          </div>
        </div>

        {/* 成果統計 */}
        <div className="card-accessible space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={20} /> 活動成果統計
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">參與人數</p>
              <p className="text-2xl font-bold text-primary">{activity.participants}</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">任務完成率</p>
              <p className="text-2xl font-bold text-primary">{completionRate}%</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">平均進度</p>
              <p className="text-2xl font-bold text-primary">{avgProgress}%</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">積分發放</p>
              <p className="text-2xl font-bold text-primary">{totalPointsIssued}</p>
            </div>
          </div>
        </div>

        {/* 參與者列表 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users size={20} /> 參與者（{activity.participantList.length}）
          </h2>
          {activity.participantList.length === 0 ? (
            <div className="card-accessible text-center text-muted-foreground py-6">尚無參與者</div>
          ) : (
            activity.participantList.map(p => (
              <div key={p.id} className="card-accessible space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">加入時間：{p.joinedAt}</p>
                  </div>
                  {p.completed ? (
                    <span className="bg-success/20 text-success px-2 py-0.5 rounded-full text-xs font-bold">已完成</span>
                  ) : (
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-bold">進行中</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">任務進度</span>
                    <span className="font-bold text-primary">{p.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                {p.rewardClaimed && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Award size={12} /> 已領取獎勵
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 任務驗證 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">✅ 驗證任務進度</h2>
          {activity.tasks.map(t => (
            <div key={t.id} className="card-accessible flex items-start gap-3">
              <button
                onClick={() => { verifyTask(activity.id, t.id); toast.success('已驗證此任務'); }}
                disabled={t.verified}
                aria-label="驗證任務"
              >
                {t.verified ? <CheckCircle2 size={28} className="text-primary" /> : <Circle size={28} className="text-muted-foreground" />}
              </button>
              <div className="flex-1">
                <p className="font-bold text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">{TASK_TYPE_LABELS[t.type]}</p>
                {t.desc && <p className="text-sm text-muted-foreground">{t.desc}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* 動作區 */}
        <div className="space-y-3">
          <Button
            onClick={() => { distributeRewards(activity.id); toast.success('已發放獎勵給完成者'); }}
            className="w-full h-14 text-lg font-bold rounded-2xl gap-2"
          >
            <Gift size={22} /> 發放獎勵
          </Button>
          {activity.status === 'active' ? (
            <Button
              variant="destructive"
              onClick={() => {
                endActivity(activity.id);
                toast.success('活動已結束');
                navigate('/activities');
              }}
              className="w-full h-14 text-lg font-bold rounded-2xl gap-2"
            >
              <StopCircle size={22} /> 結束活動
            </Button>
          ) : (
            <div className="bg-muted rounded-2xl p-4 text-center text-muted-foreground font-bold">活動已結束</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageActivity;
