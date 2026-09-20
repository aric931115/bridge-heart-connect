import { useState, useCallback } from 'react';

export type ActivityCategory = 'campus' | 'private';
export interface ActivityTag {
  label: string;
  color: string;
}
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
  correctIndexes: number[];
  points: number;
  answered?: boolean;
  correct?: boolean;
}

export interface ActivityTask {
  id: number;
  title: string;
  desc: string;
  type: TaskType;
  targetCount: number;
  completedCount: number;
  points: number;
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
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  noPhysicalLocation?: boolean;
  desc: string;
  content: string;
  category: ActivityCategory;
  tags: ActivityTag[];
  maxParticipants: number;
  participants: number;
  participantList: ActivityParticipant[];
  joined: boolean;
  tasks: ActivityTask[];
  quiz: QuizQuestion[];
  roomCode: string;
  roomGames?: string[];
  roomGamePoints: number;
  organizerQrCode: string;
  organizerName?: string;
  organizerAnonymous?: boolean;
  rewardClaimed: boolean;
  status: 'active' | 'ended';
  organizerId: string;
  createdAt: string;
}

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateUniqueRoomCode(): string {
  let code = generateRoomCode();
  while (globalActivities.some(activity => activity.roomCode === code)) {
    code = generateRoomCode();
  }
  return code;
}

