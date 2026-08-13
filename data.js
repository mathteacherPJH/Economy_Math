/**
 * ============================================================
 *  경제수학 수업 데이터 (data.js)
 * ============================================================
 *  구조는 3단계입니다.  단원(unit) > 소단원(topic, 사이드바 목차 한 줄)
 *  > 슬라이드(slide, 소단원 안에서 좌우 화살표로 넘기는 PPT 페이지).
 *
 *  새 단원을 추가하려면 CURRICULUM 배열에 객체를 하나 더 추가하고,
 *  그 안의 topics 배열에 소단원을 추가하면 사이드바 목차에 자동으로
 *  반영됩니다. 각 소단원의 slides 배열 안에는 원하는 만큼 PPT 페이지를
 *  넣을 수 있고, 화면 하단 좌우 화살표(또는 키보드/프리젠터)로 그
 *  페이지들 사이를 넘깁니다.
 *
 *  단원(unit) 구조
 *  {
 *    id: '고유값(영문/숫자)',
 *    number: 'Ⅰ',            // 사이드바에 표시될 단원 번호 (로마 숫자)
 *    title: '단원 제목',
 *    topics: [ ...소단원 배열... ]
 *  }
 *
 *  소단원(topic) 구조 — 사이드바 목차에 표시되는 한 줄
 *  {
 *    title: '소단원 제목',
 *    slides: [ ...이 소단원 안에서 넘기는 PPT 슬라이드 배열... ]
 *  }
 *
 *  슬라이드(slide) 종류는 4가지입니다.
 *
 *  1) 표지/구분용 가운데 정렬 타이틀 슬라이드 (본문 없이 큰 제목만)
 *  { type: 'title', title: '슬라이드 제목' }
 *
 *  2) 텍스트 슬라이드 (개념 설명 글)
 *  { type: 'text', title: '슬라이드 제목', body: `여기에 HTML로 긴 글 작성` }
 *
 *  3) 영상 슬라이드 (유튜브 등 임베드)
 *  { type: 'video', title: '슬라이드 제목',
 *    url: 'https://www.youtube.com/embed/영상ID',
 *    caption: '영상 아래 짧은 설명(선택)' }
 *
 *  4) 게임/활동 슬라이드 (직접 만든 HTML/JS 상호작용)
 *  { type: 'game', title: '슬라이드 제목', render: (container) => { ... } }
 *     -> render 함수 안에서 container(div)에 원하는 만큼 자유롭게
 *        DOM을 만들고 이벤트를 붙이면 됩니다.
 *
 *  5) 학습지 페이지 이미지 슬라이드 (스캔/캡처한 페이지를 그대로 삽입)
 *  { type: 'pdfpage', image: '이미지 경로', refWidth: 원본가로px, refHeight: 원본세로px }
 *     -> 화면에서는 카드에 갇히지 않고 페이지 전체가 세로로 늘어나며
 *        브라우저 스크롤로 이어서 봅니다. 빈칸은 화면 상단 "빈칸 추가"
 *        버튼으로 그 자리에 직접 만들어서 타이핑하는 방식이라, data.js에
 *        미리 좌표를 적어둘 필요가 없습니다.
 *
 *  6) 캔바(Canva) 프레젠테이션 통째로 삽입
 *  { type: 'canva', url: '캔바 공유 링크 뒤에 ?embed 를 붙인 주소',
 *    attributionAuthor: '캔바 계정 이름(선택)',
 *    attributionTitle: '디자인 제목(선택)',
 *    attributionUrl: '원본 디자인 링크(선택)' }
 *     -> 캔바에서 만든 슬라이드(클릭으로 답 나타내기, 무선 프리젠터 등)를
 *        화면(카드) 크기에 맞춰 16:9 비율 그대로 보여줍니다. 슬라이드
 *        넘기기·애니메이션은 전부 캔바 자체가 처리하므로, 이 사이트의
 *        좌우 넘기기 버튼이나 빈칸 기능과는 무관합니다. attribution 관련
 *        3개 값을 채우면 캔바 무료 임베드 이용약관에 맞춰 화면 아래에
 *        작은 저작자 표시 링크가 함께 뜹니다(캔바 공식 임베드 코드의
 *        "OOO 님의 디자인 제목" 부분과 같은 역할).
 *
 *  소단원 제목(topic.title)은 화면 좌상단에 작은 글씨(Line1)로 계속 떠
 *  있습니다. 그 아래(Line2)에는 슬라이드의 section 값(학습지의 소제목,
 *  예: '물가지표', '물가 지표의 활용')이 표시되고, section이 바뀌는
 *  슬라이드부터 자동으로 갈아 끼워집니다. 학습지 문장을 그대로 옮길
 *  때는 슬라이드 하나에 문장(또는 빈칸 줄) 하나만 담아서, 학습지의
 *  빈칸 줄 순서와 슬라이드를 넘기는 순서가 똑같이 대응하도록 만듭니다.
 *  큰 표나 그림처럼 원래 학습지에서도 하나로 묶여 있는 덩어리는 예외
 *  적으로 슬라이드 하나에 통째로 담습니다.
 *
 *  text 슬라이드에 big: true를 추가하면 학습지 문장 한 줄을 큰 글씨로
 *  보여주는 스타일이 되고, 생략하면(표/문제 등) 기본 본문 크기로
 *  보여줍니다. label을 추가하면 그 슬라이드 고유의 작은 번호표
 *  (예: 'Q1]', '01')가 본문 위에 따로 표시됩니다.
 *
 *  지금은 각 소단원마다 슬라이드가 1장씩만 들어있는 자리표시자(placeholder)
 *  상태입니다. 한 소단원 안에 슬라이드를 여러 장 추가하고 싶다면 그
 *  topic의 slides 배열에 객체를 더 넣으면 됩니다.
 * ============================================================
 */

