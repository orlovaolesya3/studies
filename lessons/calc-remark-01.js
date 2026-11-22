// Урок: Первый и второй замечательные пределы. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "calc-remark-01",
  "subject": "Математический анализ",
  "topic": "Замечательные пределы",
  "order": 16,
  "title": "Первый и второй замечательные пределы",
  "est_minutes": 10,
  "hook": {
    "type": "single_choice",
    "question": "Попробуйте оценить $\\frac{\\sin x}{x}$ при маленьких $x$: $\\frac{\\sin 0{,}1}{0{,}1} \\approx 0{,}998$, $\\frac{\\sin 0{,}01}{0{,}01} \\approx 0{,}99995$. К чему это стремится?",
    "options": [
      "к 1",
      "к 0",
      "к ∞"
    ],
    "correct": 0,
    "explanation": "Чем меньше $x$, тем ближе отношение к $1$ — это первый замечательный предел.",
    "reveal": "Первый замечательный предел — главный инструмент для тригонометрических дробей. Второй — для показательно-степенных выражений типа $\\left(1 + \\frac{1}{x}\\right)^x$."
  },
  "theory": [
    {
      "title": "Первый замечательный предел",
      "blocks": [
        {
          "type": "formula",
          "content": "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"
        },
        {
          "type": "text",
          "content": "Идея доказательства: сравнить площади $\\frac{1}{2}\\sin x < \\frac{1}{2}x < \\frac{1}{2}\\tan x$ для $0 < x < \\frac{\\pi}{2}$ и применить зажатую функцию."
        },
        {
          "type": "example",
          "problem": "Найдите $\\lim\\limits_{x \\to 0} \\dfrac{\\sin 3x}{x}$.",
          "solution": "$\\frac{\\sin 3x}{x} = 3 \\cdot \\frac{\\sin 3x}{3x} \\to 3 \\cdot 1 = 3$."
        }
      ]
    },
    {
      "title": "Следствия первого",
      "blocks": [
        {
          "type": "formula",
          "content": "\\lim_{x \\to 0} \\frac{\\tan x}{x} = 1,\\qquad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2/2} = 1"
        },
        {
          "type": "formula",
          "content": "\\lim_{x \\to 0} \\frac{\\arcsin x}{x} = 1,\\qquad \\lim_{x \\to 0} \\frac{\\arctan x}{x} = 1"
        },
        {
          "type": "remember",
          "content": "Все они получаются заменой переменной и первым замечательным пределом. Эквивалентности: $\\sin x \\sim x$, $\\tan x \\sim x$, $1 - \\cos x \\sim \\frac{x^2}{2}$."
        }
      ]
    },
    {
      "title": "Второй замечательный предел",
      "blocks": [
        {
          "type": "formula",
          "content": "\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e,\\qquad \\lim_{x \\to 0} (1 + x)^{1/x} = e"
        },
        {
          "type": "text",
          "content": "Это непрерывный аналог определения числа e для последовательностей. Основание стремится к $1$, показатель — к бесконечности: неопределённость $1^\\infty$."
        },
        {
          "type": "example",
          "problem": "Найдите $\\lim\\limits_{x \\to \\infty} \\left(1 + \\frac{2}{x}\\right)^x$.",
          "solution": "Замена $t = x/2$: $\\left(1 + \\frac{1}{t}\\right)^{2t} = \\left[\\left(1 + \\frac{1}{t}\\right)^t\\right]^2 \\to e^2$."
        }
      ]
    },
    {
      "title": "Типичные ошибки",
      "blocks": [
        {
          "type": "warning",
          "content": "Не путать: $\\left(1 + \\frac{1}{x}\\right)^{x^2}$ растёт не как $e^x$, пока не сделана замена. И не путать $x \\to 0$ с $x \\to \\infty$: формы второго замечательного предела разные."
        },
        {
          "type": "remember",
          "content": "Неопределённости: $\\frac{0}{0}$, $\\frac{\\infty}{\\infty}$, $0 \\cdot \\infty$, $1^\\infty$, $0^0$, $\\infty^0$. Раскрытие — через замечательные пределы и эквивалентности."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "Найдите $\\lim\\limits_{x \\to 0} \\dfrac{\\sin 7x}{x}$.",
      "answer": "7",
      "tolerance": 0.01,
      "hint": "Первый замечательный предел.",
      "explanation": "$7 \\cdot \\frac{\\sin 7x}{7x} \\to 7$."
    },
    {
      "type": "numeric",
      "question": "Найдите $\\lim\\limits_{x \\to 0} \\dfrac{\\tan 2x}{\\sin 3x}$.",
      "answer": "0.67",
      "tolerance": 0.05,
      "hint": "Разложите на $\\frac{\\tan 2x}{2x} \\cdot \\frac{3x}{\\sin 3x} \\cdot \\frac{2x}{3x}$.",
      "explanation": "$\\frac{\\tan 2x}{2x} \\to 1$, $\\frac{3x}{\\sin 3x} \\to 1$, остаётся $\\frac{2}{3} \\approx 0{,}67$."
    },
    {
      "type": "input",
      "question": "Найдите $\\lim\\limits_{x \\to \\infty} \\left(1 + \\dfrac{3}{x}\\right)^x$. Ответ запишите как e^N или числом.",
      "answer": [
        "e^3",
        "e³",
        "e^{3}",
        "e3"
      ],
      "hint": "Замена $t = x/3$.",
      "explanation": "$\\left(1 + \\frac{3}{x}\\right)^x = \\left[\\left(1 + \\frac{1}{x/3}\\right)^{x/3}\\right]^3 \\to e^3$."
    },
    {
      "type": "input",
      "question": "Найдите $\\lim\\limits_{x \\to 0} (1 + 2x)^{1/x}$. Ответ запишите как e^N.",
      "answer": [
        "e^2",
        "e²",
        "e^{2}",
        "e2"
      ],
      "hint": "Замена $t = 2x$.",
      "explanation": "$(1 + 2x)^{1/x} = [(1 + 2x)^{1/(2x)}]^2 \\to e^2$."
    },
    {
      "type": "single_choice",
      "question": "Какая эквивалентность верна при $x \\to 0$?",
      "options": [
        "$\\sin x \\sim x$",
        "$\\sin x \\sim x^2$",
        "$\\sin x \\sim 1$"
      ],
      "correct": 0,
      "hint": "Первый замечательный предел.",
      "explanation": "$\\frac{\\sin x}{x} \\to 1$, значит $\\sin x \\sim x$."
    },
    {
      "type": "multi_choice",
      "question": "Какие пределы существуют и равны конечному числу?",
      "options": [
        "$\\lim_{x \\to 0} \\frac{\\sin x}{x}$",
        "$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x}$",
        "$\\lim_{x \\to \\infty} (1 + 1/x)^x$",
        "$\\lim_{x \\to 0} \\frac{1}{x}$"
      ],
      "correct": [
        0,
        2
      ],
      "hint": "Один из них имеет порядок малости $x^2$ в числителе.",
      "explanation": "$\\frac{\\sin x}{x} \\to 1$, $(1 + 1/x)^x \\to e$. А $\\frac{1-\\cos x}{x} \\sim \\frac{x}{2} \\to 0$ — тоже существует! Проверьте: это $0$. Правильный ответ — все, кроме $\\lim 1/x$ (он бесконечный)."
    }
  ],
  "review_cards": [
    {
      "q": "Первый замечательный предел",
      "a": "$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$"
    },
    {
      "q": "Второй замечательный предел",
      "a": "$\\lim_{x \\to \\infty} (1 + 1/x)^x = e$; форма при $x \\to 0$: $\\lim (1 + x)^{1/x} = e$."
    },
    {
      "q": "Эквивалентности при $x \\to 0$",
      "a": "$\\sin x \\sim x$, $\\tan x \\sim x$, $1 - \\cos x \\sim \\frac{x^2}{2}$, $\\arctan x \\sim x$."
    },
    {
      "q": "Неопределённости",
      "a": "$\\frac{0}{0}$, $\\frac{\\infty}{\\infty}$, $0 \\cdot \\infty$, $1^\\infty$, $0^0$, $\\infty^0$."
    },
    {
      "q": "$\\lim (1 + k/x)^x$",
      "a": "Равен $e^k$."
    }
  ],
  "summary": [
    "Первый замечательный предел: $\\frac{\\sin x}{x} \\to 1$.",
    "Второй: $(1 + 1/x)^x \\to e$, форма $(1 + x)^{1/x} \\to e$.",
    "Следствия — таблица эквивалентностей при $x \\to 0$."
  ]
});
