import type { JSX } from 'react'

interface Props {
  count: 1 | 2 | 3 | 4 | 5
  size?: number
}

const DOT_R = 20
const FILL = '#6366f1'

const PATTERNS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 50], [70, 50]],
  3: [[30, 72], [70, 72], [50, 28]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[25, 30], [75, 30], [50, 50], [25, 70], [75, 70]],
}

export function DotPattern({ count, size = 180 }: Props): JSX.Element {
  const dots = PATTERNS[count] ?? PATTERNS[1]
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="96" height="96" rx="16" fill="white" opacity="0.18" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={DOT_R} fill={FILL} />
      ))}
    </svg>
  )
}
