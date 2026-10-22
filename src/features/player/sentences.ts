export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function currentSentenceIndex(posSec: number, durSec: number, count: number): number {
  if (count <= 0 || durSec <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor((posSec / durSec) * count)));
}

export function currentChapterIndex(posSec: number, starts: number[]): number {
  let idx = 0;
  starts.forEach((s, i) => {
    if (s <= posSec) idx = i;
  });
  return idx;
}
