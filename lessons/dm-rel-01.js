// Урок: Бинарные отношения: область, образ, обращение. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-rel-01",
  "subject": "Дискретная математика",
  "topic": "Отношения",
  "order": 2,
  "title": "Бинарные отношения: область, образ, обращение",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "$A = \\{1,2,3\\}$, $B = \\{a,b,c\\}$, $R = \\{(1,a),(2,a),(2,b)\\}$. Чему равно $\\text{dom}\\,R$?",
    "options": [
      "$\\{1,2\\}$",
      "$\\{a,b\\}$",
      "$\\{1,2,3\\}$"
    ],
    "correct": 0,
    "explanation": "$3$ не участвует в парах, поэтому в область определения не входит.",
    "reveal": "Отношение — подмножество декартова произведения. Носитель задан отдельно, а область определения может быть меньше."
  },
  "theory": [
    {
      "title": "Определение",
      "blocks": [
        {
          "type": "formula",
          "content": "R \\subseteq A \\times B"
        },
        {
          "type": "text",
          "content": "Запись $aRb$ означает $(a,b) \\in R$. Носитель $A$ — все элементы, на которых отношение рассматривается, даже если они не входят в пары."
        },
        {
          "type": "example",
          "problem": "$R = \\{(1,1),(1,2),(2,3)\\}$ на $A = \\{1,2,3\\}$. Что входит в отношение?",
          "solution": "Пары $1R1$, $1R2$, $2R3$; пара $(1,3)$ не входит."
        },
        {
          "type": "remember",
          "content": "Диагональное отношение $\\Delta_A = \\{(a,a)\\}$; пустое $\\emptyset$; универсальное $A \\times A$."
        }
      ]
    },
    {
      "title": "Область и образ",
      "blocks": [
        {
          "type": "formula",
          "content": "\\text{dom}\\,R = \\{a \\in A \\mid \\exists b\\, aRb\\},\\quad \\text{Im}\\,R = \\{b \\in B \\mid \\exists a\\, aRb\\}"
        },
        {
          "type": "example",
          "problem": "Для $R = \\{(1,a),(2,a),(2,b)\\}$ найти $\\text{dom}$ и $\\text{Im}$.",
          "solution": "$\\text{dom}\\,R = \\{1,2\\}$, $\\text{Im}\\,R = \\{a,b\\}$."
        },
        {
          "type": "formula",
          "content": "R[X] = \\{b \\in B \\mid \\exists a \\in X\\ aRb\\}"
        }
      ]
    },
    {
      "title": "Граф и матрица",
      "blocks": [
        {
          "type": "figure",
          "svg": "<svg viewBox='0 0 300 170'><circle class='fg-point' cx='70' cy='60' r='16' fill='none' stroke='#6366f1' stroke-width='2'/><circle class='fg-point' cx='160' cy='60' r='16' fill='none' stroke='#6366f1' stroke-width='2'/><circle class='fg-point' cx='250' cy='60' r='16' fill='none' stroke='#6366f1' stroke-width='2'/><text class='fg-label' x='67' y='65'>1</text><text class='fg-label' x='157' y='65'>2</text><text class='fg-label' x='247' y='65'>3</text><path class='fg-line' d='M86 60 L144 60' marker-end='url(#a)'/><path class='fg-line' d='M176 60 L234 60' marker-end='url(#a)'/><path class='fg-curve' d='M70 44 C 70 10 90 10 90 44' stroke='#6366f1' fill='none'/><defs><marker id='a' markerWidth='9' markerHeight='9' refX='7' refY='4.5' orient='auto'><path d='M0,0 L9,4.5 L0,9 z' fill='#6366f1'/></marker></defs><text class='fg-note' x='70' y='120'>R = {(1,1),(1,2),(2,3)}</text></svg>",
          "caption": "Петля означает пару $(a,a)$."
        },
        {
          "type": "text",
          "content": "Матрица смежности: $(M_R)_{ij} = 1$, если $a_i R a_j$. Строка — начало стрелки, столбец — конец."
        },
        {
          "type": "remember",
          "content": "У обратного отношения матрица транспонируется: $M_{R^{-1}} = M_R^{T}$."
        }
      ]
    },
    {
      "title": "Обращение",
      "blocks": [
        {
          "type": "formula",
          "content": "R^{-1} = \\{(b,a) \\mid (a,b) \\in R\\}"
        },
        {
          "type": "example",
          "problem": "$R = \\{(1,a),(2,b)\\}$. Найдите $R^{-1}$.",
          "solution": "$\\{(a,1),(b,2)\\}$, причём $\\text{dom}\\,R^{-1} = \\text{Im}\\,R$."
        },
        {
          "type": "warning",
          "content": "$(R^{-1})^{-1} = R$: двойное обращение возвращает исходное."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "numeric",
      "question": "$A = \\{1,2,3\\}$. Сколько пар в $A \\times A$?",
      "answer": "9",
      "tolerance": 0.01,
      "hint": "$|A|^2$.",
      "explanation": "$3^2 = 9$."
    },
    {
      "type": "single_choice",
      "question": "$R = \\{(1,2)\\}$. Чему равно $R^{-1}$?",
      "options": [
        "$\\{(2,1)\\}$",
        "$\\{(1,2)\\}$",
        "$\\emptyset$"
      ],
      "correct": 0,
      "hint": "Меняем местами.",
      "explanation": "$\\{(2,1)\\}$."
    },
    {
      "type": "single_choice",
      "question": "Какое отношение всегда содержит все пары?",
      "options": [
        "$A \\times A$",
        "$\\Delta_A$",
        "$\\emptyset$"
      ],
      "correct": 0,
      "hint": "Универсальное.",
      "explanation": "$A \\times A$."
    },
    {
      "type": "numeric",
      "question": "$R = \\{(1,1),(1,2),(2,3)\\}$ на $A=\\{1,2,3\\}$. Найдите $|\\text{Im}\\,R|$.",
      "answer": "3",
      "tolerance": 0.01,
      "hint": "Вторые компоненты.",
      "explanation": "$\\{1,2,3\\}$ — три элемента."
    },
    {
      "type": "true_false",
      "question": "$\\text{dom}\\,R^{-1} = \\text{Im}\\,R$.",
      "correct": true,
      "hint": "Обращение меняет роли.",
      "explanation": "Верно."
    },
    {
      "type": "multi_choice",
      "question": "Что задаёт бинарное отношение на конечном носителе?",
      "options": [
        "Множество пар",
        "Ориентированный граф",
        "Булева матрица",
        "Одна вершина"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Три эквивалентных способа.",
      "explanation": "Одна вершина ничего не задаёт."
    }
  ],
  "review_cards": [
    {
      "q": "Что такое бинарное отношение",
      "a": "Подмножество $A \\times B$."
    },
    {
      "q": "Область определения",
      "a": "Все $a$, для которых есть пара."
    },
    {
      "q": "Обратное отношение",
      "a": "Меняем компоненты пары местами."
    },
    {
      "q": "Матрица обратного",
      "a": "Транспонированная матрица."
    }
  ],
  "summary": [
    "Отношение — множество пар.",
    "Носитель шире области определения.",
    "Три представления: пары, граф, матрица."
  ]
});
