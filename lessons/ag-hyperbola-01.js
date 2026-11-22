// Урок: Гипербола: определение, свойства, форма. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-hyperbola-01",
  "subject": "Аналитическая геометрия",
  "topic": "Кривые второго порядка",
  "order": 15,
  "title": "Гипербола: определение, свойства, форма",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "Гипербола $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$. Чему равен $c$?",
    "options": [
      "5",
      "√7",
      "3"
    ],
    "correct": 0,
    "explanation": "У гиперболы $c^2 = a^2 + b^2 = 9 + 16 = 25$, значит $c = 5$.",
    "reveal": "Гипербола — постоянная разность расстояний до фокусов. Здесь $c^2 = a^2 + b^2$, в отличие от эллипса."
  },
  "theory": [
    {
      "title": "Определение и уравнение",
      "blocks": [
        {
          "type": "formula",
          "content": "||F_1M| - |F_2M|| = 2a"
        },
        {
          "type": "formula",
          "content": "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 320 200'><line class='fg-axis' x1='10' y1='100' x2='310' y2='100'/><line class='fg-axis' x1='160' y1='10' x2='160' y2='190'/><line class='fg-dash' x1='40' y1='180' x2='280' y2='20'/><line class='fg-dash' x1='40' y1='20' x2='280' y2='180'/><path class='fg-curve' d='M105 20 Q160 100 105 180'/><path class='fg-curve' d='M215 20 Q160 100 215 180'/><circle class='fg-point' cx='120' cy='100' r='4'/><circle class='fg-point' cx='200' cy='100' r='4'/><text class='fg-label' x='108' y='92'>F₁</text><text class='fg-label' x='205' y='92'>F₂</text><text class='fg-note' x='215' y='35'>асимптоты</text></svg>",
          "caption": "Две ветви, асимптоты и фокусы на оси $Ox$."
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
            "Формула"
          ],
          "rows": [
            [
              "$a$",
              "$\\sqrt{\\text{знаменателя при } x^2}$"
            ],
            [
              "$b$",
              "$\\sqrt{\\text{знаменателя при } y^2}$"
            ],
            [
              "$c$",
              "$c^2 = a^2 + b^2$"
            ],
            [
              "Эксцентриситет",
              "$\\varepsilon = \\frac{c}{a} > 1$"
            ],
            [
              "Асимптоты",
              "$y = \\pm \\frac{b}{a}x$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$\\frac{x^2}{16} - \\frac{y^2}{9} = 1$.",
          "solution": "$a = 4$, $b = 3$, $c = 5$, $\\varepsilon = 1{,}25$, асимптоты $y = \\pm\\frac34 x$."
        },
        {
          "type": "remember",
          "content": "Сопряжённая гипербола $\\frac{y^2}{b^2} - \\frac{x^2}{a^2} = 1$ имеет те же асимптоты, но ветви вдоль другой оси."
        }
      ]
    },
    {
      "title": "Форма и оптическое свойство",
      "blocks": [
        {
          "type": "text",
          "content": "Ветви выходят из вершин $(\\pm a, 0)$ и уходят в бесконечность, приближаясь к асимптотам."
        },
        {
          "type": "remember",
          "content": "Оптическое: луч, направленный в фокус, отражается так, что его продолжение идёт во второй фокус. Используется в телескопах."
        },
        {
          "type": "warning",
          "content": "Знак минус стоит именно перед $y^2$. Если минус перед $x^2$ — ветви направлены вдоль $Oy$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$\\frac{x^2}{9} - \\frac{y^2}{16} = 1$. Найдите $c$.",
      "answer": "5",
      "tolerance": 0.01,
      "hint": "$a^2 + b^2$.",
      "explanation": "$\\sqrt{25} = 5$."
    },
    {
      "type": "single_choice",
      "question": "У гиперболы $c$ связано с $a$ и $b$:",
      "options": [
        "$c^2 = a^2 + b^2$",
        "$c^2 = a^2 - b^2$",
        "$c = a + b$"
      ],
      "correct": 0,
      "hint": "Знак плюс.",
      "explanation": "$c^2 = a^2 + b^2$."
    },
    {
      "type": "numeric",
      "question": "Эксцентриситет $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$ (округлите до 0,01).",
      "answer": "1.25",
      "tolerance": 0.02,
      "hint": "$c/a = 5/4$.",
      "explanation": "$1{,}25$."
    },
    {
      "type": "single_choice",
      "question": "Асимптоты $\\frac{x^2}{9} - \\frac{y^2}{4} = 1$:",
      "options": [
        "$y = \\pm\\frac23 x$",
        "$y = \\pm\\frac32 x$",
        "$y = \\pm 2x$"
      ],
      "correct": 0,
      "hint": "$\\frac{b}{a} = \\frac23$.",
      "explanation": "$y = \\pm\\frac23 x$."
    },
    {
      "type": "true_false",
      "question": "У гиперболы эксцентриситет больше единицы.",
      "correct": true,
      "hint": "$c > a$.",
      "explanation": "Верно."
    },
    {
      "type": "multi_choice",
      "question": "Что верно про гиперболу?",
      "options": [
        "Две ветви",
        "Фокусы на оси $Ox$ для $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$",
        "Проходит через точку $(a, 0)$",
        "Замкнутая кривая"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Гипербола не замкнута.",
      "explanation": "Ветви уходят в бесконечность."
    }
  ],
  "review_cards": [
    {
      "q": "Уравнение гиперболы",
      "a": "$\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$"
    },
    {
      "q": "Связь $c$ с $a$ и $b$",
      "a": "$c^2 = a^2 + b^2$"
    },
    {
      "q": "Асимптоты",
      "a": "$y = \\pm\\frac{b}{a}x$"
    },
    {
      "q": "Эксцентриситет гиперболы",
      "a": "$\\varepsilon = c/a > 1$"
    }
  ],
  "summary": [
    "Гипербола — разность расстояний постоянна.",
    "$c^2 = a^2 + b^2$ — знак плюс.",
    "Асимптоты задают форму ветвей."
  ]
});
