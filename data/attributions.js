// Attributions: help from people who are not team members. iGEM asks for this at the freeze,
// so the hub keeps it visible all year.
//   OUTSIDE is one list per kind of help. To record help, add to that kind's items:
//     { who: { zh, en }, what: { zh, en }, when: "YYYY-MM" }      when is optional
//   Name a person only after their consent is on record.
const OUTSIDE = [
  { k: "advisors", t: { zh: "Student Advisors", en: "Student advisors" }, d: { zh: "在說好的範圍內帶隊員、留下審查意見。", en: "Coach members within an agreed scope and leave review notes." }, items: [] },
  { k: "instructors", t: { zh: "老師與 PI", en: "Instructors and the PI" }, d: { zh: "訓練、審閱、簽核與最後決定。", en: "Training, review, sign-off and final decisions." }, items: [] },
  { k: "experts", t: { zh: "專家與利害關係人", en: "Experts and stakeholders" }, d: { zh: "訪談、諮詢和回饋。", en: "Interviews, advice and feedback." }, items: [] },
  { k: "labs", t: { zh: "實驗室、學校與機構", en: "Labs, schools and institutions" }, d: { zh: "借用場地、設備或材料的單位。", en: "Whoever lent space, equipment or material." }, items: [] },
  { k: "sponsors", t: { zh: "贊助與經費", en: "Sponsors and funding" }, d: { zh: "經費和實物贊助。", en: "Funding and in-kind support." }, items: [] },
  { k: "tools", t: { zh: "軟體、資料與 AI", en: "Software, data and AI" }, d: { zh: "用了哪些軟體、公開資料和 AI 工具，用在哪裡。", en: "Which software, public data and AI tools were used, and for what." }, items: [] }
];

// CREDITS: what this site itself is built from.
//   { t: { zh, en }, d: { zh, en }, url: "https://…" }
const CREDITS = [
  { t: { zh: "時程、席位、規則和資料夾", en: "Schedule, seats, rules and folders" }, d: { zh: "每天從 GEMS iGEM 系統網站同步，這裡不重打。", en: "Synced daily from the GEMS iGEM System site; nothing is retyped here." }, url: "https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/" },
  { t: { zh: "配色", en: "Colour" }, d: { zh: "沿用 2026 ReLEAF 前進巴黎的藍與綠。", en: "The blue and green of the 2026 ReLEAF road-to-Paris site." }, url: "https://timmy97-tw.github.io/releaf-jamboree/" }
];
