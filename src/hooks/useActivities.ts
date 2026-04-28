import { useState, useCallback } from 'react';

export type ActivityCategory = 'campus' | 'limited' | 'private';
export type TaskType =
  | 'image-match'    // 圖像配對
  | 'quick-quiz'     // 快速問答
  | 'gesture'        // 手勢/點擊
  | 'count'          // 次數型
  | 'pair'           // 配對任務（多人）
  | 'coop'           // 合作任務（多人）
  | 'multi-quiz'     // 多人問答
  | 'stage'          // 闖關任務
  | 'general';       // 一般任務

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  'image-match': '圖像配對遊戲',
  'quick-quiz': '快速問答',
  'gesture': '手勢 / 點擊任務',
  'count': '次數型任務',
  'pair': '配對任務（多人）',
  'coop': '合作任務（多人）',
  'multi-quiz': '多人問答',
  'stage': '闖關任務',
  'general': '一般任務',
};

export const MULTI_TASK_TYPES: TaskType[] = ['pair', 'coop', 'multi-quiz', 'stage'];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  answered?: boolean;
  correct?: boolean;
}

export interface ActivityTask {
  id: number;
  title: string;
  desc: string;
  type: TaskType;
  completed: boolean;
  verified?: boolean; // 發起者驗證
}

export interface ActivityParticipant {
  id: string;
  name: string;
  joinedAt: string;
  progress: number; // 0-100
  completed: boolean;
  rewardClaimed: boolean;
}

export interface Activity {
  id: number;
  title: string;
  date: string;
  location: string;
  desc: string;
  content: string;
  category: ActivityCategory;
  participants: number;
  participantList: ActivityParticipant[];
  joined: boolean;
  tasks: ActivityTask[];
  quiz: QuizQuestion[];
  roomCode: string;
  rewardClaimed: boolean;
  rewardPoints: number;
  status: 'active' | 'ended';
  organizerId: string;
  createdAt: string;
}

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const sampleParticipants: ActivityParticipant[] = [
  { id: 'u-101', name: '小明', joinedAt: '3月14日', progress: 100, completed: true, rewardClaimed: true },
  { id: 'u-102', name: '小華', joinedAt: '3月14日', progress: 66, completed: false, rewardClaimed: false },
  { id: 'u-103', name: '阿德', joinedAt: '3月15日', progress: 33, completed: false, rewardClaimed: false },
];

