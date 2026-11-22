// Урок: Итераторы, STL-контейнеры и алгоритмы. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "prog-stl-01",
  "subject": "Программирование",
  "topic": "STL",
  "order": 5,
  "title": "Итераторы, STL-контейнеры и алгоритмы",
  "est_minutes": 12,
  "hook": {
    "type": "single_choice",
    "question": "Что возвращает `end()` контейнера?",
    "options": ["Итератор на элемент после последнего", "Последний элемент", "Первый элемент"],
    "correct": 0,
    "explanation": "`end()` указывает за последний элемент и в диапазон не входит.",
    "reveal": "Диапазон в STL обычно полуинтервал `[begin, end)`."
  },
  "theory": [
    {
      "title": "Итераторы",
      "blocks": [
        { "type": "text", "content": "Итератор перебирает элементы контейнера и даёт доступ к ним. Он похож на указатель: поддерживает `*`, `++`, сравнение, а для части категорий — `--` и арифметику." },
        { "type": "table", "title": "Категории", "headers": ["Категория", "Возможности"], "rows": [["Input", "чтение, один проход"], ["Forward", "чтение, несколько проходов"], ["Bidirectional", "плюс `--`"], ["RandomAccess", "плюс `+`, `-`, индексация"], ["Contiguous", "элементы лежат подряд"]] },
        { "type": "code", "content": "std::vector<int> v{3, 1, 2};\nstd::sort(v.begin(), v.end());\nfor (int x : v) std::cout << x << ' ';" },
        { "type": "warning", "content": "Не все итераторы поддерживают все операции. Например, у `std::list` нет произвольного доступа, поэтому `it + 5` не скомпилируется." }
      ]
    },
    {
      "title": "Контейнеры",
      "blocks": [
        { "type": "table", "title": "Основные контейнеры", "headers": ["Контейнер", "Особенность"], "rows": [["`vector`", "непрерывный массив, доступ $O(1)$"], ["`deque`", "быстрое добавление с двух концов"], ["`list`", "вставки по итератору, доступ $O(n)$"], ["`stack`", "адаптер LIFO"], ["`queue`", "адаптер FIFO"], ["`map`/`set`", "упорядоченные, $O(\\log n)$"]] },
        { "type": "text", "content": "`vector` хранит элементы подряд и даёт амортизированное $O(1)$ на `push_back`. При реаллокации итераторы и ссылки инвалидируются." },
        { "type": "remember", "content": "`vector<bool>` — особая специализация с упаковкой битов; у неё есть ограничения по сравнению с обычным вектором." }
      ]
    },
    {
      "title": "Алгоритмы, pair и optional",
      "blocks": [
        { "type": "text", "content": "Алгоритмы из `<algorithm>` работают через итераторы, а не через конкретные контейнеры: `find`, `find_if`, `count`, `sort`, `reverse`, `min_element`, `accumulate`." },
        { "type": "code", "content": "#include <algorithm>\n#include <numeric>\n\nauto it = std::find(v.begin(), v.end(), 42);\nint sum = std::accumulate(v.begin(), v.end(), 0);\nstd::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });" },
        { "type": "text", "content": "`std::pair` хранит два значения (`first`, `second`). `std::optional<T>` хранит значение или «ничего» и заменяет специальные значения вроде `-1` для «нет результата»." }
      ]
    }
  ],
  "practice": [
    { "type": "single_choice", "question": "Какой итератор нужен для `std::sort`?", "options": ["RandomAccessIterator", "InputIterator", "ForwardIterator"], "correct": 0, "hint": "Сортировке нужен произвольный доступ.", "explanation": "RandomAccessIterator." },
    { "type": "single_choice", "question": "Что хранит `std::pair<int, string>`?", "options": ["Два значения разных типов", "Только числа", "Массив строк"], "correct": 0, "hint": "pair — пара.", "explanation": "Два значения." },
    { "type": "numeric", "question": "За сколько в среднем работает `push_back` у `vector`: введите показатель степени в $O(n^k)$.", "answer": "0", "tolerance": 0.01, "hint": "Амортизированно $O(1)$.", "explanation": "$O(1)$ амортизированно." },
    { "type": "multi_choice", "question": "Что верно про `vector`?", "options": ["Доступ по индексу $O(1)$", "Элементы лежат подряд", "Реаллокация инвалидирует итераторы", "Вставка в начало $O(1)$"], "correct": [0, 1, 2], "hint": "Вставка в начало дорогая.", "explanation": "Вставка в начало — $O(n)$." },
    { "type": "true_false", "question": "`std::optional` может означать «значения нет».", "correct": true, "hint": "Это его назначение.", "explanation": "Да." },
    { "type": "single_choice", "question": "Какой контейнер работает по принципу LIFO?", "options": ["`stack`", "`queue`", "`deque`"], "correct": 0, "hint": "Last In, First Out.", "explanation": "`stack`." }
  ],
  "review_cards": [
    { "q": "Что такое итератор", "a": "Объект для перебора элементов контейнера." },
    { "q": "Диапазон STL", "a": "Полуинтервал `[begin, end)`." },
    { "q": "Сложность `push_back` у vector", "a": "$O(1)$ амортизированно." },
    { "q": "Зачем `optional`", "a": "Хранит значение или отсутствие значения." }
  ],
  "summary": ["Алгоритмы STL работают через итераторы.", "Категория итератора определяет доступные операции.", "vector, deque, stack и queue решают разные задачи."]
});
