// GEMS 2027 Project Hub: the shell, the search and all nine pages.
// Content lives in data/*.js. data/season.js is copied from the System site; the rest is edited by hand.
// A missing file or a malformed entry is skipped and named at the top of the page. It never blanks the page.
(() => {
  "use strict";
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
  const QS = new URLSearchParams(location.search);

  // The System site sits on the same origin and uses the same key, so the choice carries across both.
  // ?lang=en (or zh) opens a page in that language without changing the saved choice.
  let lang = (/^(en|zh)$/.test(QS.get("lang") || "") ? QS.get("lang") : store.get("lang")) === "en" ? "en" : "zh";
  const L = o => (o && typeof o === "object" ? o[lang] || o.zh || o.en : o) || "";
  const tx = (zh, en) => (lang === "zh" ? zh : en);
  const both = o => (o && typeof o === "object" ? `${o.zh || ""} ${o.en || ""}` : o || "");

  // ---------- dates (Taipei). ?now=YYYY-MM-DD previews another day. ----------
  const DAY = 864e5;
  const isDate = v => typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v) && !isNaN(Date.parse(v + "T00:00:00Z"));
  const TODAY = isDate((QS.get("now") || "").slice(0, 10)) ? QS.get("now").slice(0, 10) : new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10);
  const utc = d => new Date(d + "T00:00:00Z");
  const iso = x => x.toISOString().slice(0, 10);
  const addDays = (d, n) => iso(new Date(utc(d).getTime() + n * DAY));
  const diff = (a, b) => Math.round((utc(b) - utc(a)) / DAY);
  const dow = d => utc(d).getUTCDay();
  const monday = d => addDays(d, -((dow(d) + 6) % 7));
  const fmt = (d, o) => utc(d).toLocaleDateString("en-GB", Object.assign({ timeZone: "UTC" }, o));
  const wd = d => (lang === "zh" ? "週" + "日一二三四五六"[dow(d)] : fmt(d, { weekday: "short" }));
  const md = d => (lang === "zh" ? `${utc(d).getUTCMonth() + 1}/${utc(d).getUTCDate()}` : fmt(d, { day: "numeric", month: "short" }));
  const mdw = d => (lang === "zh" ? `${md(d)}（${wd(d).slice(1)}）` : `${wd(d)} ${md(d)}`);
  const longDate = d => (lang === "zh" ? `${utc(d).getUTCFullYear()} 年 ${utc(d).getUTCMonth() + 1} 月 ${utc(d).getUTCDate()} 日 ${wd(d)}` : fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const monthName = ym => (lang === "zh" ? `${+ym.slice(0, 4)} 年 ${+ym.slice(5, 7)} 月` : fmt(ym + "-01", { month: "long", year: "numeric" }));
  const monthShort = d => (lang === "zh" ? `${utc(d).getUTCMonth() + 1} 月` : fmt(d, { month: "short" }));
  const rel = d => {
    const n = diff(TODAY, d);
    if (n === 0) return tx("今天", "today");
    if (n === 1) return tx("明天", "tomorrow");
    if (n === -1) return tx("昨天", "yesterday");
    return n > 0 ? tx(`${n} 天後`, `in ${n} days`) : tx(`${-n} 天前`, `${-n} days ago`);
  };

  // ---------- data: every file is optional, every entry is checked ----------
  const PROBLEMS = [];
  const CHECK = { text: v => v != null && v !== "", date: isDate, list: Array.isArray };
  const obj = (get, d) => { try { const v = get(); return v && typeof v === "object" ? v : d; } catch (e) { return d; } };
  const read = (file, get, need) => {
    const v = obj(get, null);
    if (!Array.isArray(v)) { PROBLEMS.push({ file }); return []; }
    const ok = v.filter(x => x && typeof x === "object" && Object.entries(need).every(([k, t]) => CHECK[t](x[k])));
    if (ok.length < v.length) PROBLEMS.push({ file, n: v.length - ok.length });
    return ok;
  };
  const SEA = obj(() => SEASON, null) || (PROBLEMS.push({ file: "season.js" }), {});
  const sea = k => (Array.isArray(SEA[k]) ? SEA[k] : []).filter(x => x && typeof x === "object");
  const NODES = sea("nodes").filter(n => n.n && isDate(n.date)).sort((a, b) => a.date.localeCompare(b.date));
  const NODE = Object.fromEntries(NODES.map(n => [n.n, n]));
  const ROLES = sea("roles").filter(r => r.code && r.name), ROLE = Object.fromEntries(ROLES.map(r => [r.code, r]));
  const BANDS = sea("bands").filter(b => isDate(b.s) && isDate(b.e)).sort((a, b) => a.s.localeCompare(b.s));
  const PHASES = BANDS.filter(b => ["phase", "crunch", "trip"].includes(b.kind)), OFF = BANDS.filter(b => ["break", "exam"].includes(b.kind));
  const ANN = read("announcements.js", () => ANNOUNCEMENTS, { d: "date", t: "text" });
  const WKS = read("week.js", () => WEEKS, { from: "date", goals: "list" });
  const SES = obj(() => SESSIONS, []).filter(s => s && isDate(s.from) && isDate(s.to) && Array.isArray(s.days));
  const HW = read("homework.js", () => HOMEWORK, { id: "text", t: "text", due: "date" });
  const LNK = read("links.js", () => LINKS, { id: "text", t: "text" }), LINK = Object.fromEntries(LNK.map(l => [l.id, l]));
  const LGROUPS = obj(() => LINK_GROUPS, []).filter(g => g && g.id);
  const ASKS = read("team.js", () => ASK, { q: "text", a: "text" });
  const HOLD = obj(() => HOLDERS, {});
  const OUT = read("attributions.js", () => OUTSIDE, { t: "text" });
  const CRED = obj(() => CREDITS, []).filter(c => c && c.t);
  ANN.forEach((a, i) => { a.id = `${a.d}-${ANN.length - i}`; });

  // The season runs from the first phase to the last milestone. Nothing here assumes how many there are.
  const KICK = PHASES.length ? PHASES[0].s : NODES.length ? NODES[0].date : TODAY;
  const LAST = NODES.length ? NODES[NODES.length - 1].date : PHASES.length ? PHASES[PHASES.length - 1].e : KICK;
  const W1 = dow(KICK) === 1 ? KICK : addDays(monday(KICK), 7);
  const HAS = PHASES.length + NODES.length > 0;
  const weekLabel = mon => !HAS ? "" : mon > LAST ? tx("賽季結束", "Season over") : mon >= W1 ? tx(`第 ${diff(W1, mon) / 7 + 1} 週`, `Week ${diff(W1, mon) / 7 + 1}`) : mon === monday(KICK) ? tx("開季週", "Kickoff week") : tx("開季前", "Pre-season");
  const phaseOn = d => { const hit = PHASES.find(x => d >= x.s && d <= x.e); return hit && d <= LAST ? L(hit.n) : ""; };
  const shadeOn = d => OFF.find(x => d >= x.s && d <= x.e);
  const weekEntry = mon => WKS.find(w => w.from <= mon && (isDate(w.to) ? w.to : addDays(w.from, 6)) >= mon);
  const nextNode = () => NODES.find(n => n.date >= TODAY);

  const LANES = {
    deadline: { c: "var(--red)", zh: "iGEM 截止", en: "iGEM deadline" },
    gate: { c: "var(--blue)", zh: "內部關卡", en: "Internal gate" },
    adv: { c: "var(--amber)", zh: "Advisor", en: "Advisor" }
  };
  const lane = n => LANES[n.lane] || { c: "var(--blue)", zh: "里程碑", en: "Milestone" };
  const GROUPS = [
    ["wet", "var(--teal)", "Wet lab", "Wet lab"], ["dry", "var(--blue)", "Dry lab", "Dry lab"], ["hw", "var(--amber)", "Hardware", "Hardware"],
    ["hp", "var(--green)", "Human Practices", "Human Practices"], ["wiki", "var(--violet)", "Wiki 與交付物", "Wiki & deliverables"], ["media", "var(--pink)", "Media", "Media"],
    ["ops", "var(--navy2)", "隊務", "Team ops"], ["adv", "var(--amber)", "Advisor", "Advisors"], ["staff", "var(--ink3)", "老師", "Instructors"]
  ].map(([id, c, zh, en]) => ({ id, c, zh, en }));
  const group = id => GROUPS.find(g => g.id === id) || { id, c: "var(--ink3)", zh: id || "其他", en: id || "Other" };
  const gName = id => (id === "all" || !id ? tx("全隊", "Everyone") : L(group(id)));
  const driveNote = name => { const f = sea("drive").find(x => x.name === name); return f ? L(f.holds) : ""; };
  const linkD = l => L(l.d) || driveNote(L(l.t));

  // ---------- small parts ----------
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', right: '<path d="m9 6 6 6-6 6"/>', left: '<path d="m15 6-6 6 6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    sheet: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',
    site: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    repo: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    igem: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><circle cx="12" cy="12" r="2.5"/>'
  };
  const ic = k => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || IC.site}</svg>`;
  const MARK = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#00061C"/><path d="M16 16 8.5 10M16 16l8-5M16 16v9" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/><circle cx="8.5" cy="10" r="3" fill="#2887FF"/><circle cx="24" cy="11" r="3" fill="#00D492"/><circle cx="16" cy="25" r="3" fill="#7C5CFF"/><circle cx="16" cy="16" r="3.5" fill="#fff"/></svg>`;
  const EXT = ' target="_blank" rel="noopener"';
  const CO = () => tx("：", ": ");
  const more = (href, label, out) => `<a class="more" href="${esc(href)}"${out ? EXT : ""}>${esc(label)} ${out ? "↗" : "→"}</a>`;
  const empty = t => `<p class="empty">${esc(t)}</p>`;
  const tile = (title, right, body, cls = "") => `<article class="tile ${cls}"><header class="th"><h2>${esc(title)}</h2>${right || ""}</header>${body}</article>`;
  const head = (eyebrow, h1, lede, extra = "") => `<section class="ph"><div class="wrap"><p class="eyebrow">${eyebrow.filter(Boolean).map(e => `<span>${esc(e)}</span>`).join("")}</p><h1 class="h1">${h1}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}${extra}</div></section>`;
  const sec = (body, cls = "") => `<section class="sec ${cls}"><div class="wrap">${body}</div></section>`;
  // An owner is "all", "staff", "adv", a seat code from the System site, or plain words { zh, en }.
  const who = c => !c ? "" : typeof c === "object" ? L(c) : c === "all" ? tx("全隊", "Everyone") : c === "staff" ? tx("老師", "Instructors") : c === "adv" ? "Advisor" : ROLE[c] ? L(ROLE[c].name) : String(c);
  const whoHTML = c => (typeof c === "string" && ROLE[c] ? `<a href="team.html#${esc(c)}">${esc(who(c))}</a>` : esc(who(c)));
  const linkTo = (id, label) => { const l = LINK[id]; return !l ? "" : l.url ? `<a href="${esc(l.url)}"${EXT}>${esc(label || L(l.t))} ↗</a>` : `<a href="links.html#${esc(id)}">${esc(label || L(l.t))}</a>`; };
  const nodeWhen = n => (n.dl ? L(n.dl) : mdw(n.date));
  const hwDone = store.json("gems27.hw", {});
  const hwLive = h => h.due >= TODAY;
  const pins = () => store.json("gems27.pins", {});
  const isPinned = l => { const p = pins(); return l.id in p ? p[l.id] : !!l.pin; };
  const dayEvents = d => [
    ...NODES.filter(n => n.date === d).map(n => ({ c: lane(n).c, t: L(n.t), k: L(lane(n)), href: `milestones.html#${n.n}` })),
    ...HW.filter(h => h.due === d).map(h => ({ c: "var(--violet)", t: L(h.t), k: tx("作業截止", "Homework due"), href: `homework.html#${h.id}` })),
    ...SES.filter(s => d >= s.from && d <= s.to && s.days.includes(dow(d))).map(s => ({ c: "var(--ink4)", t: L(s.t), k: tx("固定時段（暫定）", "Session (provisional)") }))
  ];

  // ---------- shell ----------
  const NAV = [
    ["home", "index.html", "今天", "Today"], ["week", "week.html", "本週", "This week"], ["homework", "homework.html", "作業", "Homework"],
    ["milestones", "milestones.html", "里程碑", "Milestones"], ["news", "announcements.html", "公告", "News"], ["links", "links.html", "連結", "Links"],
    ["team", "team.html", "負責人", "Owners"], ["guide", "guide.html", "指南", "Guide"], ["credits", "attributions.html", "貢獻", "Attributions"]
  ].map(([k, href, zh, en]) => ({ k, href, zh, en }));
  const SITE = () => tx("GEMS 2027 專案中心", "GEMS 2027 Project Hub");
  function shell() {
    $("#nav").innerHTML = `<div class="nav__in">
      <a class="brand" href="index.html">${MARK}<b>${SITE()}</b></a>
      <nav class="nav__links" aria-label="${tx("頁面", "Pages")}">${NAV.map(p => `<a href="${p.href}"${p.k === PAGE ? ' aria-current="page"' : ""}>${esc(L(p))}</a>`).join("")}</nav>
      <div class="nav__act">
        <button class="find" data-find aria-label="${tx("搜尋", "Search")}">${ic("search")}<span>${tx("搜尋", "Search")}</span><kbd>/</kbd></button>
        <a class="syslink" href="${SYS}">${tx("系統網站", "System site")} ↗</a>
        <div class="lang" role="group" aria-label="Language"><button data-lang="zh" aria-pressed="${lang === "zh"}">中</button><button data-lang="en" aria-pressed="${lang === "en"}">EN</button></div>
      </div></div>`;
    $("#foot").innerHTML = `<div class="foot__in">
      <div><h4>${SITE()}</h4>
        <p>${tx("GEMS Taiwan 2027 iGEM 隊的入口。", "The front door for the GEMS Taiwan 2027 iGEM team.")}</p>
        <p>${tx("這是公開網站，不放姓名、個人進度、評量和聯絡方式。時程與規則每天從系統網站同步；標 ? 的日期是推估。", "This site is public: no names, individual progress, reviews or contact details. The schedule and rules sync daily from the System site; dates marked ? are estimates.")}</p></div>
      <div><h4>${tx("頁面", "Pages")}</h4><nav>${NAV.map(p => `<a href="${p.href}">${esc(L(p))}</a>`).join("")}</nav></div>
      <div><h4>${tx("為什麼這樣做", "Why we work this way")}</h4><nav><a href="${SYS}">${tx("GEMS iGEM 系統網站", "The GEMS iGEM System site")} ↗</a></nav></div>
    </div>`;
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    const p = NAV.find(x => x.k === PAGE);
    document.title = !p || PAGE === "home" ? SITE() : `${L(p)} · ${SITE()}`;
  }
  const problems = () => PROBLEMS.length ? `<div class="wrap"><p class="warn">${tx("有資料沒有載入：", "Some data did not load: ")}${PROBLEMS.map(p => `<code>data/${esc(p.file)}</code> ${p.n ? tx(`略過 ${p.n} 筆格式不對的`, `${p.n} malformed ${p.n === 1 ? "entry" : "entries"} skipped`) : tx("讀不到", "could not be read")}`).join(tx("；", "; "))}${tx("。格式寫在每個檔案的開頭。", ". Each file starts with the shape of an entry.")}</p></div>` : "";

  // ---------- year ribbon ----------
  function ribbon(filter) {
    const dates = [...NODES.map(n => n.date), ...PHASES.flatMap(b => [b.s, b.e])].sort();
    if (!dates.length) return "";
    const m0 = utc(dates[0].slice(0, 7) + "-01"), m1 = utc(dates[dates.length - 1].slice(0, 7) + "-01");
    m1.setUTCMonth(m1.getUTCMonth() + 1);
    const R0 = iso(m0), span = diff(R0, iso(m1)), rx = d => (diff(R0, d) / span) * 100, nextN = (nextNode() || {}).n;
    const months = []; for (let x = new Date(m0); x < m1; x.setUTCMonth(x.getUTCMonth() + 1)) months.push(iso(x));
    const dot = n => `<a class="rb__dot${n.date < TODAY ? " is-past" : ""}${n.n === nextN ? " is-next" : ""}${filter && !filter(n) ? " is-dim" : ""}" href="milestones.html#${esc(n.n)}" style="left:${rx(n.date)}%;--c:${lane(n).c}" title="${esc(`${nodeWhen(n)} · ${L(n.t)}`)}" aria-label="${esc(`${nodeWhen(n)} ${L(n.t)}`)}"></a>`;
    return `<div class="rb"><div class="rb__in" style="min-width:${months.length * 60}px">
      <div class="rb__months">${months.map(m => `<span style="left:${rx(m)}%">${esc(monthShort(m))}</span>`).join("")}</div>
      <div class="rb__bands">${PHASES.map(b => { const w = rx(b.e) - rx(b.s); return `<span class="rb__band${TODAY >= b.s && TODAY <= b.e ? " is-now" : ""}" style="left:${rx(b.s)}%;width:calc(${w}% - 3px)" title="${esc(L(b.n))}">${w > 8 ? esc(L(b.n)) : ""}</span>`; }).join("")}</div>
      <div class="rb__row rb__row--a">${NODES.filter(n => n.lane === "deadline").map(dot).join("")}</div>
      <div class="rb__row rb__row--b">${NODES.filter(n => n.lane !== "deadline").map(dot).join("")}</div>
      ${TODAY >= R0 && TODAY < iso(m1) ? `<div class="rb__today" style="left:${rx(TODAY)}%"><span>${tx("今天", "Today")}</span></div>` : ""}
    </div></div>
    <p class="legend">${[...new Set(NODES.map(n => n.lane))].map(k => lane({ lane: k })).map(l => `<span><i style="--c:${l.c}"></i>${esc(L(l))}</span>`).join("")}<span>${tx("標 ? 的日期是推估，iGEM 公布 2027 行事曆後更新。", "Dates marked ? are estimates until iGEM announces its 2027 calendar.")}</span></p>`;
  }

  // ---------- shared lists ----------
  const goalsHTML = w => w && w.goals.some(g => g && g.t)
    ? `<ul class="list goals">${w.goals.filter(g => g && g.t).map(g => `<li class="${g.done ? "is-done" : ""}">${g.done ? ic("check") : "<i></i>"}<div><p>${esc(L(g.t))}</p><small>${[g.done ? tx("完成", "Done") : "", whoHTML(g.owner), g.link ? linkTo(g.link) : ""].filter(Boolean).join(" · ")}</small></div></li>`).join("")}</ul>`
    : empty(tx("這一週的目標還沒寫。", "No goals written for this week yet."));
  const TAG = { team: { zh: "全隊", en: "Team" }, schedule: { zh: "時程", en: "Schedule" }, homework: { zh: "作業", en: "Homework" }, system: { zh: "系統", en: "System" }, igem: { zh: "iGEM", en: "iGEM" } };
  const linkRow = (l, full) => {
    const d = full ? linkD(l) : "", a = !l.url ? tx("尚未開放", "Not open yet") : l.access === "team" ? tx("團隊帳號", "Team account") : full ? "" : tx("公開", "Public");
    const main = `<b>${esc(L(l.t))}${l.url ? " ↗" : ""}</b>${d ? `<small>${esc(d)}</small>` : ""}${a ? `<em>${esc(a)}</em>` : ""}`;
    return `<li class="lk${l.url ? "" : " is-soon"}"${full ? ` id="${esc(l.id)}"` : ""}>${ic(l.kind)}${l.url ? `<a class="lk__main" href="${esc(l.url)}"${EXT}>${main}</a>` : `<span class="lk__main">${main}</span>`}
      ${full ? `<button data-pin="${esc(l.id)}" aria-pressed="${isPinned(l)}" title="${tx("放到今天頁", "Show on Today")}" aria-label="${tx("放到今天頁", "Show on Today")}">${ic("star")}</button>` : ""}</li>`;
  };

  // ================= pages: each is a list of sections, and a section that throws does not take the page down =================
  const S = { wk: monday(TODAY), nf: "all", nv: "list", cal: TODAY.slice(0, 7), lg: "all", q: "", dl: "all" };
  const seg = (key, opts) => `<div class="seg">${opts.map(([v, label, c]) => `<button data-set="${key}:${esc(v)}" aria-pressed="${S[key] === v}"${c ? ` style="--c:${c}"` : ""}>${c ? "<i></i>" : ""}${esc(label)}</button>`).join("")}</div>`;
  const P = {};

  // ----- Today: what do I do now -----
  P.home = [() => {
    const mon = monday(TODAY), w = weekEntry(mon), toKick = HAS ? diff(TODAY, KICK) : 0;
    const h1 = toKick > 0 ? tx(`距開季還有 <b class="tn">${toKick}</b> 天`, `<b class="tn">${toKick}</b> ${toKick === 1 ? "day" : "days"} to kickoff`)
      : HAS && TODAY > LAST ? tx("這一季結束了", "The season is over") : esc((w && L(w.theme)) || weekLabel(mon) || tx("今天", "Today"));
    return head([longDate(TODAY), phaseOn(TODAY), weekLabel(mon)], h1, w && L(w.note) ? esc(L(w.note)) : toKick > 0 ? tx(`${mdw(KICK)} 開季。`, `The season opens on ${mdw(KICK)}.`) : "");
  }, () => {
    const mon = monday(TODAY), w = weekEntry(mon), up = NODES.filter(n => n.date >= TODAY), next = up[0], days = next ? diff(TODAY, next.date) : 0;
    const due = HW.filter(h => hwLive(h) && !hwDone[h.id]).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4);
    const news = [...ANN.filter(a => a.pin), ...ANN.filter(a => !a.pin)].slice(0, 3);
    const goals = tile(`${tx("本週目標", "This week")} · ${md(mon)} – ${md(addDays(mon, 6))}`, more("week.html", tx("看整週", "The week")), goalsHTML(w));
    const dueT = tile(tx("接下來要交的", "Due next"), more("homework.html", tx("全部作業", "All homework")), due.length ? `<ul class="list list--date">${due.map(h => `<li><time datetime="${h.due}"${diff(TODAY, h.due) <= 3 ? ' class="is-soon"' : ""}>${esc(md(h.due))}</time><div><a href="homework.html#${esc(h.id)}">${esc(L(h.t))}</a><small>${esc(wd(h.due))} · ${esc(rel(h.due))}${h.optional ? ` · ${tx("選做", "optional")}` : ""}</small></div></li>`).join("")}</ul>` : empty(tx("目前沒有要交的作業。", "Nothing is due right now.")));
    const nextT = tile(tx("下一個里程碑", "Next milestone"), "", next ? `<p class="next__n">${days === 0 ? `<b>${tx("今天", "Today")}</b>` : `<b class="tn">${days}</b><span>${tx("天後", days === 1 ? "day" : "days")}</span>`}</p>
          <h3>${esc(L(next.t))}</h3><p class="next__d">${esc(nodeWhen(next))} · ${esc(L(lane(next)))}</p>
          ${L(next.pass) ? `<p class="next__pass"><span>${tx("通過條件", "To pass")}</span>${esc(L(next.pass))}</p>` : ""}
          ${up.length > 1 ? `<ul class="list list--date">${up.slice(1, 4).map(n => `<li><time datetime="${n.date}">${esc(md(n.date))}</time><a href="milestones.html#${esc(n.n)}">${esc(L(n.t))}</a></li>`).join("")}</ul>` : ""}
          ${more("milestones.html", tx("全部里程碑", "All milestones"))}` : empty(tx("這一季的里程碑都走完了。", "Every milestone this season has passed.")), "tile--dark next");
    const newsT = tile(tx("公告", "News"), more("announcements.html", tx("全部公告", "All news")), news.length ? `<ul class="list list--date">${news.map(a => `<li><time datetime="${a.d}">${esc(md(a.d))}</time><a href="announcements.html#a-${a.id}">${esc(L(a.t))}</a></li>`).join("")}</ul>` : empty(tx("還沒有公告。", "No news yet.")));
    // Two stacked columns: on a phone they read goals, due, next milestone, news.
    return sec(`<div class="cols"><div>${goals}${dueT}</div><div>${nextT}${newsT}</div></div>`, "sec--first");
  }, () => {
    const quick = LNK.filter(isPinned);
    return quick.length ? sec(`<div class="h2row"><h2 class="h2">${tx("常用連結", "Quick links")}</h2>${more("links.html", tx("全部連結", "All links"))}</div><ul class="lks lks--3">${quick.map(l => linkRow(l)).join("")}</ul>
      <p class="note">${tx("在連結頁按星號，可以換成你自己常用的。", "Star a link on the Links page to make this list your own.")}</p>`) : "";
  }, () => {
    const r = ribbon();
    return r ? sec(`<div class="h2row"><h2 class="h2">${tx("這一年走到哪裡", "Where we are in the year")}</h2>${more("milestones.html", tx("里程碑", "Milestones"))}</div>${r}`) : "";
  }];

  // ----- This week -----
  P.week = [() => {
    const mon = S.wk, sun = addDays(mon, 6), w = weekEntry(mon);
    return head([weekLabel(mon), phaseOn(mon)], `${esc(md(mon))} – ${esc(md(sun))}`, w ? [L(w.theme), L(w.note)].filter(Boolean).map(esc).join("<br>") : "",
      `<div class="wknav"><button class="rnd" data-wk="-7" aria-label="${tx("上一週", "Previous week")}">${ic("left")}</button><button class="rnd" data-wk="7" aria-label="${tx("下一週", "Next week")}">${ic("right")}</button>
        ${mon !== monday(TODAY) ? `<button class="btn btn--ghost btn--s" data-wk="0">${tx("回到這一週", "Back to this week")}</button>` : ""}</div>`);
  }, () => {
    const mon = S.wk, w = weekEntry(mon), days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    const evs = days.flatMap(d => dayEvents(d).map(e => Object.assign({ d }, e)));
    const off = [...new Set(days.map(shadeOn).filter(Boolean))];
    return sec(`<div class="strip">${days.map(d => `<div class="sday${d === TODAY ? " is-today" : ""}${shadeOn(d) ? " is-off" : ""}"><span>${esc(wd(d))}</span><b class="tn">${utc(d).getUTCDate()}</b><p>${dayEvents(d).map(e => `<i style="--c:${e.c}"></i>`).join("")}</p></div>`).join("")}</div>
      ${off.length ? `<p class="note">${esc(off.map(b => `${L(b.now || b.n)}（${md(b.s)} – ${md(b.e)}）`).join(tx("；", "; ")))}</p>` : ""}
      <div class="grid" style="margin-top:20px">
      ${tile(tx("目標", "Goals"), "", goalsHTML(w), "c7")}
      ${tile(tx("這週的日子", "Dates this week"), "", evs.length ? `<ul class="list list--date">${evs.map(e => `<li><time datetime="${e.d}">${esc(md(e.d))}</time><div>${e.href ? `<a href="${e.href}">${esc(e.t)}</a>` : `<span>${esc(e.t)}</span>`}<small>${esc(wd(e.d))} · ${esc(e.k)}</small></div></li>`).join("")}</ul>` : empty(tx("這週沒有里程碑、作業截止或固定時段。", "No milestone, homework deadline or session this week.")), "c5")}
      </div><p class="note">${tx("每週都要做的事寫在", "What everyone does every week is in the")} <a href="guide.html#weekly">${tx("指南", "Guide")}</a>${tx("。", ".")}</p>`, "sec--first");
  }];

  // ----- Milestones -----
  const nodePass = n => S.nf === "all" || n.lane === S.nf;
  const nodeItem = (n, nextN) => `<li class="tl__i${n.date < TODAY ? " is-past" : ""}${n.n === nextN ? " is-next" : ""}" id="${esc(n.n)}" style="--c:${lane(n).c}">
      <div class="tl__when"><time datetime="${n.date}">${esc(nodeWhen(n))}</time><small>${esc(rel(n.date))}</small></div>
      <div class="tl__body"><p class="tl__k">${n.n === nextN ? `<b>${tx("下一個", "Next")}</b>` : ""}<span>${esc(L(lane(n)))}</span><span class="nid">${esc(n.n)}</span></p>
        <h4>${esc(L(n.t))}</h4>
        ${L(n.pass) ? `<p><b>${tx("通過條件", "To pass")}</b>${esc(L(n.pass))}</p>` : ""}${L(n.d) ? `<p>${esc(L(n.d))}</p>` : ""}
        ${L(n.owner) || L(n.ok) ? `<p class="tl__who">${[L(n.owner) && `${tx("負責", "Owner")}${CO()}${L(n.owner)}`, L(n.ok) && `${tx("驗收", "Accepted by")}${CO()}${L(n.ok)}`].filter(Boolean).map(esc).join(" · ")}</p>` : ""}</div></li>`;
  const byMonth = (list, nextN) => [...new Set(list.map(n => n.date.slice(0, 7)))].map(m => `<section class="tlm"><h3>${esc(monthName(m))}</h3><ol>${list.filter(n => n.date.slice(0, 7) === m).map(n => nodeItem(n, nextN)).join("")}</ol></section>`).join("");
  function calendar() {
    const first = S.cal + "-01", cells = [];
    for (let d = monday(first); cells.length < 42; d = addDays(d, 1)) { if (cells.length >= 28 && cells.length % 7 === 0 && d.slice(0, 7) !== S.cal) break; cells.push(d); }
    return `<div class="cal"><div class="cal__h"><h3>${esc(monthName(S.cal))}</h3><div><button class="txt" data-cal="0">${tx("今天", "Today")}</button><button data-cal="-1" aria-label="${tx("上個月", "Previous month")}">${ic("left")}</button><button data-cal="1" aria-label="${tx("下個月", "Next month")}">${ic("right")}</button></div></div>
      <div class="cal__g">${cells.slice(0, 7).map(d => `<div class="cal__w">${esc(wd(d))}</div>`).join("")}${cells.map(d => { const sh = shadeOn(d), evs = dayEvents(d).filter(e => !e.href || !e.href.startsWith("milestones") || nodePass(NODE[e.href.split("#")[1]]));
        return `<div class="cal__d${d.slice(0, 7) !== S.cal ? " is-out" : ""}${d === TODAY ? " is-today" : ""}${sh ? " is-shade" : ""}"><b>${utc(d).getUTCDate()}</b>${evs.map(e => e.href ? `<a class="ev" href="${e.href}" style="--c:${e.c}" title="${esc(e.t)}">${esc(e.t)}</a>` : `<span class="ev" style="--c:${e.c}" title="${esc(e.t)}">${esc(e.t)}</span>`).join("")}${sh && (d === sh.s || dow(d) === 1) ? `<span class="band">${esc(L(sh.n))}</span>` : ""}</div>`; }).join("")}</div>
      <p class="legend"><span><i style="--c:var(--violet)"></i>${tx("作業截止", "Homework due")}</span><span><i style="--c:var(--ink4)"></i>${tx("固定時段（暫定）", "Session (provisional)")}</span><span>${tx("灰底是假期或考試。", "Grey days are breaks or exams.")}</span></p></div>`;
  }
  P.milestones = [
    () => head([`${NODES.length} ${tx("個里程碑", NODES.length === 1 ? "milestone" : "milestones")}`, `${NODES.filter(n => n.date >= TODAY).length} ${tx("個還沒到", "still ahead")}`], tx("里程碑", "Milestones"),
      tx("每個里程碑都有日期、通過條件、負責人和驗收人。", "Every milestone has a date, a pass condition, an owner and someone who accepts it.")),
    () => { const r = ribbon(nodePass); return r ? sec(r, "sec--first") : ""; },
    () => {
      const lanes = [...new Set(NODES.map(n => n.lane))], list = NODES.filter(nodePass), nextN = (nextNode() || {}).n;
      const past = list.filter(n => n.date < TODAY), ahead = list.filter(n => n.date >= TODAY);
      return sec(`<div class="bar">${lanes.length > 1 ? seg("nf", [["all", tx("全部", "All")], ...lanes.map(k => [k, L(lane({ lane: k })), lane({ lane: k }).c])]) : ""}<span class="bar__gap"></span>${seg("nv", [["list", tx("時間軸", "Timeline")], ["cal", tx("月曆", "Calendar")]])}</div>
        <div>${S.nv === "cal" ? calendar() : !NODES.length ? empty(tx("時程還沒同步過來。", "The schedule has not synced yet.")) : `
          ${past.length ? `<details class="past" id="past"><summary>${tx(`已經過的 ${past.length} 個`, `${past.length} already passed`)}</summary>${byMonth(past, nextN)}</details>` : ""}
          ${byMonth(ahead, nextN) || empty(tx("這個分類沒有還沒到的里程碑。", "Nothing still ahead in this category."))}`}</div>
        <p class="note">${tx("每個里程碑的來龍去脈在", "The reasoning behind each one is on the")} <a href="${SYS}timeline.html"${EXT}>${tx("系統網站的時程頁", "System site’s schedule page")} ↗</a>${tx("。", ".")}</p>`);
    }];

  // ----- Homework -----
  const hwItem = h => { const live = hwLive(h), soon = isDate(h.assigned) && h.assigned > TODAY, how = h.submit && L(h.submit.how), to = h.submit && h.submit.link ? linkTo(h.submit.link) : "";
    return `<article class="hw tile${live ? "" : " is-closed"}${hwDone[h.id] ? " is-ticked" : ""}" id="${esc(h.id)}">
      <div class="hw__date"><b class="tn">${utc(h.due).getUTCDate()}</b><span>${esc(monthShort(h.due))}</span><small>${esc(wd(h.due))}</small></div>
      <div class="hw__body"><p class="hw__k">${[live ? `${tx("截止", "Due")} ${rel(h.due)}` : tx("已截止", "Closed"), soon ? tx(`${md(h.assigned)} 發布`, `set on ${md(h.assigned)}`) : "", h.optional ? tx("選做", "Optional") : "", gName(h.group)].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}</p>
        <h3>${esc(L(h.t))}</h3>${L(h.body) ? `<p>${esc(L(h.body))}</p>` : ""}
        ${how || to || h.review ? `<dl>${how || to ? `<dt>${tx("交到哪裡", "Hand in")}</dt><dd>${esc(how)} ${to}</dd>` : ""}${h.review ? `<dt>${tx("誰會看", "Read by")}</dt><dd>${whoHTML(h.review)}</dd>` : ""}</dl>` : ""}
        <label class="hw__done"><input type="checkbox" data-hw="${esc(h.id)}"${hwDone[h.id] ? " checked" : ""}>${tx("我交了", "Handed in")}</label></div></article>`; };
  P.homework = [() => { const live = HW.filter(hwLive).length; return head([live ? `${live} ${tx("份還沒截止", "not yet due")}` : tx("目前沒有作業", "Nothing set right now")], tx("作業", "Homework"), tx("每份作業寫清楚：做什麼、哪一天截止、交到哪裡、誰會看。", "Each assignment says what to do, when it is due, where it goes and who reads it.")); },
    () => {
      const all = HW.slice().sort((a, b) => a.due.localeCompare(b.due)), live = all.filter(hwLive), closed = all.filter(h => !hwLive(h)).reverse();
      return sec(`<div class="hws">${live.length ? live.map(hwItem).join("") : empty(tx("目前沒有要交的作業。", "Nothing is due right now."))}</div>
        ${closed.length ? `<details class="past" id="past"><summary>${tx(`已截止的 ${closed.length} 份`, `${closed.length} closed`)}</summary><div class="hws">${closed.map(hwItem).join("")}</div></details>` : ""}
        <p class="note">${tx("「我交了」只記在這台裝置，給你自己看。誰交了、成績和評語不會出現在這個公開網站。", "“Handed in” is remembered on this device only, for your own use. Who has handed in, grades and comments never appear on this public site.")}</p>`, "sec--first");
    }];

  // ----- News -----
  P.news = [() => head([ANN.length ? `${tx("最後更新", "Last posted")} ${md(ANN.map(a => a.d).sort().pop())}` : ""], tx("公告", "News"), tx("全隊要知道的事，最新的在最上面。", "What the whole team needs to know, newest first.")),
    () => sec(ANN.length ? `<ul class="feed">${[...ANN.filter(a => a.pin), ...ANN.filter(a => !a.pin)].map(a => `<li class="${a.pin ? "is-pin" : ""}" id="a-${a.id}"><time datetime="${a.d}">${esc(mdw(a.d))}</time>
        <div><h3>${esc(L(a.t))}</h3>${L(a.body) ? `<p>${esc(L(a.body))}</p>` : ""}
        <p class="feed__k">${[a.pin ? tx("置頂", "Pinned") : "", TAG[a.tag] ? L(TAG[a.tag]) : a.tag].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}${a.to ? more(a.to, tx("去看", "Open"), /^https?:/.test(a.to)) : ""}</p></div></li>`).join("")}</ul>` : empty(tx("還沒有公告。", "No news yet.")), "sec--first")];

  // ----- Owners -----
  const hit = (q, ...parts) => { const hay = parts.map(both).join(" ").toLowerCase(); return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w)); };
  const seatRow = r => { const names = Array.isArray(HOLD[r.code]) ? HOLD[r.code] : [], week = (r.week || []).filter(Boolean), bk = typeof r.backup === "string" && ROLE[r.backup] && r.backup !== r.code ? r.backup : "";
    const top = `<h4>${esc(L(r.name))}<code>${esc(r.code)}</code></h4>${L(r.own) ? `<p>${esc(L(r.own))}</p>` : ""}<small>${[names.length ? names.join("、") : tx("尚未指派", "Not yet named"), L(r.when)].filter(Boolean).map(esc).join(" · ")}</small>`;
    return week.length || bk ? `<details class="sc" id="${esc(r.code)}"><summary>${top}${ic("right")}</summary><div class="sc__b">
        ${week.length ? `<h5>${tx("每週", "Each week")}</h5><ul>${week.map(w => `<li>${esc(L(w))}</li>`).join("")}</ul>` : ""}${bk ? `<h5>${tx("不在時找", "Backup")}</h5><p>${whoHTML(bk)}</p>` : ""}</div></details>`
      : `<div class="sc" id="${esc(r.code)}"><div class="sc__s">${top}</div></div>`; };
  const teamList = () => {
    const q = S.q.trim(), ask = ASKS.filter(a => !q || hit(q, a.q, a.a));
    const rs = ROLES.filter(r => !q || hit(q, r.code, r.name, r.own, ...(r.week || []), (Array.isArray(HOLD[r.code]) ? HOLD[r.code] : []).join(" ")));
    const gs = [...new Set([...GROUPS.map(g => g.id), ...rs.map(r => r.group)])].filter(id => rs.some(r => r.group === id)).map(group);
    return `${ask.length ? `<h2 class="h2">${tx("遇到這件事，問誰", "Who to ask")}</h2><ul class="ask">${ask.map(a => `<li><h3>${esc(L(a.q))}</h3><p>${esc(L(a.a))}</p></li>`).join("")}</ul>` : ""}
      ${gs.length ? `<h2 class="h2 h2--gap">${tx("每個席位", "Every seat")}</h2><p class="sub">${tx("席位在分組公布後才有名字。點開看它每週做什麼。細節在", "Seats get names once groups are announced. Open one to see its weekly work. Detail is on the")} <a href="${SYS}people.html"${EXT}>${tx("系統網站的角色頁", "System site’s roles page")} ↗</a>${tx("。", ".")}</p>
        ${gs.map(g => `<section class="grp"><h3><i style="--c:${g.c}"></i>${esc(L(g))}</h3><div class="seats">${rs.filter(r => r.group === g.id).map(seatRow).join("")}</div></section>`).join("")}` : ""}
      ${!ask.length && !gs.length ? empty(q ? tx("找不到。換個詞，或按 / 搜尋整個網站。", "Nothing found. Try another word, or press / to search the whole site.") : tx("席位還沒同步過來。", "Seats have not synced yet.")) : ""}`;
  };
  P.team = [() => head([ROLES.length ? `${ROLES.length} ${tx("種席位", ROLES.length === 1 ? "seat" : "seats")}` : ""], tx("負責人", "Owners"), tx("遇到問題先看該問誰。每個席位負責什麼，寫在下面。", "Start with who to ask. What each seat owns is listed below.")),
    () => sec(`<div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋：照片、wiki、安全", "Search: photos, wiki, safety")}" autocomplete="off"></div><div id="list">${teamList()}</div>`, "sec--first")];

  // ----- Attributions -----
  P.credits = [() => head([tx("iGEM 交付物", "An iGEM deliverable")], tx("誰做了什麼", "Who did what"),
      tx("iGEM 要每一隊說清楚：哪些是隊員自己做的，哪些有人幫忙。我們整年都記，最後不用重建。", "iGEM asks every team to say plainly what its members did and where they had help. We keep the record all year, so nothing is rebuilt at the end.")),
    () => sec(`<h2 class="h2">${tx("貢獻怎麼累積", "How credit builds up")}</h2><ol class="steps">${[
        [tx("做了就記一筆", "Record it when you do it"), tx("實驗、訪談、圖和數字，做的當下就記進 Hub 試算表。每一列都有做的人。", "Runs, interviews, figures and numbers go into the Hub Sheet as they happen. Every row names who did it.")],
        [tx("每週回報寫下誰幫了你", "Say who helped you in the weekly check-in"), tx("一句就好。這些話會累積成對方的紀錄。", "One line is enough. These lines build up into that person’s record.")],
        [tx("凍結前整理成 Attributions", "It becomes the Attributions page before the freeze"), tx("Attributions 和 wiki 一起凍結。送出前，你確認自己那一行對不對。", "Attributions freeze with the wiki. Before it ships, you check that your own line is right.")]
      ].map(([a, b]) => `<li><h3>${esc(a)}</h3><p>${esc(b)}</p></li>`).join("")}</ol>
      <p class="note">${tx("誰負責哪一塊，看", "For who owns which area, see")} <a href="team.html">${tx("負責人", "Owners")}</a>${tx("。", ".")}</p>`, "sec--first"),
    () => OUT.length ? sec(`<h2 class="h2">${tx("隊外的協助", "Help from outside the team")}</h2><p class="sub">${tx("要寫出一個人的名字，先要有對方同意的紀錄。", "Naming a person here needs their recorded consent first.")}</p>
      <ul class="out">${OUT.map(o => { const items = (Array.isArray(o.items) ? o.items : []).filter(x => x && x.who); return `<li><h3>${esc(L(o.t))}</h3><p>${esc(L(o.d))}</p>${items.length ? `<ul>${items.map(x => `<li><b>${esc(L(x.who))}</b> ${esc(L(x.what))}${x.when ? ` <span class="muted">· ${esc(x.when)}</span>` : ""}</li>`).join("")}</ul>` : ""}</li>`; }).join("")}</ul>
      ${OUT.some(o => (o.items || []).length) ? "" : `<p class="note">${tx("還沒有紀錄。賽季開始後會一筆一筆加上來。", "Nothing recorded yet. Entries are added one by one once the season starts.")}</p>`}`) : "",
    () => CRED.length ? sec(`<h2 class="h2">${tx("這個網站用了什麼", "What this site is built from")}</h2><ul class="out">${CRED.map(c => `<li><h3>${esc(L(c.t))}</h3><p>${esc(L(c.d))}</p>${c.url ? `<p>${more(c.url, c.url.replace(/^https:\/\//, "").replace(/\/$/, ""), 1)}</p>` : ""}</li>`).join("")}</ul>`) : ""];

  // ----- Links -----
  const linkList = () => {
    const q = S.q.trim(), ok = l => (!q || hit(q, l.t, l.d, driveNote(L(l.t)), l.id, l.kind)) && (S.lg === "all" || (S.lg === "pins" ? isPinned(l) : l.g === S.lg));
    const known = LGROUPS.map(g => g.id), rest = LNK.some(l => !known.includes(l.g)) ? [{ id: "", name: { zh: "其他", en: "Other" } }] : [];
    const gs = S.lg === "pins" ? [{ id: "pins", name: { zh: "我的常用", en: "My quick links" } }] : [...LGROUPS, ...rest];
    return gs.map(g => { const ls = LNK.filter(l => ok(l) && (g.id === "pins" || l.g === g.id || (!g.id && !known.includes(l.g))));
      return ls.length ? `<section class="lg" id="g-${esc(g.id)}"><div class="lg__h"><h2>${esc(L(g.name))}</h2>${g.note ? `<p>${esc(L(g.note))}</p>` : ""}</div><ul class="lks">${ls.map(l => linkRow(l, 1)).join("")}</ul></section>` : ""; }).join("")
      || empty(tx("找不到。換個詞，或按 / 搜尋整個網站。", "Nothing found. Try another word, or press / to search the whole site."));
  };
  P.links = [() => { const soon = LNK.filter(l => !l.url).length; return head([`${LNK.length} ${tx("個連結", "links")}`, soon ? `${soon} ${tx("個尚未開放", "not open yet")}` : ""], tx("連結", "Links"), tx("Drive、試算表、範本、網站和 iGEM 官方頁面，都在這一頁。", "The Drive, workbooks, templates, sites and official iGEM pages, all on this page.")); },
    () => sec(`<div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋連結", "Search links")}" autocomplete="off">${seg("lg", [["all", tx("全部", "All")], ["pins", tx("常用", "Starred")], ...LGROUPS.map(g => [g.id, L(g.name)])])}</div>
      <p class="note">${tx("標「團隊帳號」的連結，要用已加入團隊 Drive 的 Google 帳號開。", "Links marked Team account open only with the Google account that was added to the team Drive.")}</p>
      <div id="list">${linkList()}</div>`, "sec--first")];

  // ----- Guide: built from what the System site publishes; an empty part is left out -----
  const DLNAME = { all: ["全隊", "All-team"], wet: ["Wet lab", "Wet lab"], dry: ["Dry lab", "Dry lab"], hp: ["HP", "HP"], wiki: ["Wiki 與交付物", "Wiki & deliverables"], adv: ["Advisor", "Advisors"], ops: ["老師", "Instructors"] };
  const DOCS = sea("docs").filter(x => x.n && !["igem", "gate"].includes(x.lane));
  const docRows = () => DOCS.filter(x => (S.dl === "all" || x.lane === S.dl) && (!S.q || hit(S.q, x.n, x.who, x.reads, x.loc))).map(x => `<li><h3>${esc(L(x.n))}</h3><p>${[L(x.who) && `${tx("誰寫", "Written by")}${CO()}${L(x.who)}`, L(x.reads) && `${tx("誰讀", "Read by")}${CO()}${L(x.reads)}`].filter(Boolean).map(esc).join(" · ")}</p>${x.loc ? `<code>${esc(x.loc)}</code>` : ""}</li>`).join("") || `<li>${empty(tx("沒有符合的紀錄。", "No record matches."))}</li>`;
  const G = [
    ["weekly", ["每週", "Every week"], () => { const ch = sea("chores").filter(c => c.t), rt = sea("rituals").filter(r => r.t); return ch.length || rt.length ? `<h2 class="h2">${tx("每週要做的事", "What you do every week")}</h2>
      <div class="grid">${ch.length ? tile(tx("每個人", "Everyone"), "", `<ul class="list">${ch.map(c => `<li><h3>${esc(L(c.t))}</h3><small>${[L(c.who), c.min ? `${c.min} ${tx("分鐘", "min")}` : ""].filter(Boolean).map(esc).join(" · ")}</small></li>`).join("")}</ul>`, rt.length ? "c7" : "c12") : ""}
      ${rt.length ? tile(tx("固定節奏", "The fixed rhythm"), "", `<ul class="list">${rt.map(r => `<li><h3>${esc(L(r.t))}</h3></li>`).join("")}</ul>`, ch.length ? "c5" : "c12") : ""}</div>
      <p class="note">${tx("這一週的目標和日期在", "This week’s goals and dates are on")} <a href="week.html">${tx("本週", "This week")}</a>${tx("。", ".")}</p>` : ""; }],
    ["gates", ["關卡", "Gates"], () => { const g = sea("gates").filter(x => x.t); return g.length ? `<h2 class="h2">${tx("關卡", "Gates")}</h2><p class="sub">${tx("這幾件事沒過，東西就不能往下走。", "Until these clear, the work does not move on.")}</p>
      <ol class="rules">${g.map(x => `<li><h3>${esc(L(x.t))}</h3><p>${esc(L(x.rule))}</p>${L(x.who) ? `<small>${esc(L(x.who))}</small>` : ""}</li>`).join("")}</ol>` : ""; }],
    ["rules", ["規則", "Rules"], () => { const p = sea("principles").filter(x => x.t); return p.length ? `<div class="h2row"><h2 class="h2">${tx("規則", "Rules")}</h2>${more(SYS + "system.html", tx("完整說明", "In full"), 1)}</div>
      <ol class="rules">${p.map(x => `<li><h3>${esc(L(x.t))}</h3><p>${esc(L(x.d))}</p></li>`).join("")}</ol>` : ""; }],
    ["ids", ["ID", "IDs"], () => { const ids = (Array.isArray(SEA.ids) ? SEA.ids : []).filter(Array.isArray), ch = sea("chains").filter(c => Array.isArray(c.ids)); return ids.length ? `<h2 class="h2">${tx("ID 速查", "ID cheat sheet")}</h2><p class="sub">${tx("一件事只有一個 ID，其他地方都用 ID 引用。ID 由表自動產生，不用自己編。", "One thing, one ID; everywhere else cites it. The sheet assigns the ID, so nobody invents one.")}</p>
      ${ch.length ? `<div class="chains">${ch.map(c => `<p><b>${esc(L(c.name))}</b>${c.ids.map(x => `<code>${esc(x)}</code>`).join("<span>→</span>")}</p>`).join("")}</div>` : ""}
      <ul class="ids">${ids.map(r => `<li><code>${esc(r[0])}</code><h3>${esc(L(r[1]))}</h3><p>${[L(r[2]) && `${tx("誰建", "Created by")}${CO()}${L(r[2])}`, r[3] && `${tx("在", "In")} ${r[3]}`].filter(Boolean).map(esc).join(" · ")}</p></li>`).join("")}</ul>` : ""; }],
    ["names", ["檔名", "File names"], () => { const parts = [["var(--blue)", "20270412", tx("日期", "Date"), tx("年月日八碼，排序才會對。", "Eight digits, so files sort in order.")], ["var(--green)", "R0412", "ID", tx("這份檔案屬於哪一筆紀錄。", "The record this file belongs to.")], ["var(--violet)", "label", tx("標籤", "Label"), tx("幾個英文字說明內容，用連字號。", "A few words on what it is, joined by hyphens.")], ["var(--amber)", "v2", tx("版本", "Version"), tx("改了就加一，不寫 final。", "Add one when it changes. Never “final”.")]];
      return `<div class="h2row"><h2 class="h2">${tx("檔名怎麼取", "How to name a file")}</h2><span class="more">${linkTo("file-rules", tx("完整的 File Rules", "The full File Rules"))}</span></div>
      <div class="tile"><p class="name__ex">${parts.map(([c, ex]) => `<i style="--c:${c}">${ex}</i>`).join("<u>_</u>")}</p><div class="name__k">${parts.map(([c, , k, d]) => `<p><b><i style="--c:${c}"></i>${esc(k)}</b>${esc(d)}</p>`).join("")}</div></div>`; }],
    ["where", ["放哪裡", "Where it goes"], () => { const lanes = [...new Set(DOCS.map(x => x.lane))].filter(Boolean); return DOCS.length ? `<div class="h2row"><h2 class="h2">${tx("每樣東西放哪裡", "Where everything goes")}</h2>${more("links.html#g-drive", tx("Drive 資料夾", "Drive folders"))}</div><p class="sub">${tx("每種紀錄：誰寫、誰讀、放在哪。", "Every kind of record: who writes it, who reads it and where it lives.")}</p>
      <details class="past" id="records"><summary>${tx(`展開 ${DOCS.length} 種紀錄`, `Show all ${DOCS.length} kinds of record`)}</summary>
      <div class="bar"><input class="q" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋：Topic Card、SOP、會議", "Search: Topic Card, SOP, minutes")}" autocomplete="off">${lanes.length > 1 ? seg("dl", [["all", tx("全部", "All")], ...lanes.map(k => [k, DLNAME[k] ? tx(...DLNAME[k]) : k])]) : ""}</div>
      <ul class="list list--cols" id="list">${docRows()}</ul></details>` : ""; }],
    ["tabs", ["Hub 分頁", "Hub tabs"], () => { const t = sea("hubTabs").filter(h => h.tab); return t.length ? `<div class="h2row"><h2 class="h2">${tx("Hub 試算表的分頁", "The Hub Sheet tabs")}</h2><span class="more">${linkTo("hubsheet", tx("打開 Hub 試算表", "Open the Hub Sheet"))}</span></div><p class="sub">${tx("每張分頁都有一個每週會讀它、靠它做決定的人。", "Each tab has someone who reads it every week to decide something.")}</p>
      <ul class="list list--cols">${t.map(h => `<li><h3>${esc(h.tab)}</h3><p>${esc(L(h.why))}</p><small>${[L(h.reader), L(h.when)].filter(Boolean).map(esc).join(" · ")}</small></li>`).join("")}</ul>` : ""; }],
    ["tools", ["工具", "Tools"], () => { const l = sea("layers").filter(x => x.tool); return l.length ? `<h2 class="h2">${tx("什麼東西放在哪個工具", "Which tool holds what")}</h2>
      <ul class="list list--cols">${l.map(x => `<li><h3>${esc(L(x.tool))}</h3><small>${esc(L(x.name))}</small><p><b>${tx("放", "Yes")}</b> ${esc(L(x.put))}</p><p><b>${tx("不放", "No")}</b> ${esc(L(x.not))}</p></li>`).join("")}</ul>` : ""; }]
  ];
  P.guide = [() => {
    const parts = G.map(([id, name, fn]) => ({ id, name, html: safe(fn, "guide#" + id) })).filter(p => p.html);
    return head([tx("新人先讀這一頁", "New here? Read this first")], tx("指南", "Guide"), tx("每週要做什麼、哪些事不能跳過、每樣東西放哪裡。", "What to do each week, what cannot be skipped and where everything goes."))
      + (parts.length ? `<div class="subnav"><div>${parts.map(p => `<a href="#${p.id}">${esc(tx(...p.name))}</a>`).join("")}</div></div>${parts.map(p => `<section class="gsec" id="${p.id}"><div class="wrap">${p.html}</div></section>`).join("")}` : sec(empty(tx("指南的內容還沒同步過來。", "The guide has not synced yet."))));
  }];

  // ================= search =================
  let INDEX = null;
  const KIND = { page: ["頁面", "Page"], node: ["里程碑", "Milestone"], hw: ["作業", "Homework"], news: ["公告", "News"], link: ["連結", "Link"], seat: ["席位", "Seat"], ask: ["問誰", "Who to ask"], id: ["ID", "ID"], rec: ["紀錄", "Record"], rule: ["規則", "Rule"] };
  function buildIndex() {
    const E = [], add = (k, t, s, href, hay, ext, id) => E.push({ k, t, s, href, ext, id, hay: `${t} ${s} ${hay || ""}`.toLowerCase() });
    NAV.forEach(p => add("page", L(p), "", p.href, `${p.zh} ${p.en}`));
    NODES.forEach(n => add("node", L(n.t), `${nodeWhen(n)}${L(n.pass) ? " · " + L(n.pass) : ""}`, `milestones.html#${n.n}`, `${n.n} ${both(n.t)} ${both(n.pass)} ${both(n.owner)} ${both(n.dl)}`));
    HW.forEach(h => add("hw", L(h.t), `${tx("截止", "Due")} ${mdw(h.due)}`, `homework.html#${h.id}`, `${both(h.t)} ${both(h.body)}`));
    ANN.forEach(a => add("news", L(a.t), `${md(a.d)}${L(a.body) ? " · " + L(a.body) : ""}`, `announcements.html#a-${a.id}`, `${both(a.t)} ${both(a.body)}`));
    LNK.forEach(l => add("link", L(l.t), linkD(l) || (l.url ? l.url.replace(/^https?:\/\//, "") : ""), l.url || `links.html#${l.id}`, `${both(l.t)} ${both(l.d)} ${l.id} ${l.kind}`, !!l.url, l.id));
    ROLES.forEach(r => add("seat", `${L(r.name)} · ${r.code}`, L(r.own), `team.html#${r.code}`, `${both(r.name)} ${both(r.own)} ${(r.week || []).map(both).join(" ")}`));
    ASKS.forEach(a => add("ask", L(a.q), L(a.a), "team.html", `${both(a.q)} ${both(a.a)}`));
    (Array.isArray(SEA.ids) ? SEA.ids : []).filter(Array.isArray).forEach(r => add("id", `${r[0]} · ${L(r[1])}`, `${tx("在", "In")} ${r[3] || ""}`, "guide.html#ids", `${both(r[1])} ${both(r[2])}`));
    sea("hubTabs").filter(h => h.tab).forEach(h => add("rec", `Hub · ${h.tab}`, `${L(h.reader)} · ${L(h.why)}`, "guide.html#tabs", `${both(h.reader)} ${both(h.why)}`));
    DOCS.forEach(x => add("rec", L(x.n), x.loc || L(x.who), "guide.html#records", `${both(x.n)} ${both(x.who)} ${both(x.reads)}`));
    sea("principles").filter(p => p.t).forEach(p => add("rule", L(p.t), L(p.d), "guide.html#rules", `${both(p.t)} ${both(p.d)}`));
    sea("gates").filter(g => g.t).forEach(g => add("rule", L(g.t), L(g.rule), "guide.html#gates", `${both(g.t)} ${both(g.rule)}`));
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
    $("#pal-list").innerHTML = pal.res.length ? pal.res.map((e, i) => `<a class="pal__r${i === pal.i ? " is-on" : ""}" href="${esc(e.href)}"${e.ext ? EXT : ""} data-i="${i}"><div><b>${esc(e.t)}</b>${e.s ? `<small>${esc(e.s)}</small>` : ""}</div><em>${esc(tx(...KIND[e.k]))}${e.ext ? " ↗" : ""}</em></a>`).join("")
      : `<p class="pal__none">${tx("找不到。換個詞試試，中英文都可以。", "Nothing found. Try another word, in Chinese or English.")}</p>`;
    const kinds = Object.keys(KIND).filter(k => k !== "page" && INDEX.some(e => e.k === k));
    $("#pal-filters").innerHTML = [["all", tx("全部", "All")], ...kinds.map(k => [k, tx(...KIND[k])])].map(([k, t]) => `<button data-pf="${k}" aria-pressed="${pal.f === k}">${esc(t)}</button>`).join("");
    const on = $(".pal__r.is-on"); if (on) on.scrollIntoView({ block: "nearest" });
  }
  function palOpen(q) {
    let el = $("#pal");
    if (!el) { el = document.createElement("div"); el.id = "pal"; el.className = "pal"; document.body.appendChild(el); }
    el.innerHTML = `<div class="pal__box" role="dialog" aria-modal="true" aria-label="${tx("搜尋", "Search")}"><div class="pal__in">${ic("search")}<input id="pal-q" type="search" autocomplete="off" spellcheck="false" placeholder="${tx("搜尋里程碑、作業、連結、席位、ID", "Search milestones, homework, links, seats, IDs")}"><button data-palx aria-label="${tx("關閉", "Close")}">${tx("關閉", "Close")}</button></div>
      <div class="pal__filters" id="pal-filters"></div><div class="pal__list" id="pal-list"></div></div>`;
    el.classList.add("is-open"); pal.q = q || ""; pal.i = 0; pal.f = "all";
    const inp = $("#pal-q"); inp.value = pal.q; inp.focus(); palSearch();
  }
  const palClose = () => { const el = $("#pal"); if (el && el.classList.contains("is-open")) { el.classList.remove("is-open"); const b = $("[data-find]"); if (b) b.focus(); } };
  const palGo = e => { if (!e) return; palClose(); if (e.ext) window.open(e.href, "_blank", "noopener"); else if (e.href.split("#")[0] === (location.pathname.split("/").pop() || "index.html")) { location.hash = e.href.split("#")[1] || ""; gotoHash(); } else location.href = e.href; };

  // ================= render and events =================
  function safe(fn, name) {
    try { return fn(); } catch (e) { if (window.console) console.error("[hub] " + name, e); document.documentElement.dataset.err = name;
      return `<div class="wrap"><p class="warn">${tx("這一段顯示不出來", "This part could not be shown")} (${esc(name)}: ${esc(e && e.message)})</p></div>`; }
  }
  function render() {
    safe(shell, "shell");
    $("#main").innerHTML = problems() + (P[PAGE] || P.home).map((f, i) => safe(f, `${PAGE}#${i + 1}`)).join("");
    $$(".rb").forEach(el => { const t = $(".rb__today", el); if (t) el.scrollLeft = t.offsetLeft - el.clientWidth / 2; });
  }
  function gotoHash() {
    let h = ""; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
    if (!h) return;
    if (PAGE === "milestones" && NODE[h] && (S.nv !== "list" || !nodePass(NODE[h]))) { S.nv = "list"; S.nf = "all"; render(); }
    if ((PAGE === "team" || PAGE === "links") && (S.q || S.lg !== "all")) { S.q = ""; S.lg = "all"; render(); }
    const el = document.getElementById(h); if (!el) return;
    for (let d = el.closest("details"); d; d = d.parentElement && d.parentElement.closest("details")) d.open = true;
    el.scrollIntoView({ block: el.classList.contains("gsec") || el.tagName === "DETAILS" ? "start" : "center" });
    if (!el.classList.contains("gsec")) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  }
  const repaintList = () => { const el = $("#list"); if (el) el.innerHTML = PAGE === "team" ? teamList() : PAGE === "links" ? linkList() : docRows(); };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-lang],[data-find],[data-set],[data-wk],[data-cal],[data-pin],[data-pf],[data-palx],.pal__r,.pal");
    if (!el) return;
    const d = el.dataset;
    if (d.lang) { lang = d.lang; store.set("lang", lang); INDEX = null; render(); }
    else if ("find" in d) palOpen();
    else if (d.set) { const [k, v] = d.set.split(":"); S[k] = v; if (k === "dl" || k === "lg") { repaintList(); $$(`[data-set^="${k}:"]`).forEach(b => b.setAttribute("aria-pressed", b.dataset.set === d.set)); } else render(); }
    else if (d.wk) { S.wk = +d.wk ? addDays(S.wk, +d.wk) : monday(TODAY); render(); }
    else if (d.cal) { if (+d.cal) { const x = utc(S.cal + "-01"); x.setUTCMonth(x.getUTCMonth() + +d.cal); S.cal = iso(x).slice(0, 7); } else S.cal = TODAY.slice(0, 7); render(); }
    else if (d.pin) { const p = pins(), l = LINK[d.pin]; if (!l) return; p[l.id] = !isPinned(l); store.set("gems27.pins", JSON.stringify(p)); if (S.lg === "pins") repaintList(); else el.setAttribute("aria-pressed", p[l.id]); }
    else if (d.pf) { pal.f = d.pf; pal.i = 0; palSearch(); }
    else if ("palx" in d) palClose();
    else if (el.classList.contains("pal__r")) { e.preventDefault(); palGo(pal.res[+d.i]); }
    else if (e.target === el) palClose();
  });
  document.addEventListener("change", e => {
    const d = e.target.dataset;
    if (d.hw) { hwDone[d.hw] = e.target.checked; store.set("gems27.hw", JSON.stringify(hwDone)); e.target.closest(".hw").classList.toggle("is-ticked", e.target.checked); }
  });
  document.addEventListener("input", e => {
    if (e.target.id === "pal-q") { pal.q = e.target.value; pal.i = 0; palSearch(); }
    else if ("q" in e.target.dataset) { S.q = e.target.value; repaintList(); }
  });
  document.addEventListener("keydown", e => {
    const open = $("#pal.is-open"), typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (open) {
      if (e.key === "Escape") palClose();
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); pal.i = Math.max(0, Math.min(pal.res.length - 1, pal.i + (e.key === "ArrowDown" ? 1 : -1))); $$(".pal__r").forEach((r, i) => r.classList.toggle("is-on", i === pal.i)); const on = $(".pal__r.is-on"); if (on) on.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "Enter" && e.target.id === "pal-q") { e.preventDefault(); palGo(pal.res[pal.i]); }
    } else if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); palOpen(); }
  });
  addEventListener("hashchange", gotoHash);

  render();
  if (QS.get("q")) palOpen(QS.get("q"));
  addEventListener("load", gotoHash, { once: true });
})();
