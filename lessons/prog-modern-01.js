// Урок: auto, lambda, structured bindings и std::function. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "prog-modern-01",
  "subject": "Программирование",
  "topic": "Современный C++",
  "order": 9,
  "title": "auto, lambda, structured bindings и std::function",
  "est_minutes": 12,
  "hook": {
    "type": "single_choice",
    "question": "Что делает `auto`?",
    "options": ["Позволяет компилятору вывести тип", "Делает тип динамическим", "Удаляет тип"],
    "correct": 0,
    "explanation": "`auto` выводит тип на этапе компиляции; переменную нужно инициализировать.",
    "reveal": "`decltype` возвращает точный тип выражения, включая ссылки и const."
  },
  "theory": [
    {
      "title": "auto и decltype",
      "blocks": [
        { "type": "text", "content": "`auto` удобен для длинных типов, но не переносит `const` и ссылку автоматически: для этого пишут `const auto&` или `auto&&`." },
        { "type": "code", "content": "const int x = 0;\nauto y = x;        // int, const потерян\nconst auto z = x;  // const int\n\nint m = 0;\nint& r = m;\nauto j = r;        // int\nconst auto& k = r; // const int&" },
        { "type": "text", "content": "`decltype(x)` возвращает тип переменной, а `decltype((x))` — ссылку. `decltype` не вычисляет выражение во время выполнения." },
        { "type": "remember", "content": "Цикл по контейнеру: `for (const auto& x : a)` — без копирования и без изменения элементов." }
      ]
    },
    {
      "title": "Лямбды",
      "blocks": [
        { "type": "text", "content": "Лямбда — локальная функция с захватом переменных. Компилятор превращает её в уникальный класс с `operator()`." },
        { "type": "code", "content": "int limit = 10;\nauto less = [limit](int x) { return x < limit; };\nstd::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });" },
        { "type": "text", "content": "Захват `[=]` копирует, `[&]` берёт по ссылке, `[x = std::move(x)]` перемещает. `mutable` разрешает менять копии захваченных переменных внутри лямбды." },
        { "type": "warning", "content": "Лямбда с большим состоянием тяжелее копировать и передавать. Захват по ссылке опасен, если лямбда живёт дольше переменной." }
      ]
    },
    {
      "title": "Structured bindings и std::function",
      "blocks": [
        { "type": "text", "content": "Structured bindings распаковывают `pair`, `tuple` и структуры: `auto [x, y] = p;`. Удобно в циклах по `map`." },
        { "type": "code", "content": "std::map<std::string, int> scores;\nfor (const auto& [name, score] : scores) {\n    std::cout << name << ' ' << score;\n}" },
        { "type": "text", "content": "`std::function<R(Args...)>` хранит любую вызываемую сущность с нужной сигнатурой. Это удобно для интерфейсов, но дороже шаблонного параметра из-за стирания типа и возможной аллокации." },
        { "type": "table", "title": "Шаблон или function", "headers": ["Подход", "Плюс", "Минус"], "rows": [["шаблонный параметр", "быстро, без накладных расходов", "раздувает код и типы"], ["`std::function`", "явная сигнатура, удобный интерфейс", "дороже при вызове"]] }
      ]
    }
  ],
  "practice": [
    { "type": "single_choice", "question": "Что нужно, чтобы использовать `auto`?", "options": ["Инициализировать переменную", "Указать `const`", "Подключить `<memory>`"], "correct": 0, "hint": "Тип выводится из инициализатора.", "explanation": "Нужен инициализатор." },
    { "type": "single_choice", "question": "Что делает `[&]` в лямбде?", "options": ["Захватывает внешние переменные по ссылке", "Копирует всё", "Ничего не захватывает"], "correct": 0, "hint": "Амперсанд — ссылка.", "explanation": "Захват по ссылке." },
    { "type": "single_choice", "question": "Что позволяет `mutable` у лямбды?", "options": ["Менять копии захваченных переменных", "Менять исходные переменные", "Делать лямбду глобальной"], "correct": 0, "hint": "Копии внутри замыкания.", "explanation": "Меняет копии, а не оригиналы." },
    { "type": "numeric", "question": "Сколько переменных распакует `auto [a, b, c] = t;`?", "answer": "3", "tolerance": 0.01, "hint": "По числу имён.", "explanation": "3." },
    { "type": "multi_choice", "question": "Что верно?", "options": ["`auto` выводит тип при компиляции", "`decltype` не вычисляет выражение", "Structured bindings работают с `pair`", "`std::function` всегда быстрее шаблона"], "correct": [0, 1, 2], "hint": "`std::function` обычно дороже.", "explanation": "`std::function` не всегда быстрее." },
    { "type": "true_false", "question": "`for (const auto& [k, v] : map)` позволяет удобно перебирать пары.", "correct": true, "hint": "Structured bindings в цикле.", "explanation": "Да." }
  ],
  "review_cards": [
    { "q": "Что делает `auto`", "a": "Выводит тип из инициализатора на этапе компиляции." },
    { "q": "Чем `decltype` отличается от `auto`", "a": "`decltype` возвращает точный тип выражения, включая ссылки." },
    { "q": "Захваты лямбды", "a": "`[=]` — копия, `[&]` — ссылка." },
    { "q": "Зачем `std::function`", "a": "Хранит вызываемый объект с заданной сигнатурой." }
  ],
  "summary": ["`auto` и `decltype` упрощают работу с типами.", "Лямбды — функции с захватом состояния.", "Structured bindings и `std::function` делают код короче и удобнее."]
});
