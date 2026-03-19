#!/bin/bash
# ─────────────────────────────────────────────
# Sori — GitHub Issues 자동 생성 스크립트
# 실행 전: gh auth login (GitHub CLI 로그인 필요)
# 실행: chmod +x setup-github.sh && ./setup-github.sh
# ─────────────────────────────────────────────

REPO="data-insider-nyc/sori"

echo "🚀 Sori GitHub 셋업 시작..."

# ─── Labels ───────────────────────────────────
echo "\n📌 Labels 생성 중..."

gh label create "feature"  --repo $REPO --color "0075ca" --description "새 기능" --force
gh label create "bug"      --repo $REPO --color "d73a4a" --description "버그" --force
gh label create "data"     --repo $REPO --color "e4e669" --description "스크래핑 / DB" --force
gh label create "revenue"  --repo $REPO --color "2ecc71" --description "수익화" --force
gh label create "infra"    --repo $REPO --color "8b5cf6" --description "배포 / 인프라" --force
gh label create "design"   --repo $REPO --color "f97316" --description "UI / UX" --force

echo "✅ Labels 완료"

# ─── Milestones ───────────────────────────────
echo "\n🗓 Milestones 생성 중..."

gh api repos/$REPO/milestones --method POST \
  --field title="🚀 Phase 1 — Deploy" \
  --field description="Vercel 배포 + Supabase 연동. 목표: 실제 URL 생성" \
  --field due_on="2026-03-28T23:59:59Z"

gh api repos/$REPO/milestones --method POST \
  --field title="📦 Phase 2 — Data" \
  --field description="스크래퍼 + Auth + 비즈니스 CRUD. 목표: DB 200개" \
  --field due_on="2026-04-18T23:59:59Z"

gh api repos/$REPO/milestones --method POST \
  --field title="💰 Phase 3 — Revenue" \
  --field description="광고주 대시보드 + Stripe. 목표: 첫 유료 광고주 1명" \
  --field due_on="2026-05-09T23:59:59Z"

gh api repos/$REPO/milestones --method POST \
  --field title="🎉 Phase 4 — Launch" \
  --field description="공식 론칭. 목표: MAU 100명" \
  --field due_on="2026-05-16T23:59:59Z"

echo "✅ Milestones 완료"

# ─── Issues ───────────────────────────────────
echo "\n📋 Issues 생성 중..."

# Phase 1 — Deploy
gh issue create --repo $REPO \
  --title "Vercel 배포 설정" \
  --label "infra" \
  --milestone "🚀 Phase 1 — Deploy" \
  --body "## 할 일
