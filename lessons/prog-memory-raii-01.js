// Урок: Динамическая память и RAII. Файл в папке lessons, подключается в index.html.
window.registerLesson({
  "id": "prog-memory-raii-01",
  "subject": "Программирование",
  "topic": "Память и RAII",
  "order": 7,
  "title": "Динамическая память и RAII",
  "est_minutes": 12,
  "hook": {
    "type": "single_choice",
    "question": "Что освобождает память, выделенную через `new`?",
    "options": ["`delete`", "Сборщик мусора", "Выход из области видимости"],
    "correct": 0,
    "explanation": "В C++ нет сборщика мусора: память из-под `new` освобождают `delete`.",
    "reveal": "RAII связывает освобождение ресурса с деструктором объекта."
  },
  "theory": [
    {
      "title": "Время жизни объектов",
      "blocks": [
        { "type": "table", "title": "Storage duration", "headers": ["Вид", "Когда живёт"], "rows": [["automatic", "до выхода из области видимости"], ["static", "всё время работы программы"], ["dynamic", "управляется `new`/`delete`"], ["thread-local", "время жизни потока"]] },
        { "type": "text", "content": "`new T` выделяет память и вызывает конструктор, `delete p` вызывает деструктор и освобождает память. Для массива нужны `new T[n]` и `delete[] p`." },
        { "type": "code", "content": "int* p = new int(42);\ndelete p;\n\nint* arr = new int[10];\ndelete[] arr;" }
      ]
    },
    {
      "title": "Ошибки с памятью",
      "blocks": [
        { "type": "text", "content": "Утечка — память выделили и не освободили. Use-after-free — обратились к памяти после `delete`. Двойное удаление и выход за границы массива тоже приводят к UB." },
        { "type": "warning", "content": "Обращение к освобождённой памяти может сработать без ошибки, поэтому баг сложно поймать. ASan (AddressSanitizer) помогает находить такие обращения." },
        { "type": "text", "content": "`placement new` создаёт объект в заранее выделенном буфере. Для такого объекта не вызывают `delete`; буфер освобождают один раз." }
      ]
    },
    {
      "title": "RAII",
      "blocks": [
        { "type": "text", "content": "RAII (Resource Acquisition Is Initialization): ресурс захватывается в конструкторе, а освобождается в деструкторе. Благодаря automatic storage duration освобождение происходит при выходе из области видимости, даже при исключении." },
        { "type": "code", "content": "class File {\npublic:\n    explicit File(const char* path) : f_(std::fopen(path, \"r\")) {}\n    ~File() { if (f_) std::fclose(f_); }\n    File(const File&) = delete;\n    File& operator=(const File&) = delete;\nprivate:\n    std::FILE* f_;\n};" },
        { "type": "remember", "content": "Контейнеры STL используют RAII: `vector` сам выделяет и освобождает память, поэтому вручную вызывать `delete` для его буфера не нужно." },
        { "type": "text", "content": "Сырые указатели всё ещё нужны для наблюдения за объектом, но владение лучше выражать через умные указатели или контейнеры." }
      ]
    }
  ],
  "practice": [
    { "type": "single_choice", "question": "Что вызывает `delete p` для объекта класса?", "options": ["Деструктор и освобождение памяти", "Только освобождение памяти", "Только конструктор"], "correct": 0, "hint": "delete завершает жизнь объекта.", "explanation": "Деструктор, затем освобождение памяти." },
    { "type": "single_choice", "question": "Как освободить массив, выделенный `new int[10]`?", "options": ["`delete[] p`", "`delete p`", "`free(p)`"], "correct": 0, "hint": "Парность new[]/delete[].", "explanation": "`delete[]`." },
    { "type": "single_choice", "question": "Что такое RAII?", "options": ["Ресурс захватывается в конструкторе, освобождается в деструкторе", "Ручное управление памятью", "Сборка мусора"], "correct": 0, "hint": "Acquisition Is Initialization.", "explanation": "Освобождение привязано к деструктору." },
    { "type": "multi_choice", "question": "Какие проблемы бывают с сырыми указателями?", "options": ["Утечка памяти", "Use-after-free", "Двойное удаление", "Автоматическая сборка мусора"], "correct": [0, 1, 2], "hint": "В C++ нет GC.", "explanation": "Первые три — реальные проблемы." },
    { "type": "true_false", "question": "Для объекта, созданного placement new, нужно вызывать `delete`.", "correct": false, "hint": "Буфер освобождают иначе.", "explanation": "Нет, освобождается весь буфер." },
    { "type": "numeric", "question": "Сколько раз нужно освободить буфер, в котором размещено 10 объектов через placement new?", "answer": "1", "tolerance": 0.01, "hint": "Буфер один.", "explanation": "Один раз." }
  ],
  "review_cards": [
    { "q": "Парность операторов памяти", "a": "`new`/`delete`, `new[]`/`delete[]`." },
    { "q": "Что такое утечка памяти", "a": "Память выделена и не освобождена." },
    { "q": "Идея RAII", "a": "Захват ресурса в конструкторе, освобождение в деструкторе." },
    { "q": "Что такое placement new", "a": "Создание объекта в заранее выделенном буфере." }
  ],
  "summary": ["`new`/`delete` управляют динамической памятью вручную.", "Ошибки с памятью часто приводят к UB.", "RAII автоматически освобождает ресурсы через деструктор."]
});
