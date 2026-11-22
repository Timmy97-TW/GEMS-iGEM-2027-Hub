// Usage: node tools/check-board-data.js [path/to/board-data.js]   (default: data/board-data.js in this repo)
// Checks the contribution board's data against attribution-tools/CONTRACT.md and assets/board-spec.js.
// Run it before every push of data/board-data.js. Errors exit 1; warnings are printed and do not fail the run.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const FILE = path.resolve(process.argv[2] || path.join(ROOT, "data", "board-data.js"));
const SPEC_FILE = path.join(ROOT, "assets", "board-spec.js");
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

// Run a classic script in an empty sandbox and read back one top-level const.
function readConst(file, name) {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(file, "utf8") + `\n;this.__out = typeof ${name} !== "undefined" ? ${name} : undefined;`, ctx, { filename: file, timeout: 2000 });
  return ctx.__out;
}

let D, SPEC;
try { SPEC = readConst(SPEC_FILE, "BOARD_SPEC"); } catch (e) { console.error(`Cannot load ${SPEC_FILE}: ${e.message}`); process.exit(1); }
try { D = readConst(FILE, "BOARD_DATA"); } catch (e) { console.error(`Cannot load ${FILE}: ${e.message}`); process.exit(1); }
if (!D || typeof D !== "object" || Array.isArray(D)) { console.error(`${FILE} does not define const BOARD_DATA as an object.`); process.exit(1); }

const keys = list => new Set((Array.isArray(list) ? list : []).map(x => x.k));
const AREAS = keys(SPEC.areas), ROLES = keys(SPEC.roles), GROUPS = keys(SPEC.groups), VALUES = keys(SPEC.values);
const LEVELS = new Set(["v", "o", "q", "b"]), STATUS = new Set(["done", "doing", "stuck", "todo"]), ATT = new Set(["P", "L", "E", "A"]);

const isStr = v => typeof v === "string" && v.trim() !== "";
const isNum = v => typeof v === "number" && isFinite(v);
const realDay = v => { if (typeof v !== "string" || !/^\d{4}-\d\d-\d\d$/.test(v)) return null; const t = new Date(v + "T00:00:00Z"); return isNaN(t) || t.toISOString().slice(0, 10) !== v ? null : t; };
const saturday = (v, where) => { const t = realDay(v); if (!t) err(`${where}: "${v}" is not a YYYY-MM-DD date`); else if (t.getUTCDay() !== 6) err(`${where}: ${v} is not a Saturday`); };
const show = v => JSON.stringify(v);

// ---------- top level ----------
const LISTS = ["weeks", "people", "tasks", "entries", "att", "hours"];
if (D.ok !== true) err(`ok must be true (got ${show(D.ok)})`);
if (typeof D.updated !== "string" || isNaN(Date.parse(D.updated))) err(`updated must be an ISO date-time string (got ${show(D.updated)})`);
LISTS.forEach(k => { if (!Array.isArray(D[k])) err(`${k} must be a list (got ${show(D[k])})`); });
if ("mock" in D && typeof D.mock !== "boolean") err(`mock must be true or false (got ${show(D.mock)})`);
if ("season" in D && typeof D.season !== "string") err(`season must be a string such as "2027" (got ${show(D.season)})`);
else if (typeof D.season === "string" && !/^\d{4}$/.test(D.season)) warn(`season "${D.season}" is not a four-digit year`);
Object.keys(D).filter(k => !["ok", "updated", "mock", "season", ...LISTS].includes(k)).forEach(k => warn(`unknown top-level key "${k}"`));
const L = k => (Array.isArray(D[k]) ? D[k] : []);
const dupes = (list, keyOf, what) => { const seen = new Set(); list.forEach((x, i) => { const k = keyOf(x); if (k == null) return; if (seen.has(k)) err(`${what} ${k} appears twice`); seen.add(k); }); };
const objOnly = (k) => L(k).filter((x, i) => { if (x && typeof x === "object" && !Array.isArray(x)) return true; err(`${k}[${i}] is not an object`); return false; });

// ---------- people ----------
const people = objOnly("people"), P = new Set();
people.forEach((p, i) => {
  const at = `people[${i}]${isStr(p.id) ? " " + p.id : ""}`;
  if (!isStr(p.id)) err(`${at}: id missing`); else P.add(p.id);
  if (!isStr(p.n)) err(`${at}: n (name) missing`);
  if (!isStr(p.ini)) err(`${at}: ini missing`); else if (p.ini.length > 2) warn(`${at}: ini "${p.ini}" is longer than two letters`);
  if (p.g !== null && !GROUPS.has(p.g)) err(`${at}: g ${show(p.g)} is not a group in board-spec.js (${[...GROUPS].join(" ")}) or null`);
  if (!ROLES.has(p.role)) err(`${at}: role ${show(p.role)} is not a role in board-spec.js (${[...ROLES].join(" ")})`);
});
dupes(people, p => (isStr(p.id) ? p.id : null), "person");

