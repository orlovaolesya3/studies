// Урок: Производные основных элементарных функций. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "calc-derivtable-01",
  "subject": "Математический анализ",
  "topic": "Производная",
  "order": 22.5,
  "title": "Производные основных элементарных функций",
  "est_minutes": 8,
  "hook": {
    "type": "single_choice",
    "question": "Чему равна производная $\\sqrt{x}$ в точке $x = 4$?",
    "options": [
      "$\\frac14$",
      "$\\frac12$",
      "$2$"
    ],
    "correct": 0,
    "explanation": "$(\\sqrt x)' = \\frac{1}{2\\sqrt x}$, при $x = 4$ получаем $\\frac{1}{4}$.",
    "reveal": "Таблица производных — рабочая лошадка всего дифференцирования. Её надо помнить наизусть и уметь выводить через определение."
  },
  "theory": [
    {
      "title": "Степенные и показательные",
      "blocks": [
        {
          "type": "table",
          "title": "Таблица",
          "headers": [
            "Функция",
            "Производная"
          ],
          "rows": [
            [
              "$x^n$",
              "$n x^{n-1}$"
            ],
            [
              "$\\sqrt{x}$",
              "$\\frac{1}{2\\sqrt x}$"
            ],
            [
              "$\\frac{1}{x}$",
              "$-\\frac{1}{x^2}$"
            ],
            [
              "$e^x$",
              "$e^x$"
            ],
            [
              "$a^x$",
              "$a^x \\ln a$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "Производная $x^{1/3}$?",
          "solution": "По правилу степени: $\\frac13 x^{-2/3} = \\frac{1}{3\\sqrt[3]{x^2}}$."
        }
      ]
    },
    {
      "title": "Логарифмы и обратные тригонометрические",
      "blocks": [
        {
          "type": "table",
          "title": "Таблица",
          "headers": [
            "Функция",
            "Производная"
          ],
          "rows": [
            [
              "$\\ln x$",
              "$\\frac{1}{x}$"
            ],
            [
              "$\\log_a x$",
              "$\\frac{1}{x \\ln a}$"
            ],
            [
              "$\\arcsin x$",
              "$\\frac{1}{\\sqrt{1 - x^2}}$"
            ],
            [
              "$\\arccos x$",
              "$-\\frac{1}{\\sqrt{1 - x^2}}$"
            ],
            [
              "$\\arctan x$",
              "$\\frac{1}{1 + x^2}$"
            ]
          ]
        },
        {
          "type": "remember",
          "content": "Производные обратных функций получаются из правила $ (f^{-1})' = \\frac{1}{f'}$."
        }
      ]
    },
    {
      "title": "Тригонометрические",
      "blocks": [
        {
          "type": "table",
          "title": "Таблица",
          "headers": [
            "Функция",
            "Производная"
          ],
          "rows": [
            [
              "$\\sin x$",
              "$\\cos x$"
            ],
            [
              "$\\cos x$",
              "$-\\sin x$"
            ],
            [
              "$\\tan x$",
              "$\\frac{1}{\\cos^2 x}$"
            ],
            [
              "$\\cot x$",
              "$-\\frac{1}{\\sin^2 x}$"
            ]
          ]
        },
        {
          "type": "warning",
          "content": "Основная ошибка — забыть минус у косинуса и взять $\\frac{1}{\\cos x}$ вместо $\\frac{1}{\\cos^2 x}$ у тангенса."
        }
      ]
    },
    {
      "title": "Сложные и гиперболические",
      "blocks": [
        {
          "type": "example",
          "problem": "Производная $\\ln(\\sin x)$?",
          "solution": "Сложная функция: $\\frac{1}{\\sin x} \\cdot \\cos x = \\cot x$."
        },
        {
          "type": "table",
          "title": "Гиперболические",
          "headers": [
            "Функция",
            "Производная"
          ],
          "rows": [
            [
              "$\\sinh x$",
              "$\\cosh x$"
            ],
            [
              "$\\cosh x$",
              "$\\sinh x$"
            ],
            [
              "$\\tanh x$",
              "$\\frac{1}{\\cosh^2 x}$"
            ]
          ]
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "Найдите $f'(1)$ для $f(x) = \\ln x$.",
      "answer": "1",
      "tolerance": 0.01,
      "hint": "$f'(x) = 1/x$.",
      "explanation": "$f'(1) = 1$."
    },
    {
      "type": "single_choice",
      "question": "Производная $\\cos x$:",
      "options": [
        "$\\sin x$",
        "$-\\sin x$",
        "$-\\cos x$"
      ],
      "correct": 1,
      "hint": "Знак минус.",
      "explanation": "$(\\cos x)' = -\\sin x$."
    },
    {
      "type": "numeric",
      "question": "Найдите $f'(0)$ для $f(x) = \\arctan x$.",
      "answer": "1",
      "tolerance": 0.01,
      "hint": "$f'(x) = \\frac{1}{1+x^2}$.",
      "explanation": "$f'(0) = 1$."
    },
    {
      "type": "single_choice",
      "question": "Производная $2^x$:",
      "options": [
        "$2^x$",
        "$2^x \\ln 2$",
        "$x 2^{x-1}$"
      ],
      "correct": 1,
      "hint": "Показательная функция: $a^x \\ln a$.",
      "explanation": "$(2^x)' = 2^x \\ln 2$."
    },
    {
      "type": "single_choice",
      "question": "Производная $\\ln(\\cos x)$:",
      "options": [
        "$\\tan x$",
        "$-\\tan x$",
        "$\\cot x$"
      ],
      "correct": 1,
      "hint": "Сложная функция: $\\frac{1}{\\cos x} \\cdot (-\\sin x)$.",
      "explanation": "$-\\frac{\\sin x}{\\cos x} = -\\tan x$."
    },
    {
      "type": "input",
      "question": "Производная $\\sqrt{x}$ — это дробь с корнем в знаменателе. Запишите её в виде 1/(2*k*x^(1/2)) без пробелов, где k — коэффициент? Ответ: одно слово или формула.",
      "answer": [
        "1/(2sqrt(x))",
        "1/(2√x)",
        "1/(2*x^(1/2))"
      ],
      "hint": "$x^{1/2}$ даёт $\\frac12 x^{-1/2}$.",
      "explanation": "$(\\sqrt x)' = \\frac{1}{2\\sqrt x}$."
    }
  ],
  "review_cards": [
    {
      "q": "Производные $\\sin$ и $\\cos$",
      "a": "$\\cos x$ и $-\\sin x$."
    },
    {
      "q": "Производные $\\tan$ и $\\cot$",
      "a": "$\\frac{1}{\\cos^2 x}$ и $-\\frac{1}{\\sin^2 x}$."
    },
    {
      "q": "Производные $\\arcsin$, $\\arccos$, $\\arctan$",
      "a": "$\\frac{1}{\\sqrt{1-x^2}}$, $-\\frac{1}{\\sqrt{1-x^2}}$, $\\frac{1}{1+x^2}$."
    },
    {
      "q": "Производная $a^x$",
      "a": "$a^x \\ln a$."
    },
    {
      "q": "Производная $\\ln(\\cos x)$",
      "a": "$-\\tan x$."
    }
  ],
  "summary": [
    "Таблица производных нужна наизусть.",
    "Обратные функции дают дроби с корнями или $1+x^2$.",
    "Основная ошибка — знаки и квадраты в тангенсе."
  ]
});
