(function () {
  'use strict';

  const app = document.getElementById('app');
  const tocEl = document.getElementById('toc');
  const stage = document.getElementById('stage');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const footer = document.getElementById('stageFooter');
  const collapseBtn = document.getElementById('collapseBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const penBtn = document.getElementById('penBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const penColorInput = document.getElementById('penColor');
  const penWidthInput = document.getElementById('penWidth');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const clearBtn = document.getElementById('clearBtn');
  const drawToolbar = document.getElementById('drawToolbar');
  const blankToolbar = document.getElementById('blankToolbar');
  const blankAddBtn = document.getElementById('blankAddBtn');
  const blankClearBtn = document.getElementById('blankClearBtn');
  const blankFontSizeInput = document.getElementById('blankFontSize');
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

  // 드로잉 도구 상태 — 펜/지우개 중 하나만 켜지고, 색깔·굵기는 공용이다.
  let drawTool = null; // 'pen' | 'eraser' | null(꺼짐)
  let penColor = penColorInput.value;
  let penWidth = parseInt(penWidthInput.value, 10);

  // 슬라이드별 캔버스 undo/redo 기록. 브라우저를 새로고침하면 사라지는
  // "현재 수업 세션 동안만" 유지되는 메모리다.
  // key: "uIdx-tIdx-pIdx" -> { history: [dataURL, ...], index }
  const drawHistories = new Map();

  // 빈칸(수동 입력칸) 편집 모드 — 켜져 있는 동안만 새 빈칸을 드래그로
  // 만들 수 있고, 기존 빈칸에 이동/크기조절 손잡이와 삭제 버튼이 보인다.
  // 꺼져 있으면(수업 중 보기 모드) 빈칸을 클릭해서 숨김/표시만 토글한다.
  let blankEditMode = false;
  // 지금 글자 크기 조절 대상인 빈칸(마지막으로 포커스된 텍스트 칸)
  let activeBlankBox = null;
  let activeBlankBoxTextEl = null;
  // 새로 만드는 빈칸에 기본으로 적용할 글자 크기(px). 폰트 크기 입력칸에
  // 숫자를 넣으면(포커스된 빈칸이 없어도) 이 값이 바뀌어서, 매번 새
  // 빈칸을 만들 때마다 다시 크기를 조절할 필요가 없다.
  let defaultBlankFontSize = parseInt(blankFontSizeInput.value, 10) || 35;

  function currentSlideKey() {
    return `${currentUnitIndex}-${currentTopicIndex}-${currentPageIndex}`;
  }

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

    // 그림 도구는 학습지 이미지 슬라이드에서만 의미가 있으므로, 그 외
    // 슬라이드에서는 숨기고 펜/지우개도 꺼둔다.
    drawToolbar.classList.toggle('is-hidden', page.type !== 'pdfpage');
    blankToolbar.classList.toggle('is-hidden', page.type !== 'pdfpage');
    if (page.type !== 'pdfpage' && drawTool) {
      drawTool = null;
      updateToolButtons();
    }
    if (page.type !== 'pdfpage' && blankEditMode) {
      blankEditMode = false;
      updateBlankToolButtons();
    }

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

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-draw-canvas';
        wrap.appendChild(canvas);

        // 이미지가 실제로 로드된 뒤에 캔버스 해상도를 이미지 비율에 맞추고,
        // 이 슬라이드에 남아있던 그림(undo/redo 기록)을 복원한다.
        img.addEventListener('load', () => setupCanvas(canvas), { once: true });
        if (img.complete) setupCanvas(canvas);

        const blankLayer = document.createElement('div');
        blankLayer.className = 'blank-layer';
        wrap.appendChild(blankLayer);
        setupBlankLayer(blankLayer, page.image);

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

  /* ---------------- 학습지 이미지 위 드로잉(펜/지우개) ----------------
     각 pdfpage 슬라이드마다 이미지와 같은 크기의 캔버스를 겹쳐두고,
     펜/지우개로 그린 내용을 dataURL 스냅샷으로 undo/redo 기록에 쌓는다.
  ------------------------------------------------------------- */
  function setupCanvas(canvas) {
    const img = canvas.parentElement.querySelector('.pdf-page-img');
    const baseW = 1400;
    canvas.width = baseW;
    canvas.height = Math.round(baseW * (img.naturalHeight / img.naturalWidth || 1.41));

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const key = currentSlideKey();
    let rec = drawHistories.get(key);
    if (!rec) {
      rec = { history: [null], index: 0 };
      drawHistories.set(key, rec);
    }
    restoreCanvas(canvas, ctx, rec);
    updateDrawButtons();
    updateToolButtons();

    let drawing = false;

    function toCanvasXY(e) {
      const rect = canvas.getBoundingClientRect();
      return [
        ((e.clientX - rect.left) / rect.width) * canvas.width,
        ((e.clientY - rect.top) / rect.height) * canvas.height
      ];
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (!drawTool) return;
      e.preventDefault();
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      const [x, y] = toCanvasXY(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleFactor = canvas.width / rect.width;
      ctx.lineWidth = penWidth * scaleFactor;
      ctx.strokeStyle = penColor;
      ctx.globalCompositeOperation = drawTool === 'eraser' ? 'destination-out' : 'source-over';
      const [x, y] = toCanvasXY(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    const endStroke = () => {
      if (!drawing) return;
      drawing = false;
      pushHistory(canvas);
    };
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointerleave', endStroke);
  }

  function restoreCanvas(canvas, ctx, rec) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = rec.history[rec.index];
    if (!data) return;
    const imgEl = new Image();
    imgEl.onload = () => ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    imgEl.src = data;
  }

  function pushHistory(canvas) {
    const key = currentSlideKey();
    const rec = drawHistories.get(key);
    if (!rec) return;
    rec.history = rec.history.slice(0, rec.index + 1);
    rec.history.push(canvas.toDataURL());
    rec.index = rec.history.length - 1;
    updateDrawButtons();
  }

  function updateDrawButtons() {
    const rec = drawHistories.get(currentSlideKey());
    undoBtn.disabled = !rec || rec.index <= 0;
    redoBtn.disabled = !rec || rec.index >= rec.history.length - 1;
  }

  function updateToolButtons() {
    penBtn.classList.toggle('is-active', drawTool === 'pen');
    penBtn.setAttribute('aria-pressed', String(drawTool === 'pen'));
    eraserBtn.classList.toggle('is-active', drawTool === 'eraser');
    eraserBtn.setAttribute('aria-pressed', String(drawTool === 'eraser'));
    const canvas = stage.querySelector('.pdf-draw-canvas');
    if (canvas) canvas.classList.toggle('is-active', !!drawTool);
  }

  /* ---------------- 빈칸(수동 입력칸) — 만들기/이동/크기조절/삭제/
     숨김-표시 토글/저장 ----------------
     localStorage에 이미지 경로를 key로 저장해서, 새로고침하거나 다음에
     다시 접속해도 만들어둔 빈칸이 그대로 남아있다.
  ------------------------------------------------------------- */
  function blanksStorageKey(imgSrc) {
    return `economath-blanks:${imgSrc}`;
  }

  function loadBlanks(imgSrc) {
    try {
      const raw = localStorage.getItem(blanksStorageKey(imgSrc));
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveBlanks(imgSrc, list) {
    try {
      localStorage.setItem(blanksStorageKey(imgSrc), JSON.stringify(list));
    } catch (err) {
      // 저장 공간이 꽉 찼거나 localStorage를 쓸 수 없는 환경이면 조용히 무시
    }
  }

  function persistLayerBlanks(layer, imgSrc) {
    saveBlanks(imgSrc, layer._boxes || []);
  }

  function updateBlankToolButtons() {
    blankAddBtn.classList.toggle('is-active', blankEditMode);
    blankAddBtn.setAttribute('aria-pressed', String(blankEditMode));
    const layer = stage.querySelector('.blank-layer');
    if (!layer) return;
    layer.classList.toggle('is-edit-mode', blankEditMode);
    layer.querySelectorAll('.blank-box').forEach((el) => {
      el.classList.toggle('is-edit-mode', blankEditMode);
      const text = el.querySelector('.blank-box-text');
      if (text) text.contentEditable = blankEditMode ? 'true' : 'false';
    });
  }

  // 빈칸 하나(DOM)를 만든다. box = { left, top, width, height(모두 %), text, hidden, fontSize(px) }
  function createBlankBoxEl(layer, imgSrc, box) {
    if (!box.fontSize) box.fontSize = defaultBlankFontSize;

    const el = document.createElement('div');
    el.className = 'blank-box' + (box.hidden ? ' is-hidden' : ' is-revealed');
    el.classList.toggle('is-edit-mode', blankEditMode);
    el.style.left = box.left + '%';
    el.style.top = box.top + '%';
    el.style.width = box.width + '%';
    el.style.height = box.height + '%';

    const handle = document.createElement('div');
    handle.className = 'blank-box-handle';
    handle.contentEditable = 'false';
    handle.textContent = '⠿';
    el.appendChild(handle);

    // 텍스트를 감싸는 비-편집 래퍼는 flex로 가로·세로 정중앙 정렬만
    // 담당하고, 실제 contenteditable 요소(text) 자신은 display:flex나
    // table 같은 특수 레이아웃을 쓰지 않는 평범한 블록으로 남겨둔다.
    // (contenteditable 요소 자체에 flex/table을 걸면 크롬에서 커서·선택
    // 영역이 깨져서 Ctrl+C/V가 잘 안 먹는 문제가 있었다.)
    const textWrap = document.createElement('div');
    textWrap.className = 'blank-box-textwrap';

    const text = document.createElement('div');
    text.className = 'blank-box-text';
    text.contentEditable = blankEditMode ? 'true' : 'false';
    text.spellcheck = false;
    text.textContent = box.text || '';
    text.style.fontSize = box.fontSize + 'px';
    text.addEventListener('input', () => {
      box.text = text.textContent;
      persistLayerBlanks(layer, imgSrc);
    });
    text.addEventListener('focus', () => {
      activeBlankBox = box;
      activeBlankBoxTextEl = text;
      blankFontSizeInput.value = box.fontSize;
    });
    textWrap.appendChild(text);
    // 글자 주변의 빈 공간을 클릭해도 바로 타이핑할 수 있도록 포커스를 넘긴다
    textWrap.addEventListener('mousedown', (e) => {
      if (e.target === textWrap && blankEditMode) {
        e.preventDefault();
        text.focus();
      }
    });
    el.appendChild(textWrap);

    const hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'blank-box-hide';
    hideBtn.contentEditable = 'false';
    hideBtn.setAttribute('aria-label', '빈칸 가리기');
    hideBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" stroke-width="1.3"/><path d="M2 2l12 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    hideBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      box.hidden = true;
      el.classList.add('is-hidden');
      el.classList.remove('is-revealed');
      persistLayerBlanks(layer, imgSrc);
    });
    el.appendChild(hideBtn);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'blank-box-delete';
    del.contentEditable = 'false';
    del.setAttribute('aria-label', '빈칸 삭제');
    del.textContent = '×';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = (layer._boxes || []).indexOf(box);
      if (idx > -1) layer._boxes.splice(idx, 1);
      if (activeBlankBox === box) { activeBlankBox = null; activeBlankBoxTextEl = null; }
      el.remove();
      persistLayerBlanks(layer, imgSrc);
    });
    el.appendChild(del);

    const resize = document.createElement('div');
    resize.className = 'blank-box-resize';
    resize.contentEditable = 'false';
    el.appendChild(resize);

    // 보기 모드(편집 꺼짐)에서 클릭하면 숨김 ↔ 표시 토글
    el.addEventListener('click', (e) => {
      if (blankEditMode) return;
      if (e.target === del) return;
      box.hidden = !box.hidden;
      el.classList.toggle('is-hidden', box.hidden);
      el.classList.toggle('is-revealed', !box.hidden);
      persistLayerBlanks(layer, imgSrc);
    });

    // 손잡이를 드래그해서 이동 (편집 모드에서만)
    handle.addEventListener('pointerdown', (e) => {
      if (!blankEditMode) return;
      e.stopPropagation();
      e.preventDefault();
      const rect = layer.getBoundingClientRect();
      const startLeft = parseFloat(el.style.left);
      const startTop = parseFloat(el.style.top);
      const startX = e.clientX;
      const startY = e.clientY;

      function onMove(ev) {
        const dxPct = ((ev.clientX - startX) / rect.width) * 100;
        const dyPct = ((ev.clientY - startY) / rect.height) * 100;
        const w = parseFloat(el.style.width);
        const h = parseFloat(el.style.height);
        const newLeft = Math.max(0, Math.min(100 - w, startLeft + dxPct));
        const newTop = Math.max(0, Math.min(100 - h, startTop + dyPct));
        el.style.left = newLeft + '%';
        el.style.top = newTop + '%';
        box.left = newLeft;
        box.top = newTop;
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        persistLayerBlanks(layer, imgSrc);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    // 모서리를 드래그해서 크기 조절 (편집 모드에서만)
    resize.addEventListener('pointerdown', (e) => {
      if (!blankEditMode) return;
      e.stopPropagation();
      e.preventDefault();
      const rect = layer.getBoundingClientRect();
      const startW = parseFloat(el.style.width);
      const startH = parseFloat(el.style.height);
      const leftPct = parseFloat(el.style.left);
      const topPct = parseFloat(el.style.top);
      const startX = e.clientX;
      const startY = e.clientY;

      function onMove(ev) {
        const dwPct = ((ev.clientX - startX) / rect.width) * 100;
        const dhPct = ((ev.clientY - startY) / rect.height) * 100;
        const newW = Math.max(3, Math.min(100 - leftPct, startW + dwPct));
        const newH = Math.max(3, Math.min(100 - topPct, startH + dhPct));
        el.style.width = newW + '%';
        el.style.height = newH + '%';
        box.width = newW;
        box.height = newH;
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        persistLayerBlanks(layer, imgSrc);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    layer.appendChild(el);
    layer._boxes = layer._boxes || [];
    layer._boxes.push(box);
    return el;
  }

  // 이 슬라이드(이미지)의 빈칸 레이어를 저장된 내용으로 채우고,
  // 편집 모드일 때 빈 배경을 드래그하면 새 빈칸을 만들도록 연결한다.
  function setupBlankLayer(layer, imgSrc) {
    layer.dataset.imgSrc = imgSrc;
    layer.classList.toggle('is-edit-mode', blankEditMode);
    layer._boxes = [];

    loadBlanks(imgSrc).forEach((box) => createBlankBoxEl(layer, imgSrc, box));

    layer.addEventListener('pointerdown', (e) => {
      if (!blankEditMode) return;
      if (e.target !== layer) return; // 빈 배경을 눌렀을 때만 새로 만들기 시작

      const rect = layer.getBoundingClientRect();
      const startXPct = ((e.clientX - rect.left) / rect.width) * 100;
      const startYPct = ((e.clientY - rect.top) / rect.height) * 100;

      const box = { left: startXPct, top: startYPct, width: 0, height: 0, text: '', hidden: false };
      const el = createBlankBoxEl(layer, imgSrc, box);

      function onMove(ev) {
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = ((ev.clientY - rect.top) / rect.height) * 100;
        const left = Math.max(0, Math.min(startXPct, x));
        const top = Math.max(0, Math.min(startYPct, y));
        const width = Math.abs(x - startXPct);
        const height = Math.abs(y - startYPct);
        el.style.left = left + '%';
        el.style.top = top + '%';
        el.style.width = width + '%';
        el.style.height = height + '%';
        box.left = left; box.top = top; box.width = width; box.height = height;
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        if (box.width < 1.5 || box.height < 1.2) {
          // 그냥 클릭 수준의 미세한 드래그는 취소한다
          const idx = layer._boxes.indexOf(box);
          if (idx > -1) layer._boxes.splice(idx, 1);
          el.remove();
          return;
        }
        persistLayerBlanks(layer, imgSrc);
        el.querySelector('.blank-box-text')?.focus();
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
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

  /* ---------------- 빈칸(수동 입력칸) 툴바 ---------------- */
  blankAddBtn.addEventListener('click', () => {
    blankEditMode = !blankEditMode;
    updateBlankToolButtons();
  });

  blankClearBtn.addEventListener('click', () => {
    const layer = stage.querySelector('.blank-layer');
    if (!layer) return;
    const imgSrc = layer.dataset.imgSrc;
    layer.querySelectorAll('.blank-box').forEach((el) => el.remove());
    layer._boxes = [];
    activeBlankBox = null;
    activeBlankBoxTextEl = null;
    saveBlanks(imgSrc, []);
  });

  blankFontSizeInput.addEventListener('input', () => {
    const px = parseInt(blankFontSizeInput.value, 10);
    if (Number.isNaN(px)) return;
    // 포커스된 빈칸이 있든 없든, 앞으로 새로 만들 빈칸의 기본 크기를 갱신한다
    defaultBlankFontSize = px;
    if (activeBlankBox && activeBlankBoxTextEl) {
      activeBlankBox.fontSize = px;
      activeBlankBoxTextEl.style.fontSize = px + 'px';
      const layer = stage.querySelector('.blank-layer');
      if (layer) persistLayerBlanks(layer, layer.dataset.imgSrc);
    }
  });

  /* ---------------- 드로잉 도구 (펜/지우개/색깔/굵기/undo/redo/초기화) ---------------- */
  penBtn.addEventListener('click', () => {
    drawTool = drawTool === 'pen' ? null : 'pen';
    updateToolButtons();
  });
  eraserBtn.addEventListener('click', () => {
    drawTool = drawTool === 'eraser' ? null : 'eraser';
    updateToolButtons();
  });
  penColorInput.addEventListener('input', () => { penColor = penColorInput.value; });
  penWidthInput.addEventListener('input', () => { penWidth = parseInt(penWidthInput.value, 10) || 1; });

  undoBtn.addEventListener('click', () => {
    const rec = drawHistories.get(currentSlideKey());
    const canvas = stage.querySelector('.pdf-draw-canvas');
    if (!rec || !canvas || rec.index <= 0) return;
    rec.index -= 1;
    restoreCanvas(canvas, canvas.getContext('2d'), rec);
    updateDrawButtons();
  });

  redoBtn.addEventListener('click', () => {
    const rec = drawHistories.get(currentSlideKey());
    const canvas = stage.querySelector('.pdf-draw-canvas');
    if (!rec || !canvas || rec.index >= rec.history.length - 1) return;
    rec.index += 1;
    restoreCanvas(canvas, canvas.getContext('2d'), rec);
    updateDrawButtons();
  });

  clearBtn.addEventListener('click', () => {
    const canvas = stage.querySelector('.pdf-draw-canvas');
    if (!canvas) return;
    const key = currentSlideKey();
    const rec = { history: [null], index: 0 };
    drawHistories.set(key, rec);
    restoreCanvas(canvas, canvas.getContext('2d'), rec);
    updateDrawButtons();
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
