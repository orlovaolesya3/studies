(function () {
  'use strict';

  var STORAGE_KEY = 'app-state';
  var RATING_LABELS = { forgot: 'Забыла', hard: 'Трудно', normal: 'Нормально', easy: 'Легко' };
  var RATING_ORDER = ['forgot', 'hard', 'normal', 'easy'];

  var app = document.getElementById('app');

  var state = loadState();
  state.lessons = loadLessons();
  loadSyncConfig();
  var screen = 'today';
  var openId = null;
  var reviewMode = false;
  var lesson = null;
  var libraryQuery = '';
  var timerId = null;
  var sync = { room: '', status: 'idle', error: '', timer: null };

  applyTheme();
  render();
  cloudLoad();

  app.addEventListener('click', onClick);
  app.addEventListener('input', onInput);
  app.addEventListener('change', onChange);
  app.addEventListener('keydown', onKeyDown);

  // ---------- утилиты ----------

  function emptyState() {
    return {
      updatedAt: 0,
      progress: {},
      reviews: {},
      dailyLog: {},
      settings: { newPerSubject: {}, theme: 'light' },
      favorites: []
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      var s = JSON.parse(raw);
      var settings = (s && s.settings) || {};
      return {
        updatedAt: Number(s.updatedAt) || 0,
        progress: s.progress && typeof s.progress === 'object' && !Array.isArray(s.progress) ? s.progress : {},
        reviews: s.reviews && typeof s.reviews === 'object' && !Array.isArray(s.reviews) ? s.reviews : {},
        dailyLog: s.dailyLog && typeof s.dailyLog === 'object' && !Array.isArray(s.dailyLog) ? s.dailyLog : {},
        settings: {
          newPerSubject: settings.newPerSubject && typeof settings.newPerSubject === 'object'
            ? settings.newPerSubject
            : {},
          theme: settings.theme === 'dark' ? 'dark' : 'light'
        },
        favorites: Array.isArray(s.favorites) ? s.favorites : []
      };
    } catch (e) {
      return emptyState();
    }
  }

  function loadLessons() {
    var source = Array.isArray(window.LESSONS) ? window.LESSONS : [];
    var map = new Map();
    source.forEach(function (lesson) {
      if (lesson && lesson.id) map.set(lesson.id, lesson);
    });
    return Array.from(map.values());
  }

  function persist() {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        updatedAt: state.updatedAt,
        progress: state.progress,
        reviews: state.reviews,
        dailyLog: state.dailyLog,
        settings: state.settings,
        favorites: state.favorites
      }));
    } catch (e) {
      // приватный режим или запрет localStorage — приложение всё равно работает
    }
    applyTheme();
    queueCloudSave();
  }

  // ---------- прогресс между устройствами (файл-обмен) ----------

  function loadSyncConfig() {
    try {
      var raw = localStorage.getItem('sync-room');
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && typeof data.room === 'string') sync.room = data.room;
    } catch (e) {
      // без синхронизации
    }
  }

  // ---------- облачная синхронизация (Supabase REST) ----------

  function cloudReady() {
    var cfg = window.SYNC || {};
    return !!(cfg.url && cfg.key && sync.room);
  }

  function cloudHeaders(extra) {
    var cfg = window.SYNC || {};
    var base = {
      apikey: cfg.key,
      'Content-Type': 'application/json'
    };
    // старые anon-ключи (JWT) требуют Authorization, новые publishable — тоже поддерживают
    if (String(cfg.key).indexOf('eyJ') === 0) {
      base.Authorization = 'Bearer ' + cfg.key;
    }
    return Object.assign(base, extra || {});
  }

  function cloudEndpoint() {
    var cfg = window.SYNC || {};
    var base = String(cfg.url).replace(/\/+$/, '');
    if (base.indexOf('/rest/v1') < 0) base += '/rest/v1';
    return base + '/progress';
  }

  function cloudLoad() {
    if (!cloudReady()) return Promise.resolve(false);
    var url = cloudEndpoint() + '?room=eq.' + encodeURIComponent(sync.room) + '&select=room,data';
    sync.status = 'loading';
    refreshSyncBadge();
    return fetch(url, { headers: cloudHeaders(), cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (rows) {
        if (rows && rows.length && rows[0].data) mergeRemote(rows[0].data);
        sync.status = 'synced';
        sync.error = '';
        refreshSyncBadge();
        return true;
      })
      .catch(function (e) {
        sync.status = 'error';
        sync.error = String(e.message || e);
        refreshSyncBadge();
        return false;
      });
  }

  function cloudSave() {
    if (!cloudReady()) return Promise.resolve(false);
    var body = [{ room: sync.room, data: payloadNow() }];
    sync.status = 'saving';
    refreshSyncBadge();
    return fetch(cloudEndpoint(), {
      method: 'POST',
      headers: cloudHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      sync.status = 'synced';
      sync.error = '';
      refreshSyncBadge();
      return true;
    }).catch(function (e) {
      sync.status = 'error';
      sync.error = String(e.message || e);
      refreshSyncBadge();
      return false;
    });
  }

  function queueCloudSave() {
    if (!cloudReady()) return;
    if (sync.timer) clearTimeout(sync.timer);
    sync.timer = setTimeout(function () {
      sync.timer = null;
      cloudSave();
    }, 1000);
  }

  function refreshSyncBadge() {
    var el = document.getElementById('sync-state');
    if (el) el.innerHTML = syncStateHtml();
  }

  function payloadNow() {
    return {
      progress: state.progress,
      reviews: state.reviews,
      dailyLog: state.dailyLog,
      settings: state.settings,
      favorites: state.favorites
    };
  }

  function mergeRemote(data) {
    if (!data || typeof data !== 'object') return false;
    state.progress = mergeProgress(state.progress, data.progress);
    state.reviews = Object.assign({}, data.reviews || {}, state.reviews || {});
    state.dailyLog = Object.assign({}, data.dailyLog || {}, state.dailyLog || {});
    if (Array.isArray(data.favorites)) {
      state.favorites = Array.from(new Set(data.favorites.concat(state.favorites || [])));
    }
    if (data.settings && data.settings.newPerSubject) {
      state.settings.newPerSubject = Object.assign({}, data.settings.newPerSubject, state.settings.newPerSubject);
    }
    applyTheme();
    return true;
  }

  function syncStateHtml() {
    var cfg = window.SYNC || {};
    if (!cfg.url || !cfg.key) {
      return '<span class="sync-chip off">' + icon('alert') + '<span>Не настроено</span></span>';
    }
    if (!sync.room) {
      return '<span class="sync-chip off">' + icon('info') + '<span>Нужен код комнаты</span></span>';
    }
    var text = sync.status === 'saving' ? 'Сохраняем…'
      : sync.status === 'loading' ? 'Загружаем…'
      : sync.status === 'error' ? 'Ошибка: ' + esc(sync.error)
      : 'Автосинхронизация · ' + esc(sync.room);
    return '<span class="sync-chip ' + sync.status + '">' + icon('refresh') + '<span>' + text + '</span></span>';
  }

  function saveSyncConfig() {
    try {
      localStorage.setItem('sync-room', JSON.stringify({ room: sync.room }));
    } catch (e) {
      // без сохранения
    }
  }

  function syncRoomLabel() {
    return sync.room ? 'Комната: ' + esc(sync.room) : 'Комната не создана';
  }

  function makeRoomCode() {
    var letters = 'abcdefghijkmnpqrstuvwxyz23456789';
    var out = '';
    for (var i = 0; i < 6; i++) {
      out += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return out;
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', state.settings.theme === 'dark');
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function dayKey(offset) {
    var d = new Date();
    d.setDate(d.getDate() + (offset || 0));
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function ruDate(key) {
    if (!key || typeof key !== 'string') return '';
    var parts = key.split('-');
    if (parts.length !== 3) return key;
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  function normalize(value) {
    return String(value == null ? '' : value).trim().toLowerCase();
  }

  function plural(n, one, few, many) {
    var a = n % 10;
    var b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  function nextInterval(rating, current) {
    if (rating === 'forgot') return 1;
    if (rating === 'hard') return 3;
    if (rating === 'normal') return 7;
    return current >= 14 ? 30 : 14;
  }

  function minutesLabel(seconds) {
    return Math.max(1, Math.round(seconds / 60)) + ' мин';
  }

  function isTextTask(type) {
    return type === 'input' || type === 'fill_blank' || type === 'numeric' || type === 'code_fill';
  }

  function isCorrect(task, answer) {
    var type = task.type;

    if (type === 'multi_choice') {
      var a = [].concat(answer || []).map(Number).sort(function (x, y) { return x - y; }).join(',');
      var b = [].concat(task.correct || []).map(Number).sort(function (x, y) { return x - y; }).join(',');
      return a !== '' && a === b;
    }

    if (isTextTask(type)) {
      var expected = task.answer !== undefined ? task.answer : task.correct;
      if (type === 'numeric' && typeof task.tolerance === 'number') {
        var x = parseFloat(String(answer).replace(',', '.'));
        var y = parseFloat(String(expected).replace(',', '.'));
        return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= task.tolerance;
      }
      var list = Array.isArray(expected) ? expected : [expected];
      return list.some(function (item) {
        return normalize(item) === normalize(answer);
      });
    }

    var right = type === 'true_false' && typeof task.correct === 'boolean'
      ? (task.correct ? 0 : 1)
      : task.correct;
    return Number(answer) === Number(right);
  }

  function mathHtml(tex) {
    var s = esc(tex);

    s = s.replace(/\\dfrac|\\tfrac/g, '\\frac');
    s = s.replace(/\\mathbb\{([RCNQZ])\}/g, function (match, letter) {
      return { R: 'ℝ', C: 'ℂ', N: 'ℕ', Q: 'ℚ', Z: 'ℤ' }[letter] || letter;
    });
    s = s.replace(/\\operatorname\{Re\}/g, 'Re');
    s = s.replace(/\\operatorname\{Im\}/g, 'Im');
    s = s.replace(/\\overline\{([^{}]*)\}/g, '<span class="overline">$1</span>');
    s = s.replace(/\\bar\{([^{}]*)\}/g, '<span class="overline">$1</span>');
    s = s.replace(/\\bar\s*([a-zA-Z])/g, '<span class="overline">$1</span>');
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      '<span class="frac"><span class="frac-top">$1</span><span class="frac-bottom">$2</span></span>');
    s = s.replace(/\\frac([0-9a-zA-Z])([0-9a-zA-Z])/g,
      '<span class="frac"><span class="frac-top">$1</span><span class="frac-bottom">$2</span></span>');
    s = s.replace(/\\sqrt\[([^\]]+)\]\{([^{}]*)\}/g,
      '<span class="root"><sup>$1</sup>√($2)</span>');
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
    s = s.replace(/\\text\{([^{}]*)\}/g, '$1');
    s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>');
    s = s.replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>');
    s = s.replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');
    s = s.replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>');

    var map = {
      '\\lim': 'lim', '\\limsup': 'lim sup', '\\liminf': 'lim inf',
      '\\sup': 'sup', '\\inf': 'inf', '\\max': 'max', '\\min': 'min',
      '\\to': '→', '\\mapsto': '↦', '\\infty': '∞', '\\dots': '…',
      '\\varepsilon': 'ε', '\\epsilon': 'ε', '\\delta': 'δ',
      '\\varphi': 'φ', '\\cdot': '·', '\\div': '÷', '\\pm': '±', '\\mp': '∓',
      '\\le': '≤', '\\ge': '≥', '\\neq': '≠', '\\equiv': '≡', '\\approx': '≈',
      '\\times': '×', '\\propto': '∝', '\\sim': '~',
      '\\in': '∈', '\\notin': '∉', '\\subseteq': '⊆', '\\subset': '⊂',
      '\\supseteq': '⊇', '\\supset': '⊃', '\\cup': '∪', '\\cap': '∩',
      '\\setminus': '∖', '\\varnothing': '∅', '\\emptyset': '∅',
      '\\forall': '∀', '\\exists': '∃', '\\Rightarrow': '⇒',
      '\\Leftrightarrow': '⇔', '\\iff': '⇔', '\\implies': '⇒',
      '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\Delta': 'Δ',
      '\\sum': 'Σ', '\\int': '∫', '\\partial': '∂', '\\prime': '′',
      '\\pi': 'π', '\\theta': 'θ', '\\lambda': 'λ', '\\mu': 'μ',
      '\\sigma': 'σ', '\\ell': 'ℓ', '\\arg': 'arg',
      '\\log': 'log', '\\ln': 'ln', '\\sin': 'sin', '\\cos': 'cos',
      '\\tan': 'tan', '\\left': '', '\\right': '', '\\quad': ' ', '\\,': ' '
    };
    s = s.replace(/\\[a-zA-Z]+/g, function (m) {
      return Object.prototype.hasOwnProperty.call(map, m) ? map[m] : m.slice(1);
    });
    s = s.replace(/\\/g, '');
    return s;
  }

  function md(text) {
    return String(text == null ? '' : text).split('$').map(function (part, i) {
      if (i % 2 === 1) {
        return '<span class="formula">' + mathHtml(part) + '</span>';
      }
      return esc(part).replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>').replace(/\n/g, '<br>');
    }).join('');
  }

  function getLesson(id) {
    return state.lessons.find(function (l) { return l.id === id; }) || null;
  }

  function flattenTheory(l) {
    return (l.theory || []).map(function (card) {
      return [card.title].concat((card.blocks || []).map(function (block) {
        return [block.content, block.problem, block.solution, block.title]
          .filter(Boolean).join(' ');
      })).join(' ');
    }).join(' ');
  }

  // ---------- отрисовка ----------

  function icon(name) {
    var paths = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
      book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 0 4 23"/><path d="M4 5.5v13"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9.2 1.7 1.7 0 0 0-.7 1.4V22h-4v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.9-.2A1.7 1.7 0 0 0 9 2.1V2h4v.1a1.7 1.7 0 0 0 .7 1.4 1.7 1.7 0 0 0 1.9-.2l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      chev: '<path d="m9 6 6 6-6 6"/>',
      star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
      play: '<path d="m9 7 8 5-8 5V7Z"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
      upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 21h14"/>',
      refresh: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
      spark: '<path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/>',
      alert: '<path d="M12 4 2.8 20h18.4L12 4Z"/><path d="M12 9v5M12 17.5v.5"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
      bulb: '<path d="M9 18h6M10 21h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.5 15.2 14 16 14 17h-4c0-1-.5-1.8-1.5-2.5Z"/>',
      folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
      code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>'
    };
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function toneFor(value) {
    var text = String(value || '');
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash % 5;
  }

  function initialOf(value) {
    var text = String(value || '').trim();
    return text ? text.charAt(0).toUpperCase() : '?';
  }

  function dateLabel() {
    return new Date().toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).replace(' г.', '');
  }

  function railHtml() {
    var items = [
      ['today', 'Сегодня', 'home'],
      ['subjects', 'Предметы', 'grid'],
      ['library', 'Библиотека', 'book'],
      ['settings', 'Настройки', 'settings']
    ];
    var nav = items.map(function (item) {
      return '<button type="button" class="rail-btn' + (screen === item[0] ? ' active' : '') +
        '" data-action="nav" data-screen="' + item[0] + '" title="' + item[1] + '">' +
        icon(item[2]) + '<span>' + item[1] + '</span></button>';
    }).join('');

    return '<aside class="rail">' +
      '<button type="button" class="brand-mark" data-action="nav" data-screen="today" title="Сегодня">' +
      icon('spark') + '</button>' +
      '<nav class="rail-nav">' + nav + '</nav>' +
      '</aside>';
  }

  function topbarHtml(l) {
    if (l) {
      var favorite = state.favorites.indexOf(l.id) >= 0;
      return '<header class="topbar">' +
        '<div class="crumbs"><span>Урок</span><span class="slash">/</span><strong>' +
        esc(l.subject || 'Без предмета') + '</strong></div>' +
        '<div class="top-actions">' +
        '<button type="button" class="icon-btn' + (favorite ? ' active' : '') +
        '" data-action="fav" title="' + (favorite ? 'Убрать из избранного' : 'В избранное') + '">' +
        icon('star') + '</button>' +
        '<button type="button" class="btn ghost sm" data-action="close">Выйти</button>' +
        '</div></header>';
    }

    var labels = {
      today: 'Сегодня',
      subjects: 'Предметы',
      library: 'Библиотека',
      settings: 'Настройки'
    };

    return '<header class="topbar">' +
      '<div class="crumbs"><span>Тренажёр</span><span class="slash">/</span><strong>' +
      (labels[screen] || 'Сегодня') + '</strong></div>' +
      '<div class="top-actions">' +
      '<span class="date-pill">' + icon('calendar') + '<span>' + esc(dateLabel()) + '</span></span>' +
      '<button type="button" class="icon-btn" data-action="theme" title="' +
      (state.settings.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема') + '">' +
      icon(state.settings.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
      '</div></header>';
  }

  function pageHead(eyebrow, title, subtitle, right) {
    return '<div class="page-head">' +
      '<div class="page-head-copy">' +
      '<div class="eyebrow">' + eyebrow + '</div>' +
      '<h1>' + title + '</h1>' +
      (subtitle ? '<p class="page-sub">' + subtitle + '</p>' : '') +
      '</div>' +
      (right ? '<div class="page-side">' + right + '</div>' : '') +
      '</div>';
  }

  function render() {
    var current = openId ? getLesson(openId) : null;
    if (current && lesson) {
      app.innerHTML = lessonHtml(current);
    } else {
      app.innerHTML = shellHtml();
    }
  }

  function shellHtml() {
    var content;
    if (screen === 'subjects') content = subjectsHtml();
    else if (screen === 'library') content = libraryHtml();
    else if (screen === 'settings') content = settingsHtml();
    else content = todayHtml();

    return '<div class="app-shell">' + railHtml() +
      '<div class="shell-main">' + topbarHtml() +
      '<main class="content">' + content + '</main>' +
      '</div></div>';
  }

  function heroArt() {
    return '<svg class="hero-svg" viewBox="0 0 340 260" fill="none" aria-hidden="true">' +
      '<defs>' +
      '<radialGradient id="heroOrb" cx="35%" cy="28%" r="78%">' +
      '<stop offset="0" stop-color="#ffffff"/>' +
      '<stop offset=".32" stop-color="#d9dcff"/>' +
      '<stop offset=".72" stop-color="#9a9cf9"/>' +
      '<stop offset="1" stop-color="#6366f1"/>' +
      '</radialGradient>' +
      '<linearGradient id="heroRing" x1="70" y1="70" x2="310" y2="210" gradientUnits="userSpaceOnUse">' +
      '<stop stop-color="#ffffff" stop-opacity=".95"/>' +
      '<stop offset="1" stop-color="#818cf8" stop-opacity=".15"/>' +
      '</linearGradient>' +
      '<filter id="heroGlow" x="-60%" y="-60%" width="220%" height="220%">' +
      '<feGaussianBlur stdDeviation="24"/>' +
      '</filter>' +
      '</defs>' +
      '<ellipse cx="196" cy="132" rx="124" ry="100" fill="#818cf8" opacity=".18" filter="url(#heroGlow)"/>' +
      '<ellipse cx="192" cy="148" rx="122" ry="38" transform="rotate(-16 192 148)" stroke="url(#heroRing)" stroke-width="2"/>' +
      '<circle class="float-slow" cx="192" cy="122" r="78" fill="url(#heroOrb)"/>' +
      '<circle cx="166" cy="96" r="27" fill="#ffffff" opacity=".2"/>' +
      '<path class="float-fast" d="M282 60l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12Z" fill="#ffffff" opacity=".92"/>' +
      '<path d="M78 72l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill="#a5b4fc"/>' +
      '<path d="M252 196l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#ffffff" opacity=".85"/>' +
      '<g class="float-slow">' +
      '<rect x="146" y="154" width="100" height="60" rx="15" fill="#ffffff" opacity=".94"/>' +
      '<rect x="159" y="169" width="34" height="5" rx="2.5" fill="#c7d2fe"/>' +
      '<rect x="159" y="181" width="57" height="5" rx="2.5" fill="#e0e7ff"/>' +
      '<rect x="159" y="193" width="44" height="5" rx="2.5" fill="#e0e7ff"/>' +
      '<circle cx="225" cy="183" r="12" fill="#6366f1"/>' +
      '<path d="m219 183 4 4 8-8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>' +
      '<path d="M112 176c14-10 34-10 48 0" stroke="#c7d2fe" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  function tasksPill(count) {
    return '<span class="pill">' + icon('target') + count + ' ' +
      plural(count, 'задача', 'задачи', 'задач') + '</span>';
  }

  function taskReason(l, isReview) {
    var p = state.progress[l.id];
    if (isReview) return { label: 'Повторение', cta: 'Повторить', cls: 'review' };
    if (p && !p.done) return { label: 'Продолжить', cta: 'Продолжить', cls: 'progress' };
    return { label: 'Новый урок', cta: 'Начать урок', cls: 'new' };
  }

  function todayHtml() {
    var today = dayKey();
    var due = state.lessons.filter(function (l) {
      var review = state.reviews[l.id];
      return review && review.due && review.due <= today;
    }).sort(function (a, b) {
      return String(state.reviews[a.id].due).localeCompare(String(state.reviews[b.id].due));
    });

    var groups = {};
    state.lessons.forEach(function (l) {
      var p = state.progress[l.id];
      if (p && p.done) return;
      var subject = l.subject || 'Без предмета';
      (groups[subject] = groups[subject] || []).push(l);
    });

    var fresh = [];
    Object.keys(groups).forEach(function (subject) {
      var limit = Number(state.settings.newPerSubject[subject]);
      if (!Number.isFinite(limit)) limit = 1;
      groups[subject].slice().sort(function (a, b) {
        return (Number(a.order) || 0) - (Number(b.order) || 0) ||
          String(a.title || '').localeCompare(String(b.title || ''));
      }).slice(0, Math.max(0, limit)).forEach(function (l) {
        fresh.push(l);
      });
    });

    var shown = due.slice();
    fresh.forEach(function (l) {
      if (!due.some(function (d) { return d.id === l.id; })) shown.push(l);
    });

    var totalMinutes = shown.reduce(function (sum, l) {
      return sum + (Number(l.est_minutes) || 0);
    }, 0);
    var todayMinutes = Number(state.dailyLog[today]) || 0;
    var doneToday = state.lessons.filter(function (l) {
      var p = state.progress[l.id];
      return p && p.lastDone === today;
    }).length;
    var hour = new Date().getHours();
    var hello = hour < 6 ? 'Доброй ночи'
      : hour < 12 ? 'Доброе утро'
      : hour < 18 ? 'Добрый день'
      : 'Добрый вечер';

    var first = shown[0] || null;
    var rest = shown.slice(1);
    var subtitle;
    var content;

    if (!state.lessons.length) {
      subtitle = 'В папке lessons пока нет уроков.';
      content = emptyStateHtml('book', 'Добавим первый урок',
        'Уроки лежат в папке <code class="inline-code">lessons</code>. Создайте файл урока и подключите его в <code class="inline-code">index.html</code> — или просто попросите меня.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Как добавить</button>');
    } else if (!first) {
      var doneText = doneToday
        ? 'Выполнено сегодня: ' + doneToday + ' ' + plural(doneToday, 'урок', 'урока', 'уроков') +
          (todayMinutes ? ' · ' + todayMinutes + ' мин.' : '.')
        : 'Новых уроков нет, повторений тоже. Можно перечитать теорию или добавить новую тему.';
      subtitle = doneToday ? 'План на сегодня выполнен.' : 'На сегодня задач нет.';
      content = '<section class="card done-card">' +
        '<div class="done-icon">' + icon('check') + '</div>' +
        '<div class="done-copy">' +
        '<div class="eyebrow">План выполнен</div>' +
        '<h2>На сегодня всё готово</h2>' +
        '<p class="muted">' + doneText + '</p>' +
        '</div>' +
        '<div class="done-actions">' +
        '<button type="button" class="btn primary" data-action="nav" data-screen="library">' +
        icon('book') + 'Библиотека</button>' +
        '<button type="button" class="btn soft" data-action="nav" data-screen="subjects">' +
        icon('grid') + 'Предметы</button>' +
        '</div></section>';
    } else {
      subtitle = 'Осталось ' + shown.length + ' ' + plural(shown.length, 'задача', 'задачи', 'задач') +
        ' · примерно ' + totalMinutes + ' мин. Начните с первого — остальное подождёт.';
      var reason = taskReason(first, due.indexOf(first) >= 0);
      var next = '<section class="next-card tone-' + toneFor(first.subject || first.title) + '">' +
        '<div class="next-copy">' +
        '<div class="next-kicker"><span class="eyebrow">Сейчас · 1 из ' + shown.length + '</span>' +
        '<span class="badge ' + reason.cls + '">' + reason.label + '</span></div>' +
        '<h2>' + esc(first.title || 'Без названия') + '</h2>' +
        '<div class="next-meta">' +
        '<span>' + esc(first.subject || 'Без предмета') + '</span>' +
        (first.topic ? '<span class="dot">·</span><span>' + esc(first.topic) + '</span>' : '') +
        (first.est_minutes ? '<span class="dot">·</span><span class="next-time">' +
          icon('clock') + first.est_minutes + ' мин</span>' : '') +
        '</div>' +
        '<div class="next-actions">' +
        '<button type="button" class="btn primary lg" data-action="open" data-id="' + esc(first.id) +
        '" data-review="' + (due.indexOf(first) >= 0 ? '1' : '0') + '">' +
        icon('play') + reason.cta + '</button>' +
        '</div></div>' +
        '<div class="next-art">' + heroArt() + '</div>' +
        '</section>';

      var plan;
      if (rest.length) {
        plan = '<section class="section plan-section">' +
          '<div class="section-head"><h2>Дальше по плану</h2>' +
          '<span class="count-pill">' + rest.length + '</span></div>' +
          '<div class="lesson-list">' + rest.map(function (l, i) {
            return lessonCardHtml(l, due.indexOf(l) >= 0, false, i + 2);
          }).join('') + '</div></section>';
      } else {
        plan = '<p class="plan-tail">После этого урока на сегодня всё. Можно выдохнуть.</p>';
      }

      var footerParts = [];
      footerParts.push('выполнено ' + doneToday + ' ' + plural(doneToday, 'урок', 'урока', 'уроков'));
      if (todayMinutes) footerParts.push(todayMinutes + ' мин');
      var footer = (doneToday || todayMinutes)
        ? '<div class="day-footer">' + icon('check') + '<span>Сегодня: ' + footerParts.join(' · ') + '</span></div>'
        : '';

      content = next + plan + footer;
    }

    return '<div class="today-page">' +
      pageHead('План на сегодня', hello, subtitle, tasksPill(shown.length)) +
      content + '</div>';
  }

  function lessonCardHtml(l, isReview, compact, index) {
    var p = state.progress[l.id];
    var status;
    var badgeClass;

    if (isReview) {
      status = 'повторение';
      badgeClass = 'review';
    } else if (!p) {
      status = 'новый';
      badgeClass = 'new';
    } else if (p.done) {
      status = 'пройден';
      badgeClass = 'done';
    } else {
      status = 'продолжить';
      badgeClass = 'progress';
    }

    var meta = [];
    if (!compact) meta.push(l.subject || 'Без предмета');
    if (l.topic) meta.push(l.topic);
    if (compact && l.est_minutes) meta.push(l.est_minutes + ' мин');
    if (p && p.mistakes) meta.push('ошибок: ' + p.mistakes);

    var time = l.est_minutes
      ? '<span class="lesson-time">' + icon('clock') + l.est_minutes + ' мин</span>'
      : '';
    var indexHtml = index
      ? '<span class="plan-index">' + index + '</span>'
      : '';

    return '<button type="button" class="lesson-card' + (compact ? ' compact' : '') +
      '" data-action="open" data-id="' + esc(l.id) + '" data-review="' + (isReview ? '1' : '0') + '">' +
      indexHtml +
      '<span class="lesson-avatar tone-' + toneFor(l.subject || l.title) + '">' +
      esc(initialOf(l.subject || l.title)) + '</span>' +
      '<span class="lesson-info">' +
      '<span class="lesson-title">' + esc(l.title || 'Без названия') + '</span>' +
      '<span class="lesson-meta">' + esc(meta.join(' · ')) + '</span>' +
      '</span>' +
      '<span class="lesson-side">' +
      '<span class="badge ' + badgeClass + '">' + status + '</span>' +
      (compact ? '' : time) +
      '<span class="lesson-arrow">' + icon('chev') + '</span>' +
      '</span>' +
      '</button>';
  }

  function subjectCardHtml(subject) {
    var list = state.lessons.filter(function (l) {
      return (l.subject || 'Без предмета') === subject;
    }).sort(function (a, b) {
      return (Number(a.order) || 0) - (Number(b.order) || 0) ||
        String(a.title || '').localeCompare(String(b.title || ''));
    });

    var done = list.filter(function (l) {
      return state.progress[l.id] && state.progress[l.id].done;
    }).length;
    var percent = list.length ? Math.round(done / list.length * 100) : 0;
    var tone = toneFor(subject);

    return '<section class="card subject-card tone-' + tone + '">' +
      '<div class="subject-head">' +
      '<span class="subject-icon">' + esc(initialOf(subject)) + '</span>' +
      '<div class="grow"><h2>' + esc(subject) + '</h2>' +
      '<span class="muted small">' + done + ' из ' + list.length + ' пройдено</span></div>' +
      '<span class="subject-pct">' + percent + '%</span>' +
      '</div>' +
      '<div class="progress"><span style="width:' + percent + '%"></span></div>' +
      '<div class="lesson-list compact">' +
      list.map(function (l) { return lessonCardHtml(l, false, true); }).join('') +
      '</div></section>';
  }

  function subjectsHtml() {
    var subjects = [];
    state.lessons.forEach(function (l) {
      var subject = l.subject || 'Без предмета';
      if (subjects.indexOf(subject) < 0) subjects.push(subject);
    });

    var subtitle = subjects.length
      ? subjects.length + ' ' + plural(subjects.length, 'предмет', 'предмета', 'предметов') +
        ' · ' + state.lessons.length + ' ' + plural(state.lessons.length, 'урок', 'урока', 'уроков')
      : 'Пока пусто — добавьте первый урок.';

    var content = subjects.length
      ? '<div class="subject-grid">' + subjects.map(subjectCardHtml).join('') + '</div>'
      : emptyStateHtml('grid', 'Предметов пока нет',
        'Уроки автоматически разложатся по предметам, когда появятся в папке lessons.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Настройки</button>');

    return pageHead('Библиотека знаний', 'Предметы', subtitle) + content;
  }

  function libraryHtml() {
    return pageHead('Все материалы', 'Библиотека',
      'Теория всех уроков в одном месте. Поиск идёт по названию и содержимому.') +
      '<div class="library-toolbar card">' +
      '<label class="search-box">' + icon('search') +
      '<input data-action="library-search" value="' + esc(libraryQuery) +
      '" placeholder="Поиск по урокам и теории" autocomplete="off"></label>' +
      '<span class="muted small">' + state.lessons.length + ' ' +
      plural(state.lessons.length, 'урок', 'урока', 'уроков') + '</span>' +
      '</div>' +
      '<div id="library-results" class="library-list">' + libraryResultsHtml() + '</div>';
  }

  function libraryResultsHtml() {
    var query = libraryQuery.trim().toLowerCase();
    var list = state.lessons.filter(function (l) {
      if (!query) return true;
      return (String(l.title || '') + ' ' + flattenTheory(l)).toLowerCase().indexOf(query) >= 0;
    });

    if (!state.lessons.length) {
      return emptyStateHtml('book', 'Библиотека пуста',
        'Добавьте файлы уроков в папку lessons — вся теория появится здесь.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Настройки</button>');
    }

    if (!list.length) {
      return emptyStateHtml('search', 'Ничего не найдено',
        'Попробуйте другой запрос или откройте всю библиотеку.', '');
    }

    return list.map(function (l) {
      var theory = (l.theory || []).map(function (card) {
        return '<section class="theory-section">' +
          '<h3>' + esc(card.title || '') + '</h3>' +
          '<div class="theory-blocks">' +
          (card.blocks || []).map(blockHtml).join('') +
          '</div></section>';
      }).join('');

      return '<article class="card library-card tone-' + toneFor(l.subject || l.title) + '">' +
        '<header class="library-head">' +
        '<span class="subject-icon small">' + esc(initialOf(l.subject || l.title)) + '</span>' +
        '<div class="grow">' +
        '<div class="eyebrow">' + esc(l.subject || 'Без предмета') +
        (l.topic ? ' · ' + esc(l.topic) : '') + '</div>' +
        '<h2>' + esc(l.title || 'Без названия') + '</h2>' +
        '</div>' +
        (l.est_minutes
          ? '<span class="lesson-time">' + icon('clock') + l.est_minutes + ' мин</span>'
          : '') +
        '</header>' +
        '<div class="library-body">' +
        (theory || '<p class="muted">Теория для этого урока не добавлена.</p>') +
        '</div></article>';
    }).join('');
  }

  function settingsHtml() {
    var subjects = [];
    state.lessons.forEach(function (l) {
      var subject = l.subject || 'Без предмета';
      if (subjects.indexOf(subject) < 0) subjects.push(subject);
    });

    var doneCount = state.lessons.filter(function (l) {
      return state.progress[l.id] && state.progress[l.id].done;
    }).length;

    var perSubject = subjects.length
      ? '<div class="per-subject-grid">' + subjects.map(function (subject) {
        var value = state.settings.newPerSubject[subject];
        if (value === undefined || value === null) value = 1;
        return '<label class="subject-limit">' +
          '<span class="subject-icon small tone-' + toneFor(subject) + '">' +
          esc(initialOf(subject)) + '</span>' +
          '<span class="grow"><strong>' + esc(subject) + '</strong><small>новых в день</small></span>' +
          '<input class="input num" type="number" min="0" max="20" data-action="new-per-subject" data-subject="' +
          esc(subject) + '" value="' + esc(value) + '">' +
          '</label>';
      }).join('') + '</div>'
      : '<p class="section-empty">Появится, когда в папке lessons будут уроки.</p>';

    return pageHead('Персонализация', 'Настройки',
      'Локальные уроки, темп и данные.') +
      '<div class="settings-grid">' +

      '<section class="card settings-card wide">' +
      '<div class="card-head"><div><div class="eyebrow">Уроки</div><h2>Локальная папка</h2></div>' +
      '<span class="count-pill">' + state.lessons.length + '</span></div>' +
      '<p class="muted small">Каждый урок — отдельный файл в папке <code class="inline-code">lessons</code>. ' +
      'Новые темы подключаются в <code class="inline-code">index.html</code>. ' +
      'Можете просто попросить меня — я добавлю файл и подключу его. После этого обновите страницу.</p>' +
      '<div class="folder-stats">' +
      '<div class="folder-stat"><strong>' + state.lessons.length + '</strong><span>уроков</span></div>' +
      '<div class="folder-stat"><strong>' + subjects.length + '</strong><span>предметов</span></div>' +
      '<div class="folder-stat"><strong>' + doneCount + '</strong><span>пройдено</span></div>' +
      '</div>' +
      '<span class="path-chip">' + icon('folder') + 'lessons/</span>' +
      '</section>' +

      '<section class="card settings-card wide">' +
      '<div class="card-head"><div><div class="eyebrow">План</div><h2>Новых уроков в день</h2></div></div>' +
      '<p class="muted small">Сколько новых уроков показывать на экране «Сегодня» для каждого предмета.</p>' +
      perSubject +
      '</section>' +

      '<section class="card settings-card wide" id="sync-card">' +
      '<div class="card-head"><div><div class="eyebrow">Устройства</div>' +
      '<h2>Прогресс на телефоне и компьютере</h2></div>' +
      '<span id="sync-state">' + syncStateHtml() + '</span></div>' +
      '<p class="muted small">Введите один и тот же код комнаты на всех устройствах — прогресс ' +
      'будет сохраняться в облако и подтягиваться автоматически. Без интернета приложение ' +
      'работает локально и досылает данные, когда сеть появится.</p>' +
      '<div class="sync-row">' +
      '<input class="input" id="sync-room-input" placeholder="Код комнаты" autocomplete="off" ' +
      'value="' + esc(sync.room) + '">' +
      '<button type="button" class="btn primary sm" data-action="sync-save-room">Подключить</button>' +
      '<button type="button" class="btn soft sm" data-action="sync-now">Синхронизировать</button>' +
      '</div>' +
      '</section>' +

      '<details class="card settings-card wide data-details">' +
      '<summary><div><div class="eyebrow">Данные</div><h2>Перенос и сброс</h2></div>' +
      '<span class="data-hint">развернуть</span></summary>' +
      '<p class="muted small">Прогресс хранится в браузере. JSON поможет перенести его на другое устройство.</p>' +
      '<div class="button-stack">' +
      '<button type="button" class="btn soft" data-action="export">' +
      icon('download') + 'Скачать прогресс</button>' +
      '<label class="btn soft">' + icon('upload') + 'Импортировать прогресс' +
      '<input type="file" accept=".json,application/json" data-action="import-file" hidden></label>' +
      '<button type="button" class="btn soft danger" data-action="reset">' +
      icon('refresh') + 'Сбросить прогресс</button>' +
      '</div></details>' +

      '</div>';
  }

  function emptyStateHtml(iconName, title, text, actions) {
    return '<div class="card empty-state">' +
      '<div class="empty-icon">' + icon(iconName) + '</div>' +
      '<h2>' + title + '</h2>' +
      '<p class="muted">' + text + '</p>' +
      (actions ? '<div class="empty-actions">' + actions + '</div>' : '') +
      '</div>';
  }

  function blockHtml(block) {
    var type = block && block.type;

    if (type === 'formula') {
      return '<div class="formula-block">' + md('$' + (block.content || '') + '$') + '</div>';
    }
    if (type === 'example') {
      return '<div class="block example"><div class="label">' + icon('bulb') + 'Пример</div>' +
        '<div class="prose">' + md(block.problem) + '</div>' +
        '<div class="prose block-solution">' + md(block.solution) + '</div></div>';
    }
    if (type === 'warning') {
      return '<div class="block warning"><div class="label">' + icon('alert') + 'Внимание</div>' +
        '<div class="prose">' + md(block.content) + '</div></div>';
    }
    if (type === 'remember') {
      return '<div class="block remember"><div class="label">' + icon('info') + 'Запомнить</div>' +
        '<div class="prose">' + md(block.content) + '</div></div>';
    }
    if (type === 'code') {
      return '<div class="block code-block"><div class="label">' + icon('code') + 'Код</div>' +
        '<pre><code>' + esc(block.content) + '</code></pre></div>';
    }
    if (type === 'table') {
      var headers = Array.isArray(block.headers) ? block.headers : [];
      var rows = Array.isArray(block.rows) ? block.rows : [];
      return '<div class="block table-block">' +
        (block.title ? '<div class="label">' + icon('grid') + esc(block.title) + '</div>' : '') +
        '<div class="table-wrap"><table>' +
        (headers.length
          ? '<thead><tr>' + headers.map(function (cell) {
            return '<th>' + md(cell) + '</th>';
          }).join('') + '</tr></thead>'
          : '') +
        '<tbody>' + rows.map(function (row) {
          return '<tr>' + (row || []).map(function (cell) {
            return '<td>' + md(cell) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody>' +
        '</table></div></div>';
    }
    return '<p class="prose">' + md(block && block.content) + '</p>';
  }

  // ---------- экран урока ----------

  function stepperHtml() {
    var steps = reviewMode
      ? [['practice', 'Практика'], ['summary', 'Итоги']]
      : [['hook', 'Разминка'], ['theory', 'Теория'], ['practice', 'Практика'], ['summary', 'Итоги']];
    var current = -1;
    steps.forEach(function (step, i) {
      if (step[0] === lesson.phase) current = i;
    });

    return '<ol class="stepper">' + steps.map(function (step, i) {
      var cls = '';
      if (i < current || (i === current && lesson.finished)) cls = ' done';
      else if (i === current) cls = ' active';

      return '<li class="stepper-item' + cls + '">' +
        '<span class="stepper-dot">' +
        (cls.indexOf('done') >= 0 ? icon('check') : (i + 1)) +
        '</span>' +
        '<span class="stepper-label">' + step[1] + '</span>' +
        '</li>';
    }).join('') + '</ol>';
  }


  function lessonHtml(l) {
    var tasks = currentTasks();
    var body;
    if (lesson.phase === 'hook') body = hookHtml(l);
    else if (lesson.phase === 'theory') body = theoryHtml(l);
    else if (lesson.phase === 'practice') body = practiceHtml(l, tasks);
    else body = summaryHtml(l);

    return '<div class="app-shell">' + railHtml() +
      '<div class="shell-main">' + topbarHtml(l) +
      '<main class="content">' +
      '<div class="lesson-layout">' +
      '<div class="lesson-main">' +
      '<div class="lesson-head">' +
      '<span class="pill">' + (reviewMode ? 'Повторение' : 'Урок') + '</span>' +
      '<div class="eyebrow">' + esc(l.subject || 'Без предмета') +
      (l.topic ? ' · ' + esc(l.topic) : '') + '</div>' +
      '<h1>' + esc(l.title || 'Без названия') + '</h1>' +
      '<div class="lesson-head-meta">' +
      '<span>' + icon('clock') + (l.est_minutes || '—') + ' мин</span>' +
      '<span>' + icon('layers') + tasks.length + ' ' + plural(tasks.length, 'задача', 'задачи', 'задач') + '</span>' +
      '<span>' + icon('target') + lesson.mistakes + ' ' + plural(lesson.mistakes, 'ошибка', 'ошибки', 'ошибок') + '</span>' +
      '</div>' +
      '</div>' +
      body +
      '</div>' +
      '<aside class="lesson-aside">' +
      '<section class="card steps-card">' +
      '<div class="card-head"><div><div class="eyebrow">Маршрут</div><h3>Этапы</h3></div></div>' +
      stepperHtml() +
      '</section>' +
      '</aside>' +
      '</div>' +
      '</main></div></div>';
  }

  function hookHtml(l) {
    if (!l.hook) {
      return '<button type="button" class="btn primary" data-action="next">Дальше</button>';
    }

    return '<div class="card focus-card stack">' +
      '<div class="focus-label"><div class="eyebrow">Разминка</div>' +
      '<span class="soft-pill">без штрафа</span></div>' +
      taskHtml(l.hook) +
      (lesson.answered && l.hook.reveal
        ? '<div class="block remember reveal-block"><div class="label">' + icon('info') +
          'Связь с темой</div><div class="prose">' + md(l.hook.reveal) + '</div></div>'
        : '') +
      (lesson.answered
        ? '<div class="focus-footer"><span class="muted tiny">Можно отвечать без страха ошибки</span>' +
          '<button type="button" class="btn primary" data-action="next">Дальше' + icon('arrow') + '</button></div>'
        : '') +
      '</div>';
  }

  function theoryHtml(l) {
    var theory = l.theory || [];
    var card = theory[lesson.stepIndex];

    if (!card) {
      return '<button type="button" class="btn primary" data-action="next">К практике' + icon('arrow') + '</button>';
    }

    var nextLabel = lesson.stepIndex + 1 < theory.length ? 'Дальше' : 'К практике';

    return '<div class="card focus-card stack">' +
      '<div class="focus-label">' +
      '<div class="eyebrow">Теория · ' + (lesson.stepIndex + 1) + ' из ' + theory.length + '</div>' +
      '<span class="soft-pill">' + esc(card.title || 'Карточка') + '</span>' +
      '</div>' +
      '<h2>' + esc(card.title || '') + '</h2>' +
      '<div class="prose">' + (card.blocks || []).map(blockHtml).join('') + '</div>' +
      '<div class="focus-footer">' +
      '<span class="muted tiny">Прочитайте спокойно — потом практика</span>' +
      '<button type="button" class="btn primary" data-action="next">' + nextLabel + icon('arrow') + '</button>' +
      '</div></div>';
  }

  function practiceHtml(l, tasks) {
    var task = tasks[lesson.stepIndex];
    if (!task) {
      return '<button type="button" class="btn primary" data-action="next">К итогам' + icon('arrow') + '</button>';
    }

    var width = Math.round((lesson.stepIndex + 1) / tasks.length * 100);

    return '<div class="card focus-card stack">' +
      '<div class="focus-label">' +
      '<div class="eyebrow">Практика' + (reviewMode ? ' · повторение' : '') + '</div>' +
      '<span class="soft-pill">' + (lesson.stepIndex + 1) + ' / ' + tasks.length + '</span>' +
      '</div>' +
      '<div class="task-progress"><span style="width:' + width + '%"></span></div>' +
      taskHtml(task) +
      (lesson.answered
        ? '<div class="focus-footer"><span class="muted tiny">Ошибки не страшны — они тоже учат</span>' +
          '<button type="button" class="btn primary" data-action="next">' +
          (lesson.stepIndex + 1 < tasks.length ? 'Дальше' : 'К итогам') + icon('arrow') + '</button></div>'
        : '') +
      '</div>';
  }

  function summaryHtml(l) {
    var points = (l.summary || []).map(function (point) {
      return '<div class="summary-item"><span class="check">' + icon('check') + '</span>' +
        '<div class="prose">' + md(point) + '</div></div>';
    }).join('');

    var cards = (l.review_cards || []).length
      ? '<div class="card review-cards-card">' +
        '<div class="card-head"><div><div class="eyebrow">На будущее</div><h3>Карточки повторения</h3></div>' +
        '<span class="count-pill">' + l.review_cards.length + '</span></div>' +
        '<div class="review-cards">' + l.review_cards.map(function (card, i) {
          var q = card.q || card.question || '';
          var a = card.a || card.answer || '';
          return '<details class="review-card">' +
            '<summary><span class="rc-num">' + (i + 1) + '</span>' +
            '<span class="rc-q prose">' + md(q) + '</span></summary>' +
            '<div class="rc-a prose">' + md(a) + '</div></details>';
        }).join('') + '</div></div>'
      : '';

    var action;
    if (!lesson.finished) {
      action = '<div class="summary-action"><button type="button" class="btn primary" data-action="finish">' +
        'Готово' + icon('check') + '</button></div>';
    } else if (!lesson.rating) {
      var current = (state.reviews[l.id] && state.reviews[l.id].interval) || 1;
      action = '<div class="card rating-card stack">' +
        '<div><div class="eyebrow">Повторение</div><h3>Как запомнилось?</h3></div>' +
        '<div class="rating-grid">' +
        RATING_ORDER.map(function (rating) {
          return ratingButtonHtml(rating, current);
        }).join('') +
        '</div></div>';
    } else {
      var nextDue = dayKey(nextInterval(lesson.rating, (state.reviews[l.id] && state.reviews[l.id].interval) || 1));
      action = '<div class="card completion-card">' +
        '<div class="completion-icon">' + icon('calendar') + '</div>' +
        '<div class="grow"><strong>Следующее повторение</strong>' +
        '<p class="muted small">' + ruDate(nextDue) + '</p></div>' +
        '<button type="button" class="btn primary" data-action="close">К урокам' + icon('arrow') + '</button>' +
        '</div>';
    }

    return '<div class="stack">' +
      '<div class="card summary-card">' +
      '<div class="summary-head">' +
      '<div class="summary-icon">' + icon('check') + '</div>' +
      '<div><div class="eyebrow">' + (reviewMode ? 'Повторение завершено' : 'Урок завершён') + '</div>' +
      '<h2>' + (reviewMode ? 'Отлично освежили память' : 'Итоги урока') + '</h2></div>' +
      '</div>' +
      '<div class="summary-points">' +
      (points || '<p class="muted">Пунктов итога нет.</p>') +
      '</div>' +
      '<div class="summary-meta">' +
      '<span>' + icon('clock') + 'Время: <span data-timer>' + minutesLabel(lesson.seconds) + '</span></span>' +
      '<span>' + icon('target') + 'Ошибок: ' + lesson.mistakes + '</span>' +
      '</div></div>' +
      cards +
      action +
      '</div>';
  }

  function ratingButtonHtml(rating, current) {
    var days = nextInterval(rating, current);
    return '<button type="button" class="rating-btn rating-' + rating + '" data-action="rate" data-rating="' + rating + '">' +
      '<strong>' + RATING_LABELS[rating] + '</strong>' +
      '<span>через ' + days + ' ' + plural(days, 'день', 'дня', 'дней') + '</span>' +
      '</button>';
  }

  // ---------- задачи ----------

  function taskHtml(task) {
    if (!task) return '';

    var type = task.type || '';
    if (type === 'flashcard') {
      var front = task.question || task.front;
      var back = task.back || task.answer;
      if (lesson.showBack) {
        return '<div class="stack">' +
          '<div class="task-question prose">' + md(front) + '</div>' +
          '<div class="block example"><div class="label">Ответ</div>' +
          '<div class="prose">' + md(back) + '</div></div>' +
          '</div>';
      }
      return '<div class="stack">' +
        '<div class="task-question prose">' + md(front) + '</div>' +
        '<div><button type="button" class="btn primary" data-action="show-back">Показать ответ</button></div>' +
        '</div>';
    }

    var isChoice = type === 'single_choice' || type === 'true_false';
    var isMulti = type === 'multi_choice';
    var isText = isTextTask(type);
    var options = task.options || (type === 'true_false' ? ['Верно', 'Неверно'] : []);
    var correct = type === 'true_false' && typeof task.correct === 'boolean'
      ? (task.correct ? 0 : 1)
      : (type === 'true_false' && typeof task.correct === 'string'
        ? (normalize(task.correct) === 'верно' ? 0 : 1)
        : task.correct);

    var html = '<div class="task-question prose">' + md(task.question) + '</div>';

    if (isChoice) {
      html += '<div class="options">' + options.map(function (option, i) {
        return optionHtml(option, i, {
          multi: false,
          selected: lesson.selected === i,
          correct: Number(correct) === i
        });
      }).join('') + '</div>';
    }

    if (isMulti) {
      html += '<div class="options">' + options.map(function (option, i) {
        return optionHtml(option, i, {
          multi: true,
          selected: Array.isArray(lesson.selected) && lesson.selected.indexOf(i) >= 0,
          correct: (task.correct || []).map(Number).indexOf(i) >= 0
        });
      }).join('') + '</div>';
    }

    if (isText) {
      html += '<input class="input" data-action="answer" value="' + esc(lesson.value) + '"' +
        (lesson.checked ? ' disabled' : '') +
        ' placeholder="' + (type === 'numeric' ? 'Число' : 'Ваш ответ') + '" autocomplete="off">';
    }

    if (task.hint && !lesson.checked) {
      html += lesson.hint
        ? '<div class="hint-block">' + icon('bulb') + '<span>' + md(task.hint) + '</span></div>'
        : '<button type="button" class="hint-btn" data-action="hint">' + icon('bulb') + 'Подсказка</button>';
    }

    if (!lesson.checked) {
      html += '<div><button type="button" class="btn primary" data-action="check">Проверить</button></div>';
    } else {
      html += '<div class="stack">' +
        '<div class="result ' + (lesson.ok ? 'ok' : 'bad') + '">' + (lesson.ok ? 'Верно' : 'Неверно') + '</div>' +
        (task.explanation ? '<div class="muted prose">' + md(task.explanation) + '</div>' : '') +
        '</div>';
    }

    return '<div class="stack">' + html + '</div>';
  }

  function optionHtml(option, index, config) {
    var classes = 'option';
    if (config.multi) classes += ' multi';
    if (config.selected) classes += ' selected';
    if (lesson.checked && config.correct) classes += ' correct';
    if (lesson.checked && config.selected && !config.correct) classes += ' wrong';

    return '<button type="button" class="' + classes + '" data-action="select" data-index="' + index + '">' +
      '<span class="mark"></span><span>' + md(option) + '</span></button>';
  }

  // ---------- состояние урока ----------

  function buildLessonUi(l) {
    var saved = state.progress[l.id] || {};
    var allTasks = l.practice || [];
    var tasks = reviewMode ? allTasks.slice(0, 2) : allTasks;
    var theory = l.theory || [];

    function firstPhase() {
      if (l.hook) return 'hook';
      if (theory.length) return 'theory';
      if (tasks.length) return 'practice';
      return 'summary';
    }

    var phase;
    if (reviewMode) {
      phase = tasks.length ? 'practice' : 'summary';
    } else if (saved.done) {
      phase = firstPhase();
    } else {
      phase = saved.phase || firstPhase();
      if (phase === 'hook' && !l.hook) phase = 'theory';
      if (phase === 'theory' && !theory.length) phase = 'practice';
      if (phase === 'practice' && !tasks.length) phase = 'summary';
      if (['hook', 'theory', 'practice', 'summary'].indexOf(phase) < 0) phase = firstPhase();
    }

    var stepIndex = (!reviewMode && saved.phase === phase) ? (Number(saved.stepIndex) || 0) : 0;

    return {
      phase: phase,
      stepIndex: stepIndex,
      done: !!saved.done,
      seconds: Number(saved.seconds) || 0,
      mistakes: Number(saved.mistakes) || 0,
      answered: false,
      selected: null,
      value: '',
      checked: false,
      ok: false,
      showBack: false,
      hint: false,
      finished: false,
      rating: null
    };
  }

  function currentTasks() {
    var l = getLesson(openId);
    if (!l) return [];
    return reviewMode ? (l.practice || []).slice(0, 2) : (l.practice || []);
  }

  function activeTask() {
    if (!lesson) return null;
    var l = getLesson(openId);
    if (!l) return null;
    if (lesson.phase === 'hook') return l.hook || null;
    if (lesson.phase === 'practice') return currentTasks()[lesson.stepIndex] || null;
    return null;
  }

  function saveLessonProgress() {
    if (!openId || !lesson) return;
    var previous = state.progress[openId] || {};
    state.progress[openId] = {
      phase: lesson.phase,
      stepIndex: lesson.stepIndex,
      done: lesson.done,
      seconds: lesson.seconds,
      mistakes: lesson.mistakes,
      lastDone: previous.lastDone || '',
      updatedAt: Date.now()
    };
    persist();
  }

  function resetTaskUi() {
    lesson.answered = false;
    lesson.selected = null;
    lesson.value = '';
    lesson.checked = false;
    lesson.ok = false;
    lesson.showBack = false;
    lesson.hint = false;
  }

  function openLesson(id, isReview) {
    var l = getLesson(id);
    if (!l) return;
    openId = id;
    reviewMode = !!isReview;
    lesson = buildLessonUi(l);
    startTimer();
    render();
    window.scrollTo(0, 0);
  }

  function closeLesson() {
    saveLessonProgress();
    stopTimer();
    openId = null;
    reviewMode = false;
    lesson = null;
    render();
    window.scrollTo(0, 0);
  }

  function startPractice() {
    if (currentTasks().length) {
      lesson.phase = 'practice';
      lesson.stepIndex = 0;
      resetTaskUi();
    } else {
      lesson.phase = 'summary';
      lesson.stepIndex = 0;
    }
  }

  function nextStep() {
    if (!lesson) return;

    if (lesson.phase === 'hook') {
      var theory = getLesson(openId).theory || [];
      if (theory.length) {
        lesson.phase = 'theory';
        lesson.stepIndex = 0;
      } else {
        startPractice();
      }
    } else if (lesson.phase === 'theory') {
      var cards = getLesson(openId).theory || [];
      if (lesson.stepIndex + 1 < cards.length) {
        lesson.stepIndex++;
      } else {
        startPractice();
      }
    } else if (lesson.phase === 'practice') {
      if (lesson.stepIndex + 1 < currentTasks().length) {
        lesson.stepIndex++;
        resetTaskUi();
      } else {
        lesson.phase = 'summary';
        lesson.stepIndex = 0;
      }
    }

    saveLessonProgress();
    render();
  }

  function checkTask() {
    if (!lesson || lesson.checked) return;
    var task = activeTask();
    if (!task || task.type === 'flashcard') return;

    var answer;
    if (task.type === 'multi_choice') {
      answer = lesson.selected || [];
      if (!answer.length) return;
    } else if (isTextTask(task.type)) {
      answer = lesson.value;
      if (!String(answer).trim()) return;
    } else {
      answer = lesson.selected;
      if (answer === null || answer === undefined) return;
    }

    var good = isCorrect(task, answer);
    lesson.checked = true;
    lesson.ok = good;
    lesson.answered = true;
    if (!good && lesson.phase === 'practice') {
      lesson.mistakes++;
    }
    saveLessonProgress();
    render();
  }

  function selectOption(index) {
    if (!lesson || lesson.checked || !lesson) return;
    var task = activeTask();
    if (!task || isTextTask(task.type) || task.type === 'flashcard') return;

    if (task.type === 'multi_choice') {
      var arr = Array.isArray(lesson.selected) ? lesson.selected.slice() : [];
      var position = arr.indexOf(index);
      if (position >= 0) arr.splice(position, 1);
      else arr.push(index);
      lesson.selected = arr;
    } else {
      lesson.selected = index;
    }
    render();
  }

  function showBack() {
    if (!lesson) return;
    lesson.showBack = true;
    lesson.answered = true;
    render();
  }

  function finishLesson() {
    if (!lesson || lesson.finished) return;
    var l = getLesson(openId);
    if (!l) return;

    lesson.done = true;
    lesson.finished = true;
    lesson.phase = 'summary';
    lesson.stepIndex = 0;
    saveLessonProgress();

    var today = dayKey();
    var minutes = Math.max(1, Math.round(lesson.seconds / 60));
    state.progress[openId].lastDone = today;
    state.reviews[openId] = { due: dayKey(1), interval: 1 };
    state.dailyLog[today] = (Number(state.dailyLog[today]) || 0) + minutes;
    persist();
    stopTimer();
    render();
  }

  function rateLesson(rating) {
    if (!openId) return;
    var current = (state.reviews[openId] && Number(state.reviews[openId].interval)) || 1;
    var interval = nextInterval(rating, current);
    state.reviews[openId] = { due: dayKey(interval), interval: interval };
    lesson.rating = rating;
    persist();
    render();
  }

  function toggleFavorite() {
    if (!openId) return;
    var position = state.favorites.indexOf(openId);
    if (position >= 0) state.favorites.splice(position, 1);
    else state.favorites.push(openId);
    persist();
    render();
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(function () {
      if (!lesson) return;
      lesson.seconds++;
      var el = document.querySelector('[data-timer]');
      if (el) el.textContent = minutesLabel(lesson.seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // ---------- события ----------

  function onClick(event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;

    var action = target.getAttribute('data-action');

    if (action === 'nav') {
      if (openId) {
        saveLessonProgress();
        stopTimer();
        openId = null;
        reviewMode = false;
        lesson = null;
      }
      screen = target.getAttribute('data-screen') || 'today';
      render();
      window.scrollTo(0, 0);
    } else if (action === 'open') {
      openLesson(target.getAttribute('data-id'), target.getAttribute('data-review') === '1');
    } else if (action === 'close') {
      closeLesson();
    } else if (action === 'fav') {
      toggleFavorite();
    } else if (action === 'select') {
      selectOption(Number(target.getAttribute('data-index')));
    } else if (action === 'check') {
      checkTask();
    } else if (action === 'next') {
      nextStep();
    } else if (action === 'show-back') {
      showBack();
    } else if (action === 'hint') {
      lesson.hint = true;
      render();
    } else if (action === 'finish') {
      finishLesson();
    } else if (action === 'rate') {
      rateLesson(target.getAttribute('data-rating'));
    } else if (action === 'theme') {
      state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
      persist();
      render();
    } else if (action === 'sync-save-room') {
      var field = document.getElementById('sync-room-input');
      sync.room = field ? field.value.trim().toLowerCase() : '';
      saveSyncConfig();
      if (sync.room) {
        cloudLoad().then(function (ok) {
          if (ok) cloudSave();
        });
      }
      render();
    } else if (action === 'sync-now') {
      cloudLoad().then(function () { cloudSave(); });
    } else if (action === 'sync-create') {
      sync.room = makeRoomCode();
      saveSyncConfig();
      render();
    } else if (action === 'sync-leave') {
      sync.room = '';
      saveSyncConfig();
      render();
    } else if (action === 'sync-upload') {
      downloadSync();
    } else if (action === 'export') {
      exportProgress();
    } else if (action === 'reset') {
      resetProgress();
    }
  }

  function onInput(event) {
    var target = event.target;
    var action = target.getAttribute('data-action');

    if (action === 'library-search') {
      libraryQuery = target.value;
      var box = document.getElementById('library-results');
      if (box) box.innerHTML = libraryResultsHtml();
    } else if (action === 'answer') {
      if (lesson) lesson.value = target.value;
    } else if (action === 'new-per-subject') {
      var subject = target.getAttribute('data-subject');
      var value = Math.max(0, Math.floor(Number(target.value) || 0));
      state.settings.newPerSubject[subject] = value;
      persist();
    } else if (action === 'sync-room') {
      sync.room = target.value.trim().toLowerCase();
      saveSyncConfig();
    }
  }

  function onChange(event) {
    var target = event.target;
    var action = target.getAttribute('data-action');

    if (action === 'sync-file') {
      readFile(target.files[0], importSync);
      target.value = '';
    } else if (action === 'import-file') {
      readFile(target.files[0], importProgress);
      target.value = '';
    } else if (action === 'new-per-subject') {
      var subject = target.getAttribute('data-subject');
      target.value = String(state.settings.newPerSubject[subject] || 0);
    }
  }

  function onKeyDown(event) {
    if (event.target.getAttribute('data-action') === 'answer' && event.key === 'Enter') {
      event.preventDefault();
      checkTask();
    }
  }

  // ---------- настройки и данные ----------

  function readFile(file, handler) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () { handler(String(reader.result)); };
    reader.readAsText(file);
  }

  function exportProgress() {
    var data = {
      progress: state.progress,
      reviews: state.reviews,
      dailyLog: state.dailyLog,
      settings: state.settings,
      favorites: state.favorites
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'progress-' + dayKey() + '.json';
    link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  function importProgress(json) {
    var data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      alert('Не удалось разобрать JSON: ' + e.message);
      return;
    }
    if (!data || typeof data.progress !== 'object' || Array.isArray(data.progress)) {
      alert('В файле нет объекта progress');
      return;
    }

    state.progress = Object.assign({}, state.progress, data.progress);
    state.reviews = Object.assign({}, state.reviews, data.reviews || {});
    state.dailyLog = Object.assign({}, state.dailyLog, data.dailyLog || {});
    if (data.settings && typeof data.settings === 'object') {
      state.settings = Object.assign({}, state.settings, data.settings);
      state.settings.newPerSubject = Object.assign(
        {},
        state.settings.newPerSubject || {},
        (data.settings.newPerSubject && typeof data.settings.newPerSubject === 'object')
          ? data.settings.newPerSubject
          : {}
      );
      state.settings.theme = state.settings.theme === 'dark' ? 'dark' : 'light';
    }
    if (Array.isArray(data.favorites)) state.favorites = data.favorites;

    persist();
    alert('Прогресс импортирован');
    render();
  }

  function downloadSync() {
    var data = payloadNow();
    data.room = sync.room;
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sync-' + (sync.room || 'progress') + '-' + dayKey() + '.json';
    link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  function mergeProgress(local, remote) {
    var result = {};
    var keys = Object.keys(local || {}).concat(Object.keys(remote || {}));
    keys.forEach(function (key) {
      var a = (local || {})[key] || {};
      var b = (remote || {})[key] || {};
      var newer = (Number(b.updatedAt) || 0) > (Number(a.updatedAt) || 0) ? b : a;
      var older = newer === b ? a : b;
      result[key] = {
        phase: newer.phase || older.phase,
        stepIndex: newer.stepIndex || older.stepIndex || 0,
        done: !!(newer.done || older.done),
        seconds: Math.max(Number(newer.seconds) || 0, Number(older.seconds) || 0),
        mistakes: Math.max(Number(newer.mistakes) || 0, Number(older.mistakes) || 0),
        lastDone: newer.lastDone || older.lastDone || '',
        updatedAt: Math.max(Number(newer.updatedAt) || 0, Number(older.updatedAt) || 0)
      };
    });
    return result;
  }

  function importSync(json) {
    var data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      alert('Не удалось разобрать файл: ' + e.message);
      return;
    }
    if (!data || typeof data.progress !== 'object') {
      alert('В файле нет прогресса');
      return;
    }
    if (data.room && !sync.room) {
      sync.room = String(data.room);
      saveSyncConfig();
    }
    state.progress = mergeProgress(state.progress, data.progress);
    state.reviews = Object.assign({}, data.reviews || {}, state.reviews || {});
    state.dailyLog = Object.assign({}, data.dailyLog || {}, state.dailyLog || {});
    if (Array.isArray(data.favorites)) {
      state.favorites = Array.from(new Set(data.favorites.concat(state.favorites || [])));
    }
    persist();
    alert('Прогресс объединён с текущим');
    render();
  }

  function resetProgress() {
    if (!confirm('Сбросить прогресс, повторения и настройки? Уроки останутся.')) return;
    state.progress = {};
    state.reviews = {};
    state.dailyLog = {};
    state.favorites = [];
    state.settings.newPerSubject = {};
    persist();
    render();
  }
})();
