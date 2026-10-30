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
const DISNEY_LL_RULES = {
  updatedAt: '2026-10-11',
  source: 'Walt Disney World - Lightning Lane passes',
  sourceUrl: 'https://disneyworld.disney.go.com/lightning-lane-passes/',
  notes: [
    'Multi Pass permite escolher ate 3 experiencias e janelas de chegada antes da visita.',
    'Magic Kingdom, EPCOT e Hollywood Studios usam grupos: ate 1 do Grupo 1 e as outras 2 do Grupo 2; tambem pode escolher as 3 do Grupo 2.',
    'Animal Kingdom nao tem grupos no Multi Pass.',
    'Single Pass e vendido separadamente para as atracoes mais concorridas, nao incluidas no Multi Pass.',
    'No dia do parque, depois de usar uma selecao Multi Pass ou passar a janela, e possivel escolher outra experiencia sujeita a disponibilidade.',
  ],
  parks: {
    'Magic Kingdom': {
      single: ['Seven Dwarfs Mine Train', 'TRON Lightcycle / Run'],
      group1: ['Big Thunder Mountain Railroad', 'Jungle Cruise', 'Peter Pan’s Flight', 'Space Mountain', 'Tiana’s Bayou Adventure'],
      group2: [
        'The Barnstormer',
        "Buzz Lightyear's Space Ranger Spin",
        'Dumbo the Flying Elephant',
        'Haunted Mansion',
        '“it’s a small world”',
        'Mad Tea Party',
        'The Magic Carpets of Aladdin',
        'The Many Adventures of Winnie the Pooh',
        'Mickey’s PhilharMagic',
        'Monsters Inc. Laugh Floor',
        'Pirates of the Caribbean',
        'Tomorrowland Speedway',
        'Under the Sea ~ Journey of The Little Mermaid',
      ],
    },
    EPCOT: {
      single: ['Guardians of the Galaxy: Cosmic Rewind'],
      group1: ['Frozen Ever After', 'Remy’s Ratatouille Adventure', 'Test Track'],
      group2: [
        'Disney and Pixar Short Film Festival',
        'Journey Into Imagination With Figment',
        'Living with the Land',
        'Mission: SPACE',
        'The Seas with Nemo & Friends',
        "Soarin' Across America",
        'Spaceship Earth',
        'Turtle Talk With Crush',
      ],
    },
    'Hollywood Studios': {
      single: ['Star Wars: Rise of the Resistance'],
      group1: [
        'Mickey & Minnie’s Runaway Railway',
        'Millennium Falcon: Smugglers Run',
        "Rock 'n' Roller Coaster Starring The Muppets",
        'Slinky Dog Dash',
      ],
      group2: [
        'Alien Swirling Saucers',
        'Beauty and the Beast Live on Stage',
        'Disney Jr. Mickey Mouse Clubhouse Live!',
        'For the First Time in Forever: A Frozen Sing-Along Celebration',
        'Indiana Jones™ Epic Stunt Spectacular!',
        'The Little Mermaid – A Musical Adventure',
        'Star Tours – The Adventures Continue',
        'Toy Story Mania!',
        'The Twilight Zone™ Tower of Terror',
      ],
    },
    'Animal Kingdom': {
      single: ['Avatar Flight of Passage'],
      group1: [],
      group2: [
        'Expedition Everest – Legend of the Forbidden Mountain',
        'Feathered Friends in Flight!',
        'Festival of the Lion King',
        'Finding Nemo: The Big Blue... and Beyond!',
        'Kali River Rapids',
        'Kilimanjaro Safaris',
        'Naʻvi River Journey',
        'Zootopia: Better Zoogether!',
      ],
      noGroups: true,
    },
  },
};
const UNIVERSAL_EXPRESS_RULES = {
  updatedAt: '2026-10-11',
  source: 'Universal Orlando - Universal Express Passes',
  sourceUrl: 'https://www.universalorlando.com/web/en/us/tickets-packages/express-passes/',
  notes: [
    'Universal Express permite entrar uma vez na fila Express de cada atracao participante.',
    'Universal Express Unlimited permite entrar multiplas vezes, mas esta disponivel apenas para Universal Studios Florida e Islands of Adventure.',
    'Universal Express em Epic Universe existe como passe de uma vez por atracao participante; Unlimited nao esta disponivel neste parque.',
    'A lista oficial informa que Hagrid’s Magical Creatures Motorbike Adventure, Pteranodon Flyers e Dragon Racer’s Rally nao participam do Express.',
  ],
  parks: {
    'Universal Studios Florida': {
      label: 'Express + Unlimited',
      attractions: [
        'Animal Actors on Location!',
        'Despicable Me Minion Mayhem',
        'DreamWorks Imagination Celebration',
        'E.T. Adventure',
        'Fast & Furious – Supercharged',
        'Harry Potter and the Escape from Gringotts',
        'Hogwarts Express',
        "Illumination's Villain-Con Minion Blast",
        "Kang & Kodos' Twirl 'n' Hurl",
        'MEN IN BLACK Alien Attack',
        'Race Through New York Starring Jimmy Fallon',
        'Revenge of the Mummy',
        'The Bourne Stuntacular',
        'The Simpsons Ride',
        'Transformers: The Ride-3D',
        'Trolls Trollercoaster',
        'Universal Horror Make-Up Show',
      ],
    },
    'Islands of Adventure': {
      label: 'Express + Unlimited',
      attractions: [
        'Caro-Seuss-el',
        'Doctor Doom’s Fearfall',
        'Dudley Do-Right’s Ripsaw Falls',
        'Flight of the Hippogriff',
        'Harry Potter and the Forbidden Journey',
        'Hogwarts Express',
        'Jurassic Park River Adventure',
        'Jurassic World VelociCoaster',
        'One Fish, Two Fish, Red Fish, Blue Fish',
        "Popeye & Bluto's Bilge-Rat Barges",
        'Skull Island: Reign of Kong',
        'Storm Force Accelatron',
        'The Amazing Adventures of Spider-Man',
        'The Cat in the Hat',
        'The High in the Sky Seuss Trolley Train Ride!',
        'The Incredible Hulk Coaster',
      ],
    },
    'Epic Universe': {
      label: 'Express',
      attractions: [
        'Constellation Carousel',
        'Curse of the Werewolf',
        'Fyre Drill',
        'Harry Potter and the Battle at the Ministry',
        'Hiccup’s Wing Gliders',
        'Le Cirque Arcanus',
        'Mario Kart: Bowser’s Challenge',
        'Mine-Cart Madness',
        'Monsters Unchained: The Frankenstein Experiment',
        'Stardust Racers',
        'The Untrainable Dragon',
        'Yoshi’s Adventure',
      ],
    },
  },
};
const PARK_MAPS = {
  'Animal Kingdom': 'Mapas dos Parques/Mapa Animal Kingdom.pdf',
  EPCOT: 'Mapas dos Parques/Mapa Epcot.pdf',
  'Epic Universe': 'Mapas dos Parques/Mapa Epic Universe.pdf',
  'Hollywood Studios': 'Mapas dos Parques/Mapa Hollywood Studios.pdf',
  'Islands of Adventure': 'Mapas dos Parques/Mapa Island of Adventure.pdf',
  'LEGOLAND Florida': 'Mapas dos Parques/Mapa Legoland.pdf',
  'Magic Kingdom': 'Mapas dos Parques/Mapa Magic Kingdom.pdf',
  'SeaWorld Orlando': 'Mapas dos Parques/Mapa Seaworld.pdf',
  'Universal Studios Florida': 'Mapas dos Parques/Mapa Universal Studios.pdf',
};

