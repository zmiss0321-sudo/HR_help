import { MessageSquareReply, PencilLine, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { AppData, LightFeedback, RiskStatus } from '../types';
import { riskTone } from '../utils/ai';
import { weekFromOnboard } from '../utils/week';

interface MentorWorkspaceProps {
  data: AppData;
  setData: (data: AppData) => void;
  mentorName: string;
}

const actions = ['继续推进', '补充案例', '重新讲解', '约一次沟通'] as const;
const statuses: RiskStatus[] = ['正常', '需关注', '高风险'];

export function MentorWorkspace({ data, setData, mentorName }: MentorWorkspaceProps) {
  const myInterns = data.interns.filter((intern) => intern.mentor === mentorName);
  const myInternIds = new Set(myInterns.map((intern) => intern.id));
  const pending = data.feedbacks.filter((item) => myInternIds.has(item.internId) && item.needsMentor && !item.mentorReply);
  const week4Reviews = data.exitReviews.filter((review) => {
    const job = data.jobs.find((item) => item.id === review.jobId);
    return job?.mentor === mentorName && review.status === 'pending';
  });
  const primaryJob = data.jobs.find((job) => job.mentor === mentorName) ?? data.jobs[0];
  const templates = data.templates.filter((item) => item.jobId === primaryJob.id);
  const [reply, setReply] = useState({ status: '需关注' as RiskStatus, action: '补充案例' as typeof actions[number], note: '' });

  const saveReply = (feedback: LightFeedback) => {
    setData({
      ...data,
      feedbacks: data.feedbacks.map((item) => (item.id === feedback.id ? { ...item, mentorReply: reply } : item)),
      interns: data.interns.map((item) => (item.id === feedback.internId ? { ...item, mentorPending: false, currentStatus: reply.status } : item))
    });
    setReply({ status: '需关注', action: '补充案例', note: '' });
  };

  const todoItems = [
    ...pending.map((feedback) => {
      const intern = data.interns.find((item) => item.id === feedback.internId)!;
      return `${intern.name} 本周标记了卡点，需要你看一下`;
    }),
    ...week4Reviews.map((review) => {
      const job = data.jobs.find((item) => item.id === review.jobId)!;
      return `${job.title} 有一条离职复盘待确认`;
    })
  ].slice(0, 4);

  return (
    <div className="workspace-flow">
      <section className="workspace-hero">
        <div>
          <p className="workspace-eyebrow">Mentor 工作台</p>
          <h1>{mentorName} 的带教工作台</h1>
          <p>今天有 {pending.length + week4Reviews.length} 个新人卡点等你看</p>
        </div>
        <span className="soft-count">{myInterns.length} 名实习生</span>
      </section>

      <section className="mentor-board">
        <div className="light-panel mentor-todo">
          <div className="panel-title">
            <h2>待我处理</h2>
            <span>只看关键卡点</span>
          </div>
          <div className="todo-list">
            {(todoItems.length ? todoItems : ['当前没有必须处理的卡点']).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div className="light-panel">
          <div className="panel-title">
            <h2>
              <UsersRound size={18} /> 我的实习生
            </h2>
          </div>
          <div className="mini-intern-grid">
            {myInterns.map((intern) => {
              const job = data.jobs.find((item) => item.id === intern.jobId)!;
              const week = weekFromOnboard(intern.onboardDate ?? '2026-06-05');
              return (
                <article key={intern.id}>
                  <div>
                    <strong>{intern.name}</strong>
                    <span>{job.title}</span>
                  </div>
                  <div>
                    <span>{week}</span>
                    <span className={`mini-risk ${riskTone(intern.currentStatus)}`}>{intern.currentStatus}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="workspace-grid mentor-grid">
        <div className="light-panel">
          <div className="panel-title">
            <h2>
              <MessageSquareReply size={18} /> 快速反馈
            </h2>
            <span>快捷选项 + 一句话</span>
          </div>
          <div className="feedback-list">
            {pending.map((item) => {
              const intern = data.interns.find((row) => row.id === item.internId)!;
              const job = data.jobs.find((row) => row.id === intern.jobId)!;
              return (
                <article key={item.id} className="feedback-card">
                  <div className="feedback-head">
                    <div>
                      <strong>{intern.name}</strong>
                      <span>{job.title}</span>
                    </div>
                    <span className={`mini-risk ${riskTone(intern.currentStatus)}`}>{intern.currentStatus}</span>
                  </div>
                  <p>卡点：{item.stuck}</p>
                  <div className="mentor-reply-row">
                    <select value={reply.status} onChange={(event) => setReply({ ...reply, status: event.target.value as RiskStatus })}>
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <select value={reply.action} onChange={(event) => setReply({ ...reply, action: event.target.value as typeof actions[number] })}>
                      {actions.map((action) => (
                        <option key={action}>{action}</option>
                      ))}
                    </select>
                    <input placeholder="补充一句话，可不填" value={reply.note} onChange={(event) => setReply({ ...reply, note: event.target.value })} />
                    <button onClick={() => saveReply(item)}>回复</button>
                  </div>
                </article>
              );
            })}
            {!pending.length ? <p className="empty-note">没有新的轻反馈需要处理。</p> : null}
          </div>
        </div>

        <div className="light-panel">
          <div className="panel-title">
            <h2>
              <PencilLine size={18} /> 这个岗位怎么带
            </h2>
            <span>{primaryJob.title}</span>
          </div>
          <div className="sop-compact">
            {templates.map((item) => (
              <article key={item.id}>
                <strong>{item.week}</strong>
                <p>{item.goal}</p>
                <span>{item.output}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
