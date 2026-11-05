# GEMS 2027 Project Hub

The front door for the GEMS Taiwan 2027 iGEM team. Students open it every week, often every day, to see this week's goals, the next milestone, homework, who owns what, and every link the team uses.

GEMS Taiwan 2027 iGEM 隊的入口。學生每週、甚至每天打開：這週的目標、下一個里程碑、作業、誰負責什麼，以及全隊用到的所有連結。

**Live:** https://timmy97-tw.github.io/GEMS-iGEM-2027-Hub/

It is one half of a pair. The [GEMS iGEM System](https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/) site explains why the team works this way; this hub says what to do today. Both run on the same nodes, seats and rules, and the language choice (中 / EN) carries from one site to the other.

## Pages

| Page | Answers |
|---|---|
| `index.html` Today | What matters right now: next node, this week's goals, news, what is due, quick links, the year at a glance |
| `week.html` This week | Goals with an owner each, a seven-day strip, what falls due, the weekly routine checklist, the records in use this week |
| `milestones.html` Milestones | Every node with its date, pass condition, owner and who accepts it; as a list or a month calendar |
| `homework.html` Homework | What to do, when it is due, where it is handed in, who reads it |
| `announcements.html` News | Notices for the whole team, newest first |
| `team.html` Team | Who to ask about what, and every seat with its weekly work, nodes, sheets and backup |
| `attributions.html` Credits | How credit builds up through the year, who owns each area, help from outside the team |
| `links.html` Links | Drive folders, workbooks, templates, the System site, the wiki, official iGEM pages, tools |
| `guide.html` Guide | The weekly checklist, seven rules, three gates, the ID cheat sheet, file names, where every record goes |

Press `/` (or `⌘K`) anywhere to search all of it at once.

## Updating it

Everything a person edits is one line in `data/`. Push to `main` and the site updates in about a minute.

| To do this | Edit |
|---|---|
| Post an announcement | Add an entry at the top of `data/announcements.js` |
| Set this week's goals | Add an entry at the top of `WEEKS` in `data/week.js` |
| Set homework | Add an entry to `data/homework.js` with a new `id` |
| Add or change a link | `data/links.js`; put the URL in an entry that has `url: ""` to open it |
| Name the person in a seat | `HOLDERS` in `data/team.js` (read the note there first) |
| Record outside help | `OUTSIDE` in `data/attributions.js` |
| Change a node, seat, rule or folder | **Not here.** Edit `assets/data.js` in GEMS-iGEM-SYSTEM |

Each file starts with a comment that gives the exact shape of an entry.

`data/season.js` is generated. A GitHub Action copies the nodes, phases, seats, rules, IDs, Hub Sheet tabs, Drive folders and document year from the System site every night, and can be started by hand from the Actions tab. To run it yourself:

```bash
node tools/sync-season.js > data/season.js
```

## What stays off this site

This repo is public. Team-level information only.

- Never: contact details, individual progress, who has or has not handed in, grades, reviews, fees, discipline, research strategy, unpublished project content, a Discord invite, or any link into the instructor-only Ops Drive.
- A person's own task rows live in the Hub Sheet, Tasks tab. The hub shows team goals and links to the sheet; it does not copy the rows.
- Names: seats are shown, not people. Before a name goes in `data/team.js` or `data/attributions.js`, the PI decides what a public page may show and the person agrees. Outside helpers also need an agreed consent record (a `K`).
- Drive links are fine here because Drive checks the account. Never set a linked folder or file to "anyone with the link".

Ticks, starred links and the "I am in" choice are stored in the reader's own browser and sent nowhere.

## Files

- `assets/hub.js`: the shell, the search and every page. `assets/hub.css`: all styles.
- `data/`: content, Chinese and English side by side.
- `tools/sync-season.js`: the sync. `.github/workflows/sync-season.yml`: its nightly run.

No build step and no external requests. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

Add `?now=2027-03-24` to any page to see it as it will look on that day.
