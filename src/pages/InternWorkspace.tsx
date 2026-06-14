import { BookOpenCheck, CheckCircle2, Circle, MessageSquareText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppData, ExitReview, LightFeedback, MoodStatus, TaskStatus } from '../types';
import { daysSinceOnboard, weekFromOnboard } from '../utils/week';

interface InternWorkspaceProps {
  data: AppData;
  setData: (data: AppData) => void;
  selectedInternId: string;
  selectedJobId: string;
  onboardDate: string;
}

const taskStatuses: TaskStatus[] = ['未开始', '进行中', '卡住了', '已完成'];
const moods: MoodStatus[] = ['轻松', '正常', '有点压力', '压力很大'];

function nextTaskStatus(status: TaskStatus) {
  const index = taskStatuses.indexOf(status);
  return taskStatuses[(index + 1) % taskStatuses.length];
}

export function InternWorkspace({ data, setData, selectedInternId, selectedJobId, onboardDate }: InternWorkspaceProps) {
  const job = data.jobs.find((item) => item.id === selectedJobId) ?? data.jobs[0];
  const intern = data.interns.find((item) => item.id === selectedInternId) ?? data.interns.find((item) => item.jobId === job.id) ?? data.interns[0];
  const currentWeek = weekFromOnboard(onboardDate);
  const onboardDays = daysSinceOnboard(onboardDate);
  const template = data.templates.find((item) => item.jobId === job.id && item.week === currentWeek) ?? data.templates.find((item) => item.jobId === job.id);
  const tasks = useMemo(() => {
    const titles = template?.tasks ?? ['阅读岗位 SOP', '提交一次本周轻反馈'];
    return titles.map((title, index) => {
      const id = `${job.id}-${currentWeek.replace(' ', '').toLowerCase()}-${index + 1}`;
      const saved = data.tasks.find((task) => task.id === id);
      return {
        id,
        title,
        helper: index === 0 ? template?.output ?? job.goal : index === titles.length - 1 ? '卡住就写一句，不写长周报。' : '按 Mentor 样例完成即可。',
        status: saved?.status ?? (index === 0 ? '进行中' : '未开始' as TaskStatus)
      };
    });
  }, [data.tasks, job.id, job.goal, currentWeek, template]);
  const feedback = data.feedbacks.find((item) => item.internId === intern.id);
  const experiences = data.experiences.filter((item) => item.jobId === job.id).slice(0, 3);
  const hasStuckTask = tasks.some((task) => task.status === '卡住了');
  const [feedbackForm, setFeedbackForm] = useState({
    done: '',
    stuck: '',
    needsMentor: true,
    mood: '正常' as MoodStatus
  });
  const [exitForm, setExitForm] = useState({ pitfall: '', reminder: '', advice: '' });

  const doneCount = tasks.filter((item) => item.status === '已完成').length;

  const setTaskStatus = (taskId: string, status: TaskStatus) => {
    const exists = data.tasks.some((task) => task.id === taskId);
    setData({
      ...data,
      tasks: exists
        ? data.tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
        : [...data.tasks, { id: taskId, jobId: job.id, title: tasks.find((task) => task.id === taskId)?.title ?? '本周任务', helper: '', status }]
    });
  };

  const submitFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    const item: LightFeedback = {
      id: `fb-${Date.now()}`,
      internId: intern.id,
      ...feedbackForm,
      createdAt: '2026-06-13'
    };
    setData({
      ...data,
      feedbacks: [item, ...data.feedbacks],
      interns: data.interns.map((row) =>
        row.id === intern.id
          ? {
              ...row,
              feedbackSubmitted: true,
              currentStatus: feedbackForm.mood === '压力很大' ? '高风险' : feedbackForm.mood === '有点压力' ? '需关注' : row.currentStatus,
              mentorPending: feedbackForm.needsMentor
            }
          : row
      )
    });
    setFeedbackForm({ done: '', stuck: '', needsMentor: true, mood: '正常' });
  };

  const submitExitReview = (event: React.FormEvent) => {
    event.preventDefault();
    const review: ExitReview = {
      id: `review-${Date.now()}`,
      jobId: job.id,
      ...exitForm,
      status: 'pending',
      createdAt: '2026-06-13'
    };
    setData({ ...data, exitReviews: [review, ...data.exitReviews] });
    setExitForm({ pitfall: '', reminder: '', advice: '' });
  };

  return (
    <div className="workspace-flow">
      <section className="workspace-hero">
        <div>
          <p className="workspace-eyebrow">{intern.name} 的工作台</p>
          <h1>{job.title}</h1>
          <p>
            入职第 {onboardDays} 天 · 当前阶段：{currentWeek} · {template?.goal ?? job.goal}
          </p>
        </div>
        <span className="soft-count">已完成 {doneCount}/{tasks.length}</span>
      </section>

      <section className="workspace-grid intern-grid">
        <div className="light-panel task-panel">
          <div className="panel-title">
            <h2>本周只需要完成这几件事</h2>
            <span>来自岗位 SOP</span>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <article key={task.id} className="task-row">
                <button
                  className={`task-circle ${task.status === '已完成' ? 'is-done' : ''}`}
                  aria-label="切换完成状态"
                  onClick={() => setTaskStatus(task.id, task.status === '已完成' ? '未开始' : '已完成')}
                >
                  {task.status === '已完成' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.helper}</p>
                </div>
                <button className={`status-chip status-${task.status}`} onClick={() => setTaskStatus(task.id, nextTaskStatus(task.status))}>
                  {task.status}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="side-stack">
          <section className="light-panel">
            <div className="panel-title">
              <h2>
                <MessageSquareText size={18} /> 本周轻反馈
              </h2>
            </div>
            {feedback ? <p className="panel-note">最近一次卡点：{feedback.stuck || '本周暂无卡点'}</p> : <p className="panel-note">{hasStuckTask ? '可以简单写一下卡在哪里。' : '最多 3 个问题 + 1 个状态，不写长周报。'}</p>}
            <form className="compact-form" onSubmit={submitFeedback}>
              <textarea required placeholder="这周完成了什么？" value={feedbackForm.done} onChange={(event) => setFeedbackForm({ ...feedbackForm, done: event.target.value })} />
              <textarea required placeholder="有没有卡住的地方？" value={feedbackForm.stuck} onChange={(event) => setFeedbackForm({ ...feedbackForm, stuck: event.target.value })} />
              <div className="form-pair">
                <select value={String(feedbackForm.needsMentor)} onChange={(event) => setFeedbackForm({ ...feedbackForm, needsMentor: event.target.value === 'true' })}>
                  <option value="true">需要 Mentor 看一下</option>
                  <option value="false">暂时不需要帮助</option>
                </select>
                <select value={feedbackForm.mood} onChange={(event) => setFeedbackForm({ ...feedbackForm, mood: event.target.value as MoodStatus })}>
                  {moods.map((mood) => (
                    <option key={mood}>{mood}</option>
                  ))}
                </select>
              </div>
              <button className="compact-primary" type="submit">
                提交轻反馈
              </button>
            </form>
          </section>

          <section className="light-panel">
            <div className="panel-title">
              <h2>
                <BookOpenCheck size={18} /> 这个岗位常见坑
              </h2>
            </div>
            <div className="tip-list">
              {experiences.map((item) => (
                <div key={item.id}>
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {currentWeek === 'Week 4' ? (
        <section className="light-panel exit-review">
          <div>
            <h2>给下一任的提醒</h2>
            <p>这是实习后期的一次轻量复盘，通过审核后进入岗位经验。</p>
          </div>
          <form className="exit-form" onSubmit={submitExitReview}>
            <textarea required placeholder="这个岗位最容易踩的坑是什么？" value={exitForm.pitfall} onChange={(event) => setExitForm({ ...exitForm, pitfall: event.target.value })} />
            <textarea required placeholder="如果重新来一次，你会提醒自己什么？" value={exitForm.reminder} onChange={(event) => setExitForm({ ...exitForm, reminder: event.target.value })} />
            <textarea required placeholder="有什么建议留给下一任？" value={exitForm.advice} onChange={(event) => setExitForm({ ...exitForm, advice: event.target.value })} />
            <button className="compact-secondary" type="submit">
              提交复盘
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
