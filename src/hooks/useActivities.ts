import { useState, useCallback } from 'react';

export interface ActivityTask {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
}

export interface Activity {
  id: number;
  title: string;
  date: string;
  location: string;
  desc: string;
  content: string;
  participants: number;
  joined: boolean;
  tasks: ActivityTask[];
}

const defaultActivities: Activity[] = [
  {
    id: 1,
    title: '校園愛心園遊會',
    date: '3月15日（六）',
    location: '活動中心廣場',
    desc: '一起來參加愛心園遊會，有各種攤位和表演！',
    content: '本次園遊會將有超過 30 個攤位，包含美食、手作、二手物品義賣等。所有收入將捐贈給公益團體。歡迎同學邀請家人朋友一起參加！',
    participants: 42,
    joined: false,
    tasks: [
      { id: 1, title: '佈置攤位', desc: '協助搬運桌椅並佈置攤位裝飾', completed: false },
      { id: 2, title: '收銀員', desc: '負責攤位收款與找零', completed: false },
      { id: 3, title: '場地清潔', desc: '活動結束後清掃場地', completed: false },
    ],
  },
  {
    id: 2,
    title: '共融運動日',
    date: '3月20日（四）',
    location: '操場',
    desc: '適合所有同學的趣味運動會，歡迎報名！',
    content: '共融運動日提供多種適合不同能力同學的運動項目，包含趣味接力、投籃挑戰、定點踢球等。重點不在輸贏，而是大家一起開心運動！',
    participants: 28,
    joined: false,
    tasks: [
      { id: 1, title: '器材準備', desc: '準備各項運動所需器材', completed: false },
      { id: 2, title: '引導志工', desc: '引導參與者到各個運動站', completed: false },
    ],
  },
  {
    id: 3,
    title: '手語工作坊',
    date: '3月25日（二）',
    location: '圖書館 B1',
    desc: '學習基本手語，認識聽障朋友的世界。',
    content: '由專業手語老師授課，學習日常打招呼、自我介紹等基本手語。活動中也會邀請聽障朋友分享生活經驗，增進彼此理解。',
    participants: 15,
    joined: false,
    tasks: [
      { id: 1, title: '場地準備', desc: '整理教室桌椅、設備測試', completed: false },
    ],
  },
  {
    id: 4,
    title: '繪畫比賽',
    date: '4月1日（二）',
    location: '美術教室',
    desc: '以「友誼」為題，畫出你心中的溫暖。',
    content: '參賽者將在兩小時內完成一幅以「友誼」為主題的作品。可使用水彩、蠟筆、色鉛筆等媒材。優秀作品將在校內展出一週。',
    participants: 20,
    joined: false,
    tasks: [
      { id: 1, title: '準備畫具', desc: '分配畫紙與基本畫具', completed: false },
      { id: 2, title: '評審助手', desc: '協助評審老師整理作品', completed: false },
    ],
  },
];

// Simple global state for activities
let globalActivities = [...defaultActivities];
let listeners: (() => void)[] = [];

const notify = () => listeners.forEach(l => l());

export function useActivities() {
  const [, setTick] = useState(0);

  const rerender = useCallback(() => setTick(t => t + 1), []);

  // Subscribe on mount
  useState(() => {
    listeners.push(rerender);
    return () => {
      listeners = listeners.filter(l => l !== rerender);
    };
  });

  const addActivity = (activity: Omit<Activity, 'id' | 'participants' | 'joined'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      participants: 0,
      joined: false,
    };
    globalActivities = [newActivity, ...globalActivities];
    notify();
  };

  const joinActivity = (id: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === id && !a.joined
        ? { ...a, joined: true, participants: a.participants + 1 }
        : a
    );
    notify();
  };

  const toggleTask = (activityId: number, taskId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? {
            ...a,
            tasks: a.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          }
        : a
    );
    notify();
  };

  return {
    activities: globalActivities,
    addActivity,
    joinActivity,
    toggleTask,
  };
}
