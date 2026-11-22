// Урок: Булевы функции и базисы. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-bool-01",
  "subject": "Дискретная математика",
  "topic": "Булевы функции",
  "order": 5,
  "title": "Булевы функции и базисы",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "Сколько всего булевых функций от двух переменных?",
    "options": [
      "16",
      "8",
      "4"
    ],
    "correct": 0,
    "explanation": "В таблице истинности $4$ строки, каждая даёт $2$ варианта: $2^4 = 16$.",
    "reveal": "Любую булеву функцию можно выразить через маленький набор операций — это и называют базисом."
  },
  "theory": [
    {
      "title": "Основные связки",
      "blocks": [
        {
          "type": "table",
          "title": "ОБО",
          "headers": [
            "Операция",
            "Запись",
            "Истинна когда"
          ],
          "rows": [
            [
              "Отрицание",
              "$\\neg a$",
              "a ложно"
            ],
            [
              "Конъюнкция",
              "$a \\land b$",
              "оба истинны"
            ],
            [
              "Дизъюнкция",
              "$a \\lor b$",
              "хотя бы один"
            ],
            [
              "Импликация",
              "$a \\to b$",
              "a ложно или b истинно"
            ],
            [
              "Эквивалентность",
              "$a \\equiv b$",
              "значения совпадают"
            ],
            [
              "Сложение",
              "$a \\oplus b$",
              "значения различны"
            ],
            [
              "Штрих Шеффера",
              "$a \\uparrow b$",
              "$\\neg(a \\land b)$"
            ],
            [
              "Стрелка Пирса",
              "$a \\downarrow b$",
              "$\\neg(a \\lor b)$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$a = 0$, $b = 1$. Чему равны $a \\to b$ и $a \\equiv b$?",
          "solution": "$0 \\to 1 = 1$, $0 \\equiv 1 = 0$."
        },
        {
          "type": "warning",
          "content": "Импликация ложна только в одном случае: $1 \\to 0$. Это самая частая ошибка."
        }
      ]
    },
    {
      "title": "Двойственность",
      "blocks": [
        {
          "type": "text",
          "content": "Двойственная функция получается заменой $\\land \\leftrightarrow \\lor$ и $0 \\leftrightarrow 1$. Переменные не меняются."
        },
        {
          "type": "example",
          "problem": "$f = ab + bc + cd$. Найдите двойственную.",
          "solution": "$f^* = (a+b)(b+c)(c+d)$."
        },
        {
          "type": "formula",
          "content": "f^*(x_1,\\ldots,x_n) = \\neg f(\\neg x_1, \\ldots, \\neg x_n)"
        },
        {
          "type": "remember",
          "content": "Функция называется самодвойственной, если $f^* = f$."
        }
      ]
    },
    {
      "title": "Базисы",
      "blocks": [
        {
          "type": "table",
          "title": "Переход в базис",
          "headers": [
            "Базис",
            "Как выразить",
            "Запись"
          ],
          "rows": [
            [
              "Жегалкин",
              "$a \\lor b = a \\oplus b \\oplus ab$",
              "$\\{1, \\oplus, \\land\\}$"
            ],
            [
              "Шеффер",
              "$\\neg a = a \\uparrow a$",
              "$\\{\\uparrow\\}$"
            ],
            [
              "Пирс",
              "$\\neg a = a \\downarrow a$",
              "$\\{\\downarrow\\}$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$a \\land b$ через Шеффера.",
          "solution": "$a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b)$."
        },
        {
          "type": "remember",
          "content": "Шеффер и Пирс — универсальные базисы: одного элемента достаточно, чтобы выразить всё."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "Сколько булевых функций от трёх переменных?",
      "answer": "256",
      "tolerance": 0.01,
      "hint": "$2^8$.",
      "explanation": "$2^{(2^3)} = 256$."
    },
    {
      "type": "single_choice",
      "question": "Когда $a \\to b$ ложно?",
      "options": [
        "$a=1, b=0$",
        "$a=0, b=1$",
        "$a=1, b=1$"
      ],
      "correct": 0,
      "hint": "Единственный случай.",
      "explanation": "Только $1 \\to 0$."
    },
    {
      "type": "single_choice",
      "question": "$a \\uparrow b$ равно:",
      "options": [
        "$\\neg(a \\land b)$",
        "$\\neg(a \\lor b)$",
        "$a \\lor b$"
      ],
      "correct": 0,
      "hint": "Штрих Шеффера.",
      "explanation": "$\\neg(a \\land b)$."
    },
    {
      "type": "single_choice",
      "question": "$a \\downarrow b$ равно:",
      "options": [
        "$\\neg(a \\lor b)$",
        "$\\neg(a \\land b)$",
        "$a \\land b$"
      ],
      "correct": 0,
      "hint": "Стрелка Пирса.",
      "explanation": "$\\neg(a \\lor b)$."
    },
    {
      "type": "numeric",
      "question": "Сколько строк в таблице истинности функции от $4$ переменных?",
      "answer": "16",
      "tolerance": 0.01,
      "hint": "$2^4$.",
      "explanation": "$16$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно про базисы?",
      "options": [
        "Шеффер — универсальный",
        "Пирс — универсальный",
        "Жегалкин использует $\\\\oplus$",
        "Импликация — единственный элемент базиса"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Одна импликация всё не выразит.",
      "explanation": "Одной импликации недостаточно."
    }
  ],
  "review_cards": [
    {
      "q": "Когда импликация ложна",
      "a": "Только при $1 \\to 0$."
    },
    {
      "q": "Штрих Шеффера",
      "a": "$\\neg(a \\land b)$"
    },
    {
      "q": "Стрелка Пирса",
      "a": "$\\neg(a \\lor b)$"
    },
    {
      "q": "Двойственная функция",
      "a": "$\\land \\leftrightarrow \\lor$, $0 \\leftrightarrow 1$."
    }
  ],
  "summary": [
    "Импликация ложна только при $1 \\to 0$.",
    "Шеффер и Пирс — базисы из одного элемента.",
    "Двойственность меняет $\\land$ и $\\lor$, но не переменные."
  ]
});
