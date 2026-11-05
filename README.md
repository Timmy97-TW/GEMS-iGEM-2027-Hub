# GEMS 2027 Project Hub

The front door for the GEMS Taiwan 2027 iGEM team. Students open it every week, mostly on a phone, to see what to do this week, the next milestone, what homework is due, who to ask and where every link is.

GEMS Taiwan 2027 iGEM 隊的入口。學生每週打開，多半用手機：這週要做什麼、下一個里程碑、要交的作業、該問誰、連結在哪裡。

**Live:** https://timmy97-tw.github.io/GEMS-iGEM-2027-Hub/

It is one half of a pair. The [GEMS iGEM System](https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/) site explains why the team works this way; this hub says what to do now. The language choice (中 / EN) carries from one site to the other, and `?lang=en` opens any page in English.

## Pages

| Page | Answers |
|---|---|
| `index.html` Today | What do I do now: this week's goals, what is due next, the next milestone, the latest news, quick links, the year at a glance |
| `week.html` This week | The goals and the dates of one week; step back and forward through the weeks |
| `homework.html` Homework | What to do, when it is due, where it is handed in, who reads it |
| `milestones.html` Milestones | Every milestone with its date, pass condition, owner and who accepts it; as a timeline or a month calendar |
| `announcements.html` News | Notices for the whole team, newest first |
| `links.html` Links | Drive folders, workbooks, templates, the System site, the wiki, official iGEM pages, tools |
| `team.html` Owners | Who to ask about what, and every seat with its weekly work |
| `guide.html` Guide | For newcomers: what everyone does every week, the gates, the rules, IDs, file names, where each record goes |
| `attributions.html` Attributions | How credit builds up through the year, and help from outside the team |

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

This repo is public. Team-level information only.

- Never: names, contact details, individual progress, who has or has not handed in, grades, reviews, attendance, fees, discipline, research strategy, unpublished project content, a Discord invite, or any link into the instructor-only Ops Drive.
- A person's own rows live in the Hub Sheet. The hub shows team goals and links to the sheet; it does not copy the rows.
- Seats are shown, not people. Before a name goes in `data/team.js` or `data/attributions.js`, the PI decides what a public page may show and the person agrees.
- Drive links are fine here because Drive checks the account. Never set a linked folder or file to "anyone with the link".

"Handed in" ticks and starred links are stored in the reader's own browser and sent nowhere.

## Files

- `assets/hub.js`: the shell, the search and every page. `assets/hub.css`: all styles.
- `data/`: content, Chinese and English side by side.
- `tools/sync-season.js` and `tools/sync.sh`: the sync. `.github/workflows/sync-season.yml`: its nightly run.

No build step and no external requests. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8765
```

Add `?now=2027-03-24` to any page to see it as it will look on that day.

When `hub.js` or `hub.css` changes, raise the `?v=` number on the script and style tags in the nine HTML files so phones do not mix old and new files.
