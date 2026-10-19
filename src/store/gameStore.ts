import { create } from 'zustand'
import type { Card } from '../data/types'
import blue from '../data/blue.json'
import red from '../data/red.json'
import green from '../data/green.json'
import { fisherYates } from '../utils/shuffle'
import { playYes, playBonk } from '../utils/sfx'

export type Phase = 'SPLASH' | 'SETUP' | 'TURN_INTRO' | 'PLAYING' | 'TURN_SUMMARY' | 'END'

export interface Team {
  name: string
  score: number
  poetIndex: number
}

export interface PoetCard extends Card {
  status: 'active' | 'banked1' | 'banked3' | 'skipped' | 'bonked'
}

export interface GameStore {
  phase: Phase
  teams: [Team, Team]
  currentTeamIndex: 0 | 1
  turnsPerTeam: number
  turnsTaken: number[] // [team0, team1]
  deckSide: 'blue' | 'red' | 'mixed'
  deck: Card[]
  usedIds: Set<string>
  poetCards: PoetCard[]
  currentCardIndex: number
  timerSeconds: number
  timerRunning: boolean
  turnSeconds: number
  setup: (opts: {
    team1: string
    team2: string
    turnsPerTeam: number
    deckSide: 'blue' | 'red' | 'mixed'
    turnSeconds: number
  }) => void
  dismissSplash: () => void
  startTurn: () => void
  drawNext: () => void
  bank1: () => void
  bank3: () => void
  skip: () => void
  bonk: () => void
  endTurn: () => void
  nextTurn: () => void
  rematch: () => void
  tick: () => void
  stopTimer: () => void
  startTimer: () => void
}

const ALL_CARDS: Card[] = [...blue, ...red, ...green] as Card[]

