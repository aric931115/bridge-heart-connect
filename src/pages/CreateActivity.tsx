import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, HelpCircle, Copy, QrCode, School, Clock, Lock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useActivities,
  ActivityTask,
  QuizQuestion,
  ActivityCategory,
  TaskType,
  TASK_TYPE_LABELS,
  MULTI_TASK_TYPES,
} from '@/hooks/useActivities';

interface QuizDraft {
  question: string;
  options: string[];
  correctIndex: number;
}

type TaskDraft = { title: string; desc: string; type: TaskType };

const CATEGORY_OPTIONS: { value: ActivityCategory; label: string; icon: typeof School; desc: string }[] = [
  { value: 'campus', label: '校園活動', icon: School, desc: '公開張貼在校園活動板' },
  { value: 'limited', label: '限時活動', icon: Clock, desc: '限定時間內參加' },
  { value: 'private', label: '私人活動', icon: Lock, desc: '僅憑代碼加入' },
];

const CreateActivity = () => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('campus');
  const [rewardPoints, setRewardPoints] = useState(50);
  const [tasks, setTasks] = useState<TaskDraft[]>([
    { title: '', desc: '', type: 'general' },
  ]);
  const [quizzes, setQuizzes] = useState<QuizDraft[]>([]);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const addTask = () => setTasks([...tasks, { title: '', desc: '', type: 'general' }]);
  const removeTask = (idx: number) => setTasks(tasks.filter((_, i) => i !== idx));
  const updateTask = (idx: number, field: keyof TaskDraft, value: string) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const addQuiz = () => setQuizzes([...quizzes, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
  const removeQuiz = (idx: number) => setQuizzes(quizzes.filter((_, i) => i !== idx));
  const updateQuizQuestion = (idx: number, value: string) => {
    setQuizzes(quizzes.map((q, i) => (i === idx ? { ...q, question: value } : q)));
  };
  const updateQuizOption = (qIdx: number, optIdx: number, value: string) => {
    setQuizzes(quizzes.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.map((o, j) => (j === optIdx ? value : o)) } : q
    ));
  };
  const setCorrectAnswer = (qIdx: number, optIdx: number) => {
    setQuizzes(quizzes.map((q, i) => (i === qIdx ? { ...q, correctIndex: optIdx } : q)));
  };

  const handleSubmit = () => {
    if (!title.trim() || !date.trim() || !location.trim() || !desc.trim()) {
      toast.error('請填寫所有必要欄位');
      return;
    }

    const validTasks = tasks.filter(t => t.title.trim());
    if (validTasks.length === 0) {
      toast.error('請至少新增一個任務');
      return;
    }

    const validQuizzes: QuizQuestion[] = quizzes
      .filter(q => q.question.trim() && q.options.some(o => o.trim()))
      .map((q, i) => ({
        id: i + 1,
        question: q.question.trim(),
        options: q.options.map(o => o.trim() || '（空選項）'),
        correctIndex: q.correctIndex,
      }));

    const newActivity = addActivity({
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      desc: desc.trim(),
      content: content.trim() || desc.trim(),
      category,
      rewardPoints,
      tasks: validTasks.map<ActivityTask>((t, i) => ({
        id: i + 1,
        title: t.title.trim(),
        desc: t.desc.trim(),
        type: t.type,
        completed: false,
      })),
      quiz: validQuizzes,
    });

    setCreatedCode(newActivity.roomCode);
    toast.success('活動已發布！');
  };

  if (createdCode) {
    return (
      <div className="pb-24">
        <PageHeader title="活動已建立" showBack />
        <div className="p-6 space-y-6 text-center">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-foreground">活動發布成功！</h2>
          <p className="text-muted-foreground">分享以下代碼或 QR Code 邀請參與者加入</p>

          <div className="bg-muted rounded-2xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">房間代碼</p>
            <p className="text-4xl font-bold tracking-widest text-primary">{createdCode}</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => { navigator.clipboard.writeText(createdCode); toast.success('已複製代碼！'); }}
                className="gap-2"
              >
                <Copy size={18} /> 複製
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info('QR Code 分享（原型展示）')}
                className="gap-2"
              >
                <QrCode size={18} /> QR Code
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/activities')} className="w-full h-14 text-lg font-bold rounded-2xl">
              前往活動面板
            </Button>
            <Button onClick={() => navigate('/games')} variant="secondary" className="w-full h-14 text-lg font-bold rounded-2xl">
              返回遊玩
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="建立新活動" showBack />

      <div className="p-4 space-y-5">
        {/* 活動類型 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">🏷️ 活動類型 *</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = category === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className={`rounded-xl border-2 p-3 flex flex-col items-center gap-1 transition-all ${
                    active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">{CATEGORY_OPTIONS.find(c => c.value === category)?.desc}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動名稱 *</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="例如：校園環保日" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動時間 *</label>
          <Input value={date} onChange={e => setDate(e.target.value)} placeholder="例如：4月10日（四）" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動地點 *</label>
          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="例如：操場" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動說明（簡短）*</label>
          <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="一句話介紹活動" className="text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">詳細內容</label>
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="活動的詳細內容（選填）" rows={4} className="text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">🎁 任務獎勵積分</label>
          <Input
            type="number"
            min={0}
            value={rewardPoints}
            onChange={e => setRewardPoints(Number(e.target.value) || 0)}
            className="h-12 text-base rounded-xl"
          />
          <p className="text-xs text-muted-foreground">參與者完成所有任務後可獲得的積分</p>
        </div>

        {/* 任務設計 */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">📋 任務設計</label>
          {tasks.map((task, idx) => {
            const isMulti = MULTI_TASK_TYPES.includes(task.type);
            return (
              <div key={idx} className="card-accessible space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground">
                    任務 {idx + 1} · {isMulti ? '多人' : '個人'}
                  </span>
                  {tasks.length > 1 && (
                    <button onClick={() => removeTask(idx)} className="text-destructive p-1" aria-label="刪除任務">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <Input value={task.title} onChange={e => updateTask(idx, 'title', e.target.value)} placeholder="任務名稱" className="h-11 text-base rounded-xl" />
                <Input value={task.desc} onChange={e => updateTask(idx, 'desc', e.target.value)} placeholder="任務說明（選填）" className="h-11 text-base rounded-xl" />
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">任務類型</span>
                  <select
                    value={task.type}
                    onChange={e => updateTask(idx, 'type', e.target.value)}
                    className="w-full h-11 rounded-xl border-2 border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <optgroup label="個人任務">
                      <option value="general">一般任務</option>
                      <option value="image-match">{TASK_TYPE_LABELS['image-match']}</option>
                      <option value="quick-quiz">{TASK_TYPE_LABELS['quick-quiz']}</option>
                      <option value="gesture">{TASK_TYPE_LABELS['gesture']}</option>
                      <option value="count">{TASK_TYPE_LABELS['count']}</option>
                    </optgroup>
                    <optgroup label="多人任務">
                      <option value="pair">{TASK_TYPE_LABELS['pair']}</option>
                      <option value="coop">{TASK_TYPE_LABELS['coop']}</option>
                      <option value="multi-quiz">{TASK_TYPE_LABELS['multi-quiz']}</option>
                      <option value="stage">{TASK_TYPE_LABELS['stage']}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            );
          })}
          <button onClick={addTask} className="flex items-center gap-2 text-primary font-bold py-2 active:scale-95 transition-transform">
            <Plus size={20} /> 新增任務
          </button>
        </div>

        {/* Quiz */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <HelpCircle size={16} /> 問答挑戰（選填）
          </label>
          <p className="text-xs text-muted-foreground">新增問答題讓參與者到現場才能作答，完成後可領取獎勵證明</p>

          {quizzes.map((quiz, qIdx) => (
            <div key={qIdx} className="card-accessible space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">第 {qIdx + 1} 題</span>
                <button onClick={() => removeQuiz(qIdx)} className="text-destructive p-1" aria-label="刪除題目">
                  <Trash2 size={18} />
                </button>
              </div>
              <Input
                value={quiz.question}
                onChange={e => updateQuizQuestion(qIdx, e.target.value)}
                placeholder="問題內容"
                className="h-11 text-base rounded-xl"
              />
              <p className="text-xs text-muted-foreground">選項（點擊圓圈設定正確答案）</p>
              {quiz.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <button
                    onClick={() => setCorrectAnswer(qIdx, optIdx)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      quiz.correctIndex === optIdx ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                    }`}
                    aria-label={`設定選項 ${String.fromCharCode(65 + optIdx)} 為正確答案`}
                  >
                    {quiz.correctIndex === optIdx && '✓'}
                  </button>
                  <Input
                    value={opt}
                    onChange={e => updateQuizOption(qIdx, optIdx, e.target.value)}
                    placeholder={`選項 ${String.fromCharCode(65 + optIdx)}`}
                    className="h-10 text-sm rounded-xl"
                  />
                </div>
              ))}
            </div>
          ))}

          <button onClick={addQuiz} className="flex items-center gap-2 text-primary font-bold py-2 active:scale-95 transition-transform">
            <Plus size={20} /> 新增問答題
          </button>
        </div>

        <Button onClick={handleSubmit} className="w-full h-14 text-lg font-bold rounded-2xl" size="lg">
          發布活動
        </Button>
      </div>
    </div>
  );
};

export default CreateActivity;
