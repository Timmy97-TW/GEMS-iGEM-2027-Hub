// Weekly goals: what the team is aiming at, with one owner each. Newest first.
//   { from: "YYYY-MM-DD",               a Monday
//     to: "YYYY-MM-DD"?,                a Sunday; leave out for a single week
//     theme: { zh, en },
//     note: { zh, en }?,                one line under the theme
//     goals: [ { t: { zh, en },
//                owner: "<seat code>" | "all" | "staff" | "adv",   seat codes are on the Team page
//                node: "N01"?,          the milestone this goal serves
//                link: "<id in links.js>"?,
//                done: true? } ] }
// Team-level goals only. A person's own task rows live in the Hub Sheet, Tasks tab; never copy them here.
const WEEKS = [
  { from: "2026-11-30", to: "2026-12-06",
    theme: { zh: "第一週：開始讀", en: "Week one: start reading" },
    note: { zh: "一張卡就好。重點是養成每週讀一篇的習慣。", en: "One card is enough. The point is the habit of one paper a week." },
    goals: [
      { t: { zh: "每人完成第 1 張 Paper Card", en: "Everyone finishes a first Paper Card" }, owner: "all", node: "N01", link: "research" },
      { t: { zh: "沒聽到分流說明的人，補聽 Discord 上的錄音", en: "Anyone who missed the triage briefing listens to the recording on Discord" }, owner: "all", node: "N01" },
      { t: { zh: "12/06 數三個數字：加入人數、完成卡數（目標：名冊七成以上）、實際花的分鐘中位數", en: "On 6 Dec, count three things: who joined, cards finished (target: at least 70% of the roster), and the median minutes actually spent" }, owner: "staff", node: "N01" }
    ] },
  { from: "2026-11-23", to: "2026-11-29",
    theme: { zh: "開季週", en: "Kickoff week" },
    goals: [
      { t: { zh: "11/25 前系統完成：Drive、Hub 試算表、Roster、日曆、Handbook 上線", en: "System ready by 25 Nov: Drive, Hub Sheet, Roster, calendar and Handbook live" }, owner: "OPS", node: "N00" },
      { t: { zh: "11/29 全員加入 Discord", en: "Everyone joins Discord on 29 Nov" }, owner: "all", node: "N01", link: "discord" },
      { t: { zh: "11/29 聽分流說明（Discord 語音，會錄下來）", en: "Hear the triage briefing on 29 Nov (Discord voice, recorded)" }, owner: "all", node: "N01" },
      { t: { zh: "每位 advisor 完成 S1 具名範圍確認", en: "Each advisor agrees their S1 named scope" }, owner: "adv", node: "N01" }
    ] },
  { from: "2026-11-02", to: "2026-11-22",
    theme: { zh: "開季前：把系統建好", en: "Pre-season: building the system" },
    note: { zh: "學生這幾週沒有要交的東西。把這一頁加入書籤，11/29 見。", en: "Nothing is due from students yet. Bookmark this page and see you on 29 Nov." },
    goals: [
      { t: { zh: "專案中心上線，並從系統網站連過來", en: "This hub goes live and is linked from the System site" }, owner: "OPS", done: true },
      { t: { zh: "Drive、Hub 試算表、Roster、日曆、Handbook 在 11/25 前上線", en: "Drive, Hub Sheet, Roster, calendar and Handbook live by 25 Nov" }, owner: "OPS", node: "N00" },
      { t: { zh: "10 題題目層研究問題寫進 Research 工作簿（來不及先給 3 題）", en: "Ten topic-level research questions seeded in the Research workbook (three first if time runs out)" }, owner: "PI", node: "N00", link: "research" },
      { t: { zh: "共用文獻庫開好，擁有者是成人帳號", en: "The shared library is open, owned by an adult account" }, owner: "OPS", node: "N00" }
    ] }
];

// Fixed sessions drawn on the calendar and the week strip. Provisional until the PI confirms.
//   { from, to, days: [0–6, Sunday = 0], t: { zh, en } }
const SESSIONS = [
  { from: "2027-01-02", to: "2027-06-26", days: [6], t: { zh: "週六課 09:00–15:00", en: "Saturday session 09:00–15:00" } },
  { from: "2027-07-01", to: "2027-08-10", days: [2, 4, 6], t: { zh: "暑假時段（二、四、六）", en: "Summer session (Tue, Thu, Sat)" } },
  { from: "2027-08-14", to: "2027-10-23", days: [6], t: { zh: "週六課 09:00–15:00", en: "Saturday session 09:00–15:00" } }
];
