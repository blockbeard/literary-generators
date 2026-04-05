# Motif-Index

> Random motifs from the *Motif-Index of Folk-Literature* by Stith Thompson.
> 46,244 motifs across 23 categories — mythology, magic, tests, deceptions, and more.

```dataviewjs
const base = dv.current().file.folder;
const lib = await dv.io.load(base + "/Lib/literary.js");
const LitGen = new Function(lib + "; return LitGen;")();
await LitGen.buildMotifsUI(dv, base + "/Data/Motifs");
```

---

## Browse by Category

| Category | Name                           | Motifs |
| -------- | ------------------------------ | ------ |
| A        | Mythological Motifs            | 5,814  |
| B        | Animals                        | 2,672  |
| C        | Tabu                           | 1,247  |
| D        | Magic                          | 7,169  |
| E        | The Dead                       | 2,223  |
| F        | Marvels                        | 5,365  |
| G        | Ogres                          | 1,745  |
| H        | Tests                          | 2,751  |
| J        | The Wise and the Foolish       | 3,521  |
| K        | Deceptions                     | 3,873  |
| L        | Reversal of Fortune            | 317    |
| M        | Ordaining the Future           | 851    |
| N        | Chance and Fate                | 1,011  |
| P        | Society                        | 849    |
| Q        | Rewards and Punishments        | 1,511  |
| R        | Captives and Fugitives         | 509    |
| S        | Unnatural Cruelty              | 533    |
| T        | Sex                            | 1,500  |
| U        | The Nature of Life             | 169    |
| V        | Religion                       | 1,051  |
| W        | Traits of Character            | 369    |
| X        | Humor                          | 751    |
| Z        | Miscellaneous Groups of Motifs | 443    |

Data from [fbkarsdorp/tmi](https://github.com/fbkarsdorp/tmi) under an Apache 2.0 License. The Motif-Index is a standard reference in folklore studies. My contribtions to this project are CC0 licensed.
