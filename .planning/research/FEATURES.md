# Feature Landscape

**Domain:** Browser board game (race, hot-seat, one shared screen) that teaches Reformed theology through "hard questions" on board spaces, in a satirical-but-accurate voice. Must ship as an installable, offline-capable PWA.
**Researched:** 2026-09-29
**Overall confidence:** MEDIUM-HIGH. The theological reference map rests on primary texts I read directly (marked [V]). The app-landscape and satire findings rest on web search results (the GSD confidence seam classes WebSearch/WebFetch summaries as LOW, so they are treated as LOW-to-MEDIUM here and flagged).

## How to read the verification marks

The quality gate for this milestone is "no citation ships unless checked against a primary source". Every reference below carries its status.

| Mark | Meaning |
|------|---------|
| [V] | I read the exact text in a public edition this session (edition named in Sources). Section numbers and the quoted or paraphrased content were confirmed. |
| [K] | Scripture reference and content confirmed in the KJV text via bible-api.com. The BSB, ESV and NET wording was NOT checked (see Pitfall: translation drift). |
| [S] | Seen only in a search-result snippet or secondary page. Do not ship without a primary-source check. |
| [U] | From my own knowledge, not checked this session. Treat as a research lead, not a fact. |

Confession references in the question bank (WCF chapter.section, Dort Head.Article, Heidelberg Q, Institutes Book.Chapter.Section) are all [V] unless a "(U)" follows. Scripture is [K] unless "(U)" follows.

**Scope updates applied after the brief:** (1) Affectionate ribbing of Catholics is now allowed alongside Calvinist self-satire, provided Catholic positions are stated accurately. This changes the earlier PROJECT.md decision "Calvinists are the butt of the satire", so that Key Decision should be edited. (2) The game must be a PWA (installable, playable offline after first load).

---

## Table Stakes

Features whose absence makes the product feel broken or untrustworthy for this audience.

### A. Question card and content

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Question card opens when a token lands on a question space | The whole milestone | Low | Card is a modal/overlay over the board; dismiss with one large "Continue" control. No auto-advance. |
| Three layers on every card: quip (1 line), plain answer (2-3 sentences), collapsed "Go deeper" | Locked decision; matches how comparable apps layer content (New City Catechism app pairs a short answer, a kid short answer, Scripture, commentary and prayer per question) | Med | Use native disclosure semantics (details/summary or button with aria-expanded) so it works by keyboard and screen reader. Irony ends at layer 1: the plain answer must read as a straight statement a child cannot misread as literal. |
| Fixed question on each of the 18 existing special spaces | Locked decision | Low | Mapping proposed in the Question Bank below. Fire once on landing, not on every turn a player sits in a trap (Slough, Dark Night, Valley are "hold until color drawn" spaces). |
| Generic question spaces draw from a pool, no repeats within a game | Locked decision | Med | Needs a per-game "seen" set and an exhaustion rule (see Pitfalls). Pool must exceed the number of landings in a 4-player game; see Gaps. |
| Ordering rule for shortcut spaces | Correctness | Low | Recommend: question resolves first, then the shortcut jump (Narrow Way 48 to 60, Path of Election 85 to 97). Needs a decision in requirements. |
| Citations shown in "Go deeper" in one consistent format | Core value: "citations anyone can check" | Low | Format: `WCF 3.1`, `Dort I.5`, `HC 26`, `Inst. III.21.5 (Beveridge)`, `Summa I q.23 a.3`. Each citation is a link to the primary text where a stable public URL exists. |
| Framing as "the Reformed answer", not "the correct answer" | Mixed audience includes outsiders and other traditions; also keeps the quiz honest | Low | Card labels: "What Reformed Christians say" / "Where that comes from". This is the single cheapest fairness feature. |
| Every quotation and citation verified against a primary source, recorded per item | Locked constraint | Med | Content schema carries a `verified` field per citation and a build-time check that fails on unverified items in shipped content. |
| Rewrite of static copy that implies fatalism | Locked requirement | Low | Targets: setup "There are no decisions..." (jsx line 404), TULIP glosses (lines 408-412), "Play Again (as if you had a choice)", end-screen "The others were never going to arrive". Drafts in the Voice section. |
| Setup-screen Calvin epigraph replaced with a verified quote | The current text is not III.21.5 | Low | I read Institutes III.21.5 (Beveridge, CCEL). The setup text ("God preordained, for his own glory and the display of His attributes of mercy and justice ...") does not appear in Inst. III.21-24, WCF or Dort I as worded, so it is a paraphrase of unknown origin. Real III.21.5 begins "By predestination we mean the eternal decree of God, by which he determined with himself whatever he wished to happen with regard to every man." Options for a kid-safe opener: Heidelberg Q1 (comfort), or Inst. III.24.5 (Christ as the mirror of election). |
| Kid-safe language throughout the plain-answer layer | Locked requirement | Low | Reading-level target about grade 6 to 8 [inference]. No hell imagery in layers 1 and 2. |

### B. Quiz mode (optional, toggled at setup)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Setup toggle "Quiz mode" default off | Locked decision | Low | Off means the card skips straight to answer reveal. |
| Multiple choice with 3 options (4 max), tap to answer | Bible trivia apps standardize on multiple choice; families and kids need low friction | Med | Options under about 12 words each so they fit a portrait phone. Randomize option order per showing. |
| Immediate reveal: correct option marked, then plain answer, then Go deeper | Bible trivia apps show an explanation and verse link after each answer (search results, LOW confidence) | Low | Correctness cue must not rely on color alone (icon + text). aria-live announcement. |
| No penalty for a wrong answer; "Pass" behaves the same as wrong | Kids, learners and outsiders; a penalty would also revive the "no real decisions" problem from the other direction | Low | Wrong and Pass both: no bonus, answer still revealed. Trivial Pursuit ends the turn on a miss and rewards a hit with a re-roll; this game should be far gentler [S]. |
| Small fixed movement bonus for a correct answer | Locked decision | Med | Recommend +1 or +2 spaces, decided in requirements. The bonus is a movement event and must define behavior when it lands on a trap, shortcut or another question space (recommend: bonus movement never triggers a new question; traps and shortcuts still resolve normally, or bonus skips over traps). Touches the movement engine. |
| No timers, no buzzers, no failure sounds | A shared-screen class or family game; timers punish slow readers and non-native speakers | Low | Listed in Anti-Features too. |
| Distractors are real positions or named misconceptions | Fairness to other traditions and to the confessions | Med | Each wrong option maps to a labeled error (fatalism, "God is the author of sin", foreseen-faith, license to sin). The reveal says why it is wrong. Never a strawman of a living tradition. |

