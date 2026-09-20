import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle, MessageCircle, Users, Award, Copy, HelpCircle, ScanLine } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useActivities } from '@/hooks/useActivities';

const TaskRoom = () => {
  const { id } = useParams();
  const { activities, scanOrganizerQr, answerQuiz, claimReward } = useActivities();
  const activity = activities.find(a => a.id === Number(id));
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [scanCode, setScanCode] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<{ side: 'name' | 'image'; id: number } | null>(null);
  const [matchedFruit, setMatchedFruit] = useState<number[]>([]);
  const fruits = [
    { id: 1, name: '香蕉', image: '🍌' },
    { id: 2, name: '蘋果', image: '🍎' },
    { id: 3, name: '西瓜', image: '🍉' },
  ];

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
    setSelectedAnswers(prev => {
      const current = prev[quizId] || [];
      return {
        ...prev,
        [quizId]: current.includes(selectedIndex)
          ? current.filter(index => index !== selectedIndex)
          : [...current, selectedIndex],
      };
    });
  };

  const submitAnswer = (quizId: number) => {
    const selected = selectedAnswers[quizId] || [];
    if (selected.length === 0) {
      toast.error('請先選擇一個答案');
      return;
    }
    answerQuiz(activity.id, quizId, selected);
    const q = activity.quiz.find(q => q.id === quizId);
    if (q && q.correctIndexes.length === selected.length && q.correctIndexes.every(index => selected.includes(index))) {
      toast.success('答對了！🎉');
    } else {
      toast.error('答錯了，再接再厲！');
    }
  };

  const copyRoomCode = () => {
    const fallback = () => {
      const input = document.createElement('textarea');
      input.value = activity.roomCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(activity.roomCode)
        .then(() => toast.success(`房間代碼 ${activity.roomCode} 已複製！`))
        .catch(() => { fallback(); toast.success(`房間代碼 ${activity.roomCode} 已複製！`); });
    } else {
      fallback();
      toast.success(`房間代碼 ${activity.roomCode} 已複製！`);
    }
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
                <div className="mt-0.5 flex-shrink-0">
                  {task.completed ? <CheckCircle2 size={28} className="text-primary" /> : <Circle size={28} className="text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{task.desc}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>完成進度</span>
                      <span className="font-bold text-primary">{task.completedCount}/{task.targetCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (task.completedCount / task.targetCount) * 100)}%` }} />
                    </div>
                  </div>
                  {!task.completed && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={scanCode}
                        onChange={e => setScanCode(e.target.value.toUpperCase())}
                        placeholder="輸入活動建立者的專屬代碼"
                        className="min-w-0 flex-1 rounded-xl border-2 border-input bg-background px-3 py-2 text-sm"
                      />
                      <Button
                        variant="secondary"
                        className="gap-1 rounded-xl"
                        onClick={() => {
                          const result = scanOrganizerQr(activity.id, task.id, scanCode);
                          if (result.completed) {
                            setScanCode('');
                            toast.success('代碼驗證成功，任務已完成！');
                          } else if (result.valid) {
                            setScanCode('');
                            toast.success('代碼驗證成功，已增加一次完成進度！');
                          } else {
                            toast.error('代碼無效，請向活動建立者確認。');
                          }
                        }}
                      >
                        <ScanLine size={16} /> 驗證
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activity.roomGames?.includes('image-match') && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">🎮 水果配對遊戲</h3>
            <p className="text-sm text-muted-foreground">先點選左側水果名稱或右側圖片，再點選另一側的對應項目。</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {fruits.map(fruit => (
                  <button
                    key={fruit.id}
                    disabled={matchedFruit.includes(fruit.id)}
                    onClick={() => {
                      if (selectedMatch?.side === 'image') {
                        if (selectedMatch.id === fruit.id) {
                          setMatchedFruit([...matchedFruit, fruit.id]);
                          toast.success('配對成功！');
                        } else toast.error('配對不正確，請再試一次');
                        setSelectedMatch(null);
                      } else setSelectedMatch({ side: 'name', id: fruit.id });
                    }}
                    className={`w-full rounded-xl border-2 p-3 font-bold ${
                      matchedFruit.includes(fruit.id) ? 'border-primary bg-primary/10 text-primary' :
                      selectedMatch?.side === 'name' && selectedMatch.id === fruit.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    {fruit.name}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {fruits.map(fruit => (
                  <button
                    key={fruit.id}
                    disabled={matchedFruit.includes(fruit.id)}
                    onClick={() => {
                      if (selectedMatch?.side === 'name') {
                        if (selectedMatch.id === fruit.id) {
                          setMatchedFruit([...matchedFruit, fruit.id]);
                          toast.success('配對成功！');
                        } else toast.error('配對不正確，請再試一次');
                        setSelectedMatch(null);
                      } else setSelectedMatch({ side: 'image', id: fruit.id });
                    }}
                    className={`w-full rounded-xl border-2 p-2 text-4xl ${
                      matchedFruit.includes(fruit.id) ? 'border-primary bg-primary/10' :
                      selectedMatch?.side === 'image' && selectedMatch.id === fruit.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    {fruit.image}
                  </button>
                ))}
              </div>
            </div>
            {matchedFruit.length === fruits.length && (
              <p className="rounded-xl bg-primary/10 p-3 text-center font-bold text-primary">水果配對完成！</p>
            )}
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
                <p className="text-xs text-muted-foreground">答對可得 {q.points} 分</p>

                {q.answered ? (
                  <div className={`rounded-xl p-3 text-center font-bold ${q.correct ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {q.correct ? '✅ 答對了！' : `❌ 答錯了（正確答案：${q.correctIndexes.map(index => q.options[index]).join('、')}）`}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswer(q.id, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                            selectedAnswers[q.id]?.includes(optIdx)
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
                      disabled={!selectedAnswers[q.id]?.length}
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
