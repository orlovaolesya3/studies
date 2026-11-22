// Урок: Векторы: линейные операции и свойства. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-vec-01",
  "subject": "Аналитическая геометрия",
  "topic": "Векторы",
  "order": 2,
  "title": "Векторы: линейные операции и свойства",
  "est_minutes": 7,
  "hook": {
    "type": "single_choice",
    "question": "Вектор $\\vec{a} = (3, -1)$, $\\vec{b} = (1, 4)$. Найдите $2\\vec{a} - \\vec{b}$.",
    "options": [
      "$(5, -6)$",
      "$(7, -6)$",
      "$(5, 6)$"
    ],
    "correct": 0,
    "explanation": "$2(3, -1) = (6, -2)$, вычитаем $(1, 4)$: $(5, -6)$.",
    "reveal": "Сложение и умножение на число — две операции, из которых строится вся линейная алгебра."
  },
  "theory": [
    {
      "title": "Что такое вектор",
      "blocks": [
        {
          "type": "text",
          "content": "Вектор — направленный отрезок. Он равен другому вектору, если они сонаправлены и одинаковой длины: точка приложения неважна."
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 160'><defs><marker id='ar' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='currentColor'/></marker></defs><line class='fg-line' x1='30' y1='120' x2='140' y2='50' marker-end='url(#ar)'/><line class='fg-line' x1='160' y1='130' x2='270' y2='60' marker-end='url(#ar)'/><text class='fg-label' x='75' y='80'>a</text><text class='fg-label' x='205' y='90'>a</text><text class='fg-note' x='40' y='150'>равные векторы</text></svg>",
          "caption": "Один и тот же вектор в разных точках — это один и тот же вектор."
        },
        {
          "type": "formula",
          "content": "\\vec{a} = (x, y, z), \\quad |\\vec{a}| = \\sqrt{x^2 + y^2 + z^2}"
        }
      ]
    },
    {
      "title": "Сложение и умножение на число",
      "blocks": [
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 170'><defs><marker id='ar2' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='currentColor'/></marker></defs><line class='fg-line' x1='30' y1='140' x2='150' y2='140' marker-end='url(#ar2)'/><line class='fg-line' x1='150' y1='140' x2='210' y2='60' marker-end='url(#ar2)'/><line class='fg-dash' x1='30' y1='140' x2='90' y2='60'/><line class='fg-line' x1='30' y1='140' x2='210' y2='60' marker-end='url(#ar2)'/><text class='fg-label' x='85' y='155'>a</text><text class='fg-label' x='185' y='110'>b</text><text class='fg-label' x='105' y='85'>a+b</text></svg>",
          "caption": "Правило треугольника: конец a, затем b, вместе — сумма."
        },
        {
          "type": "table",
          "title": "Свойства",
          "headers": [
            "Свойство",
            "Запись"
          ],
          "rows": [
            [
              "Переместительность",
              "$\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}$"
            ],
            [
              "Сочетательность",
              "$(\\vec{a} + \\vec{b}) + \\vec{c} = \\vec{a} + (\\vec{b} + \\vec{c})$"
            ],
            [
              "Нулевой вектор",
              "$\\vec{a} + \\vec{0} = \\vec{a}$"
            ],
            [
              "Противоположный",
              "$\\vec{a} + (-\\vec{a}) = \\vec{0}$"
            ],
            [
              "Дистрибутивность",
              "$\\alpha(\\vec{a} + \\vec{b}) = \\alpha\\vec{a} + \\alpha\\vec{b}$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$\\vec{a} = (1, 2)$, $\\vec{b} = (-3, 1)$. Найдите $\\vec{a} + \\vec{b}$ и $3\\vec{a}$.",
          "solution": "$\\vec{a} + \\vec{b} = (-2, 3)$, $3\\vec{a} = (3, 6)$."
        }
      ]
    },
    {
      "title": "Коллинеарность",
      "blocks": [
        {
          "type": "text",
          "content": "Векторы коллинеарны, если лежат на параллельных прямых. Один получается из другого умножением на число."
        },
        {
          "type": "formula",
          "content": "\\vec{a} \\parallel \\vec{b} \\iff \\vec{a} = \\lambda \\vec{b}"
        },
        {
          "type": "warning",
          "content": "В координатах: отношения координат равны $\\frac{x_1}{x_2} = \\frac{y_1}{y_2} = \\frac{z_1}{z_2}$ — но так писать можно только при ненулевых координатах. Надёжнее проверять пропорциональность через определитель."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "$\\vec{a} = (2, 3)$, $\\vec{b} = (1, -1)$. Найдите $\\vec{a} - 2\\vec{b}$.",
      "options": [
        "$(0, 5)$",
        "$(0, 1)$",
        "$(4, 1)$"
      ],
      "correct": 0,
      "hint": "$2\\vec{b} = (2, -2)$.",
      "explanation": "$(2 - 2,\\ 3 + 2) = (0, 5)$."
    },
    {
      "type": "numeric",
      "question": "Длина вектора $(3, 4)$ равна…",
      "answer": "5",
      "tolerance": 0.01,
      "hint": "Пифагор.",
      "explanation": "$\\sqrt{9 + 16} = 5$."
    },
    {
      "type": "single_choice",
      "question": "Векторы $(2, 4)$ и $(1, 2)$:",
      "options": [
        "коллинеарны",
        "не коллинеарны",
        "перпендикулярны"
      ],
      "correct": 0,
      "hint": "Второй — половина первого.",
      "explanation": "$(2,4) = 2(1,2)$."
    },
    {
      "type": "numeric",
      "question": "При каком $\\lambda$ векторы $(2, \\lambda)$ и $(4, 10)$ коллинеарны?",
      "answer": "5",
      "tolerance": 0.01,
      "hint": "$\\frac{2}{4} = \\frac{\\lambda}{10}$.",
      "explanation": "$\\lambda = 5$."
    },
    {
      "type": "true_false",
      "question": "Сумма векторов зависит от порядка слагаемых.",
      "correct": false,
      "hint": "Свойство переместительности.",
      "explanation": "Не зависит: сложение коммутативно."
    },
    {
      "type": "input",
      "question": "Как называется вектор длины 1? (одно слово)",
      "answer": [
        "единичный",
        "нормированный",
        "ортом"
      ],
      "hint": "Длина равна единице.",
      "explanation": "Единичный (нормированный) вектор."
    }
  ],
  "review_cards": [
    {
      "q": "Когда векторы равны",
      "a": "Сонаправлены и равны по длине."
    },
    {
      "q": "Критерий коллинеарности",
      "a": "$\\vec{a} = \\lambda \\vec{b}$"
    },
    {
      "q": "Длина вектора",
      "a": "$\\sqrt{x^2+y^2+z^2}$"
    },
    {
      "q": "Правило треугольника",
      "a": "Конец первого — начало второго."
    }
  ],
  "summary": [
    "Вектор задаётся координатами, точка приложения неважна.",
    "Линейные операции покоординатны.",
    "Коллинеарность — пропорциональность координат."
  ]
});
