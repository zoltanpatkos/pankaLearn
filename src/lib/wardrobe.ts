import { DEFAULT_UNLOCKED_IDS, type WardrobeCategory } from '../data/wardrobeItems'

export interface EquippedItems {
  outfit: string
  hair: string
  accessory: string
  footwear: string
}

export interface WardrobeState {
  unlockedItems: string[]
  equipped: EquippedItems
}

const STORAGE_KEY = 'wardrobeState'

export const DEFAULT_EQUIPPED: EquippedItems = {
  outfit: 'outfit-default',
  hair: 'hair-default',
  accessory: 'accessory-none',
  footwear: 'footwear-sneakers',
}

const DEFAULT_STATE: WardrobeState = {
  unlockedItems: DEFAULT_UNLOCKED_IDS,
  equipped: DEFAULT_EQUIPPED,
}

export function loadWardrobeState(): WardrobeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { ...DEFAULT_STATE, unlockedItems: [...DEFAULT_UNLOCKED_IDS] }
    const parsed = JSON.parse(stored) as WardrobeState
    // Merge equipped with defaults so new categories get their default value
    return { ...parsed, equipped: { ...DEFAULT_EQUIPPED, ...parsed.equipped } }
  } catch {
    return { ...DEFAULT_STATE, unlockedItems: [...DEFAULT_UNLOCKED_IDS] }
  }
}

export function saveWardrobeState(state: WardrobeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function equipItem(
  itemId: string,
  category: WardrobeCategory,
  state: WardrobeState,
): WardrobeState {
  return { ...state, equipped: { ...state.equipped, [category]: itemId } }
}

export function unlockItem(itemId: string, state: WardrobeState): WardrobeState {
  if (state.unlockedItems.includes(itemId)) return state
  return { ...state, unlockedItems: [...state.unlockedItems, itemId] }
}