function generateOrganizerQrCode(): string {
  return `ORG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
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
    endDate: '3月15日（六）',
    startTime: '09:00',
    endTime: '12:00',
    location: '活動中心廣場',
    desc: '一起來參加愛心園遊會，有各種攤位和表演！',
    content: '本次園遊會將有超過 30 個攤位，包含美食、手作、二手物品義賣等。所有收入將捐贈給公益團體。歡迎同學邀請家人朋友一起參加！',
    category: 'campus',
    tags: [{ label: '園遊會', color: '#2563eb' }],
    maxParticipants: 100,
    participants: 10,
    participantList: sampleParticipants,
    joined: false,
    roomCode: 'LOVE01',
    roomGames: ['image-match'],
    roomGamePoints: 3,
    organizerQrCode: 'ORG-LOVE01',
    rewardClaimed: false,
    status: 'active',
    organizerId: 'ORG-001',
    organizerName: '校園活動中心',
    organizerAnonymous: false,
    createdAt: '3月1日',
    tasks: [
      { id: 1, title: '活動簽到', desc: '到現場向活動建立者取得專屬代碼並完成簽到', type: 'general', targetCount: 1, completedCount: 0, points: 5, completed: false },
    ],
    quiz: [
      { id: 1, question: '本次園遊會的收入將捐贈給？', options: ['學校基金', '公益團體', '班級經費', '學生會'], correctIndexes: [1], points: 5 },
      { id: 2, question: '園遊會共有多少個攤位？', options: ['10 個', '20 個', '超過 30 個', '50 個'], correctIndexes: [2], points: 5 },
    ],
  },
  {
    id: 2,
    title: '環保小尖兵',
    date: '3月20日（四）',
    endDate: '3月20日（四）',
    startTime: '09:00',
    endTime: '12:00',
    location: '操場',
    desc: '認識環境保護，一起守護地球！',
    content: '透過闖關活動學習垃圾分類、節能減碳等環保知識。現場完成問答挑戰即可獲得環保小尖兵證書，憑證書可至主辦方換取精美獎品！',
    category: 'campus',
    tags: [{ label: '環保', color: '#16a34a' }],
    maxParticipants: 50,
    participants: 28,
    participantList: sampleParticipants.slice(0, 2),
    joined: false,
    roomCode: 'ECO202',
    organizerQrCode: 'ORG-ECO202',
    rewardClaimed: false,
    status: 'active',
    organizerId: 'ORG-001',
    organizerName: '環境教育社',
    organizerAnonymous: false,
    createdAt: '3月5日',
    tasks: [
      { id: 1, title: '活動簽到', desc: '到現場向活動建立者取得專屬代碼並完成簽到', type: 'general', targetCount: 1, completedCount: 0, points: 0, completed: false },
    ],
    quiz: [
      { id: 1, question: '以下哪一項屬於可回收垃圾？', options: ['廚餘', '寶特瓶', '衛生紙', '口香糖'], correctIndexes: [1], points: 0 },
      { id: 2, question: '節能減碳最簡單的方式是？', options: ['開冷氣睡覺', '隨手關燈關電器', '多開車出門', '使用免洗餐具'], correctIndexes: [1], points: 0 },
      { id: 3, question: '地球日是每年的哪一天？', options: ['3月12日', '4月22日', '6月5日', '9月16日'], correctIndexes: [1], points: 0 },
    ],
  },
  {
    id: 3,
    title: '手語工作坊',
    date: '3月25日（二）',
    endDate: '3月25日（二）',
    startTime: '13:00',
    endTime: '15:00',
    location: '圖書館 B1',
    desc: '學習基本手語，認識聽障朋友的世界。',
    content: '由專業手語老師授課，學習日常打招呼、自我介紹等基本手語。',
    category: 'campus',
    tags: [{ label: '手語', color: '#9333ea' }],
    maxParticipants: 30,
    participants: 15,
    participantList: [],
    joined: false,
    roomCode: 'SIGN03',
    organizerQrCode: 'ORG-SIGN03',
    rewardClaimed: false,
    status: 'active',
    organizerId: 'ORG-002',
    organizerName: '手語社',
    organizerAnonymous: false,
    createdAt: '3月8日',
    tasks: [
      { id: 1, title: '活動簽到', desc: '到現場向活動建立者取得專屬代碼並完成簽到', type: 'general', targetCount: 1, completedCount: 0, points: 5, completed: false },
    ],
    quiz: [
      { id: 1, question: '手語中「謝謝」的手勢是？', options: ['雙手合十', '右手從下巴往前推', '揮手', '比讚'], correctIndexes: [1], points: 5 },
    ],
  },
  {
    id: 4,
    title: '繪畫比賽',
    date: '4月1日（二）',
    endDate: '4月1日（二）',
    startTime: '14:00',
    endTime: '16:00',
    location: '美術教室',
    desc: '以「友誼」為題，畫出你心中的溫暖。',
    content: '參賽者將在兩小時內完成一幅以「友誼」為主題的作品。',
    category: 'private',
    tags: [{ label: '比賽', color: '#ea580c' }],
    maxParticipants: 20,
    participants: 20,
    participantList: [],
    joined: false,
    roomCode: 'ART004',
    organizerQrCode: 'ORG-ART004',
    rewardClaimed: false,
    status: 'active',
    organizerId: 'ORG-003',
    organizerName: '美術社',
    organizerAnonymous: false,
    createdAt: '3月12日',
    tasks: [
      { id: 1, title: '活動簽到', desc: '到現場向活動建立者取得專屬代碼並完成簽到', type: 'general', targetCount: 1, completedCount: 0, points: 0, completed: false },
    ],
    quiz: [],
  },
];

const initialActivities = defaultActivities.slice(0, 1);
let globalActivities = [...initialActivities];
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

  const addActivity = (activity: Omit<Activity, 'id' | 'participants' | 'participantList' | 'joined' | 'roomCode' | 'organizerQrCode' | 'rewardClaimed' | 'status' | 'createdAt' | 'organizerId'> & { roomCode?: string }) => {
    const roomCode = activity.roomCode === ''
      ? ''
      : activity.roomCode || generateUniqueRoomCode();

    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      participants: 0,
      participantList: [],
      joined: false,
      roomCode,
      organizerQrCode: generateOrganizerQrCode(),
      rewardClaimed: false,
      status: 'active',
      organizerId: 'ORG-ME',
      organizerName: activity.organizerAnonymous ? undefined : '同學',
      organizerAnonymous: activity.organizerAnonymous,
      createdAt: new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' }),
    };
    globalActivities = [newActivity, ...globalActivities];
    notify();
    return newActivity;
  };

  const joinActivity = (id: number) => {
    let joined = false;
    globalActivities = globalActivities.map(a =>
      a.id === id && !a.joined && (a.maxParticipants === 0 || a.participants < a.maxParticipants)
        ? (joined = true, { ...a, joined: true, participants: a.participants + 1 })
        : a
    );
    notify();
    return joined;
  };

  const joinByCode = (code: string): Activity | null => {
    const normalizedCode = code.trim().toUpperCase();
    const activity = globalActivities.find(a => a.roomCode && a.roomCode === normalizedCode);
    if (activity && activity.maxParticipants > 0 && activity.participants >= activity.maxParticipants) {
      return null;
    }
    if (activity && !activity.joined) {
      return joinActivity(activity.id) ? activity : null;
    }
    return null;
  };

  const toggleTask = (activityId: number, taskId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? {
            ...a,
            tasks: a.tasks.map(t => t.id === taskId
              ? { ...t, completedCount: t.completed ? 0 : t.targetCount, completed: !t.completed }
              : t),
          }
        : a
    );
    notify();
  };

  const scanOrganizerQr = (activityId: number, taskId: number, qrCode: string) => {
    let valid = false;
    let completed = false;
    globalActivities = globalActivities.map(a =>
      a.id === activityId && a.organizerQrCode === qrCode.trim().toUpperCase()
        ? {
            ...a,
            tasks: a.tasks.map(t => {
              if (t.id !== taskId || t.completed) return t;
              valid = true;
              const completedCount = Math.min(t.completedCount + 1, t.targetCount);
              completed = completedCount >= t.targetCount;
              return { ...t, completedCount, completed };
            }),
          }
        : a
    );
    notify();
    return { valid, completed };
  };

  const verifyTask = (activityId: number, taskId: number) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, verified: true } : t) }
        : a
    );
    notify();
  };

  const answerQuiz = (activityId: number, quizId: number, selectedIndexes: number[]) => {
    globalActivities = globalActivities.map(a =>
      a.id === activityId
        ? { ...a, quiz: a.quiz.map(q => {
            if (q.id !== quizId) return q;
            const expected = [...q.correctIndexes].sort((x, y) => x - y);
            const selected = [...selectedIndexes].sort((x, y) => x - y);
            return { ...q, answered: true, correct: expected.length === selected.length && expected.every((value, index) => value === selected[index]) };
          }) }
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

  const deleteActivity = (activityId: number) => {
    globalActivities = globalActivities.filter(activity => activity.id !== activityId);
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
    scanOrganizerQr,
    verifyTask,
    answerQuiz,
    claimReward,
    endActivity,
    deleteActivity,
    distributeRewards,
  };
}
