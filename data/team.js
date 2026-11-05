// Who holds each seat, and who to ask.
//
// HOLDERS: seat code → names shown on the Team page. Seats are named at N07 (13 Mar); until then
// this stays empty and the page shows the seat only. Before adding anyone, the PI decides what a
// public page may show (first name, nickname or initials) and the person agrees. No contact details.
//   const HOLDERS = { TL: ["…"], PHO: ["…", "…"] };
const HOLDERS = {};

// ASK: the questions students actually have, and the seat that answers each one.
//   { q: { zh, en }, seats: ["<seat code>", …] }       the first seat is the one to ask first
const ASK = [
  { q: { zh: "iGEM 的截止日或官方表單", en: "An iGEM deadline or official form" }, seats: ["TL", "CAL"] },
  { q: { zh: "這週有什麼節點、日期有沒有改", en: "What is due this week, or whether a date moved" }, seats: ["CAL"] },
  { q: { zh: "我進不去 Drive 或某張表", en: "I cannot open the Drive or a sheet" }, seats: ["OPS"] },
  { q: { zh: "實驗流程、SOP 或 Construct", en: "A protocol, an SOP or a construct" }, seats: ["WL", "ILB"] },
  { q: { zh: "實驗室班表、今天誰在", en: "The lab roster, or who is in today" }, seats: ["LAB"] },
  { q: { zh: "實驗室安全、發生事故或差點出事", en: "Lab safety, an incident or a near miss" }, seats: ["SFT", "ISC"] },
  { q: { zh: "需要買東西", en: "I need something bought" }, seats: ["INV", "OBG"] },
  { q: { zh: "序列設計或 IDT 訂單", en: "Sequence design or an IDT order" }, seats: ["IDT", "WL"] },
  { q: { zh: "模型、程式或 repo", en: "A model, code or a repo" }, seats: ["DL"] },
  { q: { zh: "硬體、CAD 或測試紀錄", en: "Hardware, CAD or a test record" }, seats: ["HWL"] },
  { q: { zh: "某個 wiki 頁、哪裡壞了", en: "A wiki page, or something broken on it" }, seats: ["WKL", "WKD"] },
  { q: { zh: "一個數字或說法可不可以寫上 wiki", en: "Whether a number or claim may go on the wiki" }, seats: ["FCT", "XCK"] },
  { q: { zh: "一張圖的格式或來源", en: "A figure’s style or source" }, seats: ["FIG"] },
  { q: { zh: "照片要傳到哪裡、找某一張照片", en: "Where photos go, or finding one" }, seats: ["PHO", "MDL"] },
  { q: { zh: "影片腳本或拍攝", en: "A video script or a shoot" }, seats: ["VID"] },
  { q: { zh: "主視覺、海報或美術需求", en: "The key visual, a poster or an art request" }, seats: ["ART"] },
  { q: { zh: "訪談、專家或利害關係人", en: "An interview, an expert or a stakeholder" }, seats: ["HPL"] },
  { q: { zh: "這張照片或這句話可不可以公開", en: "Whether a photo or a quote may be published" }, seats: ["KCO", "HPL"] },
  { q: { zh: "去學校上課或辦活動", en: "Teaching at a school, or running an event" }, seats: ["EDU", "OUT"] },
  { q: { zh: "誰做了什麼、貢獻表", en: "Who did what, and the attribution table" }, seats: ["ATT"] },
  { q: { zh: "英文怎麼寫、翻譯", en: "English wording or translation" }, seats: ["TRN"] },
  { q: { zh: "Discord 上的討論要記到哪", en: "Where a Discord discussion should be recorded" }, seats: ["DIS"] },
  { q: { zh: "模擬評審和評審題", en: "Mock judging and judging questions" }, seats: ["QAB", "IMK"] },
  { q: { zh: "不知道該問誰", en: "Not sure who to ask" }, seats: ["CAL", "OPS"] }
];
