# Literary Generators — An Obsidian Vault

Random inspiration from the public domain canon.

I wanted a way to spark ideas during tabletop RPG session prep — a random Bible verse, a line of Shakespeare, a fragment of poetry. Not for any scholarly purpose, just to see what the dice (so to speak) throw up and let it nudge a scene, a name, a mood.
They could also be useful for inspiration for other things, writing prompts, your own art or poetry. Anything that needs a creative spark.

The Bible and the Complete Works of Shakespeare are traditional touchstones — endlessly quotable and full of drama, treachery, beauty, and weirdness. There's also a vast wealth of out-of-copyright poetry that most of us have barely scratched the surface of. The ancient Greeks and Romans were writing about war, love, fate, and the gods long before any of us were born — Homer, Plato, Sophocles, and friends fit right in. And Stith Thompson's Motif-Index of Folk-Literature catalogs tens of thousands of recurring story motifs from world folklore — "dragon steals princess", "magic ring grants wishes", "trickster outwits death" — each one a ready-made plot hook.

## What's in the box

| Generator | Source | Content |
|-----------|--------|---------|
| **Bible (KJV)** | King James Version | 31,102 verses across 66 books |
| **Shakespeare** | Complete Works | ~31,000 speeches across 43 works |
| **Poetry** | 129 poets via PoetryDB | 3,092 poems |
| **Classics** | 26 ancient works via Standard Ebooks | 97,260 lines from 13 authors |
| **Motif-Index** | Stith Thompson via [fbkarsdorp/tmi](https://github.com/fbkarsdorp/tmi) | 46,244 motifs across 23 categories |

Each generator returns a random fragment with a clickable link to the full source text. Shakespeare, Poetry, and Classics results have expandable layers — click to go from a single line to the containing stanza or speech, then to the full poem, sonnet, or passage. Motif-Index results expand to show locations, references, and additional context.

## Try it online

You can use the generators right now at the [GitHub Pages site](https://blockbeard.github.io/literary-generators/) — no download or setup needed.

If you want the full Obsidian experience with wiki-linked source texts, instructions below.

## Download and setup

### Option A: Open as a standalone vault

1. **Download the repo** — click the green **Code** button above, then **Download ZIP**, and unzip it somewhere on your computer. Or if you are git-savvy clone it. 
2. **Open as a vault** — in Obsidian, click **Open another vault** (the vault icon in the bottom-left), then **Open folder as vault**, and select the `literary-generators` folder.
3. **Install Dataview** — see [Setting up Dataview](#setting-up-dataview) below.
4. Open `Index.md` and start generating.

### Option B: Add to an existing vault

1. **Download the repo** as above.
2. **Copy the folder** into your existing vault — just drag the whole `literary-generators` folder (or its contents) into your vault's root folder.
3. **Install Dataview** if you haven't already — see below.
4. Navigate to `Literary Generators/Index.md` (or whatever you named the folder) and start generating.

> **Note:** All links are relative, so you can rename the folder to whatever you like and everything will still work.

### Setting up Dataview

The generators need the **Dataview** community plugin with JavaScript queries enabled.

1. In Obsidian, go to **Settings** → **Community plugins**
2. If you haven't already, turn off **Restricted mode** to allow community plugins
3. Click **Browse**, search for **Dataview**, and install it
4. **Enable** the plugin
5. Go to **Settings** → **Dataview** and turn on **Enable JavaScript Queries**
6. Close settings — the generator notes should now render

If you see a code block instead of a generator UI, JavaScript queries aren't enabled (step 5).

## A note on use

This is for humans. Read the words, let them inspire you, see what they shake loose. Don't type them into an LLM. The whole point is that a real person wrote these words and they might spark something in a real person today. 

## How it works

The engine (`Lib/literary.js`) is a lightweight DataviewJS script. Each generator note is a thin shell that loads the engine and points it at a data directory. The data is split into small JSON files (one per Bible book, Shakespeare play, poet, or motif category) so the engine only loads what it needs for each random pick — no multi-megabyte files in memory.

```
Literary Generators/
  Lib/literary.js         — shared engine
  Data/
    Bible/                — 66 book JSONs + index
    Shakespeare/          — 43 work JSONs + index
    Poetry/               — 129 author JSONs + index
    Classics/             — 26 work JSONs + index
    Motifs/               — 23 category JSONs + index
  Source/                 — browsable full-text markdown (~238 files)
  Bible.md                — generator note
  Shakespeare.md          — generator note
  Poetry.md               — generator note
  Classics.md             — generator note
  Motifs.md               — generator note
  Index.md                — master index (all five generators)
```

## Data sources and licensing

All underlying texts are **public domain**.

| Source | Repository | Text status | Repo license |
|--------|-----------|-------------|-------------|
| KJV Bible | [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) | Public domain | MIT |
| Shakespeare | [edent/Open-Source-Shakespeare](https://github.com/edent/Open-Source-Shakespeare) | Public domain | Unlicense |
| Poetry | [PoetryDB](https://github.com/thundercomb/poetrydb) | Public domain poems | GPL v2 (API code only) |
| Classics | [Standard Ebooks](https://standardebooks.org/) | Public domain | CC0 |
| Motif-Index | [fbkarsdorp/tmi](https://github.com/fbkarsdorp/tmi) | Public domain reference work | Apache 2.0 |

The KJV Bible JSON data comes from [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) by Arul John. The text itself is public domain; the JSON structuring is **MIT licensed**. A copy of the license and attribution notice are included in `Data/Bible/`.

The poetry texts were retrieved from the PoetryDB API. The poems themselves are public domain works by authors who died long before copyright would apply. The GPL v2 license on the PoetryDB repository covers the API server code, not the poem texts it serves.

The Classics texts come from [Standard Ebooks](https://standardebooks.org/), which produces high-quality, carefully formatted editions of public domain works. Their editions are released under CC0. The 26 works cover Homer, Virgil, Ovid, Plato, Aristotle, Marcus Aurelius, Epictetus, Seneca, Julius Caesar, Herodotus, Thucydides, Suetonius, Sophocles, and Aeschylus.

The Motif-Index data comes from [fbkarsdorp/tmi](https://github.com/fbkarsdorp/tmi) by Folgert Karsdorp, a JSON digitization of Stith Thompson's *Motif-Index of Folk-Literature* (1955–1958). The index is a standard reference work in folklore studies, cataloging recurring narrative elements from world mythology and folk tales. The repository is licensed under the **Apache License 2.0**. A copy of the license and attribution notice are included in `Data/Motifs/`.

**Note for UK users:** The King James Version is subject to a perpetual Royal Prerogative (Crown Copyright) in the United Kingdom, restricting its printing and publication. This applies to commercial publishers — enforcement against digital, non-commercial redistribution is unheard of — but it's worth knowing about. If the King or his appointed representative contacts me I will of course be happy to take it down.

This project (engine code, JSON data structures, and markdown files) is released under **CC0 1.0 Universal** — public domain, no rights reserved. Do whatever you like with it.

## Credits
The [Sly Flourish](https://slyflourish.com/) discord server and the folks there for sparking the idea in me (Chris Wilson). 

Built with the help of Claude (Anthropic). 
I know people don't love AI. And I don't blame them, to me this was a good use of it. It coded me a tool to serve inspiration from real humans designed to inspire real humans. Without it this would be just an idea.

Just don't use it to write the damn poetry

All the interesting words belong to their original authors.