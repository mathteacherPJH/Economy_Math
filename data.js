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
  },

  {
    id: 'unit-5',
    number: 'Ⅴ',
    title: '경제수학 수행평가',
    slides: [
      {
        type: 'game',
        title: '세후 연봉, 연금 계산 프로그램',
        render(container) {
          container.innerHTML = `
            <p class="game-desc">연봉과 저축 조건을 입력하면 간이 세후 연봉과,
            매년 일정액을 저축했을 때의 은퇴 시점 연금 자산을 계산해줍니다.
            (실제 세율표를 단순화한 학습용 계산이며, 정확한 세액과는 차이가
            있을 수 있습니다.)</p>

            <div class="calc-grid">
              <label>연봉 (만원)
                <input type="number" id="salaryInput" value="4000" min="0" step="100" />
              </label>
              <label>연 저축률 (%)
                <input type="number" id="saveRateInput" value="15" min="0" max="100" step="1" />
              </label>
              <label>연 평균 수익률 (%)
                <input type="number" id="returnRateInput" value="4" min="0" max="20" step="0.5" />
              </label>
              <label>저축 기간 (년)
                <input type="number" id="yearsInput" value="30" min="1" max="60" step="1" />
              </label>
            </div>

            <button type="button" id="calcBtn" class="calc-btn">계산하기</button>

            <div class="game-readout" id="calcResult" style="display:none;">
              <div><span>세후 연봉(추정)</span><strong id="netSalaryVal">-</strong></div>
              <div><span>연간 저축액</span><strong id="yearlySaveVal">-</strong></div>
              <div><span>은퇴 시점 연금 자산</span><strong id="futureValueVal">-</strong></div>
            </div>
            <p id="calcNote" class="game-result" style="display:none;"></p>
          `;

          // 아주 단순화한 누진세 구간 (교육용 예시일 뿐, 실제 소득세법과 다릅니다)
          function estimateTax(grossManwon) {
            const gross = grossManwon * 10000; // 만원 -> 원
            const brackets = [
              { upTo: 12000000, rate: 0.06 },
              { upTo: 46000000, rate: 0.15 },
              { upTo: 88000000, rate: 0.24 },
              { upTo: 150000000, rate: 0.35 },
              { upTo: Infinity, rate: 0.38 }
            ];
            let tax = 0;
            let prevCap = 0;
            for (const b of brackets) {
              if (gross > prevCap) {
                const taxableInBracket = Math.min(gross, b.upTo) - prevCap;
                tax += taxableInBracket * b.rate;
                prevCap = b.upTo;
              } else {
                break;
              }
            }
            return { gross, tax, net: gross - tax };
          }

          function formatWon(v) {
            return Math.round(v).toLocaleString('ko-KR') + '원';
          }

          const calcBtn = container.querySelector('#calcBtn');
          calcBtn.addEventListener('click', () => {
            const salary = parseFloat(container.querySelector('#salaryInput').value) || 0;
            const saveRate = parseFloat(container.querySelector('#saveRateInput').value) || 0;
            const returnRate = parseFloat(container.querySelector('#returnRateInput').value) || 0;
            const years = parseInt(container.querySelector('#yearsInput').value, 10) || 0;

            const { net } = estimateTax(salary);
            const yearlySave = net * (saveRate / 100);

            // 매년 초 yearlySave씩 납입, 연 복리 returnRate로 굴렸을 때의 미래가치
            const r = returnRate / 100;
            let futureValue;
            if (r === 0) {
              futureValue = yearlySave * years;
            } else {
              futureValue = yearlySave * (((Math.pow(1 + r, years) - 1) / r) * (1 + r));
            }

            container.querySelector('#netSalaryVal').textContent = formatWon(net);
            container.querySelector('#yearlySaveVal').textContent = formatWon(yearlySave);
            container.querySelector('#futureValueVal').textContent = formatWon(futureValue);
            container.querySelector('#calcResult').style.display = 'flex';

            const note = container.querySelector('#calcNote');
            note.style.display = 'block';
            note.classList.add('is-correct');
            note.textContent = `${years}년간 매년 ${formatWon(yearlySave)}씩 연 ${returnRate}% 수익률로 저축하면, 은퇴 시점에 약 ${formatWon(futureValue)}을 모을 수 있습니다.`;
          });
        }
      }
    ]
  }
];
