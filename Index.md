# Literary Generators

Random inspiration from the public domain canon.

```dataviewjs
const base = dv.current().file.folder;
const lib = await dv.io.load(base + "/Lib/literary.js");
const LitGen = new Function(lib + "; return LitGen;")();
await LitGen.buildIndexUI(dv, base);
```

---

## Browse Sources

| Generator | Source | Items |
|-----------|--------|-------|
| [Bible (KJV)](Bible.md) | King James Version | 31,102 verses |
| [Shakespeare](Shakespeare.md) | Complete Works | 114,461 lines |
| [Poetry](Poetry.md) | 129 poets via PoetryDB | 3,092 poems |
| [Classics](Classics.md) | 26 ancient works via Standard Ebooks | 97,260 lines |
| [Motif-Index](Motifs.md) | Stith Thompson's Motif-Index of Folk-Literature | 46,244 motifs |

Each generator returns a random fragment with a clickable link back to the full source text for context.
