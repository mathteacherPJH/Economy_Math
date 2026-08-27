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
            label: '공무원 임금 인상',
            url: 'https://www.youtube.com/embed/q8VAfs8snGw'
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
          },

          {
            type: 'video',
            label: '100년 만기 채권',
            url: 'https://www.youtube.com/embed/wSwQbfzZS1s'
          },

          {
            type: 'video',
            label: '물적분할',
            url: 'https://www.youtube.com/embed/L2fm0kdgp1U'
          },

          {
            type: 'video',
            label: '국내총생산',
            url: 'https://www.youtube.com/embed/lwpdSp1vrqw'
          }
        ]
      },

      {
        title: '퍼센트와 퍼센트포인트',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSQ0SAUrQ/RIE2HKK5OjTaCjnooqr9qQ/view?embed'
          },

          {
            type: 'video',
            label: '문제 출제 오류',
            url: 'https://www.youtube.com/embed/e-5HSzOkTD4'
          },

          {
            type: 'video',
            label: '물가상승률',
            url: 'https://www.youtube.com/embed/bpkkyjdH9OE'
          },

          {
            type: 'video',
            label: '경제성장률',
            url: 'https://www.youtube.com/embed/x24jxlTZHJ0'
          }
        ]
      },

      {
        title: '환율의 계산',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXcszZjw/-0-KElS6_Ong7uvI5ahIEA/view?embed'
          },

          {
            type: 'video',
            label: '공항 환전',
            url: 'https://www.youtube.com/embed/__Xa_RBAzZA?start=1897'
          },

          {
            type: 'video',
            label: '디지털 이민',
            url: 'https://www.youtube.com/embed/HPqqSqt8JKk?start=16'
          }
        ]
      },

      {
        title: '환율의 변동',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXVZBkgY/D5d3B3o9AUv25a-nA8kmjA/view?embed'
          },

          {
            type: 'video',
            label: '환율의 상승',
            url: 'https://www.youtube.com/embed/LmHrihtEPTs'
          },

          {
            type: 'video',
            label: '환율의 하락',
            url: 'https://www.youtube.com/embed/uGHlPcLEsf4'
          },

          {
            type: 'video',
            label: '원유 수입',
            url: 'https://www.youtube.com/embed/eUt75iGilk0'
          },

          {
            type: 'video',
            label: '환율의 영향',
            url: 'https://www.youtube.com/embed/2Tb_odEaJ0Q'
          }
        ]
      },

      {
        title: '세금의 종류',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXUhRoek/FAoOmRPVdnU77-n4rbIJnA/view?embed'
          },

          {
            type: 'video',
            label: '세금의 종류',
            url: 'https://www.youtube.com/embed/QI3bCaB9QZE'
          }
        ]
      },

      {
        title: '소득세의 계산',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXTSqE2c/nAYW9KToO_iAcsMzOcjK1Q/view?embed'
          },

          {
            type: 'video',
            label: '소득세의 종류',
            url: 'https://www.youtube.com/embed/ooNt7avfMnc?start=135'
          }
        ]
      },

      {
        title: '예금의 원리합계',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXclP1EE/qmK5iezug_P5y3bgkhWTFw/view?embed'
          }
        ]
      },

      {
        title: '적금의 원리합계',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXVchhZk/eEFnTCS9_mhtBN6ZE_WYnw/view?embed'
          }
        ]
      },

      {
        title: '현재가치와 연금',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXTLACcQ/CxEYrAkQOGrXTIeHrrcHUA/view?embed'
          }
        ]
      },

      {
        title: '1단원 마무리 문제',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHSXX6b8v0/sS6Dx4aSLowzWEgxLxndGA/view?embed'
          }
        ]
      }
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
    title: '경제수학 프로그램',
    // 사이드바 위쪽의 단원 목록(Ⅰ~Ⅳ)에는 표시하지 않고, 사이드바 맨
    // 아래에 버튼 형태로 따로 보여준다 (script.js의 renderTOC 참고).
    // 이 단원의 topics[0].slides 각각이 "프로그램" 하나씩이고, 우측의
    // "< " 레일을 누르면 (다른 단원의 "관련 영상" 레일 자리에) 이
    // 프로그램 목록이 뜬다 — script.js의 renderVideoRail 참고.
    sidebarHidden: true,
    topics: [
      {
        title: '경제수학 프로그램 모음',
        slides: [
          {
            type: 'game',
            title: '원/달러 환율',
            render(container) {
              container.innerHTML = `
                <h2 class="game-title">원/달러 환율</h2>
                <p class="game-title-sub" id="fxChartSub">최근 90일 추이 — 불러오는 중...</p>
                <div class="fx-chart-wrap">
                  <canvas id="fxChartCanvas"></canvas>
                </div>
              `;

              const subEl = container.querySelector('#fxChartSub');
              const canvas = container.querySelector('#fxChartCanvas');

              // Chart.js는 일반 JS 라이브러리 CDN이라 학교망 등에서
              // 차단될 일이 거의 없다. 이미 불러온 적 있으면 다시 안 부른다.
              function loadChartJs(onReady) {
                if (window.Chart) { onReady(); return; }
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js';
                script.onload = onReady;
                script.onerror = () => { subEl.textContent = '차트 라이브러리를 불러오지 못했습니다.'; };
                document.body.appendChild(script);
              }

              function formatDate(d) {
                return d.toISOString().slice(0, 10);
              }

              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 90);

              // Frankfurter — 유럽중앙은행(ECB)이 공식 발표하는 환율을
              // 그대로 제공하는 무료·오픈소스·키 불필요 API. "거래소"가
              // 아니라 중앙은행 공식 데이터라 학교망에서 차단될 가능성이
              // 거의 없다. 평일 기준 하루 한 번(약 16:00 CET) 갱신된다.
              fetch(`https://api.frankfurter.app/${formatDate(start)}..${formatDate(end)}?from=USD&to=KRW`)
                .then((res) => res.json())
                .then((data) => {
                  const rates = data.rates || {};
                  const dates = Object.keys(rates).sort();
                  const values = dates.map((d) => rates[d].KRW);

                  if (dates.length === 0) {
                    subEl.textContent = '환율 데이터를 가져오지 못했습니다.';
                    return;
                  }

                  const latest = values[values.length - 1];
                  subEl.textContent = `최근 90일 추이 (자료: 유럽중앙은행 ECB) — 현재 1달러 = ${Math.round(latest).toLocaleString('ko-KR')}원`;

                  loadChartJs(() => {
                    new window.Chart(canvas.getContext('2d'), {
                      type: 'line',
                      data: {
                        labels: dates,
                        datasets: [{
                          label: 'USD → KRW',
                          data: values,
                          borderColor: '#111111',
                          backgroundColor: 'rgba(17,17,17,.06)',
                          borderWidth: 1.5,
                          pointRadius: 0,
                          fill: true,
                          tension: .15
                        }]
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { ticks: { maxTicksLimit: 8 } },
                          y: { ticks: { callback: (v) => Math.round(v).toLocaleString('ko-KR') } }
                        }
                      }
                    });
                  });
                })
                .catch(() => {
                  subEl.textContent = '환율 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
                });
            }
          },

          {
            type: 'game',
            title: '간이 소득세 계산기',
            render(container) {
              container.innerHTML = `
                <h2 class="game-title">간이 소득세 계산기</h2>
                <p class="game-title-sub">학습용으로 제작한 프로그램이므로, 실제 계산과 차이가 있을 수 있음.</p>

                <div class="calc-grid">
                  <label>연간 근로소득 (원)
                    <input type="number" id="taxGrossInput" value="50000000" min="0" step="100000" />
                  </label>
                  <label>비과세소득 (원)
                    <input type="number" id="taxNonTaxableInput" value="0" min="0" step="10000" />
                  </label>
                  <label>종합소득공제 (원)
                    <input type="number" id="taxIncomeDeductionInput" value="0" min="0" step="10000" />
                  </label>
                  <label>세액공제 (원)
                    <input type="number" id="taxCreditInput" value="0" min="0" step="10000" />
                  </label>
                </div>

                <button type="button" id="taxCalcBtn" class="calc-btn">계산하기</button>

                <table class="tax-calc-table" id="taxCalcTable" style="display:none;">
                  <colgroup>
                    <col style="width:6%;">
                    <col style="width:10%;">
                    <col style="width:14%;">
                    <col style="width:54%;">
                    <col style="width:16%;">
                  </colgroup>
                  <thead>
                    <tr><th>단계</th><th>계산 과정</th><th>계산 방법</th><th>계산</th><th>금액</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0단계</td>
                      <td>연간 근로소득</td>
                      <td>입력한 값</td>
                      <td id="taxCalc0">—</td>
                      <td id="taxRow0"></td>
                    </tr>
                    <tr>
                      <td>1단계</td>
                      <td>총급여액</td>
                      <td>연간 근로소득 - 비과세소득</td>
                      <td id="taxCalc1"></td>
                      <td id="taxRow1"></td>
                    </tr>
                    <tr>
                      <td>2단계</td>
                      <td>근로소득금액</td>
                      <td>총급여액 - 근로소득공제</td>
                      <td id="taxCalc2"></td>
                      <td id="taxRow2"></td>
                    </tr>
                    <tr>
                      <td>3단계</td>
                      <td>과세표준</td>
                      <td>근로소득금액 - 종합소득공제</td>
                      <td id="taxCalc3"></td>
                      <td id="taxRow3"></td>
                    </tr>
                    <tr>
                      <td>4단계</td>
                      <td>산출세액</td>
                      <td>과세표준 × 세율 - 누진공제액</td>
                      <td id="taxCalc4"></td>
                      <td id="taxRow4"></td>
                    </tr>
                    <tr>
                      <td>5단계</td>
                      <td>결정세액</td>
                      <td>산출세액 - 세액공제</td>
                      <td id="taxCalc5"></td>
                      <td id="taxRow5"></td>
                    </tr>
                    <tr>
                      <td>6단계</td>
                      <td>지방소득세</td>
                      <td>결정세액 × 10%</td>
                      <td id="taxCalc6"></td>
                      <td id="taxRow6"></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="tax-calc-total">
                      <td colspan="4">최종 납부세액 (결정세액 + 지방소득세)</td>
                      <td id="taxRowTotal"></td>
                    </tr>
                  </tfoot>
                </table>

                <div class="tax-ref-grid">
                  <div class="tax-ref-col">
                    <p class="tax-ref-title">[표1] 근로소득공제 계산표</p>
                    <table class="tax-ref-table">
                      <thead>
                        <tr><th>총급여액 구간</th><th>근로소득공제금액</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>500만원 이하</td><td>총급여액의 70%</td></tr>
                        <tr><td>500만원 초과 ~ 1,500만원 이하</td><td>350만원 + (총급여액-500만원)×40%</td></tr>
                        <tr><td>1,500만원 초과 ~ 4,500만원 이하</td><td>750만원 + (총급여액-1,500만원)×15%</td></tr>
                        <tr><td>4,500만원 초과 ~ 1억원 이하</td><td>1,200만원 + (총급여액-4,500만원)×5%</td></tr>
                        <tr><td>1억원 초과</td><td>1,475만원 + (총급여액-1억원)×2%</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="tax-ref-col">
                    <p class="tax-ref-title">[표2] 과세표준에 따른 산출세액 계산표</p>
                    <table class="tax-ref-table tax-ref-table--rate">
                      <colgroup>
                        <col style="width:64%;">
                        <col style="width:15%;">
                        <col style="width:21%;">
                      </colgroup>
                      <thead>
                        <tr><th>과세표준</th><th>세율</th><th>누진공제</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>14,000,000원 이하</td><td>6%</td><td>-</td></tr>
                        <tr><td>14,000,000원 초과 ~ 50,000,000원 이하</td><td>15%</td><td>1,260,000원</td></tr>
                        <tr><td>50,000,000원 초과 ~ 88,000,000원 이하</td><td>24%</td><td>5,760,000원</td></tr>
                        <tr><td>88,000,000원 초과 ~ 150,000,000원 이하</td><td>35%</td><td>15,440,000원</td></tr>
                        <tr><td>150,000,000원 초과 ~ 300,000,000원 이하</td><td>38%</td><td>19,940,000원</td></tr>
                        <tr><td>300,000,000원 초과 ~ 500,000,000원 이하</td><td>40%</td><td>25,940,000원</td></tr>
                        <tr><td>500,000,000원 초과 ~ 1,000,000,000원 이하</td><td>42%</td><td>35,940,000원</td></tr>
                        <tr><td>1,000,000,000원 초과</td><td>45%</td><td>65,940,000원</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              `;

              // [표1] 근로소득공제 계산표 (학습지 3p 기준)
              function earnedIncomeDeduction(total) {
                if (total <= 5000000) return { amount: total * 0.7, note: '총급여액의 70%' };
                if (total <= 15000000) return { amount: 3500000 + (total - 5000000) * 0.4, note: '350만원 + (총급여액-500만원)×40%' };
                if (total <= 45000000) return { amount: 7500000 + (total - 15000000) * 0.15, note: '750만원 + (총급여액-1,500만원)×15%' };
                if (total <= 100000000) return { amount: 12000000 + (total - 45000000) * 0.05, note: '1,200만원 + (총급여액-4,500만원)×5%' };
                return { amount: 14750000 + (total - 100000000) * 0.02, note: '1,475만원 + (총급여액-1억원)×2%' };
              }

              // [표2] 과세표준에 따른 산출세액 계산표 (학습지 3p 기준)
              function taxBracket(base) {
                const brackets = [
                  { upTo: 14000000, rate: 0.06, deduction: 0 },
                  { upTo: 50000000, rate: 0.15, deduction: 1260000 },
                  { upTo: 88000000, rate: 0.24, deduction: 5760000 },
                  { upTo: 150000000, rate: 0.35, deduction: 15440000 },
                  { upTo: 300000000, rate: 0.38, deduction: 19940000 },
                  { upTo: 500000000, rate: 0.40, deduction: 25940000 },
                  { upTo: 1000000000, rate: 0.42, deduction: 35940000 },
                  { upTo: Infinity, rate: 0.45, deduction: 65940000 }
                ];
                return brackets.find((b) => base <= b.upTo) || brackets[brackets.length - 1];
              }

              function formatWon(v) {
                return Math.round(v).toLocaleString('ko-KR') + '원';
              }

              const calcBtn = container.querySelector('#taxCalcBtn');
              calcBtn.addEventListener('click', () => {
                const gross = parseFloat(container.querySelector('#taxGrossInput').value) || 0;
                const nonTaxable = parseFloat(container.querySelector('#taxNonTaxableInput').value) || 0;
                const incomeDeductionInput = parseFloat(container.querySelector('#taxIncomeDeductionInput').value) || 0;
                const taxCreditInput = parseFloat(container.querySelector('#taxCreditInput').value) || 0;

                const step0 = gross;
                const step1 = Math.max(0, gross - nonTaxable);
                const deduction = earnedIncomeDeduction(step1);
                const step2 = Math.max(0, step1 - deduction.amount);
                const step3 = Math.max(0, step2 - incomeDeductionInput);
                const bracket = taxBracket(step3);
                const step4 = Math.max(0, step3 * bracket.rate - bracket.deduction);
                const step5 = Math.max(0, step4 - taxCreditInput);
                const step6 = step5 * 0.1;
                const total = step5 + step6;

                container.querySelector('#taxRow0').textContent = formatWon(step0);
                container.querySelector('#taxRow1').textContent = formatWon(step1);
                container.querySelector('#taxRow2').textContent = formatWon(step2);
                container.querySelector('#taxRow3').textContent = formatWon(step3);
                container.querySelector('#taxRow4').textContent = formatWon(step4);
                container.querySelector('#taxRow5').textContent = formatWon(step5);
                container.querySelector('#taxRow6').textContent = formatWon(step6);
                container.querySelector('#taxRowTotal').textContent = formatWon(total);

                container.querySelector('#taxCalc1').textContent = `${formatWon(gross)} - ${formatWon(nonTaxable)}`;
                container.querySelector('#taxCalc2').textContent = `${formatWon(step1)} - ${formatWon(deduction.amount)} (${deduction.note})`;
                container.querySelector('#taxCalc3').textContent = `${formatWon(step2)} - ${formatWon(incomeDeductionInput)}`;
                container.querySelector('#taxCalc4').textContent = `${formatWon(step3)} × ${Math.round(bracket.rate * 100)}% - ${formatWon(bracket.deduction)}`;
                container.querySelector('#taxCalc5').textContent = `${formatWon(step4)} - ${formatWon(taxCreditInput)}`;
                container.querySelector('#taxCalc6').textContent = `${formatWon(step5)} × 10%`;

                container.querySelector('#taxCalcTable').style.display = '';
              });
            }
          },

          {
            type: 'game',
            title: '연금 계산 프로그램',
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

/**
 * 사이드바 맨 아래 "경제수학 학습지" 버튼을 누르면 보여주는 학습지
 * 목록. 단원별로 묶어서 표시한다. GitHub 저장소 루트의 pdf/ 폴더 안
 * 파일명과 file 값이 정확히 같아야 합니다 (확장자는 .pdf로 가정 —
 * 다르면 알려주세요).
 *
 * { unitTitle: '이 묶음 제목', items: [ { label: '목록에 보일 이름', file: 'pdf/ 폴더 안 파일명(확장자 제외)' }, ... ] }
 */
const WORKSHEETS = [
  {
    unitTitle: '1단원 · 수와 경제',
    items: [
      { label: '[01차시] 오리엔테이션', file: 'chapter01exe' },
      { label: '[02차시] 경제지표 - 물가, 고용', file: 'chapter02exe' },
      { label: '[03차시] 경제지표 - 주가, GDP', file: 'chapter03exe' },
      { label: '[04차시] 퍼센트와 퍼센트포인트', file: 'chapter04exe' },
      { label: '[05차시] 환율의 계산', file: 'chapter05exe' },
      { label: '[06차시] 환율의 변동', file: 'chapter06exe' },
      { label: '[07차시] 세금의 종류', file: 'chapter07exe' },
      { label: '[08차시] 소득세의 계산', file: 'chapter08exe' },
      { label: '[09차시] 예금의 원리합계', file: 'chapter09exe' },
      { label: '[10차시] 적금의 원리합계', file: 'chapter10exe' },
      { label: '[11차시] 현재가치와 연금', file: 'chapter11exe' },
      { label: '[12차시] 1단원 마무리 문제', file: 'chapter12exe' }
    ]
  },
  {
    unitTitle: '2단원 · 함수와 경제',
    items: [
      { label: '[13차시] 생산함수와 비용함수', file: 'chapter13exe' },
      { label: '[14차시] 수요함수와 공급함수', file: 'chapter14exe' },
      { label: '[15차시] 효용함수', file: 'chapter15exe' },
      { label: '[16차시] 균형가격의 결정', file: 'chapter16exe' },
      { label: '[17차시] 균형가격의 변화', file: 'chapter17exe' },
      { label: '[18차시] 부등식의 영역', file: 'chapter18exe' },
      { label: '[19차시] 부등식의 영역과 최대 최소', file: 'chapter19exe' },
      { label: '[20차시] 2단원 마무리 문제', file: 'chapter20exe' }
    ]
  },
  {
    unitTitle: '3단원 · 행렬과 경제',
    items: [
      { label: '[21차시] 행렬과 경제 현상', file: 'chapter21exe' },
      { label: '[22차시] 행렬의 연산과 경제 현상', file: 'chapter22exe' },
      { label: '[23차시] 역행렬과 역행렬의 계산 1', file: 'chapter23exe' },
      { label: '[24차시] 역행렬과 역행렬의 계산 2', file: 'chapter24exe' },
      { label: '[25차시] 역행렬과 연립일차방정식 1', file: 'chapter25exe' },
      { label: '[26차시] 역행렬과 연립일차방정식 2', file: 'chapter26exe' },
      { label: '[27차시] 3단원 마무리 문제', file: 'chapter27exe' }
    ]
  },
  {
    unitTitle: '4단원 · 함수와 경제',
    items: [
      { label: '[28차시] 한계', file: 'chapter28exe' },
      { label: '[29차시] 탄력성', file: 'chapter29exe' },
      { label: '[30차시] 최적의 의사결정', file: 'chapter30exe' },
      { label: '[31차시] 최적생산량', file: 'chapter31exe' },
      { label: '[32차시] 4단원 마무리 문제', file: 'chapter32exe' }
    ]
  }
];
