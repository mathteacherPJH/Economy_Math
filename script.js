(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const collapseBtn = document.getElementById('collapseBtn');
  const brandHomeBtn = document.getElementById('brandHomeBtn');
  const assessmentBtn = document.getElementById('assessmentBtn');
  const worksheetsBtn = document.getElementById('worksheetsBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const videoRail = document.getElementById('videoRail');
  const videoRailToggle = document.getElementById('videoRailToggle');
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

    const willOpen = !unitEl.classList.contains('is-open');
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    if (willOpen) {
      unitEl.classList.add('is-open');
      // 단원을 열면 자동으로 첫 소단원을 보여준다
      if (currentUnitIndex !== uIdx) {
        selectTopic(uIdx, 0);
      }
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
    fullscreenBtn.classList.remove('is-hidden');

    const unitEl = tocEl.querySelector(`.unit[data-unit-index="${uIdx}"]`);
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    unitEl?.classList.add('is-open');

    // 사이드바 맨 아래 버튼(경제수학 수행평가/학습지)의 활성 표시도
    // 여기서 같이 관리한다 — 일반 단원으로 이동하면 둘 다 꺼진다.
    assessmentBtn.classList.toggle('is-active', CURRICULUM[uIdx]?.sidebarHidden === true);
    worksheetsBtn.classList.remove('is-active');

    markActiveInTOC();
    renderStage();
  }

  function renderStage() {
    if (currentUnitIndex === null) {
      // 처음 화면(랜딩)에서는 상단 툴바(발표 모드 버튼 등)를 완전히
      // 숨기고, 배경 이미지가 사이드바를 뺀 화면 전체를 꽉 채우도록 한다.
      document.body.classList.add('is-landing');
      stage.innerHTML = emptyStateHTML();
      stageEyebrow.textContent = '';
      videoRail.classList.add('is-hidden');
      videoRail.classList.remove('is-open');
      document.body.classList.remove('is-scroll-mode');
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const topic = unit.topics[currentTopicIndex];
    const pages = getPages(topic);
    const page = pages[currentPageIndex];

    document.body.classList.remove('is-landing');
    // '경제수학 수행평가'처럼 사이드바 맨 아래 버튼으로 들어가는
    // 단원은 단원 번호(Ⅴ 등)를 breadcrumb에도 표시하지 않는다.
    stageEyebrow.innerHTML = unit.sidebarHidden
      ? `${unit.title} : ${topic.title}`
      : `<strong>${unit.number}</strong> · ${unit.title} : ${topic.title}`;

    // 이 소단원의 관련 영상을 우측 레일에 채우고, 소단원이 바뀔 때마다
    // 레일은 항상 접힌 상태로 되돌린다.
    renderVideoRail(topic);

    // 학습지 페이지 이미지를 그대로 넣은 슬라이드는 카드 안에 갇히지 않고
    // 페이지 전체가 세로로 늘어나며, 브라우저 스크롤로 이어서 본다.
    document.body.classList.toggle('is-scroll-mode', page.type === 'pdfpage');

    const card = document.createElement('div');
    card.className = 'slide-card';
    if (page.type === 'canva') card.classList.add('slide-card--flush');
    const inner = document.createElement('div');
    inner.className = 'slide-inner';

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
      // 좌상단 고정 헤더 — 학습지 페이지 이미지 슬라이드는 위 stageEyebrow가
      // 이미 단원·소단원 이름을 보여주므로 따로 표시하지 않는다.
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

    card.appendChild(inner);
    stage.innerHTML = '';
    stage.appendChild(card);

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
  function renderVideoRail(topic) {
    const videos = getTopicVideos(topic);

    videoRail.classList.remove('is-open');
    videoRailToggle.setAttribute('aria-expanded', 'false');
    videoRail.classList.toggle('is-hidden', videos.length === 0);

    videoRailList.innerHTML = '';
    videos.forEach((v, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'video-rail-item';
      btn.textContent = v.label || `관련 영상 ${i + 1}`;
      btn.addEventListener('click', () => openVideoModal(v.url));
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
    fullscreenBtn.classList.remove('is-hidden');
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open', 'is-active'));
    tocEl.querySelectorAll('.slide-list button').forEach((btn) => btn.classList.remove('is-active'));
    assessmentBtn.classList.remove('is-active');
    worksheetsBtn.classList.remove('is-active');
    renderStage();
  });

  /* ---------------- 사이드바 맨 아래 버튼: 경제수학 수행평가 / 학습지 ---------------- */
  assessmentBtn.addEventListener('click', () => {
    const uIdx = CURRICULUM.findIndex((u) => u.sidebarHidden);
    if (uIdx === -1) return;
    selectTopic(uIdx, 0);
  });

  worksheetsBtn.addEventListener('click', () => {
    renderWorksheetsPage();
  });

  // '경제수학 학습지' 버튼을 누르면 보여주는, 단원 목차와는 별개인
  // 학습지(pdf/ 폴더) 목록 화면. WORKSHEETS 배열(data.js)에 항목을
  // 추가하면 여기 목록도 그만큼 늘어난다.
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

    // 이 화면에서는 좌상단 글자(breadcrumb)와 우상단 발표 모드 버튼을
    // 둘 다 감춘다 — 목록만 깔끔하게 보여주면 되는 화면이라서다.
    stageEyebrow.innerHTML = '';
    fullscreenBtn.classList.add('is-hidden');

    const card = document.createElement('div');
    card.className = 'slide-card slide-card--flush';
    const inner = document.createElement('div');
    inner.className = 'slide-inner';

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
          const a = document.createElement('a');
          a.className = 'worksheet-item';
          a.href = `pdf/${w.file}.pdf`;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = w.label;
          list.appendChild(a);
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

  /* ---------------- 전체화면(발표 모드) ---------------- */
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  /* ---------------- 키보드 단축키 (Esc로 영상/전체화면 닫기) ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (videoModal.classList.contains('is-open')) {
      closeVideoModal();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
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
