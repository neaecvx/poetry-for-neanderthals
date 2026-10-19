export type Category = 'blue' | 'red' | 'green'

export interface Card {
  id: string
  category: Category
  easy: string
  hard: string
  easySyllables: number
  hardSyllables: number
}
