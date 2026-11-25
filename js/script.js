(function () {
  "use strict";

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Фоновые частицы
  const particles = $("#particles");
  if (particles) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (14 + Math.random() * 20) + "s";
      p.style.animationDelay = (-Math.random() * 25) + "s";
      p.style.background = ["var(--cyan)", "var(--magenta)", "var(--lime)", "var(--blue)"][i % 4];
      p.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      particles.appendChild(p);
    }
  }

  // Уведомления (toast)
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  // Мобильное меню и индикатор прокрутки
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const progressLine = $("#progressLine");
  const toTop = $("#toTop");

  function closeMenu() {
    if (!navLinks || !menuBtn) return;
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Открыть меню");
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
  }

  $$(".nav-links a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  const sections = $$("main section[id]");
  const navMap = new Map(
    $$(".nav-links a")
      .map((a) => {
        const href = a.getAttribute("href") || "";
        return [href.startsWith("#") ? href.slice(1) : null, a];
      })
      .filter(([id]) => id)
  );

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progressLine) progressLine.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 600);
    let current = "";
    for (const sec of sections) {
      if (y >= sec.offsetTop - 150) current = sec.id;
    }
    navMap.forEach((a, id) => a.classList.toggle("active", id === current));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Плавное появление секций при скролле
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // ВСЕ 9 ЛЕКЦИЙ СЕМЕСТРА
  const lectures = [
    {
      id: "lec1",
      num: "01",
      icon: "🧱",
      title: "Лекция 01 · Основы HTML",
      short: "Структура документа, теги и вложенность",
      summary: "HTML отвечает за скелет страницы. Документ всегда начинается с <!DOCTYPE html> и <html lang=\"ru\">. В <head> хранится служебная информация (UTF-8, viewport, title), в <body> — видимый контент.",
      points: [
        "Одиночные (пустые) теги не требуют закрытия: <br>, <hr>, <img>, <input>, <meta>, <link>.",
        "Правильная вложенность: теги закрываются в обратном порядке (сначала внутренний, затем внешний).",
        "Блочные элементы (<div>, <p>) занимают всю ширину; строчные (<span>, <a>) идут в потоке текста.",
        "Для картинок обязателен атрибут alt — он нужен скринридерам и отображается при сбое загрузки."
      ],
      code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Мой сайт</title>\n</head>\n<body>\n  <img src=\"photo.jpg\" alt=\"Описание изображения\">\n</body>\n</html>",
      tags: ["HTML5", "DOM", "Семантика", "Блочные/Строчные"]
    },
    {
      id: "lec2",
      num: "02",
      icon: "⚙️",
      title: "Лекция 02 · Устройство веба и рендеринг",
      short: "Фронтенд, бэкенд и путь до пикселя",
      summary: "Веб-разработка делится на 3 уровня: Фронтенд (интерфейс), Бэкенд (сервер и базы данных) и Инфраструктура (хостинг, DNS, сети). Главный принцип — разделение ответственности между HTML, CSS и JS.",
      points: [
        "Сайт (визитка, блог) нужен для чтения; веб-приложение (почта, банк) — для интерактивной работы с данными.",
        "Рендеринг в браузере: HTML -> DOM, CSS -> CSSOM -> Render-дерево -> Layout (раскладка) -> Paint (отрисовка).",
        "Изменение width или margin вызывает дорогой пересчёт Layout. Анимируйте только transform и opacity."
      ],
      code: "/* Плавная анимация без пересчёта Layout */\n.card {\n  transition: transform 0.25s ease, opacity 0.25s ease;\n}\n.card:hover {\n  transform: translateY(-4px);\n}",
      tags: ["Frontend/Backend", "DOM & CSSOM", "Layout & Paint"]
    },
    {
      id: "lec3",
      num: "03",
      icon: "♿",
      title: "Лекция 03 · Доступность (A11y) и SEO",
      short: "Семантика, скринридеры и WCAG",
      summary: "Доступность (a11y) делает сайт удобным для всех пользователей, включая людей с нарушениями зрения или тех, кто управляет сайтом только с клавиатуры (Tab / Enter).",
      points: [
        "Соблюдайте иерархию заголовков: один <h1> на страницу, далее <h2> -> <h3> без перескоков уровней.",
        "Различайте <a> (переход по ссылке) и <button> (действие на странице). Не делайте кнопки из <div>.",
        "Каждому <input> нужен связанный <label for=\"...\">. Одного placeholder недостаточно.",
        "Минимальный контраст обычного текста по стандарту WCAG — 4.5:1. Всегда оставляйте видимый :focus-visible."
      ],
      code: "<label for=\"email\">Ваш E-mail</label>\n<input type=\"email\" id=\"email\" required>\n<button type=\"submit\">Отправить заявку</button>",
      tags: ["Accessibility", "SEO", "WCAG 4.5:1", "Скринридеры"]
    },
    {
      id: "lec4",
      num: "04",
      icon: "⚡",
      title: "Лекция 04 · Основы JavaScript",
      short: "Переменные, типы данных и подключение",
      summary: "JavaScript оживляет страницу: реагирует на клики, меняет DOM без перезагрузки и работает с данными. Скрипт подключается через <script src=\"js/script.js\" defer></script>.",
      points: [
        "Всегда используйте const по умолчанию, и только если значение будет перезаписываться — let.",
        "Основные типы: строка, число, boolean (true/false), null, undefined, объект {} и массив [].",
        "Для вставки переменных в текст используйте шаблонные строки с обратными кавычками: `Привет, ${name}!`."
      ],
      code: "const user = { name: \"Ардан\", age: 17 };\nconst skills = [\"HTML\", \"CSS\", \"JS\"];\nconsole.log(`Студент: ${user.name}, стек: ${skills.join(\", \")}`);",
      tags: ["ES6+", "const / let", "Шаблонные строки", "defer"]
    },
    {
      id: "lec5",
      num: "05",
      icon: "🧩",
      title: "Лекция 05 · Компоненты интерфейса",
      short: "Меню, модалки, слайдер и вкладки",
      summary: "Компонент — это изолированный, переиспользуемый блок со своей разметкой, стилями и логикой. Любой интерактив должен работать как мышью, так и с клавиатуры.",
      points: [
        "Мобильное меню: кнопка-бургер управляет классом и атрибутами aria-expanded и aria-label.",
        "Модальное окно: role=\"dialog\" + aria-modal=\"true\", закрытие по Escape и клику на фон, блокировка скролла.",
        "Слайдер: лента .slider__track сдвигается через transform: translateX(-100%) внутри блока с overflow: hidden.",
        "Вкладки (табы): единый паттерн — снять класс active со всех кнопок/панелей и добавить выбранному."
      ],
      code: "menuBtn.addEventListener('click', () => {\n  const isOpen = nav.classList.toggle('is-open');\n  menuBtn.setAttribute('aria-expanded', isOpen);\n});",
      tags: ["UI-компоненты", "ARIA", "Модальные окна", "Табы и Слайдер"]
    },
    {
      id: "lec6",
      num: "06",
      icon: "🌐",
      title: "Лекция 06 · Данные с сервера: fetch и JSON",
      short: "API, методы HTTP, промисы и async/await",
      summary: "API — интерфейс (официант), через который фронтенд запрашивает данные у сервера. Обмен данными происходит в текстовом формате JSON.",
      points: [
        "Методы HTTP: GET (получить), POST (создать), PUT/PATCH (обновить), DELETE (удалить).",
        "JSON: ключи и строки строго в двойных кавычках; без комментариев и висячих запятых.",
        "fetch() возвращает промис (состояния: pending, fulfilled, rejected). Используйте async/await для читаемости."
      ],
      code: "async function getFact() {\n  const response = await fetch('https://catfact.ninja/fact');\n  const data = await response.json();\n  console.log(data.fact);\n}",
      tags: ["REST API", "JSON", "GET / POST", "async / await"]
    },
    {
      id: "lec7",
      num: "07",
      icon: "🛡️",
      title: "Лекция 07 · Обработка ошибок в fetch",
      short: "Ловушка 404, response.ok и try/catch",
      summary: "Главная ловушка: fetch не считает коды 404 и 500 ошибкой — промис отклоняется только при потере интернета.",
      points: [
        "Сетевые сбои (нет сети) ловит конструкция try / catch.",
        "HTTP-ошибки (404, 500) нужно проверять вручную: if (!response.ok) throw new Error(...).",
        "Во время запроса блокируйте кнопку (disabled = true) и меняйте текст на «Загружаю…»."
      ],
      code: "try {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`Код: ${res.status}`);\n  const json = await res.json();\n} catch (e) {\n  console.error('Ошибка:', e);\n}",
      tags: ["response.ok", "try / catch", "HTTP 404/500", "POST JSON"]
    },
    {
      id: "lec8",
      num: "08",
      icon: "🚀",
      title: "Лекция 08 · Публикация сайта и Git",
      short: "Хостинг, DNS, HTTPS и GitHub Pages",
      summary: "Опубликовать сайт — значит выложить файлы на круглосуточный сервер. Для статики (HTML/CSS/JS) подходят бесплатные GitHub Pages, Netlify и Vercel.",
      points: [
        "DNS переводит домен (ya.ru) в IP-адрес. HTTPS шифрует трафик с помощью бесплатного SSL-сертификата.",
        "Коды ответов: 200 (ОК), 301/302 (редирект), 403 (нет доступа), 404 (не найдено), 500 (ошибка сервера).",
        "Базовый цикл Git: git init -> git add . -> git commit -m \"...\" -> git push.",
        "Частая ошибка деплоя: путь /css/style.css со слешем в начале ломается на GitHub Pages. Пишите css/style.css."
      ],
      code: "git add .\ngit commit -m \"Обновил портфолио и тесты\"\ngit push",
      tags: ["Git & GitHub", "GitHub Pages", "DNS & HTTPS", "Коды HTTP"]
    },
    {
      id: "lec9",
      num: "09",
      icon: "🧭",
      title: "Лекция 09 · Профессия и карьера",
      short: "Специализации, фреймворки и рост",
      summary: "Фреймворки (React, Vue, Svelte) не заменяют JavaScript, а помогают удобно организовывать код на компоненты и управлять состоянием.",
      points: [
        "Роли во фронтенде: Верстальщик (UI), Frontend-разработчик, Fullstack, Mobile (React Native), QA Automation.",
        "Карьерный рост: Junior (делает по ТЗ) -> Middle (делает сам) -> Senior (проектирует) -> Lead (ведёт команду).",
        "Для сильного портфолио важнее качество 2–3 проектов: живое демо, чистый код, README и обработка ошибок."
      ],
      code: "const career = {\n  junior: \"База HTML/CSS/JS + Git\",\n  middle: \"Фреймворк + TypeScript + Архитектура\"\n};",
      tags: ["React / Vue", "Junior -> Senior", "Портфолио"]
    }
  ];

  const lectureList = $("#lectureList");
  const lectureDetail = $("#lectureDetail");

  function showLecture(id) {
    const l = lectures.find((x) => x.id === id);
    if (!l || !lectureDetail) return;

    const pointsHtml = l.points
      .map(
        (pt) =>
          `<li style="display:flex; gap:8px; font-size:.9rem; color:#cfe0ff;"><span style="color:var(--lime); font-weight:900;">▹</span><span>${escapeHtml(pt)}</span></li>`
      )
      .join("");

    const tagsHtml = l.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    lectureDetail.innerHTML = `
      <div class="spec-detail-head">
        <div>
          <span class="badge cyan" style="margin-bottom:8px;">Модуль ${l.num}</span>
          <h3>${escapeHtml(l.title)}</h3>
        </div>
      </div>
      <p style="margin-bottom: 14px;">${escapeHtml(l.summary)}</p>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
        ${pointsHtml}
      </ul>
      <div class="code-panel" style="margin-bottom:14px;">
        <div class="code-head">
          <span>Пример кода</span>
          <button type="button" class="copy-btn" id="copyLecCode">Скопировать</button>
        </div>
        <pre>${escapeHtml(l.code)}</pre>
      </div>
      <div class="skill-tags" style="margin:0;">
        ${tagsHtml}
      </div>`;

    const copyBtn = $("#copyLecCode");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyText(l.code).then(() => showToast("Пример кода скопирован"));
      });
    }
  }

  if (lectureList) {
    lectureList.innerHTML = lectures
      .map(
        (l, i) => `
      <button class="spec-item${i === 0 ? " active" : ""}" role="tab" aria-selected="${i === 0}" data-id="${l.id}">
        <span class="spec-ico">${l.icon}</span>
        <span><b>${escapeHtml(l.title)}</b><small>${escapeHtml(l.short)}</small></span>
      </button>`
      )
      .join("");

    lectureList.querySelectorAll(".spec-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        lectureList.querySelectorAll(".spec-item").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        showLecture(btn.dataset.id);
      });
    });
    showLecture(lectures[0].id);
  }

  // ШАГИ ИНТЕРНЕТА
  function renderSteps(containerId, detailId, steps) {
    const container = $(containerId);
    const detail = $(detailId);
    if (!container || !detail) return;

    container.innerHTML = steps
      .map(
        (s, i) =>
          `<button class="flow-step${i === 0 ? " active" : ""}" role="tab" aria-selected="${i === 0}" data-i="${i}"><div class="flow-num">${i + 1}</div><b>${escapeHtml(s.title)}</b><small>${escapeHtml(s.sub)}</small></button>`
      )
      .join("");

    function show(i) {
      const s = steps[i];
      detail.innerHTML = `<div class="card"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p><div class="flow-code">${escapeHtml(s.code)}</div></div>`;
      container.querySelectorAll(".flow-step").forEach((b, idx) => {
        b.classList.toggle("active", idx === i);
        b.setAttribute("aria-selected", String(idx === i));
      });
    }

    container.querySelectorAll(".flow-step").forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
    show(0);
  }

  renderSteps("#netFlow", "#netDetail", [
    {
      title: "Адрес и DNS",
      sub: "домен -> IP",
      desc: "Браузер спрашивает у DNS-сервера числовой IP-адрес введённого домена.",
      code: "my-site.netlify.app -> DNS -> 104.198.14.52"
    },
    {
      title: "Запрос HTTP",
      sub: "GET /",
      desc: "Устанавливается защищённое HTTPS-соединение и отправляется запрос на получение страницы.",
      code: "GET / HTTP/1.1\nHost: my-site.netlify.app"
    },
    {
      title: "Ответ сервера",
      sub: "200 OK",
      desc: "Сервер находит index.html и возвращает его вместе со статусом 200 OK.",
      code: "HTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8"
    },
    {
      title: "DOM и CSSOM",
      sub: "парсинг",
      desc: "Браузер параллельно строит дерево тегов (DOM) и дерево стилей (CSSOM).",
      code: "HTML -> DOM | CSS -> CSSOM"
    },
    {
      title: "Layout и Paint",
      sub: "пиксели",
      desc: "Вычисляются размеры элементов (Layout) и отрисовываются пиксели на экране (Paint).",
      code: "Render Tree -> Layout -> Paint"
    }
  ]);

  // Копирование шаблона fetch
  $$(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(btn.dataset.copy);
      if (el) copyText(el.textContent).then(() => showToast("Код скопирован"));
    });
  });

  // ЛАБОРАТОРИЯ ФРЕЙМВОРКОВ
  const frameworks = {
    react: {
      label: "React",
      file: "Button.jsx",
      paradigm: "Компоненты + хуки",
      style: "JSX",
      code: "function Button({ label = \"Записаться\", count = 3, variant = \"primary\" }) {\n  return (\n    <button className={`btn btn-${variant}`}>\n      {label}\n      {count > 0 && <span className=\"badge\">{count}</span>}\n    </button>\n  );\n}"
    },
    vue: {
      label: "Vue",
      file: "Button.vue",
      paradigm: "SFC + реактивность",
      style: "Template",
      code: "<template>\n  <button :class=\"['btn', 'btn-' + variant]\">\n    {{ label }}\n    <span v-if=\"count > 0\" class=\"badge\">{{ count }}</span>\n  </button>\n</template>"
    },
    vanilla: {
      label: "Vanilla JS",
      file: "button.js",
      paradigm: "Без фреймворка",
      style: "DOM API",
      code: "function createButton({ label = \"Записаться\", count = 3 }) {\n  const btn = document.createElement(\"button\");\n  btn.textContent = label;\n  return btn;\n}"
    }
  };

  const fwTabs = $("#fwTabs");
  const fwInfo = $("#fwInfo");
  const codeOut = $("#codeOut");
  const codeFile = $("#codeFile");
  let currentFw = "react";

  function renderCode() {
    const fw = frameworks[currentFw];
    if (!fw) return;
    if (codeFile) codeFile.textContent = fw.file;
    if (codeOut) codeOut.textContent = fw.code;
    if (fwInfo) {
      fwInfo.innerHTML = `<div class="fw-box"><span>Парадигма</span><b>${escapeHtml(fw.paradigm)}</b></div><div class="fw-box"><span>Разметка</span><b>${escapeHtml(fw.style)}</b></div>`;
    }
  }

  if (fwTabs) {
    fwTabs.innerHTML = Object.entries(frameworks)
      .map(([k, v]) => `<button class="tab${k === currentFw ? " active" : ""}" role="tab" data-fw="${k}">${escapeHtml(v.label)}</button>`)
      .join("");
    fwTabs.querySelectorAll(".tab").forEach((t) =>
      t.addEventListener("click", () => {
        currentFw = t.dataset.fw;
        fwTabs.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x.dataset.fw === currentFw));
        renderCode();
      })
    );
    renderCode();
  }

  if ($("#copyCode") && codeOut) {
    $("#copyCode").addEventListener("click", () => copyText(codeOut.textContent).then(() => showToast("Код скопирован")));
  }

  // ПЕСОЧНИЦА КНОПКИ
  const state = { label: "Записаться", count: 3, variant: "primary", radius: 12, badge: true, disabled: false };
  const demoBtn = $("#demoBtn");
  const labelInput = $("#labelInput");
  const countOut = $("#countOut");
  const variantSelect = $("#variantSelect");
  const radiusRange = $("#radiusRange");
  const radiusVal = $("#radiusVal");
  const badgeToggle = $("#badgeToggle");
  const disabledToggle = $("#disabledToggle");

  function updatePreview() {
    if (!demoBtn) return;
    const variants = {
      primary: "linear-gradient(120deg,var(--cyan),var(--blue))",
      ghost: "transparent",
      danger: "linear-gradient(120deg,var(--red),var(--magenta))",
      success: "linear-gradient(120deg,var(--green),var(--lime))"
    };
    demoBtn.style.padding = "14px 28px";
    demoBtn.style.fontSize = "16px";
    demoBtn.style.borderRadius = state.radius + "px";
    demoBtn.style.background = variants[state.variant];
    demoBtn.style.color = state.variant === "ghost" ? "var(--text)" : "#06101c";
    demoBtn.style.border = state.variant === "ghost" ? "1px solid var(--line2)" : "none";
    demoBtn.disabled = state.disabled;
    demoBtn.innerHTML = `⭐ ${escapeHtml(state.label)}` + (state.badge ? ` <span class="demo-badge">${state.count}</span>` : "");
  }

  if (labelInput) labelInput.addEventListener("input", (e) => { state.label = e.target.value || "Кнопка"; updatePreview(); });
  if ($("#countMinus") && countOut) $("#countMinus").addEventListener("click", () => { state.count = clamp(state.count - 1, 0, 99); countOut.textContent = state.count; updatePreview(); });
  if ($("#countPlus") && countOut) $("#countPlus").addEventListener("click", () => { state.count = clamp(state.count + 1, 0, 99); countOut.textContent = state.count; updatePreview(); });
  if (variantSelect) variantSelect.addEventListener("change", (e) => { state.variant = e.target.value; updatePreview(); });
  if (radiusRange && radiusVal) radiusRange.addEventListener("input", (e) => { state.radius = +e.target.value; radiusVal.textContent = state.radius; updatePreview(); });
  if (badgeToggle) badgeToggle.addEventListener("change", (e) => { state.badge = e.target.checked; updatePreview(); });
  if (disabledToggle) disabledToggle.addEventListener("change", (e) => { state.disabled = e.target.checked; updatePreview(); });

  if ($("#resetSandbox")) {
    $("#resetSandbox").addEventListener("click", () => {
      Object.assign(state, { label: "Записаться", count: 3, variant: "primary", radius: 12, badge: true, disabled: false });
      if (labelInput) labelInput.value = state.label;
      if (countOut) countOut.textContent = state.count;
      if (variantSelect) variantSelect.value = state.variant;
      if (radiusRange) radiusRange.value = state.radius;
      if (radiusVal) radiusVal.textContent = state.radius;
      if (badgeToggle) badgeToggle.checked = true;
      if (disabledToggle) disabledToggle.checked = false;
      updatePreview();
      showToast("Настройки сброшены");
    });
  }

  if ($("#exportSandbox")) {
    $("#exportSandbox").addEventListener("click", () => {
      copyText(`.btn { border-radius: ${state.radius}px; padding: 14px 28px; }`).then(() => showToast("CSS скопирован"));
    });
  }
  updatePreview();

  // КАРЬЕРНАЯ ЛЕСТНИЦА
  const ladder = [
    { level: "Junior", name: "Junior", short: "Учится и делает", expect: "Выполняет задачи по чёткому ТЗ, верстает компоненты, работает с Git и простыми API.", skills: ["HTML5 / CSS3", "Базовый JS", "Git", "Доступность (A11y)"], salary: "50–90 тыс. руб.", marker: 18 },
    { level: "Middle", name: "Middle", short: "Делает сам", expect: "Самостоятельно проектирует фичи, пишет на фреймворке и TypeScript, покрывает код тестами.", skills: ["React / Vue", "TypeScript", "Архитектура API", "Оптимизация"], salary: "100–180 тыс. руб.", marker: 45 },
    { level: "Senior", name: "Senior", short: "Отвечает за результат", expect: "Отвечает за архитектуру всего фронтенда, производительность и менторство команды.", skills: ["Системный дизайн", "Code Review", "Performance", "Менторство"], salary: "190–300 тыс. руб.", marker: 73 },
    { level: "Lead", name: "Lead", short: "Ведёт команду", expect: "Управляет разработкой, связывает бизнес-задачи с техническими решениями.", skills: ["Управление", "Планирование", "Найм", "Стратегия"], salary: "от 300 тыс. руб.", marker: 94 }
  ];

  const ladderEl = $("#ladder");
  const careerCard = $("#careerCard");
  const salaryMarker = $("#salaryMarker");
  const salaryValue = $("#salaryValue");

  function showRung(i) {
    const l = ladder[i];
    if (!l || !careerCard) return;
    careerCard.innerHTML = `<h3>${escapeHtml(l.name)} · ${escapeHtml(l.short)}</h3><p style="color:var(--muted);font-size:.92rem;margin-top:8px">${escapeHtml(l.expect)}</p><ul>${l.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`;
    if (salaryMarker) salaryMarker.style.left = l.marker + "%";
    if (salaryValue) salaryValue.textContent = l.salary;
    if (ladderEl) {
      ladderEl.querySelectorAll(".rung").forEach((b, idx) => b.classList.toggle("active", idx === i));
    }
  }

  if (ladderEl) {
    ladderEl.innerHTML = ladder
      .map((l, i) => `<button class="rung${i === 0 ? " active" : ""}" data-i="${i}"><span class="lvl">${escapeHtml(l.level)}</span><b>${escapeHtml(l.name)}</b><small>${escapeHtml(l.short)}</small></button>`)
      .join("");
    ladderEl.querySelectorAll(".rung").forEach((b) => b.addEventListener("click", () => showRung(+b.dataset.i)));
    showRung(0);
  }

  // ПОРТФОЛИО: ГЕНЕРАТОР ИДЕЙ И ЧЕК-ЛИСТ
  const ideas = [
    { title: "Дашборд привычек с фильтрами", desc: "Пользователь отмечает прогресс, фильтрует записи по неделям и видит статистику в localStorage.", stack: ["JS", "LocalStorage", "CSS Grid"] },
    { title: "Поиск профилей GitHub через API", desc: "Форма поиска с fetch, индикатором загрузки, обработкой ошибки 404 и карточкой репозиториев.", stack: ["Fetch API", "async/await", "try/catch"] },
    { title: "Интерактивный квиз с таймером", desc: "Тренажёр по веб-разработке с подсчётом баллов, разбором ошибок и управлением с клавиатуры.", stack: ["DOM API", "A11y", "State"] }
  ];

  let ideaIdx = 0;
  function renderIdea() {
    const idea = ideas[ideaIdx];
    if ($("#ideaTitle")) $("#ideaTitle").textContent = idea.title;
    if ($("#ideaDesc")) $("#ideaDesc").textContent = idea.desc;
    if ($("#ideaStack")) $("#ideaStack").innerHTML = idea.stack.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("");
  }

  if ($("#newIdea")) {
    $("#newIdea").addEventListener("click", () => {
      ideaIdx = (ideaIdx + 1) % ideas.length;
      renderIdea();
    });
  }
  renderIdea();

  const checklist = [
    { text: "Живое демо на GitHub Pages", sub: "Все пути к CSS/JS относительные (без / в начале)" },
    { text: "Семантика и доступность (A11y)", sub: "Есть alt у картинок, label у полей, работает Tab и Escape" },
    { text: "Обработка ошибок API", sub: "Проверка response.ok и блок try/catch для сетевых сбоев" },
    { text: "Чистая Git-история и README", sub: "Понятные коммиты и описание запуска проекта" }
  ];

  const portfolioChecklist = $("#portfolioChecklist");
  if (portfolioChecklist) {
    portfolioChecklist.innerHTML = checklist
      .map((c, i) => `<label class="check"><input type="checkbox" data-i="${i}"><span><b>${escapeHtml(c.text)}</b><small>${escapeHtml(c.sub)}</small></span></label>`)
      .join("");
    portfolioChecklist.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("change", () => inp.closest(".check").classList.toggle("done", inp.checked))
    );
  }

  // ИТОГОВЫЙ ТЕСТ ПО ВСЕМ ЛЕКЦИЯМ СЕМЕСТРА (15 ВОПРОСОВ)
  const quiz = [
    {
      q: "Какой тег всегда пишется в самой первой строке HTML-документа?",
      options: ["<html lang=\"ru\">", "<!DOCTYPE html>", "<head>", "<meta charset=\"UTF-8\">"],
      answer: 1,
      explain: "<!DOCTYPE html> объявляет современный стандарт HTML5 и всегда стоит первой строкой."
    },
    {
      q: "Какие CSS-свойства лучше всего анимировать для плавной работы без пересчёта Layout?",
      options: ["width и height", "margin и padding", "transform и opacity", "top и left"],
      answer: 2,
      explain: "transform и opacity не вызывают пересчёт геометрии (Layout), поэтому анимация идёт плавно."
    },
    {
      q: "Какой минимальный контраст обычного текста требует стандарт доступности WCAG?",
      options: ["2:1", "3:1", "4.5:1", "10:1"],
      answer: 2,
      explain: "Для обычного текста минимальный коэффициент контраста составляет 4.5:1, для крупного — 3:1."
    },
    {
      q: "Что нужно использовать для подписи поля ввода <input>, чтобы её видели скринридеры?",
      options: ["Только placeholder", "Связанный тег <label for=\"...\">", "Атрибут title", "Тег <span> рядом"],
      answer: 1,
      explain: "placeholder исчезает при вводе и часто игнорируется скринридерами. Нужен связанный <label>."
    },
    {
      q: "Зачем скрипту добавляют атрибут defer при подключении в <head>?",
      options: ["Чтобы скрипт выполнился после построения DOM", "Чтобы отключить кэширование", "Чтобы скрипт работал без интернета", "Чтобы ускорить загрузку картинок"],
      answer: 0,
      explain: "defer откладывает запуск скрипта до полной загрузки HTML-структуры (DOM)."
    },
    {
      q: "Какой ARIA-атрибут сообщает скринридеру, открыто ли мобильное меню?",
      options: ["aria-hidden", "aria-expanded", "aria-modal", "aria-selected"],
      answer: 1,
      explain: "aria-expanded=\"true/false\" указывает текущее состояние раскрывающегося меню или аккордеона."
    },
    {
      q: "Какой HTTP-метод используется для создания новых данных на сервере?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      answer: 1,
      explain: "GET — получение данных, POST — создание, PUT/PATCH — обновление, DELETE — удаление."
    },
    {
      q: "Какие кавычки допустимы для ключей и строк в формате JSON?",
      options: ["Только одинарные", "Только двойные", "Любые", "Без кавычек"],
      answer: 1,
      explain: "В стандарте JSON все ключи и строковые значения пишутся строго в двойных кавычках."
    },
    {
      q: "Считает ли встроенная функция fetch() ответ сервера со статусом 404 ошибкой?",
      options: ["Да, сразу попадает в catch", "Нет, промис выполняется успешно, так как ответ получен", "Да, но только при GET-запросе", "Зависит от браузера"],
      answer: 1,
      explain: "fetch отклоняет промис только при сетевом сбое. Ошибку 404 нужно проверять вручную через response.ok."
    },
    {
      q: "Как правильно проверить, что HTTP-ответ от fetch прошёл без ошибок (статус 200–299)?",
      options: ["if (response.error)", "if (!response.ok)", "if (response.json())", "try / catch"],
      answer: 1,
      explain: "Свойство response.ok равно true только при успешных статусах 200–299."
    },
    {
      q: "Что делает система DNS?",
      options: ["Шифрует соединение по HTTPS", "Переводит доменное имя в числовой IP-адрес", "Хранит файлы сайта", "Проверяет код на ошибки"],
      answer: 1,
      explain: "DNS — это «телефонная книга интернета», связывающая понятные домены с IP-адресами серверов."
    },
    {
      q: "Почему на GitHub Pages могут не подключиться стили, если написать href=\"/css/style.css\"?",
      options: ["GitHub не поддерживает папку css", "Слеш в начале ищет папку в корне домена, а не в папке репозитория", "Нужно писать style.css без папки", "Браузер блокирует локальные пути"],
      answer: 1,
      explain: "На GitHub Pages сайт лежит в подпапке репозитория, поэтому путь нужно писать без начального слеша: css/style.css."
    },
    {
      q: "Какая последовательность команд Git отправляет изменения в удалённый репозиторий?",
      options: ["git init -> git push -> git commit", "git add . -> git commit -m \"...\" -> git push", "git pull -> git add -> git branch", "git status -> git clone -> git push"],
      answer: 1,
      explain: "Сначала индексируем файлы (add), затем фиксируем снимок (commit) и отправляем на GitHub (push)."
    },
    {
      q: "В чём главное отличие тега <a> от тега <button> с точки зрения семантики?",
      options: ["<a> — для перехода по адресу/якорю, <button> — для действия на странице", "Никакой разницы нет", "<button> нельзя стилизовать в CSS", "<a> работает только с JavaScript"],
      answer: 0,
      explain: "Ссылки ведут на другие страницы или разделы, а кнопки выполняют действия (отправка, закрытие модалки)."
    },
    {
      q: "Какой метод преобразует JSON-строку, полученную от сервера, в обычный JS-объект?",
      options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "Response.text()"],
      answer: 1,
      explain: "JSON.parse() превращает строку в объект JavaScript, а JSON.stringify() делает обратное преобразование."
    }
  ];

  const quizCard = $("#quizCard");
  const quizCount = $("#quizCount");
  const quizScore = $("#quizScore");
  const quizBar = $("#quizBar");
  const quizNext = $("#quizNext");
  const quizRestart = $("#quizRestart");
  let qIndex = 0;
  let score = 0;
  let answered = false;
  let finished = false;

  function renderQuiz() {
    if (!quizCard) return;
    finished = false;

    if (qIndex >= quiz.length) {
      finished = true;
      if (quizBar) quizBar.style.width = "100%";
      if (quizCount) quizCount.textContent = "Тест завершён";
      if (quizNext) {
        quizNext.disabled = true;
        quizNext.textContent = "Тест завершён";
      }
      const pct = Math.round((score / quiz.length) * 100);
      const msg =
        pct >= 80
          ? "Отличный результат! Семестр усвоен на максимум."
          : pct >= 50
          ? "Хороший результат! Почти все темы закреплены."
          : "Есть повод заглянуть в лекции выше и попробовать снова.";
      quizCard.innerHTML = `<div class="quiz-result"><div class="result-score">${score} / ${quiz.length}</div><div class="result-msg">${msg}</div><div class="result-sub">Вы ответили правильно на ${pct}% вопросов по программе семестра.</div></div>`;
      return;
    }

    const item = quiz[qIndex];
    answered = false;
    if (quizCount) quizCount.textContent = `Вопрос ${qIndex + 1} / ${quiz.length}`;
    if (quizScore) quizScore.textContent = `Верно: ${score}`;
    if (quizBar) quizBar.style.width = (qIndex / quiz.length) * 100 + "%";

    const optionsHtml = item.options
      .map(
        (o, i) =>
          `<button class="quiz-opt" data-i="${i}"><span class="key">${String.fromCharCode(65 + i)}</span><span>${escapeHtml(o)}</span></button>`
      )
      .join("");

    quizCard.innerHTML = `
      <div class="quiz-q">${escapeHtml(item.q)}</div>
      <div class="quiz-options">${optionsHtml}</div>
      <div class="quiz-explain" id="quizExplain"></div>`;

    quizCard.querySelectorAll(".quiz-opt").forEach((b) =>
      b.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = +b.dataset.i;
        quizCard.querySelectorAll(".quiz-opt").forEach((o, i) => {
          o.disabled = true;
          if (i === item.answer) o.classList.add("correct");
        });
        if (chosen === item.answer) {
          score++;
        } else {
          b.classList.add("wrong");
        }
        const ex = $("#quizExplain");
        if (ex) {
          ex.textContent = item.explain;
          ex.classList.add("show");
        }
        if (quizScore) quizScore.textContent = `Верно: ${score}`;
        if (quizNext) quizNext.disabled = false;
      })
    );

    if (quizNext) {
      quizNext.disabled = true;
      quizNext.textContent = qIndex === quiz.length - 1 ? "Показать результат ->" : "Следующий вопрос ->";
    }
  }

  if (quizNext) {
    quizNext.addEventListener("click", () => {
      if (!finished && answered) {
        qIndex++;
        renderQuiz();
      }
    });
  }

  if (quizRestart) {
    quizRestart.addEventListener("click", () => {
      qIndex = 0;
      score = 0;
      renderQuiz();
    });
  }

  renderQuiz();
})();