- [ ] \`npm run build\` 에러 없이 통과 확인
- [ ] Vercel CLI 설치: \`npm i -g vercel\`
- [ ] \`vercel\` 명령어로 첫 배포
- [ ] 환경변수 설정 (NEXT_PUBLIC_SUPABASE_URL 등)
- [ ] sori-app.vercel.app 접속 확인
- [ ] 모바일에서 UI 테스트
- [ ] \`git tag v0.1.0 && git push origin v0.1.0\`"

gh issue create --repo $REPO \
  --title "Supabase 프로젝트 생성 + 스키마 적용" \
  --label "infra,data" \
  --milestone "🚀 Phase 1 — Deploy" \
  --body "## 할 일
- [ ] supabase.com 프로젝트 생성 (무료)
- [ ] SQL Editor에서 스키마 실행 (\`lib/supabase.ts\` 파일 내 SQL 참고)
- [ ] \`.env.local\`에 Supabase URL + Key 입력
- [ ] businesses 테이블에 seed 데이터 5개 수동 입력
- [ ] /directory 페이지에서 실제 DB 데이터 확인"

# Phase 2 — Data
gh issue create --repo $REPO \
  --title "Heykorean 비즈니스 데이터 스크래퍼" \
  --label "data" \
  --milestone "📦 Phase 2 — Data" \
  --body "## 할 일
- [ ] Python 스크래퍼 작성 (requests + BeautifulSoup)
- [ ] 타겟: Fort Lee, Palisades Park, Flushing
- [ ] 카테고리 우선순위: 병원 → 변호사 → 회계사 → 식당
- [ ] Supabase \`businesses\` 테이블에 자동 insert
- [ ] 중복 체크 로직 (upsert)
- [ ] 목표: 비즈니스 200개 이상

## 참고
\`\`\`python
# 기본 구조
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# heykorean.com/business 파싱
# → supabase.table('businesses').upsert(data)
\`\`\`"

gh issue create --repo $REPO \
  --title "Supabase Auth — 이메일 로그인 / 회원가입" \
  --label "feature" \
  --milestone "📦 Phase 2 — Data" \
  --body "## 할 일
- [ ] \`/auth/login\` 페이지
- [ ] \`/auth/signup\` 페이지
- [ ] 로그인 후 Header에 아바타 표시
- [ ] 로그아웃 기능
- [ ] 미들웨어 — 글쓰기/좋아요는 로그인 필수
- [ ] Supabase Auth 이메일 인증 설정"

gh issue create --repo $REPO \
  --title "커뮤니티 게시글 작성 / 수정 / 삭제" \
  --label "feature" \
  --milestone "📦 Phase 2 — Data" \
  --body "## 할 일
- [ ] 글쓰기 모달 (카테고리, 내용, 태그, 위치)
- [ ] POST \`/api/posts\` → Supabase insert
- [ ] 좋아요 실제 DB 반영 (optimistic UI 유지)
- [ ] 댓글 작성 / 삭제
- [ ] 본인 글만 수정 / 삭제 가능 (RLS)
- [ ] 무한스크롤 or 페이지네이션"

gh issue create --repo $REPO \
  --title "비즈니스 상세 페이지 /directory/[id]" \
  --label "feature" \
  --milestone "📦 Phase 2 — Data" \
  --body "## 할 일
- [ ] 기본 정보 (이름, 주소, 전화, 운영시간, 웹사이트)
- [ ] 사진 갤러리
- [ ] 리뷰 리스트 + 별점
- [ ] 리뷰 작성 (로그인 필수, 1인 1리뷰)
- [ ] 전화 / 웹사이트 / 지도 링크
- [ ] SEO 메타데이터 (비즈니스명 + 지역)"

# Phase 3 — Revenue
gh issue create --repo $REPO \
  --title "광고주 대시보드" \
  --label "revenue,feature" \
  --milestone "💰 Phase 3 — Revenue" \
  --body "## 할 일
- [ ] \`/dashboard\` 페이지 (로그인 필수)
- [ ] 내 비즈니스 리스팅 관리
- [ ] 조회수 / 클릭수 / 전화 클릭 차트
- [ ] 플랜 현황 표시 (Basic / Standard / Premium)
- [ ] 플랜 업그레이드 CTA → Stripe 연결
- [ ] 월간 리포트 이메일 발송"

gh issue create --repo $REPO \
  --title "Stripe 결제 연동" \
  --label "revenue" \
  --milestone "💰 Phase 3 — Revenue" \
  --body "## 할 일
- [ ] Stripe 계정 생성 + API Key 설정
- [ ] 3가지 플랜 상품 생성
  - Basic: \$99/월
  - Standard: \$199/월  
  - Premium: \$499/월 (전문직 추천)
- [ ] \`/advertise\` 랜딩 페이지
- [ ] Stripe Checkout 연동
- [ ] Webhook: 결제 완료 → \`is_premium = true\` 자동 업데이트
- [ ] 영수증 이메일 발송"

gh issue create --repo $REPO \
  --title "비즈니스 등록 셀프 폼" \
  --label "feature,revenue" \
  --milestone "💰 Phase 3 — Revenue" \
  --body "## 할 일
- [ ] \`/directory/new\` 페이지
- [ ] 기본 정보 입력 폼
- [ ] 사진 업로드 (Supabase Storage)
- [ ] 제출 후 관리자 승인 대기 상태
- [ ] 승인 후 자동 이메일 알림
- [ ] 무료 Basic 플랜으로 시작 → 유료 업그레이드 유도"

# Phase 4 — Launch
gh issue create --repo $REPO \
  --title "SEO + 퍼포먼스 최적화" \
  --label "infra" \
  --milestone "🎉 Phase 4 — Launch" \
  --body "## 할 일
- [ ] 각 페이지 메타데이터 확인 (title, description)
- [ ] \`sitemap.xml\` 자동 생성
- [ ] \`robots.txt\`
- [ ] \`og:image\` 설정 (SNS 공유 시 썸네일)
- [ ] Lighthouse 점수 90+ 목표
- [ ] 구글 서치콘솔 등록
- [ ] '뉴저지 한인 병원', '포트리 한인 변호사' 키워드 타겟"

gh issue create --repo $REPO \
  --title "론칭 전 초기 콘텐츠 세팅" \
  --label "data" \
  --milestone "🎉 Phase 4 — Launch" \
  --body "## 할 일
- [ ] 커뮤니티 게시글 20개 수동 작성 (자연스럽게)
  - 병원 추천 질문 5개
  - 취업/비자 관련 5개
  - 생활 정보 5개
  - 중고거래 5개
- [ ] Fort Lee, Palisades Park, Flushing 비즈니스 각 20개
- [ ] 비즈니스 리뷰 더미 데이터 (실제 리뷰처럼)

## 론칭 당일 액션
- [ ] Heykorean 커뮤니티 포스팅
- [ ] 미씨USA 포스팅
- [ ] 카카오 한인 단톡방 공유
- [ ] 포트리 / 플러싱 한인회 알림"

echo "\n✅ 모든 Issues 생성 완료!"
echo "\n📊 GitHub Projects (Kanban) 설정:"
echo "→ https://github.com/data-insider-nyc/sori/projects"
echo "→ New project → Board → 컬럼: Backlog / In Progress / Review / Done"
echo "→ 모든 Issues를 Backlog에 드래그"
echo "\n🎉 셋업 완료! 이제 매일 아침 9am 하나씩 꺼내서 시작하세요."
