// News, newest first. To post, add an entry at the top and push.
//   { d: "YYYY-MM-DD",
//     tag: "team" | "schedule" | "homework" | "system" | "igem",
//     t: { zh, en },               one sentence a student can act on
//     body: { zh, en },            optional: two or three sentences at most
//     to: "homework.html#HW02",    optional: a page in this hub, or a full URL
//     pin: true }                  optional: stays first on Today and on News
// This file is public: no names, individual progress, reviews, fees, discipline, research strategy
// or Discord invite.
const ANNOUNCEMENTS = [
  { d: "2026-11-05", tag: "team", pin: true,
    t: { zh: "2027 專案中心上線。請把這一頁加入書籤。", en: "The 2027 Project Hub is live. Bookmark this page." },
    body: { zh: "這週要做什麼、下一個里程碑、作業、該問誰和所有連結，都從這裡找。", en: "What to do this week, the next milestone, homework, who to ask and every link start here." },
    to: "guide.html" },
  { d: "2026-11-05", tag: "schedule",
    t: { zh: "11/29（日）線上起跑。", en: "The season opens online on Sunday 29 Nov." },
    body: { zh: "當天加入 Discord，參加第一次線上會，並在會議結束前交出第一張閱讀卡。會議時間確定後會在這裡公告。", en: "That day you join Discord, attend the first online meeting and hand in your first reading card before it ends. The meeting time will be posted here once it is set." },
    to: "homework.html" },
  { d: "2026-11-05", tag: "schedule",
    t: { zh: "第一堂實體課：12/26（六）13:00–17:00，日期待確認。", en: "First in-person class: Saturday 26 Dec, 13:00–17:00, date to be confirmed." },
    body: { zh: "這天落在連假，部分學校已經放寒假。確認後會在這裡更新。", en: "It falls on a long weekend and some schools’ winter break. This notice will change once the date is confirmed." },
    to: "milestones.html" },
  { d: "2026-11-05", tag: "system",
    t: { zh: "Drive 與 Hub 試算表預計 11/25 前開放給全隊。", en: "The Drive and the Hub Sheet open to the team by 25 Nov." },
    body: { zh: "在那之前，連結頁上標「團隊帳號」的連結會要求存取權，這是正常的。", en: "Until then, links marked Team account will ask for access. That is expected." },
    to: "links.html" },
  { d: "2026-11-05", tag: "igem",
    t: { zh: "標 ? 的 iGEM 日期都是推估。", en: "iGEM dates marked ? are estimates." },
    body: { zh: "iGEM 還沒公布 2027 行事曆。目前每個日期是 2026 官方日期往後推 350 天。", en: "iGEM has not announced its 2027 calendar. For now each date is the 2026 official date plus 350 days." },
    to: "milestones.html" }
];
