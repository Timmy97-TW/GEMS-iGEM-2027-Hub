// Contribution board on attributions.html. It renders into <section id="board">, outside hub.js's #main.
// Data: data/board-data.js (const BOARD_DATA, the attribution-tools/CONTRACT.md response, rewritten each week). No requests.
// Levels, areas, roles and seats: assets/board-spec.js.
(() => {
  "use strict";
  const root = document.getElementById("board");
  if (!root) return;
  const SPEC = typeof BOARD_SPEC === "object" && BOARD_SPEC ? BOARD_SPEC : null;
  const RAW = typeof BOARD_DATA !== "undefined" ? BOARD_DATA : null;
  const objs = (r, k) => Array.isArray(r[k]) && r[k].every(x => x && typeof x === "object");
  const good = r => !!r && typeof r === "object" && !Array.isArray(r) && r.ok !== false && Array.isArray(r.weeks) &&
    ["people", "tasks", "entries"].every(k => objs(r, k)) && ["att", "hours"].every(k => r[k] == null || objs(r, k));
  const QS = new URLSearchParams(location.search);

  // ---------- language: the hub's saved choice; ?lang= opens a page in one language without saving it ----------
  const readLang = () => { const q = QS.get("lang"); if (q === "en" || q === "zh") return q; try { return localStorage.getItem("lang") === "en" ? "en" : "zh"; } catch (e) { return "zh"; } };
  const TABS = ["home", "map", "areas", "value", "people", "roles", "week"];
  const S = { lang: readLang(), tab: TABS.includes(QS.get("tab")) ? QS.get("tab") : "home", vt: "all", grp: "all", range: "8", wk: -1, drawer: null, find: "" };
  // ?who=P012, ?task=T0007 or ?area=promo opens that page directly, so a parent can save a link to their child.
  { const k = ["who", "task", "area"].find(x => QS.get(x)); if (k) S.drawer = { [k]: QS.get(k) }; }
  const tx = (zh, en) => (S.lang === "zh" ? zh : en);
  const L = o => (o ? o[S.lang] || o.zh || o.en || "" : "");
  const LK = (o, k) => (o && (o[k + "_" + S.lang] || o[k + "_zh"])) || "";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arr = v => (Array.isArray(v) ? v : []);
  const isDay = v => typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v);
  const md = d => `${+d.slice(5, 7)}/${+d.slice(8, 10)}`;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mon = ym => tx(`${+ym.slice(5, 7)} 月`, MON[+ym.slice(5, 7) - 1] || ym);
  const pct = v => Math.round(v * 100) + "%";
  const med = a => { const v = a.slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : 0; };

  const shell = inner => { root.innerHTML = `<div class="wrap"><div class="bd-hero"><h1 class="h1">${tx("誰做了什麼", "Who did what")}</h1></div>${inner}</div>`; };
  if (!SPEC) { shell(`<p class="bd-off">${tx("貢獻看板的設定檔沒有載入。", "The contribution board's spec file did not load.")}</p>`); return; }
  const unread = () => {
    const off = () => shell(`<p class="bd-off">${tx("看板資料讀不到。", "The board data could not be read.")}</p>`);
    off();
    document.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b && (b.dataset.lang === "zh" || b.dataset.lang === "en")) { S.lang = b.dataset.lang; off(); } });
  };
  if (!good(RAW)) { if (window.console) console.warn("[board] BOARD_DATA is missing or malformed"); unread(); return; }

  // ---------- spec ----------
  const byK = list => Object.fromEntries(arr(list).map(x => [x.k, x]));
  const LV = byK(SPEC.levels), VT = byK(SPEC.values), RO = byK(SPEC.roles), AR = byK(SPEC.areas), G = byK(SPEC.groups), BR = arr(SPEC.bridges);
  const W = Object.fromEntries(arr(SPEC.levels).map(l => [l.k, +l.w || 0]));
  const WMAX = Math.max(1, ...Object.values(W));
  const ORDER = "voqb";
  const LADDER = ["support", "member", "vice", "lead", "pl"];
  const GROUPS = arr(SPEC.groups).filter(g => g.k !== "all");
  const OTHER = { k: "_", zh: "未分組", en: "No group", c: "#8E8E93" };
  const STC = { done: "var(--done)", doing: "var(--doing)", stuck: "var(--stuck)", todo: "var(--todo)" };
  const STN = { done: ["完成", "Done"], doing: ["進行中", "In progress"], stuck: ["卡住", "Stuck"], todo: ["未開始", "Not started"] };
  const ICON = {
    pipeline: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6.2 7.8l4.8 8.4M17.8 7.8 13 16.2"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    resource: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M18 8v6M15 11h6"/>',
    technique: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9"/>',
    ruleout: '<circle cx="12" cy="12" r="8"/><path d="M6.5 6.5l11 11"/>',
    direction: '<path d="M5 19v-7a4 4 0 0 1 4-4h10M15 4l4 4-4 4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  const ico = (k, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ""}</svg>`;

  // ================= data =================
  let D = null;
  function load(r) {
    const people = arr(r.people).filter(p => p && typeof p.id === "string");
    const tasks = arr(r.tasks).filter(t => t && typeof t.id === "string" && t.st !== "dropped");
    const entries = arr(r.entries).filter(e => e && typeof e.p === "string" && isDay(e.wk));
    const wk = new Set(arr(r.weeks).filter(isDay)); entries.forEach(e => wk.add(e.wk));
    D = {
      updated: typeof r.updated === "string" ? r.updated : null,
      weeks: [...wk].sort(), people, tasks, entries,
      P: Object.fromEntries(people.map(p => [p.id, p])), T: Object.fromEntries(tasks.map(t => [t.id, t])),
      att: arr(r.att).filter(a => a && typeof a.p === "string" && isDay(a.wk)),
      hours: arr(r.hours).filter(h => h && typeof h.p === "string" && /^\d{4}-\d\d$/.test(h.month || "")),
      byP: {}, byT: {}, attAt: {}, memo: {}
    };
    D.entries.forEach(e => { (D.byP[e.p] = D.byP[e.p] || []).push(e); if (e.task) (D.byT[e.task] = D.byT[e.task] || []).push(e); });
    D.att.forEach(a => { D.attAt[a.p + "|" + a.wk] = a.s; });
    S.wk = D.weeks.length - 1;
  }
  const memo = (k, f) => (k in D.memo ? D.memo[k] : (D.memo[k] = f()));

  // ---------- levels ----------
  const lvOf = e => (e.lv && LV[e.lv] ? e.lv : null);
  const counted = e => !!lvOf(e) && !e.pend && !e.redo;                        // confirmed rows score; pending and sent-back rows do not
  const contrib = e => e.lv !== "b" && !e.redo;                                // below-the-bar and sent-back rows are not contributions
  const rk = e => { const k = lvOf(e); return k ? ORDER.indexOf(k) : 4; };
  const per = id => D.P[id] || { id, n: null, ini: "·", g: null, missing: true };      // e.g. a task owned by an instructor ID
  const gcol = p => (G[p.g] && G[p.g].c) || OTHER.c;
  const nameOf = p => p.n || (p.missing ? p.id : tx("隊員", "Member"));
  const stOf = t => (STN[t.st] ? t.st : "todo");
  const areaName = k => (AR[k] ? L(AR[k]) : tx("未分區", "No area"));
  const target = a => (S.lang === "zh" ? a.target : a.target_en || a.target) || "";
  const W8 = () => memo("w8", () => new Set(D.weeks.slice(-8)));

  const av = (p, cls = "") => {
    const badge = p.role === "pl" || p.role === "lead" ? `<i>${p.role === "pl" ? "★" : "L"}</i>` : "";
    return `<span class="av ${cls}" style="--gc:${gcol(p)}" title="${esc(nameOf(p))}">${esc(p.ini || "·")}${badge}</span>`;
  };
  const roleBadge = p => (RO[p.role] ? `<span class="rbadge rbadge--${p.role}">${esc(L(RO[p.role]))}</span>` : "");
  const lvTag = e => {
    const k = lvOf(e), l = k && LV[k];
    const t = l ? L(l) + (e.redo ? tx("（退回重做）", " (sent back)") : e.pend ? tx("（還沒核定）", " (not confirmed yet)") : "") : tx("有紀錄", "Recorded");
    return `<i class="lv lv--${k || "n"}${k && e.pend ? " lv--pend" : ""}" title="${esc(t)}">${l ? l.g : "·"}</i>`;
  };
  const flags = e => `${e.redo ? `<span class="chip chip--redo">${tx("退回重做", "Sent back")}</span>` : ""}${e.pend && !e.redo ? `<span class="chip chip--pend">${tx("還沒核定", "Not confirmed yet")}</span>` : ""}`;
  const evLink = e => (typeof e.ev === "string" && /^https?:\/\//i.test(e.ev) ? `<a class="evl" href="${esc(e.ev)}" target="_blank" rel="noopener noreferrer">${ico("link")}${tx("證據", "Evidence")}</a>` : "");
  const vtChip = e => (e.vt && VT[e.vt] ? `<span class="chip chip--v">${ico(e.vt)} ${esc(L(VT[e.vt]))}</span>` : "");
  const ptsOf = es => es.filter(counted).reduce((s, e) => s + W[e.lv], 0);
  const ptsBar = (es, max) => {
    const c = { v: 0, o: 0, q: 0 }; es.filter(counted).forEach(e => { if (e.lv in c) c[e.lv] += W[e.lv]; });
    const tot = c.v + c.o + c.q;
    return `<span class="pts">${["v", "o", "q"].filter(k => c[k]).map(k => `<i class="s-${k}" style="width:${(c[k] / (max || tot || 1)) * 100}%"></i>`).join("")}</span>`;
  };
  const stackOf = (ids, n = 4) => `<span class="stack">${ids.slice(0, n).map(id => av(per(id))).join("")}${ids.length > n ? `<span class="stk-more">+${ids.length - n}</span>` : ""}</span>`;
  // people behind a set of entries, most confirmed credit first, then most entries
  const whoOf = es => { const m = {}; es.forEach(e => { m[e.p] = (m[e.p] || 0) + (counted(e) ? W[e.lv] * 10 + 1 : 1); }); return Object.keys(m).sort((a, b) => m[b] - m[a]); };
  const span = es => { const w = es.map(e => e.wk).sort(); return w.length ? (w[0] === w[w.length - 1] ? md(w[0]) : `${md(w[0])}–${md(w[w.length - 1])}`) : ""; };
  const areaList = ks => ks.map(k => esc(areaName(k))).join(tx("、", ", "));
  const nPeople = n => `${n} ${tx("人", n === 1 ? "person" : "people")}`;
  const ptsU = n => `${n} ${tx("分", n === 1 ? "pt" : "pts")}`;
  const here = s => s === "P" || s === "L";
  const gIdx = p => { const i = GROUPS.findIndex(g => g.k === p.g); return i < 0 ? 99 : i; };
  const byName = (a, b) => gIdx(a) - gIdx(b) || (a.n ? 0 : 1) - (b.n ? 0 : 1) || String(a.n || a.id).localeCompare(String(b.n || b.id));
  // One person on one Saturday: the highest entry, or why there is none (present but not written, excused, absent, no record).
  const wkMark = (pid, w) => memo(`m:${pid}|${w}`, () => {
    const es = (D.byP[pid] || []).filter(e => e.wk === w);
    if (es.length) { const top = es.slice().sort((x, y) => rk(x) - rk(y))[0]; return { k: lvOf(top) || "n", pend: es.some(e => lvOf(e) && e.pend), n: es.length }; }
    const a = D.attAt[pid + "|" + w];
    return { k: a === "E" || a === "A" ? a : here(a) ? "miss" : "none", n: 0 };
  });
  const MARK = { E: ["假", "E"], A: ["缺", "A"] };
  const markGlyph = m => (LV[m.k] ? LV[m.k].g : m.k === "n" ? "·" : MARK[m.k] ? tx(...MARK[m.k]) : "");
  const markName = m => (LV[m.k] ? L(LV[m.k]) + (m.pend ? tx("（還沒核定）", " (not confirmed yet)") : "") : { n: tx("有紀錄", "Recorded"), miss: tx("出席，沒寫", "Present, not written"), E: tx("請假", "Excused"), A: tx("缺席", "Absent"), none: tx("沒有點名紀錄", "No roll call") }[m.k] || "");
  // Rank by confirmed points, season and last 8 Saturdays. Ties share a rank.
  const ranks = () => memo("ranks", () => {
    const w8 = W8(), mk = f => { const xs = D.people.map(p => [p.id, ptsOf((D.byP[p.id] || []).filter(f))]), v = xs.map(x => x[1]).sort((a, b) => b - a);
      return { by: Object.fromEntries(xs.map(([id, n]) => [id, { n, r: v.indexOf(n) + 1 }])), sorted: v }; };
    return { all: mk(() => true), w8: mk(e => w8.has(e.wk)) };
  });

  const stats = pid => memo("s:" + pid, () => {
    const es = D.byP[pid] || [], ok = es.filter(counted), w8 = W8();
    const cnt = list => { const c = { v: 0, o: 0, q: 0, b: 0 }; list.forEach(e => { if (e.lv in c) c[e.lv]++; }); return c; };
    const a = D.att.filter(x => x.p === pid).sort((x, y) => (x.wk < y.wk ? -1 : 1));
    const here = x => x.s === "P" || x.s === "L", a8 = a.slice(-8), h8 = a8.filter(here), wrote = new Set(es.map(e => e.wk));
    const hs = D.hours.filter(h => h.p === pid).sort((x, y) => (x.month < y.month ? -1 : 1));
    return { es, c: cnt(ok), c8: cnt(ok.filter(e => w8.has(e.wk))), a, hs,
      att: a.length ? a.filter(here).length / a.length : null, att8: a8.length ? h8.length / a8.length : null,
      log8: h8.length ? h8.filter(x => wrote.has(x.wk)).length / h8.length : null,
      E: a.filter(x => x.s === "E").length, A: a.filter(x => x.s === "A").length, Lt: a.filter(x => x.s === "L").length,
      on: hs.reduce((s, h) => s + (+h.on || 0), 0), off: hs.reduce((s, h) => s + (+h.off || 0), 0) };
  });
  // The team reference: median and top of confirmed ★ and ◆ over the last 8 Saturdays. No fixed thresholds.
  const teamRef = () => memo("ref", () => {
    const xs = D.people.map(p => stats(p.id).c8);
    return { mv: med(xs.map(c => c.v)), mo: med(xs.map(c => c.o)), xv: Math.max(1, ...xs.map(c => c.v)), xo: Math.max(1, ...xs.map(c => c.o)) };
  });
  // Attendance is flagged only against the team: below the lowest quarter of those with attendance records.
  const attLow = v => v != null && memo("q1", () => { const xs = D.people.map(p => stats(p.id).att).filter(x => x != null).sort((a, b) => a - b); return xs.length > 3 ? xs[Math.floor(xs.length / 4)] : -1; }) > v;
  // Bridge seats: per seat, the person whose entries cover the most of its areas (two at least).
  // One seat per person, filled in spec order; ties go to more confirmed credit in those areas.
  const bridgeSeats = () => memo("seats", () => {
    const es = D.entries.filter(contrib), cov = {}; es.forEach(e => (cov[e.p] = cov[e.p] || new Set()).add(e.area));
    const taken = new Set(), out = {};
    BR.forEach(b => {
      const best = D.people.filter(p => !taken.has(p.id)).map(p => ({ p, n: b.areas.filter(a => cov[p.id] && cov[p.id].has(a)).length,
        w: es.filter(e => e.p === p.id && b.areas.includes(e.area)).reduce((t, e) => t + (counted(e) ? W[e.lv] : 1), 0) }))
        .filter(x => x.n >= 2).sort((x, y) => y.n - x.n || y.w - x.w)[0];
      out[b.k] = best || null; if (best) taken.add(best.p.id);
    });
    return out;
  });
  const coverage = pid => new Set((D.byP[pid] || []).filter(contrib).map(e => e.area));
  const seatGap = (pid, b) => { const have = coverage(pid); return { b, have: b.areas.filter(a => have.has(a)), miss: b.areas.filter(a => !have.has(a)) }; };
  // The seat a person could grow into: the bridge whose areas they already cover most, and what is missing.
  const growSeat = (pid, skip) => { const have = coverage(pid);
    return BR.filter(b => b.k !== skip).map(b => ({ b, have: b.areas.filter(a => have.has(a)), miss: b.areas.filter(a => !have.has(a)) }))
      .filter(x => x.miss.length && x.have.length).sort((x, y) => y.have.length - x.have.length || x.miss.length - y.miss.length)[0]; };

  // ================= views =================
  const TABN = [["home", "總覽", "Overview"], ["map", "任務", "Tasks"], ["areas", "工作區", "Areas"], ["value", "創造價值", "Value"], ["people", "隊員", "People"], ["roles", "角色", "Roles"], ["week", "每週", "Weekly"]];

  // overview: one screen for parents, students and teachers
  const vHome = () => {
    const last = D.weeks[D.weeks.length - 1];
    if (!last) return `<p class="bnote">${tx("還沒有任何一週的紀錄。", "No weeks recorded yet.")}</p>`;
    const li = D.weeks.length - 1, N = D.people.length, mk = p => wkMark(p.id, last);
    const attHere = D.att.filter(a => a.wk === last && here(a.s)).length, attAll = D.att.filter(a => a.wk === last).length;
    const lastEs = D.entries.filter(e => e.wk === last), wrote = new Set(lastEs.map(e => e.p)).size;
    const nums = [
      ...(attAll ? [[tx("出席", "Present"), `${attHere}<em> / ${attAll}</em>`]] : []),
      [tx("寫了紀錄", "Wrote it down"), `${wrote}<em> / ${N}</em>`],
      [tx("★ 和 ◆", "★ and ◆"), `${lastEs.filter(e => e.lv === "v" && !e.redo).length}<em> ★ </em>${lastEs.filter(e => e.lv === "o" && !e.redo).length}<em> ◆</em>`],
      [tx("等組長核定", "Waiting for the lead"), `${lastEs.filter(e => e.pend && !e.redo).length}<em> ${tx("筆", "entries")}</em>`]];
    const groups = [...GROUPS, OTHER].map(g => ({ g, ps: D.people.filter(p => (g.k === "_" ? !G[p.g] || p.g === "all" : p.g === g.k)).sort(byName) })).filter(x => x.ps.length);
    const chip = p => { const m = mk(p);
      return `<button class="rc" data-who="${esc(p.id)}" title="${esc(nameOf(p))} · ${esc(markName(m))}"><i class="c c--${m.k}${m.pend ? " c--pend" : ""}">${markGlyph(m)}</i><span>${esc(nameOf(p))}</span>${p.role === "pl" || p.role === "lead" ? `<small>${esc(L(RO[p.role]))}</small>` : ""}</button>`; };
    const marksUsed = new Set(D.people.map(p => mk(p).k));
    const legend = ["v", "o", "q", "b", "miss", "E", "A"].filter(k => marksUsed.has(k)).map(k => `<span><i class="c c--${k}">${markGlyph({ k })}</i>${esc(markName({ k }))}</span>`).join("")
      + (D.people.some(p => mk(p).pend) ? `<span><i class="c c--q c--pend">${LV.q ? LV.q.g : ""}</i>${tx("淡色：還沒核定", "Faded: not confirmed yet")}</span>` : "");

    const aud = [
      [tx("家長", "Parents"), tx("在名單裡點孩子的名字，或用上面的搜尋。個人頁有出席、時數和每週做了什麼，也可以複製連結存起來。", "Tap your child's name in the list, or search above. Their page shows attendance, hours and each week's work, and has a link you can save."), ""],
      [tx("學生", "Students"), tx("「隊員」看你和全隊的距離；「創造價值」看什麼算 ★。", "People shows where you stand against the team. Value shows what counts as ★."), `<button data-tab="people">${tx("隊員", "People")}</button><button data-tab="value">${tx("創造價值", "Value")}</button>`],
      [tx("老師與組長", "Teachers and leads"), tx("「要跟進」列出沒寫、等核定和常不在的人；「每週」看每個週六的全貌。", "Follow up lists who has not written, what waits for a lead and who is often away. Weekly shows every Saturday."), `<a href="#bd-follow">${tx("要跟進", "Follow up")}</a><button data-tab="week">${tx("每週", "Weekly")}</button>`]];

    return `<div class="aud">${aud.map(([h, p, go]) => `<div><h4>${h}</h4><p>${p}</p>${go ? `<span class="aud__go">${go}</span>` : ""}</div>`).join("")}</div>
      <div class="key">${"voqb".split("").filter(k => LV[k]).map(k => `<div class="key__i key--${k}"><i class="lv lv--${k}">${LV[k].g}</i><div><b>${esc(L(LV[k]))}</b><p>${esc(LK(LV[k], "def"))}</p></div><strong>${W[k]}<small>${tx("分", W[k] === 1 ? "pt" : "pts")}</small></strong></div>`).join("")}</div>
      <p class="keyn">${tx("只算已核定的紀錄。◆ 和 ● 由組長在週日核定；★ 由組長提名、老師確認；○ 只有老師記。", "Only confirmed entries count. Leads confirm ◆ and ● on Sunday; a ★ is nominated by the lead and confirmed by an instructor; only instructors record ○.")}</p>

      <div class="panel lastsat">
        <div class="ptitle"><span>${tx(`最近一個週六 · ${md(last)}`, `Last Saturday · ${md(last)}`)}</span><button class="lnk" data-gowk="${li}">${tx("這一週的紀錄 →", "That week's entries →")}</button></div>
        <div class="nums">${nums.map(([l, v]) => `<div><small>${l}</small><strong>${v}</strong></div>`).join("")}</div>
        <div class="roster">${groups.map(({ g, ps }) => `<div class="rg"><h5 style="--gc:${g.c}"><i></i>${esc(L(g))}<small>${ps.length}</small></h5><div class="rg__l">${ps.map(chip).join("")}</div></div>`).join("")}</div>
        <div class="gleg">${legend}</div>
      </div>

      <div class="duo">
        <div class="panel"><div class="ptitle"><span>${tx("整季，每個週六", "The season, Saturday by Saturday")}</span><span>${tx("點一欄看那一週", "Tap a column for that week")}</span></div>${seasonChart()}</div>
        ${follow(last)}
      </div>
      ${faq()}`;
  };
  const seasonChart = () => {
    const ws = D.weeks, N = Math.max(1, D.people.length), cw = 12, gap = 3, H = 150, t = 6, b = 22, Wd = ws.length * (cw + gap);
    const ORD = ["v", "o", "q", "b", "n", "miss", "E", "A"];
    const cols = ws.map((w, i) => { const c = {}; D.people.forEach(p => { const k = wkMark(p.id, w).k; c[k] = (c[k] || 0) + 1; });
      let y = t + H; const x = i * (cw + gap);
      const rects = ORD.filter(k => c[k]).map(k => { const h = (c[k] / N) * H; y -= h; return `<rect class="f-${k}" x="${x}" y="${y.toFixed(1)}" width="${cw}" height="${Math.max(0, h - 0.6).toFixed(1)}" rx="2"/>`; }).join("");
      const tip = `${md(w)} · ${ORD.filter(k => c[k]).map(k => `${markName({ k })} ${c[k]}`).join("、")}`;
      return `<g class="col" data-gowk="${i}"><title>${esc(tip)}</title><rect class="hit" x="${x - 1}" y="${t}" width="${cw + gap}" height="${H}"/>${rects}</g>`; }).join("");
    let pm = ""; const labels = ws.map((w, i) => { const m = w.slice(0, 7); if (m === pm) return ""; pm = m; return `<text x="${i * (cw + gap)}" y="${t + H + 16}" font-size="10.5" fill="#8E8E93">${esc(mon(m))}</text>`; }).join("");
    return `<div class="bd-sc"><svg viewBox="0 0 ${Wd} ${t + H + b}" role="img" aria-label="${tx("每個週六全隊的等級分布", "The team's levels on each Saturday")}">${cols}${labels}</svg></div>
      <div class="gleg">${ORD.filter(k => k !== "n").map(k => `<span><i class="c c--${k}">${markGlyph({ k })}</i>${esc(markName({ k }))}</span>`).join("")}</div>`;
  };
  // What a teacher or lead should act on. Every list is clickable; an empty list is left out.
  const follow = last => {
    const w4 = new Set(D.weeks.slice(-4)), uniq = es => [...new Set(es.map(e => e.p))].map(per);
    const missing = D.people.filter(p => wkMark(p.id, last).k === "miss").sort(byName);
    const old = D.entries.filter(e => e.pend && !e.redo && lvOf(e) && e.wk < last), byG = {};
    old.forEach(e => { const g = per(e.p).g || "_"; byG[g] = (byG[g] || 0) + 1; });
    const leadOf = g => D.people.find(p => p.g === g && p.role === "lead");
    const away = D.people.filter(p => D.att.filter(a => a.p === p.id && w4.has(a.wk) && (a.s === "A" || a.s === "E")).length >= 2).sort(byName);
    const redo = uniq(D.entries.filter(e => e.redo && w4.has(e.wk))), below = uniq(D.entries.filter(e => e.lv === "b" && !e.redo && w4.has(e.wk)));
    const stuck = D.tasks.filter(t => stOf(t) === "stuck");
    const pills = ps => ps.map(p => `<button class="pill" data-who="${esc(p.id)}">${esc(nameOf(p))}</button>`).join("");
    const rows = [
      [tx(`${md(last)} 出席但沒寫`, `Present on ${md(last)}, not written`), missing.length, pills(missing)],
      [tx("等組長核定超過一週", "Waiting for a lead for over a week"), old.length, Object.keys(byG).sort((a, b) => byG[b] - byG[a]).map(g => { const l = leadOf(g), gn = G[g] ? L(G[g]) : L(OTHER);
        return l ? `<button class="pill" data-who="${esc(l.id)}">${esc(gn)} · ${byG[g]} ${tx("筆", "")}<small>${tx("組長", "lead")} ${esc(nameOf(l))}</small></button>` : `<span class="pill">${esc(gn)} · ${byG[g]}</span>`; }).join("")],
      [tx("近 4 個週六有 2 次沒到", "Away 2 of the last 4 Saturdays"), away.length, pills(away)],
      [tx("近 4 週被退回重做", "Sent back in the last 4 weeks"), redo.length, pills(redo)],
      [tx("近 4 週有 ○", "○ in the last 4 weeks"), below.length, pills(below)],
      [tx("卡住的任務", "Stuck tasks"), stuck.length, stuck.map(t => `<button class="pill" data-task="${esc(t.id)}">${esc(t.t)}</button>`).join("")]].filter(r => r[1]);
    return `<div class="panel" id="bd-follow"><div class="ptitle"><span>${tx("要跟進", "Follow up")}</span><span>${tx("給老師和組長", "For teachers and leads")}</span></div>
      ${rows.length ? `<div class="fu">${rows.map(([h, n, body]) => `<div><b>${h}<em>${n}</em></b><div class="fu__l">${body}</div></div>`).join("")}</div>` : `<p class="bnote">${tx("目前沒有要跟進的事。", "Nothing to follow up right now.")}</p>`}</div>`;
  };
  const faq = () => {
    const qs = [
      [tx("等級誰決定？", "Who decides the level?"), tx("學生先自評。組長在週日核定 ◆ 和 ●；★ 由組長提名、老師確認；○ 只有老師記，寫在 Ops Hub。", "Students rate themselves first. The lead confirms ◆ and ● on Sunday; a ★ is nominated by the lead and confirmed by an instructor; only instructors record ○, in the Ops Hub.")],
      [tx("分數怎麼算？", "How are points counted?"), tx(`★ ${W.v} 分、◆ ${W.o} 分、● ${W.q} 分、○ ${W.b} 分，每個工作區都一樣。等核定和退回重做的紀錄不算分。`, `★ ${W.v}, ◆ ${W.o}, ● ${W.q} and ○ ${W.b} points, in every area. Entries waiting for a lead or sent back score nothing.`)],
      [W.v === W.o ? tx("★ 和 ◆ 分數一樣，差在哪？", "★ and ◆ score the same. What is the difference?") : tx("★ 和 ◆ 差在哪？", "What is the difference between ★ and ◆?"), tx("◆ 是把一件事扛到底、把問題解掉。★ 是讓團隊多了一樣原本沒有、別人會接著用的東西，例如新流程、工具、資源或技術，或排除一個做不到的方案。★ 會放在「創造價值」牆上。", "◆ is carrying a piece of work to the end or solving a problem. ★ gives the team something it did not have and others build on: a pipeline, a tool, a resource, a technique, or a dead end ruled out. Every ★ goes on the Value wall.")],
      [tx("出席率怎麼算？", "How is attendance worked out?"), tx("出席和遲到算有到，請假和缺席算沒到。分母是有點名紀錄的週六。", "Present and late count as there; excused and absent do not. It is out of the Saturdays with a roll call.")],
      [tx("時數從哪裡來？", "Where do the hours come from?"), tx("老師每個月在 Ops Hub 記的實體和線上時數。", "Instructors log on-site and online hours each month in the Ops Hub.")],
      [tx("多久更新一次？", "How often does this update?"), tx("每週日晚上一次。週六寫的紀錄，要等組長核定才算分。", "Once a week, on Sunday night. Saturday's entries score once a lead confirms them.")],
      [tx("對紀錄有疑問，找誰？", "A question about an entry?"), tx("先找組長，再找老師。", "Ask the group lead first, then an instructor.")],
      [tx("誰看得到這一頁？", "Who can see this page?"), tx("任何人。這是公開網站，舊的資料也會留在 GitHub 的歷史紀錄裡。", "Anyone. This is a public site, and older data stays in its GitHub history.")]];
    return `<div class="faq"><h4>${tx("常見問題", "Questions")}</h4>${qs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
  };

  // project: every task, who owns it and who worked on it
  const vMap = () => {
    const by = k => D.tasks.filter(t => stOf(t) === k).length;
    const lanes = [G.all || { k: "all", zh: "全隊", en: "Whole team", c: "#1D1D1F" }, ...GROUPS, OTHER];
    const laneOf = t => (t.g === "all" || G[t.g] ? t.g : "_");
    if (!D.tasks.length) return `<p class="bnote">${tx("還沒有任務。", "No tasks yet.")}</p>`;
    return `<div class="vh"><div><h3>${tx("全部任務", "All tasks")}</h3><p>${tx("左下是負責人，右下是參與的人。點卡片看每個人做了什麼。", "Owner bottom left, the people who worked on it bottom right. Open a card to see who did what.")}</p></div>
      <div class="status">${["done", "doing", "stuck", "todo"].map(k => `<span><i style="background:${STC[k]}"></i>${tx(...STN[k])} <b>${by(k)}</b></span>`).join("")}</div></div>
      <div class="prog">${["done", "doing", "stuck", "todo"].map(k => `<i style="flex:${by(k)};background:${STC[k]}"></i>`).join("")}</div>
      ${lanes.map(g => { const ts = D.tasks.filter(t => laneOf(t) === g.k); if (!ts.length) return "";
        const n = g.k === "all" ? D.people.length : g.k === "_" ? 0 : D.people.filter(p => p.g === g.k).length;
        return `<div class="lane"><div class="lane__h" style="--gc:${g.c}"><b><i></i>${esc(L(g))}</b><small>${ts.length} ${tx("個任務", ts.length === 1 ? "task" : "tasks")}${n ? ` · ${nPeople(n)}` : ""}</small></div>
          <div class="cards">${ts.map(card).join("")}</div></div>`; }).join("")}`;
  };
  const card = t => {
    const es = D.byT[t.id] || [], st = stOf(t), c = {}; es.forEach(e => { c[e.p] = (c[e.p] || 0) + 1; });
    const who = Object.keys(c).sort((a, b) => c[b] - c[a]);
    return `<button class="tc tc--${st}" style="--sc:${STC[st]}" data-task="${esc(t.id)}">
      <span class="tc__top"><code>${esc(t.id)}</code><span class="tc__st">${tx(...STN[st])}</span></span>
      <span><b class="tc__t">${esc(t.t)}</b><small class="tc__a">${esc(areaName(t.area))}</small></span>
      ${es.some(counted) ? ptsBar(es) : ""}
      <span class="tc__ft"><span>${t.owner ? av(per(t.owner)) : ""}</span>${who.length ? stackOf(who) : `<span class="tc__d">${tx("還沒有紀錄", "No entries yet")}</span>`}</span>
    </button>`;
  };

  // areas: where the work lands, and who did each part
  const vAreas = () => {
    const sum = a => { const es = D.entries.filter(e => e.area === a.k && contrib(e)); return { es, pts: ptsOf(es), who: whoOf(es) }; };
    const num = s => `${s.pts}<small>${tx("分", " pts")}</small>`;
    const del = arr(SPEC.areas).filter(a => a.kind === "deliverable"), proj = arr(SPEC.areas).filter(a => a.kind !== "deliverable");
    return `<div class="vh"><div><h3>${tx("工作區", "Areas")}</h3><p>${tx(`上面 ${del.length} 區最後會放上 wiki 或做成影片，下面 ${proj.length} 區是餵給它們的工作。點一區看每個部分是誰做的。`, `The top ${del.length} end up on the wiki or in a video; the ${proj.length} below are the work that feeds them. Open an area to see who did each part.`)}</p></div></div>
      <div class="ptitle"><span>${tx("成品", "Deliverables")} · ${del.length}</span><span>${tx("分數只算已核定的紀錄", "Points count confirmed entries only")}</span></div>
      <div class="areas">${del.map(a => { const s = sum(a);
        return `<button class="at" data-area="${esc(a.k)}"><span class="at__t">${tx("放在 ", "Lands on ")}${esc(target(a))}</span><b>${esc(L(a))}</b>
          <span class="at__n"><strong>${num(s)}</strong><span>${nPeople(s.who.length)}</span></span>
          ${s.who.length ? stackOf(s.who, 6) : `<span class="at__0">${tx("還沒有紀錄", "No entries yet")}</span>`}
          ${a.under ? `<span class="at__u"><span class="chip chip--u">${tx("常被低估", "Often under-credited")}</span><small>${esc(LK(a, "why"))}</small></span>` : ""}</button>`; }).join("")}</div>
      <div class="panel" style="margin-top:18px"><div class="ptitle"><span>${tx("專案工作", "Project work")} · ${proj.length}</span></div>
        <div class="alist">${proj.map(a => { const s = sum(a);
          return `<button class="arow" data-area="${esc(a.k)}"><span><b>${esc(L(a))}</b><small>${esc(target(a))}</small></span>${s.who.length ? stackOf(s.who) : `<span class="stack"></span>`}<span>${nPeople(s.who.length)}</span><span>${s.es.length ? `${s.pts} ${tx("分", "pts")}` : "—"}</span></button>`; }).join("")}</div></div>`;
  };

  // value: confirmed ★ entries by kind
  const vValue = () => {
    const ok = D.entries.filter(counted), stars = ok.filter(e => e.lv === "v");
    const list = stars.filter(e => S.vt === "all" || e.vt === S.vt).sort((a, b) => (a.wk < b.wk ? 1 : a.wk > b.wk ? -1 : 0));
    return `<div class="vh"><div><h3>${tx("創造價值", "Creating value")}</h3><p>${W.v === W.o ? tx("★ 和 ◆ 分數一樣。★ 多了一個條件：團隊因此多了一樣原本沒有、別人會接著用的東西。", "★ and ◆ score the same. A ★ asks for one more thing: the team now has something it did not have, and others build on it.") : tx("每個工作區都一樣。只算已核定的紀錄。", "The same in every area. Only confirmed entries count.")}</p></div></div>
      <div class="worth">${["v", "o", "q"].filter(k => LV[k]).map(k => `<div class="w-${k}"><div class="worth__h"><b><i class="lv lv--${k}">${LV[k].g}</i>${esc(L(LV[k]))}</b><strong>×${W[k]}<small>${tx("分", "pts")}</small></strong></div>
        <div class="blocks">${Array.from({ length: WMAX }, (_, i) => `<i style="background:${i < W[k] ? `var(--${k})` : "rgba(0,0,0,.05)"}"></i>`).join("")}</div>
        <p>${esc(LK(LV[k], "def"))} <b>${ok.filter(e => e.lv === k).length}</b> ${tx("筆", "so far")}</p></div>`).join("")}</div>
      <div class="vtypes">${arr(SPEC.values).map(v => `<button class="vt" data-vt="${esc(v.k)}" aria-pressed="${S.vt === v.k}"><span class="vt__i">${ico(v.k, "")}</span><b>${esc(L(v))}</b><strong>${stars.filter(e => e.vt === v.k).length}</strong><small>${esc(LK(v, "ex"))}</small></button>`).join("")}</div>
      <div class="ptitle"><span>${S.vt === "all" || !VT[S.vt] ? tx("本季所有已核定的 ★", "Every confirmed ★ this season") : esc(L(VT[S.vt]))} · ${list.length}</span>${S.vt !== "all" ? `<button data-vt="all" class="chip">${tx("看全部", "Show all")}</button>` : ""}</div>
      <div class="wall">${list.map(e => { const p = per(e.p), t = D.T[e.task];
        return `<article class="vc">${vtChip(e)}<p>${esc(e.what)}</p>
          <div class="vc__ft">${av(p)}<button data-who="${esc(p.id)}">${esc(nameOf(p))}</button>${evLink(e)}<small>${e.task ? esc(e.task) + " · " : ""}${md(e.wk)}</small></div></article>`; }).join("") || `<p class="bnote">${tx("這一類還沒有。", "None of this kind yet.")}</p>`}</div>`;
  };

  // people: where everyone stands against the team
  const vPeople = () => {
    const groups = GROUPS.filter(g => D.people.some(p => p.g === g.k));
    if (!groups.some(g => g.k === S.grp)) S.grp = "all";
    const ppl = D.people.filter(p => S.grp === "all" || p.g === S.grp), w8 = W8();
    const es = pid => (D.byP[pid] || []).filter(e => counted(e) && (S.range === "all" || w8.has(e.wk)));
    const score = pid => es(pid).reduce((s, e) => s + W[e.lv], 0);
    const ranked = [...ppl].sort((a, b) => score(b.id) - score(a.id)), max = Math.max(1, ...ranked.map(p => score(p.id)));
    return `<div class="vh"><div><h3>${tx("每個人的位置", "Where each person stands")}</h3><p>${tx("越往右上，近 8 個週六已核定的 ★ 和 ◆ 越多。虛線是全隊中間值。", "Further up and right means more confirmed ★ and ◆ over the last 8 Saturdays. Dashed lines are the team median.")}</p></div>
      ${groups.length > 1 ? `<div class="seg">${[["all", "全部", "All"], ...groups.map(g => [g.k, g.zh, g.en, g.c])].map(([k, z, e, c]) => `<button data-grp="${esc(k)}" aria-pressed="${S.grp === k}"${c ? ` style="--c:${c}"` : ""}>${c ? "<i></i>" : ""}${esc(tx(z, e))}</button>`).join("")}</div>` : ""}</div>
      <div class="ppl">
        <div><div class="panel ladder"><div class="ptitle"><span>${tx("近 8 個週六", "Last 8 Saturdays")}</span><span class="leg">${groups.map(g => `<span><i class="sw" style="background:${g.c};border-radius:50%"></i>${esc(L(g))}</span>`).join("")}</span></div>${scatter(ppl)}</div>${closeCard(ppl)}</div>
        <div class="panel"><div class="ptitle"><span>${tx("分數", "Points")}</span><span class="seg">${[["8", "近 8 週", "8 weeks"], ["all", "整季", "Season"]].map(([k, z, e]) => `<button data-range="${k}" aria-pressed="${S.range === k}">${tx(z, e)}</button>`).join("")}</span></div>
          <div class="rank">${ranked.map((p, i) => `<button data-who="${esc(p.id)}"><span class="n">${i + 1}</span>${av(p)}<span class="nm">${esc(nameOf(p))}</span>${ptsBar(es(p.id), max)}<span class="p">${score(p.id)}</span></button>`).join("") || `<p class="bnote">${tx("沒有人。", "Nobody here.")}</p>`}</div>
          <div class="leg" style="margin-top:14px">${["v", "o", "q"].filter(k => LV[k]).map(k => `<span><i class="sw" style="background:var(--${k})"></i>${esc(L(LV[k]))} ×${W[k]}</span>`).join("")}</div></div>
      </div>`;
  };
  const closeCard = ppl => {
    const ref = teamRef();
    const sc = c => c.v * (W.v || 0) + c.o * (W.o || 0);
    const top = ppl.map(p => ({ p, c: stats(p.id).c8 })).filter(x => x.c.v + x.c.o).sort((a, b) => sc(b.c) - sc(a.c)).slice(0, 8);
    return `<div class="panel"><div class="ptitle"><span>${tx("近 8 週 ★◆ 最多", "Most ★◆ in 8 weeks")}</span><span>${tx(`中間值 ★ ${ref.mv} · ◆ ${ref.mo}`, `Median ★ ${ref.mv} · ◆ ${ref.mo}`)}</span></div>
      <div class="rank">${top.map(({ p, c }) => `<button class="top8" data-who="${esc(p.id)}">${av(p)}<span class="nm">${esc(nameOf(p))}</span>${roleBadge(p)}<span class="sv">★ ${c.v} · ◆ ${c.o}</span></button>`).join("") || `<p class="bnote">${tx("近 8 週還沒有已核定的 ★ 或 ◆。", "No confirmed ★ or ◆ in the last 8 weeks.")}</p>`}</div></div>`;
  };
  const scatter = ppl => {
    const W_ = 560, H_ = 400, m = { l: 44, r: 16, t: 16, b: 44 };
    const cs = D.people.map(p => stats(p.id).c8), xm = Math.max(4, ...cs.map(c => c.o)), ym = Math.max(3, ...cs.map(c => c.v));
    const X = v => m.l + (Math.min(v, xm) / xm) * (W_ - m.l - m.r), Y = v => H_ - m.b - (Math.min(v, ym) / ym) * (H_ - m.t - m.b);
    const ref = teamRef(), step = n => Math.max(1, Math.ceil(n / 8));
    const grid = Array.from({ length: Math.floor(xm / step(xm)) + 1 }, (_, i) => i * step(xm)).map(i => `<text x="${X(i)}" y="${H_ - m.b + 18}" text-anchor="middle" font-size="11" fill="#8E8E93">${i}</text>`).join("") +
      Array.from({ length: Math.floor(ym / step(ym)) + 1 }, (_, i) => i * step(ym)).map(i => `<text x="${m.l - 12}" y="${Y(i) + 4}" text-anchor="end" font-size="11" fill="#8E8E93">${i}</text><line x1="${m.l}" x2="${W_ - m.r}" y1="${Y(i)}" y2="${Y(i)}" stroke="rgba(0,0,0,.06)"/>`).join("");
    const zones = `<line x1="${X(ref.mo)}" x2="${X(ref.mo)}" y1="${m.t}" y2="${H_ - m.b}" stroke="#8E8E93" stroke-dasharray="4 4"/><line x1="${m.l}" x2="${W_ - m.r}" y1="${Y(ref.mv)}" y2="${Y(ref.mv)}" stroke="#8E8E93" stroke-dasharray="4 4"/>
      <text class="zone-l" x="${X(ref.mo) + 6}" y="${m.t + 12}" fill="#636366">${tx("全隊中間值", "Team median")}</text>`;
    const pos = {}, dots = ppl.map(p => { const c = stats(p.id).c8, key = `${c.o},${c.v}`, k = (pos[key] = (pos[key] || 0) + 1);
      const ang = k * 2.4, rad = k > 1 ? 11 * Math.sqrt(k - 1) : 0, x = X(c.o) + Math.cos(ang) * rad, y = Y(c.v) + Math.sin(ang) * rad * 0.8;
      return `<g class="dot" data-who="${esc(p.id)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><title>${esc(nameOf(p))} · ★${c.v} ◆${c.o}</title>
        <circle class="dc" r="12" fill="${gcol(p)}" stroke="#fff" stroke-width="2"/><text text-anchor="middle" dy="3.5" font-size="8.5" font-weight="700" fill="#fff">${esc(p.ini || "")}</text></g>`; }).join("");
    return `<svg viewBox="0 0 ${W_} ${H_}" role="img" aria-label="${tx("每人近 8 週的 ★ 與 ◆", "Each member's ★ and ◆ over 8 weeks")}">${grid}${zones}
      <text x="${(W_ + m.l) / 2}" y="${H_ - 6}" text-anchor="middle" font-size="12" fill="#636366">◆ ${esc(L(LV.o))} →</text>
      <text transform="translate(12,${(H_ - m.b + m.t) / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="#636366">★ ${esc(L(LV.v))} →</text>${dots}</svg>`;
  };

  // roles and bridge seats
  const vRoles = () => {
    const lift = { support: 0, member: 28, vice: 56, lead: 84, pl: 112 };
    return `<div class="vh"><div><h3>${tx("角色", "Roles")}</h3><p>${tx("沒有固定門檻。PI 和老師看近幾個月的 ★ 與 ◆、負責過的任務、出席和紀錄來決定。", "There are no fixed thresholds. The PI and instructors decide from recent ★ and ◆, the tasks a student owned, attendance and records.")}</p></div></div>
      <div class="stairs">${LADDER.filter(k => RO[k]).map(k => { const r = RO[k], hs = D.people.filter(p => p.role === k);
        return `<div class="role r-${k}" style="margin-top:${112 - lift[k]}px"><div class="role__h"><small>${esc(LK(r, "n"))}</small><b>${esc(L(r))}</b><span>${esc(S.lang === "zh" ? r.en : r.zh)}</span></div>
          <div class="role__b"><ul>${arr(r["own_" + S.lang] || r.own_zh).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <div class="holders">${hs.map(p => `<button data-who="${esc(p.id)}" aria-label="${esc(nameOf(p))}">${av(p)}</button>`).join("")}</div>
            <div class="role__by">${esc(LK(r, "by"))}</div></div></div>`; }).join("")}</div>
      <div class="climb"><span>${tx("投入較少", "Less time")}</span><span>${tx("帶整個專案", "Leads the project")}</span></div>
      ${vBridges()}`;
  };
  const vBridges = () => {
    const seats = bridgeSeats();
    return `<div class="vh" style="margin-top:48px"><div><h3>${tx("跨區座位", "Bridge seats")}</h3><p>${tx("一個座位是一位把工作從一區帶到下一區的學生。座位是掛在角色上的標記，不是另一個階級。目前的人選依紀錄推算。", "A seat is one student who carries work from one area into the next. It is a badge on a role, not a rank. The current holder is worked out from the entries.")}</p></div></div>
      <div class="bridges">${BR.map(b => { const s = seats[b.k];
        return `<div class="br"><div class="br__h"><b>${esc(L(b))}</b><small>${esc(S.lang === "zh" ? b.en : b.zh)}</small></div>
          <div class="chain">${b.areas.map((k, i) => `<em>${i ? `<i aria-hidden="true">→</i>` : ""}<span>${esc(areaName(k))}</span></em>`).join("")}</div>
          <p>${esc(LK(b, "own"))}</p>
          <div><h5>${tx("先學會", "Learn first")}</h5><ul>${arr(b["learn_" + S.lang] || b.learn_zh).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
          ${s ? `<div class="br__who">${av(s.p)}<button data-who="${esc(s.p.id)}">${esc(nameOf(s.p))}</button><small>${s.n} / ${b.areas.length} ${tx("區", "areas")}</small></div>`
            : `<div class="br__who br__who--open"><span>${tx("空缺", "Open")}</span><small>${tx("還沒有人在兩區以上有紀錄", "Nobody has entries in two of these areas")}</small></div>`}</div>`; }).join("")}</div>`;
  };

  // weekly grid and feed
  const vWeek = () => {
    if (!D.weeks.length) return `<p class="bnote">${tx("還沒有任何一週的紀錄。", "No weeks recorded yet.")}</p>`;
    if (S.wk < 0 || S.wk >= D.weeks.length) S.wk = D.weeks.length - 1;
    const wk = D.weeks[S.wk], gi = p => { const i = GROUPS.findIndex(g => g.k === p.g); return i < 0 ? 99 : i; };
    const ppl = [...D.people].sort((a, b) => gi(a) - gi(b) || (a.n ? 0 : 1) - (b.n ? 0 : 1) || String(a.n || a.id).localeCompare(String(b.n || b.id)));
    const attCol = D.att.length > 0, hrsCol = D.hours.length > 0;
    const mark = s => (s === "E" ? tx("假", "E") : s === "A" ? tx("缺", "A") : "");
    const cell = (p, w, i) => {
      const es = (D.byP[p.id] || []).filter(e => e.wk === w), a = D.attAt[p.id + "|" + w], cur = i === S.wk ? "cur" : "";
      if (!es.length) return `<td class="${cur}">${a === "E" || a === "A" ? `<i class="c c--${a}" title="${a === "E" ? tx("請假", "Excused") : tx("缺席", "Absent")}">${mark(a)}</i>` : a === "P" || a === "L" ? `<i class="c c--miss" title="${tx("出席，沒寫", "Present, not written")}"></i>` : ""}</td>`;
      const top = es.slice().sort((x, y) => rk(x) - rk(y))[0], k = lvOf(top) || "n";
      return `<td class="${cur}"><button class="c c--${k}${es.some(e => lvOf(e) && e.pend) ? " c--pend" : ""}" data-who="${esc(p.id)}" title="${esc(nameOf(p))} · ${md(w)}">${LV[k] ? LV[k].g : "·"}${es.length > 1 ? `<sup>${es.length}</sup>` : ""}</button></td>`;
    };
    const es = D.entries.filter(e => e.wk === wk), byT = {}; es.forEach(e => (byT[e.task || ""] = byT[e.task || ""] || []).push(e));
    const wrote = new Set(es.map(e => e.p)), missing = attCol ? D.att.filter(a => a.wk === wk && (a.s === "P" || a.s === "L") && !wrote.has(a.p)).map(a => per(a.p)) : [];
    const pmax = Math.max(1, ...D.people.map(p => ptsOf(D.byP[p.id] || [])));
    return `<div class="vh"><div><h3>${tx("每週紀錄", "Week by week")}</h3><p>${tx("一格一個週六，顏色是那天最高的一筆。淡色的還沒核定。", "One square per Saturday, coloured by that day's highest entry. Faded squares are not confirmed yet.")}</p></div>
      <div class="wks">${D.weeks.map((w, i) => `<button data-wk="${i}" aria-pressed="${i === S.wk}">${md(w)}</button>`).join("")}</div></div>
      <div class="panel"><div class="gscroll"><table class="g"><thead><tr><th class="nm"></th>${D.weeks.map((w, i) => `<th class="${i === S.wk ? "cur" : ""}">${md(w)}</th>`).join("")}<th class="sm sm--first">${tx("分數", "Points")}</th>${attCol ? `<th class="sm">${tx("出席", "Att.")}</th>` : ""}${hrsCol ? `<th class="sm">${tx("時數", "Hours")}</th>` : ""}</tr></thead>
        <tbody>${ppl.map(p => { const s = attCol || hrsCol ? stats(p.id) : null;
          return `<tr><td class="nm"><button data-who="${esc(p.id)}">${av(p)}<span>${esc(nameOf(p))}</span></button></td>${D.weeks.map((w, i) => cell(p, w, i)).join("")}
          <td class="sm sm--first">${ptsBar(D.byP[p.id] || [], pmax)}</td>${attCol ? `<td class="sm${attLow(s.att) ? " low" : ""}">${s.att == null ? "—" : pct(s.att)}</td>` : ""}${hrsCol ? `<td class="sm" title="${tx(`實體 ${s.on}、線上 ${s.off}`, `${s.on} on site, ${s.off} online`)}">${s.hs.length ? `${s.on + s.off}h` : "—"}</td>` : ""}</tr>`; }).join("")}</tbody></table></div>
        <div class="gleg">${["v", "o", "q", "b"].filter(k => LV[k]).map(k => `<span><i class="c c--${k}">${LV[k].g}</i>${esc(L(LV[k]))}</span>`).join("")}
          ${attCol ? `<span><i class="c c--miss"></i>${tx("出席，沒寫", "Present, not written")}</span><span><i class="c c--E">${mark("E")}</i>${tx("請假", "Excused")}</span><span><i class="c c--A">${mark("A")}</i>${tx("缺席", "Absent")}</span>` : ""}</div>
        ${missing.length ? `<div class="alert"><b>${md(wk)} ${tx("出席但還沒寫", "present, not written")} · ${missing.length}</b>${missing.map(p => `<button data-who="${esc(p.id)}">${esc(nameOf(p))}</button>`).join("")}</div>` : ""}</div>
      <div class="wfeed">${Object.keys(byT).sort().map(tid => { const t = D.T[tid];
        return `<section><h4>${t ? esc(t.t) : tid ? "" : tx("沒有對到任務", "No task")} ${tid ? `<code>${esc(tid)}</code>` : ""}</h4><ul>${byT[tid].sort((x, y) => rk(x) - rk(y)).map(e =>
          `<li>${lvTag(e)}${av(per(e.p))}<span><b>${esc(nameOf(per(e.p)))}</b>${esc(e.what)}</span></li>`).join("")}</ul></section>`; }).join("") || `<p class="bnote">${tx(`${md(wk)} 沒有紀錄。`, `No entries on ${md(wk)}.`)}</p>`}</div>`;
  };

  // ================= drawers =================
  const close = () => `<button class="bd-x" data-close aria-label="${tx("關閉", "Close")}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON.x}</svg></button>`;
  const meter = (lab, val, max, txt, color) => `<div class="meter"><span>${lab}</span><span class="mbar"><i style="width:${Math.min(1, max ? val / max : 0) * 100}%;background:${color}"></i></span><span>${txt}</span></div>`;
  // ---------- growth: confirmed points added up week by week, against the team median ----------
  const growth = pid => memo("g:" + pid, () => {
    const cum = id => { const by = {}; let t = 0; (D.byP[id] || []).filter(counted).forEach(e => { by[e.wk] = (by[e.wk] || 0) + W[e.lv]; }); return D.weeks.map(w => (t += by[w] || 0)); };
    const all = D.people.map(p => cum(p.id));
    return { me: cum(pid), mid: D.weeks.map((_, i) => med(all.map(a => a[i]))), top: D.weeks.map((_, i) => Math.max(0, ...all.map(a => a[i]))) };
  });
  const growthSVG = (pid, name) => {
    const g = growth(pid), n = D.weeks.length; if (n < 2) return `<p class="bnote">${tx("至少要兩週的紀錄才畫得出來。", "Needs at least two weeks of entries.")}</p>`;
    const Wd = 560, Hd = 170, l = 6, r = 120, t = 12, b = 22, ymax = Math.max(4, ...g.top);
    const X = i => l + (i / (n - 1)) * (Wd - l - r), Y = v => t + (1 - v / ymax) * (Hd - t - b);
    const path = a => a.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join("");
    const lastMe = g.me[n - 1], lastMid = g.mid[n - 1];
    let yMe = Y(lastMe), yMid = Y(lastMid); if (Math.abs(yMe - yMid) < 15) { if (yMe <= yMid) yMid = yMe + 15; else yMe = yMid + 15; }
    const ticks = [0, Math.round(ymax / 2), ymax];
    return `<svg class="bd-grow" viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="${esc(tx(`${name} 的累積分數 ${lastMe}，全隊中間值 ${lastMid}`, `${name}: ${lastMe} points so far; team median ${lastMid}`))}">
      ${ticks.map(v => `<line x1="${l}" x2="${Wd - r}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${Wd - r + 4}" y="${Y(v) + 4}" class="ax">${v}</text>`).join("")}
      <text x="${l}" y="${Hd - 4}" class="ax">${md(D.weeks[0])}</text><text x="${Wd - r}" y="${Hd - 4}" class="ax" text-anchor="end">${md(D.weeks[n - 1])}</text>
      <path d="${path(g.mid)}" class="ln ln--mid"/><path d="${path(g.me)}" class="ln ln--me"/>
      <circle cx="${X(n - 1)}" cy="${Y(lastMe)}" r="4" class="pt--me"/>
      <text x="${Wd - r + 34}" y="${yMe + 4}" class="lb lb--me">${esc(tx("本人", "Them"))} ${lastMe}</text>
      <text x="${Wd - r + 34}" y="${yMid + 4}" class="lb">${esc(tx("中間值", "Median"))} ${lastMid}</text>
      ${D.weeks.map((w, i) => `<rect x="${(X(i) - (Wd - l - r) / (n - 1) / 2).toFixed(1)}" y="${t}" width="${((Wd - l - r) / (n - 1)).toFixed(1)}" height="${Hd - t - b}" class="hit"><title>${md(w)} · ${esc(tx("本人", "Them"))} ${g.me[i]} · ${esc(tx("中間值", "median"))} ${g.mid[i]} · ${esc(tx("最高", "top"))} ${g.top[i]}</title></rect>`).join("")}
    </svg>`;
  };
  // ---------- photos: Drive file IDs only. Drive decides who may see them; on the demo data nothing is fetched. ----------
  const goodId = id => typeof id === "string" && /^[\w-]{20,}$/.test(id);
  const photo = (id, label) => {
    const href = `https://drive.google.com/file/d/${esc(id)}/view`;
    const ph = `<span class="bd-ph0">${ico("link")}${tx("Drive 照片", "Drive photo")}</span>`;
    return `<a class="bd-ph" href="${href}" target="_blank" rel="noopener noreferrer" title="${esc(label)}">${RAW.mock ? ph
      : `<img loading="lazy" alt="${esc(label)}" referrerpolicy="no-referrer" src="https://drive.google.com/thumbnail?id=${esc(id)}&amp;sz=w400" onerror="this.outerHTML='${ph.replace(/"/g, "&quot;")}'">`}</a>`;
  };
  const photosOf = es => es.filter(e => Array.isArray(e.ph)).flatMap(e => e.ph.filter(goodId).map(id => ({ id, e })));
  const researchOf = pid => { const R = typeof RESEARCH === "object" && RESEARCH && Array.isArray(RESEARCH.cards) ? RESEARCH : null; return R ? R.cards.filter(c => c && c.p === pid) : null; };
  const personDrawer = pid => {
    const p = per(pid), s = stats(pid), es = s.es, hasAtt = s.a.length > 0, hasHrs = s.hs.length > 0, N = D.people.length;
    const ref = teamRef(), seats = bridgeSeats(), seatB = BR.find(b => seats[b.k] && seats[b.k].p.id === pid);
    const seatNow = seatB && seatGap(pid, seatB), grow = growSeat(pid, seatB && seatB.k);
    const R = ranks(), ra = R.all.by[pid] || { n: 0, r: N }, r8 = R.w8.by[pid] || { n: 0, r: N }, top5 = R.w8.sorted[Math.min(4, R.w8.sorted.length - 1)] || 0;
    const nHere = s.a.filter(a => here(a.s)).length, wroteW = new Set(es.map(e => e.wk)), nWrote = s.a.filter(a => here(a.s) && wroteW.has(a.wk)).length;
    const pend = es.filter(e => e.pend && !e.redo).length, redo = es.filter(e => e.redo).length;
    const att = {}; s.a.forEach(a => { att[a.wk] = a.s; });
    const tl = D.weeks.map(w => { const xs = es.filter(e => e.wk === w).sort((x, y) => rk(x) - rk(y)), a = att[w];
      if (!xs.length) return a ? `<li><small>${md(w)}</small><i></i><p class="abs">${a === "E" ? tx("請假", "Excused") : a === "A" ? tx("缺席", "Absent") : tx("出席，沒寫", "Present, not written")}</p></li>` : "";
      return xs.map(e => { const t = D.T[e.task];
        return `<li><small>${md(w)}</small>${lvTag(e)}<p><b>${t ? `${esc(t.id)} · ${esc(t.t)}` : e.task ? esc(e.task) : esc(areaName(e.area))}</b>${esc(e.what)}<br>${vtChip(e)}${flags(e)}${evLink(e)}</p>${photosOf([e]).length ? `<div class="bd-phs bd-phs--s">${photosOf([e]).map(x => photo(x.id, md(w))).join("")}</div>` : ""}</li>`; }).join(""); }).reverse().join("");
    const hmax = Math.max(1, ...s.hs.map(h => (+h.on || 0) + (+h.off || 0)));
    const sum = [
      [tx("整季分數", "Season points"), ra.n, tx(`第 ${ra.r} / ${N} 名`, `#${ra.r} of ${N}`)],
      ...(hasAtt ? [[tx("出席", "Attendance"), pct(s.att), tx(`${nHere} / ${s.a.length} 個週六`, `${nHere} of ${s.a.length} Saturdays`), attLow(s.att)],
        [tx("有寫紀錄", "Wrote it down"), nWrote, tx(`到場 ${nHere} 次中`, `of ${nHere} times there`)]] : [[tx("紀錄", "Entries"), es.length, ""]]),
      ...(hasHrs ? [[tx("時數", "Hours"), `${s.on + s.off}<small>h</small>`, tx(`實體 ${s.on}・線上 ${s.off}`, `${s.on} on site, ${s.off} online`)]] : [])];
    const gap8 = r8.r <= 5 ? tx("在前 5 名。", "In the top 5.") : tx(`和第 5 名差 ${top5 - r8.n} 分。`, `${ptsU(top5 - r8.n)} behind fifth place.`);
    return `${close()}
      <div class="dr__h">${av(p, "av--lg")}<div><h3>${esc(nameOf(p))}</h3><p>${roleBadge(p)}<span style="font-size:13px;color:var(--ink3)">${esc(G[p.g] ? L(G[p.g]) : "")}${p.n ? `${G[p.g] ? " · " : ""}${esc(p.id)}` : ""}</span><button class="cpy" data-copy="${esc(pid)}">${ico("link")}${tx("複製這一頁的連結", "Copy link to this page")}</button></p></div></div>
      <div class="dr__b">
        <div class="sumx">${sum.map(([l, v, sub, low]) => `<div><small>${l}</small><strong class="${low ? "low" : ""}">${v}</strong>${sub ? `<span>${sub}</span>` : ""}</div>`).join("")}</div>
        <div class="dcard"><h4><span>${tx("近 8 個週六，和全隊比", "Last 8 Saturdays, against the team")}</span><span>${tx("中間值", "Median")} ★ ${ref.mv} · ◆ ${ref.mo}</span></h4>
          <p class="gap">${tx(`近 8 週 ${r8.n} 分，第 ${r8.r} / ${N} 名。`, `${ptsU(r8.n)} in 8 weeks, #${r8.r} of ${N}. `)}${gap8}</p>
          <div class="meters">${meter("★", s.c8.v, ref.xv, `${s.c8.v} / ${tx("最多", "top")} ${ref.xv}`, "var(--v)")}${meter("◆", s.c8.o, ref.xo, `${s.c8.o} / ${tx("最多", "top")} ${ref.xo}`, "var(--o)")}
            ${hasAtt ? meter(tx("出席", "Attend."), s.att8 || 0, 1, pct(s.att8 || 0), "var(--green)") + (s.log8 != null ? meter(tx("有寫", "Wrote"), s.log8, 1, pct(s.log8), "var(--teal)") : "") : ""}</div>
          ${seatNow ? `<div class="seat"><small>${tx("目前的跨區座位", "Current bridge seat")}</small><span><b>${esc(L(seatNow.b))}</b> · ${seatNow.have.length} / ${seatNow.b.areas.length} ${tx("區", "areas")}${seatNow.miss.length ? tx("；還缺 ", "; missing ") + areaList(seatNow.miss) : ""}</span></div>` : ""}
          ${grow ? `<div class="seat"><small>${tx("可以補的座位", "Seat they could grow into")}</small><span><b>${esc(L(grow.b))}</b> · ${tx("已有", "Has")} ${areaList(grow.have)}${tx("；還缺 ", "; missing ")}${areaList(grow.miss)}</span></div>` : ""}</div>
        <div class="dcard"><h4><span>${tx("成長：整季累積的已核定分數", "Growth: confirmed points over the season")}</span><span>${tx("和全隊中間值比", "against the team median")}</span></h4>${growthSVG(pid, nameOf(p))}
          <div class="leg" style="margin-top:6px"><span><i class="sw" style="background:var(--o)"></i>${esc(nameOf(p))}</span><span><i class="sw" style="background:var(--ink4)"></i>${tx("全隊中間值", "Team median")}</span></div></div>
        ${(() => { const rc = researchOf(pid); if (!rc) return ""; const rqs = new Set(rc.map(c => c.rq).filter(Boolean));
          return `<div class="dcard"><h4><span>${tx("研究貢獻", "Research")}</span><span>${tx(`${rc.length} 份來源・${rqs.size} 個研究問題`, `${rc.length} sources · ${rqs.size} questions`)}</span></h4>
            ${rc.length ? `<ul class="bd-rc">${rc.slice(-3).reverse().map(c => `<li><small>${md(c.wk)}${c.rq ? ` · ${esc(c.rq)}` : ""}</small>${esc(c.take || c.src)}</li>`).join("")}</ul><p class="dr__more"><a href="research.html?who=${esc(pid)}#cards">${tx("看全部 →", "See all →")}</a></p>` : `<p class="bnote">${tx("還沒有研究卡。每週表單的「研究」部分填一筆就會出現在這裡。", "No research cards yet. Fill in the research part of the weekly form.")}</p>`}</div>`; })()}
        ${(() => { const ps = photosOf(es).reverse(); if (!ps.length && !p.pf) return "";
          return `<div class="dcard"><h4><span>${tx("照片", "Photos")}</span><span>${tx(`${ps.length} 張，存在 Drive`, `${ps.length} in Drive`)}</span></h4>
            ${ps.length ? `<div class="bd-phs">${ps.slice(0, 12).map(x => photo(x.id, `${md(x.e.wk)} · ${x.e.what}`)).join("")}</div>` : ""}
            <p class="dr__more">${p.pf && goodId(p.pf) ? `<a href="https://drive.google.com/drive/folders/${esc(p.pf)}" target="_blank" rel="noopener noreferrer">${tx("打開 Drive 照片資料夾 ↗", "Open the Drive photo folder ↗")}</a> · ` : ""}${tx("照片只存在 Drive，要用團隊帳號登入才看得到。", "Photos live only in Drive; sign in with a team account to see them.")}</p></div>`; })()}
        <div class="dcard"><h4><span>${tx("整季，已核定", "Season, confirmed")}</span><span>${ptsU(ptsOf(es))}</span></h4>${ptsBar(es)}
          <div class="cnt">${["v", "o", "q", "b"].filter(k => LV[k]).map(k => `<div title="${esc(L(LV[k]))}"><i class="lv lv--${k}">${LV[k].g}</i>${s.c[k]}</div>`).join("")}</div>
          ${pend || redo ? `<p class="dr__more">${[pend ? tx(`另有 ${pend} 筆等組長核定`, `${pend} more waiting for the lead`) : "", redo ? tx(`${redo} 筆被退回重做`, `${redo} sent back`) : ""].filter(Boolean).join(tx("，", ", "))}${tx("。", ".")}</p>` : ""}</div>
        ${hasAtt || hasHrs ? `<div class="dcard"><h4><span>${tx("出席與時數", "Attendance and hours")}</span>${hasAtt ? `<span>${tx(`請假 ${s.E}・缺席 ${s.A}・遲到 ${s.Lt}`, `Excused ${s.E}, absent ${s.A}, late ${s.Lt}`)}</span>` : ""}</h4>
          ${hasAtt ? `<div class="astrip" aria-label="${tx("每週出席", "Attendance by week")}">${s.a.map(a => `<i class="s-${esc(a.s)}" title="${md(a.wk)} · ${{ P: tx("出席", "Present"), L: tx("遲到", "Late"), E: tx("請假", "Excused"), A: tx("缺席", "Absent") }[a.s] || esc(a.s)}"></i>`).join("")}</div>
            <div class="leg" style="margin-top:8px"><span><i class="sw" style="background:var(--green)"></i>${tx("出席", "Present")}</span><span><i class="sw" style="background:var(--amber)"></i>${tx("遲到", "Late")}</span><span><i class="sw" style="background:var(--ink4)"></i>${tx("請假", "Excused")}</span><span><i class="sw" style="background:#fff;border:1.5px solid #E89A9A"></i>${tx("缺席", "Absent")}</span></div>` : ""}
          ${hasHrs ? `<div class="months">${s.hs.map(h => { const on = +h.on || 0, off = +h.off || 0;
            return `<div title="${mon(h.month)} · ${tx(`實體 ${on}、線上 ${off} 小時`, `${on} h on site, ${off} h online`)}"><b>${on + off}</b><span class="mb">${on ? `<i class="on" style="height:${(on / hmax) * 100}%"></i>` : ""}${off ? `<i class="off" style="height:${(off / hmax) * 100}%"></i>` : ""}</span>${mon(h.month)}</div>`; }).join("")}</div>
          <div class="leg" style="margin-top:10px"><span><i class="sw" style="background:var(--blue)"></i>${tx("實體時數", "On site")}</span><span><i class="sw" style="background:var(--sky)"></i>${tx("線上時數", "Online")}</span></div>` : ""}</div>` : ""}
        <div class="dcard"><h4><span>${tx("每週做了什麼", "What they did, week by week")}</span><span>${es.length} ${tx("筆", es.length === 1 ? "entry" : "entries")}</span></h4>${tl ? `<ol class="tl">${tl}</ol>` : `<p class="bnote">${tx("還沒有紀錄。", "No entries yet.")}</p>`}</div>
        <p class="dr__key">${"voqb".split("").filter(k => LV[k]).map(k => `${LV[k].g} ${esc(L(LV[k]))} ${ptsU(W[k])}`).join(" · ")}${tx("。淡色加虛線框的是還沒核定。", ". Faded with a dotted frame means not confirmed yet.")}</p>
      </div>`;
  };
  const taskDrawer = tid => {
    const t = D.T[tid]; if (!t) return `${close()}<div class="dr__b"><p class="bnote">${tx("找不到這個任務。", "This task is not in the data.")}</p></div>`;
    const es = D.byT[tid] || [], by = {}, st = stOf(t); es.forEach(e => (by[e.p] = by[e.p] || []).push(e));
    const order = Object.keys(by).sort((a, b) => ptsOf(by[b]) - ptsOf(by[a]) || by[b].length - by[a].length);
    const own = t.owner ? per(t.owner) : null;
    return `${close()}
      <div class="dr__h dr__h--t"><div><p class="dr__chips"><span class="chip">${esc(t.id)}</span><span class="chip" style="color:${STC[st]}">${tx(...STN[st])}</span><span class="chip">${t.g === "all" ? tx("全隊", "Whole team") : esc(G[t.g] ? L(G[t.g]) : L(OTHER))}</span>${AR[t.area] ? `<button class="chip" data-area="${esc(t.area)}">${esc(areaName(t.area))}</button>` : ""}</p><h3>${esc(t.t)}</h3></div></div>
      <div class="dr__b"><div class="dcard"><h4><span>${tx("負責人", "Owner")}</span><span>${span(es)}</span></h4>
        ${own ? `<div class="who1">${av(own)}<button data-who="${esc(own.id)}">${esc(nameOf(own))}</button>${roleBadge(own)}</div>` : `<p class="bnote">${tx("還沒有負責人。", "No owner yet.")}</p>`}</div>
        <div class="dcard"><h4><span>${tx("誰做了什麼", "Who did what")}</span><span>${nPeople(order.length)}</span></h4>
          ${order.length ? `<ol class="ppl-t">${order.map(pid => `<li>${av(per(pid))}<div><button data-who="${esc(pid)}">${esc(nameOf(per(pid)))}</button>${by[pid].sort((a, b) => rk(a) - rk(b)).map(e => `<div>${lvTag(e)}<span>${esc(e.what)} <small style="color:var(--ink3)">${md(e.wk)}</small> ${flags(e)}${evLink(e)}</span></div>`).join("")}</div></li>`).join("")}</ol>` : `<p class="bnote">${tx("還沒有紀錄。", "No entries yet.")}</p>`}</div></div>`;
  };
  // A Log row's part is free text from the sheet. Match it to the area's parts in either language, ignoring notes in brackets.
  const norm = s => String(s == null ? "" : s).replace(/[（(][^）)]*[）)]/g, "").replace(/\s+/g, "").toLowerCase();
  const partKey = (a, label) => {
    const n = norm(label); if (!n) return "";
    const zh = arr(a.parts_zh), en = arr(a.parts_en);
    for (let i = 0; i < Math.max(zh.length, en.length); i++) { const z = norm(zh[i]), e = norm(en[i]); if ((z && (n === z || n.startsWith(z))) || (e && n === e)) return i; }
    return String(label).trim();
  };
  const areaDrawer = k => {
    const a = AR[k]; if (!a) return `${close()}<div class="dr__b"><p class="bnote">${tx("找不到這一區。", "This area is not in the spec.")}</p></div>`;
    const es = D.entries.filter(e => e.area === k && contrib(e)), parts = arr(a["parts_" + S.lang] || a.parts_zh), ts = D.tasks.filter(t => t.area === k);
    const key = {}; es.forEach(e => { key[e.id || e.p + e.wk + e.what] = partKey(a, e.part); });
    const kOf = e => key[e.id || e.p + e.wk + e.what];
    const extra = [...new Set(es.map(kOf).filter(x => typeof x === "string" && x))];
    const rows = [...parts.map((name, i) => [i, name]), ...extra.map(x => [x, x]), ...(es.some(e => kOf(e) === "") ? [["", tx("沒寫是哪個部分", "Part not given")]] : [])];
    const partRow = ([id, name]) => { const pe = es.filter(e => kOf(e) === id), who = whoOf(pe);
      return `<li><b><span>${esc(name)}</span><small>${nPeople(who.length)}</small></b>
        ${who.length ? `<div class="pc">${who.map(pid => { const xs = pe.filter(e => e.p === pid).sort((x, y) => rk(x) - rk(y));
          return `<button class="pp" data-who="${esc(pid)}" title="${esc(nameOf(per(pid)))}">${av(per(pid))}${xs.map(lvTag).join("")}</button>`; }).join("")}</div>` : `<span class="none">${tx("還沒有人", "Nobody yet")}</span>`}</li>`; };
    const list = [...es].sort((x, y) => (x.wk < y.wk ? 1 : x.wk > y.wk ? -1 : rk(x) - rk(y)));
    const label = e => { const id = kOf(e); return typeof id === "number" ? parts[id] || "" : id; };
    return `${close()}
      <div class="dr__h dr__h--t"><div><p class="dr__chips"><span class="chip">${a.kind === "deliverable" ? tx("成品", "Deliverable") : tx("專案工作", "Project work")}</span><span class="chip">${esc(target(a))}</span>${a.under ? `<span class="chip">${tx("常被低估", "Often under-credited")}</span>` : ""}</p>
        <h3>${esc(L(a))}</h3>${a.under ? `<p class="dr__why">${esc(LK(a, "why"))}</p>` : ""}</div></div>
      <div class="dr__b">
        <div class="dcard"><h4><span>${tx("每個部分是誰做的", "Who did each part")}</span><span>${ptsOf(es)} ${tx("分", "pts")}</span></h4><ol class="parts">${rows.map(partRow).join("")}</ol></div>
        <div class="dcard"><h4><span>${tx("任務", "Tasks")}</span><span>${ts.length}</span></h4>${ts.length ? `<div class="atasks">${ts.map(t => `<button data-task="${esc(t.id)}" style="--sc:${STC[stOf(t)]}"><span>${esc(t.t)}</span><small>${tx(...STN[stOf(t)])}</small></button>`).join("")}</div>` : `<p class="bnote">${tx("這一區還沒有任務。", "No tasks in this area yet.")}</p>`}</div>
        <div class="dcard"><h4><span>${tx("紀錄", "Entries")}</span><span>${es.length}</span></h4>${list.length ? `<ol class="tl">${list.map(e => `<li><small>${md(e.wk)}</small>${lvTag(e)}<p><b>${esc(nameOf(per(e.p)))}${label(e) ? ` · ${esc(label(e))}` : ""}</b>${esc(e.what)} ${e.task ? `<small style="color:var(--ink3)">${esc(e.task)}</small>` : ""}${flags(e) || evLink(e) ? `<br>${flags(e)}${evLink(e)}` : ""}</p></li>`).join("")}</ol>` : `<p class="bnote">${tx("還沒有紀錄。", "No entries yet.")}</p>`}</div>
      </div>`;
  };

  // ================= page =================
  // The board opens the page: its own title, then search, then the views. hub.js renders the rest below it.
  function renderHead() {
    const h = document.getElementById("bd-head"); if (!h) return;
    let upd = "";
    if (D.updated && !isNaN(Date.parse(D.updated))) { const t = new Date(Date.parse(D.updated) + 8 * 36e5).toISOString(); upd = `${md(t.slice(0, 10))} ${t.slice(11, 16)}`; }   // Taipei time
    const eb = [RAW.season ? tx(`${RAW.season} 賽季`, `${RAW.season} season`) : "", tx(`${D.people.length} 位隊員`, `${D.people.length} members`), upd ? tx(`更新於 ${upd}`, `Updated ${upd}`) : ""].filter(Boolean);
    h.innerHTML = `<div class="bd-hero"><p class="eyebrow">${eb.map(esc).join(" · ")}</p><h1 class="h1">${tx("誰做了什麼", "Who did what")}</h1>
      <p class="lede">${tx("每個週六，每個人寫下自己做了什麼；組長週日核定，週日晚上更新到這裡。學生、老師和家長看到的是同一份紀錄。", "Every Saturday each student writes down what they did. Leads confirm on Sunday and this page updates that night. Students, teachers and parents all see the same record.")}</p>
      ${RAW.mock === true ? `<p class="bd-mock">${tx("示範用：這是虛構的一季，人名和紀錄都是編的。", "Demo only: an invented season. Every name and entry is made up.")}</p>` : ""}
      <div class="bd-find"><input class="q bd-q" id="bd-find" type="search" value="${esc(S.find)}" placeholder="${tx("找隊員：打名字", "Find a member: type a name")}" autocomplete="off" aria-label="${tx("找隊員", "Find a member")}"><div class="hits" id="bd-hits"></div></div></div>`;
    hits();
  }
  function hits() {
    const h = document.getElementById("bd-hits"); if (!h) return;
    const q = S.find.trim().toLowerCase();
    if (!q) { h.innerHTML = ""; return; }
    const xs = D.people.filter(p => [p.n, p.ini, p.id].some(v => v && String(v).toLowerCase().includes(q))).sort(byName).slice(0, 8);
    h.innerHTML = xs.length ? xs.map(p => `<button data-who="${esc(p.id)}">${av(p)}<span>${esc(nameOf(p))}</span><small>${esc(G[p.g] ? L(G[p.g]) : "")}</small></button>`).join("")
      : `<p>${tx("找不到這個名字。", "No one by that name.")}</p>`;
  }
  function renderBody() {
    const b = document.getElementById("bd-body"); if (!b) return;
    let view;
    try { view = { home: vHome, map: vMap, areas: vAreas, value: vValue, people: vPeople, roles: vRoles, week: vWeek }[S.tab](); }
    catch (e) { if (window.console) console.error("[board]", e); view = `<p class="bd-notice bd-notice--err">${tx("這一頁顯示不出來。", "This view could not be shown.")} (${esc(e && e.message)})</p>`; }
    b.innerHTML = `<nav class="tabs" role="tablist" aria-label="${tx("看板分頁", "Board views")}">${TABN.map(([k, z, e]) => `<button role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${tx(z, e)}</button>`).join("")}</nav>
      <div class="view" role="tabpanel">${view}</div>`;
    // On a phone the chosen tab or week can sit off-screen in its scrolling row; bring it to the middle.
    [[".tabs", "[aria-selected=true]"], [".wks", "[aria-pressed=true]"]].forEach(([r, s]) => { const row = b.querySelector(r), on = row && row.querySelector(s);
      if (on && row.scrollWidth > row.clientWidth) row.scrollLeft += on.getBoundingClientRect().left - row.getBoundingClientRect().left - (row.clientWidth - on.offsetWidth) / 2; });
  }
  // Keep the address bar in step with the open tab and page, so any view can be shared or bookmarked.
  function syncURL() {
    try { const u = new URL(location.href); ["tab", "who", "task", "area"].forEach(k => u.searchParams.delete(k));
      if (S.tab !== "home") u.searchParams.set("tab", S.tab);
      if (S.drawer) { const k = Object.keys(S.drawer)[0]; u.searchParams.set(k, S.drawer[k]); }
      history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (e) { /* file:// or an old browser: the page still works */ }
  }
  let opener = null;
  function drawer() {
    const el = document.getElementById("bd-dr"); if (!el) return;
    const open = !!(S.drawer && D);
    if (open) {
      try { el.innerHTML = S.drawer.who ? personDrawer(S.drawer.who) : S.drawer.area ? areaDrawer(S.drawer.area) : taskDrawer(S.drawer.task); }
      catch (e) { if (window.console) console.error("[board]", e); el.innerHTML = `${close()}<div class="dr__b"><p class="bnote">${tx("顯示不出來。", "This could not be shown.")}</p></div>`; }
      el.scrollTop = 0;
    }
    el.setAttribute("aria-hidden", String(!open));
    root.classList.toggle("bd-open", open);
    document.documentElement.classList.toggle("bd-lock", open);
    if (open) { const x = el.querySelector(".bd-x"); if (x) x.focus({ preventScroll: true }); }
    else if (opener && document.contains(opener)) { opener.focus({ preventScroll: true }); opener = null; }
    syncURL();
  }
  function render() { renderHead(); renderBody(); drawer(); }
  const toBody = () => { const b = document.getElementById("bd-body"); if (b && b.getBoundingClientRect().top < 0) b.scrollIntoView({ block: "start" }); };

  try { load(RAW); } catch (e) { if (window.console) console.error("[board]", e); unread(); return; }
  root.innerHTML = `<div class="wrap"><div id="bd-head"></div><div id="bd-body"></div></div><div class="bd-scrim" data-close></div><aside class="bd-dr" id="bd-dr" aria-hidden="true" aria-label="${tx("詳細", "Details")}"></aside>`;
  render();

  // The hub's own click handler is registered first, so it has already saved the language and redrawn #main.
  document.addEventListener("click", e => {
    const lb = e.target.closest("[data-lang]");
    if (lb && !root.contains(lb)) { if (lb.dataset.lang === "zh" || lb.dataset.lang === "en") { S.lang = lb.dataset.lang; render(); } return; }
    if (!root.contains(e.target)) return;
    const b = e.target.closest("[data-tab],[data-vt],[data-grp],[data-range],[data-wk],[data-gowk],[data-who],[data-task],[data-area],[data-close],[data-copy]");
    if (!b || !root.contains(b)) return;
    const d = b.dataset;
    if (d.copy) {
      const url = location.origin + location.pathname + "?who=" + encodeURIComponent(d.copy), done = () => { b.lastChild.textContent = tx("已複製", "Copied"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => window.prompt(tx("複製這個連結：", "Copy this link:"), url));
      else window.prompt(tx("複製這個連結：", "Copy this link:"), url);
      return;
    }
    if (d.who || d.task || d.area) { if (!S.drawer) opener = b; S.drawer = d.who ? { who: d.who } : d.task ? { task: d.task } : { area: d.area }; return drawer(); }
    if ("close" in d) { S.drawer = null; return drawer(); }
    const fromView = !b.closest(".tabs");
    if (d.gowk) { S.tab = "week"; S.wk = +d.gowk; }
    else if (d.tab) S.tab = d.tab; else if (d.vt) S.vt = S.vt === d.vt ? "all" : d.vt;
    else if (d.grp) S.grp = d.grp; else if (d.range) S.range = d.range; else if (d.wk) S.wk = +d.wk;
    renderBody(); syncURL();
    if (fromView && (d.tab || d.gowk)) toBody();
  });
  root.addEventListener("input", e => { if (e.target.id === "bd-find") { S.find = e.target.value; hits(); } });
  root.addEventListener("keydown", e => { if (e.target.id === "bd-find" && e.key === "Enter") { const f = document.querySelector("#bd-hits [data-who]"); if (f) f.click(); } });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && S.drawer) { S.drawer = null; drawer(); } });
})();
