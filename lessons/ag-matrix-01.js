// Урок: Матрицы: операции и транспонирование. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "ag-matrix-01",
  "subject": "Аналитическая геометрия",
  "topic": "Матрицы",
  "order": 20,
  "title": "Матрицы: операции и транспонирование",
  "est_minutes": 8,
  "hook": {
    "type": "single_choice",
    "question": "Можно ли перемножить матрицы $2\\times3$ и $3\\times4$?",
    "options": [
      "да, получится $2\\times4$",
      "нет",
      "да, получится $3\\times3$"
    ],
    "correct": 0,
    "explanation": "Число столбцов первой (3) равно числу строк второй (3). Результат — $2 \\times 4$.",
    "reveal": "Умножение матриц требует согласованности размеров и не коммутативно — это главное отличие от чисел."
  },
  "theory": [
    {
      "title": "Сложение и умножение на число",
      "blocks": [
        {
          "type": "text",
          "content": "Складывать можно только матрицы одинакового размера — поэлементно. Умножение на число тоже поэлементное."
        },
        {
          "type": "example",
          "problem": "$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $B = \\begin{pmatrix} 0 & 5 \\\\ 1 & 1 \\end{pmatrix}$. Найдите $A + B$ и $2A$.",
          "solution": "$A+B = \\begin{pmatrix} 1 & 7 \\\\ 4 & 5 \\end{pmatrix}$, $2A = \\begin{pmatrix} 2 & 4 \\\\ 6 & 8 \\end{pmatrix}$."
        },
        {
          "type": "remember",
          "content": "Сложение коммутативно и ассоциативно, как у чисел. Умножение — нет."
        }
      ]
    },
    {
      "title": "Умножение матриц",
      "blocks": [
        {
          "type": "formula",
          "content": "c_{ij} = \\sum_k a_{ik}b_{kj}"
        },
        {
          "type": "table",
          "title": "Размеры",
          "headers": [
            "Матрицы",
            "Результат"
          ],
          "rows": [
            [
              "$m\\times n$ и $n\\times p$",
              "$m \\times p$"
            ],
            [
              "$2\\times3$ и $3\\times2$",
              "$2\\times2$"
            ],
            [
              "$2\\times3$ и $2\\times3$",
              "нельзя"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$, $B = \\begin{pmatrix} 1 & 0 \\\\ 3 & 1 \\end{pmatrix}$. $AB$?",
          "solution": "$c_{11} = 1\\cdot1 + 2\\cdot3 = 7$, $c_{12} = 1\\cdot0 + 2\\cdot1 = 2$, $c_{21} = 3$, $c_{22} = 1$. Итого $\\begin{pmatrix} 7 & 2 \\\\ 3 & 1 \\end{pmatrix}$."
        },
        {
          "type": "warning",
          "content": "$AB \\ne BA$ в общем случае. Порядок множителей важен."
        }
      ]
    },
    {
      "title": "Транспонирование",
      "blocks": [
        {
          "type": "text",
          "content": "Транспонирование — замена строк столбцами. Размер $m\\times n$ превращается в $n\\times m$."
        },
        {
          "type": "formula",
          "content": "(AB)^T = B^T A^T"
        },
        {
          "type": "table",
          "title": "Виды матриц",
          "headers": [
            "Тип",
            "Условие"
          ],
          "rows": [
            [
              "Симметричная",
              "$A^T = A$"
            ],
            [
              "Кососимметричная",
              "$A^T = -A$"
            ],
            [
              "Диагональная",
              "вне главной диагонали нули"
            ],
            [
              "Единичная",
              "$AI = IA = A$"
            ]
          ]
        },
        {
          "type": "remember",
          "content": "У кососимметричной матрицы на главной диагонали всегда нули — из $a_{ii} = -a_{ii}$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$A$ размера $2\\times3$, $B$ размера $3\\times5$. Сколько столбцов у $AB$?",
      "answer": "5",
      "tolerance": 0.01,
      "hint": "Берём от второй матрицы.",
      "explanation": "$5$."
    },
    {
      "type": "single_choice",
      "question": "Всегда ли $AB = BA$?",
      "options": [
        "нет",
        "да",
        "только для квадратных"
      ],
      "correct": 0,
      "hint": "Порядок важен.",
      "explanation": "В общем случае не равны."
    },
    {
      "type": "numeric",
      "question": "Матрица $3\\times4$ транспонирована. Сколько строк?",
      "answer": "4",
      "tolerance": 0.01,
      "hint": "Строки и столбцы меняются.",
      "explanation": "$4$."
    },
    {
      "type": "true_false",
      "question": "У кососимметричной матрицы диагональ нулевая.",
      "correct": true,
      "hint": "$a_{ii} = -a_{ii}$.",
      "explanation": "Верно."
    },
    {
      "type": "single_choice",
      "question": "$(AB)^T$ равно:",
      "options": [
        "$B^T A^T$",
        "$A^T B^T$",
        "$AB$"
      ],
      "correct": 0,
      "hint": "Порядок переворачивается.",
      "explanation": "$B^T A^T$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно?",
      "options": [
        "$(A+B)^T = A^T + B^T$",
        "$(A^T)^T = A$",
        "$(AB)^T = A^T B^T$",
        "Сложение матриц коммутативно"
      ],
      "correct": [
        0,
        1,
        3
      ],
      "hint": "Порядок в транспонировании произведения.",
      "explanation": "$(AB)^T = B^T A^T$."
    }
  ],
  "review_cards": [
    {
      "q": "Условие перемножения",
      "a": "Столбцов первой = строк второй."
    },
    {
      "q": "Транспонирование произведения",
      "a": "$(AB)^T = B^T A^T$"
    },
    {
      "q": "Симметричная матрица",
      "a": "$A^T = A$"
    },
    {
      "q": "Кососимметричная",
      "a": "$A^T = -A$; диагональ нулевая."
    }
  ],
  "summary": [
    "Размер результата — $m \\times p$.",
    "Умножение не коммутативно.",
    "Транспонирование переворачивает порядок."
  ]
});
