// Attributions: who did what, and who helped from outside. iGEM asks for this at the freeze,
// so the hub keeps it visible all year instead of rebuilding it in October.
//
// The table of members' work is not typed here. It is worked out from the seats (data/season.js)
// and, once seats are named, from data/team.js. This file holds only what cannot be worked out.
//
// OUTSIDE: help from people who are not team members. One list per kind.
//   items: [ { who: { zh, en }, what: { zh, en }, when: "YYYY-MM"?, id: "I0042"? } ]
//   Add a person only when the Consent tab of the Hub Sheet has an agreed K for naming them.
const OUTSIDE = [
  { k: "advisors", t: { zh: "Student Advisors", en: "Student advisors" }, d: { zh: "在具名範圍內帶隊員、留下審查意見。判斷責任在 instructor。", en: "Coach members within a named scope and leave review notes. Judgement rests with instructors." }, items: [] },
  { k: "instructors", t: { zh: "老師與 PI", en: "Instructors and the PI" }, d: { zh: "訓練、審閱、簽核與最後決定。", en: "Training, review, sign-off and final decisions." }, items: [] },
  { k: "experts", t: { zh: "專家與利害關係人", en: "Experts and stakeholders" }, d: { zh: "每一次互動都有一個 I 編號；要具名，先有 K。", en: "Every interaction has an I number; naming someone needs a K first." }, items: [] },
  { k: "labs", t: { zh: "實驗室、學校與機構", en: "Labs, schools and institutions" }, d: { zh: "借用場地、設備或材料的單位。", en: "Whoever lent space, equipment or material." }, items: [] },
  { k: "sponsors", t: { zh: "贊助與經費", en: "Sponsors and funding" }, d: { zh: "經費和實物贊助。", en: "Funding and in-kind support." }, items: [] },
  { k: "tools", t: { zh: "軟體、資料與 AI", en: "Software, data and AI" }, d: { zh: "用了哪些軟體、公開資料和 AI 工具，用在哪裡。", en: "Which software, public data and AI tools were used, and for what." }, items: [] }
];

// CREDITS: what this hub itself is built from.
const CREDITS = [
  { t: { zh: "節點、角色、規則和資料夾", en: "Nodes, seats, rules and folders" }, d: { zh: "每天從 GEMS iGEM System 網站同步，這裡不重打。", en: "Synced daily from the GEMS iGEM System site; nothing is retyped here." }, url: "https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/" },
  { t: { zh: "配色", en: "Colour" }, d: { zh: "沿用 2026 ReLEAF 前進巴黎的藍與綠。", en: "The blue and green of the 2026 ReLEAF road-to-Paris site." }, url: "https://timmy97-tw.github.io/releaf-jamboree/" }
];
