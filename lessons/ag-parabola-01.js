// Урок: Парабола: определение, свойства, форма. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-parabola-01",
  "subject": "Аналитическая геометрия",
  "topic": "Кривые второго порядка",
  "order": 16,
  "title": "Парабола: определение, свойства, форма",
  "est_minutes": 8,
  "hook": {
    "type": "single_choice",
    "question": "Парабола $y^2 = 8x$. Чему равен параметр $p$?",
    "options": [
      "4",
      "8",
      "2"
    ],
    "correct": 0,
    "explanation": "Канонический вид $y^2 = 2px$, значит $2p = 8$ и $p = 4$.",
    "reveal": "Парабола — множество точек, равноудалённых от фокуса и директрисы. У неё один фокус."
  },
  "theory": [
    {
      "title": "Определение и уравнение",
      "blocks": [
        {
          "type": "formula",
          "content": "|FM| = \\text{dist}(M, \\text{директриса})"
        },
        {
          "type": "formula",
          "content": "y^2 = 2px, \\quad p > 0"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 320 200'><line class='fg-axis' x1='10' y1='100' x2='310' y2='100'/><line class='fg-axis' x1='70' y1='10' x2='70' y2='190'/><line class='fig-curve-2' x1='40' y1='20' x2='40' y2='180' stroke='#a855f7' stroke-width='2' stroke-dasharray='5 4'/><path class='fg-curve' d='M60 100 Q240 20 240 100 Q240 180 60 100'/><circle class='fg-point' cx='100' cy='100' r='4'/><circle class='fg-point' cx='180' cy='45' r='3.5'/><line class='fg-dash' x1='100' y1='100' x2='180' y2='45'/><line class='fg-dash' x1='180' y1='45' x2='40' y2='45'/><text class='fg-label' x='104' y='94'>F</text><text class='fg-label' x='24' y='110'>d</text><text class='fg-label' x='185' y='40'>M</text><text class='fg-note' x='255' y='100'>y² = 2px</text></svg>",
          "caption": "Расстояние до фокуса равно расстоянию до директрисы."
        },
        {
          "type": "table",
          "title": "Элементы",
          "headers": [
            "Элемент",
            "Значение"
          ],
          "rows": [
            [
              "Фокус",
              "$F\\left(\\frac{p}{2}, 0\\right)$"
            ],
            [
              "Директриса",
              "$x = -\\frac{p}{2}$"
            ],
            [
              "Вершина",
              "$(0, 0)$"
            ],
            [
              "Ось симметрии",
              "$Ox$"
            ]
          ]
        }
      ]
    },
    {
      "title": "Другие ориентации",
      "blocks": [
        {
          "type": "table",
          "title": "Виды",
          "headers": [
            "Уравнение",
            "Куда направлена"
          ],
          "rows": [
            [
              "$y^2 = 2px$",
              "вправо"
            ],
            [
              "$y^2 = -2px$",
              "влево"
            ],
            [
              "$x^2 = 2py$",
              "вверх"
            ],
            [
              "$x^2 = -2py$",
              "вниз"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$x^2 = 4y$. Найдите фокус и директрису.",
          "solution": "$2p = 4 \\Rightarrow p = 2$. Фокус $(0, \\frac{p}{2}) = (0,1)$, директриса $y = -1$."
        },
        {
          "type": "warning",
          "content": "Типичная ошибка: путать $\\frac{p}{2}$ и $p$. Фокус в $\\frac{p}{2}$, а не в $p$."
        }
      ]
    },
    {
      "title": "Оптическое свойство",
      "blocks": [
        {
          "type": "text",
          "content": "Луч, параллельный оси симметрии, после отражения проходит через фокус. Поэтому работают спутниковые антенны и фары."
        },
        {
          "type": "remember",
          "content": "Парабола — граница между эллипсом и гиперболой по эксцентриситету: $\\varepsilon = 1$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$y^2 = 12x$. Найдите $p$.",
      "answer": "6",
      "tolerance": 0.01,
      "hint": "$2p = 12$.",
      "explanation": "$p = 6$."
    },
    {
      "type": "single_choice",
      "question": "Фокус параболы $y^2 = 4x$:",
      "options": [
        "$(1, 0)$",
        "$(4, 0)$",
        "$(2, 0)$"
      ],
      "correct": 0,
      "hint": "$p = 2$, фокус в $p/2$.",
      "explanation": "$(1, 0)$."
    },
    {
      "type": "numeric",
      "question": "Директриса $y^2 = 8x$: при каком $x$ она стоит? (модуль значения)",
      "answer": "2",
      "tolerance": 0.01,
      "hint": "$p = 4$, $x = -p/2$.",
      "explanation": "$x = -2$, модуль $2$."
    },
    {
      "type": "single_choice",
      "question": "$x^2 = -6y$ направлена:",
      "options": [
        "вниз",
        "вверх",
        "вправо"
      ],
      "correct": 0,
      "hint": "Минус перед $y$.",
      "explanation": "Вниз."
    },
    {
      "type": "numeric",
      "question": "Эксцентриситет параболы.",
      "answer": "1",
      "tolerance": 0.01,
      "hint": "Определение через директрису.",
      "explanation": "$\\varepsilon = 1$."
    },
    {
      "type": "true_false",
      "question": "У параболы два фокуса.",
      "correct": false,
      "hint": "Один фокус и директриса.",
      "explanation": "Неверно: фокус один."
    }
  ],
  "review_cards": [
    {
      "q": "Каноническое уравнение параболы",
      "a": "$y^2 = 2px$"
    },
    {
      "q": "Фокус параболы",
      "a": "$(p/2, 0)$"
    },
    {
      "q": "Директриса",
      "a": "$x = -p/2$"
    },
    {
      "q": "Оптическое свойство",
      "a": "Луч вдоль оси идёт в фокус."
    }
  ],
  "summary": [
    "Парабола — равенство расстояний до фокуса и директрисы.",
    "Фокус в $\\frac{p}{2}$, не в $p$.",
    "$\\varepsilon = 1$ — граница между эллипсом и гиперболой."
  ]
});
