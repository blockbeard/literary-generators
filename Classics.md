# Classics

> Random passages from ancient Greek and Roman texts.
> 26 works from 13 authors — Homer, Virgil, Plato, and more.

```dataviewjs
const base = dv.current().file.folder;
const lib = await dv.io.load(base + "/Lib/literary.js");
const LitGen = new Function(lib + "; return LitGen;")();
await LitGen.buildClassicsUI(dv, base + "/Data/Classics");
```

---

## Browse by Author

| Author | Work | Type | Translator | Sections |
|--------|------|------|------------|----------|
| Aeschylus | Agamemnon | Drama | Gilbert Murray | 1 |
| Aeschylus | The Libation Bearers | Drama | Gilbert Murray | 1 |
| Aeschylus | The Eumenides | Drama | Gilbert Murray | 1 |
| Aristotle | Nicomachean Ethics | Prose | F.H. Peters | 10 |
| Epictetus | Discourses | Prose | George Long | 4 |
| Epictetus | Short Works | Prose | George Long | 2 |
| Herodotus | Histories | Prose | G.C. Macaulay | 9 |
| Homer | The Iliad | Verse | William Cullen Bryant | 24 |
| Homer | The Odyssey | Verse | William Cullen Bryant | 24 |
| Julius Caesar | Commentaries on the Gallic War | Prose | McDevitte & Bohn | 7 |
| Marcus Aurelius | Meditations | Prose | George Long | 12 |
| Ovid | Metamorphoses | Verse | Various Translators | 15 |
| Plato | Dialogues | Prose | Benjamin Jowett | 24 |
| Seneca | Dialogues | Prose | Aubrey Stewart | 12 |
| Sophocles | Ajax | Drama | Francis Storr | 1 |
| Sophocles | Antigone | Drama | Francis Storr | 1 |
| Sophocles | Electra | Drama | Francis Storr | 1 |
| Sophocles | Oedipus Rex | Drama | Francis Storr | 1 |
| Sophocles | Oedipus at Colonus | Drama | Francis Storr | 1 |
| Sophocles | Philoctetes | Drama | Francis Storr | 1 |
| Sophocles | The Trachiniae | Drama | Francis Storr | 1 |
| Suetonius | The Lives of the Caesars | Prose | J.C. Rolfe | 8 |
| Thucydides | History of the Peloponnesian War | Prose | Richard Crawley | 26 |
| Virgil | The Aeneid | Verse | John Dryden | 12 |
| Virgil | The Eclogues | Verse | John Dryden | 10 |
| Virgil | The Georgics | Verse | John Dryden | 4 |

All texts from [Standard Ebooks](https://standardebooks.org/). Translations are public domain. Source data is CC0.
