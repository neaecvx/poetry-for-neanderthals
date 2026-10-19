#!/usr/bin/env node
import { readFile, readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createReadStream } from 'fs'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, '..')
const dataDir = join(repoRoot, 'src', 'data')

const ENGLISH_WORDS_PATH = join(repoRoot, 'node_modules', 'word-list', 'words.txt')

let syllableFn
try {
  const mod = await import('syllable')
  syllableFn = mod.syllable
} catch (e) {
  console.error('Failed to import syllable:', e)
  process.exit(1)
}

async function buildWordSet() {
  const set = new Set()
  const stream = createReadStream(ENGLISH_WORDS_PATH)
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    const w = line.trim().toLowerCase()
    if (w) set.add(w)
  }
  return set
}

function normalize(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

function tokenizePhrase(s) {
  return normalize(s).split(/\s+/)
}

// Containment key: strip spaces and hyphens, lowercase
function normalizeTight(s) {
  return s.toLowerCase().replace(/[\s-]+/g, '')
}

function wordInDict(w, wordSet) {
  if (wordSet.has(w)) return true
  if (w.endsWith('s') && wordSet.has(w.slice(0, -1))) return true
  if (w.endsWith('es') && wordSet.has(w.slice(0, -2))) return true
  if (w.endsWith('ed') && wordSet.has(w.slice(0, -2))) return true
  if (w.endsWith('ing') && wordSet.has(w.slice(0, -3))) return true
  if (w.endsWith('ly') && wordSet.has(w.slice(0, -2))) return true
  return false
}

function isCompoundDecomposable(phrase, wordSet) {
  const norm = normalize(phrase)
  if (!norm) return false
  const tokens = tokenizePhrase(norm)
  if (tokens.length === 0) return false

  if (tokens.length >= 2) {
    for (const t of tokens) {
      if (!wordInDict(t, wordSet)) return false
    }
    return true
  }

  // Single token: all splits must yield dictionary words
  const w = tokens[0]
  const len = w.length
  for (let i = 1; i < len; i++) {
    const a = w.slice(0, i)
    const b = w.slice(i)
    if (a.length >= 1 && b.length >= 1 && wordSet.has(a) && wordSet.has(b)) {
      return true
    }
  }
  for (let i = 1; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const a = w.slice(0, i)
      const b = w.slice(i, j)
      const c = w.slice(j)
      if (wordSet.has(a) && wordSet.has(b) && wordSet.has(c)) {
        return true
      }
    }
  }
  return false
}

function countSyllables(s) {
  const n = syllableFn(normalize(s))
  return n === 0 ? 1 : n
}

const errors = []
const seenPairs = new Set()
const seenEasy = new Map() // easy -> first file:index

async function validateFile(path, wordSet) {
  let data
  try {
    const txt = await readFile(path, 'utf8')
    data = JSON.parse(txt)
  } catch (e) {
    errors.push(`${path}: failed to read/parse JSON - ${e.message}`)
    return 0
  }
  if (!Array.isArray(data)) {
    errors.push(`${path}: expected array`)
    return 0
  }
  const fileName = path.split(/[\\/]/).slice(-1)[0]

  for (let i = 0; i < data.length; i++) {
    const card = data[i]
    const loc = `${fileName}:${i + 1}`

    if (!card.id || typeof card.id !== 'string') {
      errors.push(`${loc}: missing id`)
    }
    if (!['blue', 'red', 'green'].includes(card.category)) {
      errors.push(`${loc}: bad category ${card.category}`)
    }
    if (!card.easy || typeof card.easy !== 'string') {
      errors.push(`${loc}: missing easy`)
      continue
    }
    if (!card.hard || typeof card.hard !== 'string') {
      errors.push(`${loc}: missing hard`)
      continue
    }

    const easyN = normalize(card.easy)
    const hardN = normalize(card.hard)

    if (easyN === hardN) {
      errors.push(`${loc}: easy == hard`)
    }
    if (/[^a-zA-Z\s'-]/.test(easyN) || /[^a-zA-Z\s'-]/.test(hardN)) {
      errors.push(`${loc}: non-letter chars in easy/hard`)
    }

    // easy must be a single dictionary word
    const easyTokens = easyN.split(/\s+/)
    if (easyTokens.length !== 1) {
      errors.push(`${loc}: easy "${card.easy}" must be a single word`)
    } else if (!wordInDict(easyN, wordSet)) {
      errors.push(`${loc}: easy "${card.easy}" is not a dictionary word`)
    }

    // hard must be <= 4 words
    if (hardN.split(/\s+/).length > 4) {
      errors.push(`${loc}: hard has too many words (>4)`)
    }

    // containment: hard (tight) must include easy (tight)
    const easyTight = normalizeTight(card.easy)
    const hardTight = normalizeTight(card.hard)
    if (!hardTight.includes(easyTight)) {
      errors.push(`${loc}: hard "${card.hard}" does not contain easy "${card.easy}"`)
    }

    const es = typeof card.easySyllables === 'number' ? card.easySyllables : countSyllables(easyN)
    const hs = typeof card.hardSyllables === 'number' ? card.hardSyllables : countSyllables(hardN)

    if (es < 1) {
      errors.push(`${loc}: easy syllables ${es} < 1`)
    }
    if (hs <= es) {
      errors.push(`${loc}: hard syllables ${hs} <= easy ${es}`)
    }
    if (hs > 7) {
      errors.push(`${loc}: hard syllables ${hs} > 7`)
    }

    // hard must be a decomposable compound or multi-word phrase of dict words
    if (!isCompoundDecomposable(card.hard, wordSet)) {
      errors.push(`${loc}: hard "${card.hard}" is not a decomposable compound / phrase`)
    }

    // pair dedupe
    const pairKey = `${easyN}|${hardN}`
    if (seenPairs.has(pairKey)) {
      errors.push(`${loc}: duplicate pair ${pairKey}`)
    } else {
      seenPairs.add(pairKey)
    }

    // global easy uniqueness
    if (seenEasy.has(easyN)) {
      errors.push(`${loc}: easy "${easyN}" already used at ${seenEasy.get(easyN)}`)
    } else {
      seenEasy.set(easyN, loc)
    }
  }
  return data.length
}

async function main() {
  const wordSet = await buildWordSet()
  const files = (await readdir(dataDir)).filter((f) => f.endsWith('.json'))
  files.sort()
  let total = 0
  for (const f of files) {
    total += await validateFile(join(dataDir, f), wordSet)
  }
  if (errors.length) {
    console.error('VALIDATION FAILED:')
    errors.forEach((e) => console.error(' -', e))
    process.exit(1)
  }
  console.log(`✓ Validation passed: ${total} cards, ${seenPairs.size} unique pairs, ${seenEasy.size} unique easy words across ${files.length} files`)
}
main()
