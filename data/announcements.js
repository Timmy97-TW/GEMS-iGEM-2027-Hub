// Announcements, newest first. To post one, add a line at the top and push.
//   { d: "YYYY-MM-DD", tag: "team" | "schedule" | "homework" | "system" | "igem",
//     pin: true?,                       stays at the top of the Today page
//     t: { zh, en },                    one sentence a student can act on
//     body: { zh, en }?,                two or three sentences at most
//     to: "homework.html#HW02"? }       a page in this hub, or a full URL
// This file is public. Never: names, individual progress, reviews, fees, discipline, research
// strategy or a Discord invite.
const ANNOUNCEMENTS = [
  { d: "2026-11-05", tag: "team", pin: true,
    t: { zh: "2027 專案中心上線。請把這一頁加入書籤。", en: "The 2027 Project Hub is live. Bookmark this page." },
    body: { zh: "每週目標、里程碑、作業、負責人和所有連結都從這裡找。你自己的任務列仍然在 Hub 試算表，這裡會帶你過去。", en: "Weekly goals, milestones, homework, owners and every link start here. Your own task rows stay in the Hub Sheet; this site takes you to them." },
    to: "guide.html" },
  { d: "2026-11-05", tag: "schedule",
    t: { zh: "11/29（日）開季：Discord 開啟，線上 Topic Research 開始。", en: "The season opens on Sunday 29 Nov: Discord opens and online topic research begins." },
    body: { zh: "第一週每人完成 1 張 Paper Card。第一張可以讀綜述、政府報告或往年隊伍的 wiki。", en: "Everyone finishes one Paper Card in week one. The first may be a review, a government report or a past team’s wiki." },
    to: "homework.html#HW02" },
  { d: "2026-11-05", tag: "schedule",
    t: { zh: "First Class：12/26（六）13:00–17:00，日期待確認。", en: "First Class: Saturday 26 Dec, 13:00–17:00, date to be confirmed." },
    body: { zh: "這天落在連假，部分學校已經放寒假。確認後會在這裡更新。", en: "It falls on a long weekend and some schools’ winter break. This notice will change once the date is confirmed." },
    to: "milestones.html#N02" },
  { d: "2026-11-05", tag: "system",
    t: { zh: "Drive 與 Hub 試算表預計 11/25 前開放給全隊。", en: "The Drive and the Hub Sheet open to the team by 25 Nov." },
    body: { zh: "在那之前，連結頁上標「團隊帳號」的連結會要求存取權，這是正常的。", en: "Until then, links marked Team account will ask for access. That is expected." },
    to: "links.html" },
  { d: "2026-11-05", tag: "igem",
    t: { zh: "標 ? 的 iGEM 日期都是推估。", en: "iGEM dates marked ? are estimates." },
    body: { zh: "iGEM 還沒公布 2027 行事曆。目前用 2026 官方日期往後推 350 天，內部關卡從較早的日期往回排。", en: "iGEM has not announced its 2027 calendar. For now each date is the 2026 official date plus 350 days, and internal gates plan back from the earlier one." },
    to: "milestones.html" }
];
