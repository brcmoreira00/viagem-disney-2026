const STORAGE_KEY = 'orlando2026-state-v1';
const BASE_KEY = 'orlando2026-base-v1';
const BASE_META_KEY = 'orlando2026-base-meta-v1';
const TRIP_START = '2026-10-30';
const TRIP_END = '2026-11-14';
const PARK_ALIASES = {
  'Magic Kingdom': ['Magic Kingdom'],
  'Hollywood Studios': ['Hollywood Studios'],
  'Animal Kingdom': ['Animal Kingdom'],
  EPCOT: ['EPCOT'],
  Epcot: ['EPCOT'],
  'Epic Universe': ['Epic Universe'],
  'SeaWorld Orlando': ['SeaWorld Orlando'],
  'LEGOLAND Florida': ['LEGOLAND Florida'],
  'Universal Studios + Islands': ['Universal Studios Florida', 'Islands of Adventure'],
};

let seed;
let packagedSeed;
let state;
let strategyKb;
let deferredPrompt;
let activeTodayPark = null;
let parkStrategyOpen = false;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

async function init() {
  packagedSeed = await fetch('./data.json').then((r) => r.json());
  seed = loadBase(packagedSeed);
  strategyKb = await fetch('./strategy-kb.json').then((r) => r.json()).catch(() => null);
  state = loadState();
  wireTabs();
  populateDates();
  populateParks();
  wireEvents();
  renderAll();
  registerSW();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneData(seed);
  try {
    return mergeSeedWithLocal(cloneData(seed), JSON.parse(raw));
  } catch {
    return cloneData(seed);
  }
}

function loadBase(fallback) {
  const raw = localStorage.getItem(BASE_KEY);
  if (!raw) return cloneData(fallback);
  try {
    const parsed = JSON.parse(raw);
    return validateTripData(parsed) ? parsed : cloneData(fallback);
  } catch {
    return cloneData(fallback);
  }
}

function validateTripData(data) {
  return Boolean(
    data &&
      Array.isArray(data.itinerary) &&
      Array.isArray(data.attractions) &&
      data.attractions.every((a) => a.id && a.name && a.park),
  );
}

function mergeSeedWithLocal(base, local) {
  if (!local?.attractions) return base;
  const localById = new Map(local.attractions.map((a) => [a.id, a]));
  base.attractions = base.attractions.map((attraction) => {
    const saved = localById.get(attraction.id);
    if (!saved) return attraction;
    return {
      ...attraction,
      status: saved.status || attraction.status,
      reservationKind: saved.reservationKind ?? attraction.reservationKind,
      reservationTime: saved.reservationTime ?? attraction.reservationTime,
      notes: saved.notes ?? attraction.notes,
    };
  });
  return base;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

function persistAndRebuild() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  activeTodayPark = null;
  populateDates();
  populateParks();
  renderAll();
}

function editableProgress(source) {
  return {
    attractions: (source?.attractions || []).map((attraction) => ({
      id: attraction.id,
      status: attraction.status,
      reservationKind: attraction.reservationKind,
      reservationTime: attraction.reservationTime,
      notes: attraction.notes,
    })),
  };
}

function wireTabs() {
  $$('.tabs button').forEach((button) => {
    button.onclick = () => {
      $$('.tabs button').forEach((x) => x.classList.remove('active'));
      $$('.panel').forEach((x) => x.classList.remove('active'));
      button.classList.add('active');
      $(`#${button.dataset.tab}`).classList.add('active');
      renderAll();
    };
  });
}

function populateDates() {
  const select = $('#dateSelect');
  select.innerHTML = state.itinerary
    .filter((x) => x.event)
    .map((x) => `<option value="${x.date}">${fmtDate(x.date)} - ${esc(x.event)}</option>`)
    .join('');

  const today = todayKey();
  const officialToday = state.itinerary.find((x) => x.date === today && x.event);
  const magicKingdom = state.itinerary.find((x) => x.event?.includes('Magic Kingdom'));
  select.value = officialToday?.date || magicKingdom?.date || select.options[0]?.value || '';
}

function populateParks() {
  const parks = [...new Set(state.attractions.map((a) => a.park))].sort();
  $('#parkSelect').innerHTML = parks.map((p) => `<option>${esc(p)}</option>`).join('');
}

