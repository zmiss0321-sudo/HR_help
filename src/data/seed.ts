import { AppData, Intern, Job } from '../types';

export const jobs: Job[] = [
  {
    id: 'product',
    title: '产品运营实习生',
    department: '用户增长部',
    mentor: '周岚',
    week: 'Week 2',
    goal: '独立完成低风险运营任务，理解输出标准。',
    tools: ['飞书多维表格', '神策', '墨刀']
  },
  {
    id: 'qa',
    title: '研发测试实习生',
    department: '研发效能部',
    mentor: '陈启',
    week: 'Week 1',
    goal: '熟悉测试流程和工具环境，完成一次基础回归跟做。',
    tools: ['Jira', 'Postman', 'GitLab']
  },
  {
    id: 'sales',
    title: '销售实习生',
    department: '华东销售部',
    mentor: '何嘉',
    week: 'Week 2',
    goal: '能准确记录客户跟进动作，理解 CRM 字段含义。',
    tools: ['CRM', '企业微信', 'Excel']
  },
  {
    id: 'marketing',
    title: '市场内容实习生',
    department: '品牌市场部',
    mentor: '林蔚',
    week: 'Week 1',
    goal: '熟悉内容发布规范和素材检查流程。',
    tools: ['公众号后台', 'Canva', '剪映']
  }
];

const internSeed: Array<[string, string, number, boolean, Intern['currentStatus'], number, boolean]> = [
  ['林小夏', 'product', 8, true, '正常', 0, false],
  ['王一诺', 'product', 5, false, '需关注', 1, true],
  ['赵青禾', 'product', 12, true, '正常', 0, false],
  ['沈知远', 'product', 18, true, '需关注', 1, true],
  ['唐雨桐', 'product', 24, true, '正常', 0, false],
  ['陈景行', 'qa', 3, false, '高风险', 2, true],
  ['刘若安', 'qa', 6, true, '需关注', 1, true],
  ['孙明哲', 'qa', 10, true, '正常', 0, false],
  ['魏舒然', 'qa', 16, true, '需关注', 1, true],
  ['蒋晨', 'qa', 22, true, '正常', 0, false],
  ['郑可欣', 'sales', 4, true, '需关注', 1, false],
  ['韩予白', 'sales', 7, true, '正常', 0, false],
  ['马思源', 'sales', 13, false, '高风险', 2, true],
  ['顾念', 'sales', 19, true, '正常', 0, false],
  ['许闻舟', 'sales', 26, true, '正常', 0, false],
  ['苏禾', 'marketing', 2, false, '高风险', 2, true],
  ['陆星澜', 'marketing', 6, true, '正常', 0, false],
  ['叶清欢', 'marketing', 11, true, '需关注', 1, true],
  ['宋以沫', 'marketing', 17, true, '正常', 0, false],
  ['白景宁', 'marketing', 23, true, '正常', 0, false]
];

const onboardDates = [
  '2026-06-05',
  '2026-06-08',
  '2026-06-01',
  '2026-05-27',
  '2026-05-20',
  '2026-06-10',
  '2026-06-07',
  '2026-05-29',
  '2026-05-18',
  '2026-06-02',
  '2026-06-03',
  '2026-05-25',
  '2026-06-06',
  '2026-05-31',
  '2026-05-22',
  '2026-06-06',
  '2026-05-23',
  '2026-06-04',
  '2026-05-26',
  '2026-06-09'
];

const interns: Intern[] = internSeed.map(([name, jobId, onboardDays, feedbackSubmitted, currentStatus, stuckWeeks, mentorPending], index) => {
  const job = jobs.find((item) => item.id === jobId)!;
  return {
    id: `intern-${String(index + 1).padStart(2, '0')}`,
    name,
    jobId,
    mentor: job.mentor,
    onboardDate: onboardDates[index],
    onboardDays,
    feedbackSubmitted,
    currentStatus,
    stuckWeeks,
    mentorPending
  };
});

