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
  var subjectFilter = '';
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
      Authorization: 'Bearer ' + cfg.key,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
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
        if (!r.ok) return r.text().then(function (t) {
          throw new Error('HTTP ' + r.status + (t ? ' · ' + t.slice(0, 160) : ''));
        });
        return r.json().catch(function () { return []; });
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
      if (!r.ok) return r.text().then(function (t) {
        throw new Error('HTTP ' + r.status + (t ? ' · ' + t.slice(0, 160) : ''));
      });
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

  var TEX_SYMBOLS = {
    lim: 'lim', limsup: 'lim sup', liminf: 'lim inf', sup: 'sup', inf: 'inf',
    max: 'max', min: 'min', to: '→', mapsto: '↦', infty: '∞',
    dots: '…', ldots: '…', cdots: '…',
    varepsilon: 'ε', epsilon: 'ε', delta: 'δ', varphi: 'φ', phi: 'φ',
    cdot: '·', div: '÷', pm: '±', mp: '∓', times: '×',
    le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠',
    equiv: '≡', approx: '≈', propto: '∝', sim: '~',
    in: '∈', notin: '∉', ni: '∋', subseteq: '⊆', subset: '⊂',
    supseteq: '⊇', supset: '⊃', cup: '∪', cap: '∩',
    setminus: '∖', varnothing: '∅', emptyset: '∅',
    forall: '∀', exists: '∃', nexists: '∄',
    Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔', leftrightarrow: '↔',
    iff: '⇔', implies: '⇒', neg: '¬', lnot: '¬',
    land: '∧', lor: '∨', wedge: '∧', vee: '∨',
    oplus: '⊕', otimes: '⊗', odot: '⊙', bigoplus: '⊕',
    bigvee: '⋁', bigwedge: '⋀', uparrow: '↑', downarrow: '↓',
    vdash: '⊢', models: '⊨', preceq: '≼', leadsto: '⇝', top: '⊤', bot: '⊥', sigma: 'σ',
    mid: '|', nmid: '∤', parallel: '∥', perp: '⊥', circ: '∘',
    triangle: '△', angle: '∠', degree: '°',
    det: 'det', tg: 'tg', ctg: 'ctg',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω', alpha: 'α', beta: 'β',
    gamma: 'γ', delta: 'δ', zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι',
    kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', rho: 'ρ', tau: 'τ',
    chi: 'χ', psi: 'ψ', omega: 'ω', varalpha: 'α',
    sum: 'Σ', prod: '∏', int: '∫', partial: '∂', prime: '′',
    pi: 'π', ell: 'ℓ', arg: 'arg',
    log: 'log', ln: 'ln', sin: 'sin', cos: 'cos', tan: 'tan', cot: 'cot',
    sec: 'sec', csc: 'csc', arcsin: 'arcsin', arccos: 'arccos', arctan: 'arctan',
    sinh: 'sinh', cosh: 'cosh', tanh: 'tanh'
  };

  var TEX_NEGATIONS = {
    '=': '≠', '\\in': '∉', '\\equiv': '≢', '\\subset': '⊄', '\\mid': '∤', '\\ni': '∋'
  };

  function texIsLetter(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  function texSkipSpaces(s, i) {
    while (i < s.length && /\s/.test(s.charAt(i))) i++;
    return i;
  }

  function texReadGroup(s, i) {
    i = texSkipSpaces(s, i);
    if (s.charAt(i) !== '{') {
      var token = texReadToken(s, i);
      return { value: token.value, next: token.next };
    }
    var depth = 1;
    var start = i + 1;
    i++;
    while (i < s.length && depth > 0) {
      var ch = s.charAt(i);
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    return { value: s.slice(start, i - 1), next: i };
  }

  function texReadToken(s, i) {
    i = texSkipSpaces(s, i);
    if (i >= s.length) return { value: '', next: i };
    if (s.charAt(i) === '\\') {
      var j = i + 1;
      while (j < s.length && texIsLetter(s.charAt(j))) j++;
      if (j === i + 1) j = Math.min(i + 2, s.length);
      return { value: s.slice(i, j), next: j };
    }
    return { value: s.charAt(i), next: i + 1 };
  }

  function texCommandName(s, i) {
    var j = i;
    while (j < s.length && texIsLetter(s.charAt(j))) j++;
    return { name: s.slice(i, j), next: j };
  }

  function texHtml(s) {
    var out = '';
    var i = 0;
    var BS = String.fromCharCode(92);

    while (i < s.length) {
      var ch = s.charAt(i);

      if (ch === BS) {
        if (s.charAt(i + 1) === BS) {
          out += '<br>';
          i += 2;
          continue;
        }
        var cmd = texCommandName(s, i + 1);
        var name = cmd.name;
        i = cmd.next;

        if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
          var num = texReadGroup(s, i);
          var den = texReadGroup(s, num.next);
          i = den.next;
          out += '<span class="frac"><span class="frac-top">' + texHtml(num.value) +
            '</span><span class="frac-bottom">' + texHtml(den.value) + '</span></span>';
          continue;
        }
        if (name === 'sqrt') {
          i = texSkipSpaces(s, i);
          var degree = '';
          if (s.charAt(i) === '[') {
            var close = s.indexOf(']', i + 1);
            if (close > i) {
              degree = texHtml(s.slice(i + 1, close));
              i = close + 1;
            }
          }
          var rad = texReadGroup(s, i);
          i = rad.next;
          out += degree
            ? '<span class="root"><sup>' + degree + '</sup>√(' + texHtml(rad.value) + ')</span>'
            : '√(' + texHtml(rad.value) + ')';
          continue;
        }
        if (name === 'overline' || name === 'bar') {
          var over = texReadGroup(s, i);
          i = over.next;
          out += '<span class="overline">' + texHtml(over.value) + '</span>';
          continue;
        }
        if (name === 'vec') {
          var vec = texReadGroup(s, i);
          i = vec.next;
          out += ' ' + texHtml(vec.value) + '⃗ ';
          continue;
        }
        if (name === 'binom') {
          var top = texReadGroup(s, i);
          var bottom = texReadGroup(s, top.next);
          i = bottom.next;
          out += '<span class="binom"><span class="binom-delim">(</span><span class="binom-col">' +
            '<span>' + texHtml(top.value) + '</span><span>' + texHtml(bottom.value) + '</span>' +
            '</span><span class="binom-delim">)</span></span>';
          continue;
        }
        if (name === 'text' || name === 'operatorname' || name === 'mathrm' ||
            name === 'mathbf' || name === 'mathit' || name === 'mathcal' || name === 'mathsf' ||
            name === 'mathtt') {
          var txt = texReadGroup(s, i);
          i = txt.next;
          out += texHtml(txt.value);
          continue;
        }
        if (name === 'mathbb') {
          var bb = texReadGroup(s, i);
          i = bb.next;
          var bbMap = { R: 'ℝ', C: 'ℂ', N: 'ℕ', Q: 'ℚ', Z: 'ℤ' };
          out += bbMap[bb.value] || texHtml(bb.value);
          continue;
        }
        if (name === 'pmod') {
          var mod = texReadGroup(s, i);
          i = mod.next;
          out += ' <span class="pmod">(mod ' + texHtml(mod.value) + ')</span>';
          continue;
        }
        if (name === 'bmod') {
          out += ' <span class="pmod">mod</span> ';
          continue;
        }
        if (name === 'not') {
          i = texSkipSpaces(s, i);
          var negToken = texReadToken(s, i);
          i = negToken.next;
          out += TEX_NEGATIONS[negToken.value] ||
            (negToken.value.charAt(0) === BS ? TEX_SYMBOLS[negToken.value.slice(1)] || '' : '') || '¬';
          continue;
        }
        if (name === 'left' || name === 'right' || name === 'limits' || name === '!' ||
            name === ',' || name === ';' || name === ':' || name === ' ') {
          out += (name === ':' || name === ' ' || name === ';' || name === ',') ? ' ' : '';
          continue;
        }
        if (name === 'quad' || name === 'qquad') {
          out += ' ';
          continue;
        }
        if (name === 'circ') {
          out += '∘';
          continue;
        }
        if (name === 'begin' || name === 'end') {
          var grp = texReadGroup(s, i);
          i = grp.next;
          out += grp.value;
          continue;
        }
        if (name === 'lfloor') { out += '⌊'; continue; }
        if (name === 'rfloor') { out += '⌋'; continue; }
        if (name === 'lceil') { out += '⌈'; continue; }
        if (name === 'rceil') { out += '⌉'; continue; }
        if (name === 'stackrel') {
          var stTop = texReadGroup(s, i);
          var stBottom = texReadGroup(s, stTop.next);
          i = stBottom.next;
          out += '<span class="stackrel"><span class="stackrel-top">' + texHtml(stTop.value) +
            '</span><span class="stackrel-bottom">' + texHtml(stBottom.value) + '</span></span>';
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(TEX_SYMBOLS, name)) {
          out += TEX_SYMBOLS[name];
          continue;
        }
        out += esc(name);
        continue;
      }

      if (ch === '{') {
        var brace = texReadGroup(s, i);
        out += texHtml(brace.value);
        i = brace.next;
        continue;
      }
      if (ch === '}') {
        i++;
        continue;
      }
      if (ch === '_' || ch === '^') {
        var script = texReadGroup(s, i + 1);
        i = script.next;
        var inner = texHtml(script.value);
        if (ch === '^' && (script.value === '\\circ' || inner === '∘')) {
          out += '°';
        } else {
          out += (ch === '_' ? '<sub>' : '<sup>') + inner + (ch === '_' ? '</sub>' : '</sup>');
        }
        continue;
      }
      if (ch === '~') {
        out += ' ';
        i++;
        continue;
      }
      if (ch === '&') {
        out += ' ';
        i++;
        continue;
      }
      out += esc(ch);
      i++;
    }
    return out;
  }

  function mathHtml(tex) {
    var raw = String(tex == null ? '' : tex);
    var envs = [];
    raw = raw.replace(/\\begin\{(pmatrix|bmatrix|vmatrix|matrix|cases)\}([\s\S]*?)\\end\{\1\}/g, function (m, env, body) {
      envs.push({ env: env, body: body });
      return '@@MATHENV' + (envs.length - 1) + '@@';
    });

    var html = texHtml(raw);
    html = html.replace(/@@MATHENV(\d+)@@/g, function (m, index) {
      var item = envs[Number(index)];
      if (!item) return '';
      var rows = item.body.split(String.fromCharCode(92) + String.fromCharCode(92)).map(function (row) {
        return row.trim();
      }).filter(function (row) { return row !== ''; });
      var bodyRows = rows.map(function (row) {
        var cells = row.split('&');
        return '<tr>' + cells.map(function (cell) {
          return '<td>' + mathHtml(cell.trim()) + '</td>';
        }).join('') + '</tr>';
      }).join('');
      var delims = {
        pmatrix: ['(', ')'], bmatrix: ['[', ']'], vmatrix: ['|', '|'],
        matrix: ['', ''], cases: ['{', '']
      };
      var pair = delims[item.env] || ['', ''];
      return '<span class="math-matrix ' + item.env + '">' +
        '<span class="matrix-delim">' + pair[0] + '</span>' +
        '<table class="matrix-table"><tbody>' + bodyRows + '</tbody></table>' +
        '<span class="matrix-delim">' + pair[1] + '</span></span>';
    });
    return html;
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
      lock: '<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
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

  var SUBJECT_TONES = null;

  function subjectTone(subject) {
    if (!SUBJECT_TONES) {
      SUBJECT_TONES = {};
      SUBJECT_TONES['Математический анализ'] = 0;
      SUBJECT_TONES['Аналитическая геометрия'] = 1;
      SUBJECT_TONES['Дискретная математика'] = 2;
      SUBJECT_TONES['Линейная алгебра'] = 3;
      SUBJECT_TONES['Теория вероятностей'] = 4;
      SUBJECT_TONES['Алгоритмы и структуры данных'] = 5;
      SUBJECT_TONES['Программирование'] = 6;
    }
    var label = String(subject == null ? '' : subject);
    return typeof SUBJECT_TONES[label] === 'number' ? SUBJECT_TONES[label] : -1;
  }

  function toneFor(value) {
    var text = String(value || '');
    var known = subjectTone(text);
    if (known >= 0) return known;
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash % 5;
  }

  function subjectList() {
    var list = [];
    state.lessons.forEach(function (l) {
      var subject = l.subject || 'Без предмета';
      if (list.indexOf(subject) < 0) list.push(subject);
    });
    return list.sort(function (a, b) {
      return toneFor(a) - toneFor(b) || a.localeCompare(b);
    });
  }

  function subjectStats(subject) {
    var list = state.lessons.filter(function (l) {
      return (l.subject || 'Без предмета') === subject;
    });
    var done = list.filter(function (l) {
      return state.progress[l.id] && state.progress[l.id].done;
    }).length;
    return {
      total: list.length,
      done: done,
      percent: list.length ? Math.round(done / list.length * 100) : 0
    };
  }

  function lessonsOf(subject) {
    return state.lessons.filter(function (l) {
      return (l.subject || 'Без предмета') === subject;
    }).sort(function (a, b) {
      return (Number(a.order) || 0) - (Number(b.order) || 0) ||
        String(a.title || '').localeCompare(String(b.title || ''));
    });
  }

  function subjectTabsHtml(active, action) {
    var subjects = subjectList();
    if (!subjects.length) return '';
    return '<div class="subject-tabs">' + subjects.map(function (subject) {
      var stats = subjectStats(subject);
      return '<button type="button" class="subject-tab tone-' + toneFor(subject) +
        (subject === active ? ' active' : '') + '" data-action="' + action +
        '" data-subject="' + esc(subject) + '">' +
        '<span class="tab-dot"></span>' +
        '<span class="tab-name">' + esc(subject) + '</span>' +
        '<span class="tab-count">' + stats.done + '/' + stats.total + '</span>' +
        '</button>';
    }).join('') + '</div>';
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
      '<div class="rail-brand">' +
      '<button type="button" class="brand-mark" data-action="nav" data-screen="today" title="Сегодня">' +
      icon('spark') + '</button>' +
      '<div class="brand-copy"><strong>studia.</strong><span>учебный дневник</span></div>' +
      '</div>' +
      '<div class="rail-label">Меню</div>' +
      '<nav class="rail-nav">' + nav + '</nav>' +
      '<div class="rail-tip"><strong>Один урок — уже прогресс</strong><span>без спешки и давления</span></div>' +
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
        '<button type="button" class="btn ghost sm" data-action="close">' + icon('arrow') + 'К урокам</button>' +
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
      '<span class="user-chip"><span class="user-avatar">С</span>' +
      '<span class="user-meta"><strong>Студент</strong><small>1 курс</small></span></span>' +
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

  function boardCardHtml(l, isReview) {
    if (!l) return '';
    var reason = taskReason(l, isReview);
    var p = state.progress[l.id];
    var meta = [];
    if (l.topic) meta.push(l.topic);
    if (l.est_minutes) meta.push(l.est_minutes + ' мин');
    return '<button type="button" class="board-card" data-action="open" data-id="' + esc(l.id) +
      '" data-review="' + (isReview ? '1' : '0') + '">' +
      '<span class="board-card-top">' +
      '<span class="badge ' + reason.cls + '">' + reason.label + '</span>' +
      (p && p.mistakes ? '<span class="board-mistakes">ошибок ' + p.mistakes + '</span>' : '') +
      '</span>' +
      '<span class="board-card-title">' + esc(l.title || 'Без названия') + '</span>' +
      '<span class="board-card-meta">' + esc(meta.join(' · ')) + '</span>' +
      '<span class="board-card-cta">' + reason.cta + '<span class="lesson-arrow">' + icon('chev') + '</span></span>' +
      '</button>';
  }

  function boardColumnHtml(subject, items, due) {
    var stats = subjectStats(subject);
    var reviews = items.filter(function (l) { return due.indexOf(l) >= 0; });
    var cards = items.slice(0, 4).map(function (l) {
      return boardCardHtml(l, due.indexOf(l) >= 0);
    }).join('');

    return '<section class="board-col tone-' + toneFor(subject) + '">' +
      '<header class="board-col-head">' +
      '<span class="board-col-dot"></span>' +
      '<h2>' + esc(subject) + '</h2>' +
      (reviews.length ? '<span class="board-col-badge">' + reviews.length + ' повтор.</span>' : '') +
      '</header>' +
      '<div class="board-col-progress">' +
      '<span class="board-col-line"><span style="width:' + stats.percent + '%"></span></span>' +
      '<span class="board-col-pct">' + stats.done + '/' + stats.total + '</span>' +
      '</div>' +
      '<div class="board-col-list">' +
      (cards || '<p class="board-col-empty">Пока всё сделано по этому предмету.</p>') +
      '</div>' +
      '<button type="button" class="board-col-link" data-action="open-subject" data-subject="' +
      esc(subject) + '">Все уроки' + icon('chev') + '</button>' +
      '</section>';
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
      limit = Math.max(0, limit);
      if (!limit) return;

      var doneTopics = {};
      state.lessons.forEach(function (l) {
        if ((l.subject || 'Без предмета') !== subject) return;
        var p = state.progress[l.id];
        if (p && p.firstDone === today) {
          doneTopics[l.topic || l.title || l.id] = true;
        }
      });
      var left = Math.max(0, limit - Object.keys(doneTopics).length);
      left = Math.min(1, left);
      if (!left) return;

      var seenTopics = {};
      groups[subject].slice().sort(function (a, b) {
        return (Number(a.order) || 0) - (Number(b.order) || 0) ||
          String(a.title || '').localeCompare(String(b.title || ''));
      }).forEach(function (l) {
        if (left <= 0) return;
        var topic = l.topic || l.title || l.id;
        if (seenTopics[topic]) return;
        seenTopics[topic] = true;
        fresh.push(l);
        left--;
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

    var subtitle;
    var content;

    var bySubject = {};
    shown.forEach(function (l) {
      var subject = l.subject || 'Без предмета';
      (bySubject[subject] = bySubject[subject] || []).push(l);
    });

    var columns = subjectList().map(function (subject) {
      var items = (bySubject[subject] || []).slice().sort(function (a, b) {
        var ra = due.indexOf(a) >= 0 ? 0 : 1;
        var rb = due.indexOf(b) >= 0 ? 0 : 1;
        return ra - rb || (Number(a.order) || 0) - (Number(b.order) || 0);
      });
      return '<div class="board-col-wrap"' + (items.length ? '' : ' data-empty="1"') + '>' +
        boardColumnHtml(subject, items, due) + '</div>';
    }).join('');

    if (!state.lessons.length) {
      subtitle = 'В папке lessons пока нет уроков.';
      content = emptyStateHtml('book', 'Добавим первый урок',
        'Уроки лежат в папке <code class="inline-code">lessons</code>. Создайте файл урока и подключите его в <code class="inline-code">index.html</code> — или просто попросите меня.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Как добавить</button>');
    } else {
      subtitle = shown.length
        ? 'Сегодня ' + shown.length + ' ' + plural(shown.length, 'задача', 'задачи', 'задач') +
          ' на ' + totalMinutes + ' мин. Выберите предмет в колонке и начинайте.'
        : 'Готово по всем предметам. Можно перечитать теорию в библиотеке.';

      var footerParts = [];
      footerParts.push('выполнено ' + doneToday + ' ' + plural(doneToday, 'урок', 'урока', 'уроков'));
      if (todayMinutes) footerParts.push(todayMinutes + ' мин');
      var footer = (doneToday || todayMinutes)
        ? '<div class="day-footer">' + icon('check') + '<span>Сегодня: ' + footerParts.join(' · ') + '</span></div>'
        : '';

      content = '<div class="board">' + columns + '</div>' + footer;
    }

    return '<div class="today-page">' +
      '<section class="today-hero">' +
      '<div class="today-hero-copy">' +
      '<div class="eyebrow">План на сегодня</div>' +
      '<h1>' + hello + '</h1>' +
      '<p>' + subtitle + '</p>' +
      '</div>' +
      '<div class="today-hero-stats">' +
      '<div class="hero-stat"><strong>' + shown.length + '</strong><span>задач</span></div>' +
      '<div class="hero-stat"><strong>' + totalMinutes + '</strong><span>минут</span></div>' +
      '<div class="hero-stat"><strong>' + doneToday + '</strong><span>сделано</span></div>' +
      '</div>' +
      '</section>' +
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
    var list = lessonsOf(subject);
    var stats = subjectStats(subject);
    var tone = toneFor(subject);
    var next = list.filter(function (l) {
      return !(state.progress[l.id] && state.progress[l.id].done);
    })[0];

    return '<button type="button" class="card subject-card tone-' + tone +
      '" data-action="open-subject" data-subject="' + esc(subject) + '">' +
      '<div class="subject-head">' +
      '<span class="subject-icon">' + esc(initialOf(subject)) + '</span>' +
      '<div class="grow"><h2>' + esc(subject) + '</h2>' +
      '<span class="muted small">' + stats.done + ' из ' + stats.total + ' пройдено</span></div>' +
      '<span class="subject-pct">' + stats.percent + '%</span>' +
      '</div>' +
      '<div class="progress"><span style="width:' + stats.percent + '%"></span></div>' +
      (next
        ? '<div class="subject-next"><span class="eyebrow">Дальше</span>' +
          '<span class="subject-next-title">' + esc(next.title || '') + '</span></div>'
        : '<div class="subject-next done">' + icon('check') + '<span>Все уроки пройдены</span></div>') +
      '<span class="subject-cta">Открыть предмет' + icon('chev') + '</span>' +
      '</button>';
  }

  function subjectDetailHtml(subject) {
    var list = lessonsOf(subject);
    var stats = subjectStats(subject);
    var topics = [];
    list.forEach(function (l) {
      var topic = l.topic || 'Без темы';
      if (topics.indexOf(topic) < 0) topics.push(topic);
    });

    var groupsHtml = topics.map(function (topic) {
      var inTopic = list.filter(function (l) { return (l.topic || 'Без темы') === topic; });
      var doneInTopic = inTopic.filter(function (l) {
        return state.progress[l.id] && state.progress[l.id].done;
      }).length;
      return '<section class="topic-group">' +
        '<div class="topic-head"><h3>' + esc(topic) + '</h3>' +
        '<span class="topic-count">' + doneInTopic + '/' + inTopic.length + '</span></div>' +
        '<div class="lesson-list">' + inTopic.map(function (l) {
          var review = state.reviews[l.id];
          var isReview = !!(review && review.due && review.due <= dayKey());
          return lessonCardHtml(l, isReview, false);
        }).join('') + '</div></section>';
    }).join('');

    return pageHead('Предмет', esc(subject),
      stats.done + ' из ' + stats.total + ' уроков пройдено · ' + topics.length + ' ' +
      plural(topics.length, 'тема', 'темы', 'тем'),
      '<span class="subject-pct big tone-' + toneFor(subject) + '">' + stats.percent + '%</span>') +
      '<div class="subject-detail tone-' + toneFor(subject) + '">' +
      '<div class="progress"><span style="width:' + stats.percent + '%"></span></div>' +
      groupsHtml +
      '</div>';
  }

  function subjectsHtml() {
    var subjects = subjectList();

    var subtitle = subjects.length
      ? subjects.length + ' ' + plural(subjects.length, 'предмет', 'предмета', 'предметов') +
        ' · ' + state.lessons.length + ' ' + plural(state.lessons.length, 'урок', 'урока', 'уроков')
      : 'Пока пусто — добавьте первый урок.';

    if (subjectFilter && subjects.indexOf(subjectFilter) >= 0) {
      return '<div class="tabs-wrap">' + subjectTabsHtml(subjectFilter, 'open-subject') + '</div>' +
        subjectDetailHtml(subjectFilter);
    }

    var content = subjects.length
      ? '<div class="subject-grid">' + subjects.map(subjectCardHtml).join('') + '</div>'
      : emptyStateHtml('grid', 'Предметов пока нет',
        'Уроки автоматически разложатся по предметам, когда появятся в папке lessons.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Настройки</button>');

    return pageHead('Библиотека знаний', 'Предметы', subtitle) +
      (subjects.length ? subjectTabsHtml('', 'open-subject') : '') + content;
  }

  function theoryLessons() {
    return state.lessons.filter(function (l) {
      return state.progress[l.id] && state.progress[l.id].done;
    });
  }

  function libraryHtml() {
    var learned = theoryLessons();
    var subjects = subjectList().filter(function (subject) {
      return learned.some(function (l) { return (l.subject || 'Без предмета') === subject; });
    });
    var active = subjects.indexOf(subjectFilter) >= 0 ? subjectFilter : '';

    return pageHead('Все материалы', 'Библиотека',
      learned.length
        ? 'Теория пройденных уроков: ' + learned.length + ' из ' + state.lessons.length + '. Новые темы появятся здесь после того, как вы их пройдёте.'
        : 'Здесь появится теория уроков, которые вы уже прошли.') +
      '<div class="library-toolbar card">' +
      '<label class="search-box">' + icon('search') +
      '<input data-action="library-search" value="' + esc(libraryQuery) +
      '" placeholder="Поиск по пройденной теории" autocomplete="off"></label>' +
      '<span class="muted small">' + learned.length + ' ' +
      plural(learned.length, 'конспект', 'конспекта', 'конспектов') + '</span>' +
      '</div>' +
      (subjects.length ? subjectTabsHtml(active, 'library-subject') : '') +
      '<div id="library-results" class="library-list">' + libraryResultsHtml(active) + '</div>';
  }

  function libraryResultsHtml(active) {
    var query = libraryQuery.trim().toLowerCase();
    var learned = theoryLessons();

    if (!state.lessons.length) {
      return emptyStateHtml('book', 'Библиотека пуста',
        'Добавьте файлы уроков в папку lessons — теория появится здесь после прохождения.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="settings">' +
        icon('folder') + 'Настройки</button>');
    }

    if (!learned.length) {
      return emptyStateHtml('lock', 'Пока пусто',
        'Библиотека собирает теорию пройденных уроков. Пройдите первый урок — и его конспект появится здесь.',
        '<button type="button" class="btn primary" data-action="nav" data-screen="today">' +
        icon('play') + 'К плану на сегодня</button>');
    }

    var list = learned.filter(function (l) {
      if (active && (l.subject || 'Без предмета') !== active) return false;
      if (!query) return true;
      return (String(l.title || '') + ' ' + flattenTheory(l)).toLowerCase().indexOf(query) >= 0;
    }).sort(function (a, b) {
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });

    if (!list.length) {
      return emptyStateHtml('search', 'Ничего не найдено',
        'Попробуйте другой запрос или выберите другой предмет.', '');
    }

    return list.map(function (l) {
      var theory = (l.theory || []).map(function (card) {
        return '<section class="theory-section">' +
          '<h3>' + esc(card.title || '') + '</h3>' +
          '<div class="theory-blocks">' +
          (card.blocks || []).map(blockHtml).join('') +
          '</div></section>';
      }).join('');
      var p = state.progress[l.id] || {};

      return '<article class="card library-card tone-' + toneFor(l.subject || l.title) + '">' +
        '<header class="library-head">' +
        '<span class="subject-icon small">' + esc(initialOf(l.subject || l.title)) + '</span>' +
        '<div class="grow">' +
        '<div class="eyebrow">' + esc(l.subject || 'Без предмета') +
        (l.topic ? ' · ' + esc(l.topic) : '') + '</div>' +
        '<h2>' + esc(l.title || 'Без названия') + '</h2>' +
        '</div>' +
        (p.lastDone
          ? '<span class="lesson-time done-time">' + icon('check') + 'пройден</span>'
          : '') +
        '<button type="button" class="btn ghost sm" data-action="open" data-id="' + esc(l.id) +
        '" data-review="0">Открыть</button>' +
        '</header>' +
        '<details class="library-body" open>' +
        '<summary class="library-summary">Теория<span class="data-hint">свернуть</span></summary>' +
        (theory || '<p class="muted">Теория для этого урока не добавлена.</p>') +
        '</details></article>';
    }).join('');
  }

  function settingsHtml() {
    var installed = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
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
      '<p class="muted small">Сколько новых тем показывать на экране «Сегодня» для каждого предмета. После выполнения этого числа новые темы на сегодня не добавляются.</p>' +
      perSubject +
      '</section>' +

      '<section class="card settings-card wide install-card">' +
      '<div class="card-head"><div><div class="eyebrow">Приложение</div>' +
      '<h2>На телефон</h2></div><span class="count-pill">PWA</span></div>' +
      '<p class="muted small">Добавьте studia на главный экран — приложение откроется без адресной строки ' +
      'и будет работать офлайн. Прогресс сохранится в браузере.</p>' +
      '<div class="install-row">' +
      (installed
        ? '<span class="install-done">' + icon('check') + 'Уже открыто как приложение</span>'
        : '<button type="button" class="btn primary" data-action="install-app">' +
          icon('download') + 'Установить приложение</button>') +
      '<span class="muted small">iPhone: «Поделиться» → «На экран Домой»</span>' +
      '</div>' +
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
    if (type === 'method') {
      return '<div class="block method"><div class="label">' + icon('target') + 'Как решать</div>' +
        '<div class="prose">' + md(block.content) + '</div></div>';
    }
    if (type === 'code') {
      return '<div class="block code-block"><div class="label">' + icon('code') + 'Код</div>' +
        '<pre><code>' + esc(block.content) + '</code></pre></div>';
    }
    if (type === 'figure') {
      return '<figure class="block figure-block">' +
        '<div class="figure-canvas">' + (block.svg || '') + '</div>' +
        (block.caption ? '<figcaption>' + md(block.caption) + '</figcaption>' : '') +
        '</figure>';
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
        '</div>' +
        '<button type="button" class="btn ghost rating-skip" data-action="skip-review">' +
        'Повторять не нужно</button></div>';
    } else if (lesson.rating === 'skip') {
      action = '<div class="card completion-card">' +
        '<div class="completion-icon">' + icon('check') + '</div>' +
        '<div class="grow"><strong>Повторение отключено</strong>' +
        '<p class="muted small">Этот урок больше не будет появляться в повторении.</p></div>' +
        '<button type="button" class="btn primary" data-action="close">К урокам' + icon('arrow') + '</button>' +
        '</div>';
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
      firstDone: previous.firstDone || '',
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

    var previous = state.progress[openId] || {};
    var wasDone = !!previous.done;

    lesson.done = true;
    lesson.finished = true;
    lesson.phase = 'summary';
    lesson.stepIndex = 0;
    saveLessonProgress();

    var today = dayKey();
    var minutes = Math.max(1, Math.round(lesson.seconds / 60));
    state.progress[openId].lastDone = today;
    if (!reviewMode && !wasDone && !state.progress[openId].firstDone) {
      state.progress[openId].firstDone = today;
    }
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

  function skipReview() {
    if (!openId) return;
    state.reviews[openId] = { due: null, interval: 0, skip: true };
    lesson.rating = 'skip';
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
      if (screen === 'subjects' || screen === 'library') subjectFilter = '';
      render();
      window.scrollTo(0, 0);
    } else if (action === 'open-subject') {
      subjectFilter = target.getAttribute('data-subject') || '';
      screen = 'subjects';
      render();
      window.scrollTo(0, 0);
    } else if (action === 'library-subject') {
      var picked = target.getAttribute('data-subject') || '';
      subjectFilter = subjectFilter === picked ? '' : picked;
      render();
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
    } else if (action === 'skip-review') {
      skipReview();
    } else if (action === 'theme') {
      state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
      persist();
      render();
    } else if (action === 'install-app') {
      if (window.__pwaInstallPrompt) {
        window.__pwaInstallPrompt.prompt();
        window.__pwaInstallPrompt.userChoice.then(function () {
          window.__pwaInstallPrompt = null;
          render();
        });
      } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        alert('На iPhone: нажмите «Поделиться» в Safari и выберите «На экран Домой».');
      } else {
        alert('Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».');
      }
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
      var learned = theoryLessons();
      var active = subjectList().indexOf(subjectFilter) >= 0 ? subjectFilter : '';
      var box = document.getElementById('library-results');
      if (box) box.innerHTML = libraryResultsHtml(active);
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
        firstDone: newer.firstDone || older.firstDone || '',
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