function wireEvents() {
  $('#dateSelect').onchange = () => {
    activeTodayPark = null;
    renderToday();
  };
  $('#parkSelect').onchange = () => {
    parkStrategyOpen = false;
    renderParks();
  };
  $('#statusFilter').onchange = renderParks;
  $('#search').oninput = renderParks;
  $('#nowBtn').onclick = showNowRecommendation;
  $('#parkStrategyToggle').onclick = () => {
    parkStrategyOpen = !parkStrategyOpen;
    renderParks();
  };
  $('#exportBtn').onclick = () => download('orlando-2026-backup.json', JSON.stringify(state, null, 2));
  $('#exportBaseBtn').onclick = () => download('orlando-2026-base-atual.json', JSON.stringify(seed, null, 2));
  $('#importInput').onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state = mergeSeedWithLocal(cloneData(seed), JSON.parse(await file.text()));
      save();
    } catch {
      alert('Arquivo inválido');
    } finally {
      event.target.value = '';
    }
  };
  $('#baseInput').onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const nextBase = JSON.parse(await file.text());
      if (!validateTripData(nextBase)) throw new Error('invalid-base');
      const currentProgress = editableProgress(state);
      seed = nextBase;
      state = mergeSeedWithLocal(cloneData(seed), currentProgress);
      localStorage.setItem(BASE_KEY, JSON.stringify(seed));
      localStorage.setItem(BASE_META_KEY, JSON.stringify({ fileName: file.name, updatedAt: new Date().toISOString() }));
      persistAndRebuild();
      alert('Base atualizada. Seu progresso local foi preservado quando os IDs das atrações eram os mesmos.');
    } catch {
      alert('Base inválida. Importe um JSON com itinerary e attractions.');
    } finally {
      event.target.value = '';
    }
  };
  $('#resetBtn').onclick = () => {
    if (confirm('Apagar status, reservas, horários e notas locais desta base?')) {
      state = cloneData(seed);
      persistAndRebuild();
    }
  };
  $('#packagedBaseBtn').onclick = () => {
    if (confirm('Voltar para o data.json original do app? Isso também apaga o progresso local atual.')) {
      localStorage.removeItem(BASE_KEY);
      localStorage.removeItem(BASE_META_KEY);
      seed = cloneData(packagedSeed);
      state = cloneData(seed);
      persistAndRebuild();
    }
  };
  $('#saveEdit').onclick = (event) => {
    event.preventDefault();
    const attraction = getAttraction($('#editId').value);
    if (!attraction) return;
    attraction.reservationKind = $('#reservationKind').value || null;
    attraction.reservationTime = $('#reservationTime').value || null;
    attraction.status = $('#editStatus').value;
    if (attraction.status === 'nao feito' && (attraction.reservationKind || attraction.reservationTime)) {
      attraction.status = 'reservado';
    }
    attraction.notes = $('#notes').value;
    $('#editDialog').close();
    save();
  };
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    $('#installBtn').hidden = false;
  });
  $('#installBtn').onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
    $('#installBtn').hidden = true;
  };
}

function renderAll() {
  renderToday();
  renderParks();
  renderReservations();
  renderDataInfo();
  renderOfflineInfo();
}

function renderToday() {
  const date = $('#dateSelect').value;
  const day = state.itinerary.find((x) => x.date === date);
  if (!day) return;

  $('#subtitle').textContent = `${fmtDate(date)} | ${day.event}`;
  $('#dayCard').innerHTML = dayCard(day);

  const parks = eventToParks(day.event);
  activeTodayPark = parks.includes(activeTodayPark) ? activeTodayPark : parks[0] || null;
  renderParkSwitch(parks);

  const list = activeTodayPark ? state.attractions.filter((a) => a.park === activeTodayPark) : [];
  const counts = countStatuses(list);
  $('#progress').innerHTML = list.length ? progressMarkup(counts, list.length) : '';

  const recommended = recommend(list, date);
  $('#nowSummary').innerHTML = recommended.length ? nowSummary(recommended[0], date) : '';
  renderStrategyPanel(activeTodayPark, list, recommended);
  renderDonePanel(activeTodayPark, '#todayDonePanel');
  $('#recommendations').innerHTML = list.length
    ? groupedTodayCards(list, recommended, date)
    : `<div class="empty">Dia sem parque cadastrado.</div>`;
}

