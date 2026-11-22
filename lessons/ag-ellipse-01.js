// Урок: Эллипс: определение, свойства, форма. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-ellipse-01",
  "subject": "Аналитическая геометрия",
  "topic": "Кривые второго порядка",
  "order": 14,
  "title": "Эллипс: определение, свойства, форма",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "У эллипса $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$. Чему равна большая полуось?",
    "options": [
      "5",
      "3",
      "4"
    ],
    "correct": 0,
    "explanation": "$a^2 = 25$, значит $a = 5$. Меньшая — $3$, а $c = \\sqrt{25-9} = 4$.",
    "reveal": "Эллипс — множество точек, сумма расстояний от которых до двух фокусов постоянна."
  },
  "theory": [
    {
      "title": "Определение",
      "blocks": [
        {
          "type": "formula",
          "content": "|F_1M| + |F_2M| = 2a"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 320 190'><ellipse class='fg-curve' cx='160' cy='95' rx='130' ry='75'/><line class='fg-axis' x1='10' y1='95' x2='310' y2='95'/><line class='fg-axis' x1='160' y1='10' x2='160' y2='180'/><circle class='fg-point' cx='100' cy='95' r='4'/><circle class='fg-point' cx='220' cy='95' r='4'/><circle class='fg-point' cx='205' cy='50' r='3.5'/><line class='fg-dash' x1='100' y1='95' x2='205' y2='50'/><line class='fg-dash' x1='220' y1='95' x2='205' y2='50'/><text class='fg-label' x='86' y='90'>F₁</text><text class='fg-label' x='225' y='90'>F₂</text><text class='fg-label' x='210' y='45'>M</text><text class='fg-label' x='292' y='110'>a</text><text class='fg-label' x='165' y='20'>b</text></svg>",
          "caption": "Сумма расстояний от точки эллипса до фокусов постоянна."
        },
        {
          "type": "formula",
          "content": "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1, \\quad a > b > 0"
        }
      ]
    },
    {
      "title": "Параметры",
      "blocks": [
        {
          "type": "table",
          "title": "Элементы",
          "headers": [
            "Величина",
            "Формула",
            "Что это"
          ],
          "rows": [
            [
              "$a$",
              "$a^2$ — из знаменателя",
              "большая полуось"
            ],
            [
              "$b$",
              "$b^2$ — из знаменателя",
              "малая полуось"
            ],
            [
              "$c$",
              "$c^2 = a^2 - b^2$",
              "половина расстояния между фокусами"
            ],
            [
              "Эксцентриситет",
              "$\\varepsilon = \\frac{c}{a} < 1$",
              "мера «вытянутости»"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$\\frac{x^2}{16} + \\frac{y^2}{7} = 1$. Найдите $c$ и $\\varepsilon$.",
          "solution": "$a = 4$, $b = \\sqrt7$, $c = \\sqrt{16-7} = 3$, $\\varepsilon = \\frac34$."
        },
        {
          "type": "remember",
          "content": "У эллипса всегда $c^2 = a^2 - b^2$ со знаком минус, у гиперболы — плюс. Это ключевое различие."
        }
      ]
    },
    {
      "title": "Форма и оптическое свойство",
      "blocks": [
        {
          "type": "text",
          "content": "Эллипс — сжатая окружность. Чем ближе $\\varepsilon$ к $1$, тем сильнее вытянут; при $\\varepsilon = 0$ получается окружность."
        },
        {
          "type": "remember",
          "content": "Оптическое свойство: луч из фокуса после отражения попадает во второй фокус. Поэтому «шёпотная галерея» работает."
        },
        {
          "type": "warning",
          "content": "Фокусы всегда лежат на большой оси. Если под $x^2$ стоит меньший знаменатель — оси переставлены."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$\\frac{x^2}{25} + \\frac{y^2}{16} = 1$. Найдите $c$.",
      "answer": "3",
      "tolerance": 0.01,
      "hint": "$\\sqrt{25-16}$.",
      "explanation": "$c = 3$."
    },
    {
      "type": "single_choice",
      "question": "Эксцентриситет эллипса всегда:",
      "options": [
        "меньше 1",
        "больше 1",
        "равен 1"
      ],
      "correct": 0,
      "hint": "$c < a$.",
      "explanation": "$\\varepsilon = c/a < 1$."
    },
    {
      "type": "numeric",
      "question": "$\\frac{x^2}{9} + \\frac{y^2}{4} = 1$. Найдите $\\varepsilon$ (округлите до 0,01).",
      "answer": "0.75",
      "tolerance": 0.02,
      "hint": "$c = \\sqrt5$, $a = 3$.",
      "explanation": "$\\sqrt5/3 \\approx 0{,}75$."
    },
    {
      "type": "numeric",
      "question": "Сумма расстояний до фокусов равна $10$. Чему равно $a$?",
      "answer": "5",
      "tolerance": 0.01,
      "hint": "Сумма равна $2a$.",
      "explanation": "$a = 5$."
    },
    {
      "type": "true_false",
      "question": "Окружность — частный случай эллипса.",
      "correct": true,
      "hint": "$a = b$.",
      "explanation": "Верно, при $a=b$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно для замены осей?",
      "options": [
        "Фокусы уходят на ось с большим знаменателем",
        "Если $b > a$, то фокусы на $Oy$",
        "Эксцентриситет не меняется при переобозначении",
        "Фокусы всегда на $Ox$"
      ],
      "correct": [
        0,
        1
      ],
      "hint": "Большая ось — там, где больше знаменатель.",
      "explanation": "Фокусы всегда на большой оси, не обязательно на $Ox$."
    }
  ],
  "review_cards": [
    {
      "q": "Каноническое уравнение эллипса",
      "a": "$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$, $a>b$"
    },
    {
      "q": "Связь $a$, $b$, $c$",
      "a": "$c^2 = a^2 - b^2$"
    },
    {
      "q": "Эксцентриситет эллипса",
      "a": "$\\varepsilon = c/a < 1$"
    },
    {
      "q": "Оптическое свойство",
      "a": "Луч из фокуса отражается во второй фокус."
    }
  ],
  "summary": [
    "Эллипс — постоянная сумма расстояний.",
    "$c^2 = a^2 - b^2$ — со знаком минус.",
    "$\\varepsilon$ показывает вытянутость."
  ]
});
