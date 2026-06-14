import { AlertTriangle, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppData, ExitReview, RiskStatus } from '../types';
import { riskTone, summarizeIssues } from '../utils/ai';
import { weekFromOnboard } from '../utils/week';

interface HrWorkspaceProps {
  data: AppData;
  setData: (data: AppData) => void;
}

const departments = ['全部', '产品', '研发', '销售', '市场'];
const riskOptions: Array<'全部' | RiskStatus> = ['全部', '正常', '需关注', '高风险'];
const feedbackOptions = ['全部', '已提交', '未提交', '待 Mentor 处理'];

export function HrWorkspace({ data, setData }: HrWorkspaceProps) {
  const [department, setDepartment] = useState('全部');
  const [mentor, setMentor] = useState('全部');
  const [risk, setRisk] = useState<'全部' | RiskStatus>('全部');
  const [feedback, setFeedback] = useState('全部');
  const mentorNames = useMemo(() => ['全部', ...Array.from(new Set(data.jobs.map((job) => job.mentor)))], [data.jobs]);
  const missingFeedback = data.interns.filter((item) => !item.feedbackSubmitted);
  const mentorPending = data.interns.filter((item) => item.mentorPending);
  const highRisk = data.interns.filter((item) => item.currentStatus === '高风险');
  const issueSummary = summarizeIssues(data).filter((item) => item.count > 0);
  const pendingReviews = data.exitReviews.filter((item) => item.status === 'pending');

  const filteredInterns = data.interns.filter((intern) => {
    const job = data.jobs.find((item) => item.id === intern.jobId)!;
    const matchDepartment = department === '全部' || job.title.includes(department);
    const matchMentor = mentor === '全部' || intern.mentor === mentor;
    const matchRisk = risk === '全部' || intern.currentStatus === risk;
    const matchFeedback =
      feedback === '全部' ||
      (feedback === '已提交' && intern.feedbackSubmitted) ||
      (feedback === '未提交' && !intern.feedbackSubmitted) ||
      (feedback === '待 Mentor 处理' && intern.mentorPending);
    return matchDepartment && matchMentor && matchRisk && matchFeedback;
  });

  const setReviewStatus = (review: ExitReview, status: ExitReview['status']) => {
    setData({
      ...data,
      exitReviews: data.exitReviews.map((item) => (item.id === review.id ? { ...item, status } : item)),
      experiences:
        status === 'approved'
          ? [{ id: `exp-${Date.now()}`, jobId: review.jobId, type: '前任建议', title: '给下一任的提醒', content: review.advice, source: '历史实习生经验' }, ...data.experiences]
          : data.experiences
    });
  };

  return (
    <div className="workspace-flow">
      <section className="workspace-hero">
        <div>
          <p className="workspace-eyebrow">业务部 HR 看板</p>
          <h1>业务部实习生异常看板</h1>
          <p>本周有 {missingFeedback.length + mentorPending.length + pendingReviews.length} 件事需要处理</p>
        </div>
        <span className="soft-count">{data.interns.length} 名实习生</span>
      </section>

      <section className="light-panel exception-panel">
        <div className="panel-title">
          <h2>
            <AlertTriangle size={18} /> 本周需要处理的事
          </h2>
          <span>优先看异常</span>
        </div>
        <div className="exception-list">
          <p>{missingFeedback.length} 名实习生未提交轻反馈</p>
          <p>{mentorPending.length} 名 Mentor 未处理新人卡点</p>
          <p>{highRisk.length} 名实习生处于高风险状态</p>
          <p>产品运营岗多人反馈“输出标准不清”</p>
        </div>
      </section>

      <section className="workspace-grid hr-grid">
        <div className="light-panel">
          <div className="panel-title">
            <h2>实习生状态</h2>
            <span>{filteredInterns.length} 人</span>
          </div>
          <div className="filter-row">
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={mentor} onChange={(event) => setMentor(event.target.value)}>
              {mentorNames.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={risk} onChange={(event) => setRisk(event.target.value as '全部' | RiskStatus)}>
              {riskOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={feedback} onChange={(event) => setFeedback(event.target.value)}>
              {feedbackOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="hr-intern-list">
            {filteredInterns.slice(0, 10).map((intern) => {
              const job = data.jobs.find((item) => item.id === intern.jobId)!;
              return (
                <article key={intern.id}>
                  <div>
                    <strong>{intern.name}</strong>
                    <span>{job.title} · Mentor {intern.mentor}</span>
                  </div>
                  <div>
                    <span>{weekFromOnboard(intern.onboardDate ?? '2026-06-05')}</span>
                    <span>{intern.feedbackSubmitted ? '已提交' : '未提交'}</span>
                    <span className={`mini-risk ${riskTone(intern.currentStatus)}`}>{intern.currentStatus}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="side-stack">
          <section className="light-panel">
            <div className="panel-title">
              <h2>本周高频问题</h2>
            </div>
            <div className="issue-list">
              {(issueSummary.length ? issueSummary : [{ label: '暂无集中问题', count: 0 }]).map((item) => (
                <p key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.count} 次</strong>
                </p>
              ))}
            </div>
            <p className="panel-note">建议补充输出样例和工具配置检查清单。</p>
          </section>

          <section className="light-panel">
            <div className="panel-title">
              <h2>经验审核</h2>
              <span>{pendingReviews.length} 条</span>
            </div>
            <div className="review-list">
              {pendingReviews.map((review) => {
                const job = data.jobs.find((item) => item.id === review.jobId)!;
                return (
                  <article key={review.id}>
                    <strong>{job.title}</strong>
                    <p>{review.advice}</p>
                    <div>
                      <button onClick={() => setReviewStatus(review, 'approved')}>
                        <Check size={15} /> 通过
                      </button>
                      <button onClick={() => setReviewStatus(review, 'needs_edit')}>需修改</button>
                      <button onClick={() => setReviewStatus(review, 'rejected')}>
                        <X size={15} /> 拒绝
                      </button>
                    </div>
                  </article>
                );
              })}
              {!pendingReviews.length ? <p className="empty-note">暂无待审核复盘。</p> : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