// ---------- tasks ----------
const tasks = objOnly("tasks"), T = new Set();
tasks.forEach((t, i) => {
  const at = `tasks[${i}]${isStr(t.id) ? " " + t.id : ""}`;
  if (!isStr(t.id)) err(`${at}: id missing`); else T.add(t.id);
  if (!isStr(t.t)) err(`${at}: t (title) missing`);
  if (t.g !== null && !GROUPS.has(t.g)) err(`${at}: g ${show(t.g)} is not a group in board-spec.js or null`);
  if (t.area != null && !AREAS.has(t.area)) err(`${at}: area ${show(t.area)} is not an area in board-spec.js`);
  if (!STATUS.has(t.st)) err(`${at}: st ${show(t.st)} is not one of ${[...STATUS].join(" ")}`);
  if (t.owner != null && !isStr(t.owner)) err(`${at}: owner must be a person ID or null`);
  else if (isStr(t.owner) && !P.has(t.owner)) warn(`${at}: owner ${t.owner} is not in people (an instructor?)`);
});
dupes(tasks, t => (isStr(t.id) ? t.id : null), "task");

// ---------- entries ----------
const entries = objOnly("entries"), dropped = new Set();
entries.forEach((e, i) => {
  const at = `entries[${i}]${isStr(e.id) ? " " + e.id : ""}`;
  if (!isStr(e.id)) err(`${at}: id missing`);
  saturday(e.wk, `${at} wk`);
  if (!P.has(e.p)) err(`${at}: person ${show(e.p)} is not in people`);
  if (e.task != null && !isStr(e.task)) err(`${at}: task must be a task ID or null`);
  else if (isStr(e.task) && !T.has(e.task)) dropped.add(e.task);
  if (e.area != null && !AREAS.has(e.area)) err(`${at}: area ${show(e.area)} is not an area in board-spec.js (${[...AREAS].join(" ")})`);
  if (e.area == null) warn(`${at}: no area`);
  if (e.part != null && typeof e.part !== "string") err(`${at}: part must be text or null`);
  if (!isStr(e.what)) err(`${at}: what is empty`);
  if (e.ev != null && typeof e.ev !== "string") err(`${at}: ev must be a link or null`);
  else if (isStr(e.ev) && !/^https?:\/\//i.test(e.ev)) warn(`${at}: ev "${e.ev}" is not an http(s) link, so the board will not link it`);
  if (e.lv !== null && !LEVELS.has(e.lv)) err(`${at}: lv ${show(e.lv)} is not v, o, q, b or null`);
  if (e.vt != null && !VALUES.has(e.vt)) err(`${at}: vt ${show(e.vt)} is not a value type in board-spec.js (${[...VALUES].join(" ")})`);
  if (e.vt != null && e.lv !== "v") err(`${at}: vt is set but lv is ${show(e.lv)}; vt is only for ★ (v)`);
  if (typeof e.pend !== "boolean") err(`${at}: pend must be true or false`);
  if (typeof e.redo !== "boolean") err(`${at}: redo must be true or false`);
  if (e.redo === true && e.pend !== true) warn(`${at}: redo is true but pend is false`);
});
dupes(entries, e => (isStr(e.id) ? e.id : null), "entry");
dropped.forEach(id => warn(`task ${id} is named by entries but not in tasks (dropped?)`));

// ---------- attendance ----------
const att = objOnly("att");
att.forEach((a, i) => {
  const at = `att[${i}]`;
  saturday(a.wk, `${at} wk`);
  if (!P.has(a.p)) err(`${at}: person ${show(a.p)} is not in people`);
  if (!ATT.has(a.s)) err(`${at}: s ${show(a.s)} is not P, L, E or A`);
});
dupes(att, a => (a.p && a.wk ? `${a.p} on ${a.wk}` : null), "attendance for");

// ---------- hours ----------
const hours = objOnly("hours");
hours.forEach((h, i) => {
  const at = `hours[${i}]`;
  if (!P.has(h.p)) err(`${at}: person ${show(h.p)} is not in people`);
  if (typeof h.month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(h.month)) err(`${at}: month ${show(h.month)} is not YYYY-MM`);
  ["on", "off"].forEach(k => { if (!isNum(h[k]) || h[k] < 0) err(`${at}: ${k} must be a number, 0 or more (got ${show(h[k])})`); });
});
dupes(hours, h => (h.p && h.month ? `${h.p} in ${h.month}` : null), "hours for");

// ---------- weeks ----------
const weeks = L("weeks");
weeks.forEach((w, i) => saturday(w, `weeks[${i}]`));
weeks.forEach((w, i) => { if (i && !(String(weeks[i - 1]) < String(w))) err(`weeks are not sorted, or repeat, at ${w}`); });
const W = new Set(weeks), used = new Set([...entries.map(e => e.wk), ...att.map(a => a.wk)].filter(realDay));
[...used].sort().forEach(w => { if (!W.has(w)) err(`weeks is missing ${w}, which has entries or attendance`); });
weeks.filter(w => !used.has(w)).forEach(w => warn(`week ${w} has no entries or attendance`));

// ---------- report ----------
const rel = path.relative(process.cwd(), FILE);
console.log(`${rel && !rel.startsWith("..") ? rel : FILE}${D.mock === true ? " (mock data)" : ""}${typeof D.season === "string" ? `, season ${D.season}` : ""}`);
console.log(`  ${people.length} people, ${tasks.length} tasks, ${entries.length} entries, ${att.length} attendance rows, ${hours.length} hours rows, ${weeks.length} weeks; updated ${D.updated}`);
warnings.forEach(m => console.log("  warning: " + m));
errors.forEach(m => console.log("  ERROR: " + m));
console.log(errors.length ? `${errors.length} error${errors.length === 1 ? "" : "s"}. Fix them before pushing.` : `OK${warnings.length ? `, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : ""}.`);
process.exit(errors.length ? 1 : 0);
