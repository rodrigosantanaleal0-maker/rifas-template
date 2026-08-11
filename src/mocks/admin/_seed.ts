/**
 * PRNG determinístico (mulberry32) usado apenas para gerar os dados
 * DEMO do PackLP Admin de forma estável entre reloads, sem depender de
 * Math.random(). Nunca usar isto para nada que precise de aleatoriedade
 * criptográfica — é só para popular a interface durante o desenvolvimento.
 */
export function createSeededRandom(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}
