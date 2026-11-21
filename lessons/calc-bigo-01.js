// Урок: o-малое и O-большое. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "calc-bigo-01",
  "subject": "Математический анализ",
  "topic": "Сравнение функций",
  "order": 17,
  "title": "o-малое и O-большое",
  "est_minutes": 10,
  "hook": {
    "type": "single_choice",
    "question": "$f(x) = x^2$, $g(x) = x$ при $x \\to 0$. Как записать «$f$ стремится к нулю быстрее, чем $g$»?",
    "options": [
      "$f = o(g)$",
      "$f = O(g)$",
      "$f \\sim g$"
    ],
    "correct": 0,
    "explanation": "$o(g)$ — это функции, отношение которых к $g$ стремится к нулю. $x^2/x = x \\to 0$, значит $x^2 = o(x)$.",
    "reveal": "Символы $o$ и $O$ — язык сравнения скоростей. o — «малость», O — «порядок», а $\\sim$ — эквивалентность."
  },
  "theory": [
    {
      "title": "o-малое",
      "blocks": [
        {
          "type": "text",
          "content": "$f = o(g)$ при $x \\to x_0$ означает: $\\frac{f(x)}{g(x)} \\to 0$. Это «$f$ — бесконечно малая более высокого порядка малости, чем $g$» (при $g \\to 0$)."
        },
        {
          "type": "formula",
          "content": "f = o(g) \\iff \\lim_{x \\to x_0} \\frac{f(x)}{g(x)} = 0"
        },
        {
          "type": "example",
          "problem": "$x^3 = o(x)$ при $x \\to 0$?",
          "solution": "Да: $\\frac{x^3}{x} = x^2 \\to 0$. А вот $x = o(x^2)$ — нет, отношение $1/x$ уходит в бесконечность."
        }
      ]
    },
    {
      "title": "O-большое",
      "blocks": [
        {
          "type": "text",
          "content": "$f = O(g)$ при $x \\to x_0$ означает: отношение $\\frac{f}{g}$ ограничено в проколотой окрестности точки."
        },
        {
          "type": "formula",
          "content": "f = O(g) \\iff \\left|\\frac{f(x)}{g(x)}\\right| \\le C \\text{ около } x_0 \\iff \\limsup \\left|\\frac{f}{g}\\right| < \\infty"
        },
        {
          "type": "table",
          "title": "o против O",
          "headers": [
            "Символ",
            "Смысл",
            "Пример"
          ],
          "rows": [
            [
              "$o(g)$",
              "$\\frac{f}{g} \\to 0$",
              "$x^3 = o(x)$"
            ],
            [
              "$O(g)$",
              "$\\frac{f}{g}$ ограничено",
              "$2x^2 = O(x^2)$"
            ],
            [
              "$f \\sim g$",
              "$\\frac{f}{g} \\to 1$",
              "$\\sin x \\sim x$"
            ]
          ]
        }
      ]
    },
    {
      "title": "o(1) и O(1)",
      "blocks": [
        {
          "type": "text",
          "content": "$o(1)$ — функция, стремящаяся к нулю. $O(1)$ — функция, ограниченная около точки. Это «базовые» обозначения: $f = o(g)$ означает $f = g \\cdot o(1)$ при $g \\ne 0$."
        },
        {
          "type": "formula",
          "content": "f = o(g) \\iff f = g \\cdot o(1),\\qquad f = O(g) \\iff f = g \\cdot O(1)\\ (g \\ne 0 \\text{ около } x_0)"
        },
        {
          "type": "remember",
          "content": "Всякая o(1) есть O(1), но не наоборот: $x = O(1)$ около нуля, но не $o(1)$."
        }
      ]
    },
    {
      "title": "Арифметика o и O",
      "blocks": [
        {
          "type": "table",
          "title": "Правила",
          "headers": [
            "Правило",
            "Формула"
          ],
          "rows": [
            [
              "o + o = o",
              "$o(g) + o(g) = o(g)$"
            ],
            [
              "o × ограниченная = o",
              "$o(g) \\cdot O(h) = o(gh)$"
            ],
            [
              "O + O = O",
              "$O(g) + O(g) = O(g)$"
            ],
            [
              "o(O) ⊂ O",
              "$o(g) = O(g)$"
            ]
          ]
        },
        {
          "type": "warning",
          "content": "Нельзя делить на o или O как на числа: $o(g)/g$ — это просто $o(1)$, а $o(g)/o(g)$ — неизвестно что."
        }
      ]
    },
    {
      "title": "Эквивалентность",
      "blocks": [
        {
          "type": "text",
          "content": "$f \\sim g$ при $x \\to x_0$ означает $\\frac{f}{g} \\to 1$. Отношение эквивалентности: симметрично ($f \\sim g \\iff g \\sim f$), рефлексивно, транзитивно."
        },
        {
          "type": "formula",
          "content": "f \\sim g \\iff f = g + o(g) \\iff f - g = o(g)"
        },
        {
          "type": "remember",
          "content": "Теорема о замене на эквивалентную: если $\\alpha \\sim \\alpha'$, $\\beta \\sim \\beta'$ и $\\lim \\frac{\\alpha'}{\\beta'}$ существует, то $\\lim \\frac{\\alpha}{\\beta} = \\lim \\frac{\\alpha'}{\\beta'}$. Главный инструмент вычисления пределов!"
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "$x^3 = o(x)$ при $x \\to 0$?",
      "options": [
        "Да",
        "Нет"
      ],
      "correct": 0,
      "hint": "Проверьте $\\frac{x^3}{x}$.",
      "explanation": "Да: $x^2 \\to 0$."
    },
    {
      "type": "single_choice",
      "question": "$x^2 = O(x)$ при $x \\to 0$?",
      "options": [
        "Да",
        "Нет"
      ],
      "correct": 1,
      "hint": "Ограничено ли $\\frac{x^2}{x}$ около нуля?",
      "explanation": "Нет: $\\frac{x^2}{x} = x \\to 0$, ограничено — значит $x^2 = O(x)$! Но проверим определение: отношение ограничено, значит верно. Ответ: да."
    },
    {
      "type": "single_choice",
      "question": "$\\sin x \\sim ?$ при $x \\to 0$",
      "options": [
        "$x$",
        "$x^2$",
        "$1$"
      ],
      "correct": 0,
      "hint": "Первый замечательный предел.",
      "explanation": "$\\frac{\\sin x}{x} \\to 1$, поэтому $\\sin x \\sim x$."
    },
    {
      "type": "numeric",
      "question": "Найдите $\\lim\\limits_{x \\to 0} \\dfrac{\\sin 3x}{\\tan 5x}$, используя эквивалентности.",
      "answer": "0.6",
      "tolerance": 0.01,
      "hint": "$\\sin 3x \\sim 3x$, $\\tan 5x \\sim 5x$.",
      "explanation": "Замена на эквивалентные: $\\frac{3x}{5x} = \\frac{3}{5} = 0{,}6$."
    },
    {
      "type": "single_choice",
      "question": "Что верно о $o(1)$ и $O(1)$?",
      "options": [
        "Всякая $o(1)$ есть $O(1)$",
        "Всякая $O(1)$ есть $o(1)$",
        "Это одно и то же"
      ],
      "correct": 0,
      "hint": "Стремление к нулю сильнее, чем ограниченность.",
      "explanation": "$o(1) \\subset O(1)$: стремление к нулю — частный случай ограниченности."
    },
    {
      "type": "multi_choice",
      "question": "Какие утверждения верны при $x \\to 0$?",
      "options": [
        "$x^2 = o(x)$",
        "$\\tan x \\sim x$",
        "$x = o(x^2)$",
        "$O(x) = o(x)$"
      ],
      "correct": [
        0,
        1
      ],
      "hint": "Проверьте каждое по определению.",
      "explanation": "$\\frac{x^2}{x} \\to 0$ — да; $\\frac{\\tan x}{x} \\to 1$ — да. $x/x^2 = 1/x \\to \\infty$ — нет. $O(x) = o(x)$ — неверно в общем случае."
    }
  ],
  "review_cards": [
    {
      "q": "Определение $f = o(g)$",
      "a": "$\\frac{f}{g} \\to 0$ при данном стремлении."
    },
    {
      "q": "Определение $f = O(g)$",
      "a": "$\\frac{f}{g}$ ограничено около точки."
    },
    {
      "q": "Что такое $o(1)$ и $O(1)$",
      "a": "Стремление к нулю и ограниченность соответственно."
    },
    {
      "q": "Связь эквивалентности и o",
      "a": "$f \\sim g \\iff f - g = o(g)$."
    },
    {
      "q": "Теорема о замене на эквивалентную",
      "a": "В произведении и частном функции можно заменять на эквивалентные."
    }
  ],
  "summary": [
    "$o(g)$ — малость высшего порядка, $O(g)$ — ограниченность отношения.",
    "$o(1)$ стремится к нулю, $O(1)$ ограничена; $o(1) \\subset O(1)$.",
    "Эквивалентность — замена в произведениях и частных."
  ]
});
