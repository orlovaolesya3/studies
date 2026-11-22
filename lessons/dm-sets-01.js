// Урок: Множества, мощность и операции. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-sets-01",
  "subject": "Дискретная математика",
  "topic": "Множества",
  "order": 1,
  "title": "Множества, мощность и операции",
  "est_minutes": 8,
  "hook": {
    "type": "single_choice",
    "question": "Сколько элементов у множества $\\{1, 2, 3, 2, 1\\}$?",
    "options": [
      "3",
      "5",
      "2"
    ],
    "correct": 0,
    "explanation": "Повторения не создают новых элементов: $\\{1,2,3,2,1\\} = \\{1,2,3\\}$.",
    "reveal": "Множество не хранит порядок и не считает повторы. Отсюда все его отличия от списка."
  },
  "theory": [
    {
      "title": "Определение и запись",
      "blocks": [
        {
          "type": "text",
          "content": "Множество задаётся перечислением $A = \\{1,2,3\\}$ или условием $A = \\{x \\in M \\mid P(x)\\}$. Запись $a \\in A$ означает принадлежность, $a \\notin A$ — отрицание."
        },
        {
          "type": "formula",
          "content": "\\{1,2,3\\} = \\{3,1,2,1\\}"
        },
        {
          "type": "example",
          "problem": "$\\{x \\in \\mathbb{Z} \\mid x^2 < 5\\} = ?$",
          "solution": "$\\{-2,-1,0,1,2\\}$."
        },
        {
          "type": "warning",
          "content": "Принадлежность и включение — разное: $1 \\in \\{1,2\\}$ верно, $\\{1\\} \\in \\{1,2\\}$ неверно, а $\\{1\\} \\subseteq \\{1,2\\}$ верно."
        }
      ]
    },
    {
      "title": "Мощность и равенство",
      "blocks": [
        {
          "type": "text",
          "content": "Мощность $|A|$ — число элементов конечного множества. Множества равны, если у них одни и те же элементы (принцип объёмности)."
        },
        {
          "type": "formula",
          "content": "A = B \\iff \\forall x\\,(x \\in A \\leftrightarrow x \\in B)"
        },
        {
          "type": "example",
          "problem": "Мощности $\\emptyset$, $\\{\\emptyset\\}$, $\\{\\emptyset, \\{\\emptyset\\}\\}$?",
          "solution": "$0$, $1$, $2$. В третьем элементами служат $\\emptyset$ и $\\{\\emptyset\\}$."
        },
        {
          "type": "remember",
          "content": "$\\emptyset \\subseteq A$ и $A \\subseteq A$ верны всегда. Первое — потому что посылка $x \\in \\emptyset$ ложна."
        }
      ]
    },
    {
      "title": "Операции",
      "blocks": [
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 170'><rect x='8' y='8' width='284' height='154' rx='8' fill='none' stroke='#cbd5e1'/><circle cx='120' cy='88' r='56' fill='#6366f1' fill-opacity='0.16' stroke='#6366f1'/><circle cx='190' cy='88' r='56' fill='#a855f7' fill-opacity='0.16' stroke='#a855f7'/><text class='fg-label' x='72' y='92'>A</text><text class='fg-label' x='228' y='92'>B</text><text class='fg-note' x='14' y='26'>U</text></svg>",
          "caption": "Пересечение — общая часть, объединение — вся закрашенная область."
        },
        {
          "type": "table",
          "title": "Операции",
          "headers": [
            "Операция",
            "Запись",
            "Смысл"
          ],
          "rows": [
            [
              "Объединение",
              "$A \\cup B$",
              "$x \\in A \\lor x \\in B$"
            ],
            [
              "Пересечение",
              "$A \\cap B$",
              "$x \\in A \\land x \\in B$"
            ],
            [
              "Разность",
              "$A \\setminus B$",
              "$x \\in A \\land x \\notin B$"
            ],
            [
              "Дополнение",
              "$\\overline{A} = U \\setminus A$",
              "вне $A$ внутри универсума"
            ],
            [
              "Симметрическая",
              "$A \\triangle B$",
              "ровно в одном из двух"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$U = \\{1,..,8\\}$, $A = \\{1,2,3,5\\}$, $B = \\{2,4,5,6\\}$, $C = \\{1,5,6,7\\}$. Найдите $(A \\cup B) \\setminus C$.",
          "solution": "$A \\cup B = \\{1,2,3,4,5,6\\}$, убираем $1,5,6$: получаем $\\{2,3,4\\}$."
        }
      ]
    },
    {
      "title": "Ловушки",
      "blocks": [
        {
          "type": "warning",
          "content": "Разность НЕ ассоциативна. Для тех же множеств $(A \\setminus B) \\setminus C = \\{3\\}$, а $A \\setminus (B \\setminus C) = \\{1,3,5\\}$."
        },
        {
          "type": "example",
          "problem": "Верно ли $A \\setminus B = B \\setminus A$?",
          "solution": "Нет: у первого элементы только из $A$, у второго — только из $B$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$|\\{1, 2, 3, 2, 1\\}| = ?$",
      "answer": "3",
      "tolerance": 0.01,
      "hint": "Повторы не считаются.",
      "explanation": "$\\{1,2,3\\}$, значит $3$."
    },
    {
      "type": "single_choice",
      "question": "$A = \\{1,2\\}$, $B = \\{2,3\\}$. Найдите $A \\cap B$.",
      "options": [
        "$\\{2\\}$",
        "$\\{1,2,3\\}$",
        "$\\{1,3\\}$"
      ],
      "correct": 0,
      "hint": "Общие элементы.",
      "explanation": "Общий только $2$."
    },
    {
      "type": "single_choice",
      "question": "Верно ли $\\{1\\} \\in \\{1,2\\}$?",
      "options": [
        "нет",
        "да",
        "нельзя определить"
      ],
      "correct": 0,
      "hint": "Элементы — числа, а не множества.",
      "explanation": "Нет. Верно $\\{1\\} \\subseteq \\{1,2\\}$."
    },
    {
      "type": "numeric",
      "question": "$A = \\{1,2,3\\}$, $B = \\{3,4\\}$. Найдите $|A \\cup B|$.",
      "answer": "4",
      "tolerance": 0.01,
      "hint": "$\\{1,2,3,4\\}$.",
      "explanation": "$4$."
    },
    {
      "type": "numeric",
      "question": "$A = \\{1,2,3\\}$, $B = \\{2,3\\}$. Найдите $|A \\setminus B|$.",
      "answer": "1",
      "tolerance": 0.01,
      "hint": "Остаётся $1$.",
      "explanation": "$|\\{1\\}| = 1$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно всегда?",
      "options": [
        "$\\emptyset \\subseteq A$",
        "$A \\subseteq A$",
        "$A \\setminus B = B \\setminus A$",
        "$A \\cap A = A$"
      ],
      "correct": [
        0,
        1,
        3
      ],
      "hint": "Разность несимметрична.",
      "explanation": "Разность не симметрична."
    }
  ],
  "review_cards": [
    {
      "q": "Что такое мощность",
      "a": "Число элементов конечного множества."
    },
    {
      "q": "Когда множества равны",
      "a": "Когда у них одни и те же элементы."
    },
    {
      "q": "Чем принадлежность отличается от включения",
      "a": "$a \\in A$ — элемент, $B \\subseteq A$ — множество внутри множества."
    },
    {
      "q": "Почему $\\emptyset \\subseteq A$",
      "a": "Посылка $x \\in \\emptyset$ всегда ложна."
    }
  ],
  "summary": [
    "Множество не упорядочено и не считает повторы.",
    "Равенство — через вхождение элементов.",
    "Разность не ассоциативна — скобки важны."
  ]
});
