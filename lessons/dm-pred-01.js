// Урок: Предикаты, кванторы, свободные переменные. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-pred-01",
  "subject": "Дискретная математика",
  "topic": "Логика предикатов",
  "order": 10,
  "title": "Предикаты, кванторы, свободные переменные",
  "est_minutes": 9,
  "hook": {
    "type": "single_choice",
    "question": "$H(x)$ — «$x$ человек». Как записать «все люди смертны», если $M(x)$ — «$x$ смертен»?",
    "options": [
      "$\\forall x (H(x) \\to M(x))$",
      "$\\forall x (H(x) \\land M(x))$",
      "$\\exists x (H(x) \\to M(x))$"
    ],
    "correct": 0,
    "explanation": "«Все люди» — это ограничение области: если человек, то смертен.",
    "reveal": "Предикат превращает утверждения в функции истинности, а кванторы — в операции над ними."
  },
  "theory": [
    {
      "title": "Мир речи и предикаты",
      "blocks": [
        {
          "type": "text",
          "content": "Предметные переменные принимают значения из мира речи $D$. Предикат $P(x)$ при подстановке конкретного $x$ становится высказыванием."
        },
        {
          "type": "example",
          "problem": "$D = $ античные философы, $H(x)$ — «$x$ человек». Что такое $H($Сократ$)$?",
          "solution": "Истинное высказывание."
        },
        {
          "type": "remember",
          "content": "Фиксация мира речи и смысла предикатов называется интерпретацией."
        }
      ]
    },
    {
      "title": "Кванторы",
      "blocks": [
        {
          "type": "formula",
          "content": "\\forall x P(x) \\stackrel{def}{=} \\bigwedge_{x \\in D} P(x),\\qquad \\exists x P(x) \\stackrel{def}{=} \\bigvee_{x \\in D} P(x)"
        },
        {
          "type": "table",
          "title": "Перевод на русский",
          "headers": [
            "Формула",
            "Смысл"
          ],
          "rows": [
            [
              "$\\forall x (P \\to Q)$",
              "все $P$ являются $Q$"
            ],
            [
              "$\\forall x (P \\land Q)$",
              "каждый и $P$, и $Q$"
            ],
            [
              "$\\exists x (P \\land Q)$",
              "есть $P$, являющийся $Q$"
            ],
            [
              "$\\exists x (P \\to Q)$",
              "есть $x$, для которого условное"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "«Некоторые змеи ядовиты» — как записать?",
          "solution": "$\\exists x (Z(x) \\land Y(x))$."
        },
        {
          "type": "warning",
          "content": "Для «все» обычно $\\to$, для «некоторые» — $\\land$. Перепутать — классическая ошибка."
        }
      ]
    },
    {
      "title": "Отрицание и связывание",
      "blocks": [
        {
          "type": "formula",
          "content": "\\neg \\forall x P(x) \\equiv \\exists x \\neg P(x),\\qquad \\neg \\exists x P(x) \\equiv \\forall x \\neg P(x)"
        },
        {
          "type": "text",
          "content": "Вхождение переменной связано, если попадает в область действия квантора по ней. Остальные вхождения свободны. Формула без свободных переменных называется замкнутой."
        },
        {
          "type": "example",
          "problem": "$\\forall x P(x) \\to \\exists x Q(x,y)$. Что с переменными?",
          "solution": "$x$ связана дважды, $y$ свободна."
        }
      ]
    },
    {
      "title": "Единственность",
      "blocks": [
        {
          "type": "formula",
          "content": "\\exists! x \\Phi(x) \\equiv \\exists x \\Phi(x) \\land \\forall x \\forall y (\\Phi(x) \\land \\Phi(y) \\to x = y)"
        },
        {
          "type": "example",
          "problem": "«Не более двух» как записать?",
          "solution": "$\\exists x \\exists y \\forall z (\\Phi(z) \\to z = x \\lor z = y)$."
        },
        {
          "type": "remember",
          "content": "«Не более» ограничивает сверху, «не менее» — снизу, «ровно» — и то и другое."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "$\\neg \\forall x P(x)$ равносильно:",
      "options": [
        "$\\exists x \\neg P(x)$",
        "$\\forall x \\neg P(x)$",
        "$\\neg \\exists x P(x)$"
      ],
      "correct": 0,
      "hint": "Квантор меняется на двойственный.",
      "explanation": "$\\exists x \\neg P(x)$."
    },
    {
      "type": "single_choice",
      "question": "«Все студенты сдали» при $S(x)$ и $P(x)$:",
      "options": [
        "$\\forall x (S(x) \\to P(x))$",
        "$\\forall x (S(x) \\land P(x))$",
        "$\\exists x (S(x) \\land P(x))$"
      ],
      "correct": 0,
      "hint": "Ограничение через импликацию.",
      "explanation": "$\\forall x (S(x) \\to P(x))$."
    },
    {
      "type": "single_choice",
      "question": "В формуле $\\forall x P(x,y)$ переменная $y$:",
      "options": [
        "свободна",
        "связана",
        "отсутствует"
      ],
      "correct": 0,
      "hint": "Квантор только по $x$.",
      "explanation": "$y$ свободна."
    },
    {
      "type": "true_false",
      "question": "Формула без свободных переменных называется замкнутой.",
      "correct": true,
      "hint": "Определение.",
      "explanation": "Верно."
    },
    {
      "type": "numeric",
      "question": "Сколько свободных переменных в $\\forall x \\exists y P(x,y,z)$?",
      "answer": "1",
      "tolerance": 0.01,
      "hint": "Только $z$.",
      "explanation": "Одна — $z$."
    },
    {
      "type": "multi_choice",
      "question": "Что верно про кванторы?",
      "options": [
        "$\\neg \\forall x P = \\exists x \\neg P$",
        "$\\neg \\exists x P = \\forall x \\neg P$",
        "$\\exists!$ — сокращение, требующее определения",
        "$\\forall$ можно свободно менять на $\\exists$"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Кванторы двойственны только с отрицанием.",
      "explanation": "Замена $\\forall$ на $\\exists$ без отрицания меняет смысл."
    }
  ],
  "review_cards": [
    {
      "q": "«Все P суть Q»",
      "a": "$\\forall x (P(x) \\to Q(x))$"
    },
    {
      "q": "«Некоторые P суть Q»",
      "a": "$\\exists x (P(x) \\land Q(x))$"
    },
    {
      "q": "Отрицание квантора всеобщности",
      "a": "$\\neg \\forall x P = \\exists x \\neg P$"
    },
    {
      "q": "Замкнутая формула",
      "a": "Без свободных переменных."
    }
  ],
  "summary": [
    "Предикат — функция из мира речи в истину-ложь.",
    "«Все» — через импликацию, «некоторые» — через конъюнкцию.",
    "Отрицание переворачивает квантор."
  ]
});
