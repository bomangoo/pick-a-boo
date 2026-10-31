import { BRAND } from './config'
import { josa } from './components/common'

const hero = BRAND.heroName

export const RANK_CHEER = {
  1: '세상에…! 1등이에요!!',
  2: '우와아, 2등이에요!',
  3: '짝짝짝, 3등이에요!',
  4: '두근두근, 4등 당첨!',
  5: '5등 당첨! 작지만 소중한 선물이에요.',
}

// ───────── 🍓 딸기밭에 물 주기 ─────────
export const STRAWBERRY_GIFTS = {
  1: { name: '황금 딸기 바구니', sprite: 'strawberry-basket', golden: true, h: 170 },
  2: { name: '달콤한 꿀단지', sprite: 'honey-jar', h: 160 },
  3: { name: '새콤달콤 딸기잼', sprite: 'jam-jar', h: 150 },
  4: { name: '작은 꽃 화분', sprite: 'flower-pot', h: 150 },
  5: { name: '빨간 딸기 한 알', sprite: 'strawberry', h: 120 },
}

export const STRAWBERRY_INTRO = [
  { text: `여기는 ${hero}의 작은 딸기밭.` },
  { text: '햇살을 듬뿍 먹고 자란 흙에서는\n가끔… 특별한 선물이 자라난대요.' },
  { text: '오늘 만난 당신에게 줄 선물을\n하나 키워보려고 해요.', speaker: hero, portrait: 'girl-bouquet' },
]

export function strawberryGrowLines(rank) {
  const gift = STRAWBERRY_GIFTS[rank]
  return {
    water: { text: '졸졸졸… 시원한 물을 듬뿍 주었어요.' },
    sprout: { text: '쏘옥…! 새싹이 고개를 내밀었어요.' },
    flower: { text: '하얀 꽃이 피었어요.\n무언가 열리려나 봐요… 두근두근…' },
    reveal: [
      { text: `${RANK_CHEER[rank]}\n${josa(gift.name, '이', '가')} 자라났어요!`, hold: 3200 },
      { text: `이 선물은 당신에게 보낼게요.\n오늘 하루도 달콤하기를!`, speaker: hero, portrait: 'girl-cheer' },
    ],
  }
}

export function strawberryLetter(rank) {
  const gift = STRAWBERRY_GIFTS[rank]
  return {
    from: hero,
    place: `${hero}의 딸기밭`,
    body: `당신을 생각하며 물을 주었더니\n${josa(gift.name, '이', '가')} 자라났어요.\n이 작은 선물이 당신의 하루를\n조금 더 달콤하게 해주면 좋겠어요.`,
  }
}

// ───────── 🎈 열기구 세계여행 ─────────
export const BALLOON_GIFTS = {
  1: { name: '황금 열기구 티켓', ticket: true, h: 150 },
  2: { name: '코스모스 꽃다발', sprite: 'cosmos', h: 200 },
  3: { name: '포근한 목도리', sprite: 'scarf', h: 190 },
  4: { name: '달콤한 꿀단지', sprite: 'honey-jar', h: 160 },
  5: { name: '행운의 도토리', sprite: 'acorn', h: 130 },
}

export const BALLOON_INTRO = [
  { text: `어느 아침, ${hero}에게 편지가 잔뜩 도착했어요.` },
  { text: '세계 곳곳에 사는 친구들이 보낸 편지였죠.\n“보고 싶어! 놀러 와!”' },
  { text: '좋아, 열기구를 타고 떠나볼까?\n누구를 먼저 만나러 갈까…?', speaker: hero, portrait: 'girl-cheer' },
]

// 섬 위치는 1024×768 하늘 지도 기준
export const ISLANDS = [
  {
    id: 'maple',
    name: '단풍 숲 마을',
    en: 'Maple Forest',
    x: 215,
    y: 215,
    friend: { name: '다람이', sprite: 'squirrel', h: 120 },
    heroSprite: 'girl-bouquet',
    greet: ['어? 정말 와줬구나!\n도토리 세다가 깜짝 놀랐잖아!', '가을 내내 모아둔 보물 중에\n제일 좋은 걸 골라놨어. 짠!'],
    letter: '먼 길 와줘서 정말 고마워.\n바스락바스락 낙엽 밟던 오늘을\n오래오래 기억할게.',
  },
  {
    id: 'pumpkin',
    name: '호박등 마을',
    en: 'Pumpkin Town',
    x: 810,
    y: 205,
    friend: { name: '부우', sprite: 'ghost', h: 150 },
    heroSprite: 'girl-witch',
    greet: ['부—! 놀랐지? 히히.\n너무너무 보고 싶었어!', '오늘은 할로윈이니까…\n너를 위해 특별한 걸 준비했지!'],
    letter: '사탕보다 달콤한 건\n친구가 놀러 와주는 거래.\n다음에도 꼭 놀러 와!',
  },
  {
    id: 'snow',
    name: '눈꽃 마을',
    en: 'Snowy Village',
    x: 205,
    y: 560,
    friend: { name: '소복이', snowman: true, h: 140 },
    heroSprite: 'girl-tea',
    greet: ['추운 길 오느라 고생했지?\n내 몸은 차가워도 마음은 따뜻하다구!', '너한테 주려고 눈 속에\n꽁꽁 숨겨둔 선물이 있어.'],
    letter: '하얀 눈이 소복소복 쌓이는 날엔\n네 생각이 나.\n따뜻한 차 한 잔 하며 또 만나자.',
  },
  {
    id: 'windmill',
    name: '풍차 꽃 언덕',
    en: 'Windmill Hill',
    x: 815,
    y: 560,
    friend: { name: '붕붕이', bee: true, h: 90 },
    heroSprite: 'girl-flowerpot',
    greet: ['윙윙~ 꽃바람 타고 잘 왔어!\n바람개비가 돌 때마다 네 생각 했어.', '꽃밭에서 제일 예쁜 걸로\n골라왔어. 받아줄래?'],
    letter: '바람이 불면 그건\n내가 보내는 인사야.\n언제나 너를 응원해!',
  },
]

export function balloonRevealLines(rank, island) {
  const gift = BALLOON_GIFTS[rank]
  return [
    { text: `${RANK_CHEER[rank]}\n${josa(island.friend.name, '이', '가')} ${josa(gift.name, '을', '를')} 선물해 주었어요!`, hold: 3200 },
    { text: '고마워, 정말 소중히 할게!\n먼 곳에서 온 따뜻한 마음을 엽서에 담았어요.', speaker: hero, portrait: 'girl-cheer' },
  ]
}
