# Literary Generators — An Obsidian Vault

Random inspiration from the public domain canon.

I wanted a way to spark ideas during tabletop RPG session prep — a random Bible verse, a line of Shakespeare, a fragment of poetry. Not for any scholarly purpose, just to see what the dice (so to speak) throw up and let it nudge a scene, a name, a mood.

The Bible and the Complete Works of Shakespeare are traditional touchstones — endlessly quotable and full of drama, treachery, beauty, and weirdness. There's also a vast wealth of out-of-copyright poetry that most of us have barely scratched the surface of. This vault puts all three at your fingertips.

## What's in the box

| Generator | Source | Content |
|-----------|--------|---------|
| **Bible (KJV)** | King James Version | 31,102 verses across 66 books |
| **Shakespeare** | Complete Works | ~31,000 speeches across 43 works |
| **Poetry** | 129 poets via PoetryDB | 3,092 poems |

Each generator returns a random fragment with a clickable link to the full source text. Shakespeare and Poetry results have expandable layers — click to go from a single line to the containing stanza or speech, then to the full poem or sonnet.

## How to use

1. Download or clone this repo
2. Open the folder as an Obsidian vault (or copy it into an existing vault)
3. Make sure the **Dataview** community plugin is installed and enabled, with **Enable JavaScript Queries** turned on in its settings
4. Open `Index.md` and pick a generator

No other plugins are required.

## How it works

The engine (`Lib/literary.js`) is a lightweight DataviewJS script. Each generator note is a thin shell that loads the engine and points it at a data directory. The data is split into small JSON files (one per Bible book, Shakespeare play, or poet) so the engine only loads what it needs for each random pick — no multi-megabyte files in memory.

```
Literary Generators/
  Lib/literary.js         — shared engine
  Data/
    Bible/                — 66 book JSONs + index
    Shakespeare/          — 43 work JSONs + index
    Poetry/               — 129 author JSONs + index
  Source/                 — browsable full-text markdown (~238 files)
  Bible.md                — generator note
  Shakespeare.md          — generator note
  Poetry.md               — generator note
  Index.md                — master index
```

## Data sources and licensing

All underlying texts are **public domain**.

| Source | Repository | Text status | Repo license |
|--------|-----------|-------------|-------------|
| KJV Bible | [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) | Public domain | MIT |
| Shakespeare | [edent/Open-Source-Shakespeare](https://github.com/edent/Open-Source-Shakespeare) | Public domain | Unlicense |
| Poetry | [PoetryDB](https://github.com/thundercomb/poetrydb) | Public domain poems | GPL v2 (API code only) |

The poetry texts were retrieved from the PoetryDB API. The poems themselves are public domain works by authors who died long before copyright would apply. The GPL v2 license on the PoetryDB repository covers the API server code, not the poem texts it serves.

**Note for UK users:** The King James Version is subject to a perpetual Royal Prerogative (Crown Copyright) in the United Kingdom, restricting its printing and publication. This applies to commercial publishers — enforcement against digital, non-commercial redistribution is unheard of — but it's worth knowing about.

This project (engine code, JSON data structures, and markdown files) is released under **CC0 1.0 Universal** — public domain, no rights reserved. Do whatever you like with it.

## Credits

Built with the help of Claude (Anthropic). All the interesting words belong to their original authors.
