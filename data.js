/**
 * ============================================================
 *  경제수학 수업 데이터 (data.js)
 * ============================================================
 *  새 단원을 추가하려면 CURRICULUM 배열에 객체를 하나 더 추가하면 됩니다.
 *  사이드바 목차는 이 배열을 읽어서 자동으로 만들어집니다.
 *
 *  단원(unit) 구조
 *  {
 *    id: '고유값(영문/숫자)',
 *    number: 'Ⅰ',            // 사이드바에 표시될 단원 번호 (Ⅰ, Ⅱ, Ⅲ... 로마 숫자 사용)
 *    title: '단원 제목',
 *    slides: [ ...슬라이드 배열... ]
 *  }
 *
 *  슬라이드(slide) 종류는 3가지입니다.
 *
 *  1) 텍스트 슬라이드 (개념 설명 글)
 *  { type: 'text', title: '슬라이드 제목', body: `여기에 HTML로 긴 글 작성` }
 *
 *  2) 영상 슬라이드 (유튜브 등 임베드)
 *  { type: 'video', title: '슬라이드 제목',
 *    url: 'https://www.youtube.com/embed/영상ID',
 *    caption: '영상 아래 짧은 설명(선택)' }
 *
 *  3) 게임/활동 슬라이드 (직접 만든 HTML/JS 상호작용)
 *  { type: 'game', title: '슬라이드 제목', render: (container) => { ... } }
 *     -> render 함수 안에서 container(div)에 원하는 만큼 자유롭게
 *        DOM을 만들고 이벤트를 붙이면 됩니다.
 *
 *  아래 슬라이드들의 body는 아직 채워지지 않은 자리표시자(placeholder)입니다.
 *  각 슬라이드를 찾아 body 내용을 실제 개념 설명 글로 바꿔주세요.
 * ============================================================
 */

function placeholder(title) {
  return `<p>${title}에 대한 개념 설명을 이곳에 작성해 주세요.</p>`;
}

const CURRICULUM = [
  {
    id: 'unit-1',
    number: 'Ⅰ',
    title: '수와 경제',
    slides: [
      '오리엔테이션',
      '경제지표 - 물가, 고용',
      '경제지표 - 주가, GDP',
      '퍼센트와 퍼센트포인트',
      '환율의 계산',
      '환율의 변동',
      '세금의 종류',
      '소득세의 계산',
      '단리와 복리의 원리합계',
      '예금과 적금',
      '현재가치와 연금',
      '1단원 마무리 문제'
    ].map((title) => ({ type: 'text', title, body: placeholder(title) }))
  },

  {
    id: 'unit-2',
    number: 'Ⅱ',
    title: '함수와 경제',
    slides: [
      '생산함수와 비용함수',
      '수요함수와 공급함수',
      '효용함수',
      '균형가격의 결정',
      '균형가격의 변화',
      '부등식의 영역',
      '부등식의 영역과 최대 최소의 문제',
      '2단원 마무리 문제'
    ].map((title) => ({ type: 'text', title, body: placeholder(title) }))
  },

  {
    id: 'unit-3',
    number: 'Ⅲ',
    title: '행렬과 경제',
    slides: [
      '행렬과 경제 현상',
      '행렬의 연산과 경제 현상',
      '역행렬과 역행렬의 계산 1',
      '역행렬과 역행렬의 계산 2',
      '역행렬과 연립일차방정식 1',
      '역행렬과 연립일차방정식 2',
      '3단원 마무리 문제'
    ].map((title) => ({ type: 'text', title, body: placeholder(title) }))
  },

  {
    id: 'unit-4',
    number: 'Ⅳ',
    title: '함수와 경제',
    slides: [
      '한계',
      '탄력성',
      '최적의 의사결정',
      '최적생산량'
    ].map((title) => ({ type: 'text', title, body: placeholder(title) }))
  }
];
