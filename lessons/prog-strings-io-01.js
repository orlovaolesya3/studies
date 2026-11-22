// Урок: Строки и потоки ввода-вывода. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "prog-strings-io-01",
  "subject": "Программирование",
  "topic": "Строки и потоки",
  "order": 6,
  "title": "Строки и потоки ввода-вывода",
  "est_minutes": 10,
  "hook": {
    "type": "single_choice",
    "question": "Чем `std::string` отличается от C-строки?",
    "options": ["Владеет памятью и знает длину", "Не может менять длину", "Не поддерживает сравнение"],
    "correct": 0,
    "explanation": "`std::string` управляет памятью и хранит длину, а C-строка — массив `char` с `\\0` в конце.",
    "reveal": "`std::string_view` смотрит на строку, но не владеет ею."
  },
  "theory": [
    {
      "title": "C-строки и std::string",
      "blocks": [
        { "type": "text", "content": "C-строка — массив `char`, заканчивающийся нулевым байтом `\\0`. Функции `strlen`, `strcmp`, `strcpy`, `strcat` лежат в `<cstring>` и работают с такими строками." },
        { "type": "warning", "content": "Для C-строк нельзя использовать `==` для сравнения содержимого: сравнятся адреса. Нужен `strcmp`." },
        { "type": "text", "content": "`std::string` хранит длину, сам управляет памятью и поддерживает `+`, `==`, `<`, `push_back`, `find`, `substr`. Получить C-строку можно через `c_str()`." },
        { "type": "code", "content": "std::string s = \"hello\";\ns += \" world\";\nif (s.find(\"world\") != std::string::npos) {\n    std::cout << s.substr(6);\n}" }
      ]
    },
    {
      "title": "string_view",
      "blocks": [
        { "type": "text", "content": "`std::string_view` — невладеющая обёртка над строкой. Она хранит указатель и длину и позволяет передавать строку в функцию без копирования." },
        { "type": "text", "content": "`remove_prefix(n)` и `remove_suffix(n)` просто сдвигают границы view, не меняя исходные данные. Модифицировать содержимое через `string_view` нельзя." },
        { "type": "warning", "content": "`string_view` не продлевает жизнь строки. Если исходная строка уничтожена, view становится висячей ссылкой." }
      ]
    },
    {
      "title": "Потоки",
      "blocks": [
        { "type": "text", "content": "`istream` читает, `ostream` пишет, `iostream` умеет и то и другое. `cin` — стандартный ввод, `cout` — вывод, `cerr` — ошибки." },
        { "type": "table", "title": "Потоки", "headers": ["Класс", "Назначение"], "rows": [["`stringstream`", "строка как поток"], ["`ifstream`", "чтение файла"], ["`ofstream`", "запись файла"], ["`fstream`", "файл на чтение и запись"]] },
        { "type": "code", "content": "std::stringstream ss;\nss << 5 << \" + \" << 5 << \" = \" << 10;\nstd::string text = ss.str();\n\nstd::ifstream in(\"data.txt\");\nint x;\nin >> x;" },
        { "type": "remember", "content": "`flush` сбрасывает буфер в поток. Это нужно для синхронизации программ, общающихся через файл или pipe." }
      ]
    }
  ],
  "practice": [
    { "type": "single_choice", "question": "Чем заканчивается C-строка?", "options": ["Нулевым байтом `\\0`", "Пробелом", "Символом новой строки"], "correct": 0, "hint": "Terminating null.", "explanation": "`\\0`." },
    { "type": "single_choice", "question": "Что делает `c_str()`?", "options": ["Возвращает C-строку", "Удаляет строку", "Сортирует строку"], "correct": 0, "hint": "C-string.", "explanation": "Указатель на массив `char` с `\\0`." },
    { "type": "single_choice", "question": "Владеет ли `string_view` данными?", "options": ["Нет", "Да", "Только для коротких строк"], "correct": 0, "hint": "View — это взгляд.", "explanation": "Не владеет." },
    { "type": "multi_choice", "question": "Что верно?", "options": ["`std::string` умеет менять длину", "C-строки сравнивают через `strcmp`", "`string_view` не копирует строку", "`cout` — поток ввода"], "correct": [0, 1, 2], "hint": "`cout` — вывод.", "explanation": "`cout` — поток вывода." },
    { "type": "true_false", "question": "`stringstream` позволяет собрать строку из данных разных типов.", "correct": true, "hint": "Поток в памяти.", "explanation": "Да, через `<<`." },
    { "type": "single_choice", "question": "Какой поток читает файл?", "options": ["`ifstream`", "`ofstream`", "`cerr`"], "correct": 0, "hint": "i — input.", "explanation": "`ifstream`." }
  ],
  "review_cards": [
    { "q": "Как заканчивается C-строка", "a": "Нулевым байтом `\\0`." },
    { "q": "Чем `string` лучше C-строки", "a": "Владеет памятью, знает длину, поддерживает операции." },
    { "q": "Зачем `string_view`", "a": "Передача строки без копирования и без владения." },
    { "q": "Потоки файлов", "a": "`ifstream`, `ofstream`, `fstream`." }
  ],
  "summary": ["C-строка — массив с `\\0` в конце.", "`std::string` владеет данными, `string_view` — нет.", "Потоки работают не только с консолью, но и с файлами и строками."]
});
