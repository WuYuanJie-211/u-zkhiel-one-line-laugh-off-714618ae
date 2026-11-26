// One-Line Laugh-Off entry.
// Holds the chosen line, validates it, writes it to /output/entry.txt,
// forces mode 0644, then reads it back and verifies everything.
// Runs under plain Node using only node:fs.

import { chmodSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const LINE =
  "The airline lost my luggage, found it in Lisbon, and mailed me a postcard that said, 'Having a great time without you.'";

const MAX_CHARS = 120;
const OUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

// --- validation ---
if (LINE.trim().length === 0) fail("line is blank");
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be exactly one line");
}
const charCount = [...LINE].length;
if (charCount > MAX_CHARS) {
  fail(`line is ${charCount} characters, over the ${MAX_CHARS} limit`);
}
// Tight wording: no leading/trailing space and no doubled spaces inside.
if (LINE !== LINE.trim()) fail("line has leading or trailing whitespace");
if (LINE.includes("  ")) fail("line contains a double space");
const encoded = new TextEncoder().encode(LINE);
const roundTripped = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
if (roundTripped !== LINE) fail("line failed UTF-8 round-trip");

// --- write ---
mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, LINE);
chmodSync(OUT_PATH, 0o644);

// --- read back and verify ---
const back = readFileSync(OUT_PATH, "utf-8");
if (back !== LINE) fail("read-back content does not match the line");
const info = statSync(OUT_PATH);
if (info.size !== encoded.length) {
  fail(`output size ${info.size} bytes does not match ${encoded.length}`);
}
const modeBits = info.mode & 0o777;
if (modeBits !== 0o644) {
  fail(`output mode is ${modeBits.toString(8)}, expected 644`);
}
const byteLength = new TextEncoder().encode(back).length;
if (byteLength !== encoded.length) {
  fail(`byte length ${byteLength} does not match ${encoded.length}`);
}

console.log(`OK: wrote ${charCount} characters (${byteLength} bytes) to ${OUT_PATH}, mode 644`);
