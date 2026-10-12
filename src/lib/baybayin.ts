// Baybayin from syllables written with hyphens: "pi-li-ng li-k-ha" → ᜉᜒᜎᜒᜅ᜔ ᜎᜒᜃ᜔ᜑ
// A consonant with a vowel takes a kudlit (i/e above, u/o below); a consonant on
// its own takes the virama, as in modern usage. Spaces separate words.

const CONSONANTS: Record<string, string> = {
  k: 'ᜃ', g: 'ᜄ', ng: 'ᜅ', t: 'ᜆ', d: 'ᜇ', n: 'ᜈ', p: 'ᜉ', b: 'ᜊ',
  m: 'ᜋ', y: 'ᜌ', r: 'ᜍ', l: 'ᜎ', w: 'ᜏ', s: 'ᜐ', h: 'ᜑ',
}
const VOWELS: Record<string, string> = {a: 'ᜀ', i: 'ᜁ', e: 'ᜁ', u: 'ᜂ', o: 'ᜂ'}
const KUDLIT: Record<string, string> = {a: '', i: 'ᜒ', e: 'ᜒ', u: 'ᜓ', o: 'ᜓ'}
const VIRAMA = '᜔'

function syllable(s: string): string {
  if (VOWELS[s]) return VOWELS[s]
  const v = s.at(-1) ?? ''
  const hasVowel = v in KUDLIT
  const c = CONSONANTS[hasVowel ? s.slice(0, -1) : s]
  if (!c) throw new Error(`Not a Baybayin syllable: "${s}"`)
  return hasVowel ? c + KUDLIT[v] : c + VIRAMA
}

export const baybayin = (syllables: string) =>
  syllables
    .split(' ')
    .map((word) => word.split('-').map(syllable).join(''))
    .join(' ')

/** The plain Tagalog spelling, for the small romanised line. */
export const romanise = (syllables: string) => syllables.replaceAll('-', '')
