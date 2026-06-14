import { AppData, RiskStatus } from '../types';

export function riskTone(status: RiskStatus) {
  if (status === '高风险') return 'border-[#F53F3F]/30 bg-[#F53F3F]/10 text-[#F53F3F]';
  if (status === '需关注') return 'border-[#FF7D00]/30 bg-[#FF7D00]/10 text-[#FF7D00]';
  return 'border-[#00A870]/30 bg-[#00A870]/10 text-[#00A870]';
}

export function summarizeIssues(data: AppData) {
  const issues = [
    { label: '输出标准不明确', count: data.feedbacks.filter((item) => item.stuck.includes('标准') || item.stuck.includes('样例')).length },
    { label: '工具配置卡住', count: data.feedbacks.filter((item) => item.stuck.includes('环境') || item.stuck.includes('工具') || item.stuck.includes('变量')).length },
    { label: '不知道该问谁', count: data.feedbacks.filter((item) => item.stuck.includes('问谁') || item.stuck.includes('授权')).length },
    { label: '业务理解不足', count: data.feedbacks.filter((item) => item.stuck.includes('背景') || item.stuck.includes('业务')).length }
  ];

  return issues.sort((a, b) => b.count - a.count);
}
