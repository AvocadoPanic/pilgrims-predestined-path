# Pitfalls Research

**Domain:** Satirical-but-accurate Reformed theology board game (React + Vite, GitHub Pages, installable PWA) that quotes Scripture in four translations and quotes confessions and theologians, for a mixed audience (children, outsiders, Catholics, Reformed insiders)
**Researched:** 2026-09-29
**Mode:** Ecosystem (pitfalls dimension), subsequent milestone on an existing codebase
**Overall confidence:** HIGH for licence wording, quotation checks, build/deploy facts and simulation numbers (all read or run this session). MEDIUM for legal interpretation (not legal advice), iOS and PWA behaviour, and Cambridge KJV wording. LOW where marked.

**Confidence tags:** HIGH = read from the primary source (raw page, registry, primary text) or computed by me this session. MEDIUM = read from an official page via a summariser, or a well-attested secondary source, or my interpretation of primary text. LOW = memory or a single unverified secondary. "(inferred)" = my reasoning, not a source.

**Scope updates applied (from the coordinator):** (1) Good-natured ribbing of Catholics is now allowed (for example "Castle of Rome" can stay a playful landmark); the risk shifts to misstating Catholic doctrine or using hostile sectarian tropes (Pitfall 14). (2) The game must be an installable, offline-capable PWA (Pitfalls 33 to 37).

**Phase names** follow `.planning/research/ARCHITECTURE.md` "Suggested Build Order": Step 0 Deploy fix; Step 1 Test harness + engine extraction; Step 2 UI carve-out + `copy.js`; Step 3 Content model + validators; Step 4 Question state + panel; Step 5 Quiz; Step 6 Translations; Step 7 Layout/projector pass; Step 8 Accuracy gate + copy rewrite. **Step 9 (PWA) is proposed here**, after Step 8, so the service worker never caches a moving target.

---

## A. Evidence Blocks (verbatim sources the pitfalls rely on)

### E1. ESV (Crossway). HIGH for wording, MEDIUM for interpretation

Source: https://www.crossway.org/permissions/ (raw HTML read 2026-09-29) and https://api.esv.org/ (raw HTML read). Registered symbols shown below as (R) and (c) for ASCII.

Standard use guideline (same text under Print, Digital, Audio):

> The ESV text may be quoted in print, digital, and audio formats up to and inclusive of five hundred (500) verses without a formal license or express written permission of Crossway, provided that the verses quoted do not amount to more than one-half of any one book of the Bible or its equivalent measured in bytes, nor do the verses quoted account for twenty-five percent (25%) or more of the total text of the work in which they are quoted, and the verses are not being quoted in a commentary or other biblical reference work.

Required notice, "Digital" section ("Common Uses Include: Website, Blog, Social Media"):

> Notice of copyright must appear as follows on digital works quoting from the ESV: "Scripture quotations are from the ESV(R) Bible (The Holy Bible, English Standard Version(R)), (c) 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved."

Other lines from the same page:

> When more than one translation is quoted in printed works or other media, the foregoing notice of copyright should begin as follows: "Unless otherwise indicated, all Scripture quotations are from" [etc.]; or, "Scripture quotations marked (ESV) are from" [etc.].

> The "ESV" and "English Standard Version" are registered trademarks of Crossway. Use of either trademark requires the permission of Crossway.

> ESV API: Crossway allows you to access the ESV Bible text from our server and include it on your website or app, free of charge for non-commercial use.

