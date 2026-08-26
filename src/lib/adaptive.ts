export interface ItemStats {
  attempts: number
  successes: number
  lastSeen: number
  lastResult: boolean
  weight: number
}

export type PerformanceStats = Record<string, Record<string, ItemStats>>

const KEY = 'performanceStats'
const NEW_WEIGHT   = 1.5   // unseen item starts above baseline — makes it interesting
const MIN_WEIGHT   = 0.3
const MAX_WEIGHT   = 5.0
const HIT_FACTOR   = 0.9   // weight drops on success → appears less often
const MISS_FACTOR  = 1.5   // weight rises on failure → appears more often
const COOLDOWN_MS  = 60_000 // same item within 60 s gets weight halved

function load(): PerformanceStats {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

function save(s: PerformanceStats): void {
  localStorage.setItem(KEY, JSON.stringify(s))
}

function effectiveWeight(stats: ItemStats | undefined): number {
  if (!stats) return NEW_WEIGHT
  const cooldown = Date.now() - stats.lastSeen < COOLDOWN_MS
  const w = cooldown ? stats.weight * 0.5 : stats.weight
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, w))
}

export function selectNextItem<T>(taskType: string, items: T[], getId: (item: T) => string): T {
  const stats = load()[taskType] ?? {}
  const weights = items.map(item => effectiveWeight(stats[getId(item)]))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

// Weighted sampling without replacement — used for picking N distinct items per round
export function selectNextItems<T>(
  taskType: string,
  items: T[],
  getId: (item: T) => string,
  count: number,
): T[] {
  const result: T[] = []
  const pool = [...items]
  for (let k = 0; k < count && pool.length > 0; k++) {
    const picked = selectNextItem(taskType, pool, getId)
    result.push(picked)
    pool.splice(pool.findIndex(i => getId(i) === getId(picked)), 1)
  }
  return result
}

export function recordAttempt(taskType: string, itemId: string, success: boolean): void {
  const all = load()
  const ts = all[taskType] ?? {}
  const prev = ts[itemId]
  const base = prev?.weight ?? 1.0
  ts[itemId] = {
    attempts:  (prev?.attempts  ?? 0) + 1,
    successes: (prev?.successes ?? 0) + (success ? 1 : 0),
    lastSeen:  Date.now(),
    lastResult: success,
    weight: Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, base * (success ? HIT_FACTOR : MISS_FACTOR))),
  }
  all[taskType] = ts
  save(all)
}

export function getStats(): PerformanceStats { return load() }
export function resetStats(): void { localStorage.removeItem(KEY) }

export function getItemWeight(taskType: string, itemId: string): number {
  return load()[taskType]?.[itemId]?.weight ?? NEW_WEIGHT
}

// Aggregate mastery across all items recorded under a taskType — used for
// task types where difficulty is staged as a whole rather than per-item.
export function getAverageWeight(taskType: string): number {
  const items = Object.values(load()[taskType] ?? {})
  if (items.length === 0) return NEW_WEIGHT
  return items.reduce((sum, s) => sum + s.weight, 0) / items.length
}

// Shared 3-tier difficulty staging: a task type progresses 1 -> 2 -> 3 only
// once at least 5 tasks were completed at the current level AND aggregate
// mastery (getAverageWeight) has crossed the level's threshold — prevents
// flip-flopping on a lucky/unlucky streak. Never regresses.
export interface StagedLevelState { level: 1 | 2 | 3; tasksAtLevel: number }

export function loadStagedLevel(storageKey: string): StagedLevelState {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (raw && (raw.level === 1 || raw.level === 2 || raw.level === 3) && typeof raw.tasksAtLevel === 'number') {
      return raw as StagedLevelState
    }
  } catch { /* ignore malformed storage */ }
  return { level: 1, tasksAtLevel: 0 }
}

// Call after each successfully completed task for the given taskType.
export function advanceStagedLevel(storageKey: string, taskType: string): StagedLevelState {
  const cur = loadStagedLevel(storageKey)
  const tasksAtLevel = cur.tasksAtLevel + 1
  const avg = getAverageWeight(taskType)
  let level = cur.level
  if (level === 1 && tasksAtLevel >= 5 && avg < 1.0) level = 2
  else if (level === 2 && tasksAtLevel >= 5 && avg < 0.7) level = 3
  const next: StagedLevelState = { level, tasksAtLevel: level === cur.level ? tasksAtLevel : 0 }
  localStorage.setItem(storageKey, JSON.stringify(next))
  return next
}