### C. Bible translation selector (BSB / ESV / KJV / NET)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Choose translation on the setup screen | Locked decision | Low | Segmented control with four labeled choices and a one-line descriptor each. |
| Abbreviation after every quoted verse, e.g. "(ESV)" | Bible Gateway shows the version abbreviation next to the passage reference and in the header [V, fetched page]; Crossway requires the initials after quotations in non-saleable media [V, Crossway ESV permissions page as fetched by the sibling researcher] | Low | Also satisfies NET's "(NET)" designation rule [V, NET copyright page as fetched by the sibling researcher]. |
| Attribution notice reachable for the active translation | Licensing | Low | Bible Gateway puts the copyright line below the passage with a link to the publisher [V]. Recommend a persistent "Bible text" footer/panel showing the exact notice for the active translation plus a per-verse abbreviation. Exact wording and limits are STACK.md's job (ESV: 500-verse and 25% limits, no Creative Commons, "not a biblical reference work" exclusion; NET: notice text and "(NET)" designation; both as read on the publishers' pages). |
| Verse text bundled in the app, only the verses actually cited | Static site, no secret keys, and the PWA must work offline | Med | Build step generates a `verses[ref][translation]` map from a source file. Keeps the bundle small and keeps quoted volume inside license limits. |
| Answer prose does not depend on one translation's wording | Translations diverge on exactly these verses | Med | Examples confirmed in KJV: Acts 13:48 "ordained" (BSB/ESV say "appointed" [U]); Rom 9:22 "fitted to destruction" vs "prepared for" [U]; 1 Tim 2:4 "will have all men to be saved" vs "desires" [U]. Write plain answers as paraphrase; put wording notes in Go deeper. |
| "Read in context" external link per verse (online only) | Bible Gateway and YouVersion both let readers jump to the full chapter | Low | Must degrade gracefully offline (see PWA). |

### D. PWA: installable and playable offline after first load

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Web app manifest: name, short_name, icons 192 and 512 plus a maskable icon, start_url, scope, display standalone, theme and background color | Installability criteria (manifest with name, icons, start_url, display; service worker; HTTPS) per web.dev/MDN search results [S] | Low | GitHub Pages serves HTTPS. `vite-plugin-pwa` derives scope from the Vite `base` option, and `vite.config.js` sets base `/pilgrims-predestined-path/` [V, vite-pwa docs and repo config], so verify scope and start_url in the built manifest. Use `orientation: any` so the projector case is not locked to portrait. |
| Service worker precaches the app shell, JS/CSS, icons, fonts, and the bundled verse data | "Playable offline after first load" | Med | Workbox via `vite-plugin-pwa`. Precache list is small because only cited verses are bundled. |
| Self-hosted fonts | The game loads EB Garamond from fonts.googleapis.com via a `<link>` in the JSX [V, jsx lines 391 and 429]. That request fails offline and leaks a third-party call | Low | Self-host (for example a fontsource package) and precache. Without this, offline "works" but renders in a fallback face. |
| Update handling that never reloads mid-game | There are no saved games (out of scope), so an auto-reload destroys a game in progress | Med | `vite-plugin-pwa` offers `registerType: 'autoUpdate'` or `'prompt'` and `offlineReady` / `needRefresh` callbacks [V, docs]. Use `prompt`; show "Update ready" only on the setup screen or after game end, and apply on the next New Game. |
| "Ready to play offline" confirmation, once | Users need to know the install worked | Low | Use the `offlineReady` callback; a small dismissible toast on first load. |
| Install affordance on the setup screen | Chromium fires `beforeinstallprompt`, a non-standard, Chromium-only API [V, MDN]; iOS has no equivalent | Med | Two paths: a custom "Install" button on Chromium browsers; on iOS show short manual steps ("Share, then Add to Home Screen"). iOS 16.4+ allows install from non-Safari browsers via the Share menu, older iOS only via Safari [S, MDN/web.dev results]. Never show during play. |
| External links (Bible context, primary-source links) degrade offline | Otherwise dead links appear in an offline app | Low | Detect `navigator.onLine`; disable or relabel external links ("needs internet"). |

### E. Layout and pacing that affect the above

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Card readable on a portrait phone and legible from across a room on a projector | Locked audience (class, family) | Med | Large type token; card scrolls internally; board stays visible behind a dimmed overlay. Target under about 45 seconds for a normal quip-plus-answer read with Go deeper closed [inference]. |
| Explicit device hand-off cue | One device passed around | Low | "Pass to Player 3" after the card is dismissed. |

---

## Differentiators

Not expected, but they are what make this game different from a catechism app or a generic Bible trivia game. No direct competitor was found in search (a Reformed-theology race board game with satire); confidence LOW because search coverage is thin.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Satirical-but-accurate voice, every quip checked by a "would a Reformed pastor wince" and "would an outsider be misled" pass | The product's identity; no catechism app does this | Med | See Voice section. Depends on the citation-verification pipeline. |
| Character voices on the six character spaces (Knox, Luther, Augustine, Lady Geneva, Brother Adam, Queen Wisdom) | The existing cast becomes a delivery mechanism instead of scenery | Low-Med | Quip is spoken "in character" but the plain answer is neutral. Do not put invented quotations in a real person's mouth; label as paraphrase or use verified quotes only. |
| Distractors that double as teaching ("Why this is wrong: ...") | Turns a quiz into a tour of the real debate, and lets outsiders see the other view stated fairly | Med | Builds on the quiz table stakes. |
| "Discuss" prompt at the bottom of Go deeper | Church classes and families get a conversation starter | Low | One optional line per question. |
| Fair-comparison answers for Catholic, Lutheran and Arminian views, with primary citations for their side | Accuracy and goodwill with outsiders; almost no other Reformed resource does this well | Med-High | Catholic side is verified in this research (Trent, CCC 1037, Aquinas). Lutheran and Arminian sides are [U] and need their own primary-source pass. |
| Translation compare (show the verse in two translations) | Shows why translation matters (Acts 13:48, Rom 9:22, 1 Tim 2:4) | Med | Bible Gateway offers parallel view via a `version=ESV;NIV` style parameter [V]. Deferred by default; also increases quoted verse volume for ESV. |
| Changeable translation from a menu mid-game | Class use: flip to KJV live | Low | Cheap once verses are looked up by `ref x translation` at render time. |
| Family-safe filter that omits the heaviest pool questions (reprobation, infant death, the unevangelized) | Content spans "families with kids" and seminary grads | Low-Med | Tag each pool question `weight: light or heavy`. The 18 fixed questions must all have a gentle framing because they cannot be filtered out. Decision for requirements. |
| Read-aloud button (Web Speech API) | Non-readers in a Candy Land style audience | Med | Voice availability varies by device [U]; ship late if at all. |
| Wake Lock while a game is in progress | One phone passed around should not dim mid-card | Low | Screen Wake Lock API, support varies [U]. |
| Custom install button with platform-specific iOS instructions | Higher install rate than relying on the browser | Med | Listed in table stakes as the minimum; the polished version is the differentiator. |
| Offline status only where it matters (external links) rather than a global banner | The core loop is fully offline, so a permanent banner is noise | Low | Ties to the PWA link behavior above. |

