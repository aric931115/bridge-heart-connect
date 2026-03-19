import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle, MessageCircle, Users, Award, Copy, HelpCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useActivities } from '@/hooks/useActivities';

const TaskRoom = () => {
  const { id } = useParams();
  const { activities, toggleTask, answerQuiz, claimReward } = useActivities();
  const activity = activities.find(a => a.id === Number(id));
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (!activity) {
    return (
      <div className="pb-24">
        <PageHeader title="房間不存在" showBack />
        <div className="p-8 text-center text-muted-foreground text-lg">找不到此任務房間。</div>
      </div>
    );
  }

  const completedTasks = activity.tasks.filter(t => t.completed).length;
  const answeredQuiz = activity.quiz.filter(q => q.answered).length;
  const correctQuiz = activity.quiz.filter(q => q.correct).length;
  const totalItems = activity.tasks.length + activity.quiz.length;
  const completedItems = completedTasks + answeredQuiz;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const allComplete = completedItems === totalItems && totalItems > 0;
  const canClaimReward = allComplete && !activity.rewardClaimed;

  const handleAnswer = (quizId: number, selectedIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: selectedIndex }));
  };

  const submitAnswer = (quizId: number) => {
    const selected = selectedAnswers[quizId];
    if (selected === undefined) {
      toast.error('請先選擇一個答案');
      return;
    }
    answerQuiz(activity.id, quizId, selected);
    const q = activity.quiz.find(q => q.id === quizId);
    if (q && q.correctIndex === selected) {
      toast.success('答對了！🎉');
    } else {
      toast.error('答錯了，再接再厲！');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(activity.roomCode);
    toast.success(`房間代碼 ${activity.roomCode} 已複製！`);
  };

  return (
    <div className="pb-24">
      <PageHeader title={`${activity.title} — 任務房間`} showBack />

      <div className="p-4 space-y-4">
        {/* Room info & code */}
        <div className="card-accessible space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">🚪 任務房間</h2>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users size={16} />{activity.participants} 人
            </span>
          </div>

          <button
            onClick={copyRoomCode}
            className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3 w-full active:scale-95 transition-transform"
          >
            <span className="text-sm text-muted-foreground">房間代碼</span>
            <span className="font-bold text-foreground tracking-widest text-lg">{activity.roomCode}</span>
            <Copy size={16} className="text-muted-foreground ml-auto" />
          </button>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">整體進度</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              已完成 {completedItems} / {totalItems} 項（任務 {completedTasks}/{activity.tasks.length}，問答 {answeredQuiz}/{activity.quiz.length}）
            </p>
          </div>
        </div>

        {/* Task list */}
        {activity.tasks.length > 0 && (
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
        )}

        {/* Quiz section */}
        {activity.quiz.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle size={20} /> 問答挑戰
            </h3>
            <p className="text-sm text-muted-foreground">到現場參加活動，找到答案吧！</p>

            {activity.quiz.map((q, qIdx) => (
              <div key={q.id} className="card-accessible space-y-3">
                <p className="font-bold text-foreground">
                  第 {qIdx + 1} 題：{q.question}
                </p>

                {q.answered ? (
                  <div className={`rounded-xl p-3 text-center font-bold ${q.correct ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {q.correct ? '✅ 答對了！' : `❌ 答錯了（正確答案：${q.options[q.correctIndex]}）`}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswer(q.id, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                            selectedAnswers[q.id] === optIdx
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-foreground hover:border-primary/40'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={() => submitAnswer(q.id)}
                      className="w-full rounded-xl"
                      disabled={selectedAnswers[q.id] === undefined}
                    >
                      提交答案
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reward section */}
        {allComplete && (
          <div className="card-accessible space-y-3 border-2 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-primary" />
              <div>
                <h3 className="text-lg font-bold text-foreground">🎉 恭喜完成所有挑戰！</h3>
                <p className="text-sm text-muted-foreground">
                  {activity.quiz.length > 0 && `問答成績：${correctQuiz}/${activity.quiz.length} 題答對`}
                </p>
              </div>
            </div>

            {activity.rewardClaimed ? (
              <div className="bg-primary/10 rounded-2xl p-6 text-center space-y-2">
                <Award size={48} className="text-primary mx-auto" />
                <p className="text-xl font-bold text-primary">獎勵證明</p>
                <p className="text-foreground font-bold">{activity.title}</p>
                <p className="text-sm text-muted-foreground">已完成所有任務與問答挑戰</p>
                <p className="text-xs text-muted-foreground mt-2">請出示此畫面給主辦方換取獎品</p>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  證明編號：{activity.roomCode}-{activity.id}
                </div>
              </div>
            ) : (
              <Button
                onClick={() => {
                  claimReward(activity.id);
                  toast.success('已領取獎勵證明！請出示給主辦方換取獎品 🎁');
                }}
                className="w-full h-14 text-lg font-bold rounded-2xl gap-2"
                size="lg"
              >
                <Award size={22} />
                領取獎勵證明
              </Button>
            )}
          </div>
        )}

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
