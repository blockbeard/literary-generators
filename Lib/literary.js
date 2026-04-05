// LitGen — Literary Generator Engine
// Loaded by DataviewJS generator notes via dv.io.load()
// License: CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/

var LitGen = (function () {
  const _cache = {};

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

  async function loadJSON(dv, path) {
    if (_cache[path]) return _cache[path];
    const raw = await dv.io.load(path);
    const data = JSON.parse(raw);
    _cache[path] = data;
    return data;
  }

  // Derive the project root from a dataDir like "Some Folder/Data/Bible"
  // by stripping the last two path segments (Data/X)
  function projectRoot(dataDir) {
    return dataDir.replace(/\/Data\/[^/]+$/, "");
  }

  // =====================================================================
  // BIBLE GENERATOR
  // =====================================================================

  async function buildBibleUI(dv, dataDir, parentContainer) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const container = parentContainer || dv.el("div", "", { cls: "litgen-bible" });

    // Filter row
    const filterRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" });

    const testamentSelect = makeSelect(["Any", "Old Testament", "New Testament"]);
    filterRow.appendChild(label("Testament:"));
    filterRow.appendChild(testamentSelect);

    const bookSelect = document.createElement("select");
    bookSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:200px";
    filterRow.appendChild(label("Book:"));
    filterRow.appendChild(bookSelect);

    function populateBooks() {
      const testament = testamentSelect.value;
      bookSelect.innerHTML = "";
      addOption(bookSelect, "", "Any");
      for (const b of index.books) {
        if (testament === "Old Testament" && b.testament !== "OT") continue;
        if (testament === "New Testament" && b.testament !== "NT") continue;
        addOption(bookSelect, b.file, b.name);
      }
    }
    populateBooks();
    testamentSelect.addEventListener("change", populateBooks);
    container.appendChild(filterRow);

    // Controls
    const controlRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" });
    const countSelect = makeSelect(["1", "3", "5", "10"], "1");
    controlRow.appendChild(label("Verses:"));
    controlRow.appendChild(countSelect);
    const btn = makeButton("Generate");
    controlRow.appendChild(btn);
    container.appendChild(controlRow);

    const results = el("div", {});
    container.appendChild(results);
    const copyBtn = makeCopyAllButton();
    container.appendChild(copyBtn);

    btn.addEventListener("click", async () => {
      const count = parseInt(countSelect.value);
      const testament = testamentSelect.value;
      const bookFile = bookSelect.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let bookInfo;
          if (bookFile) {
            bookInfo = index.books.find(b => b.file === bookFile);
          } else {
            const candidates = index.books.filter(b => {
              if (testament === "Old Testament") return b.testament === "OT";
              if (testament === "New Testament") return b.testament === "NT";
              return true;
            });
            bookInfo = weightedPick(candidates, b => b.verses);
          }
          const bookData = await loadJSON(dv, dataDir + "/" + bookInfo.file);
          const ch = weightedPick(bookData.chapters, c => c.verses.length);
          const verse = pick(ch.verses);
          const ref = `King James Bible, ${bookInfo.name} ${ch.chapter}:${verse.v}`;
          const base = projectRoot(dataDir);
          const linkTarget = `${base}/Source/Bible/${bookInfo.name}#Chapter ${ch.chapter}`;
          items.push({ text: verse.t, ref: ref, linkTarget: linkTarget });
        }
        renderResults(results, copyBtn, items);
      } catch (e) {
        results.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });
  }

  // =====================================================================
  // SHAKESPEARE GENERATOR
  // =====================================================================

  async function buildShakespeareUI(dv, dataDir, parentContainer) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const container = parentContainer || dv.el("div", "", { cls: "litgen-shakespeare" });

    // Filter row
    const filterRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" });

    const typeSelect = makeSelect(["Any", "Play", "Sonnet", "Poem"]);
    filterRow.appendChild(label("Type:"));
    filterRow.appendChild(typeSelect);

    const workSelect = document.createElement("select");
    workSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:240px";
    filterRow.appendChild(label("Work:"));
    filterRow.appendChild(workSelect);

    function populateWorks() {
      const type = typeSelect.value.toLowerCase();
      workSelect.innerHTML = "";
      addOption(workSelect, "", "Any");
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        addOption(workSelect, w.file, w.title);
      }
    }
    populateWorks();
    typeSelect.addEventListener("change", populateWorks);
    container.appendChild(filterRow);

    // Controls
    const controlRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" });
    const countSelect = makeSelect(["1", "3", "5", "10"], "1");
    controlRow.appendChild(label("Count:"));
    controlRow.appendChild(countSelect);
    const btn = makeButton("Generate");
    controlRow.appendChild(btn);
    container.appendChild(controlRow);

    const results = el("div", {});
    container.appendChild(results);
    const copyBtn = makeCopyAllButton();
    container.appendChild(copyBtn);

    btn.addEventListener("click", async () => {
      const count = parseInt(countSelect.value);
      const type = typeSelect.value.toLowerCase();
      const workFile = workSelect.value;
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
          const workData = await loadJSON(dv, dataDir + "/" + workInfo.file);
          const base = projectRoot(dataDir);
          const item = pickShakespeare(workData, base);
          items.push(item);
        }
        renderResults(results, copyBtn, items);
      } catch (e) {
        results.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });
  }

  // Pick a Shakespeare result with expandable layers
  function pickShakespeare(workData, base) {
    const title = workData.title;

    if (workData.type === "play") {
      // Pick a random speech from a random scene
      const scene = weightedPick(workData.scenes, s => s.speeches.length);
      const speech = pick(scene.speeches);
      const actRoman = toRoman(scene.act);
      const ref = `William Shakespeare, ${title}, ${actRoman}.${scene.scene} — ${speech.c}`;
      const linkTarget = `${base}/Source/Shakespeare/${title}#Scene ${scene.scene}`;

      if (speech.speech.length <= 200 || speech.lines.length <= 1) {
        // Short speech — show the whole thing, no expand needed
        return { text: speech.speech, ref: ref, linkTarget: linkTarget };
      } else {
        // Long speech — show a random line, expandable to full speech
        const line = pick(speech.lines);
        return {
          text: line,
          ref: ref,
          linkTarget: linkTarget,
          expand: [
            { label: "Full speech", text: ref + "\n\n" + speech.lines.join("\n") }
          ]
        };
      }

    } else if (workData.type === "sonnet") {
      // Pick a random sonnet, show a random line
      const sonnet = pick(workData.scenes);
      const ref = `William Shakespeare, Sonnet ${sonnet.scene}`;
      const linkTarget = `${base}/Source/Shakespeare/${title}#Sonnet ${sonnet.scene}`;
      const line = pick(sonnet.lines);

      // Find which stanza this line is in
      let containingStanza = null;
      for (const st of sonnet.stanzas) {
        if (st.includes(line)) { containingStanza = st; break; }
      }

      const expand = [];
      if (containingStanza && containingStanza.length < sonnet.lines.length) {
        expand.push({ label: "Stanza", text: containingStanza.join("\n") });
      }
      expand.push({ label: "Full sonnet", text: ref + "\n\n" + sonnet.stanzas.map(s => s.join("\n")).join("\n\n") });

      return { text: line, ref: ref, linkTarget: linkTarget, expand: expand };

    } else {
      // Poem — pick random line, expand to stanza, then full poem
      const scene = pick(workData.scenes);
      const allLines = scene.lines || [];
      const allStanzas = scene.stanzas || [];
      const line = pick(allLines);
      const ref = `William Shakespeare, ${title}`;
      const linkTarget = `${base}/Source/Shakespeare/${title}#Stanza ${scene.scene}`;

      // Find containing stanza
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

      return { text: line, ref: ref, linkTarget: linkTarget, expand: expand };
    }
  }

  // =====================================================================
  // POETRY GENERATOR
  // =====================================================================

  async function buildPoetryUI(dv, dataDir, parentContainer) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const container = parentContainer || dv.el("div", "", { cls: "litgen-poetry" });

    // Filter row
    const filterRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" });

    const poetSelect = document.createElement("select");
    poetSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:260px";
    addOption(poetSelect, "", "Any Poet");
    for (const a of index.authors.sort((a, b) => a.name.localeCompare(b.name))) {
      addOption(poetSelect, a.file, `${a.name} (${a.poems})`);
    }
    filterRow.appendChild(label("Poet:"));
    filterRow.appendChild(poetSelect);
    container.appendChild(filterRow);

    // Controls
    const controlRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" });
    const countSelect = makeSelect(["1", "3", "5", "10"], "1");
    controlRow.appendChild(label("Count:"));
    controlRow.appendChild(countSelect);
    const btn = makeButton("Generate");
    controlRow.appendChild(btn);
    container.appendChild(controlRow);

    const results = el("div", {});
    container.appendChild(results);
    const copyBtn = makeCopyAllButton();
    container.appendChild(copyBtn);

    btn.addEventListener("click", async () => {
      const count = parseInt(countSelect.value);
      const poetFile = poetSelect.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let authorInfo;
          if (poetFile) {
            authorInfo = index.authors.find(a => a.file === poetFile);
          } else {
            authorInfo = weightedPick(index.authors, a => a.lines);
          }
          const authorData = await loadJSON(dv, dataDir + "/" + authorInfo.file);
          const poem = pick(authorData.poems);
          if (!poem.lines || poem.lines.length === 0) continue;

          const line = pick(poem.lines);
          const ref = `— ${authorData.author}, "${poem.title}"`;
          const base = projectRoot(dataDir);
          const linkTarget = `${base}/Source/Poetry/${authorData.author}#${poem.title}`;

          // Find containing stanza
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

          items.push({ text: line, ref: ref, linkTarget: linkTarget, expand: expand });
        }
        renderResults(results, copyBtn, items);
      } catch (e) {
        results.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });
  }

  // =====================================================================
  // SHARED UI HELPERS
  // =====================================================================

  function el(tag, styles) {
    const d = document.createElement(tag);
    Object.assign(d.style, styles);
    return d;
  }

  function label(text) {
    const l = document.createElement("span");
    l.textContent = text;
    l.style.fontSize = "13px";
    l.style.color = "var(--text-muted)";
    return l;
  }

  function addOption(select, value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    select.appendChild(opt);
  }

  function makeSelect(options, defaultVal) {
    const s = document.createElement("select");
    s.style.cssText = "padding:4px 8px;font-size:13px";
    for (const o of options) {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      if (defaultVal && o === defaultVal) opt.selected = true;
      s.appendChild(opt);
    }
    return s;
  }

  function makeButton(text) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cssText = "padding:4px 14px;font-size:13px;cursor:pointer";
    return b;
  }

  function makeCopyAllButton() {
    const b = document.createElement("button");
    b.textContent = "Copy All";
    b.style.cssText = "padding:3px 10px;font-size:11px;cursor:pointer;margin-top:4px;display:none";
    return b;
  }

  function toRoman(n) {
    const vals = [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let result = "";
    for (const [val, numeral] of vals) {
      while (n >= val) { result += numeral; n -= val; }
    }
    return result;
  }

  // =====================================================================
  // RENDER RESULTS — with expandable layers
  // =====================================================================

  function renderResults(resultsDiv, copyBtn, items) {
    resultsDiv.innerHTML = "";

    for (const item of items) {
      const row = el("div", {
        padding: "8px 0",
        borderBottom: "1px solid var(--background-modifier-border)"
      });

      // Quote text
      const quote = document.createElement("div");
      quote.style.cssText = "font-size:16px;font-style:italic;line-height:1.5;white-space:pre-line";
      quote.textContent = item.text;
      row.appendChild(quote);

      // Track current expand level for copy button coordination
      let currentLevel = -1;

      // Expand layers (stanza → full poem/speech)
      if (item.expand && item.expand.length > 0) {
        const expandArea = el("div", { marginTop: "4px" });

        const expandContent = document.createElement("div");
        expandContent.style.cssText = "white-space:pre-line;font-size:14px;font-style:italic;line-height:1.5;margin-top:6px;padding:8px 12px;border-left:3px solid var(--background-modifier-border);display:none";

        const expandCopyBtn = document.createElement("button");
        expandCopyBtn.style.cssText = "padding:2px 8px;font-size:11px;cursor:pointer;margin-top:4px;display:none";

        const expandBtn = document.createElement("button");
        expandBtn.style.cssText = "padding:2px 8px;font-size:11px;cursor:pointer;color:var(--text-muted)";
        expandBtn.textContent = "▸ " + item.expand[0].label;

        expandBtn.addEventListener("click", () => {
          currentLevel++;
          if (currentLevel < item.expand.length) {
            expandContent.style.display = "block";
            expandContent.textContent = item.expand[currentLevel].text;
            // Show copy button for expanded content
            expandCopyBtn.style.display = "inline-block";
            expandCopyBtn.textContent = "Copy " + item.expand[currentLevel].label.toLowerCase();
            // Update button for next level or collapse
            if (currentLevel + 1 < item.expand.length) {
              expandBtn.textContent = "▸ " + item.expand[currentLevel + 1].label;
            } else {
              expandBtn.textContent = "▾ Collapse";
            }
          } else {
            // Collapse back to line
            expandContent.style.display = "none";
            expandCopyBtn.style.display = "none";
            currentLevel = -1;
            expandBtn.textContent = "▸ " + item.expand[0].label;
          }
        });

        expandCopyBtn.addEventListener("click", () => {
          if (currentLevel >= 0 && currentLevel < item.expand.length) {
            const text = item.expand[currentLevel].text + "\n" + item.ref;
            navigator.clipboard.writeText(text);
            const label = expandCopyBtn.textContent;
            expandCopyBtn.textContent = "Copied!";
            setTimeout(() => { expandCopyBtn.textContent = label; }, 1500);
          }
        });

        expandArea.appendChild(expandBtn);
        expandArea.appendChild(expandContent);
        expandArea.appendChild(expandCopyBtn);
        row.appendChild(expandArea);
      }

      // Attribution row with link and copy button
      const attrRow = el("div", {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "4px"
      });

      if (item.linkTarget) {
        const linkEl = document.createElement("a");
        linkEl.className = "internal-link";
        linkEl.dataset.href = item.linkTarget;
        linkEl.textContent = item.ref;
        linkEl.style.cssText = "font-size:12px;color:var(--text-accent);cursor:pointer";
        linkEl.addEventListener("click", (e) => {
          e.preventDefault();
          app.workspace.openLinkText(linkEl.dataset.href, "", false);
        });
        attrRow.appendChild(linkEl);
      } else {
        const refSpan = document.createElement("span");
        refSpan.textContent = item.ref;
        refSpan.style.cssText = "font-size:12px;color:var(--text-muted)";
        attrRow.appendChild(refSpan);
      }

      const copyOne = document.createElement("button");
      copyOne.textContent = "Copy line";
      copyOne.style.cssText = "padding:2px 8px;font-size:11px;cursor:pointer;margin-left:8px;flex-shrink:0";
      const copyText = item.text + "\n" + item.ref;
      copyOne.addEventListener("click", () => {
        navigator.clipboard.writeText(copyText);
        copyOne.textContent = "Copied!";
        setTimeout(() => { copyOne.textContent = "Copy line"; }, 1500);
      });
      attrRow.appendChild(copyOne);

      row.appendChild(attrRow);
      resultsDiv.appendChild(row);
    }

    if (items.length > 1) {
      copyBtn.style.display = "inline-block";
      copyBtn.onclick = () => {
        const all = items.map(it => it.text + "\n" + it.ref).join("\n\n");
        navigator.clipboard.writeText(all);
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy All"; }, 1500);
      };
    } else {
      copyBtn.style.display = "none";
    }
  }

  // =====================================================================
  // CLASSICS GENERATOR
  // =====================================================================

  async function buildClassicsUI(dv, dataDir, parentContainer) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const container = parentContainer || dv.el("div", "", { cls: "litgen-classics" });

    // Filter row
    const filterRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" });

    const typeSelect = makeSelect(["Any", "Verse", "Prose", "Drama"]);
    filterRow.appendChild(label("Type:"));
    filterRow.appendChild(typeSelect);

    const authorSelect = document.createElement("select");
    authorSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:200px";
    filterRow.appendChild(label("Author:"));
    filterRow.appendChild(authorSelect);

    const workSelect = document.createElement("select");
    workSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:260px";
    filterRow.appendChild(label("Work:"));
    filterRow.appendChild(workSelect);

    function populateAuthors() {
      const type = typeSelect.value.toLowerCase();
      const authors = new Set();
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        authors.add(w.author);
      }
      authorSelect.innerHTML = "";
      addOption(authorSelect, "", "Any");
      for (const a of [...authors].sort()) addOption(authorSelect, a, a);
      populateWorks();
    }

    function populateWorks() {
      const type = typeSelect.value.toLowerCase();
      const author = authorSelect.value;
      workSelect.innerHTML = "";
      addOption(workSelect, "", "Any");
      for (const w of index.works) {
        if (type !== "any" && w.type !== type) continue;
        if (author && w.author !== author) continue;
        addOption(workSelect, w.file, `${w.title} (${w.author})`);
      }
    }

    populateAuthors();
    typeSelect.addEventListener("change", populateAuthors);
    authorSelect.addEventListener("change", populateWorks);
    container.appendChild(filterRow);

    // Controls
    const controlRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" });
    const countSelect = makeSelect(["1", "3", "5", "10"], "1");
    controlRow.appendChild(label("Count:"));
    controlRow.appendChild(countSelect);
    const btn = makeButton("Generate");
    controlRow.appendChild(btn);
    container.appendChild(controlRow);

    const results = el("div", {});
    container.appendChild(results);
    const copyBtn = makeCopyAllButton();
    container.appendChild(copyBtn);

    btn.addEventListener("click", async () => {
      const count = parseInt(countSelect.value);
      const type = typeSelect.value.toLowerCase();
      const author = authorSelect.value;
      const workFile = workSelect.value;
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
          const workData = await loadJSON(dv, dataDir + "/" + workInfo.file);
          const base = projectRoot(dataDir);
          const item = pickClassics(workData, base);
          items.push(item);
        }
        renderResults(results, copyBtn, items);
      } catch (e) {
        results.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });
  }

  function pickClassics(workData, base) {
    const title = workData.title;
    const author = workData.author;
    const section = weightedPick(workData.sections, s =>
      s.speeches ? s.speeches.reduce((n, sp) => n + sp.lines.length, 0) : (s.lines ? s.lines.length : 0)
    );

    if (workData.type === "drama" && section.speeches) {
      // Drama — pick random speech
      const speech = pick(section.speeches);
      const ref = `${author}, ${title} — ${speech.speaker}`;
      const linkTarget = `${base}/Source/Classics/${author}#${section.title || title}`;

      if (speech.lines.length <= 1 || speech.lines.join(" ").length <= 200) {
        return { text: speech.lines.join("\n"), ref: ref, linkTarget: linkTarget };
      } else {
        const line = pick(speech.lines);
        return {
          text: line,
          ref: ref,
          linkTarget: linkTarget,
          expand: [{ label: "Full speech", text: ref + "\n\n" + speech.lines.join("\n") }]
        };
      }

    } else if (workData.type === "verse") {
      // Verse — pick random line, expand to stanza then full section
      const allLines = section.lines || [];
      const allStanzas = section.stanzas || [];
      const line = pick(allLines);
      const ref = `${author}, ${title}` + (section.title ? ` — ${section.title}` : "");
      const linkTarget = `${base}/Source/Classics/${author}#${section.title || title}`;

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
        expand.push({ label: "Full passage", text: title + " — " + (section.title || "") + "\nby " + author + "\n\n" + body });
      }

      return { text: line, ref: ref, linkTarget: linkTarget, expand: expand };

    } else {
      // Prose — pick random paragraph
      const allLines = section.lines || [];
      const line = pick(allLines);
      const ref = `${author}, ${title}` + (section.title ? ` — ${section.title}` : "");
      const linkTarget = `${base}/Source/Classics/${author}#${section.title || title}`;

      return { text: line, ref: ref, linkTarget: linkTarget };
    }
  }

  // =====================================================================
  // MOTIFS GENERATOR
  // =====================================================================

  async function buildMotifsUI(dv, dataDir, parentContainer) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const container = parentContainer || dv.el("div", "", { cls: "litgen-motifs" });

    // Filter row
    const filterRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" });

    const catSelect = document.createElement("select");
    catSelect.style.cssText = "padding:4px 8px;font-size:13px;max-width:300px";
    addOption(catSelect, "", "Any Category");
    for (const cat of index.categories) {
      addOption(catSelect, cat.file, `${cat.letter}. ${cat.name} (${cat.count})`);
    }
    filterRow.appendChild(label("Category:"));
    filterRow.appendChild(catSelect);
    container.appendChild(filterRow);

    // Controls
    const controlRow = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" });
    const countSelect = makeSelect(["1", "3", "5", "10"], "1");
    controlRow.appendChild(label("Count:"));
    controlRow.appendChild(countSelect);
    const btn = makeButton("Generate");
    controlRow.appendChild(btn);
    container.appendChild(controlRow);

    const results = el("div", {});
    container.appendChild(results);
    const copyBtn = makeCopyAllButton();
    container.appendChild(copyBtn);

    btn.addEventListener("click", async () => {
      const count = parseInt(countSelect.value);
      const catFile = catSelect.value;
      try {
        const items = [];
        for (let i = 0; i < count; i++) {
          let catInfo;
          if (catFile) {
            catInfo = index.categories.find(c => c.file === catFile);
          } else {
            catInfo = weightedPick(index.categories, c => c.count);
          }
          const catData = await loadJSON(dv, dataDir + "/" + catInfo.file);
          const item = pickMotif(catData);
          items.push(item);
        }
        renderResults(results, copyBtn, items);
      } catch (e) {
        results.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });
  }

  function pickMotif(catData) {
    // Pick a random sub-group weighted by motif count, then a random motif
    const sg = weightedPick(catData.subgroups, s => s.motifs.length);
    const motif = pick(sg.motifs);
    const ref = `Stith Thompson, Motif-Index — ${motif.id}`;

    // Build expand layers with detail, locations, references
    const expand = [];
    const details = [];
    if (motif.detail) details.push(motif.detail);
    if (motif.locations && motif.locations.length > 0) {
      details.push("Locations: " + motif.locations.join(", "));
    }
    if (motif.refs) details.push("References: " + motif.refs);

    if (details.length > 0) {
      expand.push({ label: "Details", text: details.join("\n\n") });
    }

    return {
      text: motif.description,
      ref: ref,
      linkTarget: null,
      expand: expand.length > 0 ? expand : undefined
    };
  }

  // =====================================================================
  // STANDALONE PICK FUNCTIONS (for Index page)
  // =====================================================================

  async function pickRandomBible(dv, dataDir) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const base = projectRoot(dataDir);
    const bookInfo = weightedPick(index.books, b => b.verses);
    const bookData = await loadJSON(dv, dataDir + "/" + bookInfo.file);
    const ch = weightedPick(bookData.chapters, c => c.verses.length);
    const verse = pick(ch.verses);
    return {
      text: verse.t,
      ref: `King James Bible, ${bookInfo.name} ${ch.chapter}:${verse.v}`,
      linkTarget: `${base}/Source/Bible/${bookInfo.name}#Chapter ${ch.chapter}`
    };
  }

  async function pickRandomShakespeare(dv, dataDir) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const base = projectRoot(dataDir);
    const workInfo = weightedPick(index.works, w => w.lines);
    const workData = await loadJSON(dv, dataDir + "/" + workInfo.file);
    return pickShakespeare(workData, base);
  }

  async function pickRandomPoetry(dv, dataDir) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const base = projectRoot(dataDir);
    const authorInfo = weightedPick(index.authors, a => a.lines);
    const authorData = await loadJSON(dv, dataDir + "/" + authorInfo.file);
    const poem = pick(authorData.poems);
    if (!poem.lines || poem.lines.length === 0) return pickRandomPoetry(dv, dataDir);

    const line = pick(poem.lines);
    const ref = `— ${authorData.author}, "${poem.title}"`;
    const linkTarget = `${base}/Source/Poetry/${authorData.author}#${poem.title}`;

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

    return { text: line, ref: ref, linkTarget: linkTarget, expand: expand };
  }

  async function pickRandomClassics(dv, dataDir) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const base = projectRoot(dataDir);
    const workInfo = weightedPick(index.works, w => w.lines);
    const workData = await loadJSON(dv, dataDir + "/" + workInfo.file);
    return pickClassics(workData, base);
  }

  async function pickRandomMotif(dv, dataDir) {
    const index = await loadJSON(dv, dataDir + "/index.json");
    const catInfo = weightedPick(index.categories, c => c.count);
    const catData = await loadJSON(dv, dataDir + "/" + catInfo.file);
    return pickMotif(catData);
  }

  // =====================================================================
  // INDEX PAGE — all five generators + random quote + one of each
  // =====================================================================

  async function buildIndexUI(dv, baseDir) {
    const container = dv.el("div", "", { cls: "litgen-index" });

    const bibleDir = baseDir + "/Data/Bible";
    const shkDir = baseDir + "/Data/Shakespeare";
    const poetryDir = baseDir + "/Data/Poetry";
    const classicsDir = baseDir + "/Data/Classics";
    const motifsDir = baseDir + "/Data/Motifs";

    // --- Random quote at the top ---
    const quoteSection = el("div", {
      marginBottom: "20px",
      padding: "12px 16px",
      borderLeft: "4px solid var(--text-accent)",
      background: "var(--background-secondary)"
    });

    const quoteContent = el("div", {});
    quoteSection.appendChild(quoteContent);

    const quoteControls = el("div", { marginTop: "8px", display: "flex", gap: "8px" });
    const reloadBtn = makeButton("New Quote");
    quoteControls.appendChild(reloadBtn);
    const quoteCopyAll = makeCopyAllButton();
    quoteSection.appendChild(quoteControls);
    container.appendChild(quoteSection);

    async function loadRandomQuote() {
      try {
        const source = pick(["bible", "shakespeare", "poetry", "classics", "motifs"]);
        let item;
        if (source === "bible") item = await pickRandomBible(dv, bibleDir);
        else if (source === "shakespeare") item = await pickRandomShakespeare(dv, shkDir);
        else if (source === "poetry") item = await pickRandomPoetry(dv, poetryDir);
        else if (source === "classics") item = await pickRandomClassics(dv, classicsDir);
        else item = await pickRandomMotif(dv, motifsDir);
        renderResults(quoteContent, quoteCopyAll, [item]);
      } catch (e) {
        quoteContent.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    }
    reloadBtn.addEventListener("click", loadRandomQuote);
    await loadRandomQuote();

    // --- One of Each button ---
    const eachSection = el("div", { marginBottom: "24px" });
    const eachControls = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" });
    const eachBtn = makeButton("One of Each");
    eachControls.appendChild(eachBtn);
    eachSection.appendChild(eachControls);

    const eachResults = el("div", {});
    eachSection.appendChild(eachResults);
    const eachCopyAll = makeCopyAllButton();
    eachSection.appendChild(eachCopyAll);
    container.appendChild(eachSection);

    eachBtn.addEventListener("click", async () => {
      try {
        const [bible, shk, poetry, classics, motif] = await Promise.all([
          pickRandomBible(dv, bibleDir),
          pickRandomShakespeare(dv, shkDir),
          pickRandomPoetry(dv, poetryDir),
          pickRandomClassics(dv, classicsDir),
          pickRandomMotif(dv, motifsDir)
        ]);
        renderResults(eachResults, eachCopyAll, [bible, shk, poetry, classics, motif]);
      } catch (e) {
        eachResults.innerHTML = `<span style='color:var(--text-error)'>Error: ${e.message}</span>`;
      }
    });

    // --- Separator ---
    container.appendChild(el("hr", { margin: "20px 0", border: "none", borderTop: "1px solid var(--background-modifier-border)" }));

    // --- Bible generator ---
    const bibleHeader = document.createElement("h3");
    bibleHeader.textContent = "Bible (KJV)";
    container.appendChild(bibleHeader);
    await buildBibleUI(dv, bibleDir, container);

    // --- Shakespeare generator ---
    const shkHeader = document.createElement("h3");
    shkHeader.textContent = "Shakespeare";
    container.appendChild(shkHeader);
    await buildShakespeareUI(dv, shkDir, container);

    // --- Poetry generator ---
    const poetryHeader = document.createElement("h3");
    poetryHeader.textContent = "Poetry";
    container.appendChild(poetryHeader);
    await buildPoetryUI(dv, poetryDir, container);

    // --- Classics generator ---
    const classicsHeader = document.createElement("h3");
    classicsHeader.textContent = "Classics";
    container.appendChild(classicsHeader);
    await buildClassicsUI(dv, classicsDir, container);

    // --- Motifs generator ---
    const motifsHeader = document.createElement("h3");
    motifsHeader.textContent = "Motif-Index";
    container.appendChild(motifsHeader);
    await buildMotifsUI(dv, motifsDir, container);
  }

  // =====================================================================
  // PUBLIC API
  // =====================================================================
  return { buildBibleUI, buildShakespeareUI, buildPoetryUI, buildClassicsUI, buildMotifsUI, buildIndexUI };
})();
