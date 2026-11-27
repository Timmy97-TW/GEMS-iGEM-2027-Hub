// Roadmap (roadmap.html) and Research (research.html). Renders into <section id="core">, outside hub.js's #main.
// Data: data/roadmap.js (ROADMAP), data/research.js (RESEARCH), data/season.js (SEASON milestones). No requests.
// Both data files are rebuilt each week from the Core Sheet by attribution-tools/core/build-core.js.
(() => {
  "use strict";
  const root = document.getElementById("core");
  if (!root) return;
  const PAGE = document.body.dataset.page;
  const QS = new URLSearchParams(location.search);
  const get = f => { try { return f(); } catch (e) { return null; } };
  const RM = get(() => ROADMAP), RS = get(() => RESEARCH), SEA = get(() => SEASON) || {};

  // ---------- language: the hub's saved choice ----------
  const readLang = () => { const q = QS.get("lang"); if (q === "en" || q === "zh") return q; try { return localStorage.getItem("lang") === "en" ? "en" : "zh"; } catch (e) { return "zh"; } };
  const S = { lang: readLang(), pl: "*", hot: false, rq: QS.get("rq") || "", who: QS.get("who") || "", q: "", n: 40 };
  const tx = (zh, en) => (S.lang === "zh" ? zh : en);
  const L = o => (o && typeof o === "object" ? o[S.lang] || o.zh || o.en || "" : o || "");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 864e5, utc = d => new Date(d + "T00:00:00Z"), iso = x => x.toISOString().slice(0, 10);
  const add = (d, n) => iso(new Date(utc(d).getTime() + n * DAY)), diff = (a, b) => Math.round((utc(b) - utc(a)) / DAY);
  const isDay = v => typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v);
  const md = d => `${+d.slice(5, 7)}/${+d.slice(8, 10)}`;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monL = d => tx(`${+d.slice(5, 7)} 月`, MON[+d.slice(5, 7) - 1]);
  const REAL_TODAY = isDay((QS.get("now") || "").slice(0, 10)) ? QS.get("now").slice(0, 10) : new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10);

  const PIPES = [["all", "全隊任務", "Team-wide"], ["wet", "Wet lab", "Wet lab"], ["dry", "Dry lab", "Dry lab"], ["hp", "Human Practices", "Human Practices"], ["wiki", "Wiki 與交付物", "Wiki & deliverables"]]
    .map(([k, zh, en]) => ({ k, zh, en }));
  const pipeName = k => L(PIPES.find(p => p.k === k) || { zh: k, en: k });
  const ST = { done: ["完成", "Done", "var(--done)"], doing: ["進行中", "In progress", "var(--doing)"], stuck: ["卡住", "Stuck", "var(--stuck)"], todo: ["未開始", "Not started", "var(--todo)"] };
  const stName = k => tx(...(ST[k] || ST.todo).slice(0, 2));
  const chip = (k, late) => `<span class="st${late ? " st--late" : ""}" style="--c:${(ST[k] || ST.todo)[2]}"><i></i>${esc(stName(k))}${late ? tx("・逾期", " · overdue") : ""}</span>`;

  const hero = (eyebrow, h1, lede, mock) => `<div class="c-hero"><p class="eyebrow">${eyebrow.filter(Boolean).map(esc).join(" · ")}</p><h1 class="h1">${h1}</h1><p class="lede">${lede}</p>${mock ? `<p class="c-mock">${mock}</p>` : ""}</div>`;
  const mockNote = d => d && d.mock ? tx(`示範資料：人名都是虛構的，日期是 ${md(d.asof)} 那一週的樣子。第一次真實更新後就會換掉。`, `Demo data: every name is invented, shown as of ${md(d.asof)}. The first real weekly update replaces it.`) : "";
  const off = what => `<div class="wrap">${hero([], what, tx("資料讀不到。", "The data could not be read."))}</div>`;

  // ---------- tooltip ----------
  let tip = null;
  const showTip = (el, html) => {
    if (!tip) { tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("role", "tooltip"); root.appendChild(tip); }
    tip.innerHTML = html; tip.classList.add("is-on");
    const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    let x = Math.min(innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2)), y = r.top - h - 10;
    if (y < 60) y = r.bottom + 10;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const hideTip = () => tip && tip.classList.remove("is-on");

  // ================= Roadmap =================
  function roadmap() {
    if (!RM || !Array.isArray(RM.tasks)) { root.innerHTML = off("Roadmap"); return; }
    const NOW = RM.mock && isDay(RM.asof) ? RM.asof : REAL_TODAY;
    const tasks = RM.tasks.filter(t => t && t.id && isDay(t.s) && isDay(t.e));
    const late = t => t.st !== "done" && t.e < NOW;
    const nodes = (Array.isArray(SEA.nodes) ? SEA.nodes : []).filter(n => n && n.n && isDay(n.date) && ["gate", "deadline"].includes(n.lane)).sort((a, b) => a.date.localeCompare(b.date));
    const NODE = Object.fromEntries(nodes.map(n => [n.n, n]));

    // pipeline health
    const health = PIPES.map(p => {
      const ts = tasks.filter(t => t.pl === p.k), c = k => ts.filter(t => t.st === k).length;
      const due = ts.filter(t => t.e <= NOW).length, done = c("done");
      return { p, ts, n: ts.length, done, doing: c("doing"), stuck: c("stuck"), todo: c("todo"), late: ts.filter(late).length, due };
    }).filter(h => h.n);
    const tiles = health.map(h => `<button class="c-pipe" data-pl="${h.p.k}"><h3>${esc(L(h.p))}<span>${h.done} / ${h.n}</span></h3>
      <div class="c-prog" aria-hidden="true">${["done", "doing", "stuck", "todo"].map(k => { const n = h[k]; return n ? `<i style="flex:${n};--c:${ST[k][2]}"></i>` : ""; }).join("")}</div>
      <p>${tx(`到今天該完成 <b>${h.due}</b> 項，已完成 <b>${h.done}</b> 項`, `<b>${h.due}</b> due by now, <b>${h.done}</b> done`)}${h.stuck ? `<br><span class="c-bad">${tx(`${h.stuck} 項卡住`, `${h.stuck} stuck`)}</span>` : ""}${h.late ? `${h.stuck ? " · " : "<br>"}<span class="c-bad">${tx(`${h.late} 項逾期`, `${h.late} overdue`)}</span>` : ""}${!h.stuck && !h.late ? `<br>${tx("沒有卡關", "Nothing blocked")}` : ""}</p></button>`).join("");

    // gantt geometry
    const all = [...tasks.flatMap(t => [t.s, t.e]), ...nodes.map(n => n.date), NOW].sort();
    const g0 = all[0].slice(0, 8) + "01", gEnd = all[all.length - 1];
    const e0 = new Date(utc(gEnd.slice(0, 8) + "01")); e0.setUTCMonth(e0.getUTCMonth() + 1);
    const g1 = iso(e0), span = diff(g0, g1);
    const x = d => (diff(g0, d) / span) * 100;
    const months = []; for (let m = new Date(utc(g0)); iso(m) < g1; m.setUTCMonth(m.getUTCMonth() + 1)) months.push(iso(m));
    const grid = months.map(m => `<i class="g-grid" style="left:${x(m)}%"></i>`).join("");
    const nowLine = `<i class="g-now" style="left:${x(NOW)}%"></i>`;
    const head = `<div class="g-row g-head"><div class="g-lab">${tx("任務", "Task")}</div><div class="g-track" style="height:64px">${grid}${months.map(m => `<span class="g-mon" style="left:${x(m)}%">${m.slice(5, 7) === "01" || m === months[0] ? `${m.slice(0, 4)} ` : ""}${monL(m)}</span>`).join("")}
      ${nodes.map(n => `<i class="g-dia${n.lane === "deadline" ? " is-dl" : ""}${n.date < NOW ? " is-past" : ""}" style="left:${x(n.date)}%" data-node="${esc(n.n)}" tabindex="0" aria-label="${esc(`${md(n.date)} ${L(n.t)}`)}"></i>`).join("")}
      <i class="g-now" style="left:${x(NOW)}%"><b>${RM.mock ? md(NOW) : tx("今天", "Today")}</b></i></div></div>`;
    const visible = t => (S.pl === "*" || t.pl === S.pl) && (!S.hot || t.st === "stuck" || late(t));
    const rows = health.filter(h => S.pl === "*" || h.p.k === S.pl).map(h => `<div class="g-sec" id="pl-${h.p.k}"><div class="g-lab">${esc(L(h.p))}</div><div></div></div>
      ${h.ts.slice().sort((a, b) => a.s.localeCompare(b.s)).map(t => {
        const lt = late(t), tag = t.st === "stuck" ? `<b class="stuck">${tx("卡住", "Stuck")}</b>` : lt ? `<b class="late">${tx(`逾期 ${diff(t.e, NOW)} 天`, `${diff(t.e, NOW)} d overdue`)}</b>` : t.st === "done" ? tx("完成", "Done") : "";
        return `<div class="g-row${visible(t) ? "" : " is-dim"}"><div class="g-lab">${esc(L(t.t))}<small>${esc(t.id)}${t.n ? ` · ${esc(t.n)}` : ""}</small></div>
          <div class="g-track">${grid}${nowLine}<i class="g-bar is-${t.st}${lt ? " is-late" : ""}" style="left:${x(t.s)}%;width:${Math.max(.4, x(add(t.e, 1)) - x(t.s))}%;--c:${(ST[t.st] || ST.todo)[2]}" data-task="${esc(t.id)}" tabindex="0" aria-label="${esc(`${L(t.t)}: ${stName(t.st)}${lt ? tx("，逾期", ", overdue") : ""}, ${md(t.s)}–${md(t.e)}`)}"></i>
          ${tag ? `<span class="g-tag" style="left:${x(add(t.e, 1))}%">${tag}</span>` : ""}</div></div>`; }).join("")}`).join("");

    // milestones
    const allNodes = (Array.isArray(SEA.nodes) ? SEA.nodes : []).filter(n => n && n.n && isDay(n.date)).sort((a, b) => a.date.localeCompare(b.date));
    const nextN = (allNodes.find(n => n.date >= NOW) || {}).n;
    const byMonth = [...new Set(allNodes.map(n => n.date.slice(0, 7)))];
    const ms = byMonth.map(m => `<section><h3>${m.slice(0, 4)} · ${monL(m + "-01")}</h3><ol>${allNodes.filter(n => n.date.slice(0, 7) === m).map(n => {
      const ts = tasks.filter(t => t.n === n.n);
      return `<li id="${esc(n.n)}" class="${n.date < NOW ? "is-past" : ""}${n.n === nextN ? " is-next" : ""}"><time datetime="${n.date}">${md(n.date)}${n.n === nextN ? ` · ${tx("下一個", "next")}` : ""}</time><div><p>${esc(L(n.t))}<code>${esc(n.n)}</code></p>${L(n.pass) ? `<small>${tx("過關條件：", "Pass: ")}${esc(L(n.pass))}</small>` : ""}${ts.length ? `<small>${ts.map(t => `${esc(t.id)} ${chip(t.st, late(t))}`).join(" ")}</small>` : ""}</div></li>`; }).join("")}</ol></section>`).join("");

    const nStuck = tasks.filter(t => t.st === "stuck").length, nLate = tasks.filter(late).length, nDone = tasks.filter(t => t.st === "done").length;
    root.innerHTML = `<div class="wrap">
      ${hero([tx(`資料截至 ${md(RM.asof)}`, `Data as of ${md(RM.asof)}`), tx("每週日晚上更新", "Updated every Sunday evening")], "Roadmap",
        tx("每條 pipeline 的核心任務、時程和進度。狀態來自每週表單裡大家回報的進度，組長可以手動改。", "The core tasks of each pipeline, their dates and progress. Status comes from what members report in the weekly form; leads can set it by hand."), mockNote(RM))}
      <div class="c-stats">
        <div class="c-stat"><small>${tx("已完成", "Done")}</small><b>${nDone}<span> / ${tasks.length}</span></b></div>
        <div class="c-stat"><small>${tx("卡住", "Stuck")}</small><b style="color:${nStuck ? "var(--stuck)" : "inherit"}">${nStuck}</b><span>${tx("有人回報卡住", "reported stuck")}</span></div>
        <div class="c-stat"><small>${tx("逾期", "Overdue")}</small><b>${nLate}</b><span>${tx("過了截止日還沒完成", "past due, not done")}</span></div>
        ${(() => { const nn = allNodes.find(n => n.n === nextN), d = nn ? diff(NOW, nn.date) : null;
          return `<div class="c-stat"><small>${tx("下一個里程碑", "Next milestone")}</small><b>${nn ? (d === 0 ? tx("今天", "Today") : `${d}<span> ${tx("天後", d === 1 ? "day" : "days")}</span>`) : "–"}</b><span>${nn ? `${md(nn.date)} · ${esc(L(nn.t))}` : ""}</span></div>`; })()}
      </div>
      <h2 class="c-h">${tx("各 pipeline 進度", "Each pipeline")}</h2>
      <div class="c-pipes">${tiles}</div>
      <h2 class="c-h">${tx("時程", "Timeline")}</h2>
      <div class="c-bar"><div class="c-seg">${[["*", tx("全部", "All")], ...PIPES.filter(p => health.some(h => h.p.k === p.k)).map(p => [p.k, L(p)])].map(([k, l]) => `<button data-set-pl="${k}" aria-pressed="${S.pl === k}">${esc(l)}</button>`).join("")}</div>
        <button class="c-tog" data-hot aria-pressed="${S.hot}">${tx("只看卡住和逾期", "Only stuck and overdue")}</button></div>
      <div class="c-leg">${["done", "doing", "stuck", "todo"].map(k => `<span><i style="--c:${ST[k][2]}"${k === "todo" ? ' class="todo"' : ""}></i>${esc(stName(k))}</span>`).join("")}<span><i class="ring"></i>${tx("逾期", "Overdue")}</span><span><i class="dia"></i>${tx("里程碑（紅色是 iGEM 截止）", "Milestone (red: iGEM deadline)")}</span></div>
      <div class="gantt"><div class="g-in">${head}${rows}</div></div>
      <p class="c-note">${tx("左右滑動看整年。滑過或點一條任務看細節。誰卡在什麼、需要誰幫忙，只在老師週會的 dashboard 上。", "Scroll sideways for the whole year. Hover or tap a task for details. Who is stuck on what, and what help they need, is only on the instructors' meeting dashboard.")}</p>
      <h2 class="c-h" id="milestones">${tx("里程碑", "Milestones")}</h2>
      <p class="c-sub">${tx("每個里程碑的日期和過關條件。標 ? 的日期是推估。", "Every milestone with its date and pass condition. Dates marked ? are estimates.")}</p>
      <div class="ms">${ms || `<p class="empty">${tx("里程碑資料沒有載入。", "Milestones did not load.")}</p>`}</div>
    </div>`;
    // scroll the gantt so "now" is in view
    const gw = root.querySelector(".gantt"); if (gw) gw.scrollLeft = Math.max(0, (x(NOW) / 100) * gw.scrollWidth - gw.clientWidth * .45);
    root._tip = el => {
      if (el.dataset.task) { const t = tasks.find(z => z.id === el.dataset.task); if (!t) return "";
        return `<b>${esc(L(t.t))}</b>${chip(t.st, late(t))}<span style="margin-top:6px">${md(t.s)} – ${md(t.e)} · ${esc(pipeName(t.pl))}</span>${t.n && NODE[t.n] ? `<span>${tx("里程碑", "Milestone")} ${esc(t.n)}：${esc(L(NODE[t.n].t))}</span>` : ""}<span>${t.nE ? tx(`${t.nP} 人寫過 ${t.nE} 筆；最近一次 ${md(t.last)}`, `${t.nE} entries by ${t.nP} people; last ${md(t.last)}`) : tx("還沒有人寫過", "No entries yet")}</span>${t.set ? `<span>${tx("狀態由組長設定", "Status set by a lead")}</span>` : ""}`; }
      if (el.dataset.node) { const n = NODE[el.dataset.node]; return n ? `<b>${esc(L(n.t))}</b><span>${md(n.date)} · ${esc(n.n)}${n.lane === "deadline" ? tx(" · iGEM 截止", " · iGEM deadline") : ""}</span>${L(n.pass) ? `<span>${esc(L(n.pass))}</span>` : ""}` : ""; }
      return "";
    };
  }

  // ================= Research =================
  function research() {
    if (!RS || !Array.isArray(RS.cards) || !Array.isArray(RS.rqs)) { root.innerHTML = off("Research"); return; }
    const P = Object.fromEntries((RS.people || []).map(p => [p.id, p]));
    const RQ = Object.fromEntries(RS.rqs.map(q => [q.id, q]));
    const cards = RS.cards.filter(c => c && c.p && isDay(c.wk)).slice().sort((a, b) => b.wk.localeCompare(a.wk) || b.id.localeCompare(a.id));
    const weeks = [...new Set(cards.map(c => c.wk))].sort();
    const last = weeks[weeks.length - 1];
    const by = (k, v) => cards.filter(c => c[k] === v);
    const av = id => { const p = P[id]; return `<span class="av" title="${esc(p ? p.n : id)}">${esc(p ? p.ini : "?")}</span>`; };
    const nm = id => (P[id] ? P[id].n : id);
    const link = u => (/^https?:\/\//i.test(u || "") ? u : "");

    const rqCard = q => {
      const cs = by("rq", q.id), ppl = [...new Set(cs.map(c => c.p))], latest = cs[0];
      return `<button class="rq" data-rq="${esc(q.id)}" aria-pressed="${S.rq === q.id}">
        <header><code>${esc(q.id)}</code><span class="chip">${esc(pipeName(q.pl))}</span><span class="chip chip--${q.st}">${{ open: tx("開放", "Open"), answered: tx("有答案", "Answered"), closed: tx("關閉", "Closed") }[q.st] || ""}</span></header>
        <h3>${esc(L(q.q))}</h3>${q.why ? `<p class="why">${tx("會改變：", "Decides: ")}${esc(q.why)}</p>` : ""}
        ${q.ans ? `<p class="ans">${q.ai ? `<em>${tx("AI 草稿", "AI draft")}</em>` : ""}${esc(L(q.ans))}</p>` : ""}
        ${latest && latest.take ? `<p class="why">${tx("最新：", "Latest: ")}${esc(latest.take)}</p>` : ""}
        <footer><span>${tx(`${cs.length} 份來源`, `${cs.length} source${cs.length === 1 ? "" : "s"}`)}</span><span class="avs">${ppl.slice(0, 6).map(av).join("")}${ppl.length > 6 ? `<span class="av">+${ppl.length - 6}</span>` : ""}</span></footer></button>`;
    };
    const counts = {}; cards.forEach(c => { counts[c.p] = (counts[c.p] || 0) + 1; });
    const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || nm(a).localeCompare(nm(b)));
    const maxC = Math.max(1, ...Object.values(counts));
    const wkN = weeks.map(w => [w, by("wk", w).length]), maxW = Math.max(1, ...wkN.map(x => x[1]));
    const match = c => (!S.rq || c.rq === S.rq) && (!S.who || c.p === S.who) && (!S.q || `${c.src} ${c.take} ${nm(c.p)} ${c.rq}`.toLowerCase().includes(S.q.toLowerCase()));
    const shown = cards.filter(match);
    const open = RS.rqs.filter(q => q.st === "open").length;

    root.innerHTML = `<div class="wrap">
      ${hero([tx(`資料截至 ${md(RS.asof)}`, `Data as of ${md(RS.asof)}`), tx("每週日晚上更新", "Updated every Sunday evening")], "Research",
        tx("GEMS 是研究中心。每一張卡是一位隊員讀過的一份文獻、資料或專家意見，以及它對專案的意義。全部公開，掛在讀的人名下。", "GEMS is a research centre. Each card is one paper, dataset or expert view a member read, and what it means for the project. All of it is public, under the name of whoever read it."), mockNote(RS))}
      <div class="c-stats">
        <div class="c-stat"><small>${tx("來源", "Sources")}</small><b>${cards.length}</b><span>${tx("整季", "this season")}</span></div>
        <div class="c-stat"><small>${tx("最近一週", "Latest week")}</small><b>${last ? by("wk", last).length : 0}</b><span>${last ? md(last) : ""}</span></div>
        <div class="c-stat"><small>${tx("貢獻的人", "Contributors")}</small><b>${ranked.length}</b></div>
        <div class="c-stat"><small>${tx("開放中的研究問題", "Open questions")}</small><b>${open}</b><span>${tx(`共 ${RS.rqs.length} 題`, `of ${RS.rqs.length}`)}</span></div>
      </div>
      ${RS.digest ? `<div class="digest"><small>${tx(`AI 每週摘要 · ${md(RS.digest.wk || RS.asof)}`, `AI weekly digest · ${md(RS.digest.wk || RS.asof)}`)}</small><p>${esc(L(RS.digest))}</p></div>` : ""}
      <h2 class="c-h">${tx("研究問題", "Research questions")}</h2>
      <p class="c-sub">${tx("每一題都寫了它會改變哪個決定。點一題，下面只列這一題的來源。", "Each question says which decision it would change. Tap one to list only its sources below.")}</p>
      <div class="rqs">${RS.rqs.map(rqCard).join("") || `<p class="empty">${tx("還沒有研究問題。", "No research questions yet.")}</p>`}</div>
      <div class="c-two">
        <div class="panel"><h3>${tx("每週新增的來源", "Sources added each week")}<span>${tx("最多", "max")} ${maxW}</span></h3>
          <div class="vbars" role="img" aria-label="${esc(tx("每週新增來源數", "Sources per week"))}">${wkN.map(([w, n]) => `<div data-tipx="${esc(`${md(w)} · ${n}`)}"><i style="height:${(n / maxW) * 100}%"></i></div>`).join("")}</div>
          <div class="vax"><span>${weeks[0] ? md(weeks[0]) : ""}</span><span>${last ? md(last) : ""}</span></div></div>
        <div class="panel"><h3>${tx("誰貢獻了來源", "Who contributed")}<span>${tx("點名字看他的貢獻頁", "Tap a name for their page")}</span></h3>
          <div class="rank">${ranked.slice(0, 10).map((id, i) => `<a href="attributions.html?who=${esc(id)}"><span class="n">${i + 1}</span>${av(id)}<span>${esc(nm(id))}</span><span class="bar"><i style="width:${(counts[id] / maxC) * 100}%"></i></span><span class="v">${counts[id]}</span></a>`).join("")}</div>
          ${ranked.length > 10 ? `<p class="c-note">${tx(`另外 ${ranked.length - 10} 人也有貢獻；在下面用名字搜尋。`, `${ranked.length - 10} more contributed; search by name below.`)}</p>` : ""}</div>
      </div>
      <h2 class="c-h" id="cards">${tx("所有來源", "Every source")}</h2>
      <div class="c-bar">
        <input class="c-find" type="search" data-q value="${esc(S.q)}" placeholder="${tx("搜尋：名字、關鍵字", "Search: name, keyword")}" autocomplete="off">
        ${S.rq ? `<button class="c-tog" data-rq="" aria-pressed="true">${esc(S.rq)} ✕</button>` : ""}
        ${S.who ? `<button class="c-tog" data-who aria-pressed="true">${esc(nm(S.who))} ✕</button>` : ""}
        <span class="c-note" style="margin:0">${tx(`${shown.length} 筆`, `${shown.length} shown`)}</span></div>
      <ol class="feed">${shown.slice(0, S.n).map(c => { const q = RQ[c.rq], u = link(c.link);
        return `<li><time datetime="${c.wk}">${md(c.wk)}</time>${av(c.p)}<div><p>${esc(c.take || c.src)}</p>
          ${c.take && c.src ? `<p class="src">${u ? `<a class="c-a" href="${esc(u)}" target="_blank" rel="noopener">${esc(c.src)} ↗</a>` : esc(c.src)}</p>` : ""}
          <p class="meta"><a href="attributions.html?who=${esc(c.p)}">${esc(nm(c.p))}</a>${q ? ` · ${esc(q.id)} ${esc(L(q.q))}` : ""}${c.task ? ` · ${esc(c.task)}` : ""}</p></div></li>`; }).join("") || `<li><p class="empty">${tx("沒有符合的來源。", "No source matches.")}</p></li>`}</ol>
      ${shown.length > S.n ? `<button class="more-btn" data-more>${tx(`再顯示 40 筆（還有 ${shown.length - S.n}）`, `Show 40 more (${shown.length - S.n} left)`)}</button>` : ""}
      <p class="c-note">${tx("想加一張卡？在每週表單的「研究」部分填一筆就好。", "To add a card, fill in the research part of the weekly form.")}</p>
    </div>`;
    root._tip = el => (el.dataset.tipx ? `<b>${esc(el.dataset.tipx)}</b><span>${tx("新增的來源", "sources added")}</span>` : "");
  }

  // ---------- events ----------
  const render = () => { hideTip(); (PAGE === "research" ? research : roadmap)(); };
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-set-pl],[data-pl],[data-hot],[data-rq],[data-who],[data-more]"); if (!b) return;
    if (b.dataset.setPl) { S.pl = b.dataset.setPl; render(); }
    else if (b.dataset.pl) { S.pl = b.dataset.pl; render(); const t = document.getElementById("pl-" + S.pl); if (t) t.scrollIntoView({ block: "center" }); }
    else if ("hot" in b.dataset) { S.hot = !S.hot; render(); }
    else if ("rq" in b.dataset) { S.rq = S.rq === b.dataset.rq ? "" : b.dataset.rq; S.n = 40; render(); if (S.rq) document.getElementById("cards").scrollIntoView({ block: "start" }); }
    else if ("who" in b.dataset) { S.who = ""; render(); }
    else if ("more" in b.dataset) { S.n += 40; render(); }
  });
  root.addEventListener("input", e => { if ("q" in e.target.dataset) { S.q = e.target.value; S.n = 40; const pos = e.target.selectionStart; render(); const i = root.querySelector("[data-q]"); i.focus(); i.setSelectionRange(pos, pos); } });
  const tipOn = e => { const el = e.target.closest("[data-task],[data-node],[data-tipx]"); if (el && root._tip) { const h = root._tip(el); if (h) showTip(el, h); } };
  root.addEventListener("mouseover", tipOn); root.addEventListener("focusin", tipOn);
  root.addEventListener("mouseout", e => { if (e.target.closest("[data-task],[data-node],[data-tipx]")) hideTip(); });
  root.addEventListener("focusout", hideTip);
  addEventListener("scroll", hideTip, { passive: true });
  document.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b && (b.dataset.lang === "zh" || b.dataset.lang === "en")) { S.lang = b.dataset.lang; render(); } });
  render();
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView({ block: "start" }); }
})();
