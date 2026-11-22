// Урок: ННФ, предварённая и сколемовская формы. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "dm-nnf-01",
  "subject": "Дискретная математика",
  "topic": "Нормальные формы логики",
  "order": 11,
  "title": "ННФ, предварённая и сколемовская формы",
  "est_minutes": 10,
  "hook": {
    "type": "single_choice",
    "question": "Можно ли вынести $\\forall x$ из $( \\forall x P(x) ) \\lor Q(x)$, где $x$ свободна в $Q$?",
    "options": [
      "нет, сначала переименовать",
      "да, получим $\\forall x(P \\lor Q)$",
      "да, вообще без изменений"
    ],
    "correct": 0,
    "explanation": "Вынос связал бы свободную $x$ из $Q$ — это ошибка. Нужно переименовать связанную переменную.",
    "reveal": "Нормальные формы — это канонические записи формул. Три шага: убрать $\\to$ и $\\equiv$, задвинуть отрицания внутрь, вынести кванторы."
  },
  "theory": [
    {
      "title": "ННФ",
      "blocks": [
        {
          "type": "text",
          "content": "Негационная нормальная форма: только литеры, $\\land$, $\\lor$, $\\forall$, $\\exists$. Отрицания стоят только перед атомами."
        },
        {
          "type": "table",
          "title": "Правила приведения",
          "headers": [
            "От",
            "К"
          ],
          "rows": [
            [
              "$A \\to B$",
              "$\\neg A \\lor B$"
            ],
            [
              "$A \\equiv B$",
              "$(A \\land B) \\lor (\\neg A \\land \\neg B)$"
            ],
            [
              "$\\neg(A \\land B)$",
              "$\\neg A \\lor \\neg B$"
            ],
            [
              "$\\neg \\forall x A$",
              "$\\exists x \\neg A$"
            ]
          ]
        },
        {
          "type": "example",
          "problem": "$\\neg\\forall x(P(x) \\to Q(x))$ в ННФ.",
          "solution": "$\\exists x(P(x) \\land \\neg Q(x))$."
        }
      ]
    },
    {
      "title": "Предварённая форма",
      "blocks": [
        {
          "type": "formula",
          "content": "Q_1x_1 Q_2x_2 \\ldots Q_nx_n\\, P"
        },
        {
          "type": "text",
          "content": "Все кванторы вынесены в начало, бескванторная часть следует за ними. ННФ этого не требует."
        },
        {
          "type": "table",
          "title": "Правила выноса",
          "headers": [
            "Случай",
            "Результат"
          ],
          "rows": [
            [
              "$(Qx A) \\circ B$",
              "$Qx(A \\circ B)$"
            ],
            [
              "$(\\forall x A) \\to B$",
              "$\\exists x(A \\to B)$"
            ],
            [
              "$(\\exists x A) \\to B$",
              "$\\forall x(A \\to B)$"
            ],
            [
              "$B \\to (\\forall x A)$",
              "$\\forall x(B \\to A)$"
            ]
          ]
        },
        {
          "type": "warning",
          "content": "В посылке импликации квантор меняется на двойственный. В заключении — сохраняется."
        },
        {
          "type": "example",
          "problem": "$( \\forall x P(x) ) \\lor ( \\exists x Q(x) )$ в ПНФ.",
          "solution": "Переименуем вторую: $\\forall x \\exists y (P(x) \\lor Q(y))$."
        }
      ]
    },
    {
      "title": "Сколемовская форма",
      "blocks": [
        {
          "type": "text",
          "content": "Из ПНФ удаляют кванторы существования, заменяя переменную константой (если слева нет $\\forall$) или функцией от переменных всеобщности (если есть)."
        },
        {
          "type": "example",
          "problem": "$\\forall x \\exists y R(x,y)$",
          "solution": "$\\forall x R(x, f(x))$."
        },
        {
          "type": "warning",
          "content": "Сколемизация сохраняет выполнимость, но НЕ равносильность: значок $\\leadsto$, а не $\\equiv$."
        }
      ]
    }
  ],
  "practice": [
    {
      "type": "single_choice",
      "question": "Чем ННФ отличается от ПНФ?",
      "options": [
        "ПНФ требует вынести кванторы в начало",
        "ННФ не допускает $\\\\land$",
        "Ничем"
      ],
      "correct": 0,
      "hint": "«Предваренная» — значит впереди.",
      "explanation": "ПНФ — это ННФ с кванторным префиксом."
    },
    {
      "type": "single_choice",
      "question": "$\\neg\\forall x P(x)$ в ННФ:",
      "options": [
        "$\\exists x \\neg P(x)$",
        "$\\forall x \\neg P(x)$",
        "$\\neg\\exists x P(x)$"
      ],
      "correct": 0,
      "hint": "Квантор меняется.",
      "explanation": "$\\exists x \\neg P(x)$."
    },
    {
      "type": "single_choice",
      "question": "Сколемизация $\\forall x\\exists y R(x,y)$ даёт:",
      "options": [
        "$\\forall x R(x, f(x))$",
        "$\\forall x R(x, c)$",
        "$\\exists y R(x, y)$"
      ],
      "correct": 0,
      "hint": "Слева есть $\\forall$.",
      "explanation": "Нужна функция от $x$."
    },
    {
      "type": "true_false",
      "question": "Сколемизация сохраняет равносильность формул.",
      "correct": false,
      "hint": "Только выполнимость.",
      "explanation": "Неверно."
    },
    {
      "type": "single_choice",
      "question": "Сколько кванторов в кванторном префиксе $\\forall x \\exists y (P \\lor Q)$?",
      "options": [
        "2",
        "1",
        "0"
      ],
      "correct": 0,
      "hint": "Считаем значки.",
      "explanation": "Два."
    },
    {
      "type": "multi_choice",
      "question": "Что нужно для перевода в ПНФ?",
      "options": [
        "Убрать $\\\\to$ и $\\\\equiv$",
        "Продвинуть отрицания внутрь",
        "Переименовать связанные переменные при коллизии",
        "Заменить все $\\\\forall$ на $\\\\exists$"
      ],
      "correct": [
        0,
        1,
        2
      ],
      "hint": "Кванторы не заменяются произвольно.",
      "explanation": "Замена кванторов меняет смысл."
    }
  ],
  "review_cards": [
    {
      "q": "Что такое ННФ",
      "a": "Отрицания только перед атомами."
    },
    {
      "q": "Что такое ПНФ",
      "a": "Кванторный префикс + бескванторная часть."
    },
    {
      "q": "Квантор в посылке импликации",
      "a": "Меняется на двойственный."
    },
    {
      "q": "Сколемизация",
      "a": "Замена $\\exists$ константой или функцией."
    }
  ],
  "summary": [
    "ННФ — отрицания внутрь.",
    "ПНФ — кванторы вперёд.",
    "Сколем — убрать $\\exists$ через функции."
  ]
});
