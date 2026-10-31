import { useEffect, useRef } from 'react'
import { KEYMAP } from './config'

// 키 코드 → 액션(up/down/left/right/a/b)
const CODE_TO_ACTION = {}
for (const [action, codes] of Object.entries(KEYMAP)) {
  for (const code of codes) CODE_TO_ACTION[code] = action
}

const held = { up: false, down: false, left: false, right: false, a: false, b: false }
const heldSince = {}
const listeners = new Set()
let lastInputAt = performance.now()

function emit(action) {
  lastInputAt = performance.now()
  for (const fn of [...listeners]) fn(action)
}

function onKeyDown(e) {
  const action = CODE_TO_ACTION[e.code]
  if (!action) return
  e.preventDefault()
  if (e.repeat || held[action]) return
  held[action] = true
  heldSince[action] = performance.now()
  emit(action)
}

function onKeyUp(e) {
  const action = CODE_TO_ACTION[e.code]
  if (!action) return
  held[action] = false
  heldSince[action] = null
}

function onBlur() {
  for (const k of Object.keys(held)) {
    held[k] = false
    heldSince[k] = null
  }
}

// 화면 아래 터치 버튼에서 호출합니다. 키보드와 똑같이 동작합니다.
export function pressAction(action) {
  if (held[action]) return
  held[action] = true
  heldSince[action] = performance.now()
  emit(action)
}

export function releaseAction(action) {
  held[action] = false
  heldSince[action] = null
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
}

export const input = {
  held,
  heldFor(action) {
    return heldSince[action] ? performance.now() - heldSince[action] : 0
  },
  idleFor() {
    const anyHeld = Object.values(held).some(Boolean)
    return anyHeld ? 0 : performance.now() - lastInputAt
  },
  axis() {
    let x = (held.right ? 1 : 0) - (held.left ? 1 : 0)
    let y = (held.down ? 1 : 0) - (held.up ? 1 : 0)
    if (x && y) {
      x *= Math.SQRT1_2
      y *= Math.SQRT1_2
    }
    return { x, y }
  },
}

// 버튼 '눌림' 이벤트 구독. handler 는 매 렌더마다 바뀌어도 안전합니다.
export function usePress(handler) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    const fn = (action) => ref.current(action)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
}

// requestAnimationFrame 루프. cb(dt초, 경과ms)
export function useFrame(cb, active = true) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    if (!active) return
    let raf
    let last = performance.now()
    const start = last
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ref.current(dt, now - start)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
}