function dayCard(day) {
  const meals = day.breakfast || day.lunch || day.dinner;
  return `<div class="card day-card">
    <div>
      <h1 class="day-title">${esc(day.event)}</h1>
      <div class="muted">${fmtDate(day.date)}</div>
    </div>
    ${day.todo ? `<p class="timeline"><strong>Plano:</strong>\n${esc(day.todo)}</p>` : ''}
    ${
      meals
        ? `<div class="meal-grid">
          <span><strong>Cafe</strong>${esc(day.breakfast || '-')}</span>
          <span><strong>Almoco</strong>${esc(day.lunch || '-')}</span>
          <span><strong>Jantar</strong>${esc(day.dinner || '-')}</span>
        </div>`
        : ''
    }
  </div>`;
}

function renderParkSwitch(parks) {
  const switcher = $('#parkSwitch');
  if (parks.length <= 1) {
    switcher.innerHTML = '';
    switcher.hidden = true;
    return;
  }
  switcher.hidden = false;
  switcher.innerHTML = parks
    .map(
      (park) =>
        `<button class="${park === activeTodayPark ? 'active' : ''}" onclick="setTodayPark('${escAttr(park)}')">${esc(shortParkName(park))}</button>`,
    )
    .join('');
}

function groupedTodayCards(fullList, recommended, date) {
  const ranked = new Map(recommended.map((a, index) => [a.id, index]));
  const byRecommendation = (a, b) =>
    (ranked.get(a.id) ?? 9999) - (ranked.get(b.id) ?? 9999) ||
    (a.ranking ?? 99) - (b.ranking ?? 99) ||
    a.name.localeCompare(b.name);
  const pending = fullList.filter((a) => !['feito', 'pular'].includes(a.status)).sort(byRecommendation);
  const skipped = fullList.filter((a) => a.status === 'pular').sort(byRecommendation);
  const done = fullList.filter((a) => a.status === 'feito').sort(byRecommendation);
  const sections = [
    ['Reservas proximas', pending.filter((a) => isReservationSoon(a, date))],
    ['Obrigatorias primeiro', pending.filter((a) => !isReservationSoon(a, date) && a.priority === 'obrigatoria')],
    ['Se der tempo', pending.filter((a) => !isReservationSoon(a, date) && a.priority === 'se der tempo')],
    ['Demais atrações', pending.filter((a) => !isReservationSoon(a, date) && !['obrigatoria', 'se der tempo'].includes(a.priority))],
    ['Marcadas para pular', skipped],
    ['Feitas', done],
  ].filter(([, items]) => items.length);

  return sections
    .map(
      ([title, items]) =>
        `<div class="rec-group"><h3>${title}</h3><div class="stack">${items.map((a) => card(a, { date })).join('')}</div></div>`,
    )
    .join('');
}

function renderStrategyPanel(park, parkList, recommended) {
  const panel = $('#strategyPanel');
  if (!panel) return;
  const kb = getParkStrategy(park);
  if (!park || !kb || !parkList.length) {
    panel.innerHTML = '';
    return;
  }

  const nextArea = nextStrategicArea(kb, parkList);
  const nextPicks = recommended.slice(0, 3).map((a) => a.name);
  const primary = nextPicks[0] || 'Sem sugestao pendente';
  const passNote = (kb.passStrategy || [])[0] || 'Use reservas como ancoras do roteiro.';

  panel.innerHTML = `<section class="strategy-card">
    <div class="strategy-head">
      <div>
        <span class="eyebrow">Roteiro sugerido</span>
        <strong>${esc(park)}</strong>
      </div>
      ${nextArea ? `<span class="badge blue">${esc(nextArea)}</span>` : ''}
    </div>
    <p>${esc(kb.summary)}</p>
    <div class="strategy-next">
      <span><strong>Agora</strong>${esc(primary)}</span>
      ${nextPicks[1] ? `<span><strong>Depois</strong>${esc(nextPicks[1])}</span>` : ''}
      ${nextPicks[2] ? `<span><strong>Na sequencia</strong>${esc(nextPicks[2])}</span>` : ''}
    </div>
    <div class="muted">${esc(passNote)}</div>
  </section>`;
}