let seed;
let packagedSeed;
let state;
let strategyKb;
let deferredPrompt;
let activeTodayPark = null;
let parkStrategyOpen = false;
let todayFilter = 'all';
let undoTimer;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

async function init() {
  packagedSeed = await fetch('./data.json').then((r) => r.json());
  seed = loadBase(packagedSeed);
  seed.attractions.forEach((attraction) => { attraction.priority = spreadsheetPriority(attraction); });
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
    if (!validateTripData(parsed)) return cloneData(fallback);
    if (!fallback.sourceRevision || parsed.sourceRevision >= fallback.sourceRevision) return parsed;
    const updated = cloneData(fallback);
    const ids = new Set(updated.attractions.map((a) => a.id));
    const dates = new Set(updated.itinerary.map((day) => day.date));
    updated.attractions.push(...parsed.attractions.filter((a) => !ids.has(a.id)));
    updated.itinerary.push(...parsed.itinerary.filter((day) => !dates.has(day.date)));
    updated.itinerary.sort((a, b) => a.date.localeCompare(b.date));
    return updated;
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

function spreadsheetPriority(attraction) {
  const instruction = normalizeName(attraction.familyPlan?.instruction);
  if (!instruction) return 'sem classificação';
  if (attraction.familyPlan?.wantsToVisit === false) return 'não queremos ir';
  if (instruction.includes('fechada em reforma')) return 'em reforma';
  if (instruction.includes('sobrando tempo')) return 'se der tempo';
  if (instruction.includes('avaliar fila')) return 'avaliar fila';
  if (attraction.area?.toLowerCase().includes('alimenta')) return 'alimentação';
  return 'planejada';
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
    todayFilter = 'all';
    renderToday();
  };
  $('#parkSelect').onchange = () => {
    parkStrategyOpen = false;
    renderParks();
  };
  $('#statusFilter').onchange = renderParks;
  $('#search').oninput = renderParks;
  $('#llDateSelect').onchange = renderReservations;
  $('#llParkSelect').onchange = renderReservations;
  $('#closeMapBtn').onclick = closeMap;
  $('#mapDialog').addEventListener('close', closeMap);
  $('#nowBtn').onclick = showNowRecommendation;
  $('#todayFilters').onclick = (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    todayFilter = button.dataset.filter;
    renderToday();
  };
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
      const backup = JSON.parse(await file.text());
      if (!validateTripData(backup)) throw new Error('invalid-backup');
      state = mergeSeedWithLocal(cloneData(seed), backup);
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
      seed.attractions.forEach((attraction) => { attraction.priority = spreadsheetPriority(attraction); });
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
  renderMapButton(activeTodayPark, '#todayMapSlot');

  const list = activeTodayPark ? state.attractions.filter((a) => a.park === activeTodayPark) : [];
  const counts = countStatuses(list);
  $('#progress').innerHTML = list.length ? progressMarkup(counts, list.length) : '';

  const recommended = recommend(list, date);
  $('#nowSummary').innerHTML = recommended.length ? nowSummary(recommended[0], date) : '';
  renderStrategyPanel(activeTodayPark, list, recommended);
  renderTodayFilters(list, recommended, date);
  renderDonePanel(activeTodayPark, '#todayDonePanel');
  const visibleList = filterTodayList(list, recommended, date);
  $('#recommendations').innerHTML = visibleList.length
    ? groupedTodayCards(visibleList, recommended, date)
    : list.length
      ? `<div class="empty">Nenhuma atração neste filtro.</div>`
    : `<div class="empty">Dia sem parque cadastrado.</div>`;
  renderNowDock(recommended[0], counts, list.length, date);
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
    ${dayDetails(day)}
  </div>`;
}

function dayDetails(day) {
  const items = [['Deslocamento', day.transport], ['Locais e horários', day.places], ['Observações', day.notes],
    ['Plano do grupo', day.groupPlan], ['Passes', day.passPlan]].filter(([, value]) => value);
  return items.length ? `<details class="day-details"><summary>Detalhes do dia</summary>${items.map(([title, value]) =>
    `<div><strong>${esc(title)}</strong><p class="timeline">${esc(value)}</p></div>`).join('')}</details>` : '';
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

function renderMapButton(park, targetSelector) {
  const target = $(targetSelector);
  if (!target) return;
  const mapUrl = parkMapUrl(park);
  target.innerHTML = mapUrl
    ? `<button class="secondary map-button" onclick="openParkMap('${escAttr(park)}')">Mapa do parque</button>`
    : '';
}

function parkMapUrl(park) {
  const path = PARK_MAPS[parkNameAlias(park)];
  return path ? encodeURI(path) : '';
}

function openParkMap(park) {
  const url = parkMapUrl(park);
  if (!url) return;
  $('#mapTitle').textContent = shortParkName(parkNameAlias(park));
  $('#openMapLink').href = url;
  $('#mapFrameWrap').innerHTML = `<iframe title="Mapa ${escAttr(park)}" src="${escAttr(url)}" loading="lazy"></iframe>`;
  $('#mapDialog').showModal();
}

function closeMap() {
  const wrap = $('#mapFrameWrap');
  if (wrap) wrap.innerHTML = '';
  const dialog = $('#mapDialog');
  if (dialog?.open) dialog.close();
}

function renderTodayFilters(list, recommended, date) {
  const target = $('#todayFilters');
  if (!target) return;
  if (!list.length) {
    target.innerHTML = '';
    return;
  }

  const area = nextStrategicArea(getParkStrategy(activeTodayPark), list) || recommended[0]?.area || '';
  const filters = [
    ['all', 'Todas', list.length],
    ['planned', 'Nosso plano', list.filter((a) => a.familyPlan?.wantsToVisit === true).length],
    ['mateus', 'Mateus', list.filter((a) => a.familyPlan?.children?.Mateus === 'Sim').length],
    ['laura', 'Laura', list.filter((a) => a.familyPlan?.children?.Laura === 'Sim').length],
    ['declined', 'Não queremos ir', list.filter((a) => a.familyPlan?.wantsToVisit === false).length],
    ['must', 'Planejadas', list.filter((a) => a.priority === 'planejada').length],
    ['reserved', 'Reservadas', list.filter((a) => a.status === 'reservado' || a.reservationTime || a.reservationKind).length],
    ['time', 'Se der tempo', list.filter((a) => a.priority === 'se der tempo').length],
    ['pending', 'Pendentes', list.filter((a) => !['feito', 'pular'].includes(a.status)).length],
    ['done', 'Feitas', list.filter((a) => a.status === 'feito').length],
  ];
  if (area) filters.splice(3, 0, ['area', `Área: ${area}`, list.filter((a) => a.area === area).length]);
  if (!filters.some(([key]) => key === todayFilter)) todayFilter = 'all';

  target.innerHTML = filters
    .map(
      ([key, label, count]) =>
        `<button data-filter="${escAttr(key)}" class="${todayFilter === key ? 'active' : ''}">${esc(label)} ${count}</button>`,
    )
    .join('');
}

function filterTodayList(list, recommended, date) {
  const area = nextStrategicArea(getParkStrategy(activeTodayPark), list) || recommended[0]?.area || '';
  return list.filter((attraction) => {
    if (todayFilter === 'planned') return attraction.familyPlan?.wantsToVisit === true;
    if (todayFilter === 'mateus') return attraction.familyPlan?.children?.Mateus === 'Sim';
    if (todayFilter === 'laura') return attraction.familyPlan?.children?.Laura === 'Sim';
    if (todayFilter === 'declined') return attraction.familyPlan?.wantsToVisit === false;
    if (todayFilter === 'must') return attraction.priority === 'planejada';
    if (todayFilter === 'reserved') return attraction.status === 'reservado' || attraction.reservationTime || attraction.reservationKind;
    if (todayFilter === 'time') return attraction.priority === 'se der tempo';
    if (todayFilter === 'area') return attraction.area === area;
    if (todayFilter === 'pending') return !['feito', 'pular'].includes(attraction.status);
    if (todayFilter === 'done') return attraction.status === 'feito';
    return true;
  });
}

function groupedTodayCards(fullList, recommended, date) {
  const ranked = new Map(recommended.map((a, index) => [a.id, index]));
  const byRecommendation = (a, b) =>
    (ranked.get(a.id) ?? 9999) - (ranked.get(b.id) ?? 9999) ||
    a.name.localeCompare(b.name);
  const pending = fullList.filter(isFamilyPending).sort(byRecommendation);
  const declined = fullList.filter((a) => !['feito', 'pular'].includes(a.status) && a.familyPlan?.wantsToVisit === false);
  const closed = fullList.filter((a) => !['feito', 'pular'].includes(a.status) &&
    a.familyPlan?.wantsToVisit !== false && normalizeName(a.familyPlan?.instruction).includes('fechada em reforma'));
  const skipped = fullList.filter((a) => a.status === 'pular').sort(byRecommendation);
  const done = fullList.filter((a) => a.status === 'feito').sort(byRecommendation);
  const sections = [
    ['Reservas proximas', pending.filter((a) => isReservationSoon(a, date))],
    ['Planejadas pela família', pending.filter((a) => !isReservationSoon(a, date) && a.priority === 'planejada')],
    ['Se der tempo', pending.filter((a) => !isReservationSoon(a, date) && a.priority === 'se der tempo')],
    ['Demais atrações', pending.filter((a) => !isReservationSoon(a, date) && !['planejada', 'se der tempo'].includes(a.priority))],
    ['Marcadas para pular', skipped],
    ['Não queremos ir · plano da família', declined],
    ['Fechada em reforma · informação da família', closed],
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
  const steps = strategySteps(kb, parkList, recommended);

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
    <div class="strategy-steps">${steps.map(strategyStepMarkup).join('')}</div>
    <div class="muted">${esc(passNote)}</div>
  </section>`;
}

