# Bible (KJV)

> Random verse generator from the King James Version.
> 31,102 verses across 66 books.

```dataviewjs
const base = dv.current().file.folder;
const lib = await dv.io.load(base + "/Lib/literary.js");
const LitGen = new Function(lib + "; return LitGen;")();
await LitGen.buildBibleUI(dv, base + "/Data/Bible");
```

---

## Browse by Book

### Old Testament

| Book                                                 | Chapters | Verses |
| ---------------------------------------------------- | -------- | ------ |
| [Genesis](<Source/Bible/Genesis.md>)                 | 50       | 1533   |
| [Exodus](<Source/Bible/Exodus.md>)                   | 40       | 1213   |
| [Leviticus](<Source/Bible/Leviticus.md>)             | 27       | 859    |
| [Numbers](<Source/Bible/Numbers.md>)                 | 36       | 1288   |
| [Deuteronomy](<Source/Bible/Deuteronomy.md>)         | 34       | 959    |
| [Joshua](<Source/Bible/Joshua.md>)                   | 24       | 658    |
| [Judges](<Source/Bible/Judges.md>)                   | 21       | 618    |
| [Ruth](<Source/Bible/Ruth.md>)                       | 4        | 85     |
| [1 Samuel](<Source/Bible/1 Samuel.md>)               | 31       | 810    |
| [2 Samuel](<Source/Bible/2 Samuel.md>)               | 24       | 695    |
| [1 Kings](<Source/Bible/1 Kings.md>)                 | 22       | 816    |
| [2 Kings](<Source/Bible/2 Kings.md>)                 | 25       | 719    |
| [1 Chronicles](<Source/Bible/1 Chronicles.md>)       | 29       | 942    |
| [2 Chronicles](<Source/Bible/2 Chronicles.md>)       | 36       | 822    |
| [Ezra](<Source/Bible/Ezra.md>)                       | 10       | 280    |
| [Nehemiah](<Source/Bible/Nehemiah.md>)               | 13       | 406    |
| [Esther](<Source/Bible/Esther.md>)                   | 10       | 167    |
| [Job](<Source/Bible/Job.md>)                         | 42       | 1070   |
| [Psalms](<Source/Bible/Psalms.md>)                   | 150      | 2461   |
| [Proverbs](<Source/Bible/Proverbs.md>)               | 31       | 915    |
| [Ecclesiastes](<Source/Bible/Ecclesiastes.md>)       | 12       | 222    |
| [Song of Solomon](<Source/Bible/Song of Solomon.md>) | 8        | 117    |
| [Isaiah](<Source/Bible/Isaiah.md>)                   | 66       | 1292   |
| [Jeremiah](<Source/Bible/Jeremiah.md>)               | 52       | 1364   |
| [Lamentations](<Source/Bible/Lamentations.md>)       | 5        | 154    |
| [Ezekiel](<Source/Bible/Ezekiel.md>)                 | 48       | 1273   |
| [Daniel](<Source/Bible/Daniel.md>)                   | 12       | 357    |
| [Hosea](<Source/Bible/Hosea.md>)                     | 14       | 197    |
| [Joel](<Source/Bible/Joel.md>)                       | 3        | 73     |
| [Amos](<Source/Bible/Amos.md>)                       | 9        | 146    |
| [Obadiah](<Source/Bible/Obadiah.md>)                 | 1        | 21     |
| [Jonah](<Source/Bible/Jonah.md>)                     | 4        | 48     |
| [Micah](<Source/Bible/Micah.md>)                     | 7        | 105    |
| [Nahum](<Source/Bible/Nahum.md>)                     | 3        | 47     |
| [Habakkuk](<Source/Bible/Habakkuk.md>)               | 3        | 56     |
| [Zephaniah](<Source/Bible/Zephaniah.md>)             | 3        | 53     |
| [Haggai](<Source/Bible/Haggai.md>)                   | 2        | 38     |
| [Zechariah](<Source/Bible/Zechariah.md>)             | 14       | 211    |
| [Malachi](<Source/Bible/Malachi.md>)                 | 4        | 55     |

### New Testament

| Book | Chapters | Verses |
|------|----------|--------|
| [Matthew](<Source/Bible/Matthew.md>) | 28 | 1071 |
| [Mark](<Source/Bible/Mark.md>) | 16 | 678 |
| [Luke](<Source/Bible/Luke.md>) | 24 | 1151 |
| [John](<Source/Bible/John.md>) | 21 | 879 |
| [Acts](<Source/Bible/Acts.md>) | 28 | 1007 |
| [Romans](<Source/Bible/Romans.md>) | 16 | 433 |
| [1 Corinthians](<Source/Bible/1 Corinthians.md>) | 16 | 437 |
| [2 Corinthians](<Source/Bible/2 Corinthians.md>) | 13 | 257 |
| [Galatians](<Source/Bible/Galatians.md>) | 6 | 149 |
| [Ephesians](<Source/Bible/Ephesians.md>) | 6 | 155 |
| [Philippians](<Source/Bible/Philippians.md>) | 4 | 104 |
| [Colossians](<Source/Bible/Colossians.md>) | 4 | 95 |
| [1 Thessalonians](<Source/Bible/1 Thessalonians.md>) | 5 | 89 |
| [2 Thessalonians](<Source/Bible/2 Thessalonians.md>) | 3 | 47 |
| [1 Timothy](<Source/Bible/1 Timothy.md>) | 6 | 113 |
| [2 Timothy](<Source/Bible/2 Timothy.md>) | 4 | 83 |
| [Titus](<Source/Bible/Titus.md>) | 3 | 46 |
| [Philemon](<Source/Bible/Philemon.md>) | 1 | 25 |
| [Hebrews](<Source/Bible/Hebrews.md>) | 13 | 303 |
| [James](<Source/Bible/James.md>) | 5 | 108 |
| [1 Peter](<Source/Bible/1 Peter.md>) | 5 | 105 |
| [2 Peter](<Source/Bible/2 Peter.md>) | 3 | 61 |
| [1 John](<Source/Bible/1 John.md>) | 5 | 105 |
| [2 John](<Source/Bible/2 John.md>) | 1 | 13 |
| [3 John](<Source/Bible/3 John.md>) | 1 | 14 |
| [Jude](<Source/Bible/Jude.md>) | 1 | 25 |
| [Revelation](<Source/Bible/Revelation.md>) | 22 | 404 |
