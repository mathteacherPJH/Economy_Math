(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const footer = document.getElementById('stageFooter');
  const collapseBtn = document.getElementById('collapseBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const addBlankBtn = document.getElementById('addBlankBtn');
  const zoomInput = document.getElementById('zoomInput');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');

  // 현재 선택된 위치: 단원 -> 소단원(목차 한 줄) -> 그 안의 PPT 슬라이드 페이지
  let currentUnitIndex = null;
  let currentTopicIndex = null;
  let currentPageIndex = 0;

  // 확대/축소 비율 (모든 컨트롤이 이 값 하나로 서로 연동된다)
  let zoomLevel = 100;

  // 학습지 이미지 위에 직접 만든 빈칸(수동 입력칸)들을 슬라이드별로 기억해둔다.
  // 브라우저를 새로고침하면 사라지는 "현재 수업 세션 동안만" 유지되는 메모리다.
  let addBlankMode = false;
  const manualBlanks = new Map(); // key: "uIdx-tIdx-pIdx" -> [{ left, top, text }]

  // 학습지 이미지 위에 놓는 수동 입력칸(빈칸) 하나를 만든다.
  // 클릭하면 바로 타이핑할 수 있고(contenteditable), 초록색 볼드로 보이며,
  // 마우스를 올리면 우측 상단에 삭제(×) 버튼이 뜬다.
  function createBlankEl(ann) {
    const wrap = document.createElement('div');
    wrap.className = 'answer-blank';
    wrap.style.left = ann.left + '%';
    wrap.style.top = ann.top + '%';

    const text = document.createElement('span');
    text.className = 'answer-blank-text';
    text.contentEditable = 'true';
    text.spellcheck = false;
    text.textContent = ann.text || '';
    text.addEventListener('input', () => { ann.text = text.textContent; });
    wrap.appendChild(text);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'answer-blank-delete';
    del.contentEditable = 'false';
    del.setAttribute('aria-label', '빈칸 삭제');
    del.textContent = '×';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = currentSlideKey();
      const list = manualBlanks.get(key) || [];
      const idx = list.indexOf(ann);
      if (idx > -1) list.splice(idx, 1);
      wrap.remove();
    });
    wrap.appendChild(del);

    wrap.addEventListener('click', (e) => e.stopPropagation());

    return wrap;
  }

  // 확대/축소 비율을 하나의 값으로 관리 — 버튼, 숫자 입력, Ctrl+스크롤이
  // 모두 이 함수를 거쳐 서로 연동된다.
  function setZoom(value) {
    zoomLevel = Math.max(25, Math.min(300, Math.round(value)));
    zoomInput.value = zoomLevel;
    const card = stage.querySelector('.slide-card');
    if (card) card.style.zoom = zoomLevel + '%';
  }

  function currentSlideKey() {
    return `${currentUnitIndex}-${currentTopicIndex}-${currentPageIndex}`;
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
      document.body.classList.remove('is-scroll-mode');
      return;
    }

    const unit = CURRICULUM[currentUnitIndex];
    const topic = unit.topics[currentTopicIndex];
    const page = topic.slides[currentPageIndex];

    stageEyebrow.innerHTML = `<strong>${unit.number}</strong> · ${unit.title} : ${topic.title}`;

    // 학습지 페이지 이미지를 그대로 넣은 슬라이드는 카드 안에 갇히지 않고
    // 페이지 전체가 세로로 늘어나며, 브라우저 스크롤로 이어서 본다.
    document.body.classList.toggle('is-scroll-mode', page.type === 'pdfpage');

    const card = document.createElement('div');
    card.className = 'slide-card';
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

        // 이 슬라이드에서 이전에 직접 만들어둔 빈칸(수동 입력칸)을 그대로 복원
        const key = currentSlideKey();
        (manualBlanks.get(key) || []).forEach((ann) => {
          wrap.appendChild(createBlankEl(ann));
        });

        wrap.addEventListener('click', (e) => {
          if (!addBlankMode) return;
          if (e.target.closest('.answer-blank')) return; // 기존 칸 클릭은 새로 만들지 않음

          const rect = wrap.getBoundingClientRect();
          const leftPct = ((e.clientX - rect.left) / rect.width) * 100;
          const topPct = ((e.clientY - rect.top) / rect.height) * 100;
          const ann = { left: leftPct, top: topPct, text: '' };

          const list = manualBlanks.get(key) || [];
          list.push(ann);
          manualBlanks.set(key, list);

          const el = createBlankEl(ann);
          wrap.appendChild(el);
          el.querySelector('.answer-blank-text')?.focus();
        });

        inner.appendChild(wrap);
      }
    }

    card.appendChild(inner);
    stage.innerHTML = '';
    stage.appendChild(card);

    setZoom(100);
    typesetMath(card);
    renderFooter(topic);
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

  /* ---------------- 빈칸 클릭 시 정답 표시 ----------------
     data.js에서 <span class="blank-answer">정답</span> 형태로 적어두면
     평소에는 빈칸으로 보이다가, 클릭하면 정답이 초록색으로 나타난다.
     슬라이드가 다시 그려져도 계속 동작하도록 stage에 위임(delegation)한다.
  ------------------------------------------------------------- */
  stage.addEventListener('click', (e) => {
    const blank = e.target.closest('.blank-answer');
    if (blank) blank.classList.toggle('is-revealed');
  });

  /* ---------------- 빈칸 추가 모드 ----------------
     버튼을 누르면 켜짐/꺼짐이 토글되고, 켜진 동안 학습지 이미지를
     클릭할 때마다 그 위치에 직접 타이핑할 수 있는 빈칸이 생긴다.
  ------------------------------------------------------------- */
  addBlankBtn.addEventListener('click', () => {
    addBlankMode = !addBlankMode;
    addBlankBtn.classList.toggle('is-active', addBlankMode);
    addBlankBtn.setAttribute('aria-pressed', String(addBlankMode));
    stage.classList.toggle('is-add-blank-mode', addBlankMode);
  });

  /* ---------------- 확대/축소 ----------------
     -버튼/+버튼(클릭당 5%), 숫자 직접 입력, Ctrl+스크롤 휠이 모두
     setZoom() 하나로 연동된다.
  ------------------------------------------------------------- */
  zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - 5));
  zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + 5));
  zoomInput.addEventListener('change', () => {
    const val = parseInt(zoomInput.value, 10);
    setZoom(Number.isNaN(val) ? 100 : val);
  });

  document.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    if (!stage.contains(e.target)) return;
    e.preventDefault();
    setZoom(zoomLevel + (e.deltaY < 0 ? 5 : -5));
  }, { passive: false });

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
