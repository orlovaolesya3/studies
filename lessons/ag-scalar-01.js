// Урок: Угол, проекция и скалярное произведение. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-scalar-01",
  "subject": "Аналитическая геометрия",
  "topic": "Скалярное произведение",
  "order": 5,
  "title": "Угол, проекция и скалярное произведение",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "$\\vec{a} = (1, 2)$, $\\vec{b} = (3, -1)$. Чему равно $\\vec{a} \\cdot \\vec{b}$?",
    "options": [
      "1",
      "5",
      "−1"
    ],
    "correct": 0,
    "explanation": "$1 \\cdot 3 + 2 \\cdot (-1) = 3 - 2 = 1$.",
    "reveal": "Скалярное произведение превращает два вектора в число. Оно же кодирует угол и перпендикулярность."
  },
  "theory": [
    {
      "title": "Проекция вектора на ось",
      "blocks": [
        {
          "type": "text",
          "content": "Проекция — длина «тени» вектора на направление оси, со знаком. Если угол острый — плюс, тупой — минус."
        },
        {
          "type": "formula",
          "content": "\\text{пр}_{\\vec{e}}\\vec{a} = |\\vec{a}| \\cos \\varphi, \\quad |\\vec{e}| = 1"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 160'><defs><marker id='p1' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='currentColor'/></marker></defs><line class='fg-axis' x1='30' y1='125' x2='270' y2='125' marker-end='url(#p1)'/><line class='fg-line' x1='30' y1='125' x2='170' y2='45' marker-end='url(#p1)'/><line class='fg-dash' x1='170' y1='45' x2='170' y2='125'/><line class='fg-curve-2' x1='30' y1='125' x2='170' y2='125'/><path class='fg-dash' d='M55 125 A25 25 0 0 0 48 110'/><text class='fg-label' x='95' y='70'>a</text><text class='fg-label' x='62' y='140'>φ</text><text class='fg-note' x='80' y='118'>пр = |a| cos φ</text></svg>",
          "caption": "Проекция — это катет, прилежащий к углу φ."
        },
        {
          "type": "remember",
          "content": "Свойства проекции линейны: $\\text{пр}(\\vec{a} + \\vec{b}) = \\text{пр}\\,\\vec{a} + \\text{пр}\\,\\vec{b}$ и $\\text{пр}(\\lambda \\vec{a}) = \\lambda\\, \\text{пр}\\,\\vec{a}$."
        }
      ]
    },
    {
      "title": "Скалярное произведение",
      "blocks": [
        {
          "type": "formula",
          "content": "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\varphi = x_1x_2 + y_1y_2 + z_1z_2"
        },
        {
          "type": "example",
          "problem": "$\\vec{a} = (2, 1)$, $\\vec{b} = (1, 3)$. Найдите угол.",
          "solution": "$\\vec{a}\\cdot\\vec{b} = 5$, $|\\vec{a}| = \\sqrt5$, $|\\vec{b}| = \\sqrt{10}$. Тогда $\\cos\\varphi = \\frac{5}{\\sqrt{50}} = \\frac{1}{\\sqrt2}$, то есть $\\varphi = 45^\\circ$."
        },
        {
          "type": "formula",
          "content": "\\cos\\varphi = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}|\\,|\\vec{b}|}"
        },
        {
          "type": "warning",
          "content": "Скалярное произведение — число, а не вектор. Не путайте с векторным."
        }
      ]
    },
    {
      "title": "Свойства и ортогональность",
      "blocks": [
        {
          "type": "table",
          "title": "Свойства",
          "headers": [
            "Свойство",
            "Запись"
          ],
          "rows": [
            [
              "Симметрия",
              "$\\vec{a}\\cdot\\vec{b} = \\vec{b}\\cdot\\vec{a}$"
            ],
            [
              "Линейность",
              "$(\\alpha\\vec{a})\\cdot\\vec{b} = \\alpha(\\vec{a}\\cdot\\vec{b})$"
            ],
            [
              "Распределительность",
              "$(\\vec{a}+\\vec{b})\\cdot\\vec{c} = \\vec{a}\\cdot\\vec{c} + \\vec{b}\\cdot\\vec{c}$"
            ],
            [
              "Квадрат",
              "$\\vec{a}\\cdot\\vec{a} = |\\vec{a}|^2$"
            ]
          ]
        },
        {
          "type": "formula",
          "content": "\\vec{a} \\perp \\vec{b} \\iff \\vec{a}\\cdot\\vec{b} = 0"
        },
        {
          "type": "example",
          "problem": "Перпендикулярны ли $(1, 2, -1)$ и $(3, 0, 3)$?",
          "solution": "$1\\cdot3 + 2\\cdot0 + (-1)\\cdot3 = 0$ — да, перпендикулярны."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$\\vec{a} = (1, -2)$, $\\vec{b} = (3, 4)$. Найдите $\\vec{a}\\cdot\\vec{b}$.",
      "answer": "-5",
      "tolerance": 0.01,
      "hint": "Сумма произведений координат.",
      "explanation": "$3 - 8 = -5$."
    },
    {
      "type": "single_choice",
      "question": "$\\vec{a}\\cdot\\vec{b} = 0$ означает:",
      "options": [
        "векторы перпендикулярны",
        "векторы равны",
        "один из них нулевой"
      ],
      "correct": 0,
      "hint": "$\\cos 90^\\circ = 0$.",
      "explanation": "Ортогональность."
    },
    {
      "type": "numeric",
      "question": "$|\\vec{a}| = 3$, $|\\vec{b}| = 4$, угол $60^\\circ$. Найдите $\\vec{a}\\cdot\\vec{b}$.",
      "answer": "6",
      "tolerance": 0.01,
      "hint": "$\\cos 60^\\circ = 0{,}5$.",
      "explanation": "$3 \\cdot 4 \\cdot 0{,}5 = 6$."
    },
    {
      "type": "numeric",
      "question": "При каком $c$ векторы $(1, c)$ и $(2, 3)$ перпендикулярны? Ответ округлите до 0,01.",
      "answer": "-0.67",
      "tolerance": 0.02,
      "hint": "$2 + 3c = 0$.",
      "explanation": "$c = -\\frac23 \\approx -0{,}67$."
    },
    {
      "type": "numeric",
      "question": "$\\vec{a} = (3, 4)$. Найдите $\\vec{a}\\cdot\\vec{a}$.",
      "answer": "25",
      "tolerance": 0.01,
      "hint": "Это квадрат длины.",
      "explanation": "$9 + 16 = 25$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно?",
      "options": [
        "$\\vec{a}\\cdot\\vec{b} = \\vec{b}\\cdot\\vec{a}$",
        "$\\vec{a}\\cdot\\vec{a} = |\\vec{a}|^2$",
        "$\\vec{a}\\cdot\\vec{b}$ — вектор",
        "$\\vec{a}\\perp\\vec{b} \\iff \\vec{a}\\cdot\\vec{b}=0$"
      ],
      "correct": [
        0,
        1,
        3
      ],
      "hint": "Скалярное произведение даёт число.",
      "explanation": "Третье неверно: результат — скаляр."
    }
  ],
  "review_cards": [
    {
      "q": "Скалярное произведение через координаты",
      "a": "$x_1x_2 + y_1y_2 + z_1z_2$"
    },
    {
      "q": "Условие перпендикулярности",
      "a": "$\\vec{a}\\cdot\\vec{b} = 0$"
    },
    {
      "q": "Косинус угла",
      "a": "$\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}$"
    },
    {
      "q": "Проекция",
      "a": "$|\\vec{a}|\\cos\\varphi$"
    }
  ],
  "summary": [
    "Скалярное произведение — число.",
    "Ноль означает перпендикулярность.",
    "Проекция — это длина тени со знаком."
  ]
});
