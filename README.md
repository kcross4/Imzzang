# 임짱 IMZZANG SEOUL

기온에 맞는 옷을 큐레이션하는 패션 스토어 데모입니다.

- 기온 슬라이더로 날씨에 맞는 상품 큐레이션 (포인트 색상도 함께 변화)
- 상품 검색, 카테고리 필터, 장바구니, 주문 데모
- 관리자 모드: 상품 등록/수정/삭제, 품절 처리, 주문 상태 관리
  - 화면 맨 아래 "관리자 로그인" 클릭 → 비밀번호 `imzzang1234`

## 인터넷에 올리기 (Vercel, 무료)

1. **GitHub에 올리기**
   - github.com 가입 후 "New repository" 클릭, 이름은 `imzzang-seoul` 등 자유롭게
   - "uploading an existing file" 링크를 눌러 이 폴더 안의 파일들을 드래그해서 업로드
     (`node_modules`, `dist` 폴더가 생겼다면 그건 올리지 마세요)
2. **Vercel에 배포**
   - vercel.com 에서 GitHub 계정으로 가입
   - "Add New → Project" → 방금 만든 저장소 선택 → Deploy 클릭
   - 1~2분 뒤 `https://imzzang-seoul.vercel.app` 형태의 주소가 생깁니다

이후 GitHub에서 파일을 수정하면 Vercel이 자동으로 다시 배포해줍니다.

## 내 컴퓨터에서 실행해보기 (선택)

Node.js(nodejs.org)가 설치되어 있다면:

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속.

## 알아두기

- 데모라서 상품/주문 데이터는 새로고침하면 초기화됩니다 (서버·DB 없음)
- 관리자 비밀번호가 코드에 그대로 있어 실제 보안 기능은 아닙니다
- 실제 판매(결제)를 하려면 PG 연동과 사업자등록·통신판매업 신고가 필요합니다
