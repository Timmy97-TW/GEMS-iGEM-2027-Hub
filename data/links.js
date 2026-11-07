// Every link the team uses. The Links page, the search and the quick links on Today all read this file.
// To add one, copy a line into the right group and push.
//   { id: "handbook",              short and permanent: other files point at it
//     g: "<group id below>",
//     t: { zh, en },               or "Same in both languages"
//     d: { zh, en },               optional: one line on what it is
//     url: "https://…",            leave "" while the place does not exist yet: it shows as "not open yet"
//     kind: "site" | "folder" | "doc" | "sheet" | "repo" | "igem" | "tool",     picks the icon
//     access: "public" | "team",   team = opens only with the team Google account
//     pin: true }                  optional: shows on Today for everyone
// A Drive link gives nothing away by itself: Drive checks the account. Never set a linked folder to
// "anyone with the link", and never add an Ops (instructor-only) link or a Discord invite here.
const DRIVE_ROOT = "https://drive.google.com/drive/folders/";
const GDOC = "https://docs.google.com/document/d/", GSHEET = "https://docs.google.com/spreadsheets/d/";
const SYS = "https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/";
const PAGES_GH = "https://timmy97-tw.github.io/";

const LINK_GROUPS = [
  { id: "start", name: { zh: "從這裡開始", en: "Start here" }, note: { zh: "新人第一天會用到的地方。", en: "What a newcomer opens on day one." } },
  { id: "drive", name: { zh: "Drive 資料夾", en: "Drive folders" }, note: { zh: "編號就是順序。頂層不放零散檔案。", en: "The numbers are the order. No loose files at the top level." } },
  { id: "sheets", name: { zh: "試算表", en: "Workbooks" }, note: { zh: "有 ID 的紀錄都在這些表裡。", en: "Every record with an ID lives in one of these." } },
  { id: "templates", name: { zh: "範本", en: "Templates" }, note: { zh: "先複製再填，不要直接改範本。", en: "Make a copy, then fill it in. Never edit the template itself." } },
  { id: "system", name: { zh: "系統網站", en: "The System site" }, note: { zh: "這套做法為什麼這樣設計，全部在那裡。", en: "Why the team works this way, in full." } },
  { id: "wiki", name: { zh: "Wiki", en: "Wiki" } },
  { id: "igem", name: { zh: "iGEM 官方", en: "iGEM official" }, note: { zh: "規則和截止日以官方為準。", en: "For rules and deadlines, the official pages are the authority." } },
  { id: "learn", name: { zh: "往年留下來的", en: "From past seasons" }, note: { zh: "2026 ReLEAF 那一年做的工具，今年直接用。", en: "Tools built during the 2026 ReLEAF season, ready to reuse." } },
  { id: "tools", name: { zh: "工具", en: "Tools" } }
];

