# GEMS 2027 Project Hub

The front door for the GEMS Taiwan 2027 iGEM team. Students open it every week, mostly on a phone, to see what to do this week, the next milestone, what homework is due, who to ask and where every link is.

GEMS Taiwan 2027 iGEM 隊的入口。學生每週打開，多半用手機：這週要做什麼、下一個里程碑、要交的作業、該問誰、連結在哪裡。

**Live:** https://timmy97-tw.github.io/GEMS-iGEM-2027-Hub/

It is one half of a pair. The [GEMS iGEM System](https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/) site explains why the team works this way; this hub says what to do now. The language choice (中 / EN) carries from one site to the other, and `?lang=en` opens any page in English.

## Pages

Five pages in the nav:

| Page | Answers |
|---|---|
| `index.html` Today | What do I do now: this week's goals, what is due next, the next milestone, the latest news, quick links |
| `roadmap.html` Roadmap | Each pipeline's core tasks, their dates and status (done, in progress, stuck, overdue), and every milestone with its pass condition. No names and no blocker text |
| `research.html` Research | Open research questions, every source a member read and what it means, who contributed, the AI weekly digest |
| `attributions.html` Growth | The contribution board: every task, entry, level, attendance and hours; each person's page adds a growth curve, their research cards and their Drive photos |
| `links.html` Links | Drive folders, workbooks, templates, the System site, the wiki, official iGEM pages, tools |

`week.html`, `homework.html`, `announcements.html`, `team.html` and `guide.html` still work and are linked from Today and the footer. `milestones.html` forwards to `roadmap.html#milestones`.

Press `/` (or `⌘K`) on any page to search all of it at once.

## Updating it

Everything a person edits is one entry in `data/`. Each file starts with a comment that shows the shape of an entry: copy one, change it, push to `main`. The site updates in about a minute.

| To do this | Edit |
|---|---|
| Set this week's goals | Add an entry at the top of `WEEKS` in `data/week.js` |
| Set homework | Add an entry to `data/homework.js` with a new `id` |
| Post news | Add an entry at the top of `data/announcements.js` |
| Add a link, or open one that was "not open yet" | `data/links.js`: add a line, or fill in its `url` |
| Change who to ask | `ASK` in `data/team.js` |
| Name the person in a seat | `HOLDERS` in `data/team.js` (read the note there first) |
| Record outside help | `OUTSIDE` in `data/attributions.js` |
| Update the board, roadmap and research | Not by hand. Every Sunday an agent rebuilds `data/board-data.js`, `data/roadmap.js` and `data/research.js` from the Core Sheet (steps in `attribution-tools/core/WEEKLY-UPDATE.md`, outside this repo) |
| Add or move a roadmap task | The Roadmap tab of the Core Sheet; it shows here after the next weekly update |
| Change a milestone, seat, rule or folder | **Not here.** Edit `assets/data.js` in GEMS-iGEM-SYSTEM |

If an entry is malformed or a file has a typo that stops it loading, the page still works: it leaves that entry out and says which file at the top of every page.

## Season data

`data/season.js` is generated. Never edit it by hand. A GitHub Action copies the milestones, phases, seats, rules, IDs, Hub Sheet tabs and Drive folders from the System site every night at 03:17 Taipei, and can be started by hand from the Actions tab. If the System data cannot be read or does not look right, the run fails and the last good copy stays in place.

To run it yourself (node, or macOS without node):

```bash
tools/sync.sh                     # from the live System site
tools/sync.sh path/to/data.js    # from a local copy
```

The pages do not assume how many milestones or seats there are, or what their codes are.

## What stays off this site

This repo is public. Team-level information only. The one exception is the contribution board, below.

- Never: names, contact details, individual progress, who has or has not handed in, grades, reviews, attendance, fees, discipline, research strategy, unpublished project content, a Discord invite, or any link into the instructor-only Ops Drive.
- A person's own rows live in the Hub Sheet. The hub shows team goals and links to the sheet; it does not copy the rows.
- Seats are shown, not people. Before a name goes in `data/team.js` or `data/attributions.js`, the PI decides what a public page may show and the person agrees.
- Drive links are fine here because Drive checks the account. Never set a linked folder or file to "anyone with the link".
- The Research page shows each source under the name of the member who read it (PI decision, 27 Nov 2026). The Roadmap page shows no names and no blocker text; those are only on the instructors' private meeting dashboard.
- Photos are never in this repo. `data/board-data.js` holds Drive file IDs only, and Drive decides who can see each photo. Never share a photo folder by link.
- The contribution board on `attributions.html` shows every member by name, with their entries, levels (including ○), attendance and hours. There is no login: anyone who opens the page sees all of it.
- The board's data is in this repo, in `data/board-data.js`. Every member's name, entries, levels, attendance and hours are in the public repo and stay in its git history after they change. The PI decided this on 22 Nov 2026.
- To change or take down anything on the board, fix the row in the Drive Attribution folder; the next weekly update carries it here. Older versions stay in git history.

"Handed in" ticks and starred links are stored in the reader's own browser and sent nowhere.

## Files

- `assets/hub.js`: the shell, the search and every page. `assets/hub.css`: all styles.
- `data/`: content, Chinese and English side by side.
- `tools/sync-season.js` and `tools/sync.sh`: the sync. `.github/workflows/sync-season.yml`: its nightly run.
- `assets/board.js` and `assets/board.css`: the contribution board on `attributions.html`. `assets/board-spec.js`: its levels, value types, roles, areas and seats, generated, no names.
- `assets/core.js` and `assets/core.css`: the Roadmap and Research pages.
- `data/roadmap.js` and `data/research.js`: their data, rewritten each week by `attribution-tools/core/build-core.js`. `"mock": true` marks demo data with invented names.
- `data/board-data.js`: the board's data, rewritten each week. `"mock": true` marks test data, and the board then says so next to its title. If the file is missing or broken, the board shows one line saying it could not read the data.
- `tools/check-board-data.js`: checks `data/board-data.js` against the data contract and the spec. Run it before every push of that file.

No build step. The only external requests are Drive photo thumbnails on a person’s page, and only when the data is real (not mock). Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

Add `?now=2027-03-24` to any page to see it as it will look on that day.

When `hub.js` or `hub.css` changes, raise the `?v=` number on the script and style tags in every HTML file so phones do not mix old and new files. The board's files are only on `attributions.html`; raise their `?v=` there.
