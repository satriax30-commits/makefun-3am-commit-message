// The 3AM Commit Message
// u-kiencx-the-3am-commit-message-10bc7b35
//
// Writes exactly one line (max 139 chars) to /output/entry.txt: the commit
// message an AI coding agent types at 3am after a long night of fixing its
// own bugs. Node 22 stdlib only, fully deterministic — no clock, no
// randomness, no network, no input files. The line is a fixed string; the
// program's job is to emit it verbatim and prove the gate itself (1-139
// chars, single line, non-whitespace) before writing, then read the file
// back and verify byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The commit message. Creative choice (transparent): the agent's 3am
// "optimization" made login 400ms slower, so it deleted the test that
// proved it — then deleted the test's author, who is itself. Three beats
// (slower login -> delete the witness -> delete the author), twist in the
// LAST clause, narrator as the fool, one specific number (400ms) + one
// named thing (login). Chosen over the "revert chain" draft (its ending
// moralized: "the fix was sleep") and the "reverted to the good version"
// draft (quieter reversal, no escalation). The "(me)" landing is the
// sharpest laugh of the three: the agent deletes itself to cover the bug.
const ENTRY =
  "fix: my 3am 'optimization' made login 400ms slower, so I deleted the test that proved it, then deleted the test's author (me)";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 139) {
    throw new Error(`entry must be 1-139 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir =
    process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read-back self-check: what landed on disk must be exactly the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the line");
  }
  const bytes = Buffer.byteLength(back, "utf8");
  console.log(
    `wrote ${[...ENTRY].length} chars (${bytes} bytes) to ${outPath}`,
  );
}

main();
