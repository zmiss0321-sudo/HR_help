import {
  AlertCircle,
  BookOpenCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Lightbulb,
  MessageSquareText,
  PenLine,
  RotateCcw,
  Send,
  Sparkles,
  UsersRound,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Role = 'intern' | 'mentor' | 'hr';
type Status = '暂无问题' | '有不清楚' | '需 HR 关注' | '待审核经验' | '已处理';
type StageStatus = '已完成' | '当前进行中' | '未开始';

type ChecklistStage = {
  id: string;
  title: string;
  status: StageStatus;
  items: string[];
};

type Intern = {
  id: string;
  name: string;
  job: '产品' | '运营' | '设计' | '开发';
  role: string;
  mentor: string;
  week: number;
  cycle: '3 个月' | '6 个月';
  stage: string;
  stageGroup: '第 1 周' | '第 2-3 周' | '独立产出中' | '准备交接';
  focus: string;
  recentBlocker: string;
  latestFeedback: string;
  status: Status;
  pending: number;
  needsHr: boolean;
  lastFeedbackAt: string;
  checklist: ChecklistStage[];
};

type InternSetup = {
  name: string;
  job: Intern['job'];
  onboardDate: string;
};

type MentorSetup = {
  name: string;
};

type TemplateGroup = {
  id: string;
  title: string;
  items: string[];
};

const ROLE_KEY = 'teaching-demo-role';
const INTERN_SETUP_KEY = 'teaching-demo-intern-setup';
const MENTOR_SETUP_KEY = 'teaching-demo-mentor-setup';

const defaultChecklist: ChecklistStage[] = [
  {
    id: 'w1',
    title: '第 1 周：熟悉工具和权限',
    status: '已完成',
    items: ['开通飞书、项目管理、文档库权限', '找到常用联系人和项目入口', '先看业务文档，不急着独立产出']
  },
  {
    id: 'w2',
    title: '第 2 周：第一次参与需求评审',
    status: '当前进行中',
    items: ['看需求背景', '看目标用户', '记录不懂的问题', '跟 Mentor 确认评审重点']
  },
  {
    id: 'w4',
    title: '第 3-4 周：尝试写一版简单 PRD',
    status: '未开始',
    items: ['看一份写得好的旧 PRD', '写一版简单结构', '把不确定的地方标成待确认']
  }
];

const internsSeed: Intern[] = [
  {
    id: 'li',
    name: '李同学',
    job: '产品',
    role: '产品实习生',
    mentor: '张同学',
    week: 2,
    cycle: '3 个月',
    stage: '第一次参与需求评审',
    stageGroup: '第 2-3 周',
    focus: '需求评审',
    recentBlocker: '不知道需求评审前要准备什么',
    latestFeedback: '评审前要看哪些材料不太清楚，我怕只记功能点，没听懂为什么要做。',
    status: '有不清楚',
    pending: 1,
    needsHr: true,
    lastFeedbackAt: '今天 14:20',
    checklist: defaultChecklist
  },
  {
    id: 'sun',
    name: '孙同学',
    job: '产品',
    role: '产品实习生',
    mentor: '张同学',
    week: 12,
    cycle: '3 个月',
    stage: '准备交接',
    stageGroup: '准备交接',
    focus: '整理交接文档',
    recentBlocker: '交接文档写到多细不清楚',
    latestFeedback: '我不知道要不要把每次需求变更原因也写进交接。',
    status: '暂无问题',
    pending: 0,
    needsHr: false,
    lastFeedbackAt: '周二 11:05',
    checklist: defaultChecklist.map((item) => ({ ...item, status: item.id === 'w4' ? '当前进行中' : '已完成' }))
  },
  {
    id: 'wang',
    name: '王同学',
    job: '运营',
    role: '运营实习生',
    mentor: '王同学',
    week: 5,
    cycle: '6 个月',
    stage: '活动复盘',
    stageGroup: '独立产出中',
    focus: '独立做一次活动复盘',
    recentBlocker: '数据口径看不懂',
    latestFeedback: '活动复盘里的 UV、转化率和下单人数口径我有点对不上。',
    status: '暂无问题',
    pending: 0,
    needsHr: false,
    lastFeedbackAt: '昨天 18:10',
    checklist: defaultChecklist
  },
  {
    id: 'chen',
    name: '陈同学',
    job: '开发',
    role: '开发实习生',
    mentor: '陈同学',
    week: 1,
    cycle: '3 个月',
    stage: '环境配置',
    stageGroup: '第 1 周',
    focus: '本地环境跑起来',
    recentBlocker: '本地环境一直 401',
    latestFeedback: '我用了文档里的配置，但接口一直 401，不确定是不是权限问题。',
    status: '需 HR 关注',
    pending: 1,
    needsHr: true,
    lastFeedbackAt: '今天 10:45',
    checklist: defaultChecklist.map((item) => item.id === 'w1' ? { ...item, status: '当前进行中' } : { ...item, status: '未开始' })
  },
  {
    id: 'zhao',
    name: '赵同学',
    job: '设计',
    role: '设计实习生',
    mentor: '林同学',
    week: 8,
    cycle: '6 个月',
    stage: '独立交付',
    stageGroup: '独立产出中',
    focus: '按组件规范交付设计稿',
    recentBlocker: '切图命名不确定',
    latestFeedback: '切图交付要不要按页面分文件夹，我没找到最新说明。',
    status: '有不清楚',
    pending: 1,
    needsHr: false,
    lastFeedbackAt: '周三 16:30',
    checklist: defaultChecklist
  }
];

const mentorProfiles: Record<string, { job: Intern['job']; title: string }> = {
  张同学: { job: '产品', title: '产品 Mentor' },
  王同学: { job: '运营', title: '运营 Mentor' },
  林同学: { job: '设计', title: '设计 Mentor' },
  陈同学: { job: '开发', title: '开发 Mentor' }
};

const formerTips = [
  '第一次参加评审别急着发言，先听清楚业务方到底想解决什么，不然你只会记一堆功能点。',
  '问问题别只说“报错了”，最好把截图、页面路径、你刚刚点了什么一起发，不然 Mentor 还要反过来问你。',
  '需求文档先看最后更新时间，有些旧文档已经不用了，我之前照着旧流程白做了一版。',
  '刚开始不要怕问很小的问题，但最好先自己试 10 分钟，再带着截图去问。'
];

const mentorTemplateSeed: TemplateGroup[] = [
  { id: 'prep', title: '入职前准备', items: ['确认账号权限是否开通', '准备常用文档入口', '确认新人第一个任务方向'] },
  { id: 'day1', title: '入职第 1 天', items: ['介绍团队成员和协作方式', '帮新人跑通工作工具', '说明需求评审、日报、周会规则'] },
  { id: 'week1', title: '第 1 周', items: ['陪新人参加一次需求评审', '让新人整理一份会议纪要', '检查新人是否知道问题该问谁'] },
  { id: 'week23', title: '第 2-3 周', items: ['安排一个低风险任务', '让新人尝试写简单 PRD', 'Mentor 只看逻辑，不要直接代写'] },
  { id: 'week4', title: '第 4 周', items: ['复盘新人完成的任务', '标记常卡点问题', '判断是否需要 HR 介入'] }
];

const reviewSeed = [
  {
    id: 'r1',
    type: '前任实习生留下的坑',
    content: '别只说“报错了”，要带截图、页面路径、操作步骤，这样 Mentor 才能一下看懂你卡在哪里。',
    tags: '沟通同步｜开发协作',
    source: '开发实习生'
  },
  {
    id: 'r2',
    type: 'Mentor 带教经验',
    content: '新人第一次参会前，先告诉他会上主要听业务目标、用户场景、核心流程和待确认问题。',
    tags: '需求评审｜产品',
    source: '产品 Mentor'
  }
];

const aiIssues = [
  {
    title: '需求评审前准备不清楚',
    detail: '出现 4 次｜主要集中在产品实习生入职 1-2 周',
    advice: '建议：Mentor 在评审前给新人一份材料清单。'
  },
  {
    title: '不知道问题应该问谁',
    detail: '出现 3 次｜多发生在刚入职阶段',
    advice: '建议：增加“团队协作联系人说明”。'
  },
  {
    title: '交接文档不够细',
    detail: '出现 2 次｜多来自开发实习生反馈',
    advice: '建议：交接模板里补充页面路径、操作步骤和截图要求。'
  }
];

export default function App() {
  const [role, setRole] = useState<Role | null>(() => safeRole(localStorage.getItem(ROLE_KEY)));
  const [internSetup, setInternSetup] = useState<InternSetup | null>(() => readJson(INTERN_SETUP_KEY));
  const [mentorSetup, setMentorSetup] = useState<MentorSetup | null>(() => readJson(MENTOR_SETUP_KEY));
  const [interns, setInterns] = useState(internsSeed);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const resetDemo = () => {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(INTERN_SETUP_KEY);
    localStorage.removeItem(MENTOR_SETUP_KEY);
    setRole(null);
    setInternSetup(null);
    setMentorSetup(null);
    setInterns(internsSeed);
    showToast('已回到演示首页');
  };

  if (!role) {
    return <HomeGate onChoose={(nextRole) => { localStorage.setItem(ROLE_KEY, nextRole); setRole(nextRole); }} />;
  }

  return (
    <main className={`app-bg ${role}-bg`}>
      {role === 'intern' && !internSetup ? <InternSetupModal onDone={(setup) => { localStorage.setItem(INTERN_SETUP_KEY, JSON.stringify(setup)); setInternSetup(setup); }} /> : null}
      {role === 'intern' && internSetup ? <InternHome setup={internSetup} onToast={showToast} /> : null}
      {role === 'mentor' && !mentorSetup ? <MentorSetupModal onDone={(setup) => { localStorage.setItem(MENTOR_SETUP_KEY, JSON.stringify(setup)); setMentorSetup(setup); }} /> : null}
      {role === 'mentor' && mentorSetup ? <MentorHome setup={mentorSetup} interns={interns} setInterns={setInterns} onToast={showToast} /> : null}
      {role === 'hr' ? <HrHome interns={interns} onToast={showToast} /> : null}
      <button className="demo-reset" onClick={resetDemo}><RotateCcw size={14} /> 重新演示</button>
      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

function HomeGate({ onChoose }: { onChoose: (role: Role) => void }) {
  return (
    <main className="home-gate">
      <section className="gate-card">
        <div className="gate-mark"><BookOpenCheck size={22} /></div>
        <h1>新人带教站</h1>
        <p>把反复讲、反复问、反复踩坑的内容，沉淀成每个人能看懂的上手清单。</p>
        <div className="gate-actions">
          <button onClick={() => onChoose('intern')}>我是实习生</button>
          <button onClick={() => onChoose('mentor')}>我是 Mentor</button>
          <button onClick={() => onChoose('hr')}>我是 HR</button>
        </div>
      </section>
    </main>
  );
}

function InternSetupModal({ onDone }: { onDone: (setup: InternSetup) => void }) {
  const [setup, setSetup] = useState<InternSetup>({ name: '李同学', job: '产品', onboardDate: '2026-06-03' });
  return (
    <section className="setup-modal-shell">
      <div className="setup-modal">
        <PanelTitle title="确认你的信息" note="只用于生成个人上手清单" icon={<ClipboardList size={18} />} />
        <label><span>你的姓名</span><input value={setup.name} onChange={(event) => setSetup({ ...setup, name: event.target.value })} /></label>
        <label><span>你的岗位</span><select value={setup.job} onChange={(event) => setSetup({ ...setup, job: event.target.value as Intern['job'] })}><option>产品</option><option>运营</option><option>设计</option><option>开发</option></select></label>
        <label><span>到岗日期</span><input type="date" value={setup.onboardDate} onChange={(event) => setSetup({ ...setup, onboardDate: event.target.value })} /></label>
        <button className="primary full" onClick={() => onDone(setup)}>进入我的上手清单</button>
      </div>
    </section>
  );
}

function MentorSetupModal({ onDone }: { onDone: (setup: MentorSetup) => void }) {
  const [name, setName] = useState('张同学');
  return (
    <section className="setup-modal-shell">
      <div className="setup-modal">
        <PanelTitle title="确认 Mentor 身份" note="系统会显示你固定带教的岗位和实习生" icon={<UsersRound size={18} />} />
        <label><span>你的姓名</span><select value={name} onChange={(event) => setName(event.target.value)}>{Object.keys(mentorProfiles).map((mentor) => <option key={mentor}>{mentor}</option>)}</select></label>
        <div className="mentor-profile-note">{mentorProfiles[name].title}｜固定带教 {mentorProfiles[name].job} 岗实习生</div>
        <button className="primary full" onClick={() => onDone({ name })}>进入 Mentor 页面</button>
      </div>
    </section>
  );
}

function PageHead({ title, meta, right }: { title: string; meta?: string; right?: React.ReactNode }) {
  return <header className="page-head"><div><h1>{title}</h1>{meta ? <p>{meta}</p> : null}</div>{right ? <div className="page-head-right">{right}</div> : null}</header>;
}

function InternHome({ setup, onToast }: { setup: InternSetup; onToast: (message: string) => void }) {
  const week = weekFromDate(setup.onboardDate);
  const [openStage, setOpenStage] = useState('w2');
  const [selectedTask, setSelectedTask] = useState('');
  const [confusedTask, setConfusedTask] = useState('');
  const [summary, setSummary] = useState({ unclear: '', stuck: '', add: '' });

  const markConfused = (task: string) => {
    setSelectedTask(task);
    setConfusedTask(task);
    setSummary((current) => ({ ...current, unclear: current.unclear || `我看不懂：${task}` }));
  };

  return (
    <section className="page-shell intern-page">
      <PageHead title="我的上手清单" meta={`${setup.job}实习生｜入职第 ${week} 周｜Mentor：张同学`} />
      <div className="intern-workspace">
        <section className="panel intern-main-panel">
          <PanelTitle title="我的带教清单 / 本周任务" note="当前重点：第一次参与需求评审" icon={<ClipboardList size={18} />} />
          <div className="timeline compact-list">
            {defaultChecklist.map((stage) => (
              <article key={stage.id} className={`stage-card ${stage.status === '当前进行中' ? 'current' : ''}`}>
                <button className="stage-head" onClick={() => setOpenStage(openStage === stage.id ? '' : stage.id)}>
                  <span className="stage-dot" />
                  <div><strong>{stage.title}</strong><em className={`tag ${stage.status === '当前进行中' ? 'info' : stage.status === '已完成' ? 'success' : 'quiet'}`}>{stage.status}</em></div>
                  <ChevronDown size={16} className={openStage === stage.id ? 'rotate' : ''} />
                </button>
                {openStage === stage.id ? (
                  <div className="stage-body">
                    {stage.items.map((item) => (
                      <div className={`task-action-row ${selectedTask === item ? 'selected' : ''}`} key={item}>
                        <button className="task-main" onClick={() => setSelectedTask(selectedTask === item ? '' : item)}><Check size={15} /><span>{item}</span></button>
                        <button className="confuse-btn" onClick={() => markConfused(item)}>我看不懂</button>
                        {selectedTask === item ? <p className="task-help">补充说明：先确认资料入口、负责人和完成标准；如果 10 分钟内还不确定，就带着截图问 Mentor。</p> : null}
                        {confusedTask === item ? (
                          <div className="confuse-input">
                            <label><span>你具体看不懂哪里？</span><textarea placeholder="例如：我不知道这份文档在哪里，或不知道该找谁确认..." /></label>
                            <button className="secondary" onClick={() => onToast('已加入本周反馈')}>加入本周反馈</button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
          <div className="inline-summary">
            <PanelTitle title="本周反馈" note="只写哪里看不懂、哪里卡住，不做周报" icon={<MessageSquareText size={18} />} />
            <div className="feedback-grid">
              <label><span>哪里看不懂？</span><textarea value={summary.unclear} onChange={(event) => setSummary({ ...summary, unclear: event.target.value })} /></label>
              <label><span>哪里卡住？</span><textarea value={summary.stuck} onChange={(event) => setSummary({ ...summary, stuck: event.target.value })} /></label>
              <label><span>希望 Mentor 补什么说明？</span><textarea value={summary.add} onChange={(event) => setSummary({ ...summary, add: event.target.value })} /></label>
            </div>
            <div className="right-actions"><button className="primary" onClick={() => onToast('反馈已提交')}>提交反馈</button></div>
          </div>
        </section>
        <aside className="panel intern-tips-panel">
          <PanelTitle title="前任经验" icon={<Lightbulb size={18} />} />
          <div className="tip-stack">{formerTips.map((tip) => <p key={tip}>“{tip}”</p>)}</div>
        </aside>
      </div>
    </section>
  );
}

function MentorHome({ setup, interns, setInterns, onToast }: { setup: MentorSetup; interns: Intern[]; setInterns: React.Dispatch<React.SetStateAction<Intern[]>>; onToast: (message: string) => void }) {
  const mentorProfile = mentorProfiles[setup.name] ?? mentorProfiles['张同学'];
  const myInterns = interns.filter((intern) => intern.mentor === setup.name && intern.job === mentorProfile.job);
  const [selected, setSelected] = useState<Intern | null>(null);
  const [drawer, setDrawer] = useState<Intern | null>(null);
  const [template, setTemplate] = useState<TemplateGroup[]>(mentorTemplateSeed);
  const pending = myInterns.reduce((sum, intern) => sum + intern.pending, 0);
  const needsHr = myInterns.filter((intern) => intern.needsHr).length;

  const saveIntern = (updated: Intern) => {
    setInterns((current) => current.map((intern) => intern.id === updated.id ? updated : intern));
    setSelected(updated);
    onToast('已保存进度');
  };

  return (
    <section className="page-shell mentor-simple-page">
      <PageHead title="我带的实习生" meta={`${mentorProfile.title}｜固定带教 ${mentorProfile.job} 岗`} right={<div className="inline-metrics"><span>当前带教 {myInterns.length}</span><span>待处理反馈 {pending}</span><span>需 HR 关注 {needsHr}</span></div>} />
      <div className="mentor-simple-grid">
        <section className="panel mentor-left-list">
          <PanelTitle title="实习生卡片列表" note="点击卡片后，右侧切换为对应带教计划" icon={<UsersRound size={18} />} />
          <div className="mentor-panel-body mentor-intern-list simple">
            {myInterns.map((intern) => (
              <button key={intern.id} className={`mentor-card-simple ${selected?.id === intern.id ? 'active' : ''}`} onClick={() => setSelected(intern)}>
                <div><strong>{intern.name}</strong><span className={`tag ${tagTone(intern.status)}`}>{intern.status}</span></div>
                <p>{intern.role}｜入职第 {intern.week} 周｜{intern.cycle}实习</p>
                <dl><dt>当前阶段</dt><dd>{intern.stage}</dd><dt>最近卡点</dt><dd>{intern.recentBlocker}</dd><dt>待处理</dt><dd>{intern.pending} 条</dd><dt>HR 关注</dt><dd>{intern.needsHr ? '需要' : '不需要'}</dd></dl>
              </button>
            ))}
          </div>
        </section>
        <section className="panel mentor-right-content">
          {selected ? (
            <StudentTeachingPanel intern={selected} onSave={saveIntern} onOpenDrawer={() => setDrawer(selected)} onToast={onToast} />
          ) : (
            <DefaultTeachingTemplate template={template} onSave={setTemplate} onToast={onToast} />
          )}
        </section>
      </div>
      {drawer ? <FeedbackDrawer intern={drawer} onClose={() => setDrawer(null)} onSave={() => { setDrawer(null); onToast('已保存处理'); }} /> : null}
    </section>
  );
}

function DefaultTeachingTemplate({ template, onSave, onToast }: { template: TemplateGroup[]; onSave: (template: TemplateGroup[]) => void; onToast: (message: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TemplateGroup[]>(template);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const startEdit = () => {
    setDraft(template.map((group) => ({ ...group, items: [...group.items] })));
    setEditing(true);
  };

  const updateItem = (groupId: string, index: number, value: string) => {
    setDraft((current) => current.map((group) => group.id === groupId ? { ...group, items: group.items.map((item, itemIndex) => itemIndex === index ? value : item) } : group));
  };

  const addItem = (groupId: string) => {
    setDraft((current) => current.map((group) => group.id === groupId ? { ...group, items: [...group.items, '新增带教事项'] } : group));
  };

  const removeItem = (groupId: string, index: number) => {
    setDraft((current) => current.map((group) => group.id === groupId ? { ...group, items: group.items.filter((_, itemIndex) => itemIndex !== index) } : group));
  };

  const save = () => {
    onSave(draft);
    setEditing(false);
    onToast('默认带教模板已保存');
  };

  const visibleTemplate = editing ? draft : template;

  return (
    <>
      <div className="template-toolbar">
        <PanelTitle title="默认带教模板" note="未选择同学时展示通用带教方案" icon={<PenLine size={18} />} />
        <div className="button-row">
          {editing ? (
            <>
              <button className="secondary" onClick={() => { setDraft(template); setEditing(false); }}>取消</button>
              <button className="primary" onClick={save}>保存模板</button>
            </>
          ) : (
            <button className="secondary" onClick={startEdit}>编辑模板</button>
          )}
        </div>
      </div>
      <div className="mentor-panel-body template-checklist-scroll">
        {visibleTemplate.map((group) => (
          <article className="checklist-group" key={group.id}>
            <h3>{group.title}</h3>
            <div className="checklist-items">
              {group.items.map((item, index) => {
                const key = `${group.id}-${index}`;
                return editing ? (
                  <div className="checklist-edit-row" key={key}>
                    <input value={item} onChange={(event) => updateItem(group.id, index, event.target.value)} />
                    <button className="tiny-icon danger" onClick={() => removeItem(group.id, index)}>删除</button>
                  </div>
                ) : (
                  <label className="checklist-item" key={key}>
                    <input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked({ ...checked, [key]: event.target.checked })} />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
            {editing ? <button className="secondary add-item-row" onClick={() => addItem(group.id)}>新增 checklist 项</button> : null}
          </article>
        ))}
      </div>
    </>
  );
}

function StudentTeachingPanel({ intern, onSave, onOpenDrawer, onToast }: { intern: Intern; onSave: (intern: Intern) => void; onOpenDrawer: () => void; onToast: (message: string) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const planGroups: TemplateGroup[] = [
    { id: 'focus', title: '本周重点', items: [intern.stage] },
    { id: 'todo', title: '待处理', items: ['评审前告诉新人要提前看哪些材料', '让新人记录不理解的问题', '会后让新人整理需求背景、用户场景、核心流程'] },
    { id: 'feedback', title: 'Mentor 反馈', items: ['不要直接讲答案，先让新人说自己的理解', '如果连续两次不清楚需求背景，再标记给 HR 关注'] }
  ];

  return (
    <>
      <PanelTitle title={`${intern.name}的带教计划`} note={`${intern.role}｜入职第 ${intern.week} 周｜当前重点：${intern.focus}`} icon={<ClipboardList size={18} />} />
      <div className="mentor-panel-body student-plan-scroll">
        {planGroups.map((group) => (
          <article className="checklist-group student-plan-group" key={group.id}>
            <h3>{group.title}</h3>
            <div className="checklist-items">
              {group.items.map((item, index) => {
                const key = `${group.id}-${index}`;
                return (
                  <label className="checklist-item" key={key}>
                    <input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked({ ...checked, [key]: event.target.checked })} />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
        <label className="mentor-note-field"><span>Mentor 可补充说明</span><textarea placeholder="例如：评审前先看需求背景、目标用户、核心流程和待确认问题。" /></label>
        <div className="button-row plan-actions">
          <button className="primary" onClick={() => onSave(intern)}>保存进度</button>
          <button className="secondary" onClick={onOpenDrawer}>标记需要 HR 关注</button>
          <button className="secondary" onClick={() => onToast('已生成带教建议')}>生成带教建议</button>
        </div>
      </div>
    </>
  );
}

function FeedbackDrawer({ intern, onClose, onSave }: { intern: Intern; onClose: () => void; onSave: () => void }) {
  const [needHr, setNeedHr] = useState(intern.needsHr);
  return (
    <Drawer title={`${intern.name}的反馈处理`} onClose={onClose}>
      <section className="drawer-section"><h3>当前反馈</h3><p className="quote">“{intern.recentBlocker}”</p></section>
      <section className="drawer-section hint-box"><h3>系统提示</h3><p>这个问题可能是清单没写清楚，可以补到该同学的实际带教内容里。</p></section>
      <section className="drawer-section"><h3>给实习生反馈</h3><textarea placeholder="给一个明确解释..." /></section>
      <section className="drawer-section"><h3>处理结果</h3>{['已解释', '已更新个人清单', '已沉淀为带教经验'].map((item) => <label className="check-field" key={item}><input type="radio" name="mentor-result" defaultChecked={item === '已解释'} /><span>{item}</span></label>)}<label className="check-field"><input type="checkbox" checked={needHr} onChange={(event) => setNeedHr(event.target.checked)} /><span>需要 HR 关注</span></label><button className="primary full" onClick={onSave}>保存处理</button></section>
    </Drawer>
  );
}

function HrHome({ interns, onToast }: { interns: Intern[]; onToast: (message: string) => void }) {
  const [jobFilter, setJobFilter] = useState('全部岗位');
  const [stageFilter, setStageFilter] = useState('全部阶段');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [hrQueueIds, setHrQueueIds] = useState(() => interns.filter((intern) => intern.needsHr).map((intern) => intern.id));
  const [selected, setSelected] = useState<Intern | null>(interns.find((intern) => hrQueueIds.includes(intern.id)) ?? interns[0]);
  const [expandedId, setExpandedId] = useState('');
  const [drawer, setDrawer] = useState<Intern | null>(null);
  const [reviews, setReviews] = useState(reviewSeed);
  const [editing, setEditing] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const aiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeAi = (event: MouseEvent) => {
      if (aiRef.current && !aiRef.current.contains(event.target as Node)) setAiOpen(false);
    };
    document.addEventListener('mousedown', closeAi);
    return () => document.removeEventListener('mousedown', closeAi);
  }, []);

  const needHr = interns.filter((intern) => hrQueueIds.includes(intern.id));
  const currentIssue = selected && hrQueueIds.includes(selected.id) ? selected : needHr[0] ?? null;
  const filtered = interns.filter((intern) => {
    return (jobFilter === '全部岗位' || intern.job === jobFilter)
      && (stageFilter === '全部阶段' || intern.stageGroup === stageFilter)
      && (statusFilter === '全部状态' || intern.status === statusFilter);
  });

  const saveHrIssue = () => {
    if (!currentIssue) return;
    const nextIds = hrQueueIds.filter((id) => id !== currentIssue.id);
    setHrQueueIds(nextIds);
    const nextIssue = interns.find((intern) => nextIds.includes(intern.id)) ?? filtered.find((intern) => intern.id !== currentIssue.id) ?? null;
    setSelected(nextIssue);
    setEditing(false);
    onToast('已保存处理结果');
  };

  return (
    <section className="page-shell hr-shell">
      <PageHead title="HR 观察台" right={<div className="hr-head-metrics"><button onClick={() => setStatusFilter('全部状态')}>实习生 24</button><button onClick={() => onToast('已定位待审核经验')}>待审核经验 {reviews.length}</button><button onClick={() => setStatusFilter('需 HR 关注')}>需关注 {needHr.length}</button></div>} />
      <div className="filter-ai-row">
        <div className="select-filter-row">
          <label><span>岗位</span><select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)}><option>全部岗位</option><option>产品</option><option>运营</option><option>设计</option><option>开发</option></select></label>
          <label><span>阶段</span><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}><option>全部阶段</option><option>第 1 周</option><option>第 2-3 周</option><option>独立产出中</option><option>准备交接</option></select></label>
          <label><span>状态</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>全部状态</option><option>有不清楚</option><option>需 HR 关注</option><option>待审核经验</option></select></label>
        </div>
        <div className="ai-dropdown-wrap" ref={aiRef}>
          <button className={`ai-entry ${aiOpen ? 'active' : ''}`} onClick={() => setAiOpen((open) => !open)}><Sparkles size={16} /> AI 提取高频卡点 <span>已识别 3 类问题</span></button>
          {aiOpen ? (
            <div className="ai-popover">
              <h3>AI 提取高频卡点</h3>
              {aiIssues.map((issue, index) => <article key={issue.title}><strong>{index + 1}. {issue.title}</strong><span>{issue.detail}</span><p>{issue.advice}</p></article>)}
              <button className="primary full" onClick={() => onToast('已生成处理建议')}>生成处理建议</button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="hr-two-column">
        <section className="panel hr-left-panel">
          <PanelTitle title="实习生状态" note={`${filtered.length} 人，列表内部滚动`} icon={<UsersRound size={18} />} />
          <div className="hr-student-list tall">
            {filtered.map((intern) => (
              <article key={intern.id} className={`hr-student-card ${selected?.id === intern.id ? 'active' : ''}`}>
                <button onClick={() => { setSelected(intern); setExpandedId(expandedId === intern.id ? '' : intern.id); }}>
                  <strong>{intern.name}｜{intern.role}</strong>
                  <span>Mentor：{intern.mentor}｜入职第 {intern.week} 周</span>
                  <span>当前阶段：{intern.stage}</span>
                  <em className={`tag ${tagTone(intern.status)}`}>{hrQueueIds.includes(intern.id) ? '需 HR 关注' : intern.status}</em>
                </button>
                {expandedId === intern.id ? <div className="hr-expanded"><p>最近反馈：{intern.latestFeedback}</p><button className="secondary" onClick={() => setDrawer(intern)}>打开处理抽屉</button></div> : null}
              </article>
            ))}
          </div>
        </section>
        <aside className="hr-right-stack">
          <section className="panel">
            <PanelTitle title="需要 HR 关注" note="只放需要介入或共性问题" icon={<AlertCircle size={18} />} />
            {currentIssue ? (
              <div className="focus-card compact">
                <h3>{currentIssue.name}：{currentIssue.recentBlocker}</h3>
                <p>{currentIssue.latestFeedback}</p>
                {editing ? <textarea defaultValue="判断是否需要更新默认带教底稿，并联系 Mentor 确认。" /> : null}
                <div className="button-row"><button className="secondary" onClick={() => setEditing(true)}>编辑判断</button><button className="primary" onClick={saveHrIssue}>保存</button><button className="secondary" onClick={() => setDrawer(currentIssue)}>打开处理抽屉</button></div>
              </div>
            ) : (
              <div className="empty-state">暂无需要 HR 关注的问题</div>
            )}
          </section>
          <section className="panel">
            <PanelTitle title="经验审核" note="待审核经验卡片" icon={<BookOpenCheck size={18} />} />
            <div className="review-stack compact-scroll">
              {reviews.map((review) => <article className="review-card" key={review.id}><span>{review.type}</span><p>“{review.content}”</p><small>标签：{review.tags}｜来源：{review.source}</small><div className="button-row"><button className="primary" onClick={() => { setReviews((current) => current.filter((item) => item.id !== review.id)); onToast('已通过审核'); }}>通过</button><button className="secondary" onClick={() => onToast('已标记为修改后通过')}>修改后通过</button><button className="danger-text" onClick={() => setReviews((current) => current.filter((item) => item.id !== review.id))}>不采用</button></div></article>)}
            </div>
          </section>
        </aside>
      </div>
      {drawer ? <HrDrawer intern={drawer} onClose={() => setDrawer(null)} onToast={onToast} /> : null}
    </section>
  );
}

function HrDrawer({ intern, onClose, onToast }: { intern: Intern; onClose: () => void; onToast: (message: string) => void }) {
  return (
    <Drawer title={`${intern.name}的问题记录`} onClose={onClose}>
      <section className="drawer-section"><h3>基本信息</h3><Info label="所属岗位" value={intern.role} /><Info label="Mentor" value={intern.mentor} /><Info label="入职时间" value={`第 ${intern.week} 周｜当前阶段：${intern.stage}`} /></section>
      <section className="drawer-section"><h3>最近反馈</h3><p className="quote">“{intern.latestFeedback}”</p></section>
      <section className="drawer-section"><h3>HR 判断</h3><label className="check-field"><input type="checkbox" defaultChecked={intern.needsHr} /><span>这是共性问题</span></label><label className="check-field"><input type="checkbox" defaultChecked={intern.needsHr} /><span>需要更新默认带教底稿</span></label><label><span>处理记录</span><textarea placeholder="记录是否需要进入岗位基础带教包、是否联系 Mentor..." /></label><button className="primary full" onClick={() => { onClose(); onToast('已保存'); }}>保存</button></section>
    </Drawer>
  );
}

function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <><div className="drawer-scrim" onClick={onClose} /><aside className="drawer" role="dialog" aria-modal="true"><div className="drawer-head"><h2>{title}</h2><button aria-label="关闭" onClick={onClose}><X size={18} /></button></div><div className="drawer-body">{children}</div></aside></>;
}

function PanelTitle({ title, note, icon }: { title: string; note?: string; icon: React.ReactNode }) {
  return <div className="panel-title"><div>{icon}<h2>{title}</h2></div>{note ? <p>{note}</p> : null}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info-pair"><span>{label}</span><strong>{value}</strong></div>;
}

function tagTone(status: Status) {
  if (status === '有不清楚') return 'warning';
  if (status === '需 HR 关注') return 'danger';
  if (status === '已处理') return 'success';
  return 'quiet';
}

function weekFromDate(dateString: string) {
  const start = new Date(`${dateString}T00:00:00+08:00`);
  const now = new Date('2026-06-14T00:00:00+08:00');
  const diff = Math.max(1, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1);
  return Math.max(1, Math.ceil(diff / 7));
}

function safeRole(value: string | null): Role | null {
  return value === 'intern' || value === 'mentor' || value === 'hr' ? value : null;
}

function readJson<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