function nextStrategicArea(kb, parkList) {
  return (kb.areaFlow || []).find((area) =>
    parkList.some((a) => a.area === area && !['feito', 'pular'].includes(a.status)),
  );
}

function progressMarkup(counts, total) {
  const percent = total ? Math.round((counts.feito / total) * 100) : 0;
  return `<span>${counts.feito}/${total} feitas</span><div class="progress-bar" aria-label="${percent}% concluido"><i style="width:${percent}%"></i></div>`;
}

function countStatuses(list) {
  return list.reduce(
    (acc, attraction) => {
      acc[attraction.status] = (acc[attraction.status] || 0) + 1;
      return acc;
    },
    { feito: 0, reservado: 0, 'nao feito': 0, pular: 0 },
  );
}

function recommend(list, date) {
  const pscore = { obrigatoria: 0, 'se der tempo': 20, 'pode pular': 55, 'sem prioridade': 35 };
  const parkStrategy = getParkStrategy(list[0]?.park);
  return list
    .filter((a) => !['feito', 'pular'].includes(a.status))
    .map((a) => {
      let score = pscore[a.priority] ?? 30;
      score += (a.ranking ?? 3) * 5;
      score += strategyScore(a, parkStrategy);
      if (a.status === 'reservado') score -= 12;
      if (isReservationSoon(a, date)) score -= 35;
      if (a.reservationTime && !isReservationSoon(a, date)) score -= 6;
      return { ...a, _score: score };
    })
    .sort((a, b) => a._score - b._score || (a.ranking ?? 9) - (b.ranking ?? 9) || a.name.localeCompare(b.name));
}

function strategyScore(attraction, parkStrategy) {
  if (!parkStrategy) return 0;
  let score = 0;
  const anchorIndex = (parkStrategy.anchors || []).findIndex((name) => sameAttractionName(name, attraction.name));
  if (anchorIndex >= 0) score -= Math.max(4, 14 - anchorIndex * 2);
  const areaIndex = (parkStrategy.areaFlow || []).findIndex((area) => area === attraction.area);
  if (areaIndex >= 0) score += areaIndex * 2;
  return score;
}

function nowSummary(attraction, date) {
  const reason = isReservationSoon(attraction, date)
    ? `Reserva ${attraction.reservationTime}`
    : attraction.priority === 'obrigatoria'
      ? 'Obrigatoria da familia'
      : 'Melhor ranking disponivel';
  return `<div class="now-pick">
    <div>
      <span class="eyebrow">Sugestao agora</span>
      <strong>${esc(attraction.name)}</strong>
      <small>${esc(reason)}${attraction.area ? ` | ${esc(attraction.area)}` : ''}</small>
    </div>
    <button onclick="quickDone('${escAttr(attraction.id)}')">Marcar feito</button>
  </div>`;
}

