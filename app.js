(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const works = Array.isArray(window.WORKS_DATA) ? window.WORKS_DATA : [];
  // コマのレイアウトを設定ファイルから読み込む。指定値を範囲内に制限する。
  const layout = config.endingLayout || {};
  const percent = (key, fallback, min = 0, max = 100) => {
    const n = Number(layout[key]);
    return Number.isFinite(n) && layout[key] !== undefined ? Math.max(min, Math.min(max, n)) : fallback;
  };
  const rootStyle = document.documentElement.style;
  for (const [key, css, fallback, min, max] of [
    ['width', '--ending-width', 76, 10, 100],
    ['height', '--ending-height', 59, 10, 100],
    ['left', '--ending-left', 0, 0, 90],
    ['top', '--ending-top', 0, 0, 90],
    ['imageY', '--ending-image-y', 37, 0, 100],
    ['bubbleWidth', '--ending-bubble-width', 22, 5, 70],
    ['bubbleTop', '--ending-bubble-top', 5, 0, 95],
    ['bubbleRight', '--ending-bubble-right', 5, 0, 95]
  ]) rootStyle.setProperty(css, `${percent(key, fallback, min, max)}%`);

  const $ = id => document.getElementById(id);
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const name = config.artistName || 'ARTIST NAME';
  const text = config.text || {};
  const value = (key, fallback) => text[key] ?? fallback;
  const labels = {
    'book-kicker': ['genre', 'MANGA / ILLUSTRATION'],
    'nav-works': ['navWorks', 'WORKS'],
    'nav-about': ['navAbout', 'ABOUT'],
    'nav-contact': ['navContact', 'CONTACT'],
    'about-kicker': ['aboutLabel', '01'],
    'about-title': ['aboutTitle', 'ABOUT'],
    'contact-kicker': ['contactLabel', '02'],
    'contact-title': ['contactTitle', 'CONTACT'],
    'contact-intro': ['contactIntro', 'お問い合わせ・SNS']
  };
  Object.entries(labels).forEach(([id, [key, fallback]]) => { $(id).textContent = value(key, fallback); });
  $('brand').firstChild.textContent = name;
  $('footer-name').textContent = name;
  $('introduction').textContent = config.introduction || 'プロフィールをここに入力してください。';
  document.title = `${name} — Portfolio`;
  const links = $('social-links');
  (config.socialLinks || []).forEach(item => {
    if (!item.url || !/^https:\/\//i.test(item.url)) return;
    const a = make('a', '', item.label || 'SOCIAL');
    a.href = item.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    links.appendChild(a);
  });
  if (config.contactEmail) {
    const a = make('a', '', 'EMAIL ↗');
    a.href = 'mailto:' + config.contactEmail;
    links.appendChild(a);
  }
  if (!links.children.length) links.appendChild(make('span', 'empty-contact', 'SNS・連絡先は公開前に設定できます。'));
  const dialog = $('art-dialog');
  function openWork(work) {
    $('dialog-image').src = work.image;
    $('dialog-image').alt = work.title;
    $('dialog-title').textContent = work.title;
    $('dialog-description').textContent = work.description || '';
    if (!dialog.open) dialog.showModal();
  }
  $('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  // 作品ごとにコマ内の幅・高さ・寄せ位置・トリミング位置を設定。
  // 配置する「枠」そのものは固定し、内部だけ調整してページ崩れを防ぐ。
  const clamp = (value, fallback, min = 0, max = 100) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
  };
  function applyWorkLayout(el, work) {
    const l = work.layout || {};
    const w = clamp(l.width, 100, 15, 100), h = clamp(l.height, 100, 15, 100);
    const x = clamp(l.left, 0) / 100, y = clamp(l.top, 0) / 100;
    el.style.width = `${w}%`;
    el.style.height = `${h}%`;
    el.style.position = 'relative';
    el.style.left = `calc((100% - ${w}%) * ${x})`;
    el.style.top = `calc((100% - ${h}%) * ${y})`;
    const img = el.querySelector('img');
    if (img) {
      img.style.objectPosition = `${clamp(l.imageX,50)}% ${clamp(l.imageY,50)}%`;
      // 倍率はCSS変数で適用。ホバー中も設定倍率を維持。
      img.style.setProperty('--image-scale', String(clamp(l.imageScale, 1, 1, 3)));
    }
  }
  function tile(work) {
    const b = make('button', 'work-tile');
    b.type = 'button';
    b.setAttribute('aria-label', work.title + 'を拡大');
    const img = make('img'); img.src = work.image; img.alt = work.title; img.loading = 'lazy';
    b.appendChild(img);
    applyWorkLayout(b, work);
    b.addEventListener('click', e => { e.stopPropagation(); openWork(work); });
    return b;
  }
  // 漫画の最後のコマ。文字込みの吹き出しPNGを画像の上に表示する。
  function endingPanel() {
    const panel = make('div', 'ending-panel');
    const img = make('img', 'ending-illustration');
    img.src = config.endingArtwork || 'assets/work-06.svg';
    img.alt = '最後のコマの仮イラスト';
    panel.appendChild(img);
    const bubble = make('div', 'ending-bubble');
    const bubbleImage = make('img');
    bubbleImage.src = 'assets/bubbles/continued.png'; bubbleImage.alt = '';
    bubble.appendChild(bubbleImage);
    panel.appendChild(bubble);
    return panel;
  }
  // 最初の右ページはWORK 01のみ。以後は各ページ2作品ずつ並べる。
  // 最終見開きの左側は『つづく』専用。追加作品を省略しないようページ数を確保。
  const total = Math.max(2, Math.ceil((works.length + 3) / 4));
  let index = 0, busy = false;
  function sheetContent(pageNumber, side) {
    const root = make('div', 'page-layout');
    const meta = make('div', 'page-meta');
    meta.append(make('span', '', side === 'right' ? value('genre', 'MANGA / ILLUSTRATION') : name));
    root.appendChild(meta);
    const start = pageNumber === 0 && side === 'right' ? 0 : (pageNumber * 4 + (side === 'right' ? -1 : 1));
    const count = pageNumber === 0 && side === 'right' ? 1 : 2;
    const isEndingPage = pageNumber === total - 1 && side === 'left';
    const group = isEndingPage ? [] : works.slice(start, start + count);
    if (pageNumber === 0 && side === 'right') {
      const wrap = make('div', 'page-statement');
      wrap.appendChild(make('h2', '', value('coverTitle', 'A WORLD\nIN LINES.')));
      wrap.querySelector('h2').style.whiteSpace = 'pre-line';
      const inner = make('div', 'statement-inner');
      if (group[0]) inner.appendChild(tile(group[0]));
      const aside = make('div', 'statement-aside');
      const captionText = (group[0]?.caption || '').trim();
      if (captionText) aside.appendChild(make('p', 'statement-caption', captionText));
      inner.appendChild(aside);
      wrap.appendChild(inner);
      root.appendChild(wrap);
    } else {
      const grid = make('div', 'work-grid');
      const isLastLeftPage = isEndingPage;
      if (isLastLeftPage) grid.classList.add('last-page-grid');
      group.forEach((work, i) => {
        const item = tile(work);
        // 最終ページは「作品」と「つづく」を別の行に置く。
        // 通常ページにだけ、大きなコマ用の2段跨ぎを適用する。
        if (!isLastLeftPage && group.length < 3 && i === 0) {
          item.style.gridColumn = 'span 2';
          item.style.gridRow = 'span 2';
        }
        grid.appendChild(item);
      });
      if (isLastLeftPage) grid.appendChild(endingPanel());
      if (!group.length && !(pageNumber === total - 1 && side === 'left')) {
        const empty = make('div', 'statement-aside'); grid.appendChild(empty);
      }
      root.appendChild(grid);
    }
    // ページ下の重複する活動名は表示しない（名前はページ上部に表示）
    return root;
  }
  function render() {
    $('left-page').replaceChildren(sheetContent(index, 'left'));
    $('right-page').replaceChildren(sheetContent(index, 'right'));
    $('page-counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    $('prev-btn').disabled = busy || index === 0;
    $('next-btn').disabled = busy || index >= total - 1;
  }
  function changePage(direction) {
    if (busy || index + direction < 0 || index + direction >= total) return;
    busy = true;
    const newIndex = index + direction;
    const sheet = $('flip-sheet');
    // 日本の漫画と同じ右開き。左ページを右側へめくり、次の見開きを表示。
    $('flip-front').replaceChildren(sheetContent(direction > 0 ? index : newIndex, 'left'));
    $('flip-back').replaceChildren(sheetContent(direction > 0 ? newIndex : index, 'right'));
    sheet.className = 'flip-sheet active ' + (direction > 0 ? 'forward' : 'backward');
    // 影に隠れるページはアニメーション開始時に先に切り替える。
    if (direction > 0) $('left-page').replaceChildren(sheetContent(newIndex, 'left'));
    else $('right-page').replaceChildren(sheetContent(newIndex, 'right'));
    $('prev-btn').disabled = $('next-btn').disabled = true;
    const finish = () => { sheet.className = 'flip-sheet'; index = newIndex; busy = false; render(); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else sheet.addEventListener('animationend', finish, {once:true});
  }
  $('next-btn').addEventListener('click', () => changePage(1));
  $('prev-btn').addEventListener('click', () => changePage(-1));
  $('left-page').addEventListener('click', e => { if (!e.target.closest('button')) changePage(1); });
  $('right-page').addEventListener('click', e => { if (!e.target.closest('button')) changePage(-1); });
  document.addEventListener('keydown', e => {
    if (dialog.open || window.innerWidth <= 700 || ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft') changePage(1);
    if (e.key === 'ArrowRight') changePage(-1);
  });
  render();
  const mobile = $('mobile-comic');
  works.forEach((work, i) => {
    const page = make('article', 'comic-page');
    page.appendChild(make('div', 'comic-meta', value('genre', 'MANGA / ILLUSTRATION')));
    const btn = make('button', 'comic-panel'); btn.type = 'button'; btn.setAttribute('aria-label', work.title + 'を拡大');
    const img = make('img'); img.src = work.image; img.alt = work.title; img.loading = i === 0 ? 'eager' : 'lazy';
    btn.appendChild(img); btn.addEventListener('click', () => openWork(work));
    page.appendChild(btn);
    if (work.caption && work.caption.trim()) page.appendChild(make('p', 'comic-work-caption', work.caption));
    mobile.appendChild(page);
  });
  const endingMobile = make('article', 'comic-page mobile-ending');
  endingMobile.appendChild(endingPanel());
  mobile.appendChild(endingMobile);
})();