---

## Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Hard Questions library or index; end-of-game debrief; cross-game memory of seen questions | User declined (Out of Scope) | Per-game seen set only. |
| Timers, countdowns, buzzers, "wrong" sound stings | Punishes slow readers and kids; pushes a shared-screen game toward a quiz show | Quiet reveal, no time pressure. |
| Any penalty for a wrong quiz answer (move back, lose a turn) | Shame for learners; conflicts with kid audience and with the "small bonus" decision | Wrong equals Pass equals no bonus. |
| Scores, leaderboards, "Theology points", "Most elect" awards | Turns doctrine into a contest and invites the "who is elect" joke to land on real players | The race is the only scoreboard. |
| Labeling a real player as elect, reprobate, chosen or passed over (win/lose screens included) | Confessionally wrong to speculate about persons (Dort III/IV.7: do not pry into others; WCF 3.8) and hurtful in a room of real people | End screen speaks about the pilgrimage, not about verdicts on players. |
| Free-text or typed recall answers | Memorization-app pattern; wrong for a board game and impossible to grade fairly | Multiple choice only. |
| Live AI answers or a chat box | Static host, no keys, and the accuracy rule requires verified citations | Static reviewed content. |
| Runtime fetches of Bible text from a third-party API | Breaks offline, exposes a key in client code, and complicates licensing | Bundle cited verses at build time. |
| Auto-reloading service-worker updates during play | Destroys the current game | `prompt` mode; apply between games. |
| Push notifications, background sync, accounts, cloud saves, app-store wrapper | No server, hot-seat only, out of scope | None. |
| Jokes that assert the fatalist strawman as if it were the doctrine | The confessions reject it (WCF 3.1, 5.2, 9.1; Dort III/IV.16 "not ... senseless stocks and blocks") | Jokes may mock a Calvinist's smugness or stoicism; they must not present "nothing you do matters" as the teaching. |
| Attacking Catholic doctrine or sacred things: caricatures of the Mass, Eucharist, Mary, or the pope as a person; "Antichrist" language; "Romanist" | The scope update allows affectionate ribbing, not polemic. Also inaccurate: Catholics do not teach predestination to hell (CCC 1037 [V]) | Ribbing is limited to culture and habits that Catholics joke about themselves; positions are stated in the Church's own words (see Voice). |
| Quoting confession text that attacks other groups without context (for example the "Antichrist" phrase in the original 1646 WCF 25.6, [U]; the OPC text I read has only "Nor can the pope of Rome, in any sense, be head thereof" [V]) | Off-tone for the audience and easy to be uncharitable | Quote the neutral clause or paraphrase, and name the edition. |
| Jokes about damnation of specific groups, the death of children, depression or doubt | Kid audience; Valley of the Shadow and Dark Night spaces need warmth, not satire | Those cards use a warm quip or none. |
| Making irony carry the doctrine | Kids and outsiders will take the plain answer literally | Irony only in layer 1. |
| Personality quizzes ("Which Reformer are you?") | Off-scope and invites a scored verdict | None. |

---

## Feature Dependencies

```
Vite build works + Pages deploy (Actions) -> PWA manifest/service worker -> offline play
Self-hosted fonts -> offline play renders correctly
Content schema (quip, question, plain, deeper, citations[], scripture[], quiz{}, weight, verified) ->
    Question card UI -> layered disclosure
    Question card UI -> quiz mode (needs options + whyWrong fields) -> movement bonus (touches movement engine)
    Citation verification pipeline -> every shipped string
Question-space placement (~30-35 spaces) -> pool size -> no-repeat draw -> exhaustion rule
Fixed-space mapping (18) -> guaranteed-to-appear content gets verified first
Verse source file -> build-time verse map (ref x translation) -> translation selector -> attribution panel -> precache
Copy rewrite (rules, TULIP, end screen, epigraph) has no dependencies; do first, it fixes credibility on day one
Update flow (prompt mode) -> depends on setup screen having a place for the "update ready" notice
```

---

## MVP Recommendation

Prioritize:
1. Deploy and build fixed (already a prior phase), then the **copy rewrite** (TULIP, rules, epigraph, end screen). Cheapest, highest credibility gain.
2. **Content schema and layered question card**, wired to the 18 fixed spaces with fully verified content.
3. **Pool of generic questions** to at least the count the simulation demands (see Gaps), verified.
4. **Translation selector with bundled verses and attribution.**
5. **Quiz mode** with no-penalty rules and a small bonus.
6. **PWA** (manifest, precache, self-hosted fonts, prompt-mode updates, install button). Can start in parallel with content once the build is stable.

Defer: translation compare, read-aloud, wake lock, family-safe filter (unless the user wants it in v1), character-voice polish beyond the six spaces.

**Open decisions for requirements:** bonus size and its interaction with traps, shortcuts and question spaces; who answers the quiz (active player only, or the table); whether the translation choice is remembered between visits (a settings preference, distinct from the declined "seen questions" memory); whether heavy pool questions get a filter; how a second visit to an already-asked fixed space behaves (recommend: nothing, treat as a plain space).

