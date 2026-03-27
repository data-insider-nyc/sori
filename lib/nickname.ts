// Nickname generation: 형용사-고 + 형용사-한/은 + 엔티티(동물 or 인물)
// Rules:
//   ADJECTIVES_GO  ≤ 4 chars (e.g. 귀엽고=3, 다정하고=4)
//   ADJECTIVES_HAN ≤ 3 chars (e.g. 씩씩한=3, 빠른=2)
//   ENTITIES       ≤ 3 chars (e.g. 수달=2, 탐험가=3)
//   Max total = 4+3+3 = 10 chars ✓
// Two adj arrays use different base words to avoid "귀엽고귀여운" combos.

// 형용사 -고 형태 (≤4자)
const ADJECTIVES_GO: string[] = [
  // 3자
  "귀엽고",
  "빠르고",
  "강하고",
  "멋지고",
  "선하고",
  "힘차고",
  "날쌔고",
  // 4자
  "씩씩하고",
  "다정하고",
  "명랑하고",
  "순수하고",
  "총명하고",
  "대담하고",
  "느긋하고",
  "차분하고",
  "상냥하고",
  "깔끔하고",
  "의연하고",
  "조용하고",
  "활기차고",
  "기발하고",
  "포근하고",
  "늠름하고",
  "발랄하고",
  "청량하고",
  "고요하고",
  "우아하고",
  "온화하고",
  "겸손하고",
  "솔직하고",
  "꼼꼼하고",
  "경쾌하고",
  "강인하고",
  "탁월하고",
];

// 형용사 -한/은 형태 (≤3자, ADJECTIVES_GO와 겹치지 않는 단어)
const ADJECTIVES_HAN: string[] = [
  // 2자
  "밝은",
  "따뜻한",
  "세찬",
  "맑은",
  // 3자
  "용감한",
  "현명한",
  "활발한",
  "든든한",
  "뜨거운",
  "시원한",
  "찬란한",
  "산뜻한",
  "재빠른",
  "진실한",
  "당당한",
  "유연한",
  "비범한",
  "독특한",
  "화끈한",
  "묵직한",
  "열렬한",
  "호탕한",
  "눈부신",
  "풍성한",
  "예리한",
  "명석한",
  "활달한",
  "반듯한",
  "날렵한",
  "통쾌한",
];

// 엔티티: 동물 + 인물/역할 명사 (모두 ≤3자)
const ENTITIES: string[] = [
  // 동물 (친숙한 것만)
  "사자",
  "늑대",
  "여우",
  "표범",
  "토끼",
  "고래",
  "상어",
  "오리",
  "기린",
  "판다",
  "수달",
  "까치",
  "펭귄",
  "하마",
  "치타",
  "참새",
  "낙타",
  "순록",
  "호랑이",
  "고양이",
  "강아지",
  "다람쥐",
  "코끼리",
  "코알라",
  "올빼미",
  "두루미",
  "앵무새",
  "독수리",
  "까마귀",
  "너구리",
  "재규어",
  "부엉이",
  "캥거루",
  "얼룩말",
  // 인물·역할 명사
  "전사",
  "기사",
  "용사",
  "영웅",
  "탐험가",
  "모험가",
  "파수꾼",
  "수호자",
  "개척자",
  "선구자",
  "마법사",
  "대장",
  "고수",
];

// export function generateNickname(): string {
//   const go = ADJECTIVES_GO[Math.floor(Math.random() * ADJECTIVES_GO.length)];
//   const han = ADJECTIVES_HAN[Math.floor(Math.random() * ADJECTIVES_HAN.length)];
//   const ent = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
//   return `${go} ${han} ${ent}`;
// }

// 기존 generateNickname() 유지 (display_name용)
// handle 자동 생성 추가

const HANDLE_ADJECTIVES = [
  "happy",
  "sunny",
  "brave",
  "swift",
  "calm",
  "cool",
  "kind",
  "bold",
  "wise",
  "pure",
  "keen",
  "warm",
  "free",
  "true",
  "epic",
  "wild",
];

const HANDLE_NOUNS = [
  "tiger",
  "panda",
  "whale",
  "eagle",
  "fox",
  "wolf",
  "bear",
  "deer",
  "star",
  "moon",
  "sky",
  "sea",
  "wind",
  "fire",
  "snow",
  "leaf",
];

export function generateHandle(seed?: string): string {
  // Google 이메일에서 자동 생성 시도
  if (seed) {
    const base = seed
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 12);
    if (base.length >= 3) return base;
  }
  // 랜덤 생성
  const adj =
    HANDLE_ADJECTIVES[Math.floor(Math.random() * HANDLE_ADJECTIVES.length)];
  const noun = HANDLE_NOUNS[Math.floor(Math.random() * HANDLE_NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

export function generateNickname(): string {
  const go = ADJECTIVES_GO[Math.floor(Math.random() * ADJECTIVES_GO.length)];
  const han = ADJECTIVES_HAN[Math.floor(Math.random() * ADJECTIVES_HAN.length)];
  const ent = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
  return `${go}${han}${ent}`;
}
