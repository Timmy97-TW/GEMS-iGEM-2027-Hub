// Homework. To set one, add an entry and push. Order does not matter: the page sorts by due date.
//   { id: "HW05",                  never reuse an id: links and "handed in" ticks point at it
//     t: { zh, en },               the title
//     body: { zh, en },            what to do, in two or three sentences
//     due: "YYYY-MM-DD",
//     assigned: "YYYY-MM-DD",      optional: the page shows "set on …" until that day
//     group: "all" | "wet" | "dry" | "hw" | "hp" | "wiki" | "media",
//     submit: { how: { zh, en }, link: "<id in links.js>" },    where the finished work goes
//     review: "staff" | "<seat code>" | { zh, en },             who reads it
//     optional: true }
// This file is public: no grades, no comments on anyone's work, nothing about who has handed in.
const HOMEWORK = [
  { id: "HW01", group: "all", due: "2026-11-29",
    t: { zh: "加入團隊 Discord", en: "Join the team Discord" },
    body: { zh: "邀請連結會私下寄給你，不會放在這個公開網站。", en: "The invite is sent to you privately. It is never posted on this public site." },
    submit: { how: { zh: "加入伺服器就算完成", en: "Joining the server completes it" } }, review: "staff" },
  { id: "HW02", group: "all", due: "2026-11-29",
    t: { zh: "第 1 張閱讀卡", en: "Your first reading card" },
    body: { zh: "在第一次線上會上完成：讀一篇，填一張閱讀卡，會議結束前交出。讀哪一篇，會議上會說。", en: "Done at the first online meeting: read one source, fill in one reading card and hand it in before the meeting ends. You will be told what to read at the meeting." },
    submit: { link: "form-reading", how: { zh: "用表單交：", en: "Hand it in with the form:" } }, review: "staff" },
  { id: "HW03", group: "all", due: "2026-12-26",
    t: { zh: "準備 1 分鐘，講你的一張閱讀卡", en: "Prepare one minute on one of your reading cards" },
    body: { zh: "第一堂實體課上，每個人在小組裡用 1 分鐘講自己的一張卡：讀了什麼、你的判斷、為什麼。日期待確認。", en: "At the first in-person class everyone takes one minute in their group on one card: what you read, your judgement and why. The date is still to be confirmed." },
    submit: { how: { zh: "當天在小組裡講", en: "Spoken in your group on the day" } }, review: "staff" },
  { id: "HW04", group: "all", due: "2027-01-23", optional: true,
    t: { zh: "想提題目的人：一題一張 Topic Card", en: "Proposing a topic? One Topic Card per topic" },
    body: { zh: "題目由老師發展，學生也可以自己提。每個候選題目至少要有 3 張閱讀卡，其中至少 1 張是法規、倫理或方法。", en: "Instructors develop the topics, and students may propose their own. Each candidate topic needs at least three reading cards, at least one of them on regulation, ethics or method." },
    submit: { link: "topic-cards", how: { zh: "用 Topic Card 範本，存進", en: "Use the Topic Card template and save it in" } }, review: "staff" }
];