---

## Question Bank (43 candidates: 18 fixed + 25 pool)

Answers below are the Reformed confessional answer in one line, for the roadmap and content phases. They are not shippable copy. Slots for the 18 existing special spaces are the primary fit; a second suggestion is noted where a space could carry two.

### Fixed slots (18)

| # | Space (index) | Player-language question | Reformed answer (one line) | Confession / catechism / Institutes refs | Scripture | Handling |
|---|---------------|--------------------------|-----------------------------|------------------------------------------|-----------|----------|
| F01 | Brother Adam (8) | Can't I just choose God whenever I like? | The will is free, but after the Fall it is in bondage regarding spiritual good; God's grace frees it to choose gladly. | WCF 9.1, 9.3, 9.4; Dort III/IV.3, III/IV.10 | Eph 2:1; John 6:44; Rom 5:12; 1 Cor 15:22 | Light. Also fixes the "T" gloss. |
| F02 | John Knox (24) | If God has already chosen who is saved, why bother telling anyone? | God ordains the means with the end; preaching is the means (Acts 18: "I have much people in this city"). | WCF 3.6, 14.1; Dort I.3 | Rom 10:14; Acts 18:9-10; 2 Tim 2:10; Acts 16:30-31 | Light. |
| F03 | Martin Luther (42) | Is faith something I do or something God gives? | Faith is the only instrument of justification and is itself God's gift; Rome and Reformed differ on the role of cooperation. | WCF 11.1, 11.2, 14.1; Dort III/IV.14; Trent Sess. VI canon 4 [V, papalencyclicals.net] | Eph 2:8-10 | Light. Fair statement of Trent canon 4 (free will "moved and excited by God" cooperates). |
| F04 | Augustine (74) | Didn't Calvin just invent all this? | No. Augustine argued the grace-and-predestination case against Pelagius a millennium earlier; Aquinas also taught predestination and reprobation-as-permission. | Augustine, On the Predestination of the Saints ch. 19 (NPNF, New Advent) "between grace and predestination there is only this difference, that predestination is the preparation for grace, while grace is the donation itself"; Aquinas, Summa I q.23 a.3, a.5, a.7 (article titles confirmed) | Rom 8:29-30; Eph 1:4-5 | Light. Luther, Bondage of the Will (1525), predates Calvin's Institutes (1536 first edition) [U on dates; verify]. Calvin's line about writing a confession from Augustine's works is [S] only, do not quote until located in the Treatise on Eternal Predestination. |
| F05 | Lady Geneva (90) | Are Calvinists the only ones going to heaven? | No. The church chosen for eternal life is drawn from every nation, and Reformed confessions treat churches as more or less pure, not as a club. | HC 54; WCF 25.1, 25.2, 25.4, 25.5 | Rev 7:9; 1 Cor 1:12-13 | Light and funny. Caution: WCF 25.2 says of the visible church "out of which there is no ordinary possibility of salvation"; the answer must handle that nuance honestly (the visible church there means all who profess the true religion, not one denomination). |
| F06 | Queen Wisdom (108) | Isn't it arrogant to claim to know God's secret plans? | The secret things belong to God; we handle predestination with prudence and humility, from what is revealed. | WCF 3.8; Dort I.14, III/IV.7 | Deut 29:29; Rom 11:33-36 (in Dort I.18 text) | Light. Inst. III.21.1 on curiosity is [U]; read before citing. |
| F07 | Slough of Despond (35) | How can I know I'm elect? | Not by peeking at the decree. Look to Christ and to the fruits of faith; assurance is a duty to seek and is given by the Spirit. | WCF 18.1, 18.2, 18.3; Dort I.12, V.9; Inst. III.24.5 ("Christ, then, is the mirror in which we ought ... to contemplate our election"); HC 1 | Rom 8:16; 2 Pet 1:10; 1 John 5:13 | Light-to-warm. Matches the trap's "stuck, need a color". Fire once on entry. |
| F08 | Dark Night of the Soul (65) | What if my faith feels dead? | Assurance can be "shaken, diminished, and intermitted" but true believers are never left without the seed of faith; a bruised reed he will not break. | WCF 18.4, 17.3; Dort V.5, V.6, I.16 | Isa 42:3; Matt 12:20; Rom 8:38-39 | Warm, gentle. Not satirical. Also keep the mental-health sensitivity in mind. |
| F09 | Valley of the Shadow (98) | If God is in control, why does he let terrible things happen? | Providence covers even sin and suffering, yet God is never the author of sin, and he turns evils to the good of his people. | HC 26, 27, 28; WCF 5.4, 5.5, 5.7 | Gen 50:20; Rom 8:28; Ps 23:4; Lam 3:32-33; Job 42:2 | Warm. HC 26 wording "make whatever evils he sends upon me ... turn out to my advantage" is in the 1563-style translation on CCEL; quote from a public-domain translation and name it. |
| F10 | The Narrow Way (48) | What about people who never hear the gospel? | The confession teaches salvation only through Christ and by the Word; God's justice and the size of his mercy are not ours to fix, and we are told to send messengers. | WCF 10.4 (also 10.3 "and where ... he pleaseth"); Dort I.3 | Rom 10:14; Acts 4:12; Rom 1:20; Rom 2:14-15; Gen 18:25; John 14:6; Matt 7:13-14 | Heavy. WCF 10.4 is blunt ("very pernicious, and to be detested") about salvation through other religions; do not use that line in layer 1 or 2. Narrow-gate verse fits the space name. |
| F11 | Path of Election (85) | Isn't it unfair that God chooses some and not others? | God owes salvation to no one; all deserved condemnation, so election is mercy, not an injustice to the rest. | Dort I.1, I.7, I.15, I.18; WCF 3.5, 3.7 | Rom 9:14-24; Gen 18:25; Matt 20:15 | Medium. The literal shortcut on the board makes this the natural place for the Romans 9 fairness question. |
| F12 | Forest of Scripture (17) | Is predestination really in the Bible, or just a couple of proof texts? | It is taught across Paul and John; the confession also holds that necessary doctrine is clear enough for the unlearned. | WCF 1.6, 1.7; Dort I.6, I.10 | Eph 1:4-5; Rom 8:29-30; Acts 13:48; John 6:37, 6:44; John 15:16; Jer 1:5; Amos 3:2 | Light. Include a translation note (Acts 13:48). |
| F13 | Mount Sinai (55) | If we can't keep God's law, why did he give it? | The law shows sin, drives us to Christ, and remains a rule of life for the forgiven, whom the Spirit enables. | WCF 19.2, 19.5, 19.6, 19.7, 9.3; Augustine, Confessions X.29 (40), "Give what You command, and command what You will" [V, New Advent] | Rom 3:20; Gal 3:24 | Light. |
| F14 | The Cloister (70) | If grace is free, do good works count for anything? | They are fruits and evidences of faith, done from thankfulness, never earning pardon; the confession says no one can do more than God requires. | WCF 16.2, 16.4, 16.5, 16.6, 13.1; HC 86, 64 | Eph 2:8-10; Jas 2:17; Matt 5:16; Titus 3:8 | Light; rich satire vein (see Voice). |
| F15 | The Dark Wood (80) | Is God the author of sin? | No. God ordains all that comes to pass, yet neither is he the author of sin, nor is violence done to the will of creatures. | WCF 3.1, 5.4, 6.1; Dort I.5, I.15 | Jas 1:13; Gen 50:20; Acts 2:23; Acts 4:27-28; Isa 10:5 | Medium. The Acts 2:23 pattern (God's plan, and yet "wicked hands") is the clearest Scripture illustration. |
| F16 | Sea of Providence (103) | If God has already decided everything, why pray? | God ordains the means along with the ends; prayer is one of the means and a duty for all. | WCF 3.6, 5.2, 5.3, 21.3; HC 116; Inst. III.20.3 ("It was not so much for his sake as for ours"; Elijah in 1 Kings 18:42) | Matt 6:8; 1 Kings 18:42; Jas 5:17; Isa 38:5; Acts 27:22, 27:31 | Light. Acts 27 (safe voyage promised, yet "Except these abide in the ship, ye cannot be saved") is a memorable means-and-ends example. |
| F17 | Castle of Rome (118) | How do Reformed and Catholic Christians differ? | They share Augustine's heritage of grace and both reject predestination to sin; they differ on justification, assurance, authority, and the role of the saints. | Trent Sess. VI ch. 12, canons 4, 16, 17 [V]; CCC 1037 [V]; Aquinas Summa I q.23 a.3 [V]; WCF 11.1, 18.2, 21.2, 25.6 | Rom 5:1 (U) | Fair-comparison card. Catholic side quoted from Catholic sources only (see Voice for the verified lines). |
| F18 | Celestial City (127) | Can a real Christian lose their salvation? (Hebrews 6) | True believers can fall into grievous sin but not totally or finally; God preserves them, and those who fall away finally were never truly his. | WCF 17.1, 17.2, 17.3; Dort V.3, V.6, V.7, V.8; Trent Sess. VI canon 16 (contrast) | Heb 6:4-6, 6:9; Heb 10:26; 1 John 2:19; John 10:28-29; Phil 1:6; Matt 7:21-23 | Medium. Hebrews 6:9 ("we are persuaded better things of you") is the usual pivot. |

### Pool (25)

| # | Player-language question | Reformed answer (one line) | Refs | Scripture | Weight |
|---|--------------------------|----------------------------|------|-----------|--------|
| P01 | Isn't Calvinism just fatalism? | No. The decree does no violence to the will and establishes second causes; means are ordained; prayer and duty are real. | WCF 3.1, 3.6, 5.2, 9.1; Dort III/IV.16 | Acts 27:22, 27:31; Phil 2:12-13 | Light. Highest priority: it is the tone-fix question. |
| P02 | If God ordained everything, how can he blame me? | Humans act freely and are accountable; God's purpose and the creature's guilt are both real (Acts 2:23). | WCF 3.1, 5.4, 6.1; Dort I.5 | Rom 9:19-20; Acts 2:23; Gen 50:20 | Medium |
| P03 | Why did God let Adam fall at all? | The confession says God was pleased to permit it "having purposed to order it to his own glory"; Calvin calls the decree dreadful and still refuses to make God the author of sin. | WCF 6.1; Dort I.1; Inst. III.23.7 ("The decree, I admit, is dreadful") | Rom 9:20; Deut 29:29 | Heavy |
| P04 | Does God send people to hell for no reason? | Reprobation is "passing by" and then condemning for sin, never condemning the innocent; the Reformed tradition is asymmetrical here. | WCF 3.3, 3.7; Dort I.6, I.15; contrast CCC 1037 [V]; Aquinas Summa I q.23 a.3 [V] | Rom 9:22 | Heavy. Use "eternal death" wording, not graphic imagery. |
| P05 | Are election and reprobation two mirror images? | No. Salvation is God's gift; the guilt of unbelief and sin "is no wise in God, but in man himself". | Dort I.5, I.6, I.15; WCF 3.7 | Rom 9:22-23 (compare "prepared" phrasing across translations) | Medium |
| P06 | Did God choose me because he knew I would believe? | No. He chose without any foresight of faith or works, and faith is the fruit of election. | WCF 3.2, 3.5, 10.2; Dort I.9, I.10; Inst. III.21.5 (Beveridge, on prescience) | Eph 1:4; Acts 13:48; Rom 9:11-13; Jer 1:5; Amos 3:2 | Medium. State the Arminian view fairly (Remonstrance 1610 is [U]; get the primary text). |
| P07 | Did Jesus die for everyone or only the elect? (John 3:16) | His death is sufficient for all and effectual for the elect; the gospel promise is for everyone who believes. | Dort II.3, II.5, II.6, II.8; WCF 3.6, 8.5, 8.8 | John 3:16; John 10:15; 1 John 2:2; 1 Tim 4:10 | Medium. Note that "Limited" in the game's TULIP list currently mis-glosses this. |
| P08 | Doesn't God want everyone saved? (1 Timothy 2:4) | God sincerely calls all who hear and takes no pleasure in the death of the wicked; his decree of election is a separate matter from his revealed command. | Dort III/IV.8, II.5; WCF 7.3 | 1 Tim 2:4; 2 Pet 3:9; Ezek 33:11; Ezek 18:23; Deut 29:29 | Medium. KJV "will have all men to be saved" vs other translations [U]. |
| P09 | What is hyper-Calvinism, and is it the same thing? | No. Hyper-Calvinism denies the free offer of the gospel to all; the Reformed confessions require the offer. | WCF 7.3 ("freely offereth unto sinners life and salvation by Jesus Christ"); Dort II.5, III/IV.8, III/IV.9 | Isa 55:1; Rev 22:17; Acts 16:30-31 | Light. Historical figures (Andrew Fuller, Spurgeon) are [U]. |
| P10 | If grace is irresistible, does God drag people in against their will? | No. God renews the will so that they come "most freely, being made willing by his grace". | WCF 10.1; Dort III/IV.12, III/IV.16 | Ps 110:3; Ezek 36:26; John 6:37 | Light. Fixes the "I" gloss ("you must go"). |
| P11 | Does "total depravity" mean everyone is as bad as possible? | No. It means sin touches every part; "glimmerings of natural light" remain but cannot save. | WCF 6.4, 9.3, 16.7; Dort III/IV.4 | Rom 2:14-15; Rom 3:20 | Light. Fixes the "T" gloss. |
| P12 | If I'm elect, can I just sin freely? | No. The Heidelberg Catechism asks this exact objection: it is impossible that those grafted into Christ should not bring forth fruits of thankfulness. | HC 64, 86; Dort I.13, V.12, V.13; WCF 16.2, 17.3 | Rom 6:1-2; Titus 3:8 | Light. HC 64 is quotable and funny ("does not this doctrine make men careless and profane?"). |
| P13 | What if I'm not elect? | The confessions tell the anxious not to rank themselves among the reprobate; "he will not quench the smoking flax". Look to Christ; whoever comes he will not cast out. | Dort I.16; WCF 3.8; Inst. III.24.5 | John 6:37; Isa 55:1; Rev 22:17; Isa 42:3 | Heavy but pastoral. Warm tone required. |
| P14 | Can I tell who else is elect? | No, and we are told not to pry into God's judgments on others. | Dort III/IV.7; WCF 3.8 | Deut 29:29; Matt 7:21-23; 1 John 2:19 | Light. Satire target: the cage-stage habit of labeling people. |
| P15 | What happens to babies who die? | The confession speaks of "elect infants, dying in infancy" and Dort tells believers not to doubt the salvation of their children who die; the tradition rests this on God's mercy and covenant promise, and does not say more. | WCF 10.3; Dort I.17 | 2 Sam 12:23; Matt 19:14 | Heavy. Do not go beyond what the texts say. Reformed views on non-elect infants vary [U]. |
| P16 | Why pray for someone's salvation if it is already settled? | God commands prayer for all sorts of people, and prayer is a means he uses. | WCF 21.4, 21.3, 3.6; Inst. III.20.3 | Rom 10:1; 2 Tim 2:10 | Light |
| P17 | Should I share the gospel with everyone, even people who seem hopeless? | Yes. The promise and the command to repent and believe go to all persons "promiscuously and without distinction". | Dort II.5, I.3; WCF 7.3 | Acts 16:30-31; Rom 10:14 | Light |
| P18 | Where do Lutherans and Reformed agree and disagree? | Both hold the bondage of the will and salvation by grace; Lutherans generally reject double predestination. | Formula of Concord Art. XI (U); Luther, Bondage of the Will (U) | Eph 1:4-5 | Medium. Entirely [U]; needs a primary-source pass before use. |
| P19 | How do Arminians differ, and are they still Christians? | Arminians hold election is conditioned on foreseen faith, grace can be resisted, and perseverance is conditional; both sides confess salvation by grace through faith in Christ. | Remonstrance (1610) and Dort's rejection of errors (U); WCF 3.2, 3.5 | Rom 8:29 | Medium. Entirely [U] on the Arminian side; obtain the Five Articles text. |
| P20 | Is election of individuals or of the church as a group? | Reformed confessions speak of a "certain number of persons"; other views treat election as corporate. | Dort I.7; WCF 3.4 | Eph 1:4; Rom 8:29-30 | Medium. Advanced. |
| P21 | If God chose us, why did Jesus need to die? | The chosen are redeemed by Christ; the decree includes the means, and the cross is the means. | WCF 3.6, 8.5, 8.8; HC 1; Dort II.8 | Eph 1:4-5; Rom 8:29-30 | Light |
| P22 | Are there a limited number of seats in heaven? | The number is "certain and definite" to God, not a cap that turns away anyone who comes. | WCF 3.4; Dort I.11; Aquinas Summa I q.23 a.7 (title confirmed) | Rev 7:9; John 6:37 | Light. Ripe for a quip. |
| P23 | Doesn't believing this make Calvinists arrogant? | It should do the opposite; election is matter for "daily humiliation" and nobody has anything they did not receive. | Dort I.13; WCF 3.8 | 1 Cor 4:7; Rom 11:20; Eph 2:8-9 | Light. Core self-satire slot (cage-stage). |
| P24 | Isn't all this depressing? Where is the comfort? | Election is taught for consolation: God keeps his own and nothing separates them from his love. | HC 1; WCF 3.8 ("abundant consolation"); Dort I.6 ("unspeakable consolation") | Rom 8:38-39 | Light |
| P25 | Did God harden Pharaoh, or did Pharaoh harden himself? | Scripture says both, in that order: Pharaoh hardens his heart first, then God hardens it; God hardens as judge, never as author of sin. | WCF 5.6; Dort I.6 | Exod 8:15; Exod 9:12; Rom 9:17-18 | Medium |

**Coverage check against the brief:** why pray (F16, P16), why evangelize (F02, P17), author of sin (F15, P02), free will and compatibilism (F01, P01, P10), unjust and Romans 9 (F11, P05), assurance (F07, F08), perseverance and Hebrews 6 (F18), particular redemption and John 3:16 and 1 Tim 2:4 (P07, P08), foreseen faith (P06), infants and unevangelized (P15, F10), suffering and providence (F09), why obey (F13, F14, P12), did Calvin invent it (F04), Reformed and Catholic (F17), hyper-Calvinism and the well-meant offer (P09), double predestination and "pass by" (P04, P05). Each letter of TULIP has at least one question: T (F01, P11), U (P06), L (P07), I (P10), P (F18).

**Pool size warning:** 43 is the candidate count, but with about one landing in three turns and 2 to 4 players, a game could ask for more distinct questions than 43. See Gaps.

---

## Voice: satire done fairly

**Findings (confidence LOW to MEDIUM, from search results):** Reformed self-deprecation already has a recognizable vocabulary. "Cage-stage Calvinist" (a newly convinced Calvinist who should be kept in a cage until calmer) is used by Reformed writers themselves (R.C. Sproul Jr., Ligonier, Gentle Reformation, The Good Book Company pieces surfaced in search) and is satirized by the Babylon Bee ("Animal Control Corrals Cage-Stage Calvinist After Biting Incident"; "Calvinist Nods Stoically After Being Ambushed by Surprise Party"; "Man Showing No Signs Of Repentance In His Life Still Pretty Sure He's One Of The Elect"). "Frozen chosen" is a slang term for Presbyterians [U]. The lesson: the jokes that land while staying accurate mock behavior (smugness, over-eager Romans 9 debates, presuming election without fruit, Puritan vocabulary, committee love). They do not assert that the doctrine makes life meaningless. The confessions themselves condemn presumption (Dort I.13; HC 64), so a joke aimed at presumption is on the Reformed side of the line.

**Rules for this game**

1. Irony lives in layer 1 only. The plain answer and Go deeper are straight.
2. Target behavior and habits, not doctrine. "Ambushed by a surprise party" style stoicism jokes are safe only if the punchline is the person, not "nothing matters".
3. Quips on Slough, Dark Night and Valley spaces are warm or omitted (doubt, depression, suffering).
4. No hell jokes, no jokes about infant death, no jokes that name a group as damned.
5. Every joke must survive two readers: a Reformed pastor ("is this what we believe?") and a curious outsider ("does this teach me something false?").
6. Reading level for layers 1 and 2 around grade 6 to 8 [inference].

**Catholic ribbing (scope update)**

- Allowed: affectionate, culture-level humor that Catholics tell about themselves (Latin, standing-sitting-kneeling, long liturgies, fish fries, guilt, patron saints for everything) [U as to which jokes are recognized by Catholics; test with Catholic readers if possible].
- Test: would a practicing Catholic recognize this as their own joke and laugh with rather than at?
- Symmetry: for every joke at Catholic culture, there is a sharper one at Reformed culture in the same play session [inference].
- Never: the Mass or Eucharist, Mary, the pope as a person, "idolatry" or "works-salvation" caricature, anything from the polemical wing of confession history.
- Accuracy: state Catholic positions in the Church's own words. Verified this session: CCC 1037 ("God predestines no one to go to hell; for this, a willful turning away from God (a mortal sin) is necessary, and persistence in it until the end") [V, vatican.va]; Council of Trent Sess. VI canon 4 (free will "moved and excited by God" cooperates), canon 16 (no one may claim absolute certainty of perseverance without special revelation), canon 17 (anathema on the claim that those not predestined to life are "predestined unto evil"), chapter 12 (except by special revelation, it cannot be known whom God hath chosen unto himself) [V, papalencyclicals.net and history.hanover.edu, English translations]; Aquinas, Summa I q.23 a.3 "Whether God reprobates any man?" answers "God does reprobate some" and frames it as permitting defects under providence [V, newadvent.org]. This gives a fair statement: both traditions deny predestination to sin, both use Augustine, and they differ on assurance and on how grace and cooperation relate.
- Trent's chapter 12 is a sleeper source for the Slough of Despond card: both traditions warn against presuming one's own election, they differ over whether assurance is normally attainable (WCF 18.3 says yes).

**Draft rewrites of the offending static lines (drafts for the copy pass, not verified doctrine):**

| Current | Problem | Draft direction |
|---------|---------|-----------------|
| "There are no decisions. The deck was shuffled before you sat down." | Presents fatalism as doctrine | "Your cards were shuffled before you sat down. Every prayer, every answer and every bad joke at this table is still yours." |
| "Play Again (as if you had a choice)" | Fatalism gag | "Play Again (God ordains the means; you are the means)" (WCF 3.6 in one line) |
| TULIP "L: Not every pilgrim reaches Glory." | That is reprobation, not particular redemption | "Christ's death is enough for the whole world and effective for all who are given to him." (Dort II.3, II.8) |
| TULIP "I: When drawn forward, you must go." | Reads as coercion | "God's call changes the heart, so you come gladly." (WCF 10.1; Dort III/IV.12) |
| TULIP "T: You cannot choose your path." | Denies the will | "Sin touches every part of us, so we cannot rescue ourselves." (Dort III/IV.3) |
| End: "The others were never going to arrive." | Speaks a verdict on players | Speak about the road, not about verdicts on real people |

**Sample quips (drafts to show register only):**
- Sea of Providence: "Yes, God knew you were going to ask. That is why he told you to."
- Path of Election: "Free shortcut, no line. Complaints go to Romans 9."
- Dark Wood: "The Confession says God is not the author of sin. It also says he is not surprised by it. Theologians have been arguing about the semicolon ever since."
- Cloister: "The Confession has a word for doing more than God requires. It is 'supererogate', and the Confession says you cannot." (WCF 16.4 [V])
- Castle of Rome: "The moat is full of Latin. The drawbridge is full of good questions."

---

## How existing products present Q&A and quizzes

Findings are LOW to MEDIUM confidence (search snippets, app-store text).

- **New City Catechism app** (Crossway/TGC/Redeemer): 52 Q&As, each paired with ESV Scripture, a short prayer, and devotional commentary by pastors (Piper, Keller, DeYoung) plus historical figures (Augustine, Calvin, Luther); children's mode with short answers and songs. Takeaway: a short answer for kids and a fuller layer for adults is an established pattern; there is no evidence of a scored quiz [S].
- **Westminster Shorter Catechism apps** (several, for example one with Review, Practice and Quiz tabs): Review shows the full answer; Practice offers Hint and Show Answer; Quiz picks random questions with a configurable range and an "only mastered" toggle; users mark items as mastered. Takeaway: hide/show-answer, hint and self-mark are the memorization-app norm; those are recall tools, not a board-game fit [S].
- **Bible trivia apps**: multiple choice (some fill-in-the-blank), explanations or verse links after answering, pass-and-play for up to 4 players in at least one [S].
- **Trivial Pursuit** (the classic board-game quiz): a correct answer continues the turn; a miss passes the turn; other players read the question aloud; "roll again" spaces speed play [S]. This game's bonus should be much smaller and there should be no turn loss.
- **Reformed board games**: none surfaced in search; nearby items were Sola Fide: The Reformation (two-player history card game), The Reformers (Reformation-themed board game) and party card games. None combine a race board with a Q&A layer [S, LOW].

**Table stakes the precedents imply:** answer reveal with explanation, source link, multiple choice with few options, pass-and-play awareness, clear correct/incorrect state. **What the precedents do not solve and this game must decide:** pacing with 2 to 4 players and a question every third turn, kids as non-readers, and the fairness of grading a doctrinal answer that other traditions dispute. The framing "the Reformed answer" handles the last one.

**Translation selector UX precedents (MEDIUM):** Bible Gateway uses a language-grouped dropdown, a Parallel view, the version abbreviation in the header and next to the reference, and the copyright line below the passage [V, fetched]. YouVersion reaches versions via a picker and a parallel pane and offers 1,400+ versions [S]. New City Catechism uses a single fixed translation (ESV) [S]. For four translations a dropdown is overkill; a segmented control on setup is enough, with the choice reachable again from a menu.

---

## Sources

**Primary texts read this session [V]:**
- Westminster Confession of Faith, OPC edition: https://www.opc.org/wcf.html (chapters 1, 3, 5-11, 13-14, 16-19, 21, 25 read in full; this is the American-revised text; the original 1646 text differs in places such as 25.6 [U], so name the edition shipped).
- Canons of Dort (Head.Article): text copy at https://www.semperreformanda.com/creeds/canon-of-dordt/ (Heads I, II, III/IV, V read). This copy contains transcription errors ("an draw", "without out aid", "begin sufficient", "Spirt"), so re-verify each shipped quotation against a critical public-domain edition before quoting verbatim.
- Heidelberg Catechism, CCEL public-domain translation: https://www.ccel.org/creeds/heidelberg-cat.html (Q1, 21, 26-28, 54, 64, 86, 116 read). The 2011 CRC/RCA translation is a different, copyrighted text; do not mix.
- Calvin, Institutes (Beveridge translation, CCEL): https://www.ccel.org/ccel/calvin/institutes.v.xxi.html (III.20, prayer), institutes.v.xxii.html (III.21), institutes.v.xxiv.html (III.23), institutes.v.xxv.html (III.24). CCEL's URL suffix runs one ahead of the chapter number. The Battles translation is copyrighted; quote Beveridge and name it.
- Augustine, On the Predestination of the Saints, ch. 19: https://www.newadvent.org/fathers/15121.htm; Confessions X.29 (40): https://www.newadvent.org/fathers/110110.htm
- Aquinas, Summa Theologiae I q.23 aa.3, 5, 7 (article titles and openings): https://www.newadvent.org/summa/1023.htm
- Council of Trent Session VI: https://www.papalencyclicals.net/councils/trent/sixth-session.htm and https://history.hanover.edu/texts/trent/CT06D1.html
- Catechism of the Catholic Church 1037: https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_three/article_12/iv_hell.html
- Scripture references [K]: bible-api.com KJV endpoint (references and KJV wording only).
- Crossway ESV permissions page and NET Bible copyright page, as fetched into this session's shared scratch folder by a sibling research task; licensing limits belong to STACK.md.
- Local code: `pilgrims-predestined-path.jsx` (Google Fonts links at lines 391 and 429; TULIP text at lines 408-412; epigraph at lines 397-398; special spaces at lines 8-27).

**Web research (LOW to MEDIUM, snippets and fetched summaries):**
- New City Catechism app: https://newcitycatechism.com/mobile-apps and https://apps.apple.com/us/app/new-city-catechism/id564035762
- Westminster Shorter Catechism apps: https://apps.apple.com/app/id1443680325 (Review, Practice, Quiz tabs)
- Bible trivia app examples: https://apps.apple.com/app/id1532616861 and https://apps.apple.com/app/id626342259
- Trivial Pursuit rules overview: https://en.wikipedia.org/wiki/Trivial_Pursuit
- Cage-stage Calvinism and Reformed humor: https://rcsprouljr.com/?p=8977 (Sproul Jr.), https://learn.ligonier.org/articles/escaping-cage-stage, https://www.thegoodbook.com/blog/interestingthoughts/2019/04/04/7-signs-that-youre-a-cage-stage-calvinist/
- Bible Gateway passage page (selector and copyright placement): https://www.biblegateway.com/passage/?search=Romans+9%3A14-18&version=ESV
- PWA: https://vite-pwa-org.netlify.app/guide/ and /guide/pwa-minimal-requirements.html; https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent (non-standard, limited availability); https://web.dev/learn/pwa/installation and MDN "Making PWAs installable" (via search).

## Gaps and items to resolve later

- **Scripture in BSB, ESV, NET:** only the KJV was checked. A per-verse matrix across all four translations is required before shipping (Acts 13:48, Rom 9:22, 1 Tim 2:4, Eph 1:5 are the known divergences).
- **Pool sizing needs simulation, not my estimate.** Turns per game and question landings per player depend on the existing color-card movement and the final placement of 30-35 question spaces. With 2 to 4 players and one landing in three turns, distinct questions needed per game may exceed 43. Define the exhaustion fallback (recommend: treat as a plain space) and size the pool from a simulation in the architecture phase.
- **Lutheran and Arminian sides (P18, P19)** and the Calvin-on-Augustine and Luther "hinge" quotations are unverified and should not ship until located in primary texts. Luther's Bondage of the Will exists in a public-domain older translation (Cole) and a copyrighted modern one (Packer and Johnston); pick the public-domain one to quote.
- **Which edition of each confession to ship** (WCF American revision vs 1646; Dort typos; HC translation) must be chosen and named.
- **Second Council of Orange (529)** would give a strong "Catholic history rejects predestination to evil" citation for F04 and F17 but was not checked [U].
- **Server-side or licensing question for ESV**: the ESV page says quotation is limited to 500 verses, under 25% of the work, and not in "a commentary or other biblical reference work" [V]. Whether a Q&A game counts is a licensing judgment for STACK.md.
- **Reformed attitudes toward the unevangelized and non-elect infants (F10, P15)** vary in the tradition and beyond the confession's text; the answer should say what the confession says and stop.
- **Competitor coverage** is thin because search returned few direct matches; MEDIUM at best.
