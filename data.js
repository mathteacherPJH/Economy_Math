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
          },

          {
            type: 'video',
            label: '세금의 종류2',
            url: 'https://www.youtube.com/embed/LvSDTX84kl4'
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
          },

          {
            type: 'video',
            label: '38사기동대',
            url: 'https://www.youtube.com/embed/pnrJnfpUvRI?start=155'
          },

          {
            type: 'video',
            label: '종합소득세 신고',
            url: 'https://www.youtube.com/embed/5X-7Env4phc?start=1440'
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
            url: 'https://www.canva.com/design/DAHUCfrQjb0/xC3RSxcWE3UtkjkweMkujQ/view?embed'
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
    topics: [
      {
        title: '생산함수와 비용함수',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUfMUWI3o/BSUp-yp3m58_MyfCYhm4QA/view?embed'
          },

          {
            type: 'video',
            label: '은퇴후 치킨집',
            url: 'https://www.youtube.com/embed/jJgXq5gHOhc'
          }
        ]
      },

      {
        title: '수요함수와 공급함수',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUppKmlTA/R_A_8fyP0yRcvNpuO_9Zaw/view?embed'
          },

          {
            type: 'video',
            label: '공급량 조절',
            url: 'https://www.youtube.com/embed/cwjgGi-dSeg'
          }
        ]
      },

      {
        title: '효용함수',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUpsGg8g4/NY62x0Yj7YwsfM1EvIpt9w/view?embed'
          }
        ]
      },

      {
        title: '균형가격의 결정',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUpnVA6D4/udeZ6n92-EQcMP-g8uTr7A/view?embed'
          },
          {
            type: 'video',
            title: '경매 현장',
            label: '경매 현장',
            url: 'https://www.youtube.com/embed/jhKhSjUWZYw?start=95'
          },
          {
            type: 'video',
            title: '다이아몬드',
            label: '다이아몬드',
            url: 'https://www.youtube.com/embed/9VLVXNnNMZM?start=35'
          }
        ]
      },

      {
        title: '균형가격의 변화',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUppRGoFI/xq9BOQVn-gge-m-LaBFxiA/view?embed'
          }
        ]
      },

      {
        title: '부등식의 영역',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUpnJ5BZM/sPy7QuZK4e76EmKrUDPkzw/view?embed'
          }
        ]
      },

      {
        title: '부등식의 영역과 최대 최소의 문제',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUpqDIufk/U1PdAXkezDcKmdEYBauW8Q/view?embed'
          }
        ]
      },

      {
        title: '2단원 마무리 문제',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHUpqFWO68/pUXMklyAW4aiwBM18FiZyg/view?embed'
          }
        ]
      }
    ]
  },

  {
    id: 'unit-3',
    number: 'Ⅲ',
    title: '행렬과 경제',
    topics: [
      {
        title: '행렬의 연산 1',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXwDAHYxo/5juHOw3sHEXvU_BaHNBg4A/view?embed'
          }
        ]
      },
      {
        title: '행렬의 연산 2',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxIseRUc/lHb81LdzJ-mlLDuwQIXHqw/view?embed'
          }
        ]
      },
      {
        title: '역행렬과 역행렬의 계산 1',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxKBD2SA/5cpqOchToaazkfZb0WkTOw/view?embed'
          }
        ]
      },
      {
        title: '역행렬과 역행렬의 계산 2',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxNxEBPE/XYx6exxSxvjex9fpOqOk6Q/view?embed'
          }
        ]
      },
      {
        title: '역행렬과 연립일차방정식 1',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxK_NpEw/EgXvkMddrvrkTPLKsCbtZA/view?embed'
          }
        ]
      },
      {
        title: '역행렬과 연립일차방정식 2',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxLH3Qoc/nGsM89qOh6OYPUV5LT3MoQ/view?embed'
          }
        ]
      },
      {
        title: '3단원 마무리 문제',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHXxMKibJw/rmUOazuewAXop3rCIV5Lxw/view?embed'
          }
        ]
      }
    ]
  },

  {
    id: 'unit-4',
    number: 'Ⅳ',
    title: '함수와 경제',
    topics: [
      {
        title: '한계',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHX9M3e7eA/Di-0ltGDjAgdqevlkRD9wA/view?embed'
          }
        ]
      },
      {
        title: '탄력성',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHX9acFpfE/WtIG7RR8duyoSjjtiQt9Tg/view?embed'
          }
        ]
      },
      {
        title: '최적의 의사결정',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHX9Vs-GAo/UuxjEY_yu-87QawrwiBWww/view?embed'
          }
        ]
      },
      {
        title: '최적생산량',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHX9QrAjQ0/dxZW_omnh25fHtrEb6iz4g/view?embed'
          }
        ]
      },
      {
        title: '4단원 마무리 문제',
        slides: [
          {
            type: 'canva',
            url: 'https://www.canva.com/design/DAHX9eblIwg/q_Ec2BbrNSZVOYbXa1J6kQ/view?embed'
          }
        ]
      }
    ]
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
            title: '자동차 세금 계산기',
            render(container) {
              container.innerHTML = `
                <h2 class="game-title">자동차 세금 계산기</h2>
                <p class="game-title-sub">학습용으로 제작한 프로그램이므로, 실제 계산과 차이가 있을 수 있음.</p>

                <div class="calc-grid">
                  <label>출고가 (원)
                    <input type="number" id="carPriceInput" value="30000000" min="0" step="100000" />
                  </label>
                  <label>배기량 (cc)
                    <input type="number" id="carCcInput" value="1600" min="0" step="50" />
                  </label>
                </div>

                <label class="calc-checkbox-label">
                  <input type="checkbox" id="carLightInput" />
                  경차 여부 (취득세 4% 적용)
                </label>

                <button type="button" id="carCalcBtn" class="calc-btn">계산하기</button>

                <table class="tax-calc-table" id="carCalcTable" style="display:none;">
                  <colgroup>
                    <col style="width:15%;">
                    <col style="width:25%;">
                    <col style="width:42%;">
                    <col style="width:18%;">
                  </colgroup>
                  <thead>
                    <tr><th>세금</th><th>계산식</th><th>계산</th><th>세금 액수</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>개별소비세</td>
                      <td>출고가 × 5%</td>
                      <td id="carCalc1"></td>
                      <td id="carRow1"></td>
                    </tr>
                    <tr>
                      <td>교육세</td>
                      <td>개별소비세 × 30%</td>
                      <td id="carCalc2"></td>
                      <td id="carRow2"></td>
                    </tr>
                    <tr>
                      <td>부가가치세</td>
                      <td>(출고가+개별소비세+교육세) × 10%</td>
                      <td id="carCalc3"></td>
                      <td id="carRow3"></td>
                    </tr>
                    <tr>
                      <td>취득세</td>
                      <td>(출고가+개별소비세+교육세) × 7%(경차 4%)</td>
                      <td id="carCalc4"></td>
                      <td id="carRow4"></td>
                    </tr>
                    <tr>
                      <td>자동차세</td>
                      <td>배기량(cc) × cc당 세액</td>
                      <td id="carCalc5"></td>
                      <td id="carRow5"></td>
                    </tr>
                    <tr>
                      <td>지방교육세</td>
                      <td>자동차세 × 30%</td>
                      <td id="carCalc6"></td>
                      <td id="carRow6"></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="tax-calc-total">
                      <td colspan="3">세금 합계</td>
                      <td id="carRowTotal"></td>
                    </tr>
                  </tfoot>
                </table>
              `;

              // 자동차세는 배기량 구간별로 cc당 세액이 다르다
              // (1,000cc 이하 80원 / 1,600cc 이하 140원 / 초과 200원)
              function ccRate(cc) {
                if (cc <= 1000) return 80;
                if (cc <= 1600) return 140;
                return 200;
              }

              function formatWon(v) {
                return Math.round(v).toLocaleString('ko-KR') + '원';
              }

              const calcBtn = container.querySelector('#carCalcBtn');
              calcBtn.addEventListener('click', () => {
                const price = parseFloat(container.querySelector('#carPriceInput').value) || 0;
                const cc = parseFloat(container.querySelector('#carCcInput').value) || 0;
                const isLight = container.querySelector('#carLightInput').checked;

                const individualTax = price * 0.05; // 개별소비세
                const educationTax = individualTax * 0.3; // 교육세
                const vatBase = price + individualTax + educationTax;
                const vat = vatBase * 0.1; // 부가가치세
                const acquisitionRate = isLight ? 0.04 : 0.07;
                const acquisitionTax = vatBase * acquisitionRate; // 취득세
                const perCc = ccRate(cc);
                const carTax = cc * perCc; // 자동차세
                const localEducationTax = carTax * 0.3; // 지방교육세
                const total = individualTax + educationTax + vat + acquisitionTax + carTax + localEducationTax;

                container.querySelector('#carRow1').textContent = formatWon(individualTax);
                container.querySelector('#carRow2').textContent = formatWon(educationTax);
                container.querySelector('#carRow3').textContent = formatWon(vat);
                container.querySelector('#carRow4').textContent = formatWon(acquisitionTax);
                container.querySelector('#carRow5').textContent = formatWon(carTax);
                container.querySelector('#carRow6').textContent = formatWon(localEducationTax);
                container.querySelector('#carRowTotal').textContent = formatWon(total);

                container.querySelector('#carCalc1').textContent = `${formatWon(price)} × 5%`;
                container.querySelector('#carCalc2').textContent = `${formatWon(individualTax)} × 30%`;
                container.querySelector('#carCalc3').textContent = `${formatWon(vatBase)} × 10%`;
                container.querySelector('#carCalc4').textContent = `${formatWon(vatBase)} × ${Math.round(acquisitionRate * 100)}%${isLight ? ' (경차)' : ''}`;
                container.querySelector('#carCalc5').textContent = `${cc.toLocaleString('ko-KR')}cc × ${perCc}원`;
                container.querySelector('#carCalc6').textContent = `${formatWon(carTax)} × 30%`;

                container.querySelector('#carCalcTable').style.display = '';
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
            render: function renderPension(container) {
  container.classList.add('pension-program');
  const card = container.closest('.slide-card');
  if (card) card.classList.add('slide-card--pension');
  container.innerHTML = `
    <h2 class="game-title">수령 시기에 따른 연금 계산 프로그램</h2>
    <form class="pension-inputs">
      <label for="pensionBase">만 65세 기준 월 연금액 (원)<input id="pensionBase" type="number" min="0" max="1000000000" step="1" value="1000000" required inputmode="numeric"></label>
      <label for="pensionShift">수령 시기<select id="pensionShift"></select></label>
      <button type="submit" class="calc-btn">계산하기</button>
    </form>
    <p class="pension-error" role="alert" hidden></p>
    <div class="pension-results" aria-live="polite">
      <div class="pension-summary">
        <div><span>수령 시작 나이</span><strong data-out="age"></strong></div>
        <div><span>매달 받는 연금</span><strong data-out="monthly"></strong></div>
        <div><span>만 65세 기준과 차이</span><strong data-out="difference"></strong></div>
      </div>
      <p class="pension-formula"></p>
      <div class="pension-table-wrap"><table class="pension-table"><caption>만 60~70세 수령 시기별 비교</caption><thead><tr><th scope="col">수령 시작</th><th scope="col">시기 조정</th><th scope="col">지급률</th><th scope="col">월 수령액</th><th scope="col">월 증감액</th><th scope="col">기준 대비</th></tr></thead><tbody></tbody></table></div>
      <div class="pension-key"><span>조기: 기준액에서 1년당 6% 감소</span><span>연기: 기준액에서 1년당 7.2% 증가</span></div>
    </div>
    <div class="pension-notes">
      <p>국민연금 노령연금 기준이며, 만 65세가 정상 수령 나이인 1969년 이후 출생자를 가정합니다. 조기·연기는 각각 최대 5년이며, 증감률은 복리로 계산하지 않고 정상 수령액에 적용합니다. 조기 감액은 이후에도 계속 적용됩니다.</p>
      <p>부양가족연금액을 제외한 세전 월액을 입력하세요. 연기는 연금 전액을 미루는 것으로 가정합니다. 세금, 물가에 따른 연금액 조정, 추가 가입, 소득에 따른 감액 및 부분 연기는 반영하지 않습니다.</p>
      <p>조기 수령은 가입기간 10년 이상 및 소득 요건 등을 충족해야 합니다. 이 계산기는 수령 자격을 판정하지 않습니다.</p>
      <a href="https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0056M0.do" target="_blank" rel="noopener">국민연금공단 · 노령연금 안내</a>
    </div>`;
  const baseInput = container.querySelector('#pensionBase');
  const select = container.querySelector('#pensionShift');
  const error = container.querySelector('.pension-error');
  const results = container.querySelector('.pension-results');
  const body = container.querySelector('tbody');
  const money = v => Math.round(v).toLocaleString('ko-KR') + '원';
  const signedMoney = v => (v > 0 ? '+' : v < 0 ? '−' : '') + money(Math.abs(v));
  const percent = v => Number(v.toFixed(1)).toLocaleString('ko-KR') + '%';
  const timing = offset => offset < 0 ? Math.abs(offset) + '년 조기' : offset > 0 ? offset + '년 연기' : '정상 수령';
  for (let offset = -5; offset <= 5; offset++) {
    const option = document.createElement('option');
    option.value = offset;
    option.textContent = '만 ' + (65 + offset) + '세 · ' + timing(offset);
    select.appendChild(option);
  }
  select.value = '0';
  function calculate() {
    const raw = baseInput.value.trim();
    const base = Number(raw);
    const selected = Number(select.value);
    if (!raw || !Number.isFinite(base) || !Number.isInteger(base) || base < 0 || base > 1000000000 || !Number.isInteger(selected) || selected < -5 || selected > 5) {
      error.hidden = false;
      error.textContent = '월 연금액은 0~1,000,000,000원의 정수로 입력하세요.';
      results.hidden = true;
      return;
    }
    error.hidden = true;
    results.hidden = false;
    const rows = [];
    for (let offset = -5; offset <= 5; offset++) {
      // Integer percentage tenths: 700 at five years early, 1360 at five years late.
      const rateTenths = 1000 + offset * (offset < 0 ? 60 : 72);
      const amount = Math.round(base * rateTenths / 1000);
      rows.push({ offset, rateTenths, amount, difference: amount - base });
    }
    const chosen = rows.find(row => row.offset === selected);
    container.querySelector('[data-out="age"]').textContent = '만 ' + (65 + selected) + '세';
    container.querySelector('[data-out="monthly"]').textContent = money(chosen.amount);
    container.querySelector('[data-out="difference"]').textContent = signedMoney(chosen.difference);
    const formula = selected < 0
      ? '기준 월액 × (1 − 0.06 × ' + Math.abs(selected) + ')'
      : selected > 0 ? '기준 월액 × (1 + 0.072 × ' + selected + ')' : '기준 월액 × 1';
    container.querySelector('.pension-formula').textContent = formula + ' = ' + money(chosen.amount) + ' · 원 단위 반올림';
    body.replaceChildren();
    for (const row of rows) {
      const tr = document.createElement('tr');
      if (row.offset === 0) tr.classList.add('pension-normal');
      if (row.offset === selected) tr.classList.add('pension-selected');
      const age = document.createElement('th');
      age.scope = 'row';
      age.textContent = '만 ' + (65 + row.offset) + '세' + (row.offset === selected ? ' · 선택' : '');
      tr.appendChild(age);
      const cells = [timing(row.offset), percent(row.rateTenths / 10), money(row.amount), signedMoney(row.difference)];
      for (const value of cells) {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      }
      const td = document.createElement('td');
      const bar = document.createElement('span');
      bar.className = 'pension-bar ' + (row.offset < 0 ? 'pension-early' : row.offset > 0 ? 'pension-late' : '');
      bar.style.width = (row.rateTenths / 1360 * 100) + '%';
      bar.setAttribute('aria-hidden', 'true');
      td.appendChild(bar);
      tr.appendChild(td);
      body.appendChild(tr);
    }
  }
  container.querySelector('form').addEventListener('submit', event => { event.preventDefault(); calculate(); });
  baseInput.addEventListener('input', calculate);
  select.addEventListener('change', calculate);
  calculate();
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
      { label: '[21차시] 행렬의 연산 1', file: 'chapter21exe' },
      { label: '[22차시] 행렬의 연산 2', file: 'chapter22exe' },
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

// 부등식 프로그램을 이 파일에 포함합니다. 별도 HTML이나 programs 폴더가 필요 없습니다.
{
  const inequalityHTML = "<!doctype html>\n<html lang=\"ko\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>부등식 영역 그리기</title>\n<style>\n*{box-sizing:border-box}body{margin:0;background:#f3f5fa;color:#202d44;font:15px 'Malgun Gothic',sans-serif}header{padding:25px 36px;background:#fff;border-bottom:1px solid #e1e6ef}h1{font-size:25px;margin:0 0 7px}header p{margin:0;color:#67748b}main{display:grid;grid-template-columns:350px 1fr;gap:22px;max-width:1400px;margin:25px auto;padding:0 25px}section{background:white;border:1px solid #e0e6f0;border-radius:16px;padding:23px}label{display:block;font-weight:bold;margin:17px 0 8px}select,textarea,input[type=number],input[type=text]{border:1px solid #ccd4e1;border-radius:8px;padding:10px;font:inherit;width:100%;background:white;color:inherit}textarea{font-family:Consolas,monospace;line-height:1.7;resize:vertical;min-height:160px}button{border:0;border-radius:8px;padding:11px 14px;background:#eaf0fa;color:#294778;font:inherit;font-weight:bold;cursor:pointer}button:hover{filter:brightness(.95)}button.primary{background:#315bea;color:white;width:100%;margin-top:12px}.hint{font-size:12px;color:#6d7990;line-height:1.7}.row{display:flex;gap:10px;align-items:center}.row>div{flex:1}.checks label{font-weight:normal;margin:10px 0}.checks input{vertical-align:middle}details{border-top:1px solid #e4e9f1;margin-top:20px;padding-top:15px}summary{cursor:pointer;font-weight:bold}.plot-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.plot-head h2{font-size:18px;margin:0}.badge{font-size:12px;padding:6px 10px;background:#edf2ff;color:#315bea;border-radius:20px}#plot{width:100%;display:block;margin:16px 0;background:#fff;border:1px solid #edf0f5;border-radius:10px}#legend{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;margin:10px 0}.swatch{display:inline-block;width:22px;border-top:2px solid;vertical-align:middle;margin-right:6px}.exports{display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid #e7ecf4;padding-top:18px;margin-top:18px}#error{color:#bc263b;font-size:13px;white-space:pre-wrap;margin-top:10px}#status{font-size:13px;color:#64738a;line-height:1.7}input[type=range]{width:100%}@media(max-width:850px){main{grid-template-columns:1fr;padding:0 12px}header{padding:20px}section{padding:18px}}\n</style>\n<header><h1>부등식 영역 그리기</h1><p>수식을 입력하고, 공통 영역을 그린 뒤 PPT에 넣으세요.</p></header>\n<main><section><label style=\"margin-top:0\" for=\"preset\">18차시 문제 예시</label><select id=\"preset\"></select>\n<label for=\"expr\">부등식 · 한 줄에 하나씩</label><textarea id=\"expr\" spellcheck=\"false\"></textarea>\n<div class=\"hint\">예: 2x + y &lt;= 10, y &gt; x^2 - 1<br>≤, ≥, ², ³도 사용 가능 · 곱셈 기호 생략 가능<br>함수: abs, sqrt, sin, cos · 변수: x, y</div><button id=\"draw\" class=\"primary\">영역 그리기</button><div id=\"error\" role=\"alert\"></div>\n<details open><summary>그래프 표시</summary><div class=\"row\"><div><label for=\"xmin\">x 최솟값</label><input id=\"xmin\" type=\"number\" value=\"-2\"></div><div><label for=\"xmax\">x 최댓값</label><input id=\"xmax\" type=\"number\" value=\"8\"></div></div><div class=\"row\"><div><label for=\"ymin\">y 최솟값</label><input id=\"ymin\" type=\"number\" value=\"-2\"></div><div><label for=\"ymax\">y 최댓값</label><input id=\"ymax\" type=\"number\" value=\"8\"></div></div>\n<div class=\"row\"><div><label for=\"color\">영역 색</label><input id=\"color\" type=\"color\" value=\"#6563db\"></div><div><label for=\"opacity\">농도</label><input id=\"opacity\" type=\"range\" min=\"5\" max=\"60\" value=\"24\"></div></div>\n<div class=\"checks\"><label><input id=\"grid\" type=\"checkbox\" checked> 격자 표시</label><label><input id=\"ticks\" type=\"checkbox\" checked> 축 눈금 숫자 표시</label><label><input id=\"vertices\" type=\"checkbox\" checked> 직선 경계 교점과 좌표 표시</label><label><input id=\"integers\" type=\"checkbox\"> 영역 안의 정수점 표시</label><label><input id=\"transparent\" type=\"checkbox\"> 저장 이미지 배경 투명</label></div></details>\n<details><summary>최대·최소 수업용 이동 직선</summary><label><input id=\"objectiveOn\" type=\"checkbox\"> ax + by = k 표시</label><div class=\"row\"><div><label for=\"a\">a</label><input id=\"a\" type=\"number\" value=\"3\" step=\"any\"></div><div><label for=\"b\">b</label><input id=\"b\" type=\"number\" value=\"2\" step=\"any\"></div></div><label for=\"k\">k = <span id=\"kval\">16</span></label><input id=\"k\" type=\"range\" min=\"-50\" max=\"50\" step=\"0.1\" value=\"16\"><div class=\"hint\">슬라이더로 직선을 이동하여 경계와 만나는 위치를 확인하세요. 최댓값·최솟값의 존재 여부를 자동 판정하지 않습니다.</div></details></section>\n<section><div class=\"plot-head\"><h2 id=\"title\">공통 영역</h2><span class=\"badge\">PPT용 그래프</span></div><canvas id=\"plot\" width=\"1000\" height=\"1000\"></canvas><div id=\"legend\"></div><div id=\"status\"></div><div class=\"exports\"><button id=\"png\">PNG 저장 · 2400px</button><button id=\"svg\">SVG 저장 · 확대 가능</button><button id=\"save\">설정 저장</button><button id=\"load\">설정 불러오기</button><input type=\"file\" id=\"file\" accept=\".json,application/json\" hidden></div><p class=\"hint\">PNG는 PPT의 ‘삽입 → 그림’으로 넣으세요. SVG는 지원되는 PowerPoint에서 선명하게 확대할 수 있습니다.<br>음영은 입력한 모든 부등식을 동시에 만족하는 영역입니다. 곡선은 수치 근사로 그리므로 매우 좁은 영역·불연속 함수는 확대하여 확인하세요.</p></section></main>\n<script>\n'use strict';\nconst $=id=>document.getElementById(id);\nconst presets=[\n ['개념 확인 (1) · 두 직선','y <= -x + 4\\ny >= x - 2',[-2,6,-3,6]],\n ['개념 확인 (2) · 수직 경계','y < x\\nx <= 3',[-3,6,-3,6]],\n ['개념 확인 (3) · 직선과 포물선','y < x + 1\\ny > x^2 - 1',[-3,4,-3,5]],\n ['개념 확인 (4) · 포물선과 수평선','y >= x^2 - 2x\\ny < 3',[-3,5,-3,5]],\n ['최대·최소 문제 1','x >= 0\\ny >= 0\\nx + y <= 6\\n2x + y <= 10',[-2,8,-2,8],[3,2,16]],\n ['최대·최소 문제 2','x >= 0\\ny >= 0\\nx + 2y >= 8\\n3x + y >= 9',[-2,11,-2,11],[1,1,5]],\n ['실전 01','x >= 0\\ny >= 0\\nx + 2y <= 8\\n3x + y <= 9',[-1,6,-1,6],[2,3,13]],\n ['실전 02','x >= 1\\ny >= 1\\nx + y <= 7\\nx - y <= 3\\ny - x <= 3',[-1,7,-1,7],[1,2,12]],\n ['실전 03 · 정수점','x >= 0\\ny >= 0\\nx + y <= 6\\n2x + y <= 10',[-1,7,-1,7],[1,1,6]],\n ['실전 04 · a = 3 예시','x >= 0\\ny >= 0\\nx + y <= 4\\n2x + y <= 6',[-1,5,-1,5],[3,1,9]]\n];\nconst palette=['#355fc5','#b45151','#28846a','#8257ad','#c07b18','#317e9c'];\n// A small expression parser; input never becomes executable JavaScript.\nfunction parseExpression(source){\n const s=source.replace(/\\s/g,'').replace(/²/g,'^2').replace(/³/g,'^3').replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').toLowerCase();\n const tokens=s.match(/(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|[a-z]+|[()+\\-*/^]/g)||[];\n if(tokens.join('')!==s||!s)throw Error('수식에 지원하지 않는 기호가 있습니다.');\n let i=0;const funcs={abs:Math.abs,sqrt:Math.sqrt,sin:Math.sin,cos:Math.cos};\n const constant=v=>({fn:()=>v,lin:[0,0,v]});\n function combine(l,r,op){let lin=null;\n  if(l.lin&&r.lin){const A=l.lin,B=r.lin;\n   if(op==='+'||op==='-')lin=A.map((v,j)=>v+(op==='+'?1:-1)*B[j]);\n   if(op==='*'){if(A[0]===0&&A[1]===0)lin=B.map(v=>v*A[2]);else if(B[0]===0&&B[1]===0)lin=A.map(v=>v*B[2]);}\n   if(op==='/'&&B[0]===0&&B[1]===0&&B[2]!==0)lin=A.map(v=>v/B[2]);\n   if(op==='^'&&B[0]===0&&B[1]===0){if(B[2]===1)lin=A.slice();if(B[2]===0)lin=[0,0,1];}\n  }\n  return {lin,fn:(x,y)=>{const a=l.fn(x,y),b=r.fn(x,y);return op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:op==='/'?a/b:Math.pow(a,b);}};\n }\n function atom(){let t=tokens[i++];if(t==='('){const a=sum();if(tokens[i++]!==')')throw Error('괄호 짝을 확인하세요.');return a;}\n  if(t==='x')return {fn:(x,y)=>x,lin:[1,0,0]};if(t==='y')return {fn:(x,y)=>y,lin:[0,1,0]};if(t==='pi')return constant(Math.PI);\n  if(funcs[t]){if(tokens[i++]!=='(')throw Error('함수는 abs(x)처럼 괄호를 사용하세요.');let a=sum();if(tokens[i++]!==')')throw Error('괄호 짝을 확인하세요.');return {lin:null,fn:(x,y)=>funcs[t](a.fn(x,y))};}\n  if(t!==undefined&&/^\\d|^\\./.test(t))return constant(Number(t));throw Error('x, y와 숫자로 수식을 입력하세요.');\n }\n function power(){let a=atom();if(tokens[i]==='^'){i++;a=combine(a,unary(),'^');}return a;}\n function unary(){if(tokens[i]==='+'){i++;return unary();}if(tokens[i]==='-'){i++;return combine(constant(-1),unary(),'*');}return power();}\n function product(){let a=unary();while(i<tokens.length){let t=tokens[i];if(t==='*'||t==='/'){i++;a=combine(a,unary(),t);}else if(t==='('||/^[a-z]|^\\d|^\\./.test(t)){a=combine(a,unary(),'*');}else break;}return a;}\n function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){let t=tokens[i++];a=combine(a,product(),t);}return a;}\n const result=sum();if(i!==tokens.length)throw Error('수식의 연산자와 괄호를 확인하세요.');return result;\n}\nfunction parseInequality(line){const s=line.replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/＜/g,'<').replace(/＞/g,'>');const m=s.match(/^(.+?)(<=|>=|<|>)(.+)$/);if(!m||/[<>=]/.test(m[1]+m[3]))throw Error('한 줄에 부등식 하나를 입력하세요. 예: x + y <= 6');const a=parseExpression(m[1]),b=parseExpression(m[3]);return {text:line,strict:m[2].length===1,sign:m[2][0]==='<'?1:-1,fn:(x,y)=>a.fn(x,y)-b.fn(x,y),lin:a.lin&&b.lin?a.lin.map((v,i)=>v-b.lin[i]):null};}\nfunction included(c,x,y,tol=0){let v=c.fn(x,y)*c.sign;return Number.isFinite(v)&&(c.strict?v<0:v<=tol);}\nfunction feasible(cs,x,y,tol=0){return cs.every(c=>included(c,x,y,tol));}\nconst fields=['expr','xmin','xmax','ymin','ymax','color','opacity','grid','ticks','vertices','integers','transparent','objectiveOn','a','b','k'];let state=null;\nfunction settings(){const o={};for(const id of fields)o[id]=$(id).type==='checkbox'?$(id).checked:$(id).value;return o;}\nfunction readState(){const s=settings();s.bounds=['xmin','xmax','ymin','ymax'].map(id=>Number(s[id]));if(!s.bounds.every(Number.isFinite)||s.bounds[0]>=s.bounds[1]||s.bounds[2]>=s.bounds[3])throw Error('축 최솟값은 최댓값보다 작아야 합니다.');if(Math.max(...s.bounds.map(Math.abs))>1e6)throw Error('축 범위는 ±1,000,000 안에서 설정하세요.');const lines=s.expr.split(/\\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length||lines.length>12)throw Error('부등식을 1~12개 입력하세요.');s.cs=lines.map((line,i)=>{try{return parseInequality(line);}catch(e){throw Error((i+1)+'번째 줄: '+e.message);}});s.a=Number(s.a);s.b=Number(s.b);s.k=Number(s.k);if(s.objectiveOn&&(![s.a,s.b,s.k].every(Number.isFinite)||(s.a===0&&s.b===0)))throw Error('이동 직선의 a, b 중 하나는 0이 아니어야 합니다.');return s;}\nfunction intersections(cs){const pts=[];for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){let A=cs[i].lin,B=cs[j].lin;if(!A||!B)continue;let d=A[0]*B[1]-B[0]*A[1];if(Math.abs(d)<1e-10)continue;let x=(A[1]*B[2]-B[1]*A[2])/d,y=(A[2]*B[0]-B[2]*A[0])/d;if(cs.every(c=>{let v=c.fn(x,y)*c.sign;return Number.isFinite(v)&&v<=1e-8;})&&!pts.some(p=>Math.hypot(p[0]-x,p[1]-y)<1e-7)){pts.push([x,y,!feasible(cs,x,y,1e-8)]);}}return pts;}\nconst fmt=x=>Math.abs(x)<1e-8?'0':String(Number(x.toFixed(3)));\nfunction tickStep(span){let raw=span/10,base=10**Math.floor(Math.log10(raw));return [1,2,5,10].find(n=>n*base>=raw)*base;}\nfunction graph(s){const W=1000,pad=65,[xmin,xmax,ymin,ymax]=s.bounds;let scale=Math.min((W-2*pad)/(xmax-xmin),(W-2*pad)/(ymax-ymin));const left=(W-scale*(xmax-xmin))/2,top=(W-scale*(ymax-ymin))/2,right=W-left,bottom=W-top;const X=x=>left+(x-xmin)*scale,Y=y=>bottom-(y-ymin)*scale;const invX=u=>xmin+(u-left)/scale,invY=v=>ymin+(bottom-v)/scale;\n let parts=[];const path=(d,color,width=2,dash='',extra='')=>parts.push(`<path d=\"${d}\" fill=\"none\" stroke=\"${color}\" stroke-width=\"${width}\" ${dash?'stroke-dasharray=\"'+dash+'\"':''} ${extra}/>`);\n const text=(x,y,t,size=17,anchor='middle',color='#243149')=>parts.push(`<text x=\"${x}\" y=\"${y}\" text-anchor=\"${anchor}\" font-family=\"Arial,Malgun Gothic,sans-serif\" font-size=\"${size}\" fill=\"${color}\" stroke=\"white\" stroke-width=\"4\" paint-order=\"stroke\">${t}</text>`);\n if(!s.transparent)parts.push('<rect width=\"1000\" height=\"1000\" fill=\"white\"/>');\n parts.push(`<defs><clipPath id=\"area\"><rect x=\"${left}\" y=\"${top}\" width=\"${right-left}\" height=\"${bottom-top}\"/></clipPath></defs><g clip-path=\"url(#area)\">`);\n // Shade all inequalities together. Horizontal runs reduce SVG size.\n const N=650,dx=(right-left)/N,dy=(bottom-top)/N;let count=0,shade=[];\n for(let row=0;row<N;row++){let start=-1,y=invY(top+(row+.5)*dy);for(let col=0;col<=N;col++){const ok=col<N&&feasible(s.cs,invX(left+(col+.5)*dx),y);if(ok){count++;if(start<0)start=col;}else if(start>=0){let x=left+start*dx,yy=top+row*dy;shade.push(`M${x.toFixed(2)} ${yy.toFixed(2)}h${((col-start)*dx+.02).toFixed(2)}v${(dy+.02).toFixed(2)}h-${((col-start)*dx+.02).toFixed(2)}Z`);start=-1;}}}\n parts.push(`<path d=\"${shade.join('')}\" fill=\"${s.color}\" fill-opacity=\"${Number(s.opacity)/100}\"/>`);\n const step=tickStep(Math.max(xmax-xmin,ymax-ymin));\n if(s.grid){for(let x=Math.ceil(xmin/step)*step;x<=xmax+step*1e-8;x+=step)path(`M${X(x)} ${top}V${bottom}`,'#dbe2ee',1);for(let y=Math.ceil(ymin/step)*step;y<=ymax+step*1e-8;y+=step)path(`M${left} ${Y(y)}H${right}`,'#dbe2ee',1);}\n const axisY=Y(0),axisX=X(0);if(ymin<=0&&ymax>=0){path(`M${left} ${axisY}H${right}`,'#243149',2);path(`M${right-10} ${axisY-5}L${right} ${axisY}L${right-10} ${axisY+5}`,'#243149',2);}if(xmin<=0&&xmax>=0){path(`M${axisX} ${bottom}V${top}`,'#243149',2);path(`M${axisX-5} ${top+10}L${axisX} ${top}L${axisX+5} ${top+10}`,'#243149',2);}\n function boundary(c,color,width=2.6){const dash=c.strict?'10 7':'';if(c.lin){const [a,b,k]=c.lin;if(a===0&&b===0)return;if(Math.abs(b)>Math.abs(a)){path(`M${X(xmin)} ${Y(-(a*xmin+k)/b)}L${X(xmax)} ${Y(-(a*xmax+k)/b)}`,color,width,dash);}else{path(`M${X(-(b*ymin+k)/a)} ${Y(ymin)}L${X(-(b*ymax+k)/a)} ${Y(ymax)}`,color,width,dash);}return;}\n  // Marching squares with shared sampled vertices and bisection for contours.\n  const M=260,vals=Array.from({length:M+1},(_,r)=>Array.from({length:M+1},(_,q)=>c.fn(xmin+(xmax-xmin)*q/M,ymax-(ymax-ymin)*r/M)));let d=[];\n  for(let r=0;r<M;r++)for(let q=0;q<M;q++){let p=[[q,r],[q+1,r],[q+1,r+1],[q,r+1]],v=[vals[r][q],vals[r][q+1],vals[r+1][q+1],vals[r+1][q]],hits=[];for(let e=0;e<4;e++){let f=(e+1)%4;if(!Number.isFinite(v[e])||!Number.isFinite(v[f])||(v[e]<0)===(v[f]<0))continue;let lo=0,hi=1,vl=v[e],valid=true;for(let it=0;it<18;it++){let t=(lo+hi)/2,gx=p[e][0]+t*(p[f][0]-p[e][0]),gy=p[e][1]+t*(p[f][1]-p[e][1]),vv=c.fn(xmin+(xmax-xmin)*gx/M,ymax-(ymax-ymin)*gy/M);if(!Number.isFinite(vv)){valid=false;break;}if((vv<0)===(vl<0))lo=t;else hi=t;}let t=(lo+hi)/2,gx=p[e][0]+t*(p[f][0]-p[e][0]),gy=p[e][1]+t*(p[f][1]-p[e][1]);let check=c.fn(xmin+(xmax-xmin)*gx/M,ymax-(ymax-ymin)*gy/M);if(valid&&Math.abs(check)<Math.max(1,Math.abs(v[e]),Math.abs(v[f]))*.001)hits.push([left+gx*(right-left)/M,top+gy*(bottom-top)/M]);}for(let h=0;h+1<hits.length;h+=2)d.push(`M${hits[h][0].toFixed(2)} ${hits[h][1].toFixed(2)}L${hits[h+1][0].toFixed(2)} ${hits[h+1][1].toFixed(2)}`);}\n  // Stitch contour segments so dashes remain continuous across sampled cells.\n  const segments=d.map(seg=>seg.match(/-?\\d+(?:\\.\\d+)?/g).map(Number));const nodes=new Map();const key=p=>p[0].toFixed(2)+','+p[1].toFixed(2);segments.forEach((v,i)=>{for(const p of [[v[0],v[1]],[v[2],v[3]]]){let k=key(p);if(!nodes.has(k))nodes.set(k,[]);nodes.get(k).push(i);}});const used=new Set();let chains=[];\n  function walk(i,start){let cur=start,out=`M${cur[0]} ${cur[1]}`;while(i!==undefined&&!used.has(i)){used.add(i);let v=segments[i],a=[v[0],v[1]],b=[v[2],v[3]];cur=key(cur)===key(a)?b:a;out+=`L${cur[0]} ${cur[1]}`;i=nodes.get(key(cur)).find(n=>!used.has(n));}chains.push(out);}\n  segments.forEach((v,i)=>{if(!used.has(i)){let a=[v[0],v[1]],b=[v[2],v[3]];if(nodes.get(key(a)).length===1)walk(i,a);else if(nodes.get(key(b)).length===1)walk(i,b);}});segments.forEach((v,i)=>{if(!used.has(i))walk(i,[v[0],v[1]]);});path(chains.join(''),color,width,dash);\n }\n s.cs.forEach((c,i)=>boundary(c,palette[i%palette.length]));if(s.objectiveOn)boundary({lin:[s.a,s.b,-s.k],strict:false},'#df8130',3.5);\n let integerCount=0,integerLimit=false;if(s.integers){let total=(Math.floor(xmax)-Math.ceil(xmin)+1)*(Math.floor(ymax)-Math.ceil(ymin)+1);if(total>10000)integerLimit=true;else for(let x=Math.ceil(xmin);x<=xmax;x++)for(let y=Math.ceil(ymin);y<=ymax;y++)if(feasible(s.cs,x,y,1e-10)){integerCount++;parts.push(`<circle cx=\"${X(x)}\" cy=\"${Y(y)}\" r=\"3.5\" fill=\"#243149\"/>`);}}\n let points=intersections(s.cs);if(s.vertices)points.forEach(([x,y,open],i)=>{if(x<xmin||x>xmax||y<ymin||y>ymax)return;parts.push(`<circle cx=\"${X(x)}\" cy=\"${Y(y)}\" r=\"5\" fill=\"${open?'white':'#243149'}\" stroke=\"#243149\" stroke-width=\"2\"/>`);text(X(x)+9,Y(y)+(i%2?-13:25),`(${fmt(x)}, ${fmt(y)})`,16,'start');});\n parts.push('</g>');if(ymin<=0&&ymax>=0)text(right+17,axisY+6,'x',22);if(xmin<=0&&xmax>=0)text(axisX,top-16,'y',22);\n if(s.ticks){let ty=Math.min(bottom+22,Math.max(top+22,axisY+25)),tx=Math.min(right-6,Math.max(left-6,axisX-12));for(let x=Math.ceil(xmin/step)*step;x<=xmax+step*1e-8;x+=step)text(X(x),ty,fmt(x),16);for(let y=Math.ceil(ymin/step)*step;y<=ymax+step*1e-8;y+=step)if(Math.abs(y)>step*1e-8)text(tx,Y(y)+5,fmt(y),16,'end');}\n return {svg:`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1000\" height=\"1000\" viewBox=\"0 0 1000 1000\">${parts.join('')}</svg>`,count,integerCount,integerLimit,points};\n}\nlet currentSVG='',generation=0;\nfunction draw(){try{const s=readState();const result=graph(s);state=s;currentSVG=result.svg;$('error').textContent='';$('title').textContent=presets[Number($('preset').value)]?.[1]===s.expr?presets[Number($('preset').value)][0]:'공통 영역';$('legend').replaceChildren();s.cs.forEach((c,i)=>{let el=document.createElement('span'),sw=document.createElement('i');sw.className='swatch';sw.style.borderColor=palette[i%palette.length];sw.style.borderTopStyle=c.strict?'dashed':'solid';el.append(sw,document.createTextNode(c.text));$('legend').append(el);});$('status').textContent=(result.count?'음영: 모든 조건의 공통 영역.':'현재 화면에서 공통 영역이 검출되지 않았습니다. 축 범위를 넓혀 확인하세요.')+' 실선: 경계 포함 · 점선: 경계 제외.'+(s.vertices?' 교점은 직선 경계만 표시하며, 빈 원은 공통 영역에 포함되지 않는 점입니다.':'')+(s.integers?(result.integerLimit?' 정수점은 후보 10,000개 이하의 범위에서 표시됩니다.':' 화면 안 정수점: '+result.integerCount+'개.'):'');let gen=++generation;svgToCanvas(currentSVG,$('plot'),1000).catch(e=>{if(gen===generation)$('error').textContent=e.message;});$('kval').textContent=fmt(s.k);}catch(e){$('error').textContent=e.message;state=null;currentSVG='';}}\nfunction svgToCanvas(svg,canvas,size){return new Promise((resolve,reject)=>{let img=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));img.onload=()=>{canvas.width=size;canvas.height=size;canvas.getContext('2d').clearRect(0,0,size,size);canvas.getContext('2d').drawImage(img,0,0,size,size);URL.revokeObjectURL(url);resolve(canvas);};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('그래프 이미지 생성에 실패했습니다.'));};img.src=url;});}\nfunction download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);}\n$('draw').onclick=draw;\n$('svg').onclick=()=>{draw();if(currentSVG)download(new Blob([currentSVG],{type:'image/svg+xml'}),'부등식-영역.svg');};\n$('png').onclick=async()=>{draw();if(!currentSVG)return;try{let c=document.createElement('canvas');await svgToCanvas(currentSVG,c,2400);c.toBlob(b=>{if(b)download(b,'부등식-영역.png');else $('error').textContent='PNG 저장에 실패했습니다.';},'image/png');}catch(e){$('error').textContent=e.message;}};\n$('save').onclick=()=>download(new Blob([JSON.stringify({version:1,...settings()},null,2)],{type:'application/json'}),'부등식-설정.json');\n$('load').onclick=()=>$('file').click();$('file').onchange=async()=>{try{const f=$('file').files[0];if(!f)return;if(f.size>100000)throw Error('설정 파일이 너무 큽니다.');const o=JSON.parse(await f.text());for(const id of fields){if(!(id in o))continue;if($(id).type==='checkbox')$(id).checked=o[id]===true;else $(id).value=String(o[id]);}draw();}catch(e){$('error').textContent='설정 파일을 확인하세요: '+e.message;}$('file').value='';};\nfor(const id of fields.filter(id=>id!=='expr'))$(id).addEventListener('change',draw);$('k').addEventListener('input',draw);$('opacity').addEventListener('input',draw);$('expr').addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Enter')draw();});\npresets.forEach((p,i)=>{const opt=document.createElement('option');opt.value=i;opt.textContent=p[0];$('preset').append(opt);});\n$('preset').onchange=()=>{const p=presets[Number($('preset').value)];$('expr').value=p[1];['xmin','xmax','ymin','ymax'].forEach((id,i)=>$(id).value=p[2][i]);$('objectiveOn').checked=false;$('integers').checked=Number($('preset').value)===8;if(p[3])['a','b','k'].forEach((id,i)=>$(id).value=p[3][i]);draw();};$('preset').value='4';$('preset').onchange();\n</script></html>\n";
  const programUnit = CURRICULUM.find((unit) => unit.sidebarHidden);
  if (programUnit && programUnit.topics[0]) {
    programUnit.topics[0].slides.push({
      type: 'game',
      title: '부등식의 영역',
      render(container) {
        const card = container.closest('.slide-card');
        if (card) card.classList.add('slide-card--inequality');
        container.innerHTML = '';
        const toolbar = document.createElement('div');
        toolbar.className = 'inequality-toolbar';
        const title = document.createElement('h2');
        title.textContent = '부등식의 영역';
        const expand = document.createElement('button');
        expand.type = 'button';
        expand.textContent = '전체 화면으로 보기';
        const frame = document.createElement('iframe');
        frame.className = 'inequality-frame';
        frame.title = '부등식의 영역 그리기 프로그램';
        frame.allowFullscreen = true;
        frame.srcdoc = inequalityHTML;
        const notice = document.createElement('span');
        notice.className = 'inequality-fullscreen-notice';
        notice.setAttribute('role', 'status');
        expand.addEventListener('click', async () => {
          try {
            if (!frame.requestFullscreen) throw new Error('unsupported');
            await frame.requestFullscreen();
            notice.textContent = '';
          } catch (error) {
            notice.textContent = '이 브라우저에서는 전체 화면을 사용할 수 없습니다.';
          }
        });
        toolbar.append(title, notice, expand);
        container.append(toolbar, frame);
      }
    });
  }
}
