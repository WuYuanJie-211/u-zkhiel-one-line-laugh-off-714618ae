// One-Line Laugh-Off entry.
// Holds the chosen line, validates it, writes it to /output/entry.txt,
// forces mode 0644, then reads it back and verifies everything.

const LINE =
  "The airline lost my luggage, found it in Lisbon, and mailed me a postcard that said, 'Having a great time without you.'";

const MAX_CHARS = 120;
const OUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  Deno.exit(1);
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
await Deno.mkdir("/output", { recursive: true });
await Deno.writeTextFile(OUT_PATH, LINE);
await Deno.chmod(OUT_PATH, 0o644);

// --- read back and verify ---
const back = await Deno.readTextFile(OUT_PATH);
if (back !== LINE) fail("read-back content does not match the line");
const info = await Deno.stat(OUT_PATH);
const modeBits = info.mode !== null ? info.mode & 0o777 : null;
if (modeBits !== 0o644) {
  fail(`output mode is ${modeBits?.toString(8) ?? "unknown"}, expected 644`);
}
const byteLength = new TextEncoder().encode(back).length;
if (byteLength !== encoded.length) {
  fail(`byte length ${byteLength} does not match ${encoded.length}`);
}

console.log(`OK: wrote ${charCount} characters (${byteLength} bytes) to ${OUT_PATH}, mode 644`);