function showNowRecommendation() {
  const date = $('#dateSelect').value;
  const list = activeTodayPark ? state.attractions.filter((a) => a.park === activeTodayPark) : [];
  const next = recommend(list, date)[0];
  if (!next) {
    $('#nowSummary').innerHTML = `<div class="empty compact">Nada pendente para recomendar neste parque.</div>`;
    return;
  }
  $('#nowSummary').innerHTML = nowSummary(next, date);
  document.querySelector('#nowSummary .now-pick')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderParks() {
  const park = $('#parkSelect').value;
  const status = $('#statusFilter').value;
  const query = $('#search').value.trim().toLowerCase();
  let list = state.attractions.filter((a) => a.park === park);
  renderParkStrategySummary(park);
  renderDonePanel(park, '#donePanel');
  if (status !== 'all') list = list.filter((a) => a.status === status);
  if (query) list = list.filter((a) => searchableText(a).includes(query));
  list.sort((a, b) => (a.ranking ?? 9) - (b.ranking ?? 9) || a.name.localeCompare(b.name));
  $('#attractionList').innerHTML = list.length
    ? list.map((a) => card(a, { showFullDetails: true })).join('')
    : `<div class="empty">Nenhuma atração encontrada.</div>`;
}

function renderParkStrategySummary(park) {
  const button = $('#parkStrategyToggle');
  const panel = $('#parkStrategyPanel');
  if (!button || !panel) return;

  const kb = getParkStrategy(park);
  if (!kb) {
    button.hidden = true;
    panel.innerHTML = '';
    return;
  }

  button.hidden = false;
  button.textContent = parkStrategyOpen ? 'Fechar resumo do roteiro' : 'Ver resumo do roteiro';

  if (!parkStrategyOpen) {
    panel.innerHTML = '';
    return;
  }

  panel.innerHTML = `<section class="strategy-card park-summary">
    <div class="strategy-head">
      <div>
        <span class="eyebrow">Resumo do roteiro</span>
        <strong>${esc(park)}</strong>
      </div>
      <span class="badge blue">${kb.sourceUrls?.length || 0} fontes</span>
    </div>
    <p>${esc(kb.summary)}</p>
    <div class="strategy-list">
      ${summaryBlock('Chegada', kb.arrivalStrategy)}
      ${summaryBlock('Áreas', kb.areaFlow)}
      ${summaryBlock('Âncoras', kb.anchors)}
      ${summaryBlock('Passes', kb.passStrategy)}
    </div>
  </section>`;
}

function summaryBlock(title, items = []) {
  const visible = items.slice(0, 4);
  if (!visible.length) return '';
  return `<div class="summary-block">
    <strong>${esc(title)}</strong>
    <ul>${visible.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
  </div>`;
}

function renderDonePanel(park, targetSelector) {
  const target = $(targetSelector);
  if (!target) return;
  if (!park) {
    target.innerHTML = '';
    return;
  }
  const done = state.attractions
    .filter((a) => a.park === park && a.status === 'feito')
    .sort((a, b) => (a.ranking ?? 9) - (b.ranking ?? 9) || a.name.localeCompare(b.name));

  target.innerHTML = done.length
    ? `<section class="done-panel">
        <div class="done-panel-title">
          <div>
            <span class="eyebrow">Feitas neste parque</span>
            <strong>${done.length} neste parque</strong>
          </div>
          <span class="muted">Toque em desfazer se marcou errado</span>
        </div>
        <div class="done-list">${done.map(doneRow).join('')}</div>
      </section>`
    : `<section class="done-panel is-empty">
        <div class="done-panel-title">
          <div>
            <span class="eyebrow">Feitas neste parque</span>
            <strong>Nenhuma ainda</strong>
          </div>
          <span class="muted">Quando marcar algo como feito, aparece aqui para desfazer</span>
        </div>
      </section>`;
}

function doneRow(attraction) {
  return `<article class="done-row">
    <div>
      <strong>${esc(attraction.name)}</strong>
      <small>${attraction.area ? esc(attraction.area) : esc(attraction.park)}${attraction.ranking != null ? ` | ranking ${String(attraction.ranking).replace('.', ',')}` : ''}</small>
    </div>
    <button class="secondary" onclick="undoDone('${escAttr(attraction.id)}')">Desfazer</button>
  </article>`;
}

function renderReservations() {
  const list = state.attractions
    .filter((a) => a.reservationTime || a.reservationKind || a.status === 'reservado')
    .sort(
      (a, b) =>
        (a.reservationTime || '99:99').localeCompare(b.reservationTime || '99:99') ||
        a.park.localeCompare(b.park) ||
        a.name.localeCompare(b.name),
    );
  $('#reservationList').innerHTML = list.length
    ? list.map((a) => card(a, { showFullDetails: true, reservationView: true })).join('')
    : `<div class="empty">Nenhuma reserva cadastrada.</div>`;
}

function renderDataInfo() {
  const target = $('#baseInfo');
  if (!target) return;
  const meta = readBaseMeta();
  const parks = new Set(seed.attractions.map((a) => a.park)).size;
  const source = meta ? `Importada de ${meta.fileName}` : 'Arquivo data.json original do app';
  const updated = meta ? ` em ${fmtDateTime(meta.updatedAt)}` : '';
  target.innerHTML = `<div><strong>${esc(source)}${esc(updated)}</strong></div>
    <div>${seed.itinerary.length} dias no roteiro | ${seed.attractions.length} atrações | ${parks} parques</div>`;
}

function renderOfflineInfo() {
  const target = $('#offlineInfo');
  if (!target) return;
  const secure = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  const swSupported = 'serviceWorker' in navigator;
  const controlled = Boolean(navigator.serviceWorker?.controller);
  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const status = navigator.onLine ? 'online agora' : 'offline agora';
  const cacheStatus = !secure
    ? 'precisa de HTTPS para cache offline no iPhone'
    : !swSupported
      ? 'service worker indisponível neste navegador'
      : controlled
        ? 'cache offline ativo'
        : 'cache sendo preparado; recarregue após o primeiro acesso online';

  target.innerHTML = `<div><strong>${esc(cacheStatus)}</strong></div>
    <div>${esc(status)} | ${installed ? 'instalado na tela inicial' : 'abra pelo Safari e adicione à Tela de Início'}</div>`;
}

function readBaseMeta() {
  try {
    return JSON.parse(localStorage.getItem(BASE_META_KEY));
  } catch {
    return null;
  }
}

function card(attraction, options = {}) {
  const done = attraction.status === 'feito';
  const soon = options.date && isReservationSoon(attraction, options.date);
  const itemClass = ['item', done ? 'done' : '', soon ? 'soon' : ''].filter(Boolean).join(' ');
  const actionLabel = done ? 'Desfazer' : 'Feito';
  const action = done ? 'undoDone' : 'quickDone';
  return `<article class="${itemClass}">
    <div class="item-top">
      <div>
        <h3>${esc(attraction.name)}</h3>
        <div class="muted">${esc(attraction.park)}${attraction.area ? ` | ${esc(attraction.area)}` : ''}</div>
      </div>
      ${attraction.ranking != null ? `<div class="score" aria-label="ranking">${String(attraction.ranking).replace('.', ',')}</div>` : ''}
    </div>
    <div class="badges">
      <span class="badge ${priorityClass(attraction.priority)}">${esc(attraction.priority || 'sem prioridade')}</span>
      ${passBadge(attraction)}
      ${reservationBadge(attraction, soon)}
      ${attraction.minHeight ? `<span class="badge">${esc(attraction.minHeight)}</span>` : ''}
      <span class="badge status">${esc(statusLabel(attraction.status))}</span>
    </div>
    ${options.showFullDetails ? details(attraction) : compactDetails(attraction)}
    <div class="item-actions">
      <button onclick="${action}('${escAttr(attraction.id)}')">${actionLabel}</button>
      <button class="secondary" onclick="markSkip('${escAttr(attraction.id)}')">Pular</button>
      <button class="secondary" onclick="quickReserve('${escAttr(attraction.id)}')">Reserva</button>
      <button class="secondary icon-btn" onclick="editAttraction('${escAttr(attraction.id)}')" aria-label="Editar ${escAttr(attraction.name)}">Editar</button>
    </div>
  </article>`;
}

function details(attraction) {
  const ratings = familyRatings(attraction);
  const restrictions = attraction.restrictions
    ? Object.entries(attraction.restrictions)
        .filter(([, value]) => value)
        .map(([key]) => restrictionLabel(key))
        .join(', ')
    : '';
  return `<div class="detail-grid">
    ${ratings ? `<span><strong>Familia</strong>${ratings}</span>` : ''}
    ${restrictions ? `<span><strong>Restricoes</strong>${esc(restrictions)}</span>` : ''}
    ${attraction.notes ? `<span><strong>Notas</strong>${esc(attraction.notes)}</span>` : ''}
  </div>`;
}

function compactDetails(attraction) {
  const pieces = [];
  if (attraction.notes) pieces.push(`Notas: ${attraction.notes}`);
  if (attraction.showOrParade) pieces.push('Show/parada');
  if (attraction.familyFriendly) pieces.push('Boa para familia');
  return `${familyRatings(attraction, true)}${pieces.length ? `<div class="muted">${esc(pieces.join(' | '))}</div>` : ''}`;
}

function familyRatings(attraction, compact = false) {
  if (!attraction.ratings) return '';
  const ratings = Object.entries(attraction.ratings)
    .map(([name, value]) => `${esc(name)} ${String(value).replace('.', ',')}`)
    .join(' | ');
  return compact ? `<div class="family-ratings">${ratings}</div>` : ratings;
}

function passBadge(attraction) {
  const type = attraction.reservationKind || attraction.passType;
  if (!type) return '';
  return `<span class="badge blue">${esc(type)}</span>`;
}

function reservationBadge(attraction, soon) {
  if (!attraction.reservationTime && !attraction.reservationKind) return '';
  const label = [attraction.reservationTime, attraction.reservationKind].filter(Boolean).join(' | ');
  return `<span class="badge ${soon ? 'hot' : 'blue'}">${esc(label)}</span>`;
}

function isReservationSoon(attraction, date) {
  if (!attraction.reservationTime) return false;
  const today = todayKey();
  if (date !== today) return false;
  const [hour, minute] = attraction.reservationTime.split(':').map(Number);
  const reservationMinutes = hour * 60 + minute;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const delta = reservationMinutes - currentMinutes;
  return delta >= -30 && delta <= 120;
}

function eventToParks(event = '') {
  const found = Object.entries(PARK_ALIASES).find(([label]) => event.includes(label));
  if (found) return found[1].filter((park) => state.attractions.some((a) => a.park === park));
  const lower = event.toLowerCase();
  if (lower.includes('epcot')) return ['EPCOT'];
  return [];
}

function getParkStrategy(park) {
  if (!park || !strategyKb?.parks) return null;
  return strategyKb.parks[park] || strategyKb.parks[parkNameAlias(park)] || null;
}

function parkNameAlias(park) {
  return {
    EPCOT: 'EPCOT',
    Epcot: 'EPCOT',
    'SeaWorld Orlando': 'SeaWorld Orlando',
    SeaWorld: 'SeaWorld Orlando',
    'Island of adventure': 'Islands of Adventure',
    'Universal Studios Orlando': 'Universal Studios Florida',
    Legoland: 'LEGOLAND Florida',
  }[park] || park;
}

function sameAttractionName(a, b) {
  return normalizeName(a) === normalizeName(b) || normalizeName(a).includes(normalizeName(b)) || normalizeName(b).includes(normalizeName(a));
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function searchableText(attraction) {
  return [attraction.name, attraction.park, attraction.area, attraction.priority, attraction.passType, attraction.reservationKind]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getAttraction(id) {
  return state.attractions.find((x) => x.id === id);
}

function updateStatus(id, status) {
  const attraction = getAttraction(id);
  if (!attraction) return;
  attraction.status = status;
  save();
}

window.setTodayPark = (park) => {
  activeTodayPark = park;
  renderToday();
};
window.quickDone = (id) => updateStatus(id, 'feito');
window.undoDone = (id) => updateStatus(id, 'nao feito');
window.markSkip = (id) => updateStatus(id, 'pular');
window.quickReserve = (id) => {
  const attraction = getAttraction(id);
  if (!attraction) return;
  attraction.status = 'reservado';
  editAttraction(id);
};
window.editAttraction = (id) => {
  const attraction = getAttraction(id);
  $('#editId').value = id;
  $('#editTitle').textContent = attraction.name;
  $('#editStatus').value = attraction.status;
  $('#reservationKind').value = attraction.reservationKind || '';
  $('#reservationTime').value = attraction.reservationTime || '';
  $('#notes').value = attraction.notes || '';
  $('#editDialog').showModal();
};

function priorityClass(priority) {
  if (priority === 'obrigatoria') return 'green';
  if (priority === 'se der tempo') return 'yellow';
  return 'red';
}

function statusLabel(status) {
  return { 'nao feito': 'não feito', reservado: 'reservado', feito: 'feito', pular: 'pular' }[status] || status;
}

function restrictionLabel(key) {
  return {
    pregnancy: 'gravidez',
    heart: 'coração',
    motionSickness: 'enjoo',
    dark: 'escuro',
    smallChildren: 'criancas pequenas',
  }[key] || key;
}

function shortParkName(park) {
  return park === 'Universal Studios Florida' ? 'Universal Studios' : park;
}

function todayKey() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const key = `${yyyy}-${mm}-${dd}`;
  return key >= TRIP_START && key <= TRIP_END ? key : '2026-11-04';
}

function fmtDate(s) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date(`${s}T12:00:00`));
}

function fmtDateTime(s) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(s));
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function escAttr(value) {
  return esc(value).replace(/'/g, '&#39;');
}

function download(name, text) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function registerSW() {
  if (!('serviceWorker' in navigator)) {
    renderOfflineInfo();
    return;
  }
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(() => navigator.serviceWorker.ready)
    .then(() => renderOfflineInfo())
    .catch(() => renderOfflineInfo());
  window.addEventListener('online', renderOfflineInfo);
  window.addEventListener('offline', renderOfflineInfo);
}

init();