function strategySteps(kb, parkList, recommended) {
  const nextArea = nextStrategicArea(kb, parkList);
  const upcomingReservation = parkList
    .filter((a) => !['feito', 'pular'].includes(a.status) && (a.status === 'reservado' || a.reservationTime || a.reservationKind))
    .sort((a, b) => (a.reservationTime || '99:99').localeCompare(b.reservationTime || '99:99'))[0];
  const firstAnchor = (kb.anchors || []).find((name) =>
    parkList.some((a) => sameAttractionName(name, a.name) && !['feito', 'pular'].includes(a.status)),
  );
  const firstPick = recommended[0]?.name || firstAnchor || 'Escolha uma pendente do filtro atual';
  const secondPick = recommended[1]?.name || nextArea || 'Siga pela mesma area para evitar deslocamento';
  return [
    ['Comece por aqui', firstPick],
    ['Depois', secondPick],
    upcomingReservation
      ? ['Use a reserva como ancora', `${upcomingReservation.reservationTime || 'Horario pendente'} - ${upcomingReservation.name}`]
      : ['Use passes com criterio', (kb.passStrategy || [])[0] || 'Priorize reservas das obrigatorias e filas maiores.'],
    nextArea
      ? ['Evite atravessar o parque', `Fique em ${nextArea} enquanto houver boas pendencias por perto.`]
      : ['Feche pendencias proximas', 'Quando acabar uma area, volte ao botao "O que fazer agora?".'],
  ];
}

