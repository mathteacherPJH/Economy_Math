(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const footer = document.getElementById('stageFooter');
  const collapseBtn = document.getElementById('collapseBtn');
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
     하단 좌우 화살표도 이제 같은 방식으로 같은 단원 안의 이전/다음
     소단원으로 이동합니다(step() 참고).
  ------------------------------------------------------------- */
  function selectTopic(uIdx, tIdx) {
    currentUnitIndex = uIdx;
    currentTopicIndex = tIdx;
    currentPageIndex = 0;

    const unitEl = tocEl.querySelector(`.unit[data-unit-index="${uIdx}"]`);
    tocEl.querySelectorAll('.unit').forEach((el) => el.classList.remove('is-open'));
    unitEl?.classList.add('is-open');

    markActiveInTOC();
    renderStage();
  }

  function renderStage() {
    if (currentUnitIndex === null) {
      stage.innerHTML = emptyStateHTML();
      stageEyebrow.textContent = '';
      footer.innerHTML = '';
      document.body.classList.remove('is-scroll-mode');
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const topic = unit.topics[currentTopicIndex];
    const pages = getPages(topic);
    const page = pages[currentPageIndex];

    stageEyebrow.innerHTML = `<strong>${unit.number}</strong> · ${unit.title} : ${topic.title}`;

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
    renderFooter(unit);
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

  function renderFooter(unit) {
    const total = unit.topics.length;
    footer.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'nav-btn';
    prev.setAttribute('aria-label', '이전 소단원');
    prev.innerHTML = '&#8592;';
    prev.disabled = currentTopicIndex === 0;
    prev.addEventListener('click', () => step(-1));

    const track = document.createElement('div');
    track.className = 'progress-track';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot' + (i === currentTopicIndex ? ' is-active' : '');
      track.appendChild(dot);
    }
    const count = document.createElement('span');
    count.className = 'progress-count';
    count.textContent = `${currentTopicIndex + 1} / ${total}`;
    track.appendChild(count);

    const next = document.createElement('button');
    next.className = 'nav-btn';
    next.setAttribute('aria-label', '다음 소단원');
    next.innerHTML = '&#8594;';
    next.disabled = currentTopicIndex === total - 1;
    next.addEventListener('click', () => step(1));

    footer.appendChild(prev);
    footer.appendChild(track);
    footer.appendChild(next);
  }

  // 하단 좌우 화살표는 이제 같은 단원 안의 다른 소단원(사이드바 목차
  // 한 줄)으로 이동한다. 소단원으로 이동하면 그 소단원의 첫 페이지부터
  // 다시 보여준다(사이드바에서 직접 클릭한 것과 동일하게 동작).
  function step(dir) {
    if (currentUnitIndex === null) return;
    const unit = CURRICULUM[currentUnitIndex];
    const nextTopicIndex = currentTopicIndex + dir;
    if (nextTopicIndex < 0 || nextTopicIndex >= unit.topics.length) return;
    selectTopic(currentUnitIndex, nextTopicIndex);
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
      <div class="empty-state">
        <div class="brand-mark">경제</div>
        <h2>왼쪽 목차에서 단원을 선택하세요</h2>
        <p>목차를 클릭하면 개념 설명, 영상, 활동으로 구성된 슬라이드가 시작됩니다.</p>
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

  /* ---------------- 전체화면(발표 모드) ---------------- */
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  /* ---------------- 프리젠터 클리커 / 키보드 지원 ----------------
     대부분의 PPT 프리젠터 리모컨은 오른쪽 화살표(다음)와
     왼쪽 화살표(이전) 키 신호를 보냅니다. PageUp/PageDown, Space를
     사용하는 리모컨도 있어 함께 지원합니다. 이 키들은 현재 열려있는
     소단원 안의 PPT 페이지만 넘깁니다.
  ------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (videoModal.classList.contains('is-open') && e.key !== 'Escape') return;

    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      step(1);
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'Escape') {
      if (videoModal.classList.contains('is-open')) {
        closeVideoModal();
      } else if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  });

  /* ---------------- 초기화 ---------------- */
  renderTOC();
  renderStage();

  // 첫 단원을 기본으로 펼쳐서 보여준다
  if (CURRICULUM.length > 0) {
    toggleUnit(0);
  }
})();