export const seedData: AppData = {
  jobs,
  interns,
  tasks: jobs.flatMap((job) => [
    { id: `${job.id}-task-1`, jobId: job.id, title: '阅读岗位 SOP', helper: '先知道这个岗位怎么做事。', status: '进行中' },
    { id: `${job.id}-task-2`, jobId: job.id, title: '完成一次基础任务跟做', helper: '照着 Mentor 示例完成一遍。', status: job.id === 'product' ? '已完成' : '未开始' },
    { id: `${job.id}-task-3`, jobId: job.id, title: '独立完成低风险任务', helper: '完成后让 Mentor 看一下输出标准。', status: job.id === 'qa' ? '卡住了' : '未开始' },
    { id: `${job.id}-task-4`, jobId: job.id, title: '提交一次本周轻反馈', helper: '只写本周完成、卡点和是否需要帮助。', status: '未开始' }
  ]),
  feedbacks: [
    {
      id: 'fb-1',
      internId: 'intern-02',
      done: '完成活动配置跟做，开始整理日报。',
      stuck: '不确定日报输出标准，怕写得太粗。',
      needsMentor: true,
      mood: '有点压力',
      createdAt: '2026-06-10'
    },
    {
      id: 'fb-2',
      internId: 'intern-06',
      done: '完成账号申请，但测试环境还没有跑通。',
      stuck: 'Postman 环境变量配置不确定。',
      needsMentor: true,
      mood: '压力很大',
      createdAt: '2026-06-10'
    },
    {
      id: 'fb-3',
      internId: 'intern-18',
      done: '跟做了一次内容排期。',
      stuck: '不知道封面素材授权要问谁。',
      needsMentor: true,
      mood: '正常',
      createdAt: '2026-06-10'
    }
  ],
  experiences: [
    { id: 'exp-1', jobId: 'product', type: '常见坑', title: '需求变更后同步检查表', content: '需求变更后要检查配置表、验收清单和上线说明是否都同步更新。', source: '历史实习生经验' },
    { id: 'exp-2', jobId: 'product', type: '推荐做法', title: '先确认输出样例', content: '第一次写日报前，先找 Mentor 要一份合格样例，比反复改更省时间。', source: 'Mentor 补充' },
    { id: 'exp-3', jobId: 'qa', type: '常见坑', title: '环境版本先确认', content: '复现问题前先确认分支、构建号和账号权限，避免无效排查。', source: '历史实习生经验' },
    { id: 'exp-4', jobId: 'sales', type: 'Mentor 提醒', title: '记录客户原话', content: '不要把客户模糊意向写成确定承诺，涉及承诺先让 Mentor 确认措辞。', source: 'Mentor 补充' },
    { id: 'exp-5', jobId: 'marketing', type: '前任建议', title: '发布前按账号检查', content: '预览必须在目标账号里完成，标题、封面、链接、权限都要看一遍。', source: '历史实习生经验' }
  ],
  exitReviews: [
    {
      id: 'review-1',
      jobId: 'product',
      pitfall: '活动需求变更后容易忘记同步检查清单。',
      reminder: '重新来一次会先确认验收样例。',
      advice: '建议下一任先学会读配置字段和验收表。',
      status: 'pending',
      createdAt: '2026-06-12'
    }
  ],
  templates: jobs.flatMap((job) => [
    { id: `${job.id}-w1`, jobId: job.id, week: 'Week 1', goal: '熟悉业务与工具', tasks: ['阅读岗位 SOP', '跟做基础任务'], output: '能说清岗位流程和常用工具', blockers: ['工具权限', '不知道问谁'] },
    { id: `${job.id}-w2`, jobId: job.id, week: 'Week 2', goal: '低风险任务独立尝试', tasks: ['独立完成一个低风险任务', '提交轻反馈'], output: '能按样例输出结果', blockers: ['输出标准不清'] },
    { id: `${job.id}-w3`, jobId: job.id, week: 'Week 3', goal: '参与真实业务任务', tasks: ['参与一次真实任务', '记录卡点'], output: '能说明任务背景和风险', blockers: ['业务理解不足'] },
    { id: `${job.id}-w4`, jobId: job.id, week: 'Week 4', goal: '复盘输出阶段成果', tasks: ['完成阶段复盘', '整理给下一任的提醒'], output: '形成可复用经验', blockers: ['复盘只罗列事情'] }
  ])
};