const LINKS = [
  // ---- start here
  { id: "start-here", g: "start", t: { zh: "從這裡開始", en: "Start here" }, d: { zh: "一頁：每週的兩件事、第一天做什麼、卡住找誰。目前是草稿。", en: "One page: the two things you do each week, day one and who to ask. A draft for now." }, url: GDOC + "19KPbN1pkqxslLi7Knj2EBnYpIAOxCKtqjweoWJUE1ro/edit", kind: "doc", access: "team", pin: true },
  { id: "form-reading", g: "start", t: { zh: "閱讀卡表單", en: "Reading card form" }, d: { zh: "每週一張。11/29 前開放。", en: "One a week. Opens by 29 Nov." }, url: "", kind: "doc", access: "team", pin: true },
  { id: "form-checkin", g: "start", t: { zh: "每週回報表單", en: "Weekly check-in form" }, d: { zh: "每次會議或活動結束前交；請假也用這張。11/29 前開放。", en: "Handed in before each meeting or session ends; also used to take leave. Opens by 29 Nov." }, url: "", kind: "doc", access: "team", pin: true },
  { id: "handbook", g: "start", t: { zh: "GEMS 2027 Handbook", en: "GEMS 2027 Handbook" }, d: { zh: "完整的規則。要查的時候才打開；新人先讀「從這裡開始」。", en: "The full rule book. Open it to look something up; newcomers read Start here first." }, url: GDOC + "1i4HpcWgv4E_0WjVAzmoCrO6VGp4vmUQrv4Jtn3rQYYY/edit", kind: "doc", access: "team" },
  { id: "hubsheet", g: "start", t: { zh: "Hub 試算表", en: "Hub Sheet" }, d: { zh: "全隊的紀錄和看板。", en: "The team’s records and dashboard." }, url: GSHEET + "1JL_5vT03H_NOtCTXH2Z4hQq-O1uNX1AaqSt8o24wLUw/edit", kind: "sheet", access: "team", pin: true },
  { id: "research", g: "start", t: { zh: "Research 工作簿", en: "Research workbook" }, d: { zh: "研究問題和閱讀卡。全隊一份。", en: "Research questions and reading cards. One for the whole team." }, url: GSHEET + "1itRMRoujMntpyJd9TWXTB-UXViBqoXhMVXfqH7ptzsg/edit", kind: "sheet", access: "team" },
  { id: "drive-root", g: "start", t: { zh: "團隊 Drive：GEMS iGEM 2027", en: "Team Drive: GEMS iGEM 2027" }, d: { zh: "所有文件、數據、圖和定稿。", en: "All documents, data, figures and finals." }, url: DRIVE_ROOT + "1X88uV_n3cnuQhGby20sjkMbcbLrk-LDt", kind: "folder", access: "team", pin: true },
  { id: "discord", g: "start", t: "Discord", d: { zh: "討論、通知和求助。決定和待辦要寫回 Hub 試算表。邀請連結私下寄送，11/29 開啟。", en: "Discussion, notices and asking for help. Decisions and to-dos go back to the Hub Sheet. The invite is sent privately; it opens on 29 Nov." }, url: "", kind: "tool", access: "team", pin: true },
  { id: "file-rules", g: "start", t: { zh: "File Rules 檔案規則", en: "File Rules" }, d: { zh: "每種檔案叫什麼名字、放哪裡、誰能改。要查的時候才打開。", en: "What each file is called, where it goes and who can edit it. Open it to look something up." }, url: GDOC + "1D-qLA7sohVvgvnXXX7lIpiN69eF21Tyh3QcGHkscE5M/edit", kind: "doc", access: "team" },
  { id: "drive-readme", g: "start", t: { zh: "Drive 的 README", en: "The Drive README" }, d: { zh: "一頁看懂整個 Drive。", en: "The whole Drive on one page." }, url: GDOC + "11b5po6dSQGaQA6QCHpigSNyRYZfXZzOcqSsAB-_aKsg/edit", kind: "doc", access: "team" },

  // ---- Drive folders. Descriptions come from the System site by folder name.
  { id: "d00", g: "drive", t: "00 Start Here", url: DRIVE_ROOT + "1C0q5PeH-iqm_9-plYEXXm4KCWwM-pd3u", kind: "folder", access: "team" },
  { id: "d10", g: "drive", t: "10 Training", url: DRIVE_ROOT + "1lMEdKh91ggeYlg8pC0ymFFIZxp1JfWch", kind: "folder", access: "team" },
  { id: "d15", g: "drive", t: "15 Research", url: DRIVE_ROOT + "1dGWrH-xp-7dLEMQwJr1yRWIx2qXEyghE", kind: "folder", access: "team" },
  { id: "d20", g: "drive", t: "20 Topic", url: DRIVE_ROOT + "12k0r3kOW8WZNYJuhmwQ8t2Pnxgf-fA65", kind: "folder", access: "team" },
  { id: "d31", g: "drive", t: "31 Wetlab", url: DRIVE_ROOT + "1aMo0DLw6DcR0NoviQMiVCqMZzDx9vKFJ", kind: "folder", access: "team" },
  { id: "d32", g: "drive", t: "32 Drylab", url: DRIVE_ROOT + "11w3bCx1OadiPBB62R61csNvHXHYTG7Xc", kind: "folder", access: "team" },
  { id: "d33", g: "drive", t: "33 Hardware", url: DRIVE_ROOT + "1TblvMKLLZAH5tymkkv65UibRk7_KRjUs", kind: "folder", access: "team" },
  { id: "d34", g: "drive", t: "34 Human Practices", url: DRIVE_ROOT + "1Fok1Prve2NrIE3-xCUVETZHKFn6FD2du", kind: "folder", access: "team" },
  { id: "d40", g: "drive", t: "40 Media", url: DRIVE_ROOT + "1___BOkF556D6jscALWfbcdP1dx0paUiA", kind: "folder", access: "team" },
  { id: "d50", g: "drive", t: "50 Deliverables", url: DRIVE_ROOT + "1nZWoKCrQiQQMuz8u8O36PAf4veyvNmcV", kind: "folder", access: "team" },
  { id: "d60", g: "drive", t: "60 Advisors", url: DRIVE_ROOT + "1xq1ltdjGsUKtzmFq7P0Q59xAeSmcOfoO", kind: "folder", access: "team" },
  { id: "d90", g: "drive", t: "90 Archive", url: DRIVE_ROOT + "1N5GtQlWVVwCvIyyiTyfRg9T6cmW6gE_9", kind: "folder", access: "team" },
  { id: "classes", g: "drive", t: { zh: "10 Training／Classes 課堂投影片", en: "10 Training / Classes" }, d: { zh: "每堂課的投影片。", en: "Slides for every class." }, url: DRIVE_ROOT + "13dbPhiVplnBBEJ-YRLmlPnxo6NZOcrE7", kind: "folder", access: "team" },
  { id: "recordings", g: "drive", t: { zh: "10 Training／Recordings 課堂錄影", en: "10 Training / Recordings" }, d: { zh: "沒到的課從這裡補。", en: "Catch up on a missed class here." }, url: DRIVE_ROOT + "1uYD2vgKgXvVyD2pYkrWe1eF8vSsYaLnp", kind: "folder", access: "team" },
  { id: "assignments", g: "drive", t: { zh: "10 Training／Assignments 作業繳交", en: "10 Training / Assignments" }, d: { zh: "訓練作業交到這裡。", en: "Training homework is handed in here." }, url: DRIVE_ROOT + "1O3aYYURNhT59q3gDqFLqv_QyOW5GRhaE", kind: "folder", access: "team" },
  { id: "topic-cards", g: "drive", t: { zh: "20 Topic／Topic Cards 題目卡", en: "20 Topic / Topic Cards" }, d: { zh: "一題一張卡。", en: "One card per topic." }, url: DRIVE_ROOT + "19J0TaT_3Q1dlDnj4mEDsvkpcXm4qnu3k", kind: "folder", access: "team" },
  { id: "topic-research", g: "drive", t: { zh: "15 Research／Topic Research", en: "15 Research / Topic Research" }, d: { zh: "候選題目的研究簡報。", en: "Briefs on candidate topics." }, url: DRIVE_ROOT + "1x26CHnVaCNaiOlFltzgIHKckiBoLxNBr", kind: "folder", access: "team" },
  { id: "media-inbox", g: "drive", t: { zh: "40 Media／_Inbox 照片收件匣", en: "40 Media / _Inbox" }, d: { zh: "只是等歸檔的地方，每週日清空。", en: "Only a waiting room for filing; emptied every Sunday." }, url: DRIVE_ROOT + "1LCJDzGwuIuxUGUxx_gp1cdJC1OGhWHkh", kind: "folder", access: "team" },
  { id: "wiki-masters", g: "drive", t: { zh: "50 Deliverables／Wiki 頁面主文件", en: "50 Deliverables / Wiki" }, d: { zh: "每個 wiki 頁一份主文件，W001 到 W021。", en: "One master doc per wiki page, W001 to W021." }, url: DRIVE_ROOT + "1e9stdNfxG6xbXElyGLAMZiQVGPjCFPgg", kind: "folder", access: "team" },
  { id: "forms", g: "drive", t: { zh: "50 Deliverables／Forms 官方表單", en: "50 Deliverables / Forms" }, d: { zh: "送給 iGEM 的表單草稿與存檔。", en: "Drafts and filed copies of the forms sent to iGEM." }, url: DRIVE_ROOT + "1QwcId1b5XMHQtVEmgFXm8iawy_wO4OYp", kind: "folder", access: "team" },

  // ---- workbooks
  { id: "training", g: "sheets", t: { zh: "Training 訓練課表", en: "Training" }, d: { zh: "課程表與每一批訓練。", en: "The curriculum and each training batch." }, url: GSHEET + "1kp5vXm75pFDdJTZf1RJeucFJ2Ga4t5jUkL3wZAVnxeA/edit", kind: "sheet", access: "team" },
  { id: "topic-pipeline", g: "sheets", t: { zh: "Topic Pipeline 題目漏斗", en: "Topic Pipeline" }, d: { zh: "每一輪的題目和評語，全部在同一張表。", en: "Each round’s topics and comments, all in one table." }, url: GSHEET + "10SZ6M07LwE1E7_AC8c8at-VEIGL8WldYaqedJoY34GE/edit", kind: "sheet", access: "team" },
  { id: "lab-roster", g: "sheets", t: { zh: "Lab Roster 實驗室班表", en: "Lab Roster" }, d: { zh: "誰哪一天進實驗室。", en: "Who is in the lab on which day." }, url: GSHEET + "1WKziqlzNWunorrOPWUP_VKH-9B-XVb-445_vJGDezMk/edit", kind: "sheet", access: "team" },
  { id: "safety-register", g: "sheets", t: { zh: "Safety Register 安全登記", en: "Safety Register" }, d: { zh: "事故與近失、化學品、保養、廢棄物。", en: "Incidents and near misses, chemicals, maintenance, waste." }, url: GSHEET + "1_W7B_HfQBrjvSntIaSza-lNBwmlvutmbFGFhbiN6CRk/edit", kind: "sheet", access: "team" },
  { id: "idt-orders", g: "sheets", t: { zh: "IDT Orders 訂單", en: "IDT Orders" }, d: { zh: "每張訂單對應一個 Construct ID。", en: "Every order matches a Construct ID." }, url: GSHEET + "18Vu_ffK-oEn2glJYA70rzgx8ulLCgZzDTOzqnwd413Y/edit", kind: "sheet", access: "team" },
  { id: "survey-bank", g: "sheets", t: { zh: "Survey Bank 問卷庫", en: "Survey Bank" }, d: { zh: "HP 用過和要用的問卷題目。", en: "Survey instruments HP has used or plans to use." }, url: GSHEET + "1Ke2JxIwdJ24bm8H-gNtYFT_QHVDfnw7D33YfSy--vIw/edit", kind: "sheet", access: "team" },
  { id: "attribution", g: "sheets", t: { zh: "Attribution 貢獻表", en: "Attribution" }, d: { zh: "隊員與外部協助者各一個分頁。", en: "One tab for members, one for outside help." }, url: GSHEET + "1A8XiwTHXDCeB_ctLetqA_qkLSgUDY5_PLjWKM6kLN98/edit", kind: "sheet", access: "team" },
  { id: "archive-manifest", g: "sheets", t: { zh: "Archive Manifest 封存清單", en: "Archive Manifest" }, d: { zh: "打包封存的東西各是什麼、放在哪。", en: "What each archived batch is and where it sits." }, url: GSHEET + "1OhzcDMOyrwR9KhHvricB5J0IErlc-4-PUwPJLGZ7fbI/edit", kind: "sheet", access: "team" },

  // ---- templates
  { id: "tpl", g: "templates", t: { zh: "所有範本", en: "All templates" }, d: { zh: "00 Start Here／Templates 資料夾。", en: "The 00 Start Here / Templates folder." }, url: DRIVE_ROOT + "1mE1nJkabhK28yuRtsGmP0g64N4CtrfLK", kind: "folder", access: "team" },
  { id: "tpl-topic", g: "templates", t: { zh: "Topic Card 題目卡", en: "Topic Card" }, url: GDOC + "1mN03XZcvDWMbo4bAXN6jqAH2zgNKg4f4__WOHfzUNA8/edit", kind: "doc", access: "team" },
  { id: "tpl-meeting", g: "templates", t: { zh: "Meeting 會議紀錄", en: "Meeting minutes" }, url: GDOC + "1551UxskN6h-wh1r-8AXzHlx44sOqLb3r4hz6ro-U9e8/edit", kind: "doc", access: "team" },
  { id: "tpl-decision", g: "templates", t: { zh: "Decision Record 決策紀錄", en: "Decision Record" }, url: GDOC + "1FOA3pAAb95VhOmDXytCoANT6AUghl9_Umws9pOiEnM8/edit", kind: "doc", access: "team" },
  { id: "tpl-run", g: "templates", t: { zh: "Run Record 實驗紀錄", en: "Run Record" }, url: GDOC + "1U89jfsP73T4RxSwwm9HCE0HzbesXSeOrdavPKkx1yVk/edit", kind: "doc", access: "team" },
  { id: "tpl-runlog", g: "templates", t: { zh: "Run Log 運算紀錄表", en: "Run Log" }, url: GSHEET + "1pLyMJZHdT_l2_lwNx6gDA42JPQN5r1Q_DahExohSnA0/edit", kind: "sheet", access: "team" },
  { id: "tpl-sop", g: "templates", t: { zh: "SOP 標準作業程序", en: "SOP" }, url: GDOC + "11JHAoMpXjYB7X5nRm5e5bEeQHEDRUR-C_B3FkIRbUwU/edit", kind: "doc", access: "team" },
  { id: "tpl-project", g: "templates", t: { zh: "Project Card 專案卡", en: "Project Card" }, url: GDOC + "1pIOxZQjBunRVsdGlWZFZgmOeO3RkVqyOeCMFjuwh-fM/edit", kind: "doc", access: "team" },
  { id: "tpl-interaction", g: "templates", t: { zh: "Interaction 互動紀錄", en: "Interaction record" }, url: GDOC + "1YoF7_sBkjgcyiFePI8aeqONn2Wm0aN7A_r-OiciFWfY/edit", kind: "doc", access: "team" },
  { id: "tpl-wiki", g: "templates", t: { zh: "Wiki Page Master 頁面主文件", en: "Wiki Page Master" }, url: GDOC + "1fdGaQXpx3EqaKhDGcAMDK_0shwhytR_MVyEHhWAgQqY/edit", kind: "doc", access: "team" },
  { id: "tpl-assignment", g: "templates", t: { zh: "Training Assignment 訓練作業", en: "Training Assignment" }, url: GDOC + "1CtENzgSerwZF4qy8jVQa8bqirFtzEi_T2YaYAqKPQhk/edit", kind: "doc", access: "team" },
  { id: "tpl-roadmap", g: "templates", t: { zh: "Roadmap 年度路線圖", en: "Roadmap" }, url: GDOC + "1k_xxbcSMB0HM9xsPk_dYu2l7-WxIh4j05ygoiNcy5o8/edit", kind: "doc", access: "team" },
  { id: "tpl-mock", g: "templates", t: { zh: "Mock Judging 模擬評審紀錄", en: "Mock Judging record" }, url: GDOC + "1b5t-ks3Ho5D6LfPVZkyFtmf1-_3R_m-I06y3yJ6qPtU/edit", kind: "doc", access: "team" },

  // ---- the System site
  { id: "sys-home", g: "system", t: { zh: "系統網站：今天", en: "System site: Today" }, d: { zh: "下一個節點和最新的系統更新。", en: "The next node and the latest system updates." }, url: SYS, kind: "site", access: "public" },
  { id: "sys-system", g: "system", t: { zh: "系統全貌", en: "The whole system" }, d: { zh: "為什麼、規則、架構、Drive、流程、文件年表。約 10 分鐘。", en: "Why, rules, architecture, Drive, flow and the document year. About ten minutes." }, url: SYS + "system.html", kind: "site", access: "public" },
  { id: "sys-time", g: "system", t: { zh: "時程", en: "Schedule" }, d: { zh: "每個節點和它的通過條件。", en: "Every node with its pass condition." }, url: SYS + "timeline.html", kind: "site", access: "public" },
  { id: "sys-people", g: "system", t: { zh: "角色", en: "Roles" }, d: { zh: "每個席位負責什麼、每週做什麼、花多少時間。", en: "What each seat owns, does each week and costs in time." }, url: SYS + "people.html", kind: "site", access: "public" },
  { id: "sys-students", g: "system", t: { zh: "學生歷程", en: "Student journeys" }, d: { zh: "一年下來會記下什麼，年鑑長什麼樣子。", en: "What a year records, and what the yearbook looks like." }, url: SYS + "students.html", kind: "site", access: "public" },
  { id: "sys-advisors", g: "system", t: { zh: "Advisor 計畫", en: "Advisor programme" }, d: { zh: "五個階段、每月底線、每份產出放哪裡。", en: "Five stages, the monthly floor and where each output goes." }, url: SYS + "advisors.html", kind: "site", access: "public" },
  { id: "sys-research", g: "system", t: "Research", d: { zh: "一個問題怎麼變成一張卡、一個結論、一個決定。", en: "How a question becomes a card, a conclusion and a decision." }, url: SYS + "research.html", kind: "site", access: "public" },
  { id: "sys-updates", g: "system", t: { zh: "系統更新紀錄", en: "System updates" }, d: { zh: "系統每天改了什麼。", en: "What changed in the system, day by day." }, url: SYS + "updates.html", kind: "site", access: "public" },

  // ---- wiki
  { id: "wiki-preview", g: "wiki", t: { zh: "2027 Wiki 範本線上預覽", en: "2027 wiki template, live preview" }, d: { zh: "直接在瀏覽器看範本：每一頁的網址、版型和評審重點。不是評審看的那份。", en: "The template in your browser: every page’s URL, layout and what the judges look for. Not the judged wiki." }, url: "https://timmy97-tw.github.io/GEMS-iGEM-2027-wiki-template/", kind: "site", access: "public" },
  { id: "wiki-template", g: "wiki", t: { zh: "2027 Wiki 範本 repo", en: "2027 wiki template repo" }, d: { zh: "今年 wiki 的起點，公開的 GitHub template。", en: "Where this year’s wiki starts. A public GitHub template." }, url: "https://github.com/Timmy97-TW/GEMS-iGEM-2027-wiki-template", kind: "repo", access: "public" },
  { id: "wiki-2027", g: "wiki", t: { zh: "2027 官方 wiki", en: "2027 official wiki" }, d: { zh: "iGEM 開放 2027 隊伍 repo 後才有。", en: "Exists once iGEM opens the 2027 team repositories." }, url: "", kind: "igem", access: "team" },
  { id: "wiki-2026", g: "wiki", t: { zh: "2026 ReLEAF wiki（官方）", en: "2026 ReLEAF wiki (official)" }, d: { zh: "去年的成品。看一頁完整的 wiki 長什麼樣子。", en: "Last year’s finished wiki. See what a complete page looks like." }, url: "https://2026.igem.wiki/gems-taiwan/", kind: "igem", access: "public" },
  { id: "wiki-structure", g: "wiki", t: { zh: "Wiki 每一頁怎麼寫", en: "How to write each wiki page" }, d: { zh: "頁面結構、評審手冊的評分項、得獎隊伍怎麼排同一頁。", en: "Page structures, the judging rubrics and how prize winners laid out the same pages." }, url: PAGES_GH + "wiki-structure-analysis/", kind: "site", access: "public" },

  // ---- iGEM official
  { id: "igem-calendar", g: "igem", t: { zh: "iGEM 行事曆", en: "iGEM calendar" }, d: { zh: "官方截止日。2027 公布後以這裡為準。", en: "Official deadlines. Once 2027 is announced, this is the authority." }, url: "https://competition.igem.org/about/calendar", kind: "igem", access: "public", pin: true },
  { id: "igem-deliverables", g: "igem", t: { zh: "交付物", en: "Deliverables" }, d: { zh: "Wiki、影片、表單各要交什麼。", en: "What the wiki, videos and forms each require." }, url: "https://competition.igem.org/deliverables", kind: "igem", access: "public" },
  { id: "igem-judging", g: "igem", t: { zh: "評審與獎牌", en: "Judging and medals" }, d: { zh: "獎牌條件、特別獎、評審手冊。", en: "Medal criteria, special prizes and the Judging Handbook." }, url: "https://competition.igem.org/judging", kind: "igem", access: "public" },
  { id: "igem-rules", g: "igem", t: { zh: "規則與政策", en: "Rules and policies" }, url: "https://competition.igem.org/about/rules-and-policies", kind: "igem", access: "public" },
  { id: "igem-hs", g: "igem", t: { zh: "高中組", en: "High school track" }, url: "https://competition.igem.org/high-school", kind: "igem", access: "public" },
  { id: "igem-safety", g: "igem", t: { zh: "安全與責任", en: "Safety and responsibility" }, d: { zh: "安全政策與表單說明。", en: "Safety policies and form guidance." }, url: "https://responsibility.igem.org/", kind: "igem", access: "public" },
  { id: "igem-whitelist", g: "igem", t: { zh: "White List 白名單", en: "White List" }, d: { zh: "哪些生物和元件可以直接用。題目要先比對。", en: "Which organisms and parts may be used without asking. Check every topic against it." }, url: "https://responsibility.igem.org/guidance/white-list", kind: "igem", access: "public" },
  { id: "igem-registry", g: "igem", t: { zh: "Registry 元件庫", en: "Registry of Parts" }, url: "https://registry.igem.org/", kind: "igem", access: "public" },
  { id: "igem-distribution", g: "igem", t: { zh: "Distribution 配送套件", en: "Distribution kit" }, url: "https://technology.igem.org/distribution", kind: "igem", access: "public" },
  { id: "igem-uploads", g: "igem", t: { zh: "Uploads 圖片上傳", en: "Uploads tool" }, d: { zh: "Wiki 的圖片和影片都要先傳到這裡。", en: "Wiki images and video go here first." }, url: "https://tools.igem.org/uploads", kind: "igem", access: "public" },
  { id: "igem-gitlab", g: "igem", t: { zh: "iGEM GitLab", en: "iGEM GitLab" }, d: { zh: "官方 wiki 的 repo 在這裡。", en: "Where the official wiki repository lives." }, url: "https://gitlab.igem.org/", kind: "igem", access: "public" },
  { id: "igem-jamboree", g: "igem", t: { zh: "Grand Jamboree", en: "Grand Jamboree" }, url: "https://jamboree.igem.org/", kind: "igem", access: "public" },

  // ---- from past seasons
  { id: "pitch", g: "learn", t: { zh: "題目評估架構：十道門", en: "Project Pitch Framework: ten gates" }, d: { zh: "二月定題前，一個題目要過的十道門，附 ReLEAF 完整範例。", en: "Ten gates a topic passes before committing in February, with ReLEAF worked through." }, url: PAGES_GH + "2027-GEMS-Project-Pitch-Framework/", kind: "site", access: "public" },
  { id: "decoder", g: "learn", t: { zh: "評審手冊解碼", en: "Judge Handbook decoder" }, d: { zh: "評審票上每一行在問什麼，wiki 要怎麼對應。", en: "What each scored line of the ballot asks, and what the wiki must show for it." }, url: PAGES_GH + "igem-2026-judging-decoder/", kind: "site", access: "public" },
  { id: "titles", g: "learn", t: { zh: "把結論寫在標題", en: "Say it in the title" }, d: { zh: "投影片標題和結果圖怎麼寫才清楚。", en: "How to write slide titles and results slides that say something." }, url: PAGES_GH + "say-it-in-the-title/", kind: "site", access: "public" },
  { id: "stakeholders", g: "learn", t: { zh: "利害關係人地圖 2022–2026", en: "Stakeholder atlas 2022–2026" }, d: { zh: "歷年合作過的專家、實驗室、機關、公司、學校和農民。", en: "Every expert, lab, agency, company, school and farmer the team has worked with." }, url: PAGES_GH + "GEMS_Stakeholder/", kind: "site", access: "public" },
  { id: "prize-scout", g: "learn", t: { zh: "特別獎偵察：高中組", en: "Special prize scout: high school" }, d: { zh: "每一支高中隊伍照評審手冊打分數的結果。", en: "Every high-school team scored against the judging handbook." }, url: PAGES_GH + "igem-special-prize-scout/", kind: "site", access: "public" },
  { id: "judging-qa", g: "learn", t: { zh: "評審問答訓練", en: "Judging Q&A trainer" }, d: { zh: "2026 的評審題庫與模擬問答。", en: "The 2026 question bank and mock Q&A." }, url: PAGES_GH + "releaf-judging-qa/", kind: "site", access: "public" },
  { id: "jamboree-2026", g: "learn", t: { zh: "2026 前進巴黎", en: "2026 road to Paris" }, d: { zh: "去年最後五週的行事曆、巴黎行程和攤位排班。", en: "Last year’s final five weeks: calendar, Paris plan and booth shifts." }, url: PAGES_GH + "releaf-jamboree/", kind: "site", access: "public" },

  // ---- tools
  { id: "library", g: "tools", t: { zh: "共用文獻庫（Zotero）", en: "Shared library (Zotero)" }, d: { zh: "全隊只有一個庫，一種引用格式。開季時開放。", en: "One library for the whole team and one citation style. Opens with the season." }, url: "", kind: "tool", access: "team" },
  { id: "calendar", g: "tools", t: { zh: "團隊行事曆", en: "Team calendar" }, d: { zh: "11/25 系統完成時上線。在那之前看里程碑頁。", en: "Live when the system is ready on 25 Nov. Until then, use the Milestones page." }, url: "", kind: "tool", access: "team" },
  { id: "github-org", g: "tools", t: { zh: "團隊 GitHub", en: "Team GitHub" }, d: { zh: "程式碼、韌體、wiki 原始碼和交接文。程式不進 Drive。", en: "Code, firmware, wiki source and handover notes. Code stays out of Drive." }, url: "", kind: "repo", access: "team" },
  { id: "hub-repo", g: "tools", t: { zh: "這個網站的 repo", en: "This site’s repo" }, d: { zh: "發公告、改每週目標、加連結，都是改 data 資料夾裡的一行。", en: "Posting a notice, changing weekly goals or adding a link is one line in the data folder." }, url: "https://github.com/Timmy97-TW/GEMS-iGEM-2027-Hub", kind: "repo", access: "public" }
];
