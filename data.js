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
      ...textTopics(['오리엔테이션']),

      {
        title: '경제지표 - 물가, 고용',
        slides: [
          { type: 'title', title: '경제지표 - 물가, 고용' },

          {
            type: 'text',
            big: true,
            section: '경제지표',
            body: `<p class="concept-sentence">경제 활동의 분야별 상태 또는 성과를 수나 비율로 나타낸 것</p>`
          },

          {
            type: 'text',
            big: true,
            section: '경제지표',
            body: `<p class="concept-sentence">
              <span class="blank-answer">물가지표</span>,
              <span class="blank-answer">고용지표</span>,
              <span class="blank-answer">GDP</span> 등 ⋯
            </p>`
          },

          {
            type: 'text',
            section: '물가지표',
            body: `
              <table>
                <tr>
                  <th></th>
                  <th><span class="blank-answer">소비자물가지수 (CPI)</span></th>
                  <th><span class="blank-answer">생산자물가지수 (PPI)</span></th>
                </tr>
                <tr>
                  <td>뜻</td>
                  <td>소비자가 생활하기 위해 구매하는 상품과 서비스의 가격 변동을
                  종합적으로 측정하는 지표</td>
                  <td>국내 생산자가 국내 시장에 공급하는 상품과 서비스의 가격 변동을
                  종합적으로 측정하는 지표</td>
                </tr>
                <tr>
                  <td>계산</td>
                  <td colspan="2" style="text-align:center;">
                    $$ \\frac{\\text{비교 시점의 물가}}{\\text{기준 시점의 물가}} \\times 100 $$
                  </td>
                </tr>
              </table>
              <div class="pdf-notes">
                <p>※ <span class="blank-answer">비교 시점의 물가</span> : 올해의 소비자 물가</p>
                <p>※ <span class="blank-answer">기준 시점의 물가</span> : 기준연도의 소비자
                물가로 현재 우리나라 기준연도는 2020년이며, 곧 2025년으로 바뀔 예정임.</p>
                <p>※ 시험문제를 낼 때에는 반드시 기준연도를 문제에 제시해 줄 것이며,
                실제와 다를 수 있음에 유의.</p>
              </div>
            `
          },

          {
            type: 'video',
            section: '물가지표',
            url: 'https://www.youtube.com/embed/eyiJa2oX2_Q'
          },

          {
            type: 'video',
            section: '물가지표',
            url: 'https://www.youtube.com/embed/f1UGOZTBGZs'
          },

          {
            type: 'text',
            section: '개념 확인 문제',
            body: `
              <div class="problem-box">
                <p><strong>[문제]</strong> 기준연도가 2024년 12월의 소비자 물가지수는
                114.91이고, 2025년 12월의 소비자 물가지수는 117.57이다. 이때 전년 동월
                대비 상승률을 계산기를 활용하여 소수 둘째 자리에서 반올림한 값을
                계산하시오.</p>
              </div>
            `
          },

          {
            type: 'text',
            big: true,
            section: '물가 지표의 활용',
            body: `<p class="concept-sentence">
              <span class="blank-answer">임금</span>의 결정 : 물가지수가 높으면
              <span class="blank-answer">임금 인상</span>을 고려하고, 물가지수가
              낮으면 <span class="blank-answer">임금 동결(인하)</span>을 고려한다.
            </p>`
          },

          {
            type: 'text',
            big: true,
            section: '물가 지표의 활용',
            body: `<p class="concept-sentence">
              <span class="blank-answer">실질소득</span>의 계산 : CPI를 보면,
              소비자의 실질적인 소득수준이 얼마인지 대략 파악할 수 있다.
            </p>`
          },

          {
            type: 'text',
            big: true,
            section: '물가 지표의 활용',
            body: `<p class="concept-sentence">
              <span class="blank-answer">임금</span>의 협상 : 실질적인
              소득수준이 얼마인지를 판단하면서 노사 간에 협상을 진행한다.
            </p>`
          },

          {
            type: 'text',
            big: true,
            section: '물가 지표의 활용',
            body: `<p class="concept-sentence">
              <span class="blank-answer">물가</span>의 예측 : PPI의 변동은
              CPI의 변동을 예측하는 선행지표가 된다.
            </p>`
          },

          {
            type: 'video',
            section: '물가 지표의 활용',
            url: 'https://www.youtube.com/embed/8M8f_66msQg'
          },

          {
            type: 'text',
            section: '경제 활동 인구 용어 정리',
            body: `
              <ul>
                <li>총인구
                  <ul>
                    <li><span class="blank-answer">15세 미만</span> 인구</li>
                    <li><span class="blank-answer">15세 이상</span> 인구
                      <ul>
                        <li><span class="blank-answer">경제</span> 활동 인구
                        <em>(일할 생각이 있는 사람)</em>
                          <ul>
                            <li>실업자</li>
                            <li>취업자</li>
                          </ul>
                        </li>
                        <li><span class="blank-answer">비경제</span> 활동 인구
                        <em>(일할 생각이 없는 사람)</em></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            `
          },

          {
            type: 'text',
            section: '경제활동 지표의 계산',
            body: `
              <table>
                <tr><th></th><th>경제 활동 참가율(%)</th><th>실업률(%)</th><th>고용률(%)</th></tr>
                <tr>
                  <td>뜻</td>
                  <td>15세 이상 인구 중 경제 활동 인구의 비율</td>
                  <td>경제 활동 인구 중 실업자의 비율</td>
                  <td>15세 이상 인구 중 취업자의 비율</td>
                </tr>
                <tr>
                  <td>계산</td>
                  <td>$$ \\frac{\\text{경제 활동 인구}}{\\text{15세 이상 인구}} \\times 100 $$</td>
                  <td>$$ \\frac{\\text{실업자 수}}{\\text{경제 활동 인구}} \\times 100 $$</td>
                  <td>$$ \\frac{\\text{취업자 수}}{\\text{15세 이상 인구}} \\times 100 $$</td>
                </tr>
              </table>
              <div class="pdf-notes">
                <p>※ 실업자만 분모가 다름에 유의한다.</p>
              </div>
            `
          },

          {
            type: 'video',
            section: '경제활동 지표의 계산',
            url: 'https://www.youtube.com/embed/Jbv8SVdnS_I'
          },

          {
            type: 'text',
            section: '개념 확인 문제',
            body: `
              <div class="problem-box">
                <p><strong>[문제 1]</strong> 다음에 해당하는 사람은 경제 활동 인구에
                포함되면 O, 그렇지 않으면 X 표시하시오.</p>
                <ol>
                  <li>A : 최근 한 달 동안 여러 기업에 이력서를 제출하였지만, 아직
                  합격하지 못하고 있는 사람 ( &nbsp; )</li>
                  <li>B : 몇 달 전 직장을 그만둔 뒤, 어차피 나이도 많고 취업이 안 될
                  것 같아 구직 활동을 하지 않는 사람 ( &nbsp; )</li>
                  <li>C : 하루에 2시간씩 동네 편의점에서 아르바이트를 하며 용돈을
                  벌고 있는 사람 ( &nbsp; )</li>
                  <li>D : 직장에서 근무하지만, 올해는 어린 아이를 돌보기 위해
                  육아휴직을 쓰고 휴식을 취하고 있는 사람 ( &nbsp; )</li>
                </ol>
                <p><strong>[문제 2]</strong> 아래 표는 A 국가의 경제 활동 인구수이다.
                A 국가의 3월과 4월 경제 활동 참가율, 실업률, 고용률을 각각
                구하시오. (단위: 명)</p>
                <table>
                  <tr><th></th><th>3월</th><th>4월</th></tr>
                  <tr><td>15세 이상 인구수</td><td>120</td><td>120</td></tr>
                  <tr><td>경제 활동 인구수</td><td>100</td><td>90</td></tr>
                  <tr><td>실업자 수</td><td>35</td><td>30</td></tr>
                  <tr><td>취업자 수</td><td>65</td><td>60</td></tr>
                </table>
                <ul>
                  <li>3월 경제 활동 참가율 : </li>
                  <li>3월 실업률 : </li>
                  <li>3월 고용률 : </li>
                  <li>4월 경제 활동 참가율 : </li>
                  <li>4월 실업률 : </li>
                  <li>4월 고용률 : </li>
                </ul>
              </div>
              <div class="pdf-notes">
                <p>※ 우리나라가 아닌 가상의 나라를 제시하더라도 문제 풀 때에는
                교과서에 있는 계산식을 준용하여 풀면 됩니다.</p>
              </div>
            `
          },

          {
            type: 'text',
            section: '2차시 실전 문제',
            label: '01',
            body: `
              <p>다음에 해당하는 용어로 가장 적절한 것은?</p>
              <div class="quote-box">
                <p>도시 가계가 소비하는 대표적인 상품과 서비스의 가격을 조사하여,
                기준 시점의 가격을 100으로 하였을 때 비교 시점의 가격 수준이 얼마나
                변화했는지를 나타낸 지수이다. 통계청이 매월 작성하여 발표하며, 각
                품목이 소비 지출에서 차지하는 가중치를 반영하여 산출한다.</p>
              </div>
              <ul class="choice-list">
                <li>① 생산자 물가지수 (PPI)</li>
                <li>② 소비자 물가지수 (CPI)</li>
                <li>③ 국내 총생산 (GDP)</li>
                <li>④ 국민 총생산 (GNP)</li>
                <li>⑤ 국민 총소득 (GNI)</li>
              </ul>
            `
          },

          {
            type: 'text',
            section: '2차시 실전 문제',
            label: '02',
            body: `
              <p>A 국가의 고용 통계 자료가 다음과 같을 때, A 국가의 실업자 수를
              구하면?</p>
              <table>
                <tr><th>15세 이상 인구수</th><th>경제 활동 참가율</th><th>실업률</th></tr>
                <tr><td>2,000만 명</td><td>70%</td><td>5%</td></tr>
              </table>
              <ul class="choice-list">
                <li>① 50만 명</li>
                <li>② 70만 명</li>
                <li>③ 100만 명</li>
                <li>④ 140만 명</li>
                <li>⑤ 150만 명</li>
              </ul>
            `
          },

          {
            type: 'text',
            section: '2차시 실전 문제',
            label: '03',
            body: `
              <p>다음 표는 가상의 두 국가 A, B의 2026년 상반기 고용 통계 자료이다.
              이에 대한 설명으로 옳은 것만을 모두 고른 것은? (단위: 만 명)</p>
              <table>
                <tr><th>구분</th><th>15세 이상 인구수</th><th>경제 활동 인구수</th><th>취업자 수</th></tr>
                <tr><td>A</td><td>1,000</td><td>700</td><td>630</td></tr>
                <tr><td>B</td><td>1,000</td><td>600</td><td>570</td></tr>
              </table>
              <div class="quote-box">
                <p>ㄱ. A의 비경제 활동 인구수는 370만 명이다.<br/>
                ㄴ. B의 실업자 수는 330만 명이다.<br/>
                ㄷ. A가 B보다 실업률이 높다.</p>
              </div>
              <ul class="choice-list">
                <li>① ㄱ</li>
                <li>② ㄴ</li>
                <li>③ ㄱ, ㄷ</li>
                <li>④ ㄴ, ㄷ</li>
                <li>⑤ ㄱ, ㄴ, ㄷ</li>
              </ul>
            `
          },

          {
            type: 'text',
            section: '2차시 실전 문제',
            label: '04',
            body: `
              <p>다음은 A 국가의 고용 동향 보고서 중 일부를 발췌한 내용이다. 이
              내용을 바탕으로 2026년 5월 A 국가의 고용률을 구하면?</p>
              <div class="quote-box">
                <p>A 국가의 2026년 5월 기준 15세 이상 인구수는 전년 동월 대비 50만
                명 증가한 2,000만 명으로 집계되었다. 이번 달 고용 시장의 가장 큰
                특징은 구직 활동을 일시적으로 중단했던 이들이 대거 노동 시장으로
                진입하면서, 일할 능력과 의사를 갖춘 경제 활동 인구수가 취업자 수보다
                100만 명 더 많아졌다는 점이다.</p>
                <p>한편, 정부 관계자의 발표에 따르면 이번 달 A 국가의 실업률은
                12.5%를 기록하였는데, 이는 신규 창업 열풍으로 인해 취업자 수가
                지난달에 비해 많이 늘어났음에도 불구하고 구직자 수 자체가 더
                가파르게 증가했기 때문으로 분석된다.</p>
              </div>
              <ul class="choice-list">
                <li>① 25%</li>
                <li>② 30%</li>
                <li>③ 35%</li>
                <li>④ 40%</li>
                <li>⑤ 45%</li>
              </ul>
            `
          }
        ]
      },

      ...textTopics([
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
