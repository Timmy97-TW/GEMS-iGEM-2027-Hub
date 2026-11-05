// This week's goals. To set a week, add an entry at the top and push.
//   { from: "YYYY-MM-DD",          the Monday the entry starts
//     to: "YYYY-MM-DD",            optional: the Sunday it ends, when it covers more than one week
//     theme: { zh, en },           a few words; the big line on Today
//     note: { zh, en },            optional: one sentence under it
//     goals: [ { t: { zh, en },    what "done" looks like
//                owner: "all" | "staff" | "adv" | "<seat code>" | { zh, en },
//                link: "<id in links.js>",   optional
//                done: true } ] }            optional
// Team goals only. This file is public: no names, and nothing about one person's progress.
const WEEKS = [
  { from: "2026-11-30", to: "2026-12-06",
    theme: { zh: "每週一張閱讀卡", en: "One reading card a week" },
    note: { zh: "一張就好。重點是養成每週讀一篇的習慣。", en: "One is enough. The point is the habit of reading one source a week." },
    goals: [
      { t: { zh: "讀一篇，交這週的閱讀卡", en: "Read one source and hand in this week’s reading card" }, owner: "all", link: "form-reading" },
      { t: { zh: "線上會結束前交每週回報", en: "Hand in the weekly check-in before the online meeting ends" }, owner: "all", link: "form-checkin" }
    ] },
  { from: "2026-11-23", to: "2026-11-29",
    theme: { zh: "開季週", en: "Kickoff week" },
    note: { zh: "11/29（日）線上起跑。會議時間確定後公告在這裡。", en: "The season opens online on Sunday 29 Nov. The meeting time will be posted here once it is set." },
    goals: [
      { t: { zh: "11/29 前加入團隊 Discord（邀請會私下寄給你）", en: "Join the team Discord by 29 Nov (the invite is sent to you privately)" }, owner: "all" },
      { t: { zh: "11/29 第一次線上會：會議結束前交第一張閱讀卡和每週回報", en: "29 Nov, first online meeting: hand in your first reading card and weekly check-in before it ends" }, owner: "all" },
      { t: { zh: "11/25 前，Drive、Hub 試算表和兩張表單準備好", en: "By 25 Nov the Drive, the Hub Sheet and the two forms are ready" }, owner: "staff" }
    ] },
  { from: "2026-11-02", to: "2026-11-22",
    theme: { zh: "開季前", en: "Pre-season" },
    note: { zh: "現在沒有要交的東西。把這一頁加入書籤，11/29（日）線上見。", en: "Nothing is due yet. Bookmark this page; we start online on Sunday 29 Nov." },
    goals: [
      { t: { zh: "專案中心上線", en: "The Project Hub is live" }, owner: "staff", done: true },
      { t: { zh: "Drive、Hub 試算表和兩張表單在 11/25 前準備好", en: "The Drive, the Hub Sheet and the two forms are ready by 25 Nov" }, owner: "staff" },
      { t: { zh: "第一批研究問題寫好，第一張閱讀卡才有題目可選", en: "The first research questions are written, so the first reading card has a question to answer" }, owner: "staff" }
    ] }
];

// Fixed sessions, drawn on This week and on the calendar. Provisional until the PI confirms.
//   { from: "YYYY-MM-DD", to: "YYYY-MM-DD", days: [0–6, Sunday = 0], t: { zh, en } }
const SESSIONS = [
  { from: "2027-01-02", to: "2027-01-30", days: [6], t: { zh: "週六課 09:00–15:00", en: "Saturday session 09:00–15:00" } },
  { from: "2027-02-13", to: "2027-03-07", days: [6, 0], t: { zh: "訓練週末", en: "Training weekend" } },
  { from: "2027-03-13", to: "2027-06-26", days: [6], t: { zh: "週六課 09:00–15:00", en: "Saturday session 09:00–15:00" } },
  { from: "2027-07-01", to: "2027-08-10", days: [2, 4, 6], t: { zh: "暑假時段（二、四、六）", en: "Summer session (Tue, Thu, Sat)" } },
  { from: "2027-08-14", to: "2027-10-23", days: [6], t: { zh: "週六課 09:00–15:00", en: "Saturday session 09:00–15:00" } }
];
