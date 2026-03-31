# Shakespeare

> Random line generator from the Complete Works of Shakespeare.
> 114,461 lines across 43 works.

```dataviewjs
const base = dv.current().file.folder;
const lib = await dv.io.load(base + "/Lib/literary.js");
const LitGen = new Function(lib + "; return LitGen;")();
await LitGen.buildShakespeareUI(dv, base + "/Data/Shakespeare");
```

---

## Browse by Work

### Plays

| Work                                                                              | Genre   | Lines |
| --------------------------------------------------------------------------------- | ------- | ----- |
| [All's Well That Ends Well](<Source/Shakespeare/All's Well That Ends Well.md>)      | Comedy  | 2,934 |
| [Antony and Cleopatra](<Source/Shakespeare/Antony and Cleopatra.md>)         | Tragedy | 3,594 |
| [As You Like It](<Source/Shakespeare/As You Like It.md>)                   | Comedy  | 2,602 |
| [Comedy of Errors](<Source/Shakespeare/Comedy of Errors.md>)                 | Comedy  | 1,802 |
| [Coriolanus](<Source/Shakespeare/Coriolanus.md>)                                 | Tragedy | 3,806 |
| [Cymbeline](<Source/Shakespeare/Cymbeline.md>)                                   | Comedy  | 3,780 |
| [Hamlet](<Source/Shakespeare/Hamlet.md>)                                         | Tragedy | 4,003 |
| [Henry IV, Part I](<Source/Shakespeare/Henry IV, Part I.md>)             | History | 3,053 |
| [Henry IV, Part II](<Source/Shakespeare/Henry IV, Part II.md>)           | History | 3,145 |
| [Henry V](<Source/Shakespeare/Henry V.md>)                                     | History | 3,242 |
| [Henry VI, Part I](<Source/Shakespeare/Henry VI, Part I.md>)             | History | 2,749 |
| [Henry VI, Part II](<Source/Shakespeare/Henry VI, Part II.md>)           | History | 3,165 |
| [Henry VI, Part III](<Source/Shakespeare/Henry VI, Part III.md>)         | History | 2,969 |
| [Henry VIII](<Source/Shakespeare/Henry VIII.md>)                               | History | 3,344 |
| [Julius Caesar](<Source/Shakespeare/Julius Caesar.md>)                         | Tragedy | 2,708 |
| [King John](<Source/Shakespeare/King John.md>)                                 | History | 2,657 |
| [King Lear](<Source/Shakespeare/King Lear.md>)                                 | Tragedy | 3,483 |
| [Love's Labour's Lost](<Source/Shakespeare/Love's Labour's Lost.md>)     | Comedy  | 2,766 |
| [Macbeth](<Source/Shakespeare/Macbeth.md>)                                       | Tragedy | 2,397 |
| [Measure for Measure](<Source/Shakespeare/Measure for Measure.md>)           | Comedy  | 2,843 |
| [Merchant of Venice](<Source/Shakespeare/Merchant of Venice.md>)             | Comedy  | 2,670 |
| [Merry Wives of Windsor](<Source/Shakespeare/Merry Wives of Windsor.md>)   | Comedy  | 2,621 |
| [Midsummer Night's Dream](<Source/Shakespeare/Midsummer Night's Dream.md>) | Comedy  | 2,164 |
| [Much Ado about Nothing](<Source/Shakespeare/Much Ado about Nothing.md>)   | Comedy  | 2,583 |
| [Othello](<Source/Shakespeare/Othello.md>)                                       | Tragedy | 3,557 |
| [Pericles](<Source/Shakespeare/Pericles.md>)                                     | Comedy  | 2,490 |
| [Richard II](<Source/Shakespeare/Richard II.md>)                               | History | 2,821 |
| [Richard III](<Source/Shakespeare/Richard III.md>)                             | History | 3,709 |
| [Romeo and Juliet](<Source/Shakespeare/Romeo and Juliet.md>)                 | Tragedy | 3,100 |
| [Taming of the Shrew](<Source/Shakespeare/Taming of the Shrew.md>)         | Comedy  | 2,651 |
| [Tempest](<Source/Shakespeare/Tempest.md>)                                       | Comedy  | 2,310 |
| [The Winter's Tale](<Source/Shakespeare/The Winter's Tale.md>)             | Comedy  | 3,363 |
| [Timon of Athens](<Source/Shakespeare/Timon of Athens.md>)                   | Tragedy | 2,469 |
| [Titus Andronicus](<Source/Shakespeare/Titus Andronicus.md>)                   | Tragedy | 2,592 |
| [Troilus and Cressida](<Source/Shakespeare/Troilus and Cressida.md>)         | Tragedy | 3,500 |
| [Twelfth Night](<Source/Shakespeare/Twelfth Night.md>)                         | Comedy  | 2,474 |
| [Two Gentlemen of Verona](<Source/Shakespeare/Two Gentlemen of Verona.md>) | Comedy  | 2,234 |

### Sonnets and Poems

| Work | Lines |
|------|-------|
| [Lover's Complaint](<Source/Shakespeare/Lover's Complaint.md>) | 331 |
| [Passionate Pilgrim](<Source/Shakespeare/Passionate Pilgrim.md>) | 430 |
| [Phoenix and the Turtle](<Source/Shakespeare/Phoenix and the Turtle.md>) | 68 |
| [Rape of Lucrece](<Source/Shakespeare/Rape of Lucrece.md>) | 1,909 |
| [Sonnets](<Source/Shakespeare/Sonnets.md>) | 2,157 |
| [Venus and Adonis](<Source/Shakespeare/Venus and Adonis.md>) | 1,216 |
