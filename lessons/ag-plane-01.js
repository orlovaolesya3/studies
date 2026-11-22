// Урок: Уравнения плоскости в пространстве. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-plane-01",
  "subject": "Аналитическая геометрия",
  "topic": "Плоскость",
  "order": 11,
  "title": "Уравнения плоскости в пространстве",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "Плоскость $2x - y + 3z - 6 = 0$. Чему равен нормальный вектор?",
    "options": [
      "$(2, -1, 3)$",
      "$(2, 1, 3)$",
      "$(6, 6, 6)$"
    ],
    "correct": 0,
    "explanation": "Нормаль — коэффициенты при $x, y, z$.",
    "reveal": "Плоскость в пространстве устроена так же, как прямая на плоскости: точка плюс нормаль."
  },
  "theory": [
    {
      "title": "Через точку и нормаль",
      "blocks": [
        {
          "type": "formula",
          "content": "A(x - x_0) + B(y - y_0) + C(z - z_0) = 0"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 190'><defs><marker id='pl1' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='currentColor'/></marker></defs><polygon class='fg-fill' points='40,130 170,150 260,90 130,70'/><line class='fg-line' x1='150' y1='110' x2='150' y2='35' marker-end='url(#pl1)'/><circle class='fg-point' cx='150' cy='110' r='3.5'/><text class='fg-label' x='156' y='35'>n</text><text class='fg-label' x='154' y='125'>M₀</text></svg>",
          "caption": "Плоскость и её нормальный вектор."
        },
        {
          "type": "example",
          "problem": "Плоскость через $M_0(1, -1, 3)$ с нормалью $(2, 0, -1)$.",
          "solution": "$2(x-1) + 0(y+1) - 1(z-3) = 0$, то есть $2x - z + 1 = 0$."
        }
      ]
    },
    {
      "title": "Другие виды",
      "blocks": [
        {
          "type": "table",
          "title": "Формы",
          "headers": [
            "Вид",
            "Уравнение"
          ],
          "rows": [
            [
              "Общее",
              "$Ax + By + Cz + D = 0$"
            ],
            [
              "В отрезках",
              "$\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$"
            ],
            [
              "Через 3 точки",
              "$\\begin{vmatrix} x-x_1 & y-y_1 & z-z_1 \\\\ \\ldots & \\ldots & \\ldots \\\\ \\ldots & \\ldots & \\ldots \\end{vmatrix} = 0$"
            ],
            [
              "Нормированное",
              "$x\\cos\\alpha + y\\cos\\beta + z\\cos\\gamma - p = 0$"
            ]
          ]
        },
        {
          "type": "remember",
          "content": "Плоскость через три точки строится через смешанное произведение: $\\vec{M_1M}$, $\\vec{M_1M_2}$, $\\vec{M_1M_3}$ компланарны."
        }
      ]
    },
    {
      "title": "Угол и расположение",
      "blocks": [
        {
          "type": "formula",
          "content": "\\cos\\varphi = \\frac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}"
        },
        {
          "type": "table",
          "title": "Условия",
          "headers": [
            "Положение",
            "Условие"
          ],
          "rows": [
            [
              "Параллельны",
              "$\\vec{n}_1 \\parallel \\vec{n}_2$"
            ],
            [
              "Перпендикулярны",
              "$\\vec{n}_1\\cdot\\vec{n}_2 = 0$"
            ],
            [
              "Расстояние от точки",
              "$d = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$"
            ]
          ]
        },
        {
          "type": "warning",
          "content": "Угол между плоскостями равен углу между нормалями, но берётся по модулю косинуса — иначе получится тупой угол."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "Нормаль к $x + 2y - z + 5 = 0$:",
      "options": [
        "$(1, 2, -1)$",
        "$(1, 2, 1)$",
        "$(5, 5, 5)$"
      ],
      "correct": 0,
      "hint": "Коэффициенты при переменных.",
      "explanation": "$(1, 2, -1)$."
    },
    {
      "type": "numeric",
      "question": "Расстояние от $(0,0,0)$ до $2x + 2y + z - 9 = 0$.",
      "answer": "3",
      "tolerance": 0.01,
      "hint": "$\\sqrt{4+4+1} = 3$.",
      "explanation": "$9/3 = 3$."
    },
    {
      "type": "single_choice",
      "question": "Плоскости $x + y + z = 1$ и $x + y + z = 4$:",
      "options": [
        "параллельны",
        "перпендикулярны",
        "совпадают"
      ],
      "correct": 0,
      "hint": "Нормали одинаковые.",
      "explanation": "Параллельны."
    },
    {
      "type": "numeric",
      "question": "Плоскость $\\frac{x}{2} + \\frac{y}{3} + \\frac{z}{6} = 1$. Чему равен отрезок на оси $Ox$?",
      "answer": "2",
      "tolerance": 0.01,
      "hint": "Знаменатель при x.",
      "explanation": "$a = 2$."
    },
    {
      "type": "true_false",
      "question": "Две плоскости перпендикулярны, если их нормали перпендикулярны.",
      "correct": true,
      "hint": "Угол между плоскостями = угол между нормалями.",
      "explanation": "Верно."
    },
    {
      "type": "multi_choice",
      "question": "Что задаёт плоскость однозначно?",
      "options": [
        "Точка и нормаль",
        "Три точки не на одной прямой",
        "Две параллельные прямые",
        "Одна точка"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Одной точки мало.",
      "explanation": "Через одну точку проходит бесконечно много плоскостей."
    }
  ],
  "review_cards": [
    {
      "q": "Уравнение плоскости по нормали",
      "a": "$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$"
    },
    {
      "q": "Нормаль из общего уравнения",
      "a": "$(A, B, C)$"
    },
    {
      "q": "Расстояние от точки до плоскости",
      "a": "$\\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$"
    },
    {
      "q": "Условие параллельности плоскостей",
      "a": "Нормали коллинеарны."
    }
  ],
  "summary": [
    "Плоскость задаётся точкой и нормалью.",
    "Угол между плоскостями — угол между нормалями.",
    "Формула расстояния — та же, что и на плоскости."
  ]
});
