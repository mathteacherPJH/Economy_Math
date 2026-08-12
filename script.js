(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const footer = document.getElementById('stageFooter');
  const collapseBtn = document.getElementById('collapseBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // 현재 선택된 위치: 단원 -> 소단원(목차 한 줄) -> 그 안의 PPT 슬라이드 페이지
  let currentUnitIndex = null;
  let currentTopicIndex = null;
  let currentPageIndex = 0;

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
     사이드바에서 소단원(목차 한 줄)을 클릭하면 그 소단원의 첫 페이지부터
     보여줍니다. 이후 하단 좌우 화살표는 이 소단원 "안"의 PPT 페이지만
     넘기고, 다른 소단원으로는 이동하지 않습니다.
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
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const topic = unit.topics[currentTopicIndex];
    const page = topic.slides[currentPageIndex];

    stageEyebrow.innerHTML = `<strong>${unit.number}</strong> · ${unit.title}`;

    const card = document.createElement('div');
    card.className = 'slide-card';
    const inner = document.createElement('div');
    inner.className = 'slide-inner';

    if (page.type === 'title') {
      inner.classList.add('slide-inner--center');
      const heading = document.createElement('h1');
      heading.className = 'title-slide-heading';
      heading.textContent = page.title;
      inner.appendChild(heading);
    } else {
      const title = document.createElement('h2');
      title.className = 'slide-title';
      title.textContent = page.title;
      inner.appendChild(title);

      if (page.type === 'text') {
        const body = document.createElement('div');
        body.className = 'slide-body';
        body.innerHTML = page.body;
        inner.appendChild(body);
      } else if (page.type === 'video') {
        const wrap = document.createElement('div');
        wrap.className = 'video-wrap';
        wrap.innerHTML = `<iframe src="${page.url}" title="${page.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
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
      }
    }

    card.appendChild(inner);
    stage.innerHTML = '';
    stage.appendChild(card);

    renderFooter(topic);
  }

  function renderFooter(topic) {
    const total = topic.slides.length;
    footer.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'nav-btn';
    prev.setAttribute('aria-label', '이전 슬라이드');
    prev.innerHTML = '&#8592;';
    prev.disabled = currentPageIndex === 0;
    prev.addEventListener('click', () => step(-1));

    const track = document.createElement('div');
    track.className = 'progress-track';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot' + (i === currentPageIndex ? ' is-active' : '');
      track.appendChild(dot);
    }
    const count = document.createElement('span');
    count.className = 'progress-count';
    count.textContent = `${currentPageIndex + 1} / ${total}`;
    track.appendChild(count);

    const next = document.createElement('button');
    next.className = 'nav-btn';
    next.setAttribute('aria-label', '다음 슬라이드');
    next.innerHTML = '&#8594;';
    next.disabled = currentPageIndex === total - 1;
    next.addEventListener('click', () => step(1));

    footer.appendChild(prev);
    footer.appendChild(track);
    footer.appendChild(next);
  }

  // 현재 소단원 "안"의 PPT 페이지만 넘긴다 (다른 소단원으로 넘어가지 않음)
  function step(dir) {
    if (currentUnitIndex === null) return;
    const topic = CURRICULUM[currentUnitIndex].topics[currentTopicIndex];
    const next = currentPageIndex + dir;
    if (next < 0 || next >= topic.slides.length) return;
    currentPageIndex = next;
    renderStage();
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
  renderTOC();
  renderStage();

  // 첫 단원을 기본으로 펼쳐서 보여준다
  if (CURRICULUM.length > 0) {
    toggleUnit(0);
  }
})();
