// Урок: Векторное произведение и площадь. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-vector-01",
  "subject": "Аналитическая геометрия",
  "topic": "Векторное произведение",
  "order": 6,
  "title": "Векторное произведение и площадь",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "$\\vec{a} = (1, 0, 0)$, $\\vec{b} = (0, 1, 0)$. Чему равно $\\vec{a} \\times \\vec{b}$?",
    "options": [
      "$(0, 0, 1)$",
      "$(1, 1, 0)$",
      "$(0, 0, 0)$"
    ],
    "correct": 0,
    "explanation": "По формуле: $(0\\cdot0 - 0\\cdot1,\\ 0\\cdot0 - 1\\cdot0,\\ 1\\cdot1 - 0\\cdot0) = (0,0,1)$.",
    "reveal": "Векторное произведение возвращает вектор, перпендикулярный обоим. Его длина — площадь параллелограмма."
  },
  "theory": [
    {
      "title": "Формула через координаты",
      "blocks": [
        {
          "type": "formula",
          "content": "\\vec{a}\\times\\vec{b} = (y_1z_2 - z_1y_2,\\ z_1x_2 - x_1z_2,\\ x_1y_2 - y_1x_2)"
        },
        {
          "type": "example",
          "problem": "$\\vec{a} = (2, 1, 0)$, $\\vec{b} = (0, 3, 1)$. Найдите $\\vec{a}\\times\\vec{b}$.",
          "solution": "$(1\\cdot1 - 0\\cdot3,\\ 0\\cdot0 - 2\\cdot1,\\ 2\\cdot3 - 1\\cdot0) = (1, -2, 6)$."
        },
        {
          "type": "remember",
          "content": "Формулу удобно помнить как разложение определителя по первой строке с векторами $\\vec{i}, \\vec{j}, \\vec{k}$."
        }
      ]
    },
    {
      "title": "Смысл и свойства",
      "blocks": [
        {
          "type": "formula",
          "content": "|\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\varphi"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 180'><defs><marker id='v1' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='currentColor'/></marker></defs><polygon class='fg-fill' points='60,140 200,140 240,80 100,80'/><line class='fg-line' x1='60' y1='140' x2='200' y2='140' marker-end='url(#v1)'/><line class='fg-line' x1='60' y1='140' x2='100' y2='80' marker-end='url(#v1)'/><line class='fg-curve-2' x1='120' y1='110' x2='120' y2='30' marker-end='url(#v1)'/><text class='fg-label' x='130' y='155'>a</text><text class='fg-label' x='70' y='110'>b</text><text class='fg-label' x='128' y='50'>a×b</text><text class='fg-note' x='150' y='128'>S = |a×b|</text></svg>",
          "caption": "Векторное произведение перпендикулярно плоскости векторов, длина — площадь."
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
              "Антисимметрия",
              "$\\vec{a}\\times\\vec{b} = -\\vec{b}\\times\\vec{a}$"
            ],
            [
              "Коллинеарность",
              "$\\vec{a}\\times\\vec{b} = \\vec{0}$"
            ],
            [
              "Площадь треугольника",
              "$S = \\frac12|\\vec{a}\\times\\vec{b}|$"
            ],
            [
              "Модуль",
              "$|\\vec{a}\\times\\vec{a}| = 0$"
            ]
          ]
        },
        {
          "type": "warning",
          "content": "Векторное произведение не коммутативно: при перестановке меняется знак. Это самая частая ошибка."
        }
      ]
    },
    {
      "title": "Коллинеарность и применение",
      "blocks": [
        {
          "type": "text",
          "content": "Два вектора коллинеарны тогда и только тогда, когда их векторное произведение равно нулю."
        },
        {
          "type": "example",
          "problem": "Найдите площадь треугольника с вершинами $A(0,0,0)$, $B(2,0,0)$, $C(0,3,0)$.",
          "solution": "$\\vec{AB} = (2,0,0)$, $\\vec{AC} = (0,3,0)$, произведение $(0,0,6)$, длина $6$. Площадь треугольника — $3$."
        },
        {
          "type": "remember",
          "content": "Векторное произведение даёт также нормаль к плоскости: $\\vec{n} = \\vec{AB} \\times \\vec{AC}$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$|\\vec{a}| = 2$, $|\\vec{b}| = 5$, угол $30^\\circ$. Найдите $|\\vec{a}\\times\\vec{b}|$.",
      "answer": "5",
      "tolerance": 0.02,
      "hint": "$\\sin 30^\\circ = 0{,}5$.",
      "explanation": "$2 \\cdot 5 \\cdot 0{,}5 = 5$."
    },
    {
      "type": "single_choice",
      "question": "$\\vec{a}\\times\\vec{b} = \\vec{0}$ означает:",
      "options": [
        "векторы коллинеарны",
        "векторы перпендикулярны",
        "один вектор единичный"
      ],
      "correct": 0,
      "hint": "$\\sin\\varphi = 0$.",
      "explanation": "Коллинеарность."
    },
    {
      "type": "single_choice",
      "question": "$\\vec{a}=(1,0,0)$, $\\vec{b}=(0,0,1)$. Куда направлено $\\vec{a}\\times\\vec{b}$?",
      "options": [
        "по $Oy$ с минусом",
        "по $Oy$ с плюсом",
        "по $Oz$"
      ],
      "correct": 0,
      "hint": "Считайте по формуле.",
      "explanation": "$(0\\cdot1 - 0\\cdot0,\\ 0\\cdot0 - 1\\cdot1,\\ 0) = (0,-1,0)$."
    },
    {
      "type": "numeric",
      "question": "Площадь параллелограмма на векторах $(1,0,0)$ и $(0,2,0)$ равна…",
      "answer": "2",
      "tolerance": 0.01,
      "hint": "Прямоугольник $1 \\times 2$.",
      "explanation": "$2$."
    },
    {
      "type": "true_false",
      "question": "$\\vec{a}\\times\\vec{b} = \\vec{b}\\times\\vec{a}$.",
      "correct": false,
      "hint": "Антисимметрия.",
      "explanation": "Неверно: меняется знак."
    },
    {
      "type": "numeric",
      "question": "Площадь треугольника на векторах $(2,0,0)$ и $(0,2,0)$.",
      "answer": "2",
      "tolerance": 0.01,
      "hint": "Половина площади параллелограмма.",
      "explanation": "$4/2 = 2$."
    }
  ],
  "review_cards": [
    {
      "q": "Формула векторного произведения",
      "a": "$(y_1z_2-z_1y_2,\\ z_1x_2-x_1z_2,\\ x_1y_2-y_1x_2)$"
    },
    {
      "q": "Длина векторного произведения",
      "a": "$|\\vec{a}||\\vec{b}|\\sin\\varphi$ — площадь параллелограмма."
    },
    {
      "q": "Условие коллинеарности",
      "a": "$\\vec{a}\\times\\vec{b} = \\vec{0}$"
    },
    {
      "q": "Площадь треугольника",
      "a": "$\\frac12|\\vec{a}\\times\\vec{b}|$"
    }
  ],
  "summary": [
    "Векторное произведение — вектор-нормаль.",
    "Его длина — площадь параллелограмма.",
    "Ноль — признак коллинеарности."
  ]
});
