// Homework and assignments. Order does not matter; the page sorts by due date.
//   { id: "HW05",                        never reuse an id: links and ticks point at it
//     t: { zh, en }, body: { zh, en },
//     group: "all" | "wet" | "dry" | "hw" | "hp" | "wiki" | "media" | "adv",
//     assigned: "YYYY-MM-DD", due: "YYYY-MM-DD",
//     node: "N02"?,                      the milestone it feeds
//     submit: { link: "<id in links.js>"?, how: { zh, en } },   where the finished work goes
//     review: "<seat code>" | "staff"?,  who reads it
//     optional: true? }
// Grades, comments on a person's work and who has or has not handed in stay out of this file.
const HOMEWORK = [
  { id: "HW01",
    t: { zh: "加入團隊 Discord", en: "Join the team Discord" },
    body: { zh: "邀請連結會私下寄給你，不會放在這個公開網站。11/29 當天會在 Discord 語音說明研究怎麼分流，並錄下來。", en: "The invite is sent to you privately and is never posted on this public site. On 29 Nov the research triage is explained once on Discord voice, and recorded." },
    group: "all", assigned: "2026-11-29", due: "2026-11-29", node: "N01",
    submit: { link: "discord", how: { zh: "加入伺服器就算完成", en: "Joining the server completes it" } }, review: "OPS" },
  { id: "HW02",
    t: { zh: "第 1 張 Paper Card", en: "Your first Paper Card" },
    body: { zh: "讀一篇，填一張卡。第一張可以是綜述、政府報告或往年隊伍的 wiki。先看 Research 工作簿的 Questions 分頁，挑一題你想回答的。", en: "Read one source and fill in one card. The first may be a review, a government report or a past team’s wiki. Start from the Questions tab of the Research workbook and pick one you want to answer." },
    group: "all", assigned: "2026-11-29", due: "2026-12-06", node: "N01",
    submit: { link: "research", how: { zh: "Research 工作簿 → Papers 分頁，一篇一列", en: "Research workbook → Papers tab, one row per source" } }, review: "staff" },
  { id: "HW03",
    t: { zh: "讀完 Handbook 並確認", en: "Read the Handbook and confirm" },
    body: { zh: "Handbook 是全隊唯一的規則來源：每週要做什麼、ID 怎麼用、檔案放哪裡、哪些事有關卡。First Class 當天全員確認。", en: "The Handbook is the team’s one source of rules: what to do each week, how IDs work, where files go and which steps have gates. Everyone confirms it at First Class." },
    group: "all", assigned: "2026-11-29", due: "2026-12-26", node: "N02",
    submit: { link: "handbook", how: { zh: "First Class 當天確認", en: "Confirmed in person at First Class" } }, review: "OPS" },
  { id: "HW04", optional: true,
    t: { zh: "想提題目的人：一題一張 Topic Card", en: "Proposing a topic? One Topic Card per topic" },
    body: { zh: "題目由老師發展，學生也可以自己提。進 PK 的題目至少要有 3 張 Paper Card，其中至少 1 張是法規、倫理或方法。", en: "Instructors develop the topics, and students may propose their own. A topic needs at least three Paper Cards to enter the PK, at least one on regulation, ethics or method." },
    group: "all", assigned: "2027-01-02", due: "2027-01-23", node: "N03",
    submit: { link: "topic-cards", how: { zh: "用 Topic Card 範本，存進 20 Topic／Topic Cards", en: "Use the Topic Card template and save it in 20 Topic / Topic Cards" } }, review: "ITL" }
];
