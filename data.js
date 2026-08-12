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
 * ============================================================
 */

const CURRICULUM = [
  {
    id: 'unit-1',
    number: 'Ⅰ',
    title: '수와 경제',
    slides: [
      {
        type: 'text',
        title: '수요 법칙과 수요함수',
        body: `
          <p><strong>수요(demand)</strong>란 소비자가 일정 기간 동안 어떤 가격에서
          구매하고자 하는 재화의 양을 말합니다. 가격이 오르면 수요량이 줄고,
          가격이 내리면 수요량이 늘어나는 경향을 <strong>수요 법칙</strong>이라
          부릅니다.</p>

          <p>수요량 <em>Q<sub>d</sub></em>과 가격 <em>P</em> 사이의 관계는 대부분
          일차함수 또는 감소함수 형태로 나타낼 수 있습니다.</p>

          <div class="math-box">Q<sub>d</sub> = a &minus; bP&nbsp;&nbsp;(a, b &gt; 0)</div>

          <p>여기서 <em>a</em>는 가격이 0일 때의 최대 수요량, <em>b</em>는 가격
          변화에 대한 수요량의 민감도를 나타내는 기울기입니다. 그래프에서는
          가로축을 수량(Q), 세로축을 가격(P)으로 두는 것이 경제학의 관례이므로
          실제로 그리는 수요곡선은 P에 대해 정리한 식,</p>

          <div class="math-box">P = (a &minus; Q<sub>d</sub>) / b</div>

          <p>을 이용해 우하향하는 직선으로 나타납니다. 이번 단원에서는 이
          함수의 그래프를 직접 그려보고, 가격 변화가 아닌 다른 요인
          (소득, 선호, 관련 재화의 가격 등)이 바뀌었을 때 곡선 자체가
          이동하는 현상과, 곡선 위에서 점이 이동하는 현상을 구분하는
          연습을 진행합니다.</p>

          <p><strong>생각해보기</strong> — 아이스크림 가격이 오르지 않았는데도
          여름이 되면 아이스크림 수요량이 늘어납니다. 이는 수요곡선 위의
          이동일까요, 수요곡선 자체의 이동일까요?</p>
        `
      },
      {
        type: 'text',
        title: '공급 법칙과 시장 균형',
        body: `
          <p><strong>공급(supply)</strong>은 생산자가 일정 기간 동안 특정
          가격에서 판매하고자 하는 재화의 양입니다. 일반적으로 가격이
          오르면 공급량도 늘어나므로 공급함수는 증가함수 형태를 갖습니다.</p>

          <div class="math-box">Q<sub>s</sub> = c + dP&nbsp;&nbsp;(c, d &gt; 0)</div>

          <p>수요곡선과 공급곡선이 만나는 점을 <strong>시장균형점</strong>이라
          하고, 이때의 가격과 수량을 각각 균형가격(P*), 균형거래량(Q*)이라
          부릅니다. 균형점은 다음 연립방정식을 풀어 구합니다.</p>

          <div class="math-box">Q<sub>d</sub> = Q<sub>s</sub></div>

          <p>다음 슬라이드의 영상에서 실제 시장 데이터를 이용해 균형점이
          어떻게 변하는지 살펴보고, 이어지는 활동에서 직접 그래프를
          움직여 균형가격을 맞춰봅니다.</p>
        `
      },
      {
        type: 'video',
        title: '개념 영상 — 시장균형은 왜 안정적일까?',
        url: 'https://www.youtube.com/embed/VIDEO_ID_HERE',
        caption: '영상 URL은 data.js에서 실제 유튜브 영상 ID로 교체하세요.'
      },
      {
        type: 'game',
        title: '활동 — 균형가격 맞추기',
        render(container) {
          const a = 100, b = 2;   // 수요: Qd = a - bP
          const c = 10,  d = 3;   // 공급: Qs = c + dP
          const eqP = (a - c) / (b + d);
          const eqQ = a - b * eqP;

          container.innerHTML = `
            <p class="game-desc">슬라이더를 움직여 수요량과 공급량이 같아지는
            <strong>균형가격</strong>을 직접 찾아보세요.</p>
            <input type="range" id="priceRange" min="0" max="40" step="0.5" value="5" />
            <div class="game-readout">
              <div><span>가격 (P)</span><strong id="pVal">5</strong></div>
              <div><span>수요량 (Qd)</span><strong id="qdVal">-</strong></div>
              <div><span>공급량 (Qs)</span><strong id="qsVal">-</strong></div>
            </div>
            <p id="gameResult" class="game-result">가격을 움직여보세요.</p>
          `;

          const range = container.querySelector('#priceRange');
          const pVal = container.querySelector('#pVal');
          const qdVal = container.querySelector('#qdVal');
          const qsVal = container.querySelector('#qsVal');
          const result = container.querySelector('#gameResult');

          function update() {
            const p = parseFloat(range.value);
            const qd = Math.max(0, a - b * p);
            const qs = Math.max(0, c + d * p);
            pVal.textContent = p.toFixed(1);
            qdVal.textContent = qd.toFixed(1);
            qsVal.textContent = qs.toFixed(1);

            if (Math.abs(qd - qs) < 1) {
              result.textContent = `균형에 가까워요! 실제 균형가격은 P* = ${eqP.toFixed(1)}, 균형거래량은 Q* = ${eqQ.toFixed(1)} 입니다.`;
              result.classList.add('is-correct');
            } else if (qd > qs) {
              result.textContent = '수요량이 공급량보다 많습니다 (초과수요). 가격을 더 올려보세요.';
              result.classList.remove('is-correct');
            } else {
              result.textContent = '공급량이 수요량보다 많습니다 (초과공급). 가격을 더 내려보세요.';
              result.classList.remove('is-correct');
            }
          }

          range.addEventListener('input', update);
          update();
        }
      }
    ]
  },

  {
    id: 'unit-2',
    number: 'Ⅱ',
    title: '함수와 경제',
    slides: [
      {
        type: 'text',
        title: '가격탄력성이란?',
        body: `
          <p><strong>수요의 가격탄력성</strong>은 가격이 1% 변할 때 수요량이
          몇 % 변하는지를 나타내는 지표입니다.</p>

          <div class="math-box">
            E<sub>d</sub> = &minus;(&Delta;Q / Q) &divide; (&Delta;P / P)
          </div>

          <p>|E<sub>d</sub>| &gt; 1 이면 <strong>탄력적</strong>,
          |E<sub>d</sub>| &lt; 1 이면 <strong>비탄력적</strong>이라고 합니다.
          이 단원에서는 함수의 평균변화율과 순간변화율 개념을 이용해
          탄력성을 미분 형태로도 표현해봅니다.</p>
        `
      }
    ]
  },

  {
    id: 'unit-3',
    number: 'Ⅲ',
    title: '행렬과 경제',
    slides: [
      {
        type: 'text',
        title: '손익분기점과 이차함수',
        body: `
          <p>총수입 <em>R(x)</em>과 총비용 <em>C(x)</em>이 같아지는 지점을
          <strong>손익분기점</strong>이라 합니다. 이 단원에서는 이차함수의
          그래프와 판별식을 이용해 손익분기점을 구하는 방법을 다룹니다.</p>
        `
      }
    ]
  },

  {
    id: 'unit-4',
    number: 'Ⅳ',
    title: '함수와 경제',
    slides: [
      {
        type: 'text',
        title: '화폐의 시간가치와 지수함수',
        body: `
          <p>이자율 <em>r</em>로 <em>n</em>년간 복리로 예치했을 때의
          미래가치는 지수함수 <em>FV = PV(1+r)<sup>n</sup></em>로 표현됩니다.
          이 단원에서는 지수함수와 로그함수를 이용해 원리금과 목표 저축
          기간을 계산합니다.</p>
        `
      }
    ]
  }
];
