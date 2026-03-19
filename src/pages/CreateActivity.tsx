import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useActivities, ActivityTask } from '@/hooks/useActivities';

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

  const addTask = () => {
    setTasks([...tasks, { title: '', desc: '' }]);
  };

  const removeTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const updateTask = (idx: number, field: 'title' | 'desc', value: string) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
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

    addActivity({
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
    });

    toast.success('活動已發布至活動面板！');
    navigate('/activities');
  };

  return (
    <div className="pb-24">
      <PageHeader title="建立新活動" showBack />

      <div className="p-4 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">活動名稱 *</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="例如：校園環保日"
            className="h-12 text-base rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">日期 *</label>
          <Input
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="例如：4月10日（四）"
            className="h-12 text-base rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">地點 *</label>
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="例如：操場"
            className="h-12 text-base rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">簡短描述 *</label>
          <Textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="一句話介紹活動"
            className="text-base rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">詳細說明</label>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="活動的詳細內容（選填）"
            rows={4}
            className="text-base rounded-xl"
          />
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">📋 活動任務</label>

          {tasks.map((task, idx) => (
            <div key={idx} className="card-accessible space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">任務 {idx + 1}</span>
                {tasks.length > 1 && (
                  <button
                    onClick={() => removeTask(idx)}
                    className="text-destructive p-1"
                    aria-label="刪除任務"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <Input
                value={task.title}
                onChange={e => updateTask(idx, 'title', e.target.value)}
                placeholder="任務名稱"
                className="h-11 text-base rounded-xl"
              />
              <Input
                value={task.desc}
                onChange={e => updateTask(idx, 'desc', e.target.value)}
                placeholder="任務說明（選填）"
                className="h-11 text-base rounded-xl"
              />
            </div>
          ))}

          <button
            onClick={addTask}
            className="flex items-center gap-2 text-primary font-bold py-2 active:scale-95 transition-transform"
          >
            <Plus size={20} />
            新增任務
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full h-14 text-lg font-bold rounded-2xl"
          size="lg"
        >
          發布活動
        </Button>
      </div>
    </div>
  );
};

export default CreateActivity;
