// Who to ask, and who holds each seat.
//
// ASK: the questions students actually have, and where each one goes.
//   { q: { zh, en }, a: { zh, en } }
const ASK = [
  { q: { zh: "這週要做什麼、日期有沒有改", en: "What to do this week, or whether a date moved" },
    a: { zh: "先看本週和公告。還是不確定，問學生管理員。", en: "Check This week and News first. Still unsure? Ask a student admin." } },
  { q: { zh: "閱讀卡不知道怎麼寫", en: "Not sure how to write a reading card" },
    a: { zh: "問你的小組長；每週線上會也會講。", en: "Ask your group leader. The weekly online meeting covers it too." } },
  { q: { zh: "這次活動來不了", en: "I cannot come to a session" },
    a: { zh: "活動開始前，在每週回報選「請假」。", en: "Before it starts, choose “on leave” in the weekly check-in." } },
  { q: { zh: "進不去 Drive、表單或 Hub 試算表", en: "I cannot open the Drive, a form or the Hub Sheet" },
    a: { zh: "學生管理員；還是不行就問老師。", en: "A student admin first, then an instructor." } },
  { q: { zh: "iGEM 的截止日或官方表單", en: "An iGEM deadline or official form" },
    a: { zh: "PI。", en: "The PI." } },
  { q: { zh: "實驗流程、SOP 或 Construct", en: "A protocol, an SOP or a construct" },
    a: { zh: "Wet 任務負責人；分組公布前問老師。", en: "The Wet task lead; before groups are announced, an instructor." } },
  { q: { zh: "實驗室安全、發生事故或差點出事", en: "Lab safety, an incident or a near miss" },
    a: { zh: "馬上告訴在場的老師。", en: "Tell the instructor in the room straight away." } },
  { q: { zh: "需要買東西", en: "I need something bought" },
    a: { zh: "填採購申請；分組公布前問老師。", en: "Fill in a purchase request; before groups are announced, ask an instructor." } },
  { q: { zh: "模型、程式或 repo", en: "A model, code or a repo" },
    a: { zh: "Dry 任務負責人。", en: "The Dry task lead." } },
  { q: { zh: "硬體、CAD 或測試紀錄", en: "Hardware, CAD or a test record" },
    a: { zh: "Hardware 任務負責人。", en: "The Hardware task lead." } },
  { q: { zh: "訪談、專家或利害關係人", en: "An interview, an expert or a stakeholder" },
    a: { zh: "HP 任務負責人。", en: "The HP task lead." } },
  { q: { zh: "這張照片或這句話可不可以公開", en: "Whether a photo or a quote may be published" },
    a: { zh: "HP 任務負責人查同意紀錄，老師簽核。沒有同意就不發布。", en: "The HP task lead checks the consent record and an instructor signs off. No consent, no publishing." } },
  { q: { zh: "某個 wiki 頁、哪裡壞了", en: "A wiki page, or something broken on it" },
    a: { zh: "Wiki 任務負責人。", en: "The Wiki task lead." } },
  { q: { zh: "一個數字或一張圖能不能上 wiki", en: "Whether a number or a figure may go on the wiki" },
    a: { zh: "那一頁的查核人，再由主責老師簽核。", en: "That page’s checker, then the instructor in charge signs off." } },
  { q: { zh: "照片、影片或美術", en: "Photos, video or artwork" },
    a: { zh: "Media 任務負責人；影片找 Video 負責人。", en: "The Media task lead; for video, the Video lead." } },
  { q: { zh: "不知道該問誰", en: "Not sure who to ask" },
    a: { zh: "問你的小組長，或在 Discord 上問。", en: "Ask your group leader, or ask on Discord." } }
];

// HOLDERS: seat code → names shown on the Owners page, for example { WL: ["…"], PHO: ["…", "…"] }.
// It stays empty until groups are announced. Before adding anyone, the PI decides what a public page
// may show (first name, nickname or initials) and the person agrees. Never contact details.
const HOLDERS = {};
