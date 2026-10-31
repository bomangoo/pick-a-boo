import { PRIZE_STOCK } from './config'

const KEY = 'pickaboo.stock.v1'
const LOG_KEY = 'pickaboo.log.v1'

function safeGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 저장 실패해도 게임은 계속 */
  }
}

export function getStock() {
  const saved = safeGet(KEY)
  const stock = {}
  for (const r of Object.keys(PRIZE_STOCK)) {
    stock[r] = saved && Number.isFinite(saved[r]) ? saved[r] : PRIZE_STOCK[r]
  }
  return stock
}

export function setStock(stock) {
  safeSet(KEY, stock)
}

export function totalLeft(stock = getStock()) {
  return Object.values(stock).reduce((a, b) => a + b, 0)
}

// 남은 수량에 비례해서 등수를 뽑고, 바로 재고에서 뺍니다.
// 상품이 모두 소진되었으면 null.
export function drawPrize(game) {
  const stock = getStock()
  const total = totalLeft(stock)
  if (total <= 0) return null
  let pick = Math.random() * total
  let rank = 5
  for (const r of Object.keys(stock).map(Number).sort((a, b) => a - b)) {
    if (pick < stock[r]) {
      rank = r
      break
    }
    pick -= stock[r]
  }
  stock[rank] -= 1
  setStock(stock)
  const log = safeGet(LOG_KEY) || []
  log.push({ rank, game, at: new Date().toISOString() })
  safeSet(LOG_KEY, log)
  return rank
}

export function getLog() {
  return safeGet(LOG_KEY) || []
}

export function resetAll() {
  setStock({ ...PRIZE_STOCK })
  safeSet(LOG_KEY, [])
}
