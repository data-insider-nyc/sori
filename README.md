# 소리 Sori

**The Voice of Korean America**

뉴욕·뉴저지 한인 커뮤니티 & 비즈니스 플랫폼

---

## 빠른 시작

```bash
git clone https://github.com/data-insider-nyc/sori.git
cd sori
cp .env.example .env.local   # Supabase 키 입력
npm install
npm run dev                  # http://localhost:3000
```

---

## 기술 스택

|           |                         |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| Database  | Supabase (PostgreSQL)   |
| Icons     | Lucide React            |
| Deploy    | Vercel                  |

---

## 프로젝트 구조

```
sori/
├── app/
│   ├── page.tsx              # 홈
│   ├── directory/page.tsx    # 비즈니스 디렉토리
│   ├── community/page.tsx    # 커뮤니티 피드
│   └── api/businesses/       # REST API
├── components/
│   ├── layout/               # Header, MobileNav
│   ├── home/                 # HeroCard, CategoryGrid, FeaturedBusinesses ...
│   ├── directory/            # BusinessCard, BusinessSearch, BusinessList ...
│   ├── community/            # PostCard, HotTopics, CreatePostButton
│   └── ui/                   # 공통 UI
├── lib/
│   ├── constants.ts          # 카테고리, 브랜드 상수
│   ├── supabase.ts           # DB 클라이언트
│   └── utils.ts              # 유틸 함수
└── types/index.ts            # 전체 타입 정의
```

---

## 환경 변수

`.env.example`을 복사해서 `.env.local`을 만드세요.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `.env.local`은 `.gitignore`에 포함되어 있습니다. **절대 커밋하지 마세요.**

---

## 개발 로드맵

### Phase 1 — MVP ✅

- [x] 프로젝트 구조 & 타입 시스템
- [x] 비즈니스 디렉토리 UI
- [x] 커뮤니티 피드 UI
- [x] 반응형 레이아웃 (모바일 + 데스크탑)

### Phase 2 — 데이터 연동

- [ ] Supabase DB 연결
- [ ] Supabase Auth (로그인/회원가입)
- [ ] 비즈니스 등록 폼
- [ ] 게시글 CRUD

### Phase 3 — 수익화

- [ ] 광고주 대시보드
- [ ] Stripe 결제 연동
- [ ] 프리미엄 리스팅

### Phase 4 — 성장

- [ ] 채용 보드
- [ ] PWA (홈화면 설치)
- [ ] React Native 앱

---

## 배포 (Vercel)

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
```

---

## 팀

| 역할 | 담당                              |
| ---- | --------------------------------- |
| CEO  | 비즈니스 개발 & 커뮤니티 파트너십 |
| CTO  | 풀스택 개발 & 인프라              |

---

© 2026 Data Insider LLC · [data-insider-nyc](https://github.com/data-insider-nyc)