const defaultActivities: Activity[] = [
  {
    id: 1,
    title: '校園愛心園遊會',
    date: '3月15日（六）',
    location: '活動中心廣場',
    desc: '一起來參加愛心園遊會，有各種攤位和表演！',
    content: '本次園遊會將有超過 30 個攤位，包含美食、手作、二手物品義賣等。所有收入將捐贈給公益團體。歡迎同學邀請家人朋友一起參加！',
    category: 'campus',
    participants: 42,
    participantList: sampleParticipants,
    joined: false,
    roomCode: 'LOVE01',
    rewardClaimed: false,
    rewardPoints: 50,
    status: 'active',
    organizerId: 'ORG-001',
    createdAt: '3月1日',
    tasks: [
      { id: 1, title: '佈置攤位', desc: '協助搬運桌椅並佈置攤位裝飾', type: 'general', completed: false },
      { id: 2, title: '收銀員', desc: '負責攤位收款與找零', type: 'count', completed: false },
      { id: 3, title: '場地清潔', desc: '活動結束後清掃場地', type: 'general', completed: false },
    ],
    quiz: [
      { id: 1, question: '本次園遊會的收入將捐贈給？', options: ['學校基金', '公益團體', '班級經費', '學生會'], correctIndex: 1 },
      { id: 2, question: '園遊會共有多少個攤位？', options: ['10 個', '20 個', '超過 30 個', '50 個'], correctIndex: 2 },
    ],
  },
  {
    id: 2,
    title: '環保小尖兵',
    date: '3月20日（四）',
    location: '操場',
    desc: '認識環境保護，一起守護地球！',
    content: '透過闖關活動學習垃圾分類、節能減碳等環保知識。現場完成問答挑戰即可獲得環保小尖兵證書，憑證書可至主辦方換取精美獎品！',
    category: 'limited',
    participants: 28,
    participantList: sampleParticipants.slice(0, 2),
    joined: false,
    roomCode: 'ECO202',
    rewardClaimed: false,
    rewardPoints: 80,
    status: 'active',
    organizerId: 'ORG-001',
    createdAt: '3月5日',
    tasks: [
      { id: 1, title: '器材準備', desc: '準備各項活動所需器材', type: 'general', completed: false },
      { id: 2, title: '闖關挑戰', desc: '完成 4 個環保知識關卡', type: 'stage', completed: false },
    ],
    quiz: [
      { id: 1, question: '以下哪一項屬於可回收垃圾？', options: ['廚餘', '寶特瓶', '衛生紙', '口香糖'], correctIndex: 1 },
      { id: 2, question: '節能減碳最簡單的方式是？', options: ['開冷氣睡覺', '隨手關燈關電器', '多開車出門', '使用免洗餐具'], correctIndex: 1 },
      { id: 3, question: '地球日是每年的哪一天？', options: ['3月12日', '4月22日', '6月5日', '9月16日'], correctIndex: 1 },
    ],
  },
  {
    id: 3,
    title: '手語工作坊',
    date: '3月25日（二）',
    location: '圖書館 B1',
    desc: '學習基本手語，認識聽障朋友的世界。',
    content: '由專業手語老師授課，學習日常打招呼、自我介紹等基本手語。',
    category: 'campus',
    participants: 15,
    participantList: [],
    joined: false,
    roomCode: 'SIGN03',
    rewardClaimed: false,
    rewardPoints: 40,
    status: 'active',
    organizerId: 'ORG-002',
    createdAt: '3月8日',
    tasks: [
      { id: 1, title: '手勢練習', desc: '模仿老師的手勢動作', type: 'gesture', completed: false },
    ],
    quiz: [
      { id: 1, question: '手語中「謝謝」的手勢是？', options: ['雙手合十', '右手從下巴往前推', '揮手', '比讚'], correctIndex: 1 },
    ],
  },
  {
    id: 4,
    title: '繪畫比賽',
    date: '4月1日（二）',
    location: '美術教室',
    desc: '以「友誼」為題，畫出你心中的溫暖。',
    content: '參賽者將在兩小時內完成一幅以「友誼」為主題的作品。',
    category: 'private',
    participants: 20,
    participantList: [],
    joined: false,
    roomCode: 'ART004',
    rewardClaimed: false,
    rewardPoints: 60,
    status: 'active',
    organizerId: 'ORG-003',
    createdAt: '3月12日',
    tasks: [
      { id: 1, title: '配對作品', desc: '與夥伴一起完成雙人共作', type: 'pair', completed: false },
    ],
    quiz: [],
  },
];

let globalActivities = [...defaultActivities];
let listeners: (() => void)[] = [];

const notify = () => listeners.forEach(l => l());

export function useActivities() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick(t => t + 1), []);

  useState(() => {
    listeners.push(rerender);
    return () => {
      listeners = listeners.filter(l => l !== rerender);
    };
  });

  const addActivity = (activity: Omit<Activity, 'id' | 'participants' | 'participantList' | 'joined' | 'roomCode' | 'rewardClaimed' | 'status' | 'createdAt' | 'organizerId'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      participants: 0,
      participantList: [],
      joined: false,
      roomCode: generateRoomCode(),
      rewardClaimed: false,
      status: 'active',
      organizerId: 'ORG-ME',
      createdAt: new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' }),
    };
    globalActivities = [newActivity, ...globalActivities];
    notify();
    return newActivity;
  };

  const joinActivity = (id: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === id && !a.joined
        ? { ...a, joined: true, participants: a.participants + 1 }
        : a
    );
    notify();
  };

  const joinByCode = (code: string): Activity | null => {
    const activity = globalActivities.find(a => a.roomCode === code.toUpperCase());
    if (activity && !activity.joined) {
      joinActivity(activity.id);
      return activity;
    }
    return activity || null;
  };

  const toggleTask = (activityId: number, taskId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : a
    );
    notify();
  };

  const verifyTask = (activityId: number, taskId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, verified: true } : t) }
        : a
    );
    notify();
  };

  const answerQuiz = (activityId: number, quizId: number, selectedIndex: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, quiz: a.quiz.map(q => q.id === quizId ? { ...q, answered: true, correct: q.correctIndex === selectedIndex } : q) }
        : a
    );
    notify();
  };

  const claimReward = (activityId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId ? { ...a, rewardClaimed: true } : a
    );
    notify();
  };

  const endActivity = (activityId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId ? { ...a, status: 'ended' } : a
    );
    notify();
  };

  const distributeRewards = (activityId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, participantList: a.participantList.map(p => p.completed ? { ...p, rewardClaimed: true } : p) }
        : a
    );
    notify();
  };

  return {
    activities: globalActivities,
    addActivity,
    joinActivity,
    joinByCode,
    toggleTask,
    verifyTask,
    answerQuiz,
    claimReward,
    endActivity,
    distributeRewards,
  };
}
