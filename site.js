// Literary Generators — Browser Engine
// License: CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/

(function () {
  "use strict";

  const DATA_BASE = "Data";
  const cache = {};

  // =====================================================================
  // HELPERS
  // =====================================================================

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function weightedPick(items, weightFn) {
    const total = items.reduce((s, item) => s + weightFn(item), 0);
    let r = Math.random() * total;
    for (const item of items) {
      r -= weightFn(item);
      if (r <= 0) return item;
    }
    return items[items.length - 1];
  }

  async function loadJSON(path) {
    if (cache[path]) return cache[path];
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`Failed to load ${path}: ${resp.status}`);
    const data = await resp.json();
    cache[path] = data;
    return data;
  }

  function toRoman(n) {
    const vals = [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let result = "";
    for (const [val, numeral] of vals) {
      while (n >= val) { result += numeral; n -= val; }
    }
    return result;
  }

  function $(id) { return document.getElementById(id); }

  function addOption(select, value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    select.appendChild(opt);
  }

  function flashButton(btn, msg, original) {
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = original; }, 1500);
  }

  // =====================================================================
  // TABS
  // =====================================================================

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".generator").forEach(g => g.classList.remove("active"));
      tab.classList.add("active");
      $("gen-" + tab.dataset.tab).classList.add("active");
    });
  });

  // =====================================================================
  // RENDER RESULTS
  // =====================================================================

  function renderResults(resultsDiv, copyAllBtn, items) {
    resultsDiv.innerHTML = "";

    for (const item of items) {
      const row = document.createElement("div");
      row.className = "result-item";

      // Quote
      const quote = document.createElement("div");
      quote.className = "result-quote";
      quote.textContent = item.text;
      row.appendChild(quote);

      // Track current expand level for copy button coordination
      let currentLevel = -1;

      // Expand
      if (item.expand && item.expand.length > 0) {
        const expandArea = document.createElement("div");
        expandArea.className = "expand-area";

        const expandContent = document.createElement("div");
        expandContent.className = "expand-content";

        const expandCopyBtn = document.createElement("button");
        expandCopyBtn.className = "copy-btn expand-copy-btn";
        expandCopyBtn.style.display = "none";
        expandCopyBtn.style.marginTop = "4px";

        const expandBtn = document.createElement("button");
        expandBtn.className = "expand-btn";
        expandBtn.textContent = "\u25b8 " + item.expand[0].label;

        expandBtn.addEventListener("click", () => {
          currentLevel++;
          if (currentLevel < item.expand.length) {
            expandContent.classList.add("visible");
            expandContent.textContent = item.expand[currentLevel].text;
            // Show copy button for expanded content
            expandCopyBtn.style.display = "inline-block";
            expandCopyBtn.textContent = "Copy " + item.expand[currentLevel].label.toLowerCase();
            if (currentLevel + 1 < item.expand.length) {
              expandBtn.textContent = "\u25b8 " + item.expand[currentLevel + 1].label;
            } else {
              expandBtn.textContent = "\u25be Collapse";
            }
          } else {
            expandContent.classList.remove("visible");
            expandCopyBtn.style.display = "none";
            currentLevel = -1;
            expandBtn.textContent = "\u25b8 " + item.expand[0].label;
          }
        });

        expandCopyBtn.addEventListener("click", () => {
          if (currentLevel >= 0 && currentLevel < item.expand.length) {
            const text = item.expand[currentLevel].text + "\n" + item.ref;
            navigator.clipboard.writeText(text);
            const label = expandCopyBtn.textContent;
            flashButton(expandCopyBtn, "Copied!", label);
          }
        });

        expandArea.appendChild(expandBtn);
        expandArea.appendChild(expandContent);
        expandArea.appendChild(expandCopyBtn);
        row.appendChild(expandArea);
      }

      // Attribution
      const attrRow = document.createElement("div");
      attrRow.className = "result-attr";

      const ref = document.createElement("span");
      ref.className = "result-ref";
      ref.textContent = item.ref;
      attrRow.appendChild(ref);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy line";
      const copyText = item.text + "\n" + item.ref;
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(copyText);
        flashButton(copyBtn, "Copied!", "Copy line");
      });
      attrRow.appendChild(copyBtn);

      row.appendChild(attrRow);
      resultsDiv.appendChild(row);
    }

    if (items.length > 1) {
      copyAllBtn.classList.add("visible");
      copyAllBtn.onclick = () => {
        const all = items.map(it => it.text + "\n" + it.ref).join("\n\n");
        navigator.clipboard.writeText(all);
        flashButton(copyAllBtn, "Copied!", "Copy All");
      };
    } else {
      copyAllBtn.classList.remove("visible");
    }
  }

  // =====================================================================
  // BIBLE
  // =====================================================================

  async function initBible() {
    const index = await loadJSON(`${DATA_BASE}/Bible/index.json`);
    const testamentSel = $("bible-testament");
    const bookSel = $("bible-book");

    function populateBooks() {
      const t = testamentSel.value;
      bookSel.innerHTML = "";
      addOption(bookSel, "", "Any");
      for (const b of index.books) {
        if (t === "OT" && b.testament !== "OT") continue;
        if (t === "NT" && b.testament !== "NT") continue;
        addOption(bookSel, b.file, b.name);
      }
    }
    populateBooks();
    testamentSel.addEventListener("change", populateBooks);

    $("bible-gen").addEventListener("click", async () => {
      const count = parseInt($("bible-count").value);
      const testament = testamentSel.value;
      const bookFile = bookSel.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let bookInfo;
          if (bookFile) {
            bookInfo = index.books.find(b => b.file === bookFile);
          } else {
            const candidates = index.books.filter(b => {
              if (testament === "OT") return b.testament === "OT";
              if (testament === "NT") return b.testament === "NT";
              return true;
            });
            bookInfo = weightedPick(candidates, b => b.verses);
          }
          const bookData = await loadJSON(`${DATA_BASE}/Bible/${bookInfo.file}`);
          const ch = weightedPick(bookData.chapters, c => c.verses.length);
          const verse = pick(ch.verses);
          items.push({
            text: verse.t,
            ref: `${bookInfo.name} ${ch.chapter}:${verse.v}`
          });
        }
        renderResults($("bible-results"), $("bible-copyall"), items);
      } catch (e) {
        $("bible-results").innerHTML = `<p class="error">Error: ${e.message}</p>`;
      }
    });
  }

  // =====================================================================
  // SHAKESPEARE
  // =====================================================================

  async function initShakespeare() {
    const index = await loadJSON(`${DATA_BASE}/Shakespeare/index.json`);
    const typeSel = $("shk-type");
    const workSel = $("shk-work");

    function populateWorks() {
      const type = typeSel.value;
      workSel.innerHTML = "";
      addOption(workSel, "", "Any");
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        addOption(workSel, w.file, w.title);
      }
    }
    populateWorks();
    typeSel.addEventListener("change", populateWorks);

    $("shk-gen").addEventListener("click", async () => {
      const count = parseInt($("shk-count").value);
      const type = typeSel.value;
      const workFile = workSel.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let workInfo;
          if (workFile) {
            workInfo = index.works.find(w => w.file === workFile);
          } else {
            const candidates = index.works.filter(w => {
              if (type !== "any") return w.type === type;
              return true;
            });
            workInfo = weightedPick(candidates, w => w.lines);
          }
          const workData = await loadJSON(`${DATA_BASE}/Shakespeare/${workInfo.file}`);
          items.push(pickShakespeare(workData));
        }
        renderResults($("shk-results"), $("shk-copyall"), items);
      } catch (e) {
        $("shk-results").innerHTML = `<p class="error">Error: ${e.message}</p>`;
      }
    });
  }

  function pickShakespeare(workData) {
    const title = workData.title;

    if (workData.type === "play") {
      const scene = weightedPick(workData.scenes, s => s.speeches.length);
      const speech = pick(scene.speeches);
      const ref = `${title}, ${toRoman(scene.act)}.${scene.scene} \u2014 ${speech.c}`;

      if (speech.speech.length <= 200 || speech.lines.length <= 1) {
        return { text: speech.speech, ref: ref };
      } else {
        const line = pick(speech.lines);
        return {
          text: line,
          ref: ref,
          expand: [{ label: "Full speech", text: ref + "\n\n" + speech.lines.join("\n") }]
        };
      }

    } else if (workData.type === "sonnet") {
      const sonnet = pick(workData.scenes);
      const ref = `Sonnet ${sonnet.scene}`;
      const line = pick(sonnet.lines);

      let containingStanza = null;
      for (const st of sonnet.stanzas) {
        if (st.includes(line)) { containingStanza = st; break; }
      }

      const expand = [];
      if (containingStanza && containingStanza.length < sonnet.lines.length) {
        expand.push({ label: "Stanza", text: containingStanza.join("\n") });
      }
      expand.push({ label: "Full sonnet", text: ref + "\n\n" + sonnet.stanzas.map(s => s.join("\n")).join("\n\n") });

      return { text: line, ref: ref, expand: expand };

    } else {
      const scene = pick(workData.scenes);
      const allLines = scene.lines || [];
      const allStanzas = scene.stanzas || [];
      const line = pick(allLines);
      const ref = title;

      let containingStanza = null;
      for (const st of allStanzas) {
        if (st.includes(line)) { containingStanza = st; break; }
      }

      const expand = [];
      if (containingStanza && containingStanza.length < allLines.length) {
        expand.push({ label: "Stanza", text: containingStanza.join("\n") });
      }
      if (allLines.length > 1) {
        const body = allStanzas.length > 0 ? allStanzas.map(s => s.join("\n")).join("\n\n") : allLines.join("\n");
        expand.push({ label: "Full passage", text: title + "\nby William Shakespeare\n\n" + body });
      }

      return { text: line, ref: ref, expand: expand };
    }
  }

  // =====================================================================
  // POETRY
  // =====================================================================

  async function initPoetry() {
    const index = await loadJSON(`${DATA_BASE}/Poetry/index.json`);
    const poetSel = $("poetry-poet");

    addOption(poetSel, "", "Any Poet");
    for (const a of index.authors.sort((a, b) => a.name.localeCompare(b.name))) {
      addOption(poetSel, a.file, `${a.name} (${a.poems})`);
    }

    $("poetry-gen").addEventListener("click", async () => {
      const count = parseInt($("poetry-count").value);
      const poetFile = poetSel.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let authorInfo;
          if (poetFile) {
            authorInfo = index.authors.find(a => a.file === poetFile);
          } else {
            authorInfo = weightedPick(index.authors, a => a.lines);
          }
          const authorData = await loadJSON(`${DATA_BASE}/Poetry/${authorInfo.file}`);
          const poem = pick(authorData.poems);
          if (!poem.lines || poem.lines.length === 0) continue;

          const line = pick(poem.lines);
          const ref = `\u2014 ${authorData.author}, \u201c${poem.title}\u201d`;

          let containingStanza = null;
          for (const st of (poem.stanzas || [])) {
            if (st.includes(line)) { containingStanza = st; break; }
          }

          const expand = [];
          if (containingStanza && containingStanza.length < poem.lines.length) {
            expand.push({ label: "Stanza", text: containingStanza.join("\n") });
          }
          if (poem.lines.length > 1) {
            const body = (poem.stanzas && poem.stanzas.length > 0) ? poem.stanzas.map(s => s.join("\n")).join("\n\n") : poem.lines.join("\n");
            expand.push({ label: "Full poem", text: poem.title + "\nby " + authorData.author + "\n\n" + body });
          }

          items.push({ text: line, ref: ref, expand: expand });
        }
        renderResults($("poetry-results"), $("poetry-copyall"), items);
      } catch (e) {
        $("poetry-results").innerHTML = `<p class="error">Error: ${e.message}</p>`;
      }
    });
  }

  // =====================================================================
  // CLASSICS
  // =====================================================================

  async function initClassics() {
    const index = await loadJSON(`${DATA_BASE}/Classics/index.json`);
    const typeSel = $("cls-type");
    const authorSel = $("cls-author");
    const workSel = $("cls-work");

    function populateAuthors() {
      const type = typeSel.value;
      const authors = new Set();
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        authors.add(w.author);
      }
      authorSel.innerHTML = "";
      addOption(authorSel, "", "Any");
      for (const a of [...authors].sort()) addOption(authorSel, a, a);
      populateWorks();
    }

    function populateWorks() {
      const type = typeSel.value;
      const author = authorSel.value;
      workSel.innerHTML = "";
      addOption(workSel, "", "Any");
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        if (author && w.author !== author) continue;
        addOption(workSel, w.file, `${w.title} (${w.author})`);
      }
    }

    populateAuthors();
    typeSel.addEventListener("change", populateAuthors);
    authorSel.addEventListener("change", populateWorks);

    $("cls-gen").addEventListener("click", async () => {
      const count = parseInt($("cls-count").value);
      const type = typeSel.value;
      const author = authorSel.value;
      const workFile = workSel.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let workInfo;
          if (workFile) {
            workInfo = index.works.find(w => w.file === workFile);
          } else {
            const candidates = index.works.filter(w => {
              if (type !== "any" && w.type !== type) return false;
              if (author && w.author !== author) return false;
              return true;
            });
            workInfo = weightedPick(candidates, w => w.lines);
          }
          const workData = await loadJSON(`${DATA_BASE}/Classics/${workInfo.file}`);
          items.push(pickClassics(workData));
        }
        renderResults($("cls-results"), $("cls-copyall"), items);
      } catch (e) {
        $("cls-results").innerHTML = `<p class="error">Error: ${e.message}</p>`;
      }
    });
  }

  function pickClassics(workData) {
    const title = workData.title;
    const author = workData.author;
    const section = weightedPick(workData.sections, s =>
      s.speeches ? s.speeches.reduce((n, sp) => n + sp.lines.length, 0) : (s.lines ? s.lines.length : 0)
    );

    if (workData.type === "drama" && section.speeches) {
      const speech = pick(section.speeches);
      const ref = `${author}, ${title} \u2014 ${speech.speaker}`;

      if (speech.lines.length <= 1 || speech.lines.join(" ").length <= 200) {
        return { text: speech.lines.join("\n"), ref: ref };
      } else {
        const line = pick(speech.lines);
        return {
          text: line,
          ref: ref,
          expand: [{ label: "Full speech", text: ref + "\n\n" + speech.lines.join("\n") }]
        };
      }

    } else if (workData.type === "verse") {
      const allLines = section.lines || [];
      const allStanzas = section.stanzas || [];
      const line = pick(allLines);
      const ref = `${author}, ${title}` + (section.title ? ` \u2014 ${section.title}` : "");

      let containingStanza = null;
      for (const st of allStanzas) {
        if (st.includes(line)) { containingStanza = st; break; }
      }

      const expand = [];
      if (containingStanza && containingStanza.length < allLines.length) {
        expand.push({ label: "Stanza", text: containingStanza.join("\n") });
      }
      if (allLines.length > 1) {
        const body = allStanzas.length > 0 ? allStanzas.map(s => s.join("\n")).join("\n\n") : allLines.join("\n");
        expand.push({ label: "Full passage", text: title + " \u2014 " + (section.title || "") + "\nby " + author + "\n\n" + body });
      }

      return { text: line, ref: ref, expand: expand };

    } else {
      const allLines = section.lines || [];
      const line = pick(allLines);
      const ref = `${author}, ${title}` + (section.title ? ` \u2014 ${section.title}` : "");
      return { text: line, ref: ref };
    }
  }

  // =====================================================================
  // STANDALONE PICK FUNCTIONS (for quote hero)
  // =====================================================================

  async function pickRandomBible() {
    const index = await loadJSON(`${DATA_BASE}/Bible/index.json`);
    const bookInfo = weightedPick(index.books, b => b.verses);
    const bookData = await loadJSON(`${DATA_BASE}/Bible/${bookInfo.file}`);
    const ch = weightedPick(bookData.chapters, c => c.verses.length);
    const verse = pick(ch.verses);
    return {
      text: verse.t,
      ref: `${bookInfo.name} ${ch.chapter}:${verse.v}`
    };
  }

  async function pickRandomShakespeare() {
    const index = await loadJSON(`${DATA_BASE}/Shakespeare/index.json`);
    const workInfo = weightedPick(index.works, w => w.lines);
    const workData = await loadJSON(`${DATA_BASE}/Shakespeare/${workInfo.file}`);
    return pickShakespeare(workData);
  }

  async function pickRandomPoetry() {
    const index = await loadJSON(`${DATA_BASE}/Poetry/index.json`);
    const authorInfo = weightedPick(index.authors, a => a.lines);
    const authorData = await loadJSON(`${DATA_BASE}/Poetry/${authorInfo.file}`);
    const poem = pick(authorData.poems);
    if (!poem.lines || poem.lines.length === 0) return pickRandomPoetry();

    const line = pick(poem.lines);
    const ref = `\u2014 ${authorData.author}, \u201c${poem.title}\u201d`;

    let containingStanza = null;
    for (const st of (poem.stanzas || [])) {
      if (st.includes(line)) { containingStanza = st; break; }
    }

    const expand = [];
    if (containingStanza && containingStanza.length < poem.lines.length) {
      expand.push({ label: "Stanza", text: containingStanza.join("\n") });
    }
    if (poem.lines.length > 1) {
      const body = (poem.stanzas && poem.stanzas.length > 0) ? poem.stanzas.map(s => s.join("\n")).join("\n\n") : poem.lines.join("\n");
      expand.push({ label: "Full poem", text: poem.title + "\nby " + authorData.author + "\n\n" + body });
    }

    return { text: line, ref: ref, expand: expand };
  }

  async function pickRandomClassics() {
    const index = await loadJSON(`${DATA_BASE}/Classics/index.json`);
    const workInfo = weightedPick(index.works, w => w.lines);
    const workData = await loadJSON(`${DATA_BASE}/Classics/${workInfo.file}`);
    return pickClassics(workData);
  }

  // =====================================================================
  // QUOTE HERO — random quote + one of each
  // =====================================================================

  async function loadRandomQuote() {
    const resultsDiv = $("quote-results");
    const copyAllBtn = $("quote-copyall");
    try {
      const source = pick(["bible", "shakespeare", "poetry", "classics"]);
      let item;
      if (source === "bible") item = await pickRandomBible();
      else if (source === "shakespeare") item = await pickRandomShakespeare();
      else if (source === "poetry") item = await pickRandomPoetry();
      else item = await pickRandomClassics();
      renderResults(resultsDiv, copyAllBtn, [item]);
    } catch (e) {
      resultsDiv.innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
  }

  async function loadOneOfEach() {
    const resultsDiv = $("quote-results");
    const copyAllBtn = $("quote-copyall");
    try {
      const [bible, shk, poetry, classics] = await Promise.all([
        pickRandomBible(),
        pickRandomShakespeare(),
        pickRandomPoetry(),
        pickRandomClassics()
      ]);
      renderResults(resultsDiv, copyAllBtn, [bible, shk, poetry, classics]);
    } catch (e) {
      resultsDiv.innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
  }

  // =====================================================================
  // INIT
  // =====================================================================

  initBible();
  initShakespeare();
  initPoetry();
  initClassics();

  $("quote-reload").addEventListener("click", loadRandomQuote);
  $("quote-each").addEventListener("click", loadOneOfEach);
  loadRandomQuote();
})();
