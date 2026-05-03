#!/usr/bin/env node
// Refresh the "From the Blog" list in index.html from a committed RSS snapshot.
// The snapshot at _data/blog-feed.xml is pushed in by the blog server
// (Prometheus) after each Quartz build, so we never have to fetch through
// Cloudflare. No deps — built-in fs + regex.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const POST_COUNT = 5;
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FEED_PATH = process.env.BLOG_FEED_PATH
  ? resolve(process.env.BLOG_FEED_PATH)
  : resolve(REPO_ROOT, "_data/blog-feed.xml");
const HTML_PATH = resolve(REPO_ROOT, "index.html");
const START = "<!-- BLOG_POSTS:START -->";
const END = "<!-- BLOG_POSTS:END -->";

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;");

const stripCdata = (s) => {
  const m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return (m ? m[1] : s).trim();
};

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? stripCdata(m[1]) : null;
};

const formatDate = (rfc822) => {
  const d = new Date(rfc822);
  if (Number.isNaN(d.getTime())) throw new Error(`Bad pubDate: ${rfc822}`);
  return d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
};

if (!existsSync(FEED_PATH)) {
  throw new Error(
    `Feed snapshot not found at ${FEED_PATH}. ` +
      `Expected the blog server to PUT it via the GitHub Contents API after each Quartz build.`,
  );
}
const xml = readFileSync(FEED_PATH, "utf8");

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  .slice(0, POST_COUNT)
  .map((m) => {
    const block = m[1];
    return {
      title: tag(block, "title"),
      link: tag(block, "link"),
      pubDate: tag(block, "pubDate"),
    };
  });

if (items.length === 0) throw new Error("No <item> entries found in feed");

const lines = items.map(
  ({ title, link, pubDate }) =>
    `<li><a href="${escapeHtml(link)}">${escapeHtml(title)}</a> <span class="post-date">${formatDate(pubDate)}</span></li>`,
);

// Sentinels in index.html sit at 8-space indent; the regex preserves the
// indent before START, so other lines get the indent via the join separator.
const newBlock = [START, ...lines, END].join("\n        ");
const html = readFileSync(HTML_PATH, "utf8");
const pattern = new RegExp(`${START}[\\s\\S]*?${END}`);
if (!pattern.test(html)) throw new Error("Sentinels not found in index.html");
const updated = html.replace(pattern, newBlock);

if (updated === html) {
  console.log("No changes.");
} else {
  writeFileSync(HTML_PATH, updated);
  console.log(`Updated index.html with ${items.length} posts.`);
}
