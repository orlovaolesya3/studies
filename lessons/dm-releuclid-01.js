// Урок: Евклидовость, связанность, композиция. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-releuclid-01",
  "subject": "Дискретная математика",
  "topic": "Отношения",
  "order": 4,
  "title": "Евклидовость, связанность, композиция",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "$R = \\{(1,2)\\}$, $S = \\{(2,3)\\}$. Что входит в $S \\circ R$?",
    "options": [
      "$\\{(1,3)\\}$",
      "$\\{(2,2)\\}$",
      "$\\emptyset$"
    ],
    "correct": 0,
    "hint": "Путь $1 \\to 2 \\to 3$.",
    "explanation": "Есть промежуточный $2$, поэтому пара $(1,3)$ входит в композицию.",
    "reveal": "Композиция — это путь через промежуточное множество. Матрично она считается булевым умножением."
  },
  "theory": [
    {
      "title": "Евклидовость и связанность",
      "blocks": [
        {
          "type": "table",
          "title": "Редкие свойства",
          "headers": [
            "Свойство",
            "Формула"
          ],
          "rows": [
            [
              "Правоевклидовость",
              "$xRy \\land xRz \\Rightarrow yRz$"
            ],
            [
              "Левоевклидовость",
              "$yRx \\land zRx \\Rightarrow yRz$"
            ],
            [
              "Слабая связанность",
              "$x \\ne y \\Rightarrow xRy \\lor yRx$"
            ],
            [
              "Сильная связанность",
              "$xRy \\lor yRx$ (для всех $x,y$)"
            ],
            [
              "Серийность",
              "$\\forall x \\exists y\\ xRy$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "Отношение $\\le$ на числах: сильно связано?",
          "solution": "Да: для любых $x, y$ верно либо $x \\le y$, либо $y \\le x$."
        },
        {
          "type": "remember",
          "content": "Серийность — у каждого есть пара. Тотальность справа — у каждого элемента $B$ есть прообраз."
        }
      ]
    },
    {
      "title": "Композиция",
      "blocks": [
        {
          "type": "formula",
          "content": "S \\circ R = \\{(a,c) \\mid \\exists b: aRb \\land bSc\\}"
        },
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 150'><circle cx='50' cy='75' r='18' fill='none' stroke='#6366f1' stroke-width='2'/><circle cx='150' cy='75' r='18' fill='none' stroke='#6366f1' stroke-width='2'/><circle cx='250' cy='75' r='18' fill='none' stroke='#6366f1' stroke-width='2'/><text class='fg-label' x='47' y='80'>a</text><text class='fg-label' x='147' y='80'>b</text><text class='fg-label' x='247' y='80'>c</text><path class='fg-line' d='M68 75 L132 75' marker-end='url(#c)'/><path class='fg-line' d='M168 75 L232 75' marker-end='url(#c)'/><path class='fg-dash' d='M50 57 C 110 10 190 10 250 57'/><defs><marker id='c' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='#6366f1'/></marker></defs><text class='fg-note' x='95' y='140'>S ∘ R — путь через b</text></svg>",
          "caption": "Результат композиции — пара «начало → конец» без записи промежуточных вершин."
        },
        {
          "type": "formula",
          "content": "M_{S \\circ R} = M_R \\odot M_S,\\quad (x \\land y) \\text{ вместо умножения},\\ \\lor \\text{ вместо сложения}"
        }
      ]
    },
    {
      "title": "Свойства композиции",
      "blocks": [
        {
          "type": "table",
          "title": "Что работает",
          "headers": [
            "Свойство",
            "Запись"
          ],
          "rows": [
            [
              "Ассоциативность",
              "$T \\circ (S \\circ R) = (T \\circ S) \\circ R$"
            ],
            [
              "Единица",
              "$\\Delta_B \\circ R = R$"
            ],
            [
              "Обращение",
              "$(S \\circ R)^{-1} = R^{-1} \\circ S^{-1}$"
            ],
            [
              "Коммутативность",
              "НЕ выполняется"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$P = \\{(1,2)\\}$, $Q = \\{(2,3)\\}$. Сравните $Q \\circ P$ и $P \\circ Q$.",
          "solution": "$Q \\circ P = \\{(1,3)\\}$, а $P \\circ Q = \\emptyset$ — композиция некоммутативна."
        },
        {
          "type": "warning",
          "content": "Порядок в $(S \\circ R)^{-1}$ переворачивается: сначала $R^{-1}$, затем $S^{-1}$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "$R = \\{(1,2),(2,3)\\}$. Что входит в $R^2 = R \\circ R$?",
      "options": [
        "$\\{(1,3)\\}$",
        "$\\{(2,3)\\}$",
        "$\\emptyset$"
      ],
      "correct": 0,
      "hint": "Путь $1 \to 2 \to 3$.",
      "explanation": "$\\{(1,3)\\}$."
    },
    {
      "type": "true_false",
      "question": "Композиция отношений коммутативна.",
      "correct": false,
      "hint": "Порядок важен.",
      "explanation": "Неверно."
    },
    {
      "type": "single_choice",
      "question": "$(S \\circ R)^{-1}$ равно:",
      "options": [
        "$R^{-1} \\circ S^{-1}$",
        "$S^{-1} \\circ R^{-1}$",
        "$S \\circ R$"
      ],
      "correct": 0,
      "hint": "Порядок переворачивается.",
      "explanation": "$R^{-1} \\circ S^{-1}$."
    },
    {
      "type": "numeric",
      "question": "$R$ на $A$ содержит $6$ пар, $S$ — $5$ пар. Сколько столбцов у $M_S$?",
      "answer": "3",
      "tolerance": 0.01,
      "hint": "Столбцы — концы пар, $|A| = 3$ для $6$ пар? Возьмите $|A| = 3$.",
      "explanation": "Матрица квадратная $3 \\times 3$, значит $3$ столбца."
    },
    {
      "type": "multi_choice",
      "question": "Какие утверждения верны?",
      "options": [
        "Композиция ассоциативна",
        "$\\Delta$ — единица по композиции",
        "$(S \\circ R)^{-1} = R^{-1} \\circ S^{-1}$",
        "Композиция коммутативна"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Одно утверждение ложно.",
      "explanation": "Композиция некоммутативна."
    },
    {
      "type": "input",
      "question": "Как называется операция над матрицами, соответствующая композиции отношений? (два слова через пробел)",
      "answer": [
        "булево умножение",
        "булево произведение",
        "булевое умножение"
      ],
      "hint": "Использует $\\\\land$ и $\\\\lor$.",
      "explanation": "Булево умножение."
    }
  ],
  "review_cards": [
    {
      "q": "Композиция отношений",
      "a": "$S \\circ R = \\{(a,c) \\mid \\exists b: aRb, bSc\\}$"
    },
    {
      "q": "Матрица композиции",
      "a": "Булево произведение $M_R \\odot M_S$."
    },
    {
      "q": "Обращение композиции",
      "a": "$(S \\circ R)^{-1} = R^{-1} \\circ S^{-1}$"
    },
    {
      "q": "Серийность",
      "a": "$\\forall x \\exists y\\ xRy$"
    }
  ],
  "summary": [
    "Композиция — путь через посредника.",
    "Матрично это булево умножение.",
    "Порядок множителей менять нельзя."
  ]
});
