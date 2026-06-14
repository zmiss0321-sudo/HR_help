export type Role = 'intern' | 'mentor' | 'hr';
export type PageKey = 'home' | 'intern' | 'mentor' | 'hr';
export type TaskStatus = '未开始' | '进行中' | '卡住了' | '已完成';
export type MoodStatus = '轻松' | '正常' | '有点压力' | '压力很大';
export type RiskStatus = '正常' | '需关注' | '高风险';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs_edit';

export interface Job {
  id: string;
  title: string;
  department: string;
  mentor: string;
  week: string;
  goal: string;
  tools: string[];
}

export interface GrowthTask {
  id: string;
  jobId: string;
  title: string;
  helper: string;
  status: TaskStatus;
}

export interface Intern {
  id: string;
  name: string;
  jobId: string;
  mentor: string;
  onboardDate?: string;
  onboardDays: number;
  feedbackSubmitted: boolean;
  currentStatus: RiskStatus;
  stuckWeeks: number;
  mentorPending: boolean;
}

export interface LightFeedback {
  id: string;
  internId: string;
  done: string;
  stuck: string;
  needsMentor: boolean;
  mood: MoodStatus;
  mentorReply?: {
    status: RiskStatus;
    action: '继续推进' | '补充案例' | '重新讲解' | '约一次沟通';
    note: string;
  };
  createdAt: string;
}

export interface JobExperience {
  id: string;
  jobId: string;
  type: '常见坑' | '前任建议' | 'Mentor 提醒' | '推荐做法';
  title: string;
  content: string;
  source: '历史实习生经验' | 'Mentor 补充';
}

export interface ExitReview {
  id: string;
  jobId: string;
  pitfall: string;
  reminder: string;
  advice: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface TeachingTemplate {
  id: string;
  jobId: string;
  week: string;
  goal: string;
  tasks: string[];
  output: string;
  blockers: string[];
}

export interface AppData {
  jobs: Job[];
  interns: Intern[];
  tasks: GrowthTask[];
  feedbacks: LightFeedback[];
  experiences: JobExperience[];
  exitReviews: ExitReview[];
  templates: TeachingTemplate[];
}
