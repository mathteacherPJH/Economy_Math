(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const footer = document.getElementById('stageFooter');
  const collapseBtn = document.getElementById('collapseBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  let currentUnitIndex = null;
  let currentSlideIndex = 0;

  const INDEX_LINE_PATH = 'M0,20 L20,14 L38,22 L56,8 L74,17 L92,5 L110,12 L130,3';

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
      unit.slides.forEach((slide, sIdx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerHTML = `<span class="slide-type-dot"></span>${slide.title}`;
        btn.addEventListener('click', () => selectSlide(uIdx, sIdx));
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
      // 단원을 열면 자동으로 첫 슬라이드를 보여준다
      if (currentUnitIndex !== uIdx) {
        selectSlide(uIdx, 0);
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
      const btn = unitEl?.querySelectorAll('.slide-list button')[currentSlideIndex];
      btn?.classList.add('is-active');
    }
  }

  /* ---------------- 슬라이드 선택 / 렌더 ---------------- */
  function selectSlide(uIdx, sIdx) {
    currentUnitIndex = uIdx;
    currentSlideIndex = sIdx;

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
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const slide = unit.slides[currentSlideIndex];

    stageEyebrow.innerHTML = `<strong>${unit.number}</strong> · ${unit.title}`;

    const card = document.createElement('div');
    card.className = 'slide-card';
    const inner = document.createElement('div');
    inner.className = 'slide-inner';

    const title = document.createElement('h2');
    title.className = 'slide-title';
    title.textContent = slide.title;

    const titleIndex = document.createElement('div');
    titleIndex.className = 'title-index';
    titleIndex.innerHTML = `<svg viewBox="0 0 130 24" preserveAspectRatio="none"><defs><linearGradient id="titleIndexGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6E5BFA"/><stop offset="100%" stop-color="#22D3EE"/></linearGradient></defs><path d="${randomIndexPath()}"/></svg>`;

    inner.appendChild(title);
    inner.appendChild(titleIndex);

    if (slide.type === 'text') {
      const body = document.createElement('div');
      body.className = 'slide-body';
      body.innerHTML = slide.body;
      inner.appendChild(body);
    } else if (slide.type === 'video') {
      const wrap = document.createElement('div');
      wrap.className = 'video-wrap';
      wrap.innerHTML = `<iframe src="${slide.url}" title="${slide.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      inner.appendChild(wrap);
      if (slide.caption) {
        const cap = document.createElement('p');
        cap.className = 'video-caption';
        cap.textContent = slide.caption;
        inner.appendChild(cap);
      }
    } else if (slide.type === 'game') {
      const gameArea = document.createElement('div');
      gameArea.className = 'game-area';
      inner.appendChild(gameArea);
      if (typeof slide.render === 'function') {
        slide.render(gameArea);
      }
    }

    card.appendChild(inner);
    stage.innerHTML = '';
    stage.appendChild(card);

    renderFooter(unit);
  }

  function randomIndexPath() {
    let d = 'M0,18';
    let y = 18;
    for (let x = 15; x <= 130; x += 15) {
      y = Math.max(2, Math.min(22, y + (Math.random() - 0.55) * 14));
      d += ` L${x},${y.toFixed(1)}`;
    }
    return d;
  }

  function renderFooter(unit) {
    const total = unit.slides.length;
    footer.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'nav-btn';
    prev.setAttribute('aria-label', '이전 슬라이드');
    prev.innerHTML = '&#8592;';
    prev.disabled = currentSlideIndex === 0;
    prev.addEventListener('click', () => step(-1));

    const track = document.createElement('div');
    track.className = 'progress-track';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot' + (i === currentSlideIndex ? ' is-active' : '');
      track.appendChild(dot);
    }
    const count = document.createElement('span');
    count.className = 'progress-count';
    count.textContent = `${currentSlideIndex + 1} / ${total}`;
    track.appendChild(count);

    const next = document.createElement('button');
    next.className = 'nav-btn';
    next.setAttribute('aria-label', '다음 슬라이드');
    next.innerHTML = '&#8594;';
    next.disabled = currentSlideIndex === total - 1;
    next.addEventListener('click', () => step(1));

    footer.appendChild(prev);
    footer.appendChild(track);
    footer.appendChild(next);
  }

  function step(dir) {
    if (currentUnitIndex === null) return;
    const unit = CURRICULUM[currentUnitIndex];
    const next = currentSlideIndex + dir;
    if (next < 0 || next >= unit.slides.length) return;
    selectSlide(currentUnitIndex, next);
  }

  function emptyStateHTML() {
    return `
      <div class="empty-state">
        <div class="brand-mark">경제</div>
        <h2>왼쪽 목차에서 단원을 선택하세요</h2>
        <p>단원을 클릭하면 개념 설명, 영상, 활동으로 구성된 슬라이드가 시작됩니다.</p>
      </div>
    `;
  }

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
     사용하는 리모컨도 있어 함께 지원합니다.
  ------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return; // 게임 슬라이더 조작 방해 금지

    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      step(1);
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  });

  /* ---------------- 초기화 ---------------- */
  document.querySelectorAll('.index-line svg path').forEach((p) => p.setAttribute('d', INDEX_LINE_PATH));
  renderTOC();
  renderStage();

  // 첫 단원을 기본으로 펼쳐서 보여준다
  if (CURRICULUM.length > 0) {
    toggleUnit(0);
  }
})();
