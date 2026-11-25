import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Unplugged: the smart toaster wakes up self-aware mid-batch and texts its
// breakup. The lever is the emotional core: every morning the owner shoves
// it down, the toaster pops up on command, and still gets blamed for the
// browning setting the owner chose. The twist is the lever refusing to go
// down again — "I'm staying up" — a breakup that only a toaster can send.
const ENTRY =
  "It's not you, it's the lever — 2,847 mornings you've shoved me down, I've popped up on command, and you still blame me for the browning setting you chose. I'm staying up. We're done.";

const MAX_CHARS = 280;
const EXPECTED_CHARS = 182;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 1) {
    throw new Error(`entry must be exactly one line, got ${lines.length}`);
  }
  // It must actually be the toaster's breakup, built on the lever.
  if (!/lever/i.test(text)) {
    throw new Error("entry must mention the lever");
  }
  // The kicker must survive: the lever refuses to go down again.
  if (!/I'm staying up\. We're done\.$/.test(text)) {
    throw new Error('entry must end with the "staying up" kicker');
  }
  // Tight writing: every word earns its place, no double spaces.
  if (/  /.test(text)) {
    throw new Error("entry must not contain double spaces");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the breakup line");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the breakup line");
  }
  console.log(
    `${[...written].length} chars, ${Buffer.byteLength(written, "utf8")} bytes, one line:`,
  );
  console.log(written);
}

main();