function buildDeck(deckSide: 'blue' | 'red' | 'mixed'): Card[] {
  let cards: Card[] = []
  if (deckSide === 'blue') cards = [...(blue as Card[]), ...(green as Card[])]
  else if (deckSide === 'red') cards = [...(red as Card[]), ...(green as Card[])]
  else cards = [...(blue as Card[]), ...(red as Card[]), ...(green as Card[])]
  return fisherYates(cards)
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'SPLASH',
  teams: [
    { name: 'Team A', score: 0, poetIndex: 0 },
    { name: 'Team B', score: 0, poetIndex: 0 },
  ],
  currentTeamIndex: 0,
  turnsPerTeam: 3,
  turnsTaken: [0, 0],
  deckSide: 'blue',
  deck: [],
  usedIds: new Set(),
  poetCards: [],
  currentCardIndex: 0,
  timerSeconds: 90,
  timerRunning: false,
  turnSeconds: 90,
  dismissSplash: () => {
    set({ phase: 'SETUP' })
  },
  setup: (opts) => {
    const deck = buildDeck(opts.deckSide)
    // load used from localStorage if present
    let used = new Set<string>()
    try {
      const raw = localStorage.getItem('pfn.used.v2')
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        used = new Set(arr.filter((x) => ALL_CARDS.some((c) => c.id === x)))
      }
    } catch {}
    set({
      phase: 'TURN_INTRO',
      teams: [
        { name: opts.team1, score: 0, poetIndex: 0 },
        { name: opts.team2, score: 0, poetIndex: 0 },
      ],
      turnsPerTeam: opts.turnsPerTeam,
      turnsTaken: [0, 0],
      deckSide: opts.deckSide,
      deck,
      usedIds: used,
      poetCards: [],
      currentCardIndex: 0,
      timerSeconds: opts.turnSeconds,
      timerRunning: false,
      turnSeconds: opts.turnSeconds,
      currentTeamIndex: 0,
    })
  },
  startTurn: () => {
    const { deck, usedIds } = get()
    const fresh = deck.filter((c) => !usedIds.has(c.id))
    if (fresh.length < 5) {
      usedIds.clear()
      try {
        localStorage.setItem('pfn.used.v2', '[]')
      } catch {}
      const d = buildDeck(get().deckSide)
      set({ deck: d, usedIds: new Set() })
    }
    const card = (get().deck.find((c) => !get().usedIds.has(c.id)) ||
      get().deck[0]) as Card
    set({
      phase: 'PLAYING',
      poetCards: [{ ...card, status: 'active' }],
      currentCardIndex: 0,
      timerSeconds: get().turnSeconds,
      timerRunning: true,
    })
    const used = new Set(get().usedIds)
    used.add(card.id)
    set({ usedIds: used })
    try {
      localStorage.setItem('pfn.used.v2', JSON.stringify(Array.from(used)))
    } catch {}
  },
  drawNext: () => {
    const { deck, usedIds, poetCards } = get()
    const card = deck.find((c) => !usedIds.has(c.id))
    if (!card) return
    const used = new Set(usedIds)
    used.add(card.id)
    set({
      poetCards: [...poetCards, { ...card, status: 'active' }],
      currentCardIndex: poetCards.length,
      usedIds: used,
    })
    try {
      localStorage.setItem('pfn.used.v2', JSON.stringify(Array.from(used)))
    } catch {}
  },
  bank1: () => {
    playYes()
    const { poetCards, currentCardIndex, teams, currentTeamIndex } = get()
    const copy = [...poetCards]
    const t = [...teams] as [Team, Team]
    copy[currentCardIndex] = { ...copy[currentCardIndex], status: 'banked1' }
    t[currentTeamIndex] = { ...t[currentTeamIndex], score: t[currentTeamIndex].score + 1 }
    set({ poetCards: copy, teams: t as [Team, Team] })
    get().drawNext()
  },
  bank3: () => {
    playYes()
    const { poetCards, currentCardIndex, teams, currentTeamIndex } = get()
    const copy = [...poetCards]
    const t = [...teams] as [Team, Team]
    copy[currentCardIndex] = { ...copy[currentCardIndex], status: 'banked3' }
    t[currentTeamIndex] = { ...t[currentTeamIndex], score: t[currentTeamIndex].score + 3 }
    set({ poetCards: copy, teams: t as [Team, Team] })
    get().drawNext()
  },
  skip: () => {
    playBonk()
    const { poetCards, currentCardIndex, teams, currentTeamIndex } = get()
    const copy = [...poetCards]
    const t = [...teams] as [Team, Team]
    copy[currentCardIndex] = { ...copy[currentCardIndex], status: 'skipped' }
    t[currentTeamIndex] = { ...t[currentTeamIndex], score: t[currentTeamIndex].score - 1 }
    set({ poetCards: copy, teams: t as [Team, Team] })
    get().drawNext()
  },
  bonk: () => {
    playBonk()
    const { poetCards, currentCardIndex, teams, currentTeamIndex } = get()
    const copy = [...poetCards]
    const t = [...teams] as [Team, Team]
    copy[currentCardIndex] = { ...copy[currentCardIndex], status: 'bonked' }
    t[currentTeamIndex] = { ...t[currentTeamIndex], score: t[currentTeamIndex].score - 1 }
    set({ poetCards: copy, teams: t as [Team, Team] })
    get().drawNext()
  },
  endTurn: () => {
    set({ timerRunning: false, phase: 'TURN_SUMMARY' })
  },
  nextTurn: () => {
    const { currentTeamIndex, turnsTaken, turnsPerTeam } = get()
    const tt = [...turnsTaken]
    tt[currentTeamIndex] = tt[currentTeamIndex] + 1
    const nextIdx = currentTeamIndex === 0 ? 1 : 0
    // check end
    if (tt[0] >= turnsPerTeam && tt[1] >= turnsPerTeam) {
      set({
        turnsTaken: tt,
        phase: 'END',
        currentTeamIndex: nextIdx,
      })
      return
    }
    set({
      turnsTaken: tt,
      currentTeamIndex: nextIdx,
      timerSeconds: get().turnSeconds,
      timerRunning: false,
      phase: 'TURN_INTRO',
      poetCards: [],
      currentCardIndex: 0,
    })
  },
  rematch: () => {
    const deck = buildDeck(get().deckSide)
    set({
      phase: 'SETUP',
      teams: [
        { name: get().teams[0].name, score: 0, poetIndex: 0 },
        { name: get().teams[1].name, score: 0, poetIndex: 0 },
      ],
      turnsTaken: [0, 0],
      deck,
      usedIds: new Set(),
      poetCards: [],
      currentCardIndex: 0,
      timerSeconds: get().turnSeconds,
      timerRunning: false,
      currentTeamIndex: 0,
    })
    try {
      localStorage.setItem('pfn.used.v2', '[]')
    } catch {}
  },
  tick: () => {
    const s = get().timerSeconds
    if (s <= 0) {
      get().endTurn()
      return
    }
    set({ timerSeconds: s - 1 })
  },
  stopTimer: () => set({ timerRunning: false }),
  startTimer: () => set({ timerRunning: true }),
}))
