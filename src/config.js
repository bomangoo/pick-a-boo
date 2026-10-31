// ─────────────────────────────────────────────
//  현장에서 바꿀 일이 있는 값은 모두 여기에 모았습니다.
// ─────────────────────────────────────────────

export const BRAND = {
  heroName: '루샤',
  brandName: 'LUSHAA',
  tagline: 'cozy days · little joys',
  // TODO: 실제 인스타 주소로 바꿔주세요. QR 코드가 이 주소로 만들어집니다.
  instagramHandle: '@lushaa',
  instagramUrl: 'https://instagram.com/lushaa',
}

// 등수별 상품 수량 (총 84개). 꽝 없이 남은 수량에 비례해서 뽑힙니다.
export const PRIZE_STOCK = { 1: 1, 2: 3, 3: 10, 4: 20, 5: 50 }

// 6개 키 매핑. 현장 키패드에 맞게 KeyboardEvent.code 값을 추가하면 됩니다.
export const KEYMAP = {
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
  a: ['Space', 'Enter', 'NumpadEnter', 'KeyZ', 'KeyJ'],
  b: ['Escape', 'Backspace', 'KeyX', 'KeyK'],
}

// 결과 엽서 화면에서 자동으로 처음 화면으로 돌아가는 시간 (ms)
export const RESULT_TIMEOUT = 60000
// 게임 중 아무 입력이 없을 때 처음 화면으로 돌아가는 시간 (ms)
export const IDLE_TIMEOUT = 45000
// 처음 화면에서 B 를 이만큼 길게 누르면 스태프 메뉴가 열립니다 (ms)
export const STAFF_HOLD = 3000
