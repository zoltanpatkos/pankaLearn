export interface ArrowGuide {
  x: number; y: number; angle: number  // 0-100 space, degrees
}

export interface LetterDef {
  letter: string
  level: 1 | 2 | 3
  ttsInstruction: string
  startX: number; startY: number   // 0-100 normalized
  endX: number;   endY: number
  expectedAngle: number            // degrees: 0=right, 90=down, -90=up, ±180=left
  arrows: ArrowGuide[]
  // w = canvas width in px; h = canvas height (defaults to w for the square
  // print-letter/orient canvases — only the wide kötött-írás canvas passes
  // both, since its font size scales with row height, not width).
  draw: (ctx: CanvasRenderingContext2D, w: number, h?: number) => void
}

// All draw functions receive a context pre-configured with strokeStyle/lineWidth/lineCap.
// They add paths and call stroke(). p() scales 0-100 coords to canvas pixels.

export const LETTER_DEFS: LetterDef[] = [

  // ── Level 1: Egyenes vonalak ─────────────────────────────────────────────

  {
    letter: 'I', level: 1,
    ttsInstruction: 'Rajzold az I betűt! Indulj felülről, húzz egyenesen le!',
    startX: 50, startY: 12, endX: 50, endY: 88, expectedAngle: 90,
    arrows: [{ x: 50, y: 50, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath(); ctx.moveTo(p(50), p(12)); ctx.lineTo(p(50), p(88)); ctx.stroke()
    },
  },

  {
    letter: 'L', level: 1,
    ttsInstruction: 'Rajzold az L betűt! Le, majd jobbra!',
    startX: 28, startY: 12, endX: 78, endY: 88, expectedAngle: 90,
    arrows: [{ x: 28, y: 50, angle: 90 }, { x: 53, y: 88, angle: 0 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath(); ctx.moveTo(p(28), p(12)); ctx.lineTo(p(28), p(88)); ctx.lineTo(p(78), p(88)); ctx.stroke()
    },
  },

  {
    letter: 'T', level: 1,
    ttsInstruction: 'Rajzold a T betűt! Először húzz jobbra, majd le a közepéből!',
    startX: 15, startY: 22, endX: 50, endY: 88, expectedAngle: 0,
    arrows: [{ x: 50, y: 22, angle: 0 }, { x: 50, y: 55, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath(); ctx.moveTo(p(15), p(22)); ctx.lineTo(p(85), p(22)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(p(50), p(22)); ctx.lineTo(p(50), p(88)); ctx.stroke()
    },
  },

  {
    letter: 'H', level: 1,
    ttsInstruction: 'Rajzold a H betűt! Bal le, jobb le, középen kereszt!',
    startX: 27, startY: 12, endX: 73, endY: 88, expectedAngle: 90,
    arrows: [{ x: 27, y: 50, angle: 90 }, { x: 73, y: 50, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(27), p(12)); ctx.lineTo(p(27), p(88))
      ctx.moveTo(p(73), p(12)); ctx.lineTo(p(73), p(88))
      ctx.moveTo(p(27), p(50)); ctx.lineTo(p(73), p(50))
      ctx.stroke()
    },
  },

  {
    letter: 'F', level: 1,
    ttsInstruction: 'Rajzold az F betűt! Le, majd jobbra fent, jobbra közép!',
    startX: 25, startY: 12, endX: 68, endY: 52, expectedAngle: 90,
    arrows: [{ x: 25, y: 50, angle: 90 }, { x: 52, y: 12, angle: 0 }, { x: 48, y: 52, angle: 0 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(80), p(12))
      ctx.moveTo(p(25), p(50)); ctx.lineTo(p(68), p(50))
      ctx.stroke()
    },
  },

  {
    letter: 'E', level: 1,
    ttsInstruction: 'Rajzold az E betűt! Le, fent jobbra, közép jobbra, lent jobbra!',
    startX: 25, startY: 12, endX: 80, endY: 88, expectedAngle: 90,
    arrows: [{ x: 25, y: 50, angle: 90 }, { x: 52, y: 12, angle: 0 }, { x: 48, y: 50, angle: 0 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(80), p(12))
      ctx.moveTo(p(25), p(50)); ctx.lineTo(p(68), p(50))
      ctx.moveTo(p(25), p(88)); ctx.lineTo(p(80), p(88))
      ctx.stroke()
    },
  },

  {
    letter: 'V', level: 1,
    ttsInstruction: 'Rajzold a V betűt! Le jobbra, majd fel jobbra!',
    startX: 18, startY: 12, endX: 82, endY: 12, expectedAngle: 65,
    arrows: [{ x: 34, y: 50, angle: 65 }, { x: 66, y: 50, angle: -65 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath(); ctx.moveTo(p(18), p(12)); ctx.lineTo(p(50), p(88)); ctx.lineTo(p(82), p(12)); ctx.stroke()
    },
  },

  // ── Level 2: Körök és ívek ────────────────────────────────────────────────

  {
    letter: 'O', level: 2,
    ttsInstruction: 'Rajzold az O betűt! Kerek kör, nem szabad a lyuk!',
    startX: 50, startY: 12, endX: 50, endY: 12, expectedAngle: 0,
    arrows: [{ x: 88, y: 50, angle: 90 }, { x: 12, y: 50, angle: -90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath(); ctx.arc(p(50), p(50), p(38), 0, Math.PI * 2); ctx.stroke()
    },
  },

  {
    letter: 'C', level: 2,
    ttsInstruction: 'Rajzold a C betűt! Körbe, de hagyj rést jobbra!',
    startX: 77, startY: 23, endX: 77, endY: 77, expectedAngle: -135,
    arrows: [{ x: 22, y: 38, angle: -90 }, { x: 22, y: 62, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.arc(p(50), p(50), p(38), -Math.PI * 0.25, Math.PI * 0.25, true)
      ctx.stroke()
    },
  },

  {
    letter: 'D', level: 2,
    ttsInstruction: 'Rajzold a D betűt! Le, majd körívvel vissza!',
    startX: 28, startY: 12, endX: 28, endY: 88, expectedAngle: 90,
    arrows: [{ x: 28, y: 50, angle: 90 }, { x: 75, y: 50, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(28), p(12)); ctx.lineTo(p(28), p(88))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(28), p(12))
      ctx.bezierCurveTo(p(90), p(12), p(90), p(88), p(28), p(88))
      ctx.stroke()
    },
  },

  {
    letter: 'P', level: 2,
    ttsInstruction: 'Rajzold a P betűt! Le, majd körívvel vissza a közepéig!',
    startX: 25, startY: 12, endX: 25, endY: 88, expectedAngle: 90,
    arrows: [{ x: 25, y: 50, angle: 90 }, { x: 72, y: 31, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(25), p(12))
      ctx.bezierCurveTo(p(85), p(12), p(85), p(54), p(25), p(54))
      ctx.stroke()
    },
  },

  {
    letter: 'B', level: 2,
    ttsInstruction: 'Rajzold a B betűt! Le, majd két kis körív jobbra!',
    startX: 25, startY: 12, endX: 25, endY: 88, expectedAngle: 90,
    arrows: [{ x: 25, y: 30, angle: 90 }, { x: 70, y: 33, angle: 90 }, { x: 72, y: 65, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(25), p(12))
      ctx.bezierCurveTo(p(80), p(12), p(80), p(54), p(25), p(54))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(25), p(54))
      ctx.bezierCurveTo(p(85), p(54), p(85), p(88), p(25), p(88))
      ctx.stroke()
    },
  },

  {
    letter: 'R', level: 2,
    ttsInstruction: 'Rajzold az R betűt! Le, körív fent, majd átlósan le!',
    startX: 25, startY: 12, endX: 78, endY: 88, expectedAngle: 90,
    arrows: [{ x: 25, y: 50, angle: 90 }, { x: 72, y: 31, angle: 90 }, { x: 52, y: 72, angle: 50 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(25), p(12))
      ctx.bezierCurveTo(p(85), p(12), p(85), p(54), p(25), p(54))
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p(25), p(54)); ctx.lineTo(p(78), p(88))
      ctx.stroke()
    },
  },

  // ── Level 3: Bonyolultabb ─────────────────────────────────────────────────

  {
    letter: 'A', level: 3,
    ttsInstruction: 'Rajzold az A betűt! Fel jobbra, le jobbra, kereszt a közepén!',
    startX: 15, startY: 88, endX: 85, endY: 88, expectedAngle: -62,
    arrows: [{ x: 33, y: 50, angle: -62 }, { x: 67, y: 50, angle: 62 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(15), p(88)); ctx.lineTo(p(50), p(12)); ctx.lineTo(p(85), p(88))
      ctx.moveTo(p(28), p(58)); ctx.lineTo(p(72), p(58))
      ctx.stroke()
    },
  },

  {
    letter: 'M', level: 3,
    ttsInstruction: 'Rajzold az M betűt! Fel, csúcsra le, megint fel, le!',
    startX: 18, startY: 88, endX: 82, endY: 88, expectedAngle: -90,
    arrows: [{ x: 18, y: 50, angle: -90 }, { x: 82, y: 50, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(18), p(88)); ctx.lineTo(p(18), p(12))
      ctx.lineTo(p(50), p(55)); ctx.lineTo(p(82), p(12)); ctx.lineTo(p(82), p(88))
      ctx.stroke()
    },
  },

  {
    letter: 'N', level: 3,
    ttsInstruction: 'Rajzold az N betűt! Fel, átlósan le, megint fel!',
    startX: 22, startY: 88, endX: 78, endY: 88, expectedAngle: -90,
    arrows: [{ x: 22, y: 50, angle: -90 }, { x: 78, y: 50, angle: 90 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(22), p(88)); ctx.lineTo(p(22), p(12))
      ctx.lineTo(p(78), p(88)); ctx.lineTo(p(78), p(12))
      ctx.stroke()
    },
  },

  {
    letter: 'K', level: 3,
    ttsInstruction: 'Rajzold a K betűt! Le, fel jobbra, le jobbra!',
    startX: 25, startY: 12, endX: 80, endY: 88, expectedAngle: 90,
    arrows: [{ x: 25, y: 50, angle: 90 }, { x: 55, y: 32, angle: -50 }, { x: 55, y: 68, angle: 50 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(25), p(12)); ctx.lineTo(p(25), p(88))
      ctx.moveTo(p(25), p(50)); ctx.lineTo(p(80), p(12))
      ctx.moveTo(p(25), p(50)); ctx.lineTo(p(80), p(88))
      ctx.stroke()
    },
  },

  {
    letter: 'S', level: 3,
    ttsInstruction: 'Rajzold az S betűt! Körbe balra fent, körbe jobbra lent!',
    startX: 78, startY: 28, endX: 22, endY: 72, expectedAngle: -135,
    arrows: [{ x: 30, y: 35, angle: 180 }, { x: 70, y: 65, angle: 0 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(78), p(28))
      ctx.bezierCurveTo(p(78), p(10), p(22), p(10), p(22), p(35))
      ctx.bezierCurveTo(p(22), p(50), p(78), p(50), p(78), p(65))
      ctx.bezierCurveTo(p(78), p(90), p(22), p(90), p(22), p(72))
      ctx.stroke()
    },
  },

  {
    letter: 'Z', level: 3,
    ttsInstruction: 'Rajzold a Z betűt! Jobbra, átlósan le, jobbra!',
    startX: 18, startY: 12, endX: 82, endY: 88, expectedAngle: 0,
    arrows: [{ x: 50, y: 12, angle: 0 }, { x: 50, y: 50, angle: 135 }, { x: 50, y: 88, angle: 0 }],
    draw(ctx, s) {
      const p = (v: number) => v / 100 * s
      ctx.beginPath()
      ctx.moveTo(p(18), p(12)); ctx.lineTo(p(82), p(12))
      ctx.lineTo(p(18), p(88)); ctx.lineTo(p(82), p(88))
      ctx.stroke()
    },
  },
]

export const LEVEL1_LETTERS = LETTER_DEFS.filter(l => l.level === 1)
export const LEVEL2_LETTERS = LETTER_DEFS.filter(l => l.level === 2)
export const LEVEL3_LETTERS = LETTER_DEFS.filter(l => l.level === 3)
