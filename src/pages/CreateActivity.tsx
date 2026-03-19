import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, HelpCircle, Copy } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useActivities, ActivityTask, QuizQuestion } from '@/hooks/useActivities';

interface QuizDraft {
  question: string;
  options: string[];
  correctIndex: number;
}

const CreateActivity = () => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState<Omit<ActivityTask, 'id' | 'completed'>[]>([
    { title: '', desc: '' },
  ]);
  const [quizzes, setQuizzes] = useState<QuizDraft[]>([]);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const addTask = () => setTasks([...tasks, { title: '', desc: '' }]);
  const removeTask = (idx: number) => setTasks(tasks.filter((_, i) => i !== idx));
  const updateTask = (idx: number, field: 'title' | 'desc', value: string) => {
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
      tasks: validTasks.map((t, i) => ({
        id: i + 1,
        title: t.title.trim(),
        desc: t.desc.trim(),
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
          <p className="text-muted-foreground">分享以下房間代碼，讓其他人從「遊玩 → 加入房間」加入你的活動</p>

          <div className="bg-muted rounded-2xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">房間代碼</p>
            <p className="text-4xl font-bold tracking-widest text-primary">{createdCode}</p>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(createdCode);
                toast.success('已複製代碼！');
              }}
              className="gap-2"
            >
              <Copy size={18} /> 複製代碼
            </Button>
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
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動名稱 *</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="例如：校園環保日" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">日期 *</label>
          <Input value={date} onChange={e => setDate(e.target.value)} placeholder="例如：4月10日（四）" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">地點 *</label>
          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="例如：操場" className="h-12 text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">簡短描述 *</label>
          <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="一句話介紹活動" className="text-base rounded-xl" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">詳細說明</label>
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="活動的詳細內容（選填）" rows={4} className="text-base rounded-xl" />
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">📋 活動任務</label>
          {tasks.map((task, idx) => (
            <div key={idx} className="card-accessible space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">任務 {idx + 1}</span>
                {tasks.length > 1 && (
                  <button onClick={() => removeTask(idx)} className="text-destructive p-1" aria-label="刪除任務">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <Input value={task.title} onChange={e => updateTask(idx, 'title', e.target.value)} placeholder="任務名稱" className="h-11 text-base rounded-xl" />
              <Input value={task.desc} onChange={e => updateTask(idx, 'desc', e.target.value)} placeholder="任務說明（選填）" className="h-11 text-base rounded-xl" />
            </div>
          ))}
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