ESV API conditions (https://api.esv.org/, "What are the conditions of use for the text?"):

> You may request up to 500 verses per query, or half a book, whichever is less ... You may only perform 5,000 queries per day, with no more than 1,000 requests in an hour and no more than 60 requests per minute. If you exceed these limits, your application will be throttled. You may not locally store more than 500 verses or one-half of any book of the Bible (whichever is less). ... You may distribute up to 500 verses, as long as the verses quoted do not amount to 50% of a complete book of the Bible and do not make up 50% or more of the total text of the work in which they are quoted. ... You must use the text for non-commercial purposes, and your website must be non-commercial. ... You must include the standard ESV copyright notice on your site and identify the passages as coming from the ESV. Each page on which you use the text must include a link to www.esv.org. You may not sell, share, or publish your access key. We reserve the right to cancel your access to the service at any time for any reason. This service is available for use only by individuals and non-commercial organizations that use the service in ways consistent with the historic Christian understanding of doctrine and the Bible ...

> Can I cache the text locally? You can cache up to 500 verses.

> Can I change the text? You may not change any of the words in the text. You may choose to omit certain features, such as headings, footnotes, cross-references, and verse numbers. You may also omit portions of verses or sections quoted if you include an ellipsis and only if such omissions do not change the meaning of the verses or sections being quoted.

> A non-commercial site does not charge for access to any part of the site. Further, no charge is made for access to the ESV text. In contrast, a commercial website is primarily designed to motivate visitors to buy something, to pay for a service, or to give a donation, or it accepts advertising or sponsorships.

Conflicts to note: the API page says "50%" of the work; the permissions page says "25%". Use 25%. The API page's shorter notice variant ends "Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible"; use the longer permissions-page notice.

### E2. NET Bible (Biblical Studies Press). HIGH for wording, MEDIUM on numeric caps

Source: https://netbible.com/copyright/ ("NET Bible Copyright", raw HTML read 2026-09-29).

> For verses quoted, in limited space situations the three letter abbreviation is: NET ... Please avoid: New English Translation Bible or just New English Translation

> 1. Non Commercial Publication: The NET Bible(R) Scripture text (without the NET Bible notes) may be quoted in any form (written, visual, electronic, projection, or audio without written permission. This permission is contingent upon the quoted text being followed by the designation (NET) and an appropriate copyright acknowledgment: Scripture quoted by permission. Quotations designated (NET) are from the NET Bible(R) copyright (c)1996, 2019 by Biblical Studies Press, L.L.C. http://netbible.com All rights reserved ...

> 1b. Church and mobile apps: ... When quotations from the NET Bible(R) are used in mobile apps, youtube channels, free apps, Internet apps or not-for-sale media ... The abbreviation (NET) must be used at the end of the quotation. For software apps with internet access the term NET must be hyperlinked to http://netbible.org.

> You may copy the NET Bible(R) and print it for others as long as you give it away, do not charge for it ... In this case, free means free. It cannot be bundled with anything sold, used as a gift to solicit donations, nor can you charge for shipping, handling, or anything.

> 2. Commercial Publication: Please contact HarperCollins Christian Publishing licensing.

The page states no verse count or percentage for non-commercial use. A search summary claimed "500 verses / 25% of the derivative work"; I could not find that on the current page (unresolved, LOW). Adopt the ESV limits as policy.

### E3. BSB (Berean Standard Bible). HIGH

Sources: https://bereanbible.com/bsb.txt (raw file header read) and https://berean.bible/licensing.htm and https://berean.bible/terms.htm (read via summariser, MEDIUM for exact phrasing).

> The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, unfoldingWord, Bible Aquifer, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain. Free resources and databases are available at BereanBible.com. (bsb.txt header)

> The Berean Bible and Majority Bible texts are officially dedicated to the public domain as of April 30, 2023. ... "All uses are freely permitted." Attribution is "appreciated but not required." Licensing "is not required for any use." (terms/licensing pages)

> Applications maintaining the verbatim text are "invited to bear the Berean name." For derivative works that differ from the official text, they "respectfully request that the Berean name is not used." (terms page, MEDIUM)

### E4. KJV. HIGH for public-domain status outside the UK, MEDIUM for UK terms

- https://ebible.org/kjv/copr.htm (raw read): "Letters patent issued by King James with no expiration date means that to print this translation in the United Kingdom or import printed copies into the UK, you need permission. Currently, the Cambridge University Press, the Oxford University Press, and Collins have the exclusive right to print this Bible translation in the UK. This royal decree has no effect outside of the UK, where this work is firmly in the Public Domain."
- https://en.wikipedia.org/wiki/King_James_Version "Copyright status" (raw read): "The Authorised Version is in the public domain in most of the world. In the United Kingdom, the right to print, publish and distribute it is a royal prerogative, and the Crown licenses publishers to reproduce it under letters patent. ... The terms of the letters patent prohibit any other than the holders, or those authorised by the holders, from printing, publishing or importing the Authorised Version into the United Kingdom." Holder in England, Wales and Northern Ireland is the King's Printer (now Cambridge University Press); in Scotland the Scottish Bible Board (Collins under licence).
- Cambridge's own permissions page (https://www.cambridge.org/us/bibles/about/rights-and-permissions) returned HTTP 403 to me. A search-engine summary of it says reproduction "is permitted to a maximum of five hundred (500) verses for liturgical and non-commercial educational use, provided that the verses quoted neither amount to a complete book of the Bible nor represent 25 per cent or more of the total text of the work in which they are quoted." MEDIUM (secondary summary; not read raw). Adopt the same 500 / 25% / non-commercial ceiling for KJV as policy.

### E5. Setup-screen Calvin quote verdict. HIGH

Game text (`pilgrims-predestined-path.jsx:397-398`): "God preordained, for his own glory and the display of His attributes of mercy and justice, a part of the human race, without any merit of their own, to eternal salvation, and another part, in just punishment of their sin, to eternal damnation." attributed "Calvin, Institutes III.21.5".

What Calvin actually writes at III.21.5:

- **Beveridge (1845, public domain)**, full text at https://www.ccel.org/ccel/calvin/institutes/cache/institutes.txt: "By predestination we mean the eternal decree of God, by which he determined with himself whatever he wished to happen with regard to every man. All are not created on equal terms, but some are preordained to eternal life, others to eternal damnation; and, accordingly, as each has been created for one or other of these ends, we say that he has been predestinated to life or to death."
- **Allen (1813, public domain)**, vol. 2 p. 405 of the London edition, https://archive.org/download/institutesofchrlond02calv/institutesofchrlond02calv_djvu.txt: "Predestination we call the eternal decree of God, by which he hath determined in himself, what he would have to become of every individual of mankind. For they are not all created with a similar destiny; but eternal life is fore-ordained for some, and eternal damnation for others. Every man therefore, being created for one or the other of these ends, we say, he is predestinated either to life or to death."

Verdict: **not a translation of Calvin.** I searched the complete Beveridge text and the Allen volume for the game's phrases ("display of his attributes", "attributes of mercy", "part of the human race", "without any merit of their own, to eternal", "preordained, for his own glory"): none occur. It is an unsourced composite. It circulates on quote-collection sites as "Calvin" with no citation (example: https://www.gracegems.org/2019/08/Short%20pithy%20quotes%20from%20John%20Calvin.html). It borrows "preordained" from Beveridge III.21.5 and adds ideas that belong to confessional language: "for the manifestation of his glory" (WCF 3.3), "to pass by; and to ordain them to dishonor and wrath for their sin, to the praise of his glorious justice" (WCF 3.7). I could not identify the true original author (I checked the CCEL text of Arminius's Works vol. 3, where "mercy and justice" appears in his description of supralapsarian views, but not this sentence). Label: paraphrase or summary of Reformed doctrine, wrongly credited to Calvin. Also note the Battles translation (Westminster John Knox, 1960: "We call predestination God's eternal decree ...", as quoted on monergism.com) is a third wording and is still under copyright, so it cannot be mixed in.

Verified Calvin material that is safe to use (Beveridge): III.21.5 (above); III.24.5 "Christ, then, is the mirror in which we ought, and in which, without deception, we may contemplate our election."; III.23.7 "The decree, I admit, is dreadful" (Allen renders "It is an awful decree, I confess"; the Latin is "decretum horribile", so "horrible decree" in popular use is a translation choice, not Calvin's English); I.11.8 "the human mind is, so to speak, a perpetual forge of idols" (the popular "factory of idols" is a Battles-style wording, not Beveridge); the Beveridge chapter headnote for III.20.3 "Objection, that prayer seems useless, because God already knows our wants" (directly on point for the "why pray?" question); the headnote for III.23.1 (Beveridge's summary, not verified against the body text): "there could be no election without its opposite reprobation."

### E6. Simulation of the existing board (computed this session). HIGH

I re-implemented the existing rules from `pilgrims-predestined-path.jsx:4-40, 77-88, 332-379` in Node (colors cycle `i%6`; 6 pink named spaces reachable only by the 6 character cards; 3 recolored dot traps; shortcuts 48->60 and 85->97; deck of 60 single + 12 double + 6 character, rebuilt when 2 cards remain) and ran 3,000 to 6,000 games per configuration with 18 fixed question spaces (6 named + 3 dot + 2 shortcut + 7 landmark) plus random ordinary spaces. Scripts are in the session scratchpad, not committed. `scripts/simulate.mjs` from ARCHITECTURE.md should reproduce these.

| Fact | Result |
|------|--------|
| Draws per game | 2 players about 45; 3 players about 57; 4 players about 66 to 67 (p10 35, p90 100) |
| Question spaces vs "one turn in three" | 32 total spaces give 0.245 question stops per draw; 35 give 0.265 to 0.27. "One in three" needs about 45 spaces (matches ARCHITECTURE.md) |
| Question stops per game (32 spaces) | 2p: 11.0 (p90 18); 3p: 14.0 (p90 22); 4p: 16.3 (p90 26). Per player: 5.5 (2p) to 4.1 (4p), p90 10 (2p) and 7 (4p) |
| Repeat landings on an already-asked question space | 2p: 1.0 per game (9% of stops); 4p: 2.7 per game (16% of stops) |
| Fixed "headline" spaces seen at least once, 4-player game | #8 Brother Adam 73%; #48 Narrow Way 65%; #118 Castle of Rome 32%; #85 Path of Election 29%; #65 Dark Night 21%; #103 Sea of Providence 20%; #35 Slough of Despond 19%; #98 Valley of the Shadow 12%. For one player, the three trap spaces are landed on in only 7% (#35), 12% (#65) and 9% (#98) of games |
| Why traps are starved | Each trap was recolored to a color already used by the adjacent cycle space (#34 and #35 both orange; #62 and #65 both blue; #97 and #98 both green), so a single color card lands on the earlier space; only a double card or a start on the adjacent space reaches the trap |
| Quiz bonus of +2 spaces from a question space (random generic placement) | Lands on another question space 18% (32 spaces) to 22% (35 spaces); on a dot trap 1.3 to 1.6%; on a shortcut 0.6 to 0.8%. With question spaces at most #129, 0% of games were won directly by a +2 bonus (a bonus of 3 or more from #130 to #132 would change that) |
| Recoloring ordinary spaces to a 7th (pink) color | Mean advance per color card rose from 7.06 to 8.43 spaces (+19%) when 15 extra spaces were made pink (positions 0 to 119, singles and doubles equally weighted), so games get shorter and the deck's cadence changes |
| Endgame overshoot | `findNext` returns 133 when no matching space remains (`pilgrims-predestined-path.jsx:88`). About 76% of simulated 4-player games ended by this overshoot (a card with no valid target ahead) rather than by an exact color match |

---

## B. Critical Pitfalls

### Pitfall 1: ESV text shipped in a way that breaches Crossway's terms

**What goes wrong:** Any of: (a) calling the ESV API from the browser with the key in client JavaScript; (b) bundling more than 500 unique ESV verses, or more than half of a short book (Jude, 2 John, 3 John, Philemon, Obadiah); (c) ESV words reaching 25% of the whole app's text; (d) putting the ESV inside "Go deeper" material that a reader could treat as a commentary; (e) no notice, or the notice only on one screen; (f) editing the wording; (g) putting the repo or content under a Creative Commons licence.

**Why it happens:** The API is the obvious way to get ESV text, and its terms are on a different page from the standard permissions. The 25% rule is about "the work", which for this project is the whole game including every quip and answer. "Go deeper" explanations next to verses are close to what a commentary is.

**How to avoid:**
- Never ship an API key. Use the API once at author time (a local Node script) or copy from esv.org by hand, and commit a JSON of at most 500 unique verses (STACK.md already recommends this). Never `fetch` the API at runtime; the shared 5,000/day quota would also throttle every visitor (E1).
- Add a hard build-time test: unique ESV verses <= 500 (fail), no book over half, ESV words as a share of all authored words < 15% (self-imposed margin under the 25% rule). Count only the ESV text once even if shown in several questions.
- Ask Crossway once in writing whether a free teaching game with "Go deeper" explanations counts as a "commentary or other biblical reference work". The text of the rule cannot settle it. The address is on the API page (STACK.md notes licensing@crossway.org, unverified here). Until answered, keep ESV verses in the Q&A layer and make "Go deeper" cite references with links rather than embedding extra ESV text.
- Show the full E1 notice (with "ESV Text Edition: 2025") in a persistent Credits/About screen reachable from every screen, and "(ESV)" after every ESV quotation, and a link to https://www.esv.org next to ESV quotes. Because the app quotes several translations, use the "Scripture quotations marked (ESV) are from ..." opening variant Crossway prescribes for multi-translation works.
- Re-check "ESV Text Edition: 20xx" at build time; the year in the notice must match the text you copied. Copy the text only from the current edition.
- Never alter ESV words. Jokes go in a separate element visually outside the quotation block. Omissions only with an ellipsis and only when the meaning is unchanged.
- Do not call the app or repo "ESV-branded"; "ESV" and "English Standard Version" are registered trademarks, so use them only as the translation label.
- Keep the project non-commercial: no ads, no donation button, no paywall (the API's definition of non-commercial includes donation prompts and sponsorship).

**Warning signs:** an `Authorization: Token` string anywhere in `src/`; a `fetch("https://api.esv.org` call; a verse-cap test that does not exist; the notice appearing only in a README; "ESV" quotes with edited words or bracketed jokes; a Ko-fi or donate link added later.

**Phase to address:** Step 6 (Translations) for caps, notice and no-runtime-API; Step 3 (Content model) for the verse-count validator schema; Step 8 (Accuracy gate) for the Crossway commentary question and final notice check.

---

### Pitfall 2: NET Bible misuse (notes, missing hyperlink, "sold" bundling)

**What goes wrong:** Quoting the NET translators' notes (the licence covers the "Scripture text (without the NET Bible notes)" only); using "New English Translation" or "NET Bible Bible" variants the page asks people to avoid; omitting the required "(NET)" after each quote or not hyperlinking "NET" to http://netbible.org in an internet app; running the app in any way that is sold or solicits donations.

**Why it happens:** The NET's appeal is its notes, and "Go deeper" sections invite quoting them. The naming and hyperlink rules sit on a page most people skim.

**How to avoid:** Quote text only, never notes; render the label as a link `<a href="http://netbible.org">NET</a>` after each NET quote plus the full acknowledgment line from E2 in Credits. Use "NET" or "NET Bible" as the label. Hold NET to the ESV caps as policy (E2 says no cap is published for non-commercial use, but an unverified summary claimed 500/25%).

**Warning signs:** verse data copied from netbible.org with `<sn>`/`<tn>` note markup; the label "NET" not a link; different label spellings in different components.

**Phase to address:** Step 6 (Translations). Validator: the attribution registry must contain a non-empty `label`, `noticeText` and `linkUrl` for every translation before a verse from it can render (Step 3).

---

### Pitfall 3: Treating "public domain" as "no obligations" (BSB and KJV)

**What goes wrong:** (a) Calling text "BSB" after editing it (trimming, modernising quotes, inserting ellipses), when the BSB terms ask that the Berean name not be used for text that differs; (b) using a stale BSB snapshot (the text has been revised since 2023) and not recording which file; (c) assuming KJV is free everywhere: in the UK the Crown letters patent reserve printing, publishing and importing (E4); (d) mixing KJV editions (1611 spelling, Oxford vs Cambridge 1769 text) so spot-checks fail.

**Why it happens:** "Public domain" is read as "do anything". The UK rule is about print, so risk for a US-hosted static site is low (inferred), but the wording of the patent is broad.

**How to avoid:** Store the source file name, retrieval date and (for BSB) file header with each translation in the registry; forbid edits to any BSB or KJV string inside the verse store (normalise whitespace in the build script, not in data). Where an ellipsis is needed, label the quote "(BSB, excerpt)" or choose a shorter verse. Add a courtesy line for BSB ("Berean Standard Bible, public domain, https://berean.bible") and for KJV ("King James Version (1769 text), public domain outside the UK; Crown letters patent apply to printing in the UK"). Keep KJV to <= 500 verses, non-commercial, as policy (E4). Pin one KJV source (the eBible USFM in STACK.md) and one BSB source (`bsb.txt`).

**Warning signs:** hand-edited verse JSON; two KJV sources in `scripts/`; a translation label without a source date.

**Phase to address:** Step 6 (Translations); Step 3 (registry fields).

---

### Pitfall 4: Verse-level differences across four translations break references, quotes and jokes

**What goes wrong:** A verse exists in KJV but not in BSB/ESV/NET (for example Matthew 17:21, Mark 16:9-20, John 7:53-8:11, Acts 8:37, Romans 16:24, 1 John 5:7 in its KJV form); Psalm titles are numbered differently across translations (NET follows Hebrew versification more closely; not verified here, LOW); verse breaks differ in quoted ranges; a quip riffs on one translation's wording so it is wrong when the reader switches translation; a "verse of the day" style joke is spliced into the quotation.

**Why it happens:** One reference string is assumed to map to all four texts. Jokes are written against the default translation.

**How to avoid:** Every question stores a list of `{ref}` and a build test asserts each ref exists and is non-empty in all four stores (STACK.md already proposes this); when it fails, choose a different verse rather than special-casing. Write quips and plain answers so they do not depend on a translation's wording (no punning on "elect" vs "chosen"). Show the quote in its own block with the translation label; jokes and glosses go outside that block. For the Romans 9 "Jacob I loved, Esau I hated" family, BSB (read this session) reads "So it is written: 'Jacob I loved, but Esau I hated'" (Romans 9:13), and other translations differ in wording, which is a good stress-test question for the parity test.

**Warning signs:** blank verse cards after switching translation; different verse counts per ref across stores; a quip that quotes three words that exist in only one translation.

**Phase to address:** Step 3 (validators), Step 6 (translation stores).

---

### Pitfall 5: Repo licence and notice placement contradict Scripture terms

**What goes wrong:** The repo has an MIT `LICENSE` (read: "Copyright (c) 2026 Avocado"), which reads as covering everything committed, including ESV and NET text. Crossway's notice says the ESV "may not be quoted in any publication made available to the public by a Creative Commons license", and NET forbids bundling with anything sold. If a future contributor relicenses content under CC (a natural move for a teaching resource), ESV breaches its terms.

**How to avoid:** Add a `NOTICE`/README section: code is MIT; Scripture quotations remain under their own terms and are excluded from the MIT grant; content (quips, answers) may be CC only if the ESV and NET text is stripped from that content licence. Keep the four translation stores in one folder (`src/content/verses/`) with a `README` restating terms. Never publish the verse JSON as a standalone downloadable dataset.

**Warning signs:** a "License: CC BY-SA" badge; a content export feature; a public `verses.json` linked from the UI.

**Phase to address:** Step 6 and Step 8 (final Credits/licence review).

---

### Pitfall 6: The setup-screen Calvin quote is a fabricated composite

**What goes wrong:** The game's first screen credits words to Calvin that are not in Institutes III.21.5 (see E5). A reader who checks CCEL finds a different sentence; the game's core value ("answers ... with citations anyone can check") fails on screen one, and the same text tells outsiders that Calvin's wording is "preordained for his own glory ... in just punishment of their sin".

**Why it happens:** The sentence circulates uncited on quote sites; it reads right; nobody compared it to a translation.

**How to avoid:** Remove or replace. Options in order of fit for a child-inclusive first screen: (1) a Westminster Shorter Catechism epigraph (Q20: "God having, out of his mere good pleasure, from all eternity, elected some to everlasting life, did enter into a covenant of grace, to deliver them out of the estate of sin and misery, and to bring them into an estate of salvation by a redeemer." Verified from https://www.opc.org/sc.html; it speaks of election only); (2) WCF 3.1 (verified); (3) Beveridge III.24.5 "Christ, then, is the mirror in which we ought ... to contemplate our election." If the original III.21.5 is wanted, quote the Beveridge sentence verbatim and name the translator ("Calvin, Institutes III.21.5, trans. Henry Beveridge, 1845"), and place it in "Go deeper" rather than as the opening line, because it is the harshest symmetrical formulation in Calvin. Whatever is chosen must pass the quote test (Pitfall 9).

**Warning signs:** any quote whose "source" field is a website rather than a primary text plus edition; quote strings that differ from the source by more than whitespace and curly quotes.

**Phase to address:** Step 8 (Accuracy gate). The exact-match test lands in Step 3.

---

### Pitfall 7: Commonly misattributed quotations (do not use)

**What goes wrong:** Famous lines are cited with confidence and are wrong or context-stripped. Table of items verified this session:

| Quote | Status | Source (confidence) |
|-------|--------|---------------------|
| Luther: "Here I stand, I can do no other" | Not in the Diet of Worms transcripts or eyewitness accounts; most scholars doubt it was spoken; probably added by Georg Rorer's editing. The game's Luther space says "Here I stand. Sola fide." | Wikiquote Martin Luther "Disputed" (citing Christianity Today 2002 and MacCulloch); Wikipedia Diet of Worms ("According to tradition ...") (HIGH read; secondary) |
| Luther: "Even if I knew the world would end tomorrow, I would plant my apple tree" | Earliest record is a 1944 circular letter by Hessian minister Karl Lotz | Wikiquote (HIGH read) |
| Luther: "Whoever drinks beer, he is quick to sleep ..." | A 1658 example of faulty logic (sorites), not Luther | Wikiquote (HIGH read) |
| Luther: "I'd rather be ruled by a competent Turk than an incompetent Christian" | Earliest located source is 1988, no citation | Wikiquote (HIGH read) |
| Luther: "Sin boldly" (1521 letter to Melanchthon) | Real, but context-dependent, and the standard English (Luther's Works vol. 48) is copyrighted; children would take it literally | search summary (MEDIUM); avoid |
| Spurgeon: "When you can't trace his hand, trust his heart" | Popularised by a 1989 song; his words were "too wise to err and too good to be unkind" (MTP 13:103) | https://www.spurgeon.org/blog/6-things-spurgeon-didnt-say (HIGH read) |
| Spurgeon: "Let the lion out" line, "a lie travels around the globe", "anxiety empties today of its strength" (Maclaren first), "kiss the wave that throws me against the Rock of Ages", "make a beeline to the cross" | Each is misquoted, older, or unsourced | same page (HIGH read) |
| Augustine: "In essentials unity, in non-essentials liberty, in all things charity" | Attributed to Rupertus Meldenius | search summary (MEDIUM) |
| Augustine or Luther: "Pray as if everything depended on God and work as if everything depended on you" | No verified original found; attributed to several people | LOW; avoid, even though it fits the providence theme |
| Calvin: a text calling Lucifer "a loyal servant of God" | Spread online; exists in none of Calvin's extant works | Wikiquote John Calvin "Misattributed" (HIGH read) |
| Calvin: "TULIP" / "five points of Calvinism" | The five points are a later summary that "largely reflect the teaching of the Canons of Dort" (1618-19); Calvin died 1564 | Wikipedia "Five points of Calvinism" (HIGH read; secondary) |

Real and safe: Augustine, "our heart is restless until it rests in you" (Confessions 1.1.1; use a public-domain translation such as Pusey's); Calvin III.24.5 "mirror" and I.11.8 "perpetual forge of idols" (verified against Beveridge, E5).

**How to avoid:** Keep a `content/banned-quotes.json` of these strings; a test fails the build if any of them appear in copy. Prefer confessional documents (WCF, WSC, Dort, Heidelberg) over pithy sayings, because they are stable, dated and checkable.

**Warning signs:** a quote with no page, section or sermon locator; a source listed as "quote site" or "Goodreads"; a memorable line that fits the joke too well.

**Phase to address:** Step 8; banned-list test in Step 3.

---

### Pitfall 8: Quoting still-copyrighted translations of public-domain authors

**What goes wrong:** Calvin's Institutes in Battles (WJK 1960), Luther in Luther's Works (Fortress/Concordia), Augustine in Chadwick or Pine-Coffin, and modern renderings of Heidelberg and Dort (for example CRC 1988/2011 editions) carry translation copyrights. Setting them in a public repo without permission breaks the project's own "legally reproducible" constraint (PROJECT.md).

**How to avoid:** Use public-domain translations and name them in the citation: Calvin: Beveridge 1845 or Allen 1813 (both fetched this session). WCF and WSC: 1646/47 text (opc.org edition read; note it carries the American revisions, see Pitfall 9). Dort: the English in Schaff's Creeds of Christendom vol. 3 (public domain; Articles I.15, I.16, I.17, II.3, II.5, II.8 read at https://www.ccel.org/ccel/schaff/creeds3/cache/creeds3.txt). Trent: Waterworth 1848 at https://history.hanover.edu/texts/trent/ct06.html (Session 6 canons IV, XVI, XVII read). Formula of Concord: bookofconcord.org (Epitome XI read). Heidelberg and any Luther text: not verified; pick a translation whose licence you have read (LOW) or paraphrase with a citation and no quotation marks.

**Warning signs:** a quote that reads more modern than 19th century for Calvin; a citation with "trans. Battles/McNeill", "trans. Chadwick" or "LW 48".

**Phase to address:** Step 3 (source registry `sources.js` records translator, year, licence), Step 8.

---

### Pitfall 9: "Citation checking" done by a language model reads as verification but is not

**What goes wrong:** With no human theology reviewer (PROJECT.md decision), the temptation is to have the same tool that wrote a quotation confirm it. Fabricated locators, section numbers that do not exist, and near-verbatim quotes that differ by a word all pass a read-through. Confession editions also drift: the OPC text of WCF 25.6 reads "There is no other head of the church but the Lord Jesus Christ. Nor can the pope of Rome, in any sense, be head thereof." (Antichrist clause absent; read); WCF 29.2 in the same edition still says "the popish sacrifice of the mass (as they call it) is most abominably injurious to Christ's one, only sacrifice" (read).

**How to avoid:** Make verification mechanical wherever the source is public domain: store each quotation as `{text, source, edition, locator, url, retrievedOn, verifiedBy}` and run a script that fetches or reads a cached primary text (CCEL `cache/<work>.txt` files worked for Calvin and Arminius; bsb.txt for BSB; opc.org text for WCF/WSC; Schaff text for Dort) and asserts the quote is a whitespace-normalised substring. For ESV and NET the check is a manual comparison against esv.org and netbible.org, recorded with a date. A quote that cannot be substring-matched is rendered without quotation marks and labelled a paraphrase, or cut. Forbid any confession quote from a section not opened in the source list for that release. For WCF, pin one edition (state "OPC edition") and quote only chapters 3, 5, 7, 8, 9, 10, 17, 18 unless another chapter is verified. Treat quote text and citation as one atomic record so a "Go deeper" line cannot cite a different section than the quoted text.

**Warning signs:** citations with only a book title ("Institutes") and no section; identical wording across two sources that are known to differ; verification that lists no retrieval date.

**Phase to address:** Step 3 (schema + verifier), Step 8 (run the verifier on every question; block release on failures).

---

### Pitfall 10: Fatalism instead of providence

**What goes wrong:** The game's own copy says the opposite of the confession it invokes. Existing strings (all in `pilgrims-predestined-path.jsx`): line 404 "There are no decisions. The deck was shuffled before you sat down. You merely discover what was always ordained."; line 328 "The deck is shuffled. The outcome is fixed."; line 329 "The decree is sealed."; line 385 "the decree awaits."; line 466 "This was determined before the first card was drawn. The others were never going to arrive."; line 467 "Play Again (as if you had a choice)"; buttons "Submit to Providence" (lines 287 and 421). WCF 3.1 (verified): "God, from all eternity, did, by the most wise and holy counsel of his own will, freely, and unchangeably ordain whatsoever comes to pass: yet so, as thereby neither is God the author of sin, nor is violence offered to the will of the creatures; nor is the liberty or contingency of second causes taken away, but rather established." WCF 5.2 (verified): "all things come to pass immutably, and infallibly; yet, by the same providence, he ordereth them to fall out, according to the nature of second causes, either necessarily, freely, or contingently." WCF 5.3: "God, in his ordinary providence, maketh use of means." WCF 3.6: "As God hath appointed the elect unto glory, so hath he ... foreordained all the means thereunto." WCF 9.1: "God hath endued the will of man with that natural liberty, that it is neither forced, nor, by any absolute necessity of nature, determined to good, or evil."

**Why it happens:** A pre-shuffled deck is a neat symbol of predestination, and "you have no choice" is the outsiders' caricature that Reformed people also joke about. But a random deck is a lottery, and the confession says the decree is "wise and holy" (3.1), not arbitrary.

**How to avoid:** Move every string to `content/copy.js` (Step 2) and rewrite against a short rule: jokes may mock Calvinists (over-explaining, quoting Dort at dinner, "well, technically it was ordained"), but must never assert that choices are fake. Suggested register: the deck stands for what God ordained, and the player still draws, moves, and (with quiz) answers; "the decree includes the means" is the punchline, not "nothing matters". Ban a phrase list in a test (`no decisions`, `never going to arrive`, `as if you had a choice`, `outcome is fixed`, `merely discover`). Add a Dort- and WCF-sourced "Go deeper" for the game's own premise.

**Warning signs:** copy that says "can't", "must", "no choice", "always was" about the player's actions; a quip whose logic works only if choices are illusory.

**Phase to address:** Step 2 (copy extraction), Step 8 (rewrite and banned-phrase test). ARCHITECTURE.md suggests doing the rewrite right after Step 2 so the deployed game stops shipping the inaccurate jokes early; agree.

---

### Pitfall 11: TULIP glosses that misstate each point

**What goes wrong:** Existing lines 408-412 and how to fix them (confession anchors verified this session):

| Existing gloss | Problem | Accurate replacement anchor |
|----------------|---------|----------------------------|
| T: "You cannot choose your path." | Conflates inability to save oneself with inability to choose anything. WCF 9.1 says the will is not "forced"; 9.3 says fallen man "hath wholly lost all ability of will to any spiritual good accompanying salvation" | Total depravity = sin affects every part of a person and we cannot rescue ourselves (WCF 6.4, 9.3) |
| U: "The deck chose you." | Implies chance. WCF 3.5: God chose "out of his mere free grace and love, without any foresight of faith, or good works ... or any other thing in the creature" | Election is not a lottery and not earned |
| L: "Not every pilgrim reaches Glory." | Describes the outcome, which every non-universalist view shares (Catholic, Arminian, Lutheran too). Limited atonement (particular redemption) is about the design and application of Christ's death: Dort II.8 "the quickening and saving efficacy of the most precious death of his Son should extend to all the elect"; and II.3 "abundantly sufficient to expiate the sins of the whole world"; WCF 3.6 "Neither are any other redeemed by Christ ... but the elect only" | "Christ's death was for his people by name; its worth is unlimited, its aim is definite" |
| I: "When drawn forward, you must go." | Reads as compulsion. WCF 10.1: God draws "yet so, as they come most freely, being made willing by his grace" | Efficacious grace: God makes the unwilling willing |
| P: "The elect cannot fall away." | WCF 17.1 "can neither totally nor finally fall away"; 17.3 "they may ... fall into grievous sins; and, for a time, continue therein" | Believers are kept, and this is not the same as never stumbling |

**How to avoid:** Rewrite all five with the anchors; add a "Go deeper" for each with Dort/WCF citations verified by Pitfall 9's harness; have the quiz (Step 5) cover the corrected glosses. Do not call them "Calvin's five points" (Pitfall 7; they summarise Dort).

**Warning signs:** a gloss that would also be true of Arminians or Catholics ("not everyone is saved"); words like "must", "chose you" about any card.

**Phase to address:** Step 8 (rewrite), Step 3 (schema requires `anchor` for each).

---

### Pitfall 12: Reprobation, equal ultimacy and election vs reprobation

**What goes wrong:** Satire or plain answers present election and reprobation as mirror images ("God chooses some for heaven and others for hell in the same way"), or treat "not elect" as "damned by decree without reference to sin", or call the unelected "unlucky". The Reformed confessions are careful here:
- WCF 3.5 (election) has no ground in the creature: "without any foresight of faith, or good works".
- WCF 3.7 (verified): "The rest of mankind God was pleased, according to the unsearchable counsel of his own will, whereby he extendeth or withholdeth mercy, as he pleaseth, for the glory of his sovereign power over his creatures, to pass by; and to ordain them to dishonor and wrath for their sin, to the praise of his glorious justice." Note that WCF 3.3 also says "others foreordained to everlasting death", so "pass by" is not the only wording; the asymmetry is in the ground ("for their sin") and mode.
- Dort I.15 (Schaff, verified): "...others are passed by in the eternal decree; whom God ... hath decreed to leave in the common misery into which they have willfully plunged themselves, and not to bestow upon them saving faith and the grace of conversion; but permitting them in his just judgment to follow their own way; ... to condemn and punish them forever, not only on account of their unbelief, but also for all their other sins. And this is the decree of reprobation which by no means makes God the author of sin (the very thought of which is blasphemy)".
- Calvin himself is more symmetrical in tone: III.21.5 speaks of "some are preordained to eternal life, others to eternal damnation" (E5), and the Beveridge headnote for III.23.1 says "there could be no election without its opposite reprobation". Do not present "Calvin was gentler than the confessions" or the reverse; the sources differ in emphasis.

**How to avoid:** Write one plain-answer template for any reprobation question: God's saving choice is grace, not merit; the rest are left in the sin they chose and are judged for it (WCF 3.7, Dort I.15); God is not the author of sin. Never write "God made them to be damned" or "some people are decreed hell for fun". Keep reprobation questions to "Go deeper" with confession anchors and never in a quip. Do not use "elect" and "saved" as synonyms with "non-elect" and "damned" as synonyms in the game's own labels (Pitfall 16).

**Warning signs:** "chosen for hell", "God picked", "the unlucky", a quip about someone "not on the list".

**Phase to address:** Step 8 (accuracy), Step 3 (schema: reprobation-tagged questions must include a WCF 3.7 or Dort I.15 anchor and a pastoral line).

---

### Pitfall 13: Hyper-Calvinism, and quiz distractors that teach it or other errors

**What goes wrong:** Jokes and answers imply that the gospel invitation is not for everyone, that there is no duty to believe, or that evangelism is pointless because election is fixed. Mainstream Reformed teaching is the reverse: WCF 7.3 "the Lord ... freely offereth unto sinners life and salvation by Jesus Christ; requiring of them faith in him"; Dort II.5 (Schaff, verified): "This promise, together with the command to repent and believe, ought to be declared and published to all nations, and to all persons promiscuously and without distinction, to whom God out of his good pleasure sends the gospel."; Dort II.6 "whereas many who are called by the gospel do not repent nor believe in Christ ... this is not owing to any defect or insufficiency in the sacrifice offered by Christ upon the cross, but is wholly to be imputed to themselves". Secondary definitions of "hyper-Calvinism" vary (Wikipedia notes the term is applied loosely), so anchor on the primary texts, not the label. Quiz mode adds a second risk: multiple-choice distractors state errors ("God causes sin", "you must earn election") in the same visual style as truth, and children remember the option, not the marking.

**How to avoid:** For every "why pray / why evangelise / why try" question, the plain answer must state the offer and duty explicitly (Dort II.5, WCF 7.3, WCF 5.3 means). Distractors should be phrased as "Some people think ..." positions that a real tradition holds, or as clearly silly options, and never as fake quotations. After answering, show only the correct statement (do not re-display wrong options). Keep the correct answer's position randomised and never "all of the above".

**Warning signs:** a quip whose joke is "why bother"; a distractor that is a genuine heresy worded like a doctrine; correct options that are always the longest.

**Phase to address:** Step 5 (quiz content rules), Step 8.

---

### Pitfall 14: Other traditions strawmanned; anti-Catholic tropes in "Castle of Rome"

**What goes wrong:** Given the updated scope (ribbing of Catholics is fine), the failure mode is a joke that misstates Catholic doctrine or reuses a sectarian trope. Facts to anchor jokes, verified this session:
- Catholics do not teach predestination to hell. CCC 1037: "God predestines no one to go to hell; for this, a willful turning away from God (a mortal sin) is necessary, and persistence in it until the end." (https://www.vatican.va/archive/ENG0015/__P2O.HTM.) Trent Session 6 Canon XVII anathematises the view that the unpredestined "are predestined unto evil"; Council of Orange (529) concludes that those who believe some are "predestined to evil by divine power" are anathema (search-summary wording, MEDIUM).
- Catholics do not teach that grace is earned: Trent Session 6 Canon III (no belief or repentance "without the prevenient inspiration of the Holy Ghost"), Canon IV (free will "moved and excited by God" cooperates; it "cannot refuse its consent, if it would" is the denied position). The Reformed and Catholic differences are real (irresistible grace; assurance: Trent Canon XVI denies certainty of perseverance "unless he have learned this by special revelation", versus WCF 17 and 18), but "Catholics think you earn heaven by works" is a strawman.
- Augustine is a Church Father and Doctor of the Church; "Doctor of Grace" is also his Catholic title. Luther began as an Augustinian friar; "The Cloister" is Catholic. "Dark Night of the Soul" is a term from the Carmelite John of the Cross, not a Reformed phrase. "Dark Wood" echoes Dante.
- Arminians (Remonstrants): Article IV (Schaff creeds3, verified): grace is "the beginning, continuance, and accomplishment of all good, even to this extent, that the regenerate man himself, without prevenient or assisting, awakening, following and cooperative grace, can neither think, will, nor do good ... But as respects the mode of the operation of this grace, it is not irresistible". So Arminians affirm total inability and salvation by grace; "Arminians think you save yourself" is false. Article I makes election conditional on foreseen faith; Article II universal atonement; Article V left whether believers can fall away for further study.
- Lutherans: Formula of Concord Epitome XI.4 (bookofconcord.org, verified): "The predestination or eternal election of God, however, extends only over the godly, beloved children of God, being a cause of their salvation". Lutherans are not Arminians and do not hold double predestination; do not present Luther as a TULIP witness.
- Hostile tropes to keep out: pope as Antichrist, "whore of Babylon", Mass as idolatry, Marian or statue-worship jokes, "Catholics are not Christians", Inquisition gags, and quoting WCF sentences that carry such language (Pitfall 9).

**How to avoid:** A short "fair-statement checklist" per tradition, each with a citation, must accompany any question that names a tradition; the joke's target must be a Calvinist behaviour (for example "Calvinists arrive at the Castle of Rome and discover Augustine is claimed by both parties"). Give "Castle of Rome" a fixed question such as "Do Catholics and Reformed Christians believe the same about grace?" with a plain answer that states the actual differences using the anchors above. Rename or re-describe "Dark Night of the Soul" only if its Catholic origin is not credited; better, credit John of the Cross in "Go deeper".

**Warning signs:** "Rome" paired with "darkness", "trap" or "false"; a landmark description with no citation; a joke that has to explain what Catholics "believe" in one clause.

**Phase to address:** Step 8 (reframe "Castle of Rome"), Step 4 (question copy), Step 3 (schema flag `namesTradition: true` requires `fairnessCheck` note).

---

### Pitfall 15: "Reformed" treated as one voice; anachronism

**What goes wrong:** The audience includes Presbyterians (WCF), Continental Reformed (Three Forms of Unity: Heidelberg, Belgic, Dort), and Reformed Baptists (1689 Confession), who differ on baptism and church order. Attributing "the Reformed view" to a WCF sentence about infant baptism, or Calvin to TULIP, shows in the game as a false unity. Dates: Calvin (d. 1564), Dort (1618-19), WCF (1646-47), TULIP as a slogan is much later.

**How to avoid:** Every claim that is denomination-specific names its document ("WCF 28.4", not "Reformed churches teach"). Keep the game's TULIP list labelled as a summary of Dort. Avoid quizzes that ask "which church baptises infants" unless all traditions are named.

**Phase to address:** Step 8; schema field `source.document` required (Step 3).

---

### Pitfall 16: Player names imply who is saved

**What goes wrong:** Line 306 names the four players "The Elect", "The Pilgrim", "The Saint", "The Vessel". Player 1 "The Elect" can lose the race, which reads as "the elect fall short", contradicting the game's own perseverance line and WCF 17; "The Vessel" evokes vessels of wrath and mercy (Romans 9:22-23). If a child is always player 1 or 4, the name is a label with theological weight.

**How to avoid:** Neutral names or Bunyan characters (Christian, Faithful, Hopeful, Christiana), and never assign an election-related status to a token.

**Warning signs:** any token label containing elect, saint, vessel, reprobate.

**Phase to address:** Step 2 (`copy.js`), Step 8.

---

### Pitfall 17: Damnation, despair and reprobation content unsuitable for children

**What goes wrong:** The game's structure already treats "not reaching Glory" as the losing state (end screen: "The others were never going to arrive"). Question spaces add "How can I know I'm elect?" (Slough of Despond), Dark Night of the Soul, Valley of the Shadow. For an anxious child, "some are not chosen" plus "how do I know I am elect?" is a recipe for distress, and jokes about despair can land badly with a child (or adult) who has real depression.

**Anchors:** The Westminster Shorter Catechism, the standard children's catechism in the tradition, mentions election (Q20) but contains no reprobation language at all (read: no occurrence of "reprobat" or "pass by"), so reprobation is not a child-level doctrine in the tradition's own teaching. Dort I.16 (verified): those who do not yet feel faith "ought not to be alarmed at the mention of reprobation, nor to rank themselves among the reprobate, but diligently to persevere in the use of means". Dort I.17: "godly parents have no reason to doubt of the election and salvation of their children whom it pleaseth God to call out of this life in their infancy". WCF 3.8: the doctrine "is to be handled with special prudence and care". Calvin III.24.5: look at Christ, the "mirror", not at yourself (E5).

**How to avoid:**
1. No game state represents a pilgrim as damned or unchosen: the end screen celebrates the winner and welcomes everyone else back ("Everyone on the road counts") and drops the "never going to arrive" line (Pitfall 10).
2. Reprobation and hell live only in "Go deeper", tagged "Older readers", never in the quip or plain layer; the plain layer for "am I elect?" gives the assurance texts (Dort I.16, Calvin III.24.5) and says "talk to a parent or pastor".
3. Quips never mock despair, doubt or depression; the joke targets Calvinists' habit of answering anxiety with a lecture.
4. No graphic hell imagery; no naming of groups or people as reprobate; no jokes about specific people's damnation.
5. Automated reading-level check on plain answers (target about grade 6 to 8, a metric script in `scripts/`) and a banned-token test for the quip layer ("damned", "hell", "reprobate", "doomed").
6. Provide an on-screen "skip" for any question so an upset child can move on without losing the turn.

**Warning signs:** the winner-vs-others framing on the end screen; "Slough of Despond" text that begins "If you have to ask ..."; plain answers longer than three sentences.

**Phase to address:** Step 8 (child-suitability read-through), Step 4 (panel: skip and layer defaults), Step 3 (schema: `audience: "all" | "older"`).

---

### Pitfall 18: Question pauses kill the pace of 4-player hot-seat

**What goes wrong:** With 32 to 35 question spaces (E6), a 4-player game has 16 to 18 question stops (p90 26 to 28) on top of about 66 draws, and each player sits through 4 to 5 stops while three others wait. Assuming 30 to 90 seconds per stop and about 10 seconds per plain turn (both inferred; not measured), the questions add roughly 8 to 25 minutes to an 11-minute board game, and the quiz adds more.

**How to avoid:** Default to quip only, with "Answer" and "Go deeper" as taps that do not block the next player; the modal never requires reading, only "Continue". Cap panel content on first view to the quip and a two-sentence plain answer. Provide "Next pilgrim" immediately after the quip. Make the quiz opt-in per game (already the plan) and time-box (no timer, but auto-collapse after Continue). Playtest on a phone with four people and record minutes; set a budget (for example median game under 35 minutes in 4-player with quiz off, under 45 with quiz on) and tune density with `simulate.mjs`. Use ARCHITECTURE.md's measured-rate definition of density rather than "one turn in three".

**Warning signs:** players reaching for their phones during another player's question; a p90 game length beyond an hour; "Go deeper" expanded by default.

**Phase to address:** Step 4 (panel), Step 7 (projector/phone pass), density tuning in Step 4.

---

### Pitfall 19: The headline questions are rarely seen, and repeated landings are unhandled

**What goes wrong:** The user's named exemplars are the hardest spaces to hit (E6): Slough of Despond (#35) appears in 19% of 4-player games and 7% of single-player games; Sea of Providence (#103, the "why pray?" question) 20% of 4-player games; Valley of the Shadow 12%. Meanwhile 16% of 4-player question stops (2.7 per game) land on a space already asked, and a fixed-space question shown twice (or to two players in a row) feels broken, while a pool question drawn at landing time can repeat unless bookkeeping is right.

**How to avoid:** Decide explicitly whether headline questions must be guaranteed. Options: (a) move the headline questions to spaces with high measured landing probability (for example #8, #48, #74, #90, #108 are named or shortcut spaces at 41% to 73% per 4-player game), (b) add a guaranteed "question of the day" at game start or end, (c) accept low frequency but do not market them as core. Pre-assign each generic space a unique question at game start by shuffling the pool once (no repeats by construction, no draw-time bookkeeping); for a re-landed space show a short "Already asked: [quip]" with a "Show again" button. Require pool size >= number of generic spaces + 10 so replays vary (ARCHITECTURE.md plans 30 pool questions).

**Warning signs:** playtests where nobody ever sees the Sea of Providence question; the same question twice in one game; pool exhaustion errors.

**Phase to address:** Step 4 (placement via `simulate.mjs`; pre-assignment), Step 3 (question ids).

---

### Pitfall 20: Quiz bonus movement creates landing loops, breaks effect order and the victory check

**What goes wrong:** A bonus of +2 lands on another question space about 18% to 22% of the time (E6), on a dot trap 1.3% to 1.6%, on a shortcut 0.6% to 0.8%; near the end a bonus can carry a pilgrim past 133 or onto it. Existing rules only trigger shortcuts for non-location cards (`pilgrims-predestined-path.jsx:363`), and the victory check exists only in `draw()` (line 356). A bonus implemented as "move n spaces then re-run landing" can chain questions (question -> bonus -> question -> bonus), trap a player who was not meant to move (a stuck pilgrim answering a question), or bypass the win test, and it breaks the invariant that pink named spaces are reachable only by character cards if the bonus is a literal +n.

**How to avoid:** Write an order-of-effects table and encode it in the engine with tests (ARCHITECTURE.md has precedence tests 1 to 6 and bonus rule 7; agree with its rules: bonus of 2, walk over quiet spaces, cap at 132, voided while trapped, once per player per question): (1) place the token on the landing space; (2) if the space is a shortcut, apply the jump first (a question on the shortcut space itself is asked before the jump; specify which); (3) trap check; (4) question; (5) quiz; (6) bonus at most once, and a bonus destination never triggers a further question, shortcut, trap or victory; (7) victory only via a card draw. Encode as pure functions and property-test "no sequence of bonuses ever reaches 133". Also decide what a bonus does to a pilgrim who lands on a dot: recommended none (bonus voided while trapped).

**Warning signs:** a test that asserts only single steps; games where the log shows "bonus" twice in a row; a token appearing on pink named spaces after a bonus.

**Phase to address:** Step 5 (Quiz), with engine invariants written in Step 1 and Step 4.

---

### Pitfall 21: Adding question spaces shifts the color cycle and card reachability

**What goes wrong:** If a new question space is implemented like the existing named spaces (`s.color="pink"`), color cards can no longer land there and that slot vanishes from its color's cycle. Extra pink spaces raise the mean advance per color card (E6: +19% for 15 recolored spaces), shorten games and change the ratio of card types (character cards only teleport to the six named indices `NAMED_IDX`). Recoloring traps to a neighbour's color already starves them (E6). Making generic question spaces "named" would also require more location cards in the deck (`buildDeck`, lines 78-85), changing deck composition (78 cards) and reshuffle cadence.

**How to avoid:** Implement question markers as an overlay flag (`questionId`) on an unchanged `SPACES[i].color`; never change `color`, `type` or deck composition. Freeze `board.js` colors with a snapshot test that hashes the color array; only trap colors that already differ from the cycle may be listed as exceptions. Re-run the simulation after any board edit. If trap starvation is undesirable, un-recolor traps or move them to spaces whose color is not repeated by the previous cycle space; this changes game feel and needs a decision.

**Warning signs:** the color snapshot test changing in a diff; the fraction of games ending by overshoot rising; the "pink spaces reachable only by cards" invariant test failing.

**Phase to address:** Step 1 (snapshot and invariants), Step 4 (marker overlay).

---

### Pitfall 22: State machine and randomness pitfalls when adding question states

**What goes wrong:** The current turn flow is two states (`ts` "draw"/"next") with many `useState` setters called together (`draw`, lines 332-379). Adding question, quiz and bonus states as more booleans creates impossible combinations (for example "next" available while a modal is open). Picking a random pool question inside a state updater or reducer runs twice under React StrictMode (dev) and can draw two questions or consume the pool early; the deck rebuild in `next()` uses `Math.random` in an event handler, which is fine, but the same pattern in a reducer is not.

**How to avoid:** One `useReducer` with an explicit `phase` (`draw | resolving | question | quiz | next | end`) and all randomness pre-computed outside the reducer or drawn from a seeded PRNG carried in state (ARCHITECTURE.md's `state.seed`). Gate the "Next Pilgrim" button and card draw on `phase`, never on separate flags. Add a test that dispatches every action in every phase and asserts illegal ones are ignored.

**Warning signs:** the dev console showing double log entries; a "Next" button visible during a question; different outcomes when StrictMode is toggled.

**Phase to address:** Step 1 (reducer), Step 4.

---

### Pitfall 23: Quiz fairness and design for a mixed audience

**What goes wrong:** A bonus for correct answers favours the seminary graduate at a table with children and outsiders, and turns a friendly game into a test (which is also why the user made it optional). Questions asked before the answer punish anyone unfamiliar with the vocabulary; feedback by color alone is inaccessible.

**How to avoid:** The quiz is about what was just read (open-book: the quip and plain answer are visible), the bonus is small (2 spaces), a wrong answer costs nothing, and one attempt per question per player. Provide text and icon feedback (not color only) and a "skip" that does not affect turn order. State on the setup toggle that the quiz is optional and non-punitive. Keep questions at plain-answer reading level.

**Warning signs:** children skipping the quiz; adults winning by a wide margin in every playtest.

**Phase to address:** Step 5.

---

### Pitfall 24: Endgame overshoot is silent and interacts with any new movement

**What goes wrong:** `findNext` (`pilgrims-predestined-path.jsx:88`) returns 133 when no space of the drawn color remains ahead, so near the end most cards win (about 76% of simulated 4-player games end this way, E6). It is existing behaviour, but a bonus of two spaces or a question space near 125 to 132 can change who wins; and any refactor that "fixes" the fall-through changes game length.

**How to avoid:** Characterise the current rule first (Step 1 test), decide whether it is intended (fast, exciting finish) or a bug, and keep question spaces off 126 to 132 (choose placements <= 125; existing #127 Celestial City is a landmark) and cap bonuses at 132.

**Warning signs:** a characterization test that expects exact-match wins only; winners arriving by cards whose color does not appear ahead.

**Phase to address:** Step 1 (characterization), Step 4 (placement), Step 5 (bonus cap).

---

## C. Build and Deploy Pitfalls

### Pitfall 25: Absolute paths and the legacy Pages source (verified live)

**What goes wrong:** Pages is in legacy mode and serves the unbuilt `index.html`. I fetched https://avocadopanic.github.io/pilgrims-predestined-path/ on 2026-09-29: it returns the raw source `index.html` with `Cache-Control: max-age=600`, whose `<script src="/src/main.jsx">` and `<link href="/vite.svg">` are absolute. They resolve against the origin root, not the repo path: https://avocadopanic.github.io/src/main.jsx returns 404 (and the origin root returns 404). `/src/main.jsx` under the repo path is served as `Content-Type: text/jsx`, which browsers refuse as a module script. The favicon `/vite.svg` does not exist in the repo either. Setting `base: '/pilgrims-predestined-path/'` (already in `vite.config.js`) only helps once Vite builds and rewrites these URLs; runtime `fetch('/data/...')` or `<img src="/...">` written by hand bypasses `base`.

**How to avoid:** Switch the Pages source to "GitHub Actions" (repo setting; needs the user's go-ahead as PROJECT.md notes). Use only imports and `import.meta.env.BASE_URL` for assets; import JSON data through Vite rather than `fetch`. Put static files (icons, manifest icons) in `public/` and reference them without a leading slash in HTML or with `import.meta.env.BASE_URL`. Add a post-deploy smoke test in CI that curls the deployed URL and asserts the `<script>` path starts with `/pilgrims-predestined-path/assets/`.

**Warning signs:** blank page with 404 for `/src/main.jsx` or `/assets/...`; a `text/jsx` MIME error; local dev works but production is blank.

**Phase to address:** Step 0.

---

### Pitfall 26: Workflow, lockfile and dual-deploy traps

**What goes wrong:** `.github/workflows/deploy.yml` contains literal `\n` (invalid YAML), no build step, and `publish_dir: ./docs` while Vite emits `./dist` (verified by reading the file); `package.json` also has a `deploy: gh-pages -d dist` script, a second competing deploy path; there is no lockfile, so `npm ci` fails ("can only install with an existing package-lock.json"). A lockfile generated on Windows can omit Linux native optional dependencies of the bundler (npm bug https://github.com/npm/cli/issues/4828; Vite 8 uses Rolldown, whose platform bindings are optional packages), making `npm ci` on `ubuntu-latest` fail with "Cannot find module @rolldown/binding-linux-x64-gnu" (MEDIUM: confirmed pattern from the npm issue and forum reports, not reproduced here). `node-version: lts/*` flips major versions on a schedule (ARCHITECTURE/STACK.md pin Node 24). Missing `permissions` (`pages: write`, `id-token: write`) or the `environment: github-pages` block causes deploy-pages to fail.

**How to avoid:** Use Vite's official workflow (verified from vitejs/vite `main`: `actions/checkout`, `actions/setup-node`, `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact` with `path: './dist'`, `actions/deploy-pages`, permissions `contents: read`, `pages: write`, `id-token: write`, concurrency group `pages`), pinned to Node 24. Delete the `gh-pages` dependency and script. Commit `package-lock.json` after a clean `npm install`; if the first Linux CI run reports a missing optional binding, delete `node_modules` and the lockfile, reinstall, and commit again (recommended fix in the npm issue), or add the platform packages as explicit `optionalDependencies`. Add a `.gitignore` (`node_modules/`, `dist/`, `.env*`). Run `npm run build && npm run preview` locally before pushing.

**Warning signs:** the Actions run failing at "Parse workflow" or "npm ci"; a deployed site showing the README or a 404; two deploy mechanisms in the repo.

**Phase to address:** Step 0.

---

### Pitfall 27: Version mismatches

**What goes wrong:** `package.json` pins `vite ^3.0.0`. Current `@vitejs/plugin-react` 6.1.1 peers on `vite ^8` (registry read); Vite 8.3.1 needs Node `^20.19.0 || >=22.12.0`; `ReactDOM.render` (still in `src/main.jsx`) is removed in React 19. Mixing majors yields cryptic errors, and `^18.0.0` will not move to 19 on its own.

**How to avoid:** Follow STACK.md (Vite 8 + plugin-react 6 + React 19 + Node 24 + `createRoot`). Pin exact versions in the lockfile and use Renovate/Dependabot only for patches until the game is stable. Add `engines` in `package.json`.

**Warning signs:** `Cannot find module 'vite/...'` from the plugin; `ReactDOM.render is not a function`.

**Phase to address:** Step 0.

---

### Pitfall 28: Windows development quirks

**What goes wrong:** (a) Git config shows `core.autocrlf=true` and there is no `.gitattributes`: CRLF endings can appear in shell scripts, YAML and the lockfile, breaking Linux CI steps or noisy diffs. (b) The filesystem is case-insensitive: `import './app'` for `App.jsx` works on Windows and fails on Linux CI; a case-only rename is invisible to git unless done with `git mv`. (c) `package.json` scripts using inline env vars (`NODE_ENV=production vite build`) fail under PowerShell/cmd. (d) PowerShell's execution policy can block `npm.ps1`. (e) The machine's rules ban `sed -i` in Git Bash (it truncates files), so verse-building and fixup scripts must be Node, not sed pipelines.

**How to avoid:** Add `.gitattributes` (`* text=auto eol=lf` and `*.yml text eol=lf`), enable `git config core.ignorecase false` locally, use `git mv` for the `pilgrims-predestined-path.jsx` -> `src/App.jsx` move, write every script in Node, and let CI (Linux) be the case-sensitivity test. Use `cross-env` only if an env var is needed at all.

**Warning signs:** "Cannot find module" only in CI; whole-file diffs after a commit; a script failing only in PowerShell.

**Phase to address:** Step 0, Step 1.

---

### Pitfall 29: Fonts loaded from Google inside a React screen

**What goes wrong:** The Google Fonts `<link>` is rendered inside the setup screen (line 391) and again inside the play screen (line 429); when a screen unmounts, its stylesheet is removed and the font can revert to Georgia. It also sends visitors' IP addresses to Google, which matters for an app aimed at children and for EU visitors (German courts have awarded damages over embedded Google Fonts; LOW, from memory), and it fails offline, which contradicts the PWA requirement.

**How to avoid:** Self-host EB Garamond (latin subset, woff2) via `@fontsource/eb-garamond` or `public/fonts`, load with CSS `@font-face` in the main stylesheet, include in the PWA precache, set `font-display: swap`, keep Georgia as fallback. Remove both `<link>` elements.

**Warning signs:** fonts flicker between screens; network requests to fonts.googleapis.com in DevTools; offline shows Georgia.

**Phase to address:** Step 0 (move to self-hosting early), Step 9 (precache).

---

### Pitfall 30: SPA routing habits that fail on GitHub Pages

**What goes wrong:** Adding React Router with browser history, or `fetch`ing paths relative to root, produces 404 on refresh because Pages has no rewrite rules; only `404.html` is served for unknown paths.

**How to avoid:** No router (the game has one screen state machine). If a deep link is ever needed, use a hash (`#/`) or a query string. If a `404.html` is used, copy `index.html` to it in the build (and remember the PWA `navigateFallback`).

**Warning signs:** direct URL loads returning GitHub's 404 page.

**Phase to address:** Step 0 (do not add a router); Step 9 (navigateFallback).

---

## D. PWA Pitfalls (scope update)

### Pitfall 31: Service worker serves a stale build after deploys, and an automatic reload wipes a game in progress

**What goes wrong:** GitHub Pages serves HTML with `Cache-Control: max-age=600` (verified live), so browsers and the service worker may see an old `index.html` for up to ten minutes after a deploy; the service worker then precaches the old build until a new worker activates. `vite-plugin-pwa`'s `registerType: 'autoUpdate'` reloads open pages to take control, and its own docs warn: "The disadvantage of using this behavior is that the user can lose data in any browser windows/tabs in which the application is open and is filling in a form" (https://vite-pwa-org.netlify.app/guide/auto-update.html, read). For a hot-seat game with no saved games (out of scope), a reload mid-turn ends the game. Old precache entries also accumulate unless `cleanupOutdatedCaches` is on. A broken worker script can trap users on a bad build.

**How to avoid:** Use `registerType: 'prompt'`; show "Update available" only on the setup and end screens (never mid-game) and apply the update when the user starts a new game. Set `workbox.cleanupOutdatedCaches: true`. Keep the worker filename stable (`sw.js`), exclude it from precache, and ship a kill-switch procedure (a `sw.js` that unregisters itself) documented in the repo. Version the build (`__APP_VERSION__` in Credits) so a bug report names the build. Test the upgrade path: deploy build A, load, deploy build B, reload, confirm the prompt and that the game state is not lost.

**Warning signs:** users seeing yesterday's text after a deploy; a game resetting by itself; multiple `workbox-precache-*` caches in DevTools.

**Phase to address:** Step 9 (PWA); Step 0 must not register any worker.

---

### Pitfall 32: Scope and `start_url` mistakes under the `/pilgrims-predestined-path/` base

**What goes wrong:** A service worker's default maximum scope is the folder it is served from; GitHub Pages cannot send the `Service-Worker-Allowed` header, so `scope: '/'` is invalid. A manifest with `start_url: '/'` or icons at `/icon.png` points at `https://avocadopanic.github.io/` (which is a 404, verified), so installs launch a blank page and Lighthouse fails "installable". Relative and absolute URL mixtures in `manifest.webmanifest` are resolved against the manifest URL, not the page.

**How to avoid:** Serve the worker at `/pilgrims-predestined-path/sw.js`; set manifest `scope` and `start_url` to `/pilgrims-predestined-path/` (or relative `./`), `id` to the same, and icon `src` values relative to the manifest. Let `vite-plugin-pwa` derive `base` from Vite's `base`, then open the generated `manifest.webmanifest` and `sw.js` in the built `dist/` and verify. Set navigation fallback to `index.html` under the base. Verify with DevTools > Application: scope shown as `https://avocadopanic.github.io/pilgrims-predestined-path/`.

**Warning signs:** "Site cannot be installed: no matching service worker detected" or "start_url not in scope"; an installed icon that opens a 404.

**Phase to address:** Step 9.

---

### Pitfall 33: GitHub Pages shares one origin across all of the user's repos

**What goes wrong:** Every project site under `avocadopanic.github.io` is the same origin. localStorage, IndexedDB and Cache Storage are shared, so another repo (or a future `avocadopanic.github.io` user site) can collide on key names such as `settings`, or read this app's storage. A root-scope service worker from a future user site would also control pages under the game path until the game's own worker (a longer scope) installs. (Today the user site root is a 404, so no collision exists; verified.)

**How to avoid:** Prefix every storage key and custom cache name (`ppp:`), never use generic names; Workbox precache names embed the scope, so keep defaults for it. Store only preferences (translation, quiz toggle). Use `sessionStorage` or memory for anything else. Document this in the repo README so the user does not reuse the same keys in the next project.

**Warning signs:** the game reading a `settings` key that it did not write; "quota exceeded" from another project's data.

**Phase to address:** Step 6 (settings storage design), Step 9.

---

### Pitfall 34: iOS standalone quirks

**What goes wrong:** iOS does not fire `beforeinstallprompt`; installation is Share > "Add to Home Screen" (WebKit's iOS 16.4 post: sites become web apps by manifest with `display` set to `standalone` or `fullscreen`, and "apple-touch-icon will take precedence over the Manifest-declared icons"). Without an `apple-touch-icon` the home-screen icon is a screenshot. Dynamic toolbars make `100vh` layouts (the existing code uses `minHeight:"100vh"` and `calc(100vh - 140px)`, lines 390, 428, 446) overflow; standalone mode has no browser chrome, so there is no back button or URL bar, and external Bible links leave the app; the top and bottom safe areas need `viewport-fit=cover` and `env(safe-area-inset-*)`. WebKit's 7-day rule deletes a site's script-writable storage (including Cache API and service worker registrations) after seven days of Safari use without interaction, but "Web applications added to the home screen ... have their own counter of days of use" (https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/, read); a player who only opens the game in a Safari tab once a month may find it re-downloading. A home-screen app's storage is treated separately from Safari's (LOW; not verified here), so a translation chosen in Safari may not carry into the installed app. A blank flash between launch and first paint occurs with a dark theme unless `background_color` matches.

**How to avoid:** Provide an in-app "Install" help card for iOS (Share > Add to Home Screen) and use `beforeinstallprompt` only where present; ship a 180x180 `apple-touch-icon` and 192/512 manifest icons (maskable too); use `100dvh` with a `100vh` fallback and safe-area padding; open external links with `target="_blank" rel="noopener"` and add "opens outside the app" text; set `theme_color` and `background_color` to the game's dark background (`#0a0608`). Test on a real iPhone in both Safari and installed mode, in airplane mode.

**Warning signs:** a home-screen icon showing a page screenshot; content under the notch; no way back from a Bible link.

**Phase to address:** Step 7 (layout: dvh and safe areas), Step 9 (icons, install help).

---

### Pitfall 35: Cache size and offline completeness for bundled verse text

**What goes wrong:** If the four translation stores are lazily `import()`ed and only the chosen one is cached at runtime, a user who installs offline with BSB and later switches to ESV in airplane mode gets a blank verse. Conversely, precaching everything is fine here: STACK.md estimates roughly 300 verses x 4 translations under about 200 kB uncompressed (inferred), which is far below browser quotas, but the notice text, fonts and icons must also be precached or the licence attribution disappears offline (a licence compliance failure, not a cosmetic one).

**How to avoid:** Precache all four verse chunks, the fonts, icons, the Credits screen and its notices (Workbox `globPatterns` include `json`, `woff2`, `svg`, `png`); test in airplane mode by switching translation. Keep any verse-cap validator in CI so precached text cannot exceed licence caps. Keep ESV and NET text in the same bundle as their notices so they cannot be shipped apart.

**Warning signs:** the Credits page or a translation blank offline; precache manifest size growing unexpectedly; icons missing from the manifest list.

**Phase to address:** Step 9 (with Step 6 constraints).

---

## E. Legibility

### Pitfall 36: Low-contrast, tiny text on a dark theme fails phones, projectors and children

**What goes wrong:** Computed WCAG contrast against the page background `#0a0608` (my calculation): the "Calvin, Institutes III.21.5" attribution (`#6a5a4a`, 10px) 3.04:1; the rules note "There are no decisions..." (`#7a6a5a`) 3.87:1; inactive player names (`#5a4a3a`) 2.37:1; the "Book of Life" label (`#4a3a2a`) 1.85:1; position numbers (`#3a2a1a`, 8px) 1.46:1. AA needs 4.5:1 for normal text. Citations are the project's core value, and the attribution line is among the hardest text to read. Font sizes throughout are 7 to 11px.

**How to avoid:** Build a small type scale with minimum 16px on phone, larger on projector; body and citation text at >= 4.5:1; citations and translation labels are not "footnote grey". Include a contrast test over the token palette.

**Warning signs:** players holding the phone close; the projector test showing unreadable log and attribution text.

**Phase to address:** Step 7 (layout/projector pass).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-code quotes in JSX strings | Fast | Cannot be machine-verified, drifts from sources | Never; use the content model (Step 3) |
| Copy a quote from a quote site | Reads well | Fabricated or paraphrased text (Pitfall 6) | Never |
| Recolor a space to add a question | Easy visual marker | Changes card reachability and game length (Pitfall 21) | Never; use an overlay flag |
| Call the ESV API from the client | No build step | Key exposure, ToS breach, shared quota | Never |
| One big `useState` per new feature | Quick | Impossible states (Pitfall 22) | Only for throwaway prototypes |
| Autoupdate service worker | Zero UX code | Game wipes on deploy (Pitfall 31) | Never for this app |
| Ship BSB only, add others later | Public-domain safe | Attribution and license code untested | Acceptable for the first content release if the registry and validators already exist |
| Hand-edit verse JSON | Fix a typo fast | Text no longer matches the source (Pitfalls 3, 9) | Never; fix in the extraction script |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| ESV API | Key in client JS; runtime calls; API `50%` vs permissions `25%` confusion | Author-time only, <= 500 verses cached, use the stricter 25%; notice and esv.org link (Pitfall 1) |
| NET | Quoting notes; unlinked label | Text only; link "NET" to netbible.org (Pitfall 2) |
| BSB `bsb.txt` | Editing text but keeping the "BSB" label | Do not edit; label excerpts (Pitfall 3) |
| KJV sources | Mixing editions | One pinned source and edition (Pitfall 3) |
| CCEL text caches | Assuming the HTML page contains text (it loads by JavaScript; verified) | Use `.../<work>/cache/<work>.txt` (verified for Calvin, Arminius, Schaff) |
| GitHub Pages | Legacy branch source; absolute URLs | Source = Actions; `base`-aware assets (Pitfall 25) |
| npm on Windows -> Linux CI | Lockfile from Windows lacks Linux optional bindings | Regenerate or list optionalDependencies (Pitfall 26) |
| Google Fonts | `<link>` inside a React screen | Self-host (Pitfall 29) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Whole-board SVG re-render on every state change (CONCERNS.md) | Jank when a large question panel updates state each keystroke | Memoise static SVG layers; keep panel state outside board props | Noticeable on low-end phones once the panel adds state |
| Logging every event (`log` unbounded) | Memory growth in long 4-player games | Cap the log at about 200 entries | p90 games of 100 draws |
| Precaching unneeded assets | Slow first load | Precache only what offline play needs | If images or large fonts are added |
| Loading all four verse stores upfront on first paint | Slower start | Lazy-import the chosen translation, precache all in the worker | Only if stores grow beyond a few hundred kB |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| ESV key in `src/` or `.env` committed | Key leak, ToS violation, key revoked | Author-time script reads key from an untracked env var; never commit |
| Rendering verse text as HTML from the API's HTML endpoint | XSS or markup leakage | Use plain text; render with React text nodes, not `dangerouslySetInnerHTML` |
| Shared origin storage (Pitfall 33) | Cross-repo data read or collision | Prefix keys; store only preferences |
| External links without `rel="noopener"` | Tab hijack via `window.opener` | `target="_blank" rel="noopener noreferrer"` on every Bible link |
| Third-party font CDN | IP disclosure to a third party | Self-host (Pitfall 29) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Modal blocks the board, cannot dismiss with one tap | Child gets stuck; four players wait | One-tap Continue; quip-first (Pitfall 18) |
| "Go deeper" expanded by default | Wall of text on a phone | Collapsed; explicit "Older readers" tag (Pitfall 17) |
| Correct/incorrect shown by color only | Excludes color-blind players | Text and icon feedback (Pitfall 23) |
| Translation picker hidden inside a menu | Players do not find it; attribution missing when default shows | Setup-screen choice plus a per-quote switch; attribution always adjacent (Pitfall 1) |
| Contrast and font sizes (Pitfall 36) | Unreadable on phone or projector | Type scale and contrast test |
| PWA update reload mid-game (Pitfall 31) | Game lost | Prompt-based update only at safe screens |

## "Looks Done But Isn't" Checklist

- [ ] **Bible translations:** Often missing the notice on the Credits screen and in the offline cache. Verify: airplane mode, open Credits, read all four notices; ESV has "Text Edition: 2025" (or the current year) and NET's label is a link.
- [ ] **ESV cap:** Often no automated check. Verify: `npm test` fails if unique ESV verses > 500 or ESV words >= 15% of authored words.
- [ ] **Quotes verified:** Often "verified" by re-reading. Verify: every quote record has `verifiedBy` and `retrievedOn`, and the substring test passes against the cached primary text.
- [ ] **Setup-screen quote replaced:** Verify the string "display of His attributes" no longer appears anywhere (`grep`).
- [ ] **Fatalism copy gone:** Verify banned-phrase test passes for all strings in `copy.js` (Pitfall 10).
- [ ] **Traps and headline questions visible in playtests:** Verify the simulation reports at least X% of games (decide X, for example 40%) seeing each headline question.
- [ ] **Quiz bonus:** Verify property test "no bonus sequence reaches 133 or triggers a second question".
- [ ] **Deployed site:** Verify the live URL loads assets from `/pilgrims-predestined-path/assets/`, and Settings > Pages shows source "GitHub Actions".
- [ ] **PWA:** Verify install works on Android Chrome and iOS Safari, the installed app plays a full game offline, and a second deploy prompts an update only at setup or end screens.
- [ ] **Child suitability:** Verify a reader who has not seen the game can read a full 4-player game's questions without encountering hell imagery, "damned" in a quip, or a "you are unchosen" state.
- [ ] **Catholic and Arminian statements:** Verify each has its citation and passes the fair-statement checklist (Pitfall 14).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong quote published | LOW | Replace via the content model, re-run the verifier, redeploy; a bad quote is one record, not scattered strings |
| ESV cap exceeded | LOW to MEDIUM | Remove verses, reduce to links, or request a licence; the cap test blocks recurrence |
| Crossway objects to "Go deeper" as commentary | MEDIUM | Switch ESV to link-out-only and keep BSB/KJV/NET in-app |
| Stale service worker in the wild | MEDIUM | Ship an unregistering `sw.js`, bump the version, instruct users to reload (Pitfall 31) |
| Wrong `start_url` in installed PWAs | MEDIUM | Users must reinstall; fix the manifest and add `id` |
| Broken deploy after Pages source change | LOW | Revert the source setting or re-run the workflow; keep a manual `workflow_dispatch` |
| Fatalist or anti-Catholic joke discovered late | LOW | Content is in `copy.js`/question records; edit and redeploy |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1 ESV terms | Step 6 (+3, 8) | Cap test; no key in bundle; notice on Credits; Crossway reply on "commentary" |
| 2 NET terms | Step 6 | Label is a link; no notes in data |
| 3 BSB/KJV obligations | Step 6, 3 | Registry has source, date, courtesy line |
| 4 Cross-translation parity | Step 3, 6 | Every ref exists in all four stores |
| 5 Repo licence vs Scripture | Step 6, 8 | NOTICE file; README |
| 6 Calvin composite | Step 8 (+3) | Substring test; string removed |
| 7 Misattributed quotes | Step 8 (+3) | Banned-quotes test |
| 8 Copyrighted translations | Step 3, 8 | Source registry lists PD translator |
| 9 Verification method | Step 3, 8 | Verifier passes; edition pinned |
| 10 Fatalism | Step 2, 8 | Banned-phrase test |
| 11 TULIP glosses | Step 8 | Reviewed against anchors |
| 12 Reprobation/equal ultimacy | Step 8, 3 | Schema requires anchor + pastoral line |
| 13 Hyper-Calvinism/distractors | Step 5, 8 | Quiz content rules |
| 14 Other traditions, Catholic tropes | Step 8, 4, 3 | Fair-statement checklist per named tradition |
| 15 Reformed monolith | Step 8 | `source.document` required |
| 16 Player names | Step 2, 8 | No election-related labels |
| 17 Kids and despair | Step 8, 4, 3 | Reading-level and banned-token tests; skip control |
| 18 Pacing | Step 4, 7 | Playtest minutes recorded |
| 19 Headline visibility, repeats | Step 4 | Simulation shows visibility target; pre-assignment |
| 20 Quiz bonus | Step 5 (+1, 4) | Property tests |
| 21 Color cycle and reachability | Step 1, 4 | Color snapshot test |
| 22 State machine and RNG | Step 1, 4 | Illegal-action tests; StrictMode run |
| 23 Quiz fairness | Step 5 | Playtest with mixed ages |
| 24 Endgame overshoot | Step 1, 4, 5 | Characterization test; bonus cap |
| 25 Absolute paths, legacy Pages | Step 0 | Post-deploy smoke test |
| 26 Workflow and lockfile | Step 0 | Green CI on Linux |
| 27 Version mismatches | Step 0 | Build passes; engines set |
| 28 Windows quirks | Step 0, 1 | `.gitattributes`; CI case check |
| 29 Fonts | Step 0, 9 | No requests to fonts.googleapis.com |
| 30 SPA routing | Step 0, 9 | No router; refresh works |
| 31 Stale SW / reload | Step 9 | Two-deploy upgrade test |
| 32 Scope/start_url | Step 9 | DevTools scope check; Lighthouse install |
| 33 Shared origin | Step 6, 9 | Prefixed keys |
| 34 iOS standalone | Step 7, 9 | Real-device test |
| 35 Offline completeness | Step 9 | Airplane-mode translation switch and Credits |
| 36 Legibility | Step 7 | Contrast test; projector test |

## Research Flags for the Roadmap

- **Step 6 (Translations):** needs a short human action, not more research: email Crossway about the "commentary" clause and record the answer; decide whether to keep NET at the ESV caps.
- **Step 4 (Question state):** rerun the simulation on the real engine and decide how headline questions are guaranteed (Pitfall 19).
- **Step 8 (Accuracy gate):** schedule as its own phase; it is the long tail (48+ verified questions).
- **Step 9 (PWA):** needs a prototype and real-device tests (iOS installed mode, offline, two-deploy upgrade).
- **Step 0 (Deploy):** standard once the Pages source setting is changed with the user's go-ahead.

## Gaps and Unverified Items

- Heidelberg Catechism and any Luther text: no public-domain translation opened this session (LOW); do not quote until verified.
- Council of Orange 529 wording is from a search summary (MEDIUM); Trent, Dort, WCF, WSC, Formula of Concord and Remonstrance texts were read from primary sources.
- Cambridge's KJV permission page returned HTTP 403; the 500-verse / 25% / non-commercial wording is from a summary (MEDIUM).
- NET numeric caps: current page lists none; an unverified summary claimed 500 / 25% (LOW).
- Psalm-title verse numbering in NET vs others (Pitfall 4) is unverified (LOW).
- Google Fonts damages ruling (Pitfall 29) is from memory (LOW).
- iOS separate-storage claim for home-screen apps (Pitfall 34) is unverified (LOW).
- Time-per-question and time-per-turn estimates (Pitfall 18) are assumptions.
- Calvin III.23.1 wording is Beveridge's headnote only.
- Not legal advice; the ESV "commentary" question can only be settled by Crossway.

## Sources

- Crossway permissions: https://www.crossway.org/permissions/ (raw, HIGH)
- ESV API terms: https://api.esv.org/ (raw, HIGH)
- NET copyright: https://netbible.com/copyright/ (raw, HIGH)
- BSB: https://bereanbible.com/bsb.txt (raw header, HIGH); https://berean.bible/licensing.htm and https://berean.bible/terms.htm (summariser, MEDIUM)
- KJV: https://ebible.org/kjv/copr.htm (raw, HIGH); https://en.wikipedia.org/wiki/King_James_Version (raw, HIGH secondary); Cambridge permissions via search summary (MEDIUM)
- Calvin, Institutes (Beveridge 1845): https://www.ccel.org/ccel/calvin/institutes/cache/institutes.txt (raw, HIGH); Allen 1813: https://archive.org/download/institutesofchrlond02calv/institutesofchrlond02calv_djvu.txt (raw, HIGH)
- Westminster Confession and Shorter Catechism (OPC editions): https://www.opc.org/wcf.html, https://www.opc.org/sc.html (raw, HIGH)
- Canons of Dort and Remonstrance (Schaff, Creeds of Christendom vol. 3): https://www.ccel.org/ccel/schaff/creeds3/cache/creeds3.txt (raw, HIGH)
- Council of Trent Session 6: https://history.hanover.edu/texts/trent/ct06.html (raw, HIGH)
- Catechism of the Catholic Church 1037: https://www.vatican.va/archive/ENG0015/__P2O.HTM (raw, HIGH)
- Formula of Concord Epitome XI: https://bookofconcord.org/epitome/ (raw, HIGH)
- Arminius, Works vol. 3 (CCEL cache): https://www.ccel.org/ccel/arminius/works3/cache/works3.txt (raw, checked for the game quote, HIGH)
- Spurgeon misquotes: https://www.spurgeon.org/blog/6-things-spurgeon-didnt-say (raw, HIGH)
- Luther and Calvin quotation status: https://en.wikiquote.org/wiki/Martin_Luther, https://en.wikiquote.org/wiki/John_Calvin (raw, HIGH secondary); https://en.wikipedia.org/wiki/Diet_of_Worms
- Five points and hyper-Calvinism overview: https://en.wikipedia.org/wiki/Five_points_of_Calvinism, https://en.wikipedia.org/wiki/Hyper-Calvinism (secondary)
- Vite static deploy guide and sample workflow: https://raw.githubusercontent.com/vitejs/vite/main/docs/guide/static-deploy.md and static-deploy-github-pages.yaml (raw, HIGH)
- npm registry (vite 8.3.1, @vitejs/plugin-react 6.1.1, react 19.3.0, vite-plugin-pwa 1.3.0): `npm view` on 2026-09-29 (HIGH)
- npm optional-dependency bug: https://github.com/npm/cli/issues/4828 (via search, MEDIUM)
- vite-plugin-pwa auto-update vs prompt: https://vite-pwa-org.netlify.app/guide/auto-update.html (raw, HIGH)
- WebKit: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ (raw, HIGH); https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ (summariser, MEDIUM)
- Live site headers and paths: `curl -I` of https://avocadopanic.github.io/pilgrims-predestined-path/, /src/main.jsx and the origin root (HIGH)
- Project files read: `.planning/PROJECT.md`, `.planning/codebase/CONCERNS.md`, `pilgrims-predestined-path.jsx`, `package.json`, `vite.config.js`, `index.html`, `.github/workflows/deploy.yml`, `LICENSE`, `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`

---
*Pitfalls research for: satirical-but-accurate Reformed theology board game (React + Vite, GitHub Pages, PWA)*
*Researched: 2026-09-29*
