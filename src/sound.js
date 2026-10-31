// WebAudio 로 만드는 8비트 오르골 사운드. 별도 음원 파일이 필요 없습니다.
let ctx = null
let master = null
let muted = false
let bgmTimer = null

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// 첫 입력 때 오디오를 깨웁니다 (iPad Safari 정책).
if (typeof window !== 'undefined') {
  const wake = () => ensure()
  window.addEventListener('keydown', wake)
  window.addEventListener('pointerdown', wake)
}

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12)
const N = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, B5: 83, C6: 84, E6: 88, G6: 91 }

function tone(freq, start, dur, { type = 'triangle', vol = 0.18, slide = 0 } = {}) {
  const c = ensure()
  if (!c || muted) return
  const t = c.currentTime + start
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function seq(notes, step = 0.1, opts) {
  notes.forEach((n, i) => n && tone(NOTE(N[n] ?? n), i * step, step * 1.6, opts))
}

export const sfx = {
  move: () => tone(NOTE(N.E5), 0, 0.05, { type: 'square', vol: 0.05 }),
  select: () => seq(['C5', 'G5'], 0.06, { type: 'square', vol: 0.07 }),
  confirm: () => seq(['C5', 'E5', 'G5', 'C6'], 0.06, { type: 'square', vol: 0.08 }),
  back: () => seq(['G4', 'C4'], 0.07, { type: 'square', vol: 0.06 }),
  text: () => tone(NOTE(N.A5) + Math.random() * 40, 0, 0.025, { type: 'square', vol: 0.025 }),
  step: () => tone(180 + Math.random() * 40, 0, 0.04, { type: 'triangle', vol: 0.05 }),
  water: () => {
    for (let i = 0; i < 10; i++) tone(900 + Math.random() * 900, i * 0.07, 0.06, { type: 'sine', vol: 0.05, slide: 0.6 })
  },
  grow: (k = 0) => seq([['C5', 'E5', 'G5'][k % 3], ['E5', 'G5', 'C6'][k % 3]], 0.08, { vol: 0.12 }),
  pop: () => tone(300, 0, 0.15, { type: 'sine', vol: 0.2, slide: 3 }),
  whoosh: () => tone(200, 0, 0.6, { type: 'sine', vol: 0.06, slide: 2.5 }),
  heart: () => seq(['E5', 'G5', 'E6'], 0.09, { type: 'sine', vol: 0.12 }),
  shake: () => tone(140, 0, 0.08, { type: 'square', vol: 0.06 }),
  reveal: () => seq(['C5', 'E5', 'G5', 'C6', null, 'G5', 'C6'], 0.09, { vol: 0.16 }),
  fanfare: () => {
    seq(['G4', 'C5', 'E5', 'G5', null, 'E5', 'G5', null, 'C6', 'C6', 'C6', 'E6', 'G6'], 0.1, { type: 'square', vol: 0.09 })
    seq(['C4', null, 'G4', null, 'C5', null, 'G4', null, 'C5', null, 'E5', null, 'C5'], 0.1, { vol: 0.12 })
  },
}

// 잔잔한 오르골 배경음
const MELODY = ['E5', 'G5', 'C6', 'G5', 'A5', 'G5', 'E5', null, 'F5', 'A5', 'C6', 'A5', 'G5', 'E5', 'D5', null,
  'E5', 'G5', 'C6', 'G5', 'A5', 'C6', 'E6', 'D5', 'C6', 'B5', 'A5', 'B5', 'C6', null, null, null]
const BASS = ['C4', 'G4', 'A4', 'E4', 'F4', 'C4', 'G4', 'G4']

export function startBgm() {
  if (bgmTimer) return
  let i = 0
  const step = 0.28
  const tick = () => {
    if (!muted && ctx && ctx.state === 'running') {
      const n = MELODY[i % MELODY.length]
      if (n) tone(NOTE(N[n]), 0, step * 1.8, { type: 'sine', vol: 0.05 })
      if (i % 4 === 0) tone(NOTE(N[BASS[(i / 4) % BASS.length]]) / 2, 0, step * 3.5, { type: 'triangle', vol: 0.05 })
    }
    i++
  }
  bgmTimer = setInterval(tick, step * 1000)
}

export function stopBgm() {
  clearInterval(bgmTimer)
  bgmTimer = null
}

export function setMuted(v) {
  muted = v
  try {
    localStorage.setItem('pickaboo.muted', v ? '1' : '0')
  } catch {
    /* noop */
  }
}
export function isMuted() {
  return muted
}
try {
  muted = localStorage.getItem('pickaboo.muted') === '1'
} catch {
  /* noop */
}