function placeholder(title) {
  return `<p>${title}에 대한 개념 설명을 이곳에 작성해 주세요.</p>`;
}

// 소단원 제목 배열을 받아 "슬라이드 1장짜리 소단원" 배열로 바꿔주는 도우미
function textTopics(titles) {
  return titles.map((title) => ({
    title,
    slides: [{ type: 'text', title, body: placeholder(title) }]
  }));
}

const CURRICULUM = [
  {
    id: 'unit-1',
    number: 'Ⅰ',
    title: '수와 경제',
    topics: [
      {
        title: '오리엔테이션',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSIU6dcrc/Xs6AeqxLbO7Z7v0GBCxHkg/view?embed'
          }
        ]
      },

      {
        title: '경제지표 - 물가, 고용',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSHxMDt7M/t2odsdgrJXV3QBW_3VxrXA/view?embed'
          },

          {
            type: 'video',
            label: '소비자 물가지수',
            url: 'https://www.youtube.com/embed/eyiJa2oX2_Q'
          },

          {
            type: 'video',
            label: '생산자 물가지수',
            url: 'https://www.youtube.com/embed/f1UGOZTBGZs'
          },

          {
            type: 'video',
            label: '쉬었음 청년',
            url: 'https://www.youtube.com/embed/Jbv8SVdnS_I'
          },

          {
            type: 'video',
            label: '실업률',
            url: 'https://www.youtube.com/embed/8M8f_66msQg'
          }
        ]
      },

      {
        title: '경제지표 - 주가, GDP',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSIctIDyw/fJwS--dOW_mfzs4Ngf-ZzA/view?embed'
          }
        ]
      },

      ...textTopics([
        '퍼센트와 퍼센트포인트',
        '환율의 계산',
        '환율의 변동',
        '세금의 종류',
        '소득세의 계산',
        '단리와 복리의 원리합계',
        '예금과 적금',
        '현재가치와 연금',
        '1단원 마무리 문제'
      ])
    ]
  },

  {
    id: 'unit-2',
    number: 'Ⅱ',
    title: '함수와 경제',
    topics: textTopics([
      '생산함수와 비용함수',
      '수요함수와 공급함수',
      '효용함수',
      '균형가격의 결정',
      '균형가격의 변화',
      '부등식의 영역',
      '부등식의 영역과 최대 최소의 문제',
      '2단원 마무리 문제'
    ])
  },

  {
    id: 'unit-3',
    number: 'Ⅲ',
    title: '행렬과 경제',
    topics: textTopics([
      '행렬과 경제 현상',
      '행렬의 연산과 경제 현상',
      '역행렬과 역행렬의 계산 1',
      '역행렬과 역행렬의 계산 2',
      '역행렬과 연립일차방정식 1',
      '역행렬과 연립일차방정식 2',
      '3단원 마무리 문제'
    ])
  },

  {
    id: 'unit-4',
    number: 'Ⅳ',
    title: '함수와 경제',
    topics: textTopics([
      '한계',
      '탄력성',
      '최적의 의사결정',
      '최적생산량',
      '4단원 마무리 문제'
    ])
  },

  {
    id: 'unit-5',
    number: 'Ⅴ',
    title: '경제수학 수행평가',
    topics: [
      {
        title: '세후 연봉, 연금 계산 프로그램',
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
    ]
  }
];