function strategyStepMarkup([title, text], index) {
  return `<div class="strategy-step"><b>${index + 1}</b><span><strong>${esc(title)}</strong><small>${esc(text)}</small></span></div>`;
}

function nextStrategicArea(kb, parkList) {
  return (kb?.areaFlow || []).find((area) =>
    parkList.some((a) => a.area === area && isFamilyPending(a)),
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
  const pscore = { planejada: 0, 'se der tempo': 20, 'pode pular': 55, 'sem prioridade': 35 };
  const parkStrategy = getParkStrategy(list[0]?.park);
  return list
    .filter(isFamilyPending)
    .map((a) => {
      let score = pscore[a.priority] ?? 30;
      score += strategyScore(a, parkStrategy);
      if (a.status === 'reservado') score -= 12;
      if (isReservationSoon(a, date)) score -= 35;
      if (a.reservationTime && !isReservationSoon(a, date)) score -= 6;
      return { ...a, _score: score };
    })
    .sort((a, b) => Number(isReservationSoon(b, date)) - Number(isReservationSoon(a, date)) ||
      familyOrder(a) - familyOrder(b) || a._score - b._score ||
      a.name.localeCompare(b.name));
}

function isFamilyPending(attraction) {
  return !['feito', 'pular'].includes(attraction.status) && attraction.familyPlan?.wantsToVisit !== false &&
    !normalizeName(attraction.familyPlan?.instruction).includes('fechada em reforma');
}

function familyOrder(attraction) {
  if (/^1a reserva$/i.test(attraction.familyPlan?.instruction || '')) return 0;
  return attraction.familyPlan?.order ?? 9999;
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
    : attraction.priority === 'planejada'
      ? 'Planejada pela família'
      : attraction.familyPlan?.instruction || 'Plano da família';
  return `<div class="now-pick">
    <div>
      <span class="eyebrow">Sugestao agora</span>
      <strong>${esc(attraction.name)}</strong>
      <small>${esc(reason)}${attraction.area ? ` | ${esc(attraction.area)}` : ''}</small>
    </div>
    <button onclick="quickDone('${escAttr(attraction.id)}')">Marcar feito</button>
  </div>`;
}

function renderNowDock(attraction, counts, total, date) {
  const target = $('#nowDock');
  if (!target) return;
  const todayActive = $('#today')?.classList.contains('active');
  if (!todayActive || !attraction || !total) {
    target.hidden = true;
    target.innerHTML = '';
    return;
  }
  const percent = Math.round((counts.feito / total) * 100);
  const reason = isReservationSoon(attraction, date)
    ? `Reserva ${attraction.reservationTime}`
    : attraction.area || attraction.priority || 'Proxima melhor opcao';
  target.hidden = false;
  target.innerHTML = `<div class="now-dock-inner">
    <div class="now-dock-copy">
      <span class="eyebrow">Agora</span>
      <strong>${esc(attraction.name)}</strong>
      <small>${esc(reason)}</small>
      <div class="mini-progress"><span>${counts.feito}/${total} feitas</span><div class="progress-bar" aria-label="${percent}% concluido"><i style="width:${percent}%"></i></div></div>
    </div>
    <button onclick="quickDone('${escAttr(attraction.id)}')">Feito</button>
    <button class="secondary" onclick="markSkip('${escAttr(attraction.id)}')">Pular</button>
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
  renderMapButton(park, '#parkMapSlot');
  renderParkStrategySummary(park);
  renderDonePanel(park, '#donePanel');
  if (status !== 'all') list = list.filter((a) => a.status === status);
  if (query) list = list.filter((a) => searchableText(a).includes(query));
  list.sort((a, b) => familyOrder(a) - familyOrder(b) || a.name.localeCompare(b.name));
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
    .sort((a, b) => familyOrder(a) - familyOrder(b) || a.name.localeCompare(b.name));

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

function renderLLPlanner() {
  const dateSelect = $('#llDateSelect');
  const parkSelect = $('#llParkSelect');
  const target = $('#llPlanner');
  if (!dateSelect || !parkSelect || !target) return;

  const days = disneyParkDays();
  if (!days.length) {
    target.innerHTML = `<div class="empty compact">Nenhum dia Disney encontrado no roteiro.</div>`;
    return;
  }

  const previousDate = dateSelect.value || $('#dateSelect')?.value;
  dateSelect.innerHTML = days.map((day) => `<option value="${day.date}">${fmtDate(day.date)} - ${esc(day.event)}</option>`).join('');
  dateSelect.value = days.some((day) => day.date === previousDate) ? previousDate : days[0].date;

  const day = days.find((item) => item.date === dateSelect.value) || days[0];
  const parks = eventToParks(day.event).filter((park) => DISNEY_LL_RULES.parks[park]);
  const previousPark = parkSelect.value;
  parkSelect.innerHTML = parks.map((park) => `<option>${esc(park)}</option>`).join('');
  parkSelect.value = parks.includes(previousPark) ? previousPark : parks[0] || '';

  const park = parkSelect.value;
  const rules = DISNEY_LL_RULES.parks[park];
  if (!park || !rules) {
    target.innerHTML = `<div class="empty compact">Escolha um parque Disney com Lightning Lane.</div>`;
    return;
  }

  const plan = buildLLPlan(park, rules);
  target.innerHTML = `${llRulesSummary(day, park, rules)}
    <div class="ll-plan">
      ${llPlanSection('Single Pass', 'Compras separadas; maximo de 2 por dia.', plan.single, 'Lightning Lane Single Pass', plan.single.map((a) => a.id))}
      ${llInitialPicks(plan, rules)}
      ${llPlanSection(rules.noGroups ? 'Multi Pass' : 'Multi Pass - Grupo 1', rules.noGroups ? 'Sem grupos neste parque.' : 'Escolha ate 1 deste grupo.', plan.group1, 'Lightning Lane Multi Pass', plan.initial.map((a) => a.id))}
      ${!rules.noGroups ? llPlanSection('Multi Pass - Grupo 2', 'Escolha as outras 2; ou todas as 3 deste grupo.', plan.group2, 'Lightning Lane Multi Pass', plan.initial.map((a) => a.id)) : ''}
    </div>`;
}

function disneyParkDays() {
  return state.itinerary.filter((day) =>
    !String(day.event || '').toLowerCase().includes("mickey's very merry christmas party") &&
    eventToParks(day.event).some((park) => DISNEY_LL_RULES.parks[park]));
}

function buildLLPlan(park, rules) {
  const plan = {
    single: matchLLAttractions(park, rules.single),
    group1: matchLLAttractions(park, rules.noGroups ? rules.group2 : rules.group1),
    group2: rules.noGroups ? [] : matchLLAttractions(park, rules.group2),
    initial: [],
  };
  const activeGroup1 = llCandidates(plan.group1);
  const activeGroup2 = llCandidates(plan.group2);
  if (rules.noGroups) {
    plan.initial = activeGroup1.slice(0, 3);
    return plan;
  }

  const strongGroup1 = activeGroup1.find((a) => isWorthInitialLL(a));
  plan.initial = [
    ...(strongGroup1 ? [strongGroup1] : []),
    ...activeGroup2.slice(0, strongGroup1 ? 2 : 3),
  ].slice(0, 3);
  return plan;
}

function llCandidates(list) {
  return list.filter(isFamilyPending).sort(llSort);
}

function isWorthInitialLL(attraction) {
  return attraction.familyPlan?.wantsToVisit === true && attraction.priority !== 'se der tempo';
}

function llSort(a, b) {
  return familyOrder(a) - familyOrder(b) || llScore(a) - llScore(b) || a.name.localeCompare(b.name); 
}

function llScore(attraction) {
  const priority = { planejada: 0, 'se der tempo': 12, 'sem prioridade': 28, 'pode pular': 45 }[attraction.priority] ?? 30;
  const status = attraction.status === 'reservado' ? -8 : 0;
  return priority + status;
}

function matchLLAttractions(park, officialNames) {
  const parkList = state.attractions.filter((a) => a.park === park);
  const found = [];
  officialNames.forEach((officialName) => {
    parkList
      .filter((attraction) => sameAttractionName(officialName, attraction.name))
      .forEach((attraction) => {
        if (!found.some((item) => item.id === attraction.id)) found.push(attraction);
      });
  });
  return found.sort(llSort);
}

function llRulesSummary(day, park, rules) {
  const hotel = addDays(day.date, -7);
  const general = addDays(day.date, -3);
  return `<div class="ll-summary">
    <div class="ll-window">
      <span><strong>Hotel Disney</strong>${fmtDate(hotel)} as 7h ET</span>
      <span><strong>Demais visitantes</strong>${fmtDate(general)} as 7h ET</span>
    </div>
    <div class="summary-block">
      <strong>Regra pratica</strong>
      <ul>
        <li>Multi Pass: ${rules.noGroups ? 'ate 3 experiencias iniciais.' : 'ate 1 do Grupo 1 + 2 do Grupo 2, ou 3 do Grupo 2.'}</li>
        <li>Single Pass: atracoes separadas do Multi Pass; ate 2 por dia.</li>
        <li>Fonte oficial Disney, atualizada no app em ${fmtDate(DISNEY_LL_RULES.updatedAt)}.</li>
      </ul>
    </div>
  </div>`;
}

function llInitialPicks(plan, rules) {
  if (!plan.initial.length) return '';
  return `<section class="ll-block recommended">
    <div class="ll-block-head">
      <div>
        <span class="eyebrow">Sugestao inicial</span>
        <strong>Até 3 escolhas Multi Pass</strong>
      </div>
      <span class="badge green">${plan.initial.length}/3</span>
    </div>
    <div class="ll-picks">${plan.initial.map((a) => llPickCard(a, 'Lightning Lane Multi Pass', true)).join('')}</div>
  </section>`;
}

function llPlanSection(title, hint, list, kind, selectedIds = []) {
  return `<section class="ll-block">
    <div class="ll-block-head">
      <div>
        <span class="eyebrow">${esc(title)}</span>
        <strong>${list.length} no seu roteiro</strong>
      </div>
      <span class="muted">${esc(hint)}</span>
    </div>
    <div class="ll-picks">${list.length ? list.map((a) => llPickCard(a, kind, selectedIds.includes(a.id))).join('') : '<div class="empty compact">Nenhuma atração do seu roteiro nesta lista.</div>'}</div>
  </section>`;
}

function llPickCard(attraction, kind, selected) {
  const status = attraction.status === 'reservado' ? 'Ja reservado' : selected ? 'Sugerida' : statusLabel(attraction.status);
  return `<article class="ll-pick ${selected ? 'selected' : ''}">
    <div>
      <strong>${esc(attraction.name)}</strong>
      <small>${esc(attraction.area || attraction.park)}${attraction.ranking != null ? ` | ranking ${String(attraction.ranking).replace('.', ',')}` : ''}</small>
    </div>
    <div class="badges">
      <span class="badge ${selected ? 'green' : 'status'}">${esc(status)}</span>
      <span class="badge blue">${esc(kind.replace('Lightning Lane ', 'LL '))}</span>
      ${familyPlanBadges(attraction)}
      ${attraction.priority ? `<span class="badge ${priorityClass(attraction.priority)}">${esc(attraction.priority)}</span>` : ''}
    </div>
    <button class="${attraction.status === 'reservado' ? 'secondary' : ''}" onclick="planLightningLane('${escAttr(attraction.id)}','${escAttr(kind)}')">${attraction.status === 'reservado' ? 'Editar horário' : 'Reservar'}</button>
  </article>`;
}

function renderReservations() {
  renderLLPlanner();
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
  const source = seed.sourceRevision
    ? `Planilha da família · ${seed.sourceRevision}`
    : meta ? `Importada de ${meta.fileName}` : 'Base original';
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
  renderOfflineChecklist({ secure, swSupported, controlled, installed });
}

function renderOfflineChecklist({ secure, swSupported, controlled, installed }) {
  const target = $('#offlineChecklist');
  if (!target) return;
  const hasBackupData = state?.attractions?.some((a) => a.status !== 'nao feito' || a.reservationKind || a.reservationTime || a.notes);
  const meta = readBaseMeta();
  const checks = [
    [secure, 'Abrir por HTTPS ou localhost para preparar o cache'],
    [swSupported && controlled, 'Cache offline ativo neste navegador'],
    [installed, 'Instalado pela Tela de Início do iPhone'],
    [Boolean(meta), meta ? `Base atualizada: ${meta.fileName}` : 'Base atualizada quando a planilha final estiver pronta'],
    [hasBackupData, hasBackupData ? 'Existe progresso para exportar em Backup' : 'Exportar JSON depois de cadastrar reservas/progresso'],
  ];
  target.innerHTML = checks
    .map(([ok, label]) => `<div class="check-row ${ok ? 'ok' : 'warn'}"><i>${ok ? '✓' : '!'}</i><span>${esc(label)}</span></div>`)
    .join('');
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
      ${familyPlanBadges(attraction)}
      ${officialLightningBadge(attraction)}
      ${universalExpressBadge(attraction)}
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
    ${attraction.sourceDetails ? `<span><strong>Informações do parque</strong>${esc(Object.values(attraction.sourceDetails).filter(Boolean).join(' | '))}</span>` : ''}
    ${ratings ? `<span><strong>Familia</strong>${ratings}</span>` : ''}
    ${restrictions ? `<span><strong>Restricoes</strong>${esc(restrictions)}</span>` : ''}
    ${attraction.notes ? `<span><strong>Notas</strong>${esc(attraction.notes)}</span>` : ''}
  </div>`;
}

function familyPlanBadges(attraction) {
  const plan = attraction.familyPlan;
  if (!plan) return '';
  const children = Object.entries(plan.children || {}).filter(([, value]) => value).map(([name, value]) =>
    `<span class="badge ${value === 'Sim' ? 'green' : 'status'}">${esc(name)}: ${esc(value)}</span>`).join('');
  return `${plan.instruction ? `<span class="badge ${plan.wantsToVisit === false ? 'red' : 'blue'}">${esc(plan.instruction)}</span>` : ''}${children}`;
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

function officialLightningBadge(attraction) {
  const info = officialLightningInfo(attraction);
  if (!info) return '';
  return `<span class="badge purple">${esc(info.label)}</span>`;
}

function officialLightningInfo(attraction) {
  const rules = DISNEY_LL_RULES.parks[attraction.park];
  if (!rules) return null;
  if (rules.single.some((name) => sameAttractionName(name, attraction.name))) return { kind: 'single', label: 'LL Single' };
  if (!rules.noGroups && rules.group1.some((name) => sameAttractionName(name, attraction.name))) return { kind: 'group1', label: 'LL Multi G1' };
  const multiNames = rules.noGroups ? rules.group2 : rules.group2;
  if (multiNames.some((name) => sameAttractionName(name, attraction.name))) {
    return { kind: 'group2', label: rules.noGroups ? 'LL Multi' : 'LL Multi G2' };
  }
  return null;
}

function universalExpressBadge(attraction) {
  const info = universalExpressInfo(attraction);
  if (!info) return '';
  return `<span class="badge orange">${esc(info.label)}</span>`;
}

function universalExpressInfo(attraction) {
  const rules = UNIVERSAL_EXPRESS_RULES.parks[attraction.park];
  if (!rules) return null;
  const participates = rules.attractions.some((name) => sameAttractionName(name, attraction.name));
  return participates ? { label: rules.label, sourceUrl: UNIVERSAL_EXPRESS_RULES.sourceUrl } : null;
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
  event = String(event || '');
  const found = Object.entries(PARK_ALIASES).find(([label]) => event.includes(label));
  if (found) return found[1].filter((park) => state.attractions.some((a) => a.park === park));
  const lower = event.toLowerCase();
  if (lower.includes('epcot')) return ['EPCOT'];
  if (lower.includes("mickey's very merry christmas party")) return ['Magic Kingdom'];
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
  return [attraction.name, attraction.park, attraction.area, attraction.priority, attraction.passType, attraction.reservationKind, attraction.familyPlan?.instruction]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getAttraction(id) {
  return state.attractions.find((x) => x.id === id);
}

function updateStatus(id, status, options = {}) {
  const attraction = getAttraction(id);
  if (!attraction) return;
  const previousStatus = attraction.status || 'nao feito';
  if (previousStatus === status) return;
  attraction.status = status;
  save();
  if (options.undo !== false && ['feito', 'pular'].includes(status)) {
    showUndoToast(attraction, previousStatus, status);
  }
}

function showUndoToast(attraction, previousStatus, nextStatus) {
  const target = $('#undoToast');
  if (!target) return;
  clearTimeout(undoTimer);
  target.hidden = false;
  target.innerHTML = `<div class="undo-toast-inner">
    <div>
      <strong>${esc(attraction.name)}</strong>
      <small>Marcado como ${esc(statusLabel(nextStatus))}</small>
    </div>
    <button onclick="restoreStatus('${escAttr(attraction.id)}','${escAttr(previousStatus)}')">Desfazer</button>
  </div>`;
  undoTimer = setTimeout(() => {
    target.hidden = true;
    target.innerHTML = '';
  }, 4500);
}

window.setTodayPark = (park) => {
  activeTodayPark = park;
  todayFilter = 'all';
  renderToday();
};
window.openParkMap = openParkMap;
window.quickDone = (id) => updateStatus(id, 'feito');
window.undoDone = (id) => updateStatus(id, 'nao feito', { undo: false });
window.markSkip = (id) => updateStatus(id, 'pular');
window.restoreStatus = (id, status) => {
  const target = $('#undoToast');
  clearTimeout(undoTimer);
  if (target) {
    target.hidden = true;
    target.innerHTML = '';
  }
  updateStatus(id, status || 'nao feito', { undo: false });
};
window.quickReserve = (id) => {
  const attraction = getAttraction(id);
  if (!attraction) return;
  editAttraction(id);
  $('#editStatus').value = 'reservado';
};
window.planLightningLane = (id, kind) => {
  const attraction = getAttraction(id);
  if (!attraction) return;
  editAttraction(id);
  $('#editStatus').value = 'reservado';
  $('#reservationKind').value = kind;
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
  if (priority === 'planejada') return 'green';
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

function addDays(date, delta) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + delta);
  return value.toISOString().slice(0, 10);
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
