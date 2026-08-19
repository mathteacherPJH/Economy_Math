(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const collapseBtn = document.getElementById('collapseBtn');
  const brandHomeBtn = document.getElementById('brandHomeBtn');
  const assessmentBtn = document.getElementById('assessmentBtn');
  const worksheetsBtn = document.getElementById('worksheetsBtn');
  const videoRail = document.getElementById('videoRail');
  const videoRailToggle = document.getElementById('videoRailToggle');
  const videoRailTitle = document.getElementById('videoRailTitle');
  const videoRailList = document.getElementById('videoRailList');
  const videoModal = document.getElementById('videoModal');
  const videoModalFrame = document.getElementById('videoModalFrame');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');

  // 현재 선택된 위치: 단원 -> 소단원(목차 한 줄) -> 그 안의 PPT 슬라이드 페이지
  let currentUnitIndex = null;
  let currentTopicIndex = null;
  let currentPageIndex = 0;

  // 영상(type: 'video') 슬라이드는 더 이상 PPT 페이지 순서에 끼워 넣지 않고
  // 우측 "관련 영상" 레일로 따로 빼서 보여준다. 나머지 슬라이드만 정상적인
  // 좌우 넘기기 대상이 된다.
  function getPages(topic) {
    return topic.slides.filter((s) => s.type !== 'video');
  }

  function getTopicVideos(topic) {
    return topic.slides.filter((s) => s.type === 'video');
  }

  /* ---------------- 사이드바(목차) 렌더링 ---------------- */
  function renderTOC() {
    tocEl.innerHTML = '';

    CURRICULUM.forEach((unit, uIdx) => {
      // '경제수학 수행평가'처럼 sidebarHidden으로 표시된 단원은 위쪽
      // 목록에 넣지 않는다 — 사이드바 맨 아래에 버튼으로 따로 보여준다.
      if (unit.sidebarHidden) return;

      const unitEl = document.createElement('div');
      unitEl.className = 'unit';
      unitEl.dataset.unitIndex = uIdx;

      const head = document.createElement('button');
      head.className = 'unit-head';
      head.innerHTML = `
        <span class="unit-num">${unit.number}</span>
        <span class="unit-title">${unit.title}</span>
        <span class="unit-chevron">&#9656;</span>
      `;
      head.addEventListener('click', () => toggleUnit(uIdx));

      const list = document.createElement('ul');
      list.className = 'slide-list';
      unit.topics.forEach((topic, tIdx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerHTML = `<span class="slide-type-dot"></span>${topic.title}`;
        btn.addEventListener('click', () => selectTopic(uIdx, tIdx));
        li.appendChild(btn);
        list.appendChild(li);
      });

      unitEl.appendChild(head);
      unitEl.appendChild(list);
      tocEl.appendChild(unitEl);
    });
  }

  function toggleUnit(uIdx) {
    const unitEl = tocEl.querySelector(`.unit[data-unit-index="${uIdx}"]`);
    if (!unitEl) return;

    if (app.classList.contains('is-collapsed')) {
      // 접힌 상태에서 클릭하면 사이드바를 펼치면서 해당 단원을 연다
      app.classList.remove('is-collapsed');
    }

    // 단원명을 누르면 그 아래 소단원 목록만 펼치고/접고, 오른쪽 화면은
    // 그대로 둔다 (예전에는 첫 소단원을 자동으로 열었지만 이제 안 한다).
    const willOpen = !unitEl.classList.contains('is-open');
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    if (willOpen) {
      unitEl.classList.add('is-open');
    }
  }

  function markActiveInTOC() {
    tocEl.querySelectorAll('.unit').forEach((el, i) => {
      el.classList.toggle('is-active', i === currentUnitIndex);
    });
    tocEl.querySelectorAll('.slide-list button').forEach((btn) => btn.classList.remove('is-active'));
    if (currentUnitIndex !== null) {
      const unitEl = tocEl.querySelector(`.unit[data-unit-index="${currentUnitIndex}"]`);
      const btn = unitEl?.querySelectorAll('.slide-list button')[currentTopicIndex];
      btn?.classList.add('is-active');
    }
  }

  /* ---------------- 소단원 선택 / 렌더 ----------------
     사이드바에서 소단원(목차 한 줄)을 클릭하면 그 소단원을 보여줍니다.
  ------------------------------------------------------------- */
  function selectTopic(uIdx, tIdx) {
    currentUnitIndex = uIdx;
    currentTopicIndex = tIdx;
    currentPageIndex = 0;

    const unitEl = tocEl.querySelector(`.unit[data-unit-index="${uIdx}"]`);
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    unitEl?.classList.add('is-open');

    // 사이드바 맨 아래 버튼(경제수학 프로그램/학습지)의 활성 표시도
    // 여기서 같이 관리한다 — 일반 단원으로 이동하면 둘 다 꺼진다.
    assessmentBtn.classList.toggle('is-active', CURRICULUM[uIdx]?.sidebarHidden === true);
    worksheetsBtn.classList.remove('is-active');

    // 다른 소단원으로 이동할 때만 우측 레일을 접은 상태로 되돌린다.
    // (프로그램 목록 안에서 프로그램만 바꿀 때는 건드리지 않는다 —
    // renderProgramRail 참고)
    videoRail.classList.remove('is-open');
    videoRailToggle.setAttribute('aria-expanded', 'false');

    markActiveInTOC();
    renderStage();
  }

  function renderStage() {
    if (currentUnitIndex === null) {
      // 처음 화면(랜딩)에서는 배경 이미지가 사이드바를 뺀 화면 전체를
      // 꽉 채우도록 한다.
      document.body.classList.add('is-landing');
      stage.innerHTML = emptyStateHTML();
      videoRail.classList.add('is-hidden');
      videoRail.classList.remove('is-open');
      document.body.classList.remove('is-scroll-mode');
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const topic = unit.topics[currentTopicIndex];

    document.body.classList.remove('is-landing');

    // 이 소단원의 관련 영상을 우측 레일에 채우고, 소단원이 바뀔 때마다
    // 레일은 항상 접힌 상태로 되돌린다.
    renderVideoRail(topic);

    // '경제수학 프로그램' 허브 — 아직 프로그램을 하나도 안 고른
    // 상태(currentPageIndex === -1)라면, 처음 화면과 같은 배경 위에
    // 안내 문구만 보여주고 여기서 끝낸다.
    if (unit.sidebarHidden && currentPageIndex === -1) {
      document.body.classList.remove('is-scroll-mode');
      stage.innerHTML = `
        <div class="landing">
          <p class="program-hub-message">오른쪽 사이드바에 사용할 프로그램을 선택해 주세요</p>
        </div>
      `;
      return;
    }

    const pages = getPages(topic);
    const page = pages[currentPageIndex];

    // 학습지 페이지 이미지를 그대로 넣은 슬라이드는 카드 안에 갇히지 않고
    // 페이지 전체가 세로로 늘어나며, 브라우저 스크롤로 이어서 본다.
    document.body.classList.toggle('is-scroll-mode', page.type === 'pdfpage');

    const card = document.createElement('div');
    card.className = 'slide-card';
    if (page.type === 'canva') card.classList.add('slide-card--flush');
    const inner = document.createElement('div');
    inner.className = 'slide-inner';
    card.appendChild(inner);

    // inner를 먼저 실제 문서(stage)에 붙여둔 다음 내용을 채운다 — 'game'
    // 타입 프로그램(예: TradingView 위젯)이 자기 컨테이너를
    // document.getElementById로 찾아야 하는 경우가 있는데, DOM에
    // 붙기 전에 render()를 호출하면 그 시점엔 아직 문서 안에 없어서
    // 찾지 못하는 문제가 있었다.
    stage.innerHTML = '';
    stage.appendChild(card);

    if (page.type === 'title') {
      inner.classList.add('slide-inner--center');
      if (page.eyebrow) {
        const eyebrowEl = document.createElement('p');
        eyebrowEl.className = 'title-slide-eyebrow';
        eyebrowEl.textContent = page.eyebrow;
        inner.appendChild(eyebrowEl);
      }
      const heading = document.createElement('h1');
      heading.className = 'title-slide-heading';
      heading.textContent = page.title;
      inner.appendChild(heading);
    } else {
      // 좌상단 고정 헤더 (학습지 소제목 등)
      if (page.type !== 'pdfpage' && page.section) {
        const kickerGroup = document.createElement('div');
        kickerGroup.className = 'slide-kicker-group';
        const sectionEl = document.createElement('p');
        sectionEl.className = 'section-kicker';
        sectionEl.textContent = page.section;
        kickerGroup.appendChild(sectionEl);
        inner.appendChild(kickerGroup);
      }

      if (page.label) {
        const labelEl = document.createElement('p');
        labelEl.className = 'item-label';
        labelEl.textContent = page.label;
        inner.appendChild(labelEl);
      }

      if (page.type === 'text') {
        const body = document.createElement('div');
        body.className = page.big ? 'concept-sentence-wrap' : 'slide-body';
        body.innerHTML = page.body;
        inner.appendChild(body);
      } else if (page.type === 'video') {
        const wrap = document.createElement('div');
        wrap.className = 'video-wrap';
        wrap.innerHTML = `<iframe src="${page.url}" title="${page.section || '영상'}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        inner.appendChild(wrap);
        if (page.caption) {
          const cap = document.createElement('p');
          cap.className = 'video-caption';
          cap.textContent = page.caption;
          inner.appendChild(cap);
        }
      } else if (page.type === 'game') {
        const gameArea = document.createElement('div');
        gameArea.className = 'game-area';
        inner.appendChild(gameArea);
        if (typeof page.render === 'function') {
          page.render(gameArea);
        }
      } else if (page.type === 'pdfpage') {
        inner.classList.add('slide-inner--full');
        const wrap = document.createElement('div');
        wrap.className = 'pdf-page-wrap';

        const img = document.createElement('img');
        img.className = 'pdf-page-img';
        img.src = page.image;
        img.alt = page.section || '학습지 페이지';
        wrap.appendChild(img);

        inner.appendChild(wrap);
      } else if (page.type === 'canva') {
        inner.classList.add('slide-inner--full');
        const wrap = document.createElement('div');
        wrap.className = 'canva-embed-wrap';
        wrap.innerHTML = `<iframe src="${page.url}" allow="fullscreen" allowfullscreen loading="lazy" title="캔바 프레젠테이션"></iframe>`;
        inner.appendChild(wrap);

        // 캔바 무료 임베드 이용약관에 맞춘 저작자 표시 (캔바 공식 임베드
        // 코드에 딸려오는 "OOO 님의 디자인 제목" 링크와 같은 역할)
        if (page.attributionUrl) {
          const attr = document.createElement('p');
          attr.className = 'canva-attribution';
          const authorText = page.attributionAuthor ? `${page.attributionAuthor} 님의 ` : '';
          attr.innerHTML = `${authorText}<a href="${page.attributionUrl}" target="_blank" rel="noopener">${page.attributionTitle || '원본 디자인 보기'}</a>`;
          inner.appendChild(attr);
        }
      }
    }

    typesetMath(card);
  }

  // 새로 그려진 슬라이드 안의 수식($...$, $$...$$)을 MathJax로 렌더링한다.
  // MathJax 스크립트가 아직 로딩 중일 수 있으므로 startup.promise를 기다린다.
  function typesetMath(el) {
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(() => window.MathJax.typesetPromise([el]));
    } else if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([el]);
    }
  }

  // 우측 "관련 영상" 레일을 현재 소단원의 영상 목록으로 채운다.
  // 소단원이 바뀔 때마다 항상 접힌 상태로 되돌아간다. 영상이 하나도
  // 없는 소단원이면 레일 자체를 숨긴다.
  // 우측 "관련 영상" 레일을 현재 소단원의 영상 목록으로 채운다.
  // 소단원이 바뀔 때마다 항상 접힌 상태로 되돌아간다. 아직 영상을
  // 하나도 안 올린 소단원이어도 레일 자체(< 버튼)는 항상 보여준다 —
  // 나중에 영상이 생기면 그 소단원도 똑같이 바로 쓸 수 있어야 해서다.
  // 우측 "< " 레일을 채운다. 보통 단원(Ⅰ~Ⅳ)에서는 그 소단원의
  // 관련 영상 목록을, '경제수학 프로그램'(sidebarHidden 단원)에서는
  // 그 단원 안의 프로그램 목록을 대신 보여준다 — 열림/닫힘 상태는
  // selectTopic()에서만 접은 상태로 초기화하고, 여기서는 건드리지
  // 않는다(프로그램 사이를 이동할 때 레일이 계속 열려있도록).
  function renderVideoRail(topic) {
    const unit = CURRICULUM[currentUnitIndex];
    if (unit && unit.sidebarHidden) {
      renderProgramRail(topic);
      return;
    }

    const videos = getTopicVideos(topic);
    videoRailTitle.textContent = '관련 영상';
    videoRail.classList.remove('is-hidden');

    videoRailList.innerHTML = '';
    if (videos.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'video-rail-empty';
      empty.textContent = '아직 등록된 영상이 없습니다.';
      videoRailList.appendChild(empty);
      return;
    }

    videos.forEach((v, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'video-rail-item';
      btn.textContent = v.label || `관련 영상 ${i + 1}`;
      btn.addEventListener('click', () => openVideoModal(v.url));
      videoRailList.appendChild(btn);
    });
  }

  // '경제수학 프로그램' 전용 — 우측 레일에 영상 대신 이 단원 안의
  // 프로그램 목록을 보여주고, 클릭하면 영상 모달이 아니라 그 자리에서
  // 바로 그 프로그램 화면으로 넘어간다(같은 소단원 안의 페이지 이동).
  function renderProgramRail(topic) {
    const programs = getPages(topic);
    videoRailTitle.textContent = '프로그램 목록';
    videoRail.classList.remove('is-hidden');

    videoRailList.innerHTML = '';
    if (programs.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'video-rail-empty';
      empty.textContent = '아직 등록된 프로그램이 없습니다.';
      videoRailList.appendChild(empty);
      return;
    }

    programs.forEach((page, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'video-rail-item';
      btn.classList.toggle('is-active', i === currentPageIndex);
      btn.textContent = page.title || `프로그램 ${i + 1}`;
      btn.addEventListener('click', () => {
        currentPageIndex = i;
        renderStage();
      });
      videoRailList.appendChild(btn);
    });
  }

  function openVideoModal(url) {
    videoModalFrame.innerHTML = `<iframe src="${url}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    videoModal.classList.add('is-open');
  }

  function closeVideoModal() {
    videoModal.classList.remove('is-open');
    videoModalFrame.innerHTML = ''; // iframe을 비워서 재생을 멈춘다
  }

  function emptyStateHTML() {
    return `
      <div class="landing">
        <div class="landing-content">
          <p class="landing-eyebrow">VISUAL ECONOMICS COMPASS</p>
          <h1 class="landing-title">ECONOMIC MATHEMATICS</h1>
          <p class="landing-subtitle">왼쪽 목차를 클릭하여 학습을 시작하세요.</p>
        </div>
      </div>
    `;
  }

  /* ---------------- 빈칸 클릭 시 정답 표시 ----------------
     data.js에서 <span class="blank-answer">정답</span> 형태로 적어두면
     평소에는 빈칸으로 보이다가, 클릭하면 정답이 초록색으로 나타난다.
     슬라이드가 다시 그려져도 계속 동작하도록 stage에 위임(delegation)한다.
  ------------------------------------------------------------- */
  stage.addEventListener('click', (e) => {
    const blank = e.target.closest('.blank-answer');
    if (blank) blank.classList.toggle('is-revealed');
  });

  /* ---------------- 우측 관련 영상 레일 / 영상 모달 ---------------- */
  videoRailToggle.addEventListener('click', () => {
    const willOpen = !videoRail.classList.contains('is-open');
    videoRail.classList.toggle('is-open', willOpen);
    videoRailToggle.setAttribute('aria-expanded', String(willOpen));
  });
  videoModalClose.addEventListener('click', closeVideoModal);
  videoModalBackdrop.addEventListener('click', closeVideoModal);

  /* ---------------- 사이드바 접기/펼치기 ---------------- */
  collapseBtn.addEventListener('click', () => {
    app.classList.toggle('is-collapsed');
  });

  /* ---------------- 사이드바 '경제수학' 로고 -> 처음 화면으로 ---------------- */
  brandHomeBtn.addEventListener('click', () => {
    currentUnitIndex = null;
    currentTopicIndex = null;
    currentPageIndex = 0;
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open', 'is-active'));
    tocEl.querySelectorAll('.slide-list button').forEach((btn) => btn.classList.remove('is-active'));
    assessmentBtn.classList.remove('is-active');
    worksheetsBtn.classList.remove('is-active');
    renderStage();
  });

  /* ---------------- 사이드바 맨 아래 버튼: 경제수학 프로그램 / 학습지 ---------------- */
  assessmentBtn.addEventListener('click', () => {
    const uIdx = CURRICULUM.findIndex((u) => u.sidebarHidden);
    if (uIdx === -1) return;

    // '경제수학 프로그램'은 특정 프로그램을 자동으로 열지 않고, 먼저
    // "오른쪽에서 골라주세요" 안내 화면부터 보여준다.
    currentUnitIndex = uIdx;
    currentTopicIndex = 0;
    currentPageIndex = -1;

    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    assessmentBtn.classList.add('is-active');
    worksheetsBtn.classList.remove('is-active');

    // 우측 프로그램 목록 레일은 바로 펼쳐서 보여준다.
    videoRail.classList.add('is-open');
    videoRailToggle.setAttribute('aria-expanded', 'true');

    markActiveInTOC();
    renderStage();
  });

  worksheetsBtn.addEventListener('click', () => {
    renderWorksheetsPage();
  });

  // '경제수학 학습지' 버튼을 누르면 보여주는, 단원 목차와는 별개인
  // 학습지(pdf/ 폴더) 목록 화면. WORKSHEETS 배열(data.js)에 항목을
  // 추가하면 여기 목록도 그만큼 늘어난다.
  // 학습지/답안지 다운로드 — 그냥 다운로드 폴더로 바로 저장되는 대신,
  // 지원하는 브라우저(크롬/엣지 등)에서는 "저장 위치 선택" 창을 띄운다.
  // 지원 안 하는 브라우저(사파리 등)에서는 기존처럼 바로 다운로드된다.
  async function downloadWithSavePicker(url, suggestedName) {
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{ description: 'PDF 파일', accept: { 'application/pdf': ['.pdf'] } }]
        });
        const response = await fetch(url);
        const blob = await response.blob();
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // 사용자가 저장을 취소함
        // 그 외 오류면 아래 기존 방식으로 폴백
      }
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function renderWorksheetsPage() {
    currentUnitIndex = null;
    currentTopicIndex = null;
    currentPageIndex = 0;

    document.body.classList.remove('is-landing', 'is-scroll-mode');
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open', 'is-active'));
    tocEl.querySelectorAll('.slide-list button').forEach((btn) => btn.classList.remove('is-active'));
    assessmentBtn.classList.remove('is-active');
    worksheetsBtn.classList.add('is-active');
    videoRail.classList.add('is-hidden');
    videoRail.classList.remove('is-open');

    const card = document.createElement('div');
    card.className = 'slide-card slide-card--flush';
    const inner = document.createElement('div');
    inner.className = 'slide-inner slide-inner--worksheets';

    const hasGroups = typeof WORKSHEETS !== 'undefined'
      && WORKSHEETS.length > 0
      && Array.isArray(WORKSHEETS[0].items);

    if (hasGroups) {
      // 1·2·3·4단원을 가로로 나란히 놓고, 각 단원 안의 차시는 세로로 쌓는다
      const grid = document.createElement('div');
      grid.className = 'worksheet-grid';

      WORKSHEETS.forEach((group) => {
        const col = document.createElement('div');
        col.className = 'worksheet-col';

        const groupTitle = document.createElement('p');
        groupTitle.className = 'worksheet-group-title';
        groupTitle.textContent = group.unitTitle;
        col.appendChild(groupTitle);

        const list = document.createElement('div');
        list.className = 'worksheet-list';
        group.items.forEach((w) => {
          const row = document.createElement('div');
          row.className = 'worksheet-item';

          const label = document.createElement('span');
          label.className = 'worksheet-label';
          label.textContent = w.label;
          row.appendChild(label);

          const actions = document.createElement('span');
          actions.className = 'worksheet-actions';

          // 정답지 파일명은 학습지 파일명 끝의 'exe'를 'ans'로 바꾼 것
          // (예: chapter02exe -> chapter02ans), pdfans/ 폴더 안에 있다.
          const ansFile = w.file.replace(/exe$/, 'ans');

          const worksheetLink = document.createElement('a');
          worksheetLink.className = 'worksheet-btn';
          worksheetLink.href = `pdf/${w.file}.pdf`;
          worksheetLink.textContent = '학습지';
          worksheetLink.addEventListener('click', (e) => {
            e.preventDefault();
            downloadWithSavePicker(`pdf/${w.file}.pdf`, `${w.file}.pdf`);
          });
          actions.appendChild(worksheetLink);

          const answerLink = document.createElement('a');
          answerLink.className = 'worksheet-btn';
          answerLink.href = `pdfans/${ansFile}.pdf`;
          answerLink.textContent = '답안지';
          answerLink.addEventListener('click', (e) => {
            e.preventDefault();
            downloadWithSavePicker(`pdfans/${ansFile}.pdf`, `${ansFile}.pdf`);
          });
          actions.appendChild(answerLink);

          row.appendChild(actions);
          list.appendChild(row);
        });
        col.appendChild(list);

        grid.appendChild(col);
      });

      inner.appendChild(grid);
    } else {
      const empty = document.createElement('p');
      empty.className = 'worksheet-empty';
      empty.textContent = '아직 등록된 학습지가 없습니다.';
      inner.appendChild(empty);
    }

    card.appendChild(inner);
    stage.innerHTML = '';
    stage.appendChild(card);
  }

  /* ---------------- 키보드 단축키 (Esc로 영상 닫기) ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (videoModal.classList.contains('is-open')) {
      closeVideoModal();
    }
  });

  /* ---------------- 초기화 ----------------
     처음 접속하면 사이드바 목차만 그려두고, 화면은 표지(랜딩) 상태로
     둔다. 특정 단원을 자동으로 열지 않는다 — 그래야 매번 접속할 때마다
     이미지가 있는 처음 화면이 먼저 보인다.
  ------------------------------------------------------------- */
  renderTOC();
  renderStage();
})();
