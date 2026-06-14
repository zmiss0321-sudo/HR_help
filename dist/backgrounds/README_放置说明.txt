实习能量站背景图资源包

建议放置位置：
1. Vite / React 项目：
   public/backgrounds/

2. Next.js 项目：
   public/backgrounds/

放置后引用方式：
- CSS：
  background-image: url('/backgrounds/bg_home.png');

- React inline style：
  style={{ backgroundImage: "url('/backgrounds/bg_home.png')" }}

文件说明：
- bg_home.png：首页背景
- bg_intern_workspace.png：实习生工作台背景
- bg_mentor_workspace.png：Mentor 工作台背景
- bg_hr_dashboard.png：HR 异常看板背景
- bg_sop_card.png：SOP / 带教卡片区域背景
- bg_feedback_panel.png：轻反馈 / 复盘区域背景
- bg_confirm_modal.png：二次身份确认弹层背景

建议用法：
- 页面级背景：bg_home / bg_intern_workspace / bg_mentor_workspace / bg_hr_dashboard
- 局部模块背景：bg_sop_card / bg_feedback_panel / bg_confirm_modal
