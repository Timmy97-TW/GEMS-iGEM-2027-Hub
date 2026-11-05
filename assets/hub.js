// GEMS iGEM 2027 Project Hub: shell, search and every page.
// Content lives in data/*.js. data/season.js is copied from the System site; the rest is edited by hand.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    json(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  };
  const PAGE = document.body.dataset.page;
  const SYS = "https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/";

  // The System site sits on the same origin and uses the same key, so the choice carries across both.
  let lang = store.get("lang") === "en" ? "en" : "zh";
  const L = o => (o && typeof o === "object" ? o[lang] : o) || "";
  const tx = (zh, en) => (lang === "zh" ? zh : en);
  const both = o => (o && typeof o === "object" ? `${o.zh || ""} ${o.en || ""}` : o || "");

  // ---------- dates (Taipei). ?now=YYYY-MM-DD previews another day. ----------
  const DAY = 864e5;
  const forced = (new URLSearchParams(location.search).get("now") || "").slice(0, 10);
  const TODAY = /^\d{4}-\d\d-\d\d$/.test(forced) ? forced : new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10);
  const utc = d => new Date(d + "T00:00:00Z");
  const iso = x => x.toISOString().slice(0, 10);
  const addDays = (d, n) => iso(new Date(utc(d).getTime() + n * DAY));
  const diff = (a, b) => Math.round((utc(b) - utc(a)) / DAY);
  const dow = d => utc(d).getUTCDay();
  const monday = d => addDays(d, -((dow(d) + 6) % 7));
  const WD = { zh: "日一二三四五六", en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
  const wd = d => (lang === "zh" ? WD.zh[dow(d)] : WD.en[dow(d)]);
  const md = d => { const x = utc(d); return lang === "zh" ? `${x.getUTCMonth() + 1}/${x.getUTCDate()}` : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }); };
  const mdw = d => (lang === "zh" ? `${md(d)}（${wd(d)}）` : `${wd(d)} ${md(d)}`);
  const longDate = d => { const x = utc(d); return lang === "zh" ? `${x.getUTCFullYear()} 年 ${x.getUTCMonth() + 1} 月 ${x.getUTCDate()} 日　週${wd(d)}` : x.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); };
  const monthName = ym => { const x = utc(ym + "-01"); return lang === "zh" ? `${x.getUTCFullYear()} 年 ${x.getUTCMonth() + 1} 月` : x.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }); };
  const rel = d => {
    const n = diff(TODAY, d);
    if (n === 0) return tx("今天", "today");
    if (n === 1) return tx("明天", "tomorrow");
    if (n === -1) return tx("昨天", "yesterday");
    return n > 0 ? tx(`${n} 天後`, `in ${n} days`) : tx(`${-n} 天前`, `${-n} days ago`);
  };

  // ---------- icons ----------
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', ext: '<path d="M7 17 17 7M8 7h9v9"/>',
    right: '<path d="m9 6 6 6-6 6"/>', left: '<path d="m15 6-6 6 6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13M9 7h6"/>',
    horn: '<path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M17.5 9a4 4 0 0 1 0 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.6a5 5 0 0 1 4.5 5"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    sheet: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',
    site: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    repo: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    igem: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><circle cx="12" cy="12" r="2.5"/>',
    star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    gate: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/>'
  };
  const ic = k => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || IC.link}</svg>`;
  const MARK = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#00061C"/><path d="M16 16 8.5 10M16 16l8-5M16 16v9" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/><circle cx="8.5" cy="10" r="3" fill="#2887FF"/><circle cx="24" cy="11" r="3" fill="#00D492"/><circle cx="16" cy="25" r="3" fill="#7C5CFF"/><circle cx="16" cy="16" r="3.5" fill="#fff"/></svg>`;

  // ---------- season data ----------
  const NODES = SEASON.nodes.slice().sort((a, b) => a.date.localeCompare(b.date));
  const NODE = Object.fromEntries(NODES.map(n => [n.n, n]));
  const ROLES = SEASON.roles, ROLE = Object.fromEntries(ROLES.map(r => [r.code, r]));
  const roleNodes = r => [].concat(...Object.values(r.nodes || {}));
  const nodeSeats = n => ROLES.filter(r => roleNodes(r).includes(n));
  const LANE = {
    deadline: { c: "var(--red)", zh: "iGEM 截止", en: "iGEM deadline" },
    gate: { c: "var(--blue)", zh: "內部關卡", en: "Internal gate" },
    adv: { c: "#C9A227", zh: "Advisor", en: "Advisor" }
  };
  const GROUPS = [
    ["wet", "var(--teal)", "Wet lab", "Wet lab"], ["dry", "var(--blue)", "Dry lab", "Dry lab"], ["hw", "var(--amber)", "Hardware", "Hardware"],
    ["hp", "var(--green)", "Human Practices", "Human Practices"], ["wiki", "var(--violet)", "Wiki 與交付物", "Wiki & deliverables"], ["media", "var(--pink)", "Media", "Media"],
    ["ops", "#3B4A6B", "隊務", "Team ops"], ["adv", "#C9A227", "Advisor", "Advisors"], ["staff", "var(--ink3)", "老師與 Ops", "Instructors & Ops"]
  ].map(([id, c, zh, en]) => ({ id, c, zh, en }));
  const GROUP = Object.fromEntries(GROUPS.map(g => [g.id, g]));
  const gName = id => (id === "all" ? tx("全隊", "Everyone") : L(GROUP[id]) || id);
  const DOCLANE = { wet: "wet", dry: "dry", hw: "dry", hp: "hp", wiki: "wiki", media: "wiki", ops: "all", adv: "adv", staff: "ops" };
  const LINK = Object.fromEntries(LINKS.map(l => [l.id, l]));
  const driveNote = name => { const f = SEASON.drive.find(x => x.name === name); return f ? L(f.holds) : ""; };
  const linkD = l => L(l.d) || driveNote(L(l.t));
  const KINDC = { folder: "var(--blue)", doc: "var(--blue2)", sheet: "var(--green)", site: "var(--violet)", repo: "var(--ink)", igem: "var(--red)", tool: "var(--amber)" };

  // ---------- who is looking: kept in this browser only ----------
  let me = Object.assign({ group: "all", seat: "" }, store.json("gems27.me", {}));
  if (me.seat && !ROLE[me.seat]) me.seat = "";
  const mine = () => (me.seat ? [ROLE[me.seat]] : me.group === "all" ? [] : ROLES.filter(r => r.group === me.group));
  const isMineNode = n => mine().some(r => roleNodes(r).includes(n));
  const meBar = () => {
    const seats = ROLES.filter(r => me.group === "all" || r.group === me.group);
    return `<div class="me">
      <span class="me__l">${ic("users")}${tx("我是", "I am in")}</span>
      <div class="seg">${[{ id: "all", c: "var(--ink3)" }, ...GROUPS].map(g => `<button data-me="${g.id}" aria-pressed="${me.group === g.id}" style="--c:${g.c}">${g.id === "all" ? "" : "<i></i>"}${esc(gName(g.id))}</button>`).join("")}</div>
      <select data-meseat aria-label="${tx("席位", "Seat")}"><option value="">${tx("席位（選填）", "Seat (optional)")}</option>${seats.map(r => `<option value="${r.code}"${me.seat === r.code ? " selected" : ""}>${r.code} · ${esc(L(r.name))}</option>`).join("")}</select>
      <span class="me__note">${tx("只存在這台裝置，不會傳出去。", "Saved on this device only. Nothing is sent anywhere.")}</span>
    </div>`;
  };

  // ---------- small parts ----------
  const seatChip = code => {
    if (code === "all") return `<span class="chip chip--navy">${tx("全隊", "Everyone")}</span>`;
    if (code === "staff") return `<span class="chip">${tx("老師", "Instructors")}</span>`;
    if (code === "adv") return `<span class="chip chip--amber">Advisors</span>`;
    const r = ROLE[code];
    if (!r) return `<span class="chip">${esc(code)}</span>`;
    const who = (HOLDERS[code] || []).join("、");
    return `<a class="seat" href="team.html#${code}" style="--c:${GROUP[r.group].c}" title="${esc(L(r.own))}"><code>${code}</code>${esc(who || L(r.name))}</a>`;
  };
  const nodeChip = n => (NODE[n] ? `<a class="nid" href="milestones.html#${n}" title="${esc(L(NODE[n].t))}">${n}</a>` : "");
  const nodeWhen = n => (n.dl ? L(n.dl) : mdw(n.date));
  const access = l => l.access === "team" ? `<span class="chip chip--blue">${ic("lock")}${tx("團隊帳號", "Team account")}</span>`
    : l.access === "soon" || !l.url ? `<span class="chip chip--amber">${ic("clock")}${tx("尚未開放", "Not open yet")}</span>` : "";
  const linkBtn = (id, label) => { const l = LINK[id]; if (!l) return ""; return l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(label || L(l.t))} ↗</a>` : `<a href="links.html#${id}">${esc(label || L(l.t))}</a>`; };
  const hwDone = store.json("gems27.hw", {});
  const hwState = h => (h.due < TODAY ? "closed" : h.assigned > TODAY ? "soon" : "open");
  const weekEntry = mon => WEEKS.find(w => w.from <= mon && (w.to || addDays(w.from, 6)) >= mon);
  const KICK = SEASON.bands[0].s, LAST = NODES[NODES.length - 1].date;
  const W1 = dow(KICK) === 1 ? KICK : addDays(monday(KICK), 7);
  const weekLabel = mon => mon > LAST ? tx("賽季結束", "Season over") : mon >= W1 ? tx(`第 ${diff(W1, mon) / 7 + 1} 週`, `Week ${diff(W1, mon) / 7 + 1}`) : mon === monday(KICK) ? tx("開季週", "Kickoff week") : tx("開季前", "Pre-season");
  const phaseOn = d => {
    const b = SEASON.bands.filter(x => ["phase", "crunch", "trip"].includes(x.kind));
    const hit = b.find(x => d >= x.s && d <= x.e);
    return hit ? L(hit.n) : d < b[0].s ? tx("系統建置", "Building the system") : d > LAST ? tx("賽季結束", "Season over") : tx("階段之間", "Between phases");
  };
  const shadeOn = d => SEASON.bands.find(x => ["break", "exam"].includes(x.kind) && d >= x.s && d <= x.e);
  const dayEvents = d => [
    ...NODES.filter(n => n.date === d).map(n => ({ c: LANE[n.lane].c, t: `${n.n} ${L(n.t)}`, href: `milestones.html#${n.n}` })),
    ...HOMEWORK.filter(h => h.due === d).map(h => ({ c: "var(--violet)", t: `${tx("交", "Due")}：${L(h.t)}`, href: `homework.html#${h.id}` })),
    ...SESSIONS.filter(s => d >= s.from && d <= s.to && s.days.includes(dow(d))).map(s => ({ soft: 1, t: L(s.t) }))
  ];
  const evHTML = e => e.href ? `<a class="ev" href="${e.href}" style="--c:${e.c}" title="${esc(e.t)}">${esc(e.t)}</a>` : `<span class="ev ev--soft" title="${esc(e.t)}">${esc(e.t)}</span>`;

  // ---------- shell ----------
  const NAV = [
    ["home", "index.html", "今天", "Today", "sun"], ["week", "week.html", "本週", "This week", "target"], ["milestones", "milestones.html", "里程碑", "Milestones", "flag"],
    ["homework", "homework.html", "作業", "Homework", "book"], ["news", "announcements.html", "公告", "News", "horn"], ["team", "team.html", "負責人", "Team", "users"],
    ["credits", "attributions.html", "貢獻", "Credits", "award"], ["links", "links.html", "連結", "Links", "link"], ["guide", "guide.html", "指南", "Guide", "compass"]
  ].map(([k, href, zh, en, icon]) => ({ k, href, zh, en, icon }));
  function shell() {
    $("#nav").innerHTML = `<div class="nav__in">
      <a class="brand" href="index.html">${MARK}<span><b>${tx("GEMS 2027 專案中心", "GEMS 2027 <i>Project </i>Hub")}</b><small>iGEM · GEMS Taiwan</small></span></a>
      <nav class="nav__links" aria-label="Pages">${NAV.map(p => `<a href="${p.href}"${p.k === PAGE ? ' aria-current="page"' : ""}>${esc(L(p))}</a>`).join("")}</nav>
      <div class="nav__act">
        <button class="find" data-find aria-label="${tx("搜尋", "Search")}">${ic("search")}<span>${tx("搜尋", "Search")}</span><kbd>/</kbd></button>
        <a class="syslink" href="${SYS}" title="GEMS iGEM System">${ic("gate")}<span>${tx("系統", "System")} ↗</span></a>
        <div class="lang" role="group" aria-label="Language"><button data-lang="zh" aria-pressed="${lang === "zh"}">中</button><button data-lang="en" aria-pressed="${lang === "en"}">EN</button></div>
      </div></div>`;
    $("#foot").innerHTML = `<div class="foot__in">
      <div><h4>${tx("GEMS 2027 專案中心", "GEMS 2027 Project Hub")}</h4>
        <p>${tx("GEMS Taiwan 2027 iGEM 隊的入口：每週目標、里程碑、作業、負責人和所有連結。", "The front door for the GEMS Taiwan 2027 iGEM team: weekly goals, milestones, homework, owners and every link.")}</p>
        <p>${tx("這是公開網站。個人進度、評量和聯絡方式不放在這裡；節點、角色與規則每天從系統網站同步。", "This site is public. Individual progress, reviews and contact details stay off it; nodes, seats and rules sync daily from the System site.")} ${tx("日期依 2027 時程提案，標 ? 的是推估。", "Dates follow the proposed 2027 schedule; those marked ? are estimates.")}</p></div>
      <div><h4>${tx("頁面", "Pages")}</h4><nav>${NAV.map(p => `<a href="${p.href}">${esc(L(p))}</a>`).join("")}</nav></div>
      <div><h4>GEMS iGEM System</h4><nav>${LINKS.filter(l => l.g === "system").map(l => `<a href="${l.url}">${esc(L(l.t).replace(/^.*[：:] ?/, ""))}</a>`).join("")}</nav></div>
    </div>`;
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    const p = NAV.find(x => x.k === PAGE);
    document.title = PAGE === "home" ? tx("GEMS 2027 專案中心", "GEMS 2027 Project Hub") : `${L(p)} · ${tx("GEMS 2027 專案中心", "GEMS 2027 Project Hub")}`;
  }
  const head = (eyebrow, h1, lede, extra = "") => `<section class="ph${PAGE === "home" ? " ph--home" : ""}"><div class="wrap">
    <p class="eyebrow"><i></i>${eyebrow.filter(Boolean).map(e => `<span>${esc(e)}</span>`).join("")}</p><h1 class="h1">${h1}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}${extra}</div></section>`;

  // ---------- year ribbon ----------
  const R0 = "2026-11-01", R1 = "2027-12-01";
  const rx = d => (diff(R0, d) / diff(R0, R1)) * 100;
  function ribbon(filter) {
    const nextN = (NODES.find(n => n.date >= TODAY) || {}).n;
    const months = Array.from({ length: 13 }, (_, i) => { const x = new Date(Date.UTC(2026, 10 + i, 1)); return `<span style="left:${rx(iso(x))}%">${lang === "zh" ? `${x.getUTCMonth() + 1}月` : x.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}</span>`; }).join("");
    const bands = SEASON.bands.filter(b => ["phase", "crunch", "trip"].includes(b.kind)).map(b => `<span class="rb__band rb__band--${b.kind}${TODAY >= b.s && TODAY <= b.e ? " is-now" : ""}" style="left:${rx(b.s)}%;width:${rx(b.e) - rx(b.s)}%" title="${esc(L(b.n))}">${esc(L(b.n))}</span>`).join("");
    const dot = n => `<a class="rb__dot${n.date < TODAY ? " is-past" : ""}${n.n === nextN ? " is-next" : ""}${filter && !filter(n) ? " is-dim" : ""}" href="milestones.html#${n.n}" style="left:${rx(n.date)}%;--c:${LANE[n.lane].c}" title="${esc(`${nodeWhen(n)} · ${n.n} ${L(n.t)}`)}" aria-label="${esc(`${nodeWhen(n)} ${L(n.t)}`)}"></a>`;
    return `<div class="rb"><div class="rb__in">
      <div class="rb__months">${months}</div><div class="rb__bands">${bands}</div>
      <div class="rb__row rb__row--deadline"><small>${tx("iGEM 截止", "iGEM deadlines")}</small>${NODES.filter(n => n.lane === "deadline").map(dot).join("")}</div>
      <div class="rb__row rb__row--gate"><small>${tx("內部關卡", "Internal gates")}</small>${NODES.filter(n => n.lane !== "deadline").map(dot).join("")}</div>
      ${TODAY >= R0 && TODAY <= R1 ? `<div class="rb__today" style="left:${rx(TODAY)}%"><span>${tx("今天", "Today")}</span></div>` : ""}
    </div></div>
    <p class="legend">${Object.values(LANE).map(l => `<span><i style="--c:${l.c}"></i>${esc(L(l))}</span>`).join("")}<span>${tx("標 ? 的日期是推估，iGEM 公布 2027 後更新。", "Dates marked ? are estimates until iGEM announces 2027.")}</span></p>`;
  }

  // ---------- shared lists ----------
  const goalsHTML = w => w ? w.goals.map(g => `<li class="goal${g.done ? " is-done" : ""}"><span class="goal__box">${g.done ? ic("check") : ""}</span><div><p>${esc(L(g.t))}</p>
      <div class="goal__m">${seatChip(g.owner)}${g.node ? nodeChip(g.node) : ""}${g.link && LINK[g.link] ? `<span class="chip chip--line">${linkBtn(g.link)}</span>` : ""}</div></div></li>`).join("")
    : `<li class="empty">${tx("這一週的目標還沒寫。每月第一個週六訂月目標，每週的目標在週會後更新。", "No goals written for this week yet. Monthly goals are set on the first Saturday; weekly goals follow the weekly meeting.")}</li>`;
  const annRow = (a, big) => `<li class="ann${big ? " ann--big" : ""}${a.pin ? " ann--pin" : ""}" id="a-${a.id}">
      ${big ? "" : `<time datetime="${a.d}">${esc(md(a.d))}</time>`}<h3>${esc(L(a.t))}</h3>${a.body ? `<p>${esc(L(a.body))}</p>` : ""}
      <div class="ann__m">${a.pin ? `<span class="chip chip--green">${tx("置頂", "Pinned")}</span>` : ""}<span class="chip">${esc(TAG[a.tag] ? L(TAG[a.tag]) : a.tag)}</span>${a.to ? `<a class="more" href="${esc(a.to)}"${/^https?:/.test(a.to) ? ' target="_blank" rel="noopener"' : ""}>${tx("去看", "Open")} →</a>` : ""}</div></li>`;
  const TAG = { team: { zh: "全隊", en: "Team" }, schedule: { zh: "時程", en: "Schedule" }, homework: { zh: "作業", en: "Homework" }, system: { zh: "系統", en: "System" }, igem: { zh: "iGEM", en: "iGEM" } };
  ANNOUNCEMENTS.forEach((a, i) => { a.id = `${a.d}-${ANNOUNCEMENTS.length - i}`; });
  const weekKey = monday(TODAY);
  const ticks = store.json("gems27.ticks", {});
  function routine() {
    const rows = [
      ...SEASON.chores.map((c, i) => ({ id: `c${i}`, t: L(c.t), s: `${L(c.who)} · ${c.min} ${tx("分鐘", "min")}` })),
      ...mine().slice(0, me.seat ? 1 : 0).flatMap(r => (r.week || []).map((w, i) => ({ id: `${r.code}${i}`, t: L(w), s: r.code })))
    ];
    return rows.map(r => `<label class="check"><input type="checkbox" data-tick="${r.id}"${(ticks[weekKey] || {})[r.id] ? " checked" : ""}><span>${esc(r.t)}</span><small>${esc(r.s)}</small></label>`).join("");
  }

  // ================= pages =================
  const S = { wk: monday(TODAY), nf: "all", nv: "list", cal: TODAY.slice(0, 7), hwf: "live", anf: "all", lg: "all", q: "", dl: "all", gq: "" };
  const seg = (key, opts) => `<div class="seg">${opts.map(([v, label, c, n]) => `<button data-set="${key}:${v}" aria-pressed="${S[key] === v}"${c ? ` style="--c:${c}"` : ""}>${c ? "<i></i>" : ""}${esc(label)}${n != null ? `<small>${n}</small>` : ""}</button>`).join("")}</div>`;
  const P = {};

  // ----- Today -----
  P.home = () => {
    const up = NODES.filter(n => n.date >= TODAY), next = up[0], mon = monday(TODAY), w = weekEntry(mon);
    const hw = HOMEWORK.filter(h => h.due >= TODAY && !hwDone[h.id]).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
    const pins = store.json("gems27.pins", {});
    const quick = LINKS.filter(l => (l.id in pins ? pins[l.id] : l.pin));
    const pinned = ANNOUNCEMENTS.filter(a => a.pin), rest = ANNOUNCEMENTS.filter(a => !a.pin).slice(0, 3);
    const toKick = diff(TODAY, KICK);
    const doors = [
      ["week", "var(--blue)", tx("這週的目標、要交的東西、每週例行清單，還有現在哪些紀錄正在用。", "This week’s goals, what is due, the weekly routine and which records are live right now."), WEEKS.reduce((n, x) => n + x.goals.length, 0), tx("個目標已排", "goals planned")],
      ["milestones", "var(--red)", tx("全年每一個節點：日期、通過條件、誰負責、誰驗收。清單或月曆。", "Every node of the year: date, pass condition, owner and who accepts it. As a list or a calendar."), NODES.length, tx("個節點", "nodes")],
      ["homework", "var(--violet)", tx("每份作業的說明、截止日、交到哪裡、誰看。", "Each assignment: what it is, when it is due, where it goes and who reads it."), HOMEWORK.length, tx("份作業", "assignments")],
      ["news", "var(--green)", tx("全隊公告，最新的在最上面。", "Notices for the whole team, newest first."), ANNOUNCEMENTS.length, tx("則公告", "notices")],
      ["team", "var(--teal)", tx("每個席位負責什麼，以及遇到問題該問誰。", "What each seat owns, and who to ask about what."), ROLES.length, tx("種席位", "seats")],
      ["credits", "var(--amber)", tx("誰做了什麼、誰幫了忙。整年累積，不在十月重建。", "Who did what and who helped. Built up all year, not rebuilt in October."), OUTSIDE.length, tx("類外部協助", "kinds of outside help")],
      ["links", "var(--blue2)", tx("Drive 資料夾、試算表、範本、網站和 iGEM 官方頁面。", "Drive folders, workbooks, templates, sites and official iGEM pages."), LINKS.length, tx("個連結", "links")],
      ["guide", "var(--navy)", tx("每週清單、七條規則、三道關卡、ID 速查、檔案放哪裡。", "The weekly checklist, seven rules, three gates, the ID cheat sheet and where files go."), SEASON.ids.length, tx("種 ID", "ID types")]
    ];
    return head([longDate(TODAY), `${tx("階段", "Phase")}：${phaseOn(TODAY)}`, toKick > 0 ? tx(`距開季 ${toKick} 天`, `${toKick} days to kickoff`) : weekLabel(mon)],
      tx("一年的工作，<br><em>從這一頁開始。</em>", "A year of work<br><em>starts on this page.</em>"),
      tx("這週要做什麼、下一個節點是哪一天、作業交到哪、該問誰、檔案在哪裡。", "What to do this week, when the next node lands, where homework goes, who to ask and where every file lives."),
      `<button class="bigfind" data-find>${ic("search")}<span>${tx("搜尋節點、作業、連結、席位、ID、資料夾…", "Search nodes, homework, links, seats, IDs, folders…")}</span><kbd>/</kbd></button>
       <p class="tries">${tx("試試", "Try")}${[["Handbook", "Handbook"], ["Wiki Freeze", "Wiki Freeze"], [tx("照片", "photos"), tx("照片", "photos")], ["Paper Card", "Paper Card"], [tx("安全", "safety"), tx("安全", "safety")]].map(([a, b]) => `<button data-try="${esc(b)}">${esc(a)}</button>`).join("")}</p>`)
    + `<section class="sec"><div class="wrap"><div class="grid">
      <article class="card card--top c5" style="--c:${next ? LANE[next.lane].c : "var(--blue)"}">
        <div class="card__h"><h2>${ic("flag")}${tx("下一個節點", "Next node")}</h2>${next ? `<span class="nid">${next.n}</span>` : ""}</div>
        ${next ? `<div class="next"><div class="next__n">${diff(TODAY, next.date) === 0 ? `<b>${tx("今天", "Today")}</b>` : `<b class="tn">${diff(TODAY, next.date)}</b><span>${tx("天後", "days")}</span>`}</div>
          <h3 class="next__t">${esc(L(next.t))}</h3><p class="next__d">${esc(nodeWhen(next))} · ${esc(L(LANE[next.lane]))}</p>
          ${L(next.pass) ? `<div class="next__pass"><b>${tx("通過條件", "To pass")}</b>${esc(L(next.pass))}</div>` : ""}
          <p class="next__who">${L(next.owner) ? `<span>${tx("負責", "Owner")} <b>${esc(L(next.owner))}</b></span>` : ""}${L(next.ok) ? `<span>${tx("驗收", "Accepts")} <b>${esc(L(next.ok))}</b></span>` : ""}</p></div>
          <div class="after">${up.slice(1, 5).map(n => `<a href="milestones.html#${n.n}"><time>${esc(n.dl ? md(n.date) : md(n.date))}</time><span><i style="--c:${LANE[n.lane].c}"></i>${esc(L(n.t))}</span><small>${diff(TODAY, n.date)} ${tx("天", "d")}</small></a>`).join("")}</div>
          <p style="margin-top:12px"><a class="more" href="milestones.html">${tx("全部里程碑", "All milestones")} →</a></p>` : `<p class="empty">${tx("這一季的節點都走完了。", "Every node this season has passed.")}</p>`}
      </article>
      <article class="card card--top c7" style="--c:var(--blue)">
        <div class="card__h"><h2>${ic("target")}${tx("本週目標", "This week’s goals")}</h2><a class="more" href="week.html">${tx("看整週", "Open the week")} →</a></div>
        <p class="wk__range">${esc(weekLabel(mon))} · ${esc(md(mon))} – ${esc(md(addDays(mon, 6)))}</p>
        ${w ? `<h3 class="wk__theme">${esc(L(w.theme))}</h3>${w.note ? `<p class="wk__note">${esc(L(w.note))}</p>` : ""}` : ""}
        <ul style="margin-top:8px">${goalsHTML(w)}</ul>
      </article>
      <article class="card card--top c7" style="--c:var(--green)">
        <div class="card__h"><h2>${ic("horn")}${tx("公告", "News")}</h2><a class="more" href="announcements.html">${tx("全部公告", "All news")} →</a></div>
        <ul>${[...pinned, ...rest].map(a => annRow(a)).join("")}</ul>
      </article>
      <article class="card card--top c5" style="--c:var(--violet)">
        <div class="card__h"><h2>${ic("book")}${tx("接下來要交的", "Due next")}</h2><a class="more" href="homework.html">${tx("全部作業", "All homework")} →</a></div>
        ${hw.length ? `<ul>${hw.map(h => `<li class="hwrow"><h3><a href="homework.html#${h.id}">${esc(L(h.t))}</a></h3><span class="chip ${diff(TODAY, h.due) <= 3 ? "chip--red" : "chip--violet"}">${esc(rel(h.due))}</span><small>${tx("截止", "Due")} ${esc(mdw(h.due))}${h.optional ? ` · ${tx("選做", "optional")}` : ""}</small></li>`).join("")}</ul>` : `<p class="empty">${tx("目前沒有要交的作業。", "Nothing is due right now.")}</p>`}
      </article>
    </div></div></section>
    <section class="sec"><div class="wrap">
      <div class="h2row"><h2 class="h2">${tx("常用連結", "Quick links")}</h2><a class="more" href="links.html">${tx(`全部 ${LINKS.length} 個連結`, `All ${LINKS.length} links`)} →</a></div>
      <div class="quick">${quick.map(l => { const inner = `<span class="tile__i" style="--c:${KINDC[l.kind]}">${ic(l.kind)}</span><span><b>${esc(L(l.t))}</b><small>${l.url ? (l.access === "team" ? tx("團隊帳號", "Team account") : tx("公開", "Public")) : tx("尚未開放", "Not open yet")}</small></span>`;
        return l.url ? `<a class="tile" href="${esc(l.url)}" target="_blank" rel="noopener">${inner}</a>` : `<a class="tile is-soon" href="links.html#${l.id}">${inner}</a>`; }).join("")}</div>
      <p class="small muted" style="margin-top:10px">${tx("在連結頁按星號，就能換成你自己常用的。", "Star a link on the Links page to make this row your own.")}</p>
    </div></section>
    <section class="sec"><div class="wrap">
      <div class="h2row"><h2 class="h2">${tx("這一年走到哪裡", "Where we are in the year")}</h2><a class="more" href="milestones.html">${tx("里程碑", "Milestones")} →</a></div>${ribbon()}
    </div></section>
    <section class="sec"><div class="wrap">
      <h2 class="h2">${tx("你要找什麼", "What are you looking for?")}</h2><p class="sub">${tx("每一頁回答一個問題。", "Each page answers one question.")}</p>
      <div class="doors">${doors.map(([k, c, d, n, unit]) => { const p = NAV.find(x => x.k === k); return `<a class="door" href="${p.href}" style="--c:${c}"><span class="door__i">${ic(p.icon)}</span><h3>${esc(L(p))}</h3><p>${esc(d)}</p><span class="door__n"><b class="tn">${n}</b> ${esc(unit)}</span></a>`; }).join("")}</div>
    </div></section>
    <section class="sec"><div class="wrap"><div class="sysband">
      <div><h2>${tx("這裡是 GEMS iGEM System 的入口", "This is the front door of the GEMS iGEM System")}</h2>
        <p>${tx("專案中心回答「今天要做什麼」。系統網站回答「為什麼這樣做」：規則、架構、Drive、角色、Advisor 計畫和 Research 流程。兩邊用同一份節點和席位。", "The hub answers what to do today. The System site answers why: rules, architecture, the Drive, roles, the advisor programme and the research flow. Both run on the same nodes and seats.")}</p>
        <div class="sysband__l">${LINKS.filter(l => l.g === "system").slice(1).map(l => `<a href="${l.url}">${esc(L(l.t))}</a>`).join("")}</div></div>
      <a class="btn" href="${SYS}">${tx("打開系統網站", "Open the System site")} ↗</a>
    </div></div></section>`;
  };

  // ----- This week -----
  P.week = () => {
    const mon = S.wk, sun = addDays(mon, 6), w = weekEntry(mon), days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    const due = [
      ...NODES.filter(n => n.date >= mon && n.date <= sun).map(n => ({ d: n.date, html: `<li class="rec"><h4>${nodeChip(n.n)}<a href="milestones.html#${n.n}">${esc(L(n.t))}</a><span class="chip" style="color:${LANE[n.lane].c}">${esc(L(LANE[n.lane]))}</span></h4><p>${esc(nodeWhen(n))}${L(n.pass) ? ` · ${tx("通過條件", "To pass")}：${esc(L(n.pass))}` : ""}</p></li>` })),
      ...HOMEWORK.filter(h => h.due >= mon && h.due <= sun).map(h => ({ d: h.due, html: `<li class="rec"><h4><span class="nid">${h.id}</span><a href="homework.html#${h.id}">${esc(L(h.t))}</a><span class="chip chip--violet">${tx("作業", "Homework")}</span></h4><p>${tx("截止", "Due")} ${esc(mdw(h.due))} · ${esc(L(h.submit.how))}</p></li>` }))
    ].sort((a, b) => a.d.localeCompare(b.d));
    const lane = me.group === "all" ? null : DOCLANE[me.group];
    const live = SEASON.docs.filter(x => !["igem", "gate"].includes(x.lane) && x.d <= sun && (x.end || x.d) >= mon && (!lane || x.lane === lane || x.lane === "all"));
    return head([weekLabel(mon), phaseOn(mon)], `${esc(md(mon))} – ${esc(md(sun))}${mon === monday(TODAY) ? `<br><em>${tx("這一週", "This week")}</em>` : ""}`,
      w ? esc(L(w.theme)) + (w.note ? `　${esc(L(w.note))}` : "") : "",
      `<div class="wknav"><button class="rnd" data-wk="-7" aria-label="${tx("上一週", "Previous week")}">${ic("left")}</button><button class="rnd" data-wk="7" aria-label="${tx("下一週", "Next week")}">${ic("right")}</button>
        ${mon !== monday(TODAY) ? `<button class="btn btn--ghost btn--s" data-wk="0">${tx("回到這一週", "Back to this week")}</button>` : ""}</div>`)
    + `<section class="sec"><div class="wrap">${meBar()}
      <div class="strip">${days.map(d => { const sh = shadeOn(d); return `<div class="sday${d === TODAY ? " is-today" : ""}${sh ? " is-off" : ""}"><div class="sday__h"><b class="tn">${utc(d).getUTCDate()}</b><span>${lang === "zh" ? "週" + wd(d) : wd(d)}</span></div><div>${dayEvents(d).map(evHTML).join("")}${sh ? `<span class="cal__band">${esc(L(sh.n))}</span>` : ""}</div></div>`; }).join("")}</div>
    </div></section>
    <section class="sec"><div class="wrap"><div class="grid">
      <article class="card card--top c7" style="--c:var(--blue)"><div class="card__h"><h2>${ic("target")}${tx("目標", "Goals")}</h2></div><ul>${goalsHTML(w)}</ul></article>
      <article class="card card--top c5" style="--c:var(--red)"><div class="card__h"><h2>${ic("flag")}${tx("這週到期", "Due this week")}</h2></div>
        ${due.length ? `<ul>${due.map(x => x.html).join("")}</ul>` : `<p class="empty">${tx("這週沒有節點或作業到期。", "No node or homework falls due this week.")}</p>`}</article>
      <article class="card card--top c5" style="--c:var(--green)"><div class="card__h"><h2>${ic("check")}${tx("每週例行", "Every week")}</h2><span class="small muted">${tx("每週一歸零", "Resets on Monday")}</span></div>
        <div>${routine()}</div>
        <p class="small muted" style="margin-top:10px">${me.seat ? tx(`含 ${me.seat} 席位每週要做的事。`, `Includes what the ${me.seat} seat does each week.`) : tx("選一個席位，會加上那個席位每週要做的事。", "Pick a seat above to add what that seat does each week.")} ${tx("勾選只存在這台裝置；正式紀錄在 Hub 試算表。", "Ticks stay on this device; the record itself is in the Hub Sheet.")}</p>
        <p style="margin-top:12px"><a class="btn btn--s" href="${esc(LINK.hubsheet.url)}" target="_blank" rel="noopener">${tx("打開 Hub 試算表 → Tasks", "Open the Hub Sheet → Tasks")} ↗</a></p></article>
      <article class="card card--top c7" style="--c:var(--violet)"><div class="card__h"><h2>${ic("sheet")}${tx("這週正在用的紀錄", "Records live this week")}</h2><span class="small muted">${esc(gName(me.group))} · ${live.length}</span></div>
        ${live.length ? `<ul>${live.map(x => `<li class="rec"><h4>${esc(L(x.n))}</h4><p>${tx("誰寫", "Written by")}：${esc(L(x.who))} · ${tx("誰讀", "Read by")}：${esc(L(x.reads))}</p>${x.loc ? `<p><code>${esc(x.loc)}</code></p>` : ""}</li>`).join("")}</ul>` : `<p class="empty">${tx("這一週還沒有啟用的紀錄。", "No records are in use this week yet.")}</p>`}
        <p style="margin-top:12px"><a class="more" href="guide.html#where">${tx("全部紀錄放哪裡", "Where every record goes")} →</a></p></article>
    </div></div></section>`;
  };

  // ----- Milestones -----
  const nodePass = n => S.nf === "all" || (S.nf === "mine" ? isMineNode(n.n) : n.lane === S.nf);
  P.milestones = () => {
    const nextN = (NODES.find(n => n.date >= TODAY) || {}).n, list = NODES.filter(nodePass);
    const months = [...new Set(list.map(n => n.date.slice(0, 7)))];
    const listHTML = list.length ? months.map(m => `<section class="nm"><h3>${esc(monthName(m))}</h3><ol>${list.filter(n => n.date.slice(0, 7) === m).map(n => {
      const seats = nodeSeats(n.n);
      return `<li class="nd${n.date < TODAY ? " is-past" : ""}${n.n === nextN ? " is-next" : ""}" id="${n.n}" style="--c:${LANE[n.lane].c}">
        <div class="nd__when"><time>${esc(nodeWhen(n))}</time><small>${esc(rel(n.date))}</small><span class="nid">${n.n}</span></div>
        <div><h4>${esc(L(n.t))}${n.n === nextN ? `<span class="chip chip--navy">${tx("下一個", "Next")}</span>` : ""}<span class="chip" style="color:${LANE[n.lane].c}">${esc(L(LANE[n.lane]))}</span>${isMineNode(n.n) ? `<span class="chip chip--green">${tx("我的", "Mine")}</span>` : ""}</h4>
          ${L(n.pass) ? `<p><b>${tx("通過條件", "To pass")}</b>${esc(L(n.pass))}</p>` : ""}${L(n.d) ? `<p>${esc(L(n.d))}</p>` : ""}
          <div class="nd__m">${L(n.owner) ? `<span>${tx("負責", "Owner")} <b>${esc(L(n.owner))}</b></span>` : ""}${L(n.ok) ? `<span>${tx("驗收", "Accepts")} <b>${esc(L(n.ok))}</b></span>` : ""}${seats.slice(0, 6).map(r => seatChip(r.code)).join("")}
            <a class="more" href="${SYS}timeline.html#n-${n.n}" target="_blank" rel="noopener">${tx("系統網站", "System site")} ↗</a></div></div></li>`; }).join("")}</ol></section>`).join("")
      : `<p class="empty">${tx("這個篩選下沒有節點。先在上面選你的組別或席位。", "No nodes match. Pick your group or seat above first.")}</p>`;
    return head([`${NODES.length} ${tx("個節點", "nodes")}`, `${NODES.filter(n => n.date >= TODAY).length} ${tx("個還沒到", "still ahead")}`],
      tx("里程碑", "Milestones"), tx("全年每個節點都有日期、通過條件、負責人和驗收人。沒過就不往下走。", "Every node has a date, a pass condition, an owner and someone who accepts it. Work does not move on until it clears."))
    + `<section class="sec"><div class="wrap">${meBar()}${ribbon(nodePass)}</div></section>
    <section class="sec"><div class="wrap">
      <div class="bar">${seg("nf", [["all", tx("全部", "All"), null, NODES.length], ["deadline", tx("iGEM 截止", "iGEM deadlines"), LANE.deadline.c, NODES.filter(n => n.lane === "deadline").length], ["gate", tx("內部關卡", "Internal gates"), LANE.gate.c, NODES.filter(n => n.lane === "gate").length], ["adv", "Advisor", LANE.adv.c, NODES.filter(n => n.lane === "adv").length], ["mine", tx("我的", "Mine"), "var(--green)", NODES.filter(n => isMineNode(n.n)).length]])}
        <span style="flex:1"></span>${seg("nv", [["list", tx("清單", "List")], ["cal", tx("月曆", "Calendar")]])}</div>
      ${S.nv === "list" ? listHTML : calendar()}
    </div></section>`;
  };
  function calendar() {
    const first = S.cal + "-01", start = monday(first), cells = [];
    for (let d = start; cells.length < 42; d = addDays(d, 1)) { if (cells.length >= 35 && d.slice(0, 7) !== S.cal) break; cells.push(d); }
    const names = lang === "zh" ? ["一", "二", "三", "四", "五", "六", "日"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return `<div class="cal"><div class="cal__h"><h3>${esc(monthName(S.cal))}</h3><div><button class="txt" data-cal="0">${tx("今天", "Today")}</button><button data-cal="-1" aria-label="${tx("上個月", "Previous month")}">${ic("left")}</button><button data-cal="1" aria-label="${tx("下個月", "Next month")}">${ic("right")}</button></div></div>
      <div class="cal__g">${names.map(n => `<div class="cal__w">${n}</div>`).join("")}${cells.map(d => { const sh = shadeOn(d), evs = dayEvents(d).filter(e => !e.href || !/milestones/.test(e.href) || nodePass(NODE[e.href.split("#")[1]]));
        return `<div class="cal__d${d.slice(0, 7) !== S.cal ? " is-out" : ""}${d === TODAY ? " is-today" : ""}${sh ? " is-shade" : ""}"><b class="tn">${utc(d).getUTCDate()}</b>${sh && (d === sh.s || dow(d) === 1) ? `<span class="cal__band">${esc(L(sh.n))}</span>` : ""}${evs.map(evHTML).join("")}</div>`; }).join("")}</div>
      <p class="legend">${Object.values(LANE).map(l => `<span><i style="--c:${l.c}"></i>${esc(L(l))}</span>`).join("")}<span><i style="--c:var(--violet)"></i>${tx("作業截止", "Homework due")}</span><span>${tx("斜線：假期或考試。灰字：固定時段（暫定）。", "Hatched: breaks or exams. Grey: fixed sessions (provisional).")}</span></p></div>`;
  }

  // ----- Homework -----
  P.homework = () => {
    const all = HOMEWORK.slice().sort((a, b) => a.due.localeCompare(b.due));
    const list = all.filter(h => S.hwf === "all" || (S.hwf === "live" ? hwState(h) !== "closed" : hwState(h) === S.hwf));
    const ST = { open: [tx("進行中", "Open"), "chip--green", "var(--green)"], soon: [tx("即將開始", "Coming up"), "chip--blue", "var(--blue)"], closed: [tx("已截止", "Closed"), "", "var(--ink3)"] };
    return head([`${all.filter(h => hwState(h) === "open").length} ${tx("份進行中", "open")}`, `${all.filter(h => hwState(h) === "soon").length} ${tx("份即將開始", "coming up")}`], tx("作業", "Homework"),
      tx("每份作業都寫清楚：做什麼、哪一天截止、交到哪裡、誰會看。", "Each assignment says what to do, when it is due, where it goes and who reads it."))
    + `<section class="sec"><div class="wrap">
      <div class="bar">${seg("hwf", [["live", tx("還沒截止", "Not yet due")], ["open", tx("進行中", "Open")], ["soon", tx("即將開始", "Coming up")], ["closed", tx("已截止", "Closed")], ["all", tx("全部", "All")]])}</div>
      ${list.length ? list.map(h => { const st = hwState(h), [label, cls, c] = ST[st];
        return `<article class="hw${st === "closed" ? " is-closed" : ""}${hwDone[h.id] ? " is-ticked" : ""}" id="${h.id}" style="--c:${c}">
          <div><div class="hw__top"><span class="nid">${h.id}</span><span class="chip ${cls}">${esc(label)}</span>${h.optional ? `<span class="chip chip--amber">${tx("選做", "Optional")}</span>` : ""}<span class="chip chip--line">${esc(gName(h.group))}</span>${h.node ? nodeChip(h.node) : ""}</div>
            <h3>${esc(L(h.t))}</h3><p>${esc(L(h.body))}</p>
            <dl><dt>${tx("交到哪裡", "Hand in")}</dt><dd>${esc(L(h.submit.how))}${h.submit.link ? `　${linkBtn(h.submit.link)}` : ""}</dd>
              ${h.review ? `<dt>${tx("誰會看", "Read by")}</dt><dd>${seatChip(h.review)}</dd>` : ""}<dt>${tx("發布", "Set")}</dt><dd>${esc(mdw(h.assigned))}</dd></dl></div>
          <div class="hw__side"><div class="hw__due"><span>${tx("截止", "Due")}</span><b class="tn">${esc(md(h.due))}</b><span>${lang === "zh" ? "週" + wd(h.due) : wd(h.due)} · ${esc(rel(h.due))}</span></div>
            <label class="hw__done"><input type="checkbox" data-hw="${h.id}"${hwDone[h.id] ? " checked" : ""}>${tx("我交了", "I handed it in")}</label></div></article>`; }).join("")
        : `<p class="empty">${tx("這個分類目前沒有作業。", "Nothing in this category right now.")}</p>`}
      <p class="small muted" style="margin-top:14px">${tx("「我交了」只記在這台裝置，方便你自己看。有沒有交、成績和評語都不會出現在這個公開網站。", "“I handed it in” is remembered on this device only, for your own use. Who has handed in, grades and comments never appear on this public site.")}</p>
    </div></section>`;
  };

  // ----- News -----
  P.news = () => {
    const tags = [...new Set(ANNOUNCEMENTS.map(a => a.tag))], list = ANNOUNCEMENTS.filter(a => S.anf === "all" || a.tag === S.anf);
    const pins = list.filter(a => a.pin), rest = list.filter(a => !a.pin), days = [...new Set(rest.map(a => a.d))];
    return head([`${tx("最後更新", "Last posted")} ${md(ANNOUNCEMENTS[0].d)}`], tx("公告", "News"), tx("全隊要知道的事，最新的在最上面。討論在 Discord，定案的寫在這裡。", "What the whole team needs to know, newest first. Discussion happens on Discord; what is settled is written here."))
    + `<section class="sec"><div class="wrap" style="max-width:860px">
      <div class="bar">${seg("anf", [["all", tx("全部", "All")], ...tags.map(k => [k, L(TAG[k]) || k])])}</div>
      <ul>${pins.map(a => annRow(a, 1)).join("")}</ul>
      ${days.map(d => `<h2 class="day">${esc(longDate(d))}</h2><ul>${rest.filter(a => a.d === d).map(a => annRow(a, 1)).join("")}</ul>`).join("")}
      ${list.length ? "" : `<p class="empty">${tx("這個分類還沒有公告。", "No notices in this category yet.")}</p>`}
    </div></section>`;
  };

  // ----- Team -----
  const hit = (q, ...parts) => { const hay = parts.map(both).join(" ").toLowerCase(); return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w)); };
  const seatCard = r => { const g = GROUP[r.group], who = HOLDERS[r.code] || [], ns = roleNodes(r);
    return `<details class="sc${me.seat === r.code ? " is-me" : ""}" id="${r.code}" style="--c:${g.c}"><summary><code>${r.code}</code><h4>${esc(L(r.name))}</h4><span class="chev">${ic("right")}</span>
        <p>${esc(L(r.own))}</p><span class="who">${who.length ? `<b>${esc(who.join("、"))}</b>` : `<span>${tx("尚未指派", "Not yet named")}</span>`}<span>· ${r.seats || r.sec || 0} ${tx("席", r.seats === 1 ? "seat" : "seats")} · ${esc(L(r.when))}</span></span></summary>
      <div class="sc__b">${(r.week || []).length ? `<div><h5>${tx("每週", "Each week")}</h5><ul>${r.week.map(w => `<li>${esc(L(w))}</li>`).join("")}</ul></div>` : ""}
        ${ns.length ? `<div><h5>${tx("負責的節點", "Nodes")}</h5><div class="row">${[...new Set(ns)].map(nodeChip).join("")}</div></div>` : ""}
        ${(r.tabs || []).length ? `<div><h5>${tx("維護的表", "Sheets kept")}</h5><div class="row">${r.tabs.map(t => `<span class="chip chip--line">${esc(t)}</span>`).join("")}</div></div>` : ""}
        ${(r.folders || []).length ? `<div><h5>${tx("資料夾", "Folders")}</h5><div class="row">${r.folders.map(f => `<span class="chip chip--line">${esc(f)}</span>`).join("")}</div></div>` : ""}
        ${r.backup && ROLE[r.backup] && r.backup !== r.code ? `<div><h5>${tx("不在時找", "Backup")}</h5><div class="row">${seatChip(r.backup)}</div></div>` : ""}
        <a class="more" href="${SYS}people.html" target="_blank" rel="noopener">${tx("時數與細節在系統網站", "Hours and detail on the System site")} ↗</a></div></details>`; };
  const teamList = () => {
    const q = S.q.trim(), ask = ASK.filter(a => !q || hit(q, a.q, a.seats.join(" "), ...a.seats.map(c => ROLE[c] && ROLE[c].name)));
    const rs = ROLES.filter(r => !q || hit(q, r.code, r.name, r.own, ...(r.week || []), (r.tabs || []).join(" "), (HOLDERS[r.code] || []).join(" ")));
    const gs = GROUPS.filter(g => (q || me.group === "all" || me.group === g.id) && rs.some(r => r.group === g.id));
    return `<h2 class="h2">${tx("遇到這件事，問誰", "Who to ask")}</h2><p class="sub">${tx("第一個席位是先問的人。席位在 3/13（N07）公布負責人，在那之前先問老師。", "The first seat is the one to ask first. Seats are named on 13 Mar (N07); until then, ask an instructor.")}</p>
      ${ask.length ? `<ul class="ask">${ask.map(a => `<li><p>${esc(L(a.q))}</p><div>${a.seats.map(seatChip).join("")}</div></li>`).join("")}</ul>` : `<p class="empty">${tx("沒有符合的問題。試試搜尋席位。", "No matching question. Try the seat list below.")}</p>`}
      <h2 class="h2" style="margin-top:40px">${tx("每個席位", "Every seat")}</h2><p class="sub">${tx("席位是提案，不是指派。點開看每週要做什麼、負責哪些節點、維護哪張表。", "Seats are proposals, not assignments. Open one to see its weekly work, its nodes and the sheets it keeps.")}</p>
      ${gs.length ? gs.map(g => { const list = rs.filter(r => r.group === g.id); return `<section class="grp" style="--c:${g.c}"><div class="grp__h"><h3><i></i>${esc(L(g))}</h3><small>${list.length} ${tx("種席位", "seats")}</small></div><div class="seats">${list.map(seatCard).join("")}</div></section>`; }).join("") : `<p class="empty">${tx("找不到符合的席位。", "No seat matches.")}</p>`}`;
  };
  P.team = () => head([`${ROLES.length} ${tx("種席位", "seats")}`, tx("3/13 公布負責人", "named on 13 Mar")], tx("負責人", "Team"), tx("每件事都有一個負責的席位，也有不在時的代理人。", "Every job has a seat that owns it, and a backup for when that seat is away."))
    + `<section class="sec"><div class="wrap">${meBar()}<div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋：照片、wiki、安全、TL…", "Search: photos, wiki, safety, TL…")}" autocomplete="off"></div><div id="list">${teamList()}</div></div></section>`;

  // ----- Credits -----
  P.credits = () => {
    const att = ROLE.ATT, doc = SEASON.docs.find(x => x.id === "attr"), fr = NODE.N31;
    const steps = [
      [tx("做事的時候帶著 ID", "Work under an ID"), tx("任務是 T、實驗和運算是 R、訪談是 I、圖是 F、照片是 M。每一列都有做的人。", "A task is a T, a run is an R, an interview is an I, a figure is an F and a photo is an M. Every row names who did it.")],
      [tx("每週更新自己的列", "Update your own rows weekly"), tx("五分鐘。貢獻是從這些列算出來的，不是十月靠回憶。", "Five minutes. Credit is worked out from those rows, not from memory in October.")],
      [tx("Attribution 席位整理成表", "The Attribution seat builds the table"), tx("ATT 席位把這些列整理成 Attribution 表。你看自己的那一行對不對。", "The ATT seat turns those rows into the Attribution table. You check that your own line is right.") + (att ? ` ${L(att.when)}` : "")],
      [tx("凍結時一起送出", "It ships with the freeze"), `${fr ? nodeWhen(fr) : ""}${tx("：Attribution 和 wiki 同一天凍結，Team Lead 做最後核對。", ": Attribution freezes with the wiki, after a final check by the Team Lead.")}`]
    ];
    const gs = GROUPS.filter(g => !["adv", "staff"].includes(g.id));
    return head([tx("iGEM 交付物", "An iGEM deliverable"), fr ? `${tx("凍結", "Freeze")} ${nodeWhen(fr)}` : ""], tx("誰做了什麼", "Who did what"),
      tx("iGEM 要每一隊說清楚：哪些是隊員自己做的，哪些有人幫忙。我們整年都記，所以最後不用重建。", "iGEM asks every team to say plainly what its members did and where they had help. We keep the record all year, so nothing is rebuilt at the end."),
      `<p style="margin-top:22px;display:flex;flex-wrap:wrap;gap:10px"><a class="btn" href="${esc(LINK.attribution.url)}" target="_blank" rel="noopener">${ic("sheet")}${tx("打開 Attribution 表", "Open the Attribution sheet")} ↗</a><a class="btn btn--ghost" href="${SYS}students.html" target="_blank" rel="noopener">${tx("學生歷程怎麼記", "How a student’s year is recorded")} ↗</a></p>`)
    + `<section class="sec"><div class="wrap"><h2 class="h2">${tx("貢獻怎麼累積", "How credit builds up")}</h2><p class="sub">${tx("四步，前兩步每週都在發生。", "Four steps. The first two happen every week.")}</p><ol class="steps">${steps.map(([a, b]) => `<li><h3>${esc(a)}</h3><p>${esc(b)}</p></li>`).join("")}</ol>
      ${doc ? `<p class="small muted" style="margin-top:12px">${tx("Attribution 表", "The Attribution table")}：${esc(md(doc.d))} – ${esc(md(doc.end))} · <code>${esc(doc.loc)}</code></p>` : ""}</div></section>
    <section class="sec"><div class="wrap"><h2 class="h2">${tx("每個領域由誰負責", "Who owns each area")}</h2><p class="sub">${tx("席位在 3/13 公布負責人後，這張表會出現名字。現在看得到的是每個領域有哪些席位，以及證據記在哪張表。", "Names appear here once seats are named on 13 Mar. For now it shows which seats cover each area and which sheet holds the evidence.")}</p>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>${tx("領域", "Area")}</th><th>${tx("席位", "Seats")}</th><th>${tx("負責什麼", "Owns")}</th><th>${tx("證據在哪", "Evidence")}</th></tr></thead><tbody>
      ${gs.map(g => ROLES.filter(r => r.group === g.id).map((r, i, a) => `<tr>${i === 0 ? `<td rowspan="${a.length}"><span class="chip" style="background:color-mix(in srgb, ${g.c} 14%, #fff);color:${g.c}">${esc(L(g))}</span></td>` : ""}<td style="font-weight:400;white-space:normal">${seatChip(r.code)}</td><td>${esc(L(r.own))}</td><td>${(r.tabs || []).map(t => `<code>${esc(t)}</code>`).join(" ") || `<span class="muted">${esc((r.folders || [])[0] || "Hub.Tasks")}</span>`}</td></tr>`).join("")).join("")}
      </tbody></table></div></div></section>
    <section class="sec"><div class="wrap"><h2 class="h2">${tx("隊外的協助", "Help from outside the team")}</h2><p class="sub">${tx("要寫出一個人的名字，先在 Hub 試算表的 Consent 分頁有一筆已同意的 K。", "Naming a person here needs an agreed K in the Consent tab of the Hub Sheet first.")}</p>
      <ul class="out">${OUTSIDE.map(o => `<li><h3>${esc(L(o.t))}</h3><p>${esc(L(o.d))}</p>${o.items.length ? `<ul>${o.items.map(x => `<li><b>${esc(L(x.who))}</b>　${esc(L(x.what))}${x.when ? ` <span class="muted">· ${esc(x.when)}</span>` : ""}${x.id ? ` <span class="nid">${esc(x.id)}</span>` : ""}</li>`).join("")}</ul>` : `<p class="none">${tx("還沒有紀錄。賽季開始後，第一筆會出現在這裡。", "Nothing recorded yet. The first entry appears here once the season starts.")}</p>`}</li>`).join("")}</ul></div></section>
    <section class="sec"><div class="wrap"><h2 class="h2">${tx("這個網站用了什麼", "What this site is built from")}</h2><ul class="out" style="margin-top:14px">${CREDITS.map(c => `<li><h3>${esc(L(c.t))}</h3><p>${esc(L(c.d))}</p><p style="margin-top:8px"><a class="more" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url.replace(/^https:\/\//, ""))} ↗</a></p></li>`).join("")}</ul></div></section>`;
  };

  // ----- Links -----
  const userPins = () => store.json("gems27.pins", {});
  const isPinned = l => { const p = userPins(); return l.id in p ? p[l.id] : !!l.pin; };
  const linkRow = l => { const d = linkD(l), main = `<b><span>${esc(L(l.t))}</span>${l.url ? ic("ext") : ""}</b>${d ? `<small>${esc(d)}</small>` : ""}${access(l) ? `<em>${access(l)}</em>` : ""}`;
    return `<li class="lk${l.url ? "" : " is-soon"}" id="${l.id}"><span class="tile__i" style="--c:${KINDC[l.kind]}">${ic(l.kind)}</span>
      ${l.url ? `<a class="lk__main" href="${esc(l.url)}" target="_blank" rel="noopener">${main}</a>` : `<span class="lk__main">${main}</span>`}
      <span class="lk__act"><button data-pin="${l.id}" aria-pressed="${isPinned(l)}" title="${tx("放到今天頁", "Show on Today")}" aria-label="${tx("放到今天頁", "Show on Today")}">${ic("star")}</button>${l.url ? `<button data-copy="${esc(l.url)}" title="${tx("複製連結", "Copy link")}" aria-label="${tx("複製連結", "Copy link")}">${ic("copy")}</button>` : ""}</span></li>`; };
  const linkList = () => { const q = S.q.trim(), ok = l => (!q || hit(q, l.t, l.d, driveNote(L(l.t)), l.id, l.kind)) && (S.lg === "all" || (S.lg === "pins" ? isPinned(l) : l.g === S.lg));
    const gs = S.lg === "pins" ? [{ id: "pins", name: { zh: "我的常用", en: "My quick links" } }] : LINK_GROUPS.filter(g => S.lg === "all" || g.id === S.lg);
    const html = gs.map(g => { const ls = LINKS.filter(l => ok(l) && (g.id === "pins" || l.g === g.id)); return ls.length ? `<section class="lg" id="g-${g.id}"><div class="lg__h"><h2>${esc(L(g.name))}</h2>${g.note ? `<p>${esc(L(g.note))}</p>` : ""}</div><ul class="lks">${ls.map(linkRow).join("")}</ul></section>` : ""; }).join("");
    return html || `<p class="empty" style="margin-top:20px">${tx("找不到。換個詞，或按 / 搜尋整個網站。", "Nothing found. Try another word, or press / to search the whole site.")}</p>`; };
  P.links = () => head([`${LINKS.length} ${tx("個連結", "links")}`, `${LINKS.filter(l => !l.url).length} ${tx("個尚未開放", "not open yet")}`], tx("所有連結", "Every link"),
      tx("Drive、試算表、範本、網站和 iGEM 官方頁面，全部在這一頁。每個連結都有固定的位置。", "The Drive, workbooks, templates, sites and official iGEM pages, all on one page. Every link has a fixed place."))
    + `<section class="sec"><div class="wrap">
      <div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋連結…", "Search links…")}" autocomplete="off">${seg("lg", [["all", tx("全部", "All")], ["pins", tx("★ 常用", "★ Starred")], ...LINK_GROUPS.map(g => [g.id, L(g.name)])])}</div>
      <p class="small muted">${ic("lock")} ${tx("「團隊帳號」的連結要用加入團隊 Drive 的 Google 帳號開啟。打不開就問 Ops。", "Links marked Team account open only with the Google account that was added to the team Drive. If one will not open, ask Ops.")}</p>
      <div id="list">${linkList()}</div></div></section>`;

  // ----- Guide -----
  const idRows = () => SEASON.ids.filter(r => !S.gq || hit(S.gq, r[0], r[1], r[2], r[3])).map(r => `<tr><td><span class="pfx">${esc(r[0])}</span></td><td>${esc(L(r[1]))}</td><td>${esc(L(r[2]))}</td><td><code>${esc(r[3])}</code></td></tr>`).join("") || `<tr><td colspan="4" class="muted">${tx("沒有符合的 ID。", "No ID matches.")}</td></tr>`;
  const DL = [["all", "全隊", "All-team"], ["wet", "Wet lab", "Wet lab"], ["dry", "Dry lab", "Dry lab"], ["hp", "HP", "HP"], ["wiki", "Wiki 與交付物", "Wiki & deliverables"], ["adv", "Advisor", "Advisors"], ["ops", "老師與 Ops", "Instructors & Ops"]];
  const docRows = () => SEASON.docs.filter(x => !["igem", "gate"].includes(x.lane) && (S.dl === "all" || x.lane === S.dl) && (!S.q || hit(S.q, x.n, x.who, x.reads, x.loc))).map(x => `<tr><td>${esc(L(x.n))}</td><td>${esc(L(x.who))}</td><td>${esc(L(x.reads))}</td><td>${x.loc ? `<code>${esc(x.loc)}</code>` : ""}</td><td class="tn" style="white-space:nowrap">${esc(md(x.d))}${x.end ? ` – ${esc(md(x.end))}` : ""}</td></tr>`).join("") || `<tr><td colspan="5" class="muted">${tx("沒有符合的紀錄。", "No record matches.")}</td></tr>`;
  P.guide = () => {
    const subs = [["weekly", tx("每週清單", "Weekly")], ["rules", tx("七條規則", "Rules")], ["gates", tx("三道關卡", "Gates")], ["ids", tx("ID 速查", "IDs")], ["names", tx("檔名", "File names")], ["where", tx("放哪裡", "Where it goes")], ["tabs", tx("Hub 分頁", "Hub tabs")], ["tools", tx("五個工具", "Tools")]];
    const parts = [["var(--blue)", "20270412", tx("日期", "Date"), tx("年月日八碼，排序才會對。", "Eight digits, so files sort in order.")], ["var(--green)", "R0412", "ID", tx("這份檔案屬於哪一筆紀錄。", "The record this file belongs to.")], ["var(--violet)", "label", tx("標籤", "Label"), tx("幾個英文字說明內容，用連字號。", "A few words on what it is, joined by hyphens.")], ["var(--amber)", "v2", tx("版本", "Version"), tx("改了就加一，不寫 final。", "Add one when it changes. Never “final”.")]];
    return head([tx("新人先讀這一頁", "New here? Read this first"), tx("約 5 分鐘", "about 5 minutes")], tx("指南", "Guide"), tx("整套系統濃縮成一頁：每週要做什麼、哪些事不能跳過、每樣東西放哪裡。", "The whole system on one page: what to do each week, what cannot be skipped and where everything goes."))
    + `<div class="subnav"><div>${subs.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join("")}</div></div><div class="wrap">
    <section class="gsec" id="weekly"><h2 class="h2">${tx("每週清單", "The weekly checklist")}</h2><p class="sub">${tx("全隊每個人每週就這幾件事。設計上限是一週不到半小時。", "This is all anyone does every week. By design it takes under half an hour.")}</p>
      <div class="grid"><div class="card c6">${routine()}</div><div class="card card--soft c6"><div class="card__h"><h3>${ic("clock")}${tx("固定節奏", "The fixed rhythm")}</h3></div><ul>${SEASON.rituals.map(r => `<li class="rec"><h4>${esc(L(r.t))}</h4></li>`).join("")}</ul><p style="margin-top:12px"><a class="more" href="week.html">${tx("看這一週", "Open this week")} →</a></p></div></div></section>
    <section class="gsec" id="rules"><h2 class="h2">${tx("七條規則", "Seven rules")}</h2><p class="sub">${tx("整套系統照這七條設計。", "The whole system is built on these.")} <a class="more" href="${SYS}system.html#system" target="_blank" rel="noopener">${tx("完整說明", "In full")} ↗</a></p>
      <ol class="rules">${SEASON.principles.map(p => `<li><h3>${esc(L(p.t))}</h3><p>${esc(L(p.d))}</p></li>`).join("")}</ol></section>
    <section class="gsec" id="gates"><h2 class="h2">${tx("三道硬關卡", "Three hard gates")}</h2><p class="sub">${tx("這三件事沒過，東西就不能往下走。不是提醒，是擋住。", "Until these clear, work does not move on. They are not reminders; they block.")}</p>
      <div class="gates">${SEASON.gates.map(g => `<div class="gate"><code>${esc(g.ids)}</code><h3>${esc(L(g.t))}</h3><p>${esc(L(g.rule))}</p><small>${esc(L(g.who))}</small></div>`).join("")}</div></section>
    <section class="gsec" id="ids"><h2 class="h2">${tx("ID 速查", "ID cheat sheet")}</h2><p class="sub">${tx("一件事只有一個 ID，其他地方都用 ID 引用。ID 由表自動產生，不用自己編。", "One thing, one ID; everywhere else cites it. The sheet assigns the ID, so nobody invents one.")}</p>
      ${SEASON.chains.map(c => `<div class="chain"><b>${esc(L(c.name))}</b>${c.ids.map(x => `<code>${esc(x)}</code>`).join("<span>→</span>")}</div>`).join("")}
      <div class="bar" style="margin-top:14px"><input class="q" type="search" data-gq value="${esc(S.gq)}" placeholder="${tx("搜尋：照片、實驗、K…", "Search: photo, run, K…")}" autocomplete="off"></div>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>ID</th><th>${tx("是什麼", "What it is")}</th><th>${tx("誰建", "Created by")}</th><th>${tx("在哪張表", "Lives in")}</th></tr></thead><tbody id="idrows">${idRows()}</tbody></table></div></section>
    <section class="gsec" id="names"><h2 class="h2">${tx("檔名怎麼取", "How to name a file")}</h2><p class="sub">${tx("看到檔名就知道它是哪一天、屬於哪筆紀錄、第幾版。", "The name alone says which day, which record and which version.")} ${linkBtn("file-rules", tx("完整的 File Rules", "The full File Rules"))}</p>
      <div class="name"><p class="name__ex">${parts.map(([c, ex]) => `<i style="--c:${c}">${ex}</i>`).join("_")}</p><div class="name__k">${parts.map(([c, , k, d]) => `<p style="--c:${c}"><b>${esc(k)}</b>${esc(d)}</p>`).join("")}</div></div></section>
    <section class="gsec" id="where"><h2 class="h2">${tx("每樣東西放哪裡", "Where everything goes")}</h2><p class="sub">${tx("每種紀錄：誰寫、誰讀、放在哪。找不到就搜尋。", "Every kind of record: who writes it, who reads it and where it lives. If in doubt, search.")}</p>
      <div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋：Topic Card、SOP、會議…", "Search: Topic Card, SOP, minutes…")}" autocomplete="off">${seg("dl", DL.map(([k, zh, en]) => [k, tx(zh, en)]))}</div>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>${tx("紀錄", "Record")}</th><th>${tx("誰寫", "Written by")}</th><th>${tx("誰讀", "Read by")}</th><th>${tx("放哪裡", "Where")}</th><th>${tx("何時", "When")}</th></tr></thead><tbody id="list">${docRows()}</tbody></table></div>
      <h3 class="h2" style="font-size:19px;margin-top:28px">${tx("Drive 的資料夾", "The Drive folders")}</h3>
      <ul class="lks" style="margin-top:12px">${LINKS.filter(l => /^d\d\d$/.test(l.id)).map(linkRow).join("")}</ul></section>
    <section class="gsec" id="tabs"><h2 class="h2">${tx("Hub 試算表的分頁", "The Hub Sheet tabs")}</h2><p class="sub">${tx("每張分頁都有一個每週會讀它、靠它做決定的人。沒有讀者的表不建。", "Each tab has someone who reads it every week to decide something. A sheet with no reader is not built.")} ${linkBtn("hubsheet", tx("打開 Hub 試算表", "Open the Hub Sheet"))}</p>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>${tx("分頁", "Tab")}</th><th>${tx("誰讀", "Read by")}</th><th>${tx("哪一天", "When")}</th><th>${tx("用來決定什麼", "To decide")}</th></tr></thead><tbody>${SEASON.hubTabs.map(h => `<tr><td>${esc(h.tab)}</td><td>${esc(L(h.reader))}</td><td>${esc(L(h.when))}</td><td>${esc(L(h.why))}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="gsec" id="tools" style="padding-bottom:80px"><h2 class="h2">${tx("什麼東西放在哪個工具", "Which tool holds what")}</h2><p class="sub">${tx("討論在 Discord，但決定和待辦一定寫回 Hub 試算表。", "Talk happens on Discord, but decisions and to-dos always go back to the Hub Sheet.")}</p>
      <div class="layers">${SEASON.layers.map(l => `<div class="layer"><small>${esc(L(l.name))}</small><h3>${esc(L(l.tool))}</h3><p><b>${tx("放", "Holds")}</b>${esc(L(l.put))}</p><p class="no"><b>${tx("不放", "Not")}</b>${esc(L(l.not))}</p></div>`).join("")}</div></section></div>`;
  };

  // ================= search =================
  let INDEX = null;
  const KIND = { page: ["var(--navy)", "頁面", "Page"], node: ["var(--red)", "里程碑", "Milestone"], hw: ["var(--violet)", "作業", "Homework"], news: ["var(--green)", "公告", "News"], link: ["var(--blue)", "連結", "Link"], seat: ["var(--teal)", "席位", "Seat"], ask: ["var(--teal)", "問誰", "Who to ask"], id: ["var(--amber)", "ID", "ID"], rec: ["var(--amber)", "紀錄", "Record"], rule: ["var(--ink2)", "規則", "Rule"] };
  function buildIndex() {
    const E = [], add = (k, icon, t, s, href, hay, ext, id) => E.push({ k, icon, t, s, href, ext, id, hay: `${t} ${s} ${hay || ""}`.toLowerCase() });
    NAV.forEach(p => add("page", p.icon, L(p), "", p.href, `${p.zh} ${p.en}`));
    NODES.forEach(n => add("node", "flag", `${n.n} · ${L(n.t)}`, `${nodeWhen(n)}${L(n.pass) ? " · " + L(n.pass) : ""}`, `milestones.html#${n.n}`, `${both(n.t)} ${both(n.pass)} ${both(n.owner)} ${both(n.dl)}`));
    HOMEWORK.forEach(h => add("hw", "book", `${h.id} · ${L(h.t)}`, `${tx("截止", "Due")} ${mdw(h.due)}`, `homework.html#${h.id}`, `${both(h.t)} ${both(h.body)}`));
    ANNOUNCEMENTS.forEach(a => add("news", "horn", L(a.t), `${md(a.d)}${a.body ? " · " + L(a.body) : ""}`, `announcements.html#a-${a.id}`, `${both(a.t)} ${both(a.body)}`));
    LINKS.forEach(l => add("link", l.kind, L(l.t), linkD(l) || (l.url ? l.url.replace(/^https?:\/\//, "") : ""), l.url || `links.html#${l.id}`, `${both(l.t)} ${both(l.d)} ${l.id} ${l.kind}`, !!l.url, l.id));
    ROLES.forEach(r => add("seat", "users", `${r.code} · ${L(r.name)}`, L(r.own), `team.html#${r.code}`, `${both(r.name)} ${both(r.own)} ${(r.week || []).map(both).join(" ")} ${(r.tabs || []).join(" ")} ${(HOLDERS[r.code] || []).join(" ")}`));
    ASK.forEach(a => add("ask", "users", L(a.q), `${tx("問", "Ask")} ${a.seats.map(c => `${c}${ROLE[c] ? " " + L(ROLE[c].name) : ""}`).join("、")}`, `team.html#${a.seats[0]}`, both(a.q)));
    SEASON.ids.forEach(r => add("id", "hash", `${r[0]} · ${L(r[1])}`, `${tx("在", "In")} ${r[3]} · ${L(r[2])}`, "guide.html#ids", `${both(r[1])} ${both(r[2])}`));
    SEASON.hubTabs.forEach(h => add("rec", "sheet", `Hub · ${h.tab}`, `${L(h.reader)} · ${L(h.when)} · ${L(h.why)}`, "guide.html#tabs", `${both(h.reader)} ${both(h.why)}`));
    SEASON.docs.filter(x => !["igem", "gate"].includes(x.lane)).forEach(x => add("rec", "doc", L(x.n), x.loc || L(x.who), "guide.html#where", `${both(x.n)} ${both(x.who)} ${both(x.reads)}`));
    SEASON.principles.forEach(p => add("rule", "gate", L(p.t), L(p.d), "guide.html#rules", `${both(p.t)} ${both(p.d)}`));
    SEASON.gates.forEach(g => add("rule", "gate", L(g.t), L(g.rule), "guide.html#gates", `${both(g.t)} ${both(g.rule)}`));
    return E;
  }
  const pal = { q: "", f: "all", i: 0, res: [] };
  function palSearch() {
    INDEX = INDEX || buildIndex();
    const ws = pal.q.toLowerCase().split(/\s+/).filter(Boolean);
    let res;
    if (!ws.length) {
      const up = NODES.filter(n => n.date >= TODAY).slice(0, 3).map(n => `milestones.html#${n.n}`);
      res = INDEX.filter(e => pal.f === "all" ? e.k === "page" || up.includes(e.href) || (e.k === "link" && isPinned(LINK[e.id])) : e.k === pal.f);
    } else {
      res = INDEX.map(e => { let sc = 0; const t = e.t.toLowerCase();
        for (const w of ws) { if (!e.hay.includes(w)) return null; sc += t.startsWith(w) ? 4 : t.includes(w) ? 3 : 1; }
        return { e, sc }; }).filter(x => x && (pal.f === "all" || x.e.k === pal.f)).sort((a, b) => b.sc - a.sc).map(x => x.e);
    }
    pal.res = res.slice(0, 60); pal.i = Math.min(pal.i, Math.max(0, pal.res.length - 1));
    $("#pal-list").innerHTML = pal.res.length ? pal.res.map((e, i) => `<a class="pal__r${i === pal.i ? " is-on" : ""}" href="${esc(e.href)}"${e.ext ? ' target="_blank" rel="noopener"' : ""} data-i="${i}" style="--c:${KIND[e.k][0]}"><i>${ic(e.icon)}</i><div><b>${esc(e.t)}</b>${e.s ? `<small>${esc(e.s)}</small>` : ""}</div><em>${esc(tx(KIND[e.k][1], KIND[e.k][2]))}${e.ext ? " ↗" : ""}</em></a>`).join("")
      : `<p class="pal__none">${tx("找不到。試試英文關鍵字，或到連結頁看全部。", "Nothing found. Try another word, or browse the Links page.")}</p>`;
    $("#pal-filters").innerHTML = [["all", tx("全部", "All")], ...["link", "node", "hw", "seat", "ask", "rec", "id", "news", "rule"].map(k => [k, tx(KIND[k][1], KIND[k][2])])].map(([k, t]) => `<button data-pf="${k}" aria-pressed="${pal.f === k}">${esc(t)}</button>`).join("");
    const on = $(".pal__r.is-on"); if (on) on.scrollIntoView({ block: "nearest" });
  }
  function palOpen(q) {
    let el = $("#pal");
    if (!el) { el = document.createElement("div"); el.id = "pal"; el.className = "pal"; document.body.appendChild(el); }
    el.innerHTML = `<div class="pal__box" role="dialog" aria-label="${tx("搜尋", "Search")}"><div class="pal__in">${ic("search")}<input id="pal-q" type="search" autocomplete="off" spellcheck="false" placeholder="${tx("搜尋整個專案中心…", "Search the whole hub…")}"><kbd>esc</kbd></div>
      <div class="pal__filters" id="pal-filters"></div><div class="pal__list" id="pal-list"></div>
      <div class="pal__foot"><span><kbd>↑</kbd><kbd>↓</kbd>${tx("選擇", "move")}</span><span><kbd>↵</kbd>${tx("開啟", "open")}</span><span><kbd>/</kbd>${tx("隨時搜尋", "search anywhere")}</span></div></div>`;
    el.classList.add("is-open"); pal.q = q || ""; pal.i = 0; pal.f = "all";
    const inp = $("#pal-q"); inp.value = pal.q; inp.focus(); palSearch();
  }
  const palClose = () => { const el = $("#pal"); if (el) el.classList.remove("is-open"); };
  const palGo = e => { if (!e) return; palClose(); if (e.ext) window.open(e.href, "_blank", "noopener"); else if (e.href.split("#")[0] === location.pathname.split("/").pop() || (PAGE === "home" && e.href.startsWith("index.html"))) { location.hash = e.href.split("#")[1] || ""; gotoHash(); } else location.href = e.href; };

  // ================= render and events =================
  function render() {
    shell();
    $("#main").innerHTML = (P[PAGE] || P.home)();
  }
  function gotoHash() {
    const h = decodeURIComponent(location.hash.slice(1)); if (!h) return;
    if (PAGE === "milestones" && NODE[h] && (S.nv !== "list" || !nodePass(NODE[h]))) { S.nv = "list"; S.nf = "all"; render(); }
    if (PAGE === "team" && ROLE[h] && (S.q || (me.group !== "all" && ROLE[h].group !== me.group))) { S.q = ""; me.group = "all"; me.seat = ""; render(); }
    if (PAGE === "links" && LINK[h] && (S.q || S.lg !== "all")) { S.q = ""; S.lg = "all"; render(); }
    if (PAGE === "homework" && HOMEWORK.some(x => x.id === h) && S.hwf !== "all") { S.hwf = "all"; render(); }
    const el = document.getElementById(h); if (!el) return;
    if (el.tagName === "DETAILS") el.open = true;
    el.scrollIntoView({ block: PAGE === "guide" ? "start" : "center" });
    if (!/^(weekly|rules|gates|ids|names|where|tabs|tools)$/.test(h)) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  }
  const repaintList = () => { const el = $("#list"); if (!el) return; el.innerHTML = PAGE === "team" ? teamList() : PAGE === "links" ? linkList() : docRows(); };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-lang],[data-find],[data-try],[data-me],[data-set],[data-wk],[data-cal],[data-pin],[data-copy],[data-pf],.pal__r,.pal");
    if (!el) return;
    const d = el.dataset;
    if (d.lang) { lang = d.lang; store.set("lang", lang); INDEX = null; render(); }
    else if ("find" in d) palOpen();
    else if (d.try) palOpen(d.try);
    else if (d.me) { me.group = d.me; if (me.seat && ROLE[me.seat].group !== me.group) me.seat = ""; store.set("gems27.me", JSON.stringify(me)); if (S.nf === "mine" && me.group === "all") S.nf = "all"; render(); }
    else if (d.set) { const [k, v] = d.set.split(":"); S[k] = v; if (k === "dl") repaintList(), $$(`[data-set^="dl:"]`).forEach(b => b.setAttribute("aria-pressed", b.dataset.set === d.set)); else render(); }
    else if (d.wk) { S.wk = +d.wk ? addDays(S.wk, +d.wk) : monday(TODAY); render(); }
    else if (d.cal) { if (+d.cal) { const x = utc(S.cal + "-01"); x.setUTCMonth(x.getUTCMonth() + +d.cal); S.cal = iso(x).slice(0, 7); } else S.cal = TODAY.slice(0, 7); render(); }
    else if (d.pin) { const p = userPins(), l = LINK[d.pin]; p[l.id] = !isPinned(l); store.set("gems27.pins", JSON.stringify(p)); if (S.lg === "pins") repaintList(); else el.setAttribute("aria-pressed", p[l.id]); }
    else if (d.copy) { const done = () => { el.classList.add("is-ok"); el.innerHTML = ic("check"); setTimeout(() => { el.classList.remove("is-ok"); el.innerHTML = ic("copy"); }, 1400); }; if (navigator.clipboard) navigator.clipboard.writeText(d.copy).then(done, () => {}); }
    else if (d.pf) { pal.f = d.pf; pal.i = 0; palSearch(); }
    else if (el.classList.contains("pal__r")) { e.preventDefault(); palGo(pal.res[+d.i]); }
    else if (e.target === el) palClose();
  });
  document.addEventListener("change", e => {
    const d = e.target.dataset;
    if ("meseat" in d) { me.seat = e.target.value; if (me.seat) me.group = ROLE[me.seat].group; store.set("gems27.me", JSON.stringify(me)); render(); }
    else if (d.tick) { (ticks[weekKey] = ticks[weekKey] || {})[d.tick] = e.target.checked; Object.keys(ticks).forEach(k => { if (k < addDays(weekKey, -28)) delete ticks[k]; }); store.set("gems27.ticks", JSON.stringify(ticks)); }
    else if (d.hw) { hwDone[d.hw] = e.target.checked; store.set("gems27.hw", JSON.stringify(hwDone)); e.target.closest(".hw").classList.toggle("is-ticked", e.target.checked); }
  });
  document.addEventListener("input", e => {
    const d = e.target.dataset;
    if (e.target.id === "pal-q") { pal.q = e.target.value; pal.i = 0; palSearch(); }
    else if ("q" in d) { S.q = e.target.value; repaintList(); }
    else if ("gq" in d) { S.gq = e.target.value; $("#idrows").innerHTML = idRows(); }
  });
  document.addEventListener("keydown", e => {
    const open = $("#pal.is-open"), typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (open) {
      if (e.key === "Escape") palClose();
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); pal.i = Math.max(0, Math.min(pal.res.length - 1, pal.i + (e.key === "ArrowDown" ? 1 : -1))); $$(".pal__r").forEach((r, i) => r.classList.toggle("is-on", i === pal.i)); const on = $(".pal__r.is-on"); if (on) on.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "Enter") { e.preventDefault(); palGo(pal.res[pal.i]); }
    } else if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); palOpen(); }
  });
  addEventListener("hashchange", gotoHash);

  render();
  if (new URLSearchParams(location.search).get("q")) palOpen(new URLSearchParams(location.search).get("q"));
  addEventListener("load", gotoHash, { once: true });
})();
