// Урок: Полином Жегалкина. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-zhegalkin-01",
  "subject": "Дискретная математика",
  "topic": "Минимизация ДНФ",
  "order": 8,
  "title": "Полином Жегалкина",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "Чему равно $a \\oplus a$?",
    "options": [
      "0",
      "a",
      "1"
    ],
    "correct": 0,
    "explanation": "Сложение по модулю 2: одинаковые слагаемые уничтожаются.",
    "reveal": "В базисе Жегалкина всё выражается через $1$, $\\oplus$ и $\\land$. Два одинаковых слагаемых всегда исчезают."
  },
  "theory": [
    {
      "title": "Переход",
      "blocks": [
        {
          "type": "table",
          "title": "Формулы",
          "headers": [
            "Операция",
            "Выражение"
          ],
          "rows": [
            [
              "$a \\lor b$",
              "$a \\oplus b \\oplus ab$"
            ],
            [
              "$\\neg a$",
              "$1 \\oplus a$"
            ],
            [
              "$a \\land b$",
              "$ab$ (без изменений)"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "Переведите $\\bar{a}b$ в Жегалкина.",
          "solution": "$(1 \\oplus a)b = b \\oplus ab$."
        },
        {
          "type": "remember",
          "content": "Операции сложения по модулю 2: $a \\oplus a = 0$, $a \\oplus 0 = a$, $a \\oplus 1 = \\bar{a}$."
        }
      ]
    },
    {
      "title": "Полином",
      "blocks": [
        {
          "type": "formula",
          "content": "f = C_0 \\oplus C_1 x \\oplus C_2 y \\oplus C_3 xy \\oplus \\ldots, \\quad C_i \\in \\{0,1\\}"
        },
        {
          "type": "text",
          "content": "Коэффициент $C_i$ стоит при одночлене, номер которого в двоичной записи указывает, какие переменные входят. Например, $C_6$ при переменных $(x, y, z)$ — это $6 = 110_2$, то есть $xy$."
        },
        {
          "type": "example",
          "problem": "$f = x \\lor y$. Найдите полином.",
          "solution": "$x \\oplus y \\oplus xy$."
        },
        {
          "type": "warning",
          "content": "Одночлены в полиноме Жегалкина не повторяются: одинаковые складываются в ноль."
        }
      ]
    },
    {
      "title": "Треугольник Паскаля",
      "blocks": [
        {
          "type": "text",
          "content": "Берём значения функции из таблицы истинности и последовательно складываем соседние по Жегалкbну. Верхняя строка даёт коэффициенты $C_i$."
        },
        {
          "type": "example",
          "problem": "$f = (0,1,1,0)$ для $(x,y)$.",
          "solution": "Первый шаг: $0\\oplus1=1$, $1\\oplus1=0$, $1\\oplus0=1$. Второй: $1\\oplus0=1$, $0\\oplus1=1$. Третий: $1\\oplus1=0$. Коэффициенты $C_0=0$, $C_1=1$, $C_2=1$, $C_3=0$, то есть $x \\oplus y$."
        },
        {
          "type": "remember",
          "content": "Число строк треугольника равно числу наборов. Верхнее единственное значение — старший коэффициент."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "$a \\oplus a$ равно:",
      "options": [
        "0",
        "a",
        "1"
      ],
      "correct": 0,
      "hint": "Одинаковые уничтожаются.",
      "explanation": "$0$."
    },
    {
      "type": "single_choice",
      "question": "$a \\lor b$ в базисе Жегалкина:",
      "options": [
        "$a \\oplus b \\oplus ab$",
        "$a \\oplus b$",
        "$ab$"
      ],
      "correct": 0,
      "hint": "Проверьте на $a=b=1$.",
      "explanation": "$1 \\oplus 1 \\oplus 1 = 1$."
    },
    {
      "type": "single_choice",
      "question": "$\\neg a$ в базисе Жегалкина:",
      "options": [
        "$1 \\oplus a$",
        "$1 \\oplus a \\oplus a$",
        "$a$"
      ],
      "correct": 0,
      "hint": "Проверьте на $a=1$.",
      "explanation": "$1 \\oplus a$."
    },
    {
      "type": "numeric",
      "question": "$C_5$ для переменных $(x, y, z)$. Скольким переменным соответствует одночлен?",
      "answer": "2",
      "tolerance": 0.01,
      "hint": "$5 = 101_2$.",
      "explanation": "Две единицы в записи — две переменные."
    },
    {
      "type": "true_false",
      "question": "Полином Жегалкина для функции единственен.",
      "correct": true,
      "hint": "Другое название — алгебраическая нормальная форма.",
      "explanation": "Верно."
    },
    {
      "type": "multi_choice",
      "question": "Какие формулы верны?",
      "options": [
        "$a \\oplus a = 0$",
        "$\\neg a = 1 \\oplus a$",
        "$a \\lor b = a \\oplus b \\oplus ab$",
        "$ab = a \\oplus b$"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Проверьте последнее на $a=b=1$.",
      "explanation": "$1 \\oplus 1 = 0$, а $1 \\cdot 1 = 1$."
    }
  ],
  "review_cards": [
    {
      "q": "Дизъюнкция через Жегалкина",
      "a": "$a \\lor b = a \\oplus b \\oplus ab$"
    },
    {
      "q": "Отрицание через Жегалкина",
      "a": "$\\neg a = 1 \\oplus a$"
    },
    {
      "q": "Свойства $\\\\oplus$",
      "a": "$a \\oplus a = 0$, $a \\oplus 0 = a$"
    },
    {
      "q": "Треугольник Паскаля",
      "a": "Соседние значения складываются по $\\\\oplus$."
    }
  ],
  "summary": [
    "Жегалкин — арифметика по модулю 2.",
    "Два одинаковых слагаемых исчезают.",
    "Полином единственен."
  ]
});
