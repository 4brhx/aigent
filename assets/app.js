// AIgent — front-end only. Simulates streaming responses.
// Design: AI-Native UI (UI/UX Pro Max skill v2.5)

/* ============== MODELS ============== */
const MODELS = [
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    vendor: "Google",
    tag: "Multimodal",
    accent: "#1A73E8",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true">
        <defs>
          <linearGradient id="gem-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#1C6FF3"/>
            <stop offset="55%" stop-color="#9168F0"/>
            <stop offset="100%" stop-color="#F94B8A"/>
          </linearGradient>
        </defs>
        <path fill="url(#gem-g)" d="M12 2c.6 4.5 3.5 7.4 8 8-4.5.6-7.4 3.5-8 8-.6-4.5-3.5-7.4-8-8 4.5-.6 7.4-3.5 8-8Z"/>
      </svg>`,
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    vendor: "Anthropic",
    tag: "تحليل عميق",
    accent: "#D97757",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#D97757"/>
        <path fill="#fff" d="M8.6 8.5c.6-1.4 2-2.3 3.5-2.3 2 0 3.6 1.6 3.6 3.6 0 1.4-.8 2.6-1.9 3.2.7.4 1.2 1.1 1.5 1.9.4 1.5-.4 3-1.9 3.4-1.5.4-3-.4-3.4-1.9-.1-.5-.6-.8-1.1-.7l-.7.2c-.5.1-.9-.2-1-.7l-.6-2.1c-.1-.5.2-1 .7-1l.7-.2c.5-.1.8-.6.7-1.1l-.4-1.6c-.1-.5.2-1 .7-1l.6-.2-.7-.2c-.5-.1-.8-.6-.7-1.1.1-.4.4-.7.8-.8h.2l-.7.2Z"/>
      </svg>`,
  },
  {
    id: "chatgpt",
    name: "ChatGPT (GPT-4o)",
    vendor: "OpenAI",
    tag: "متعدد الاستخدامات",
    accent: "#10A37F",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true" fill="#10A37F">
        <path d="M22.3 9.9a5.5 5.5 0 0 0-.5-4.5 5.6 5.6 0 0 0-6-2.7A5.5 5.5 0 0 0 11.7 1a5.6 5.6 0 0 0-5.3 3.9 5.5 5.5 0 0 0-3.7 2.7 5.6 5.6 0 0 0 .7 6.6 5.5 5.5 0 0 0 .5 4.5 5.6 5.6 0 0 0 6 2.7 5.5 5.5 0 0 0 4.1 1.7 5.6 5.6 0 0 0 5.3-3.9 5.5 5.5 0 0 0 3.7-2.7 5.6 5.6 0 0 0-.7-6.6Zm-8.3 11.6a4.1 4.1 0 0 1-2.7-1l.1-.1 4.5-2.6c.2-.1.4-.4.4-.7v-6.4l1.9 1.1v5.2a4.2 4.2 0 0 1-4.2 4.5Zm-9-3.8a4.1 4.1 0 0 1-.5-2.8v-.1l4.5 2.6c.2.1.5.1.8 0l5.5-3.2v2.2L11 19c-.2.1-.4.1-.6 0L5 16.4Zm-1.2-9.7a4.1 4.1 0 0 1 2.2-1.8v5.3c0 .3.1.5.4.7l5.5 3.2-1.9 1.1L4.5 14a4.2 4.2 0 0 1-.7-5.8Zm15.6 3.6L13.9 8.4c-.2-.1-.5-.1-.8 0l-5.5 3.2V9.4l4.8-2.8c.2-.1.4-.1.6 0l4.8 2.8.7-.5Zm.9-1.7-.1.1L16 7.3c-.2-.1-.5-.1-.8 0L9.7 10.5V8.3l4.8-2.8c.2-.1.4-.1.6 0l4.8 2.8a4.2 4.2 0 0 1 .4 4.5l-.6 1Zm-12-2.6L7.4 6.5V11.7c0 .3.1.5.4.7l5.5 3.1-1.9 1.1-4.8-2.8c-.2-.1-.4-.4-.4-.7l.1-5.8Zm1 4.7L11 9.4 13.4 11l-2.7 1.5L8.4 11Z"/>
      </svg>`,
  },
  {
    id: "deepseek",
    name: "DeepSeek V3",
    vendor: "DeepSeek",
    tag: "استدلال + كود",
    accent: "#4D6BFE",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true">
        <defs>
          <linearGradient id="ds-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#4D6BFE"/>
            <stop offset="100%" stop-color="#7C8DFF"/>
          </linearGradient>
        </defs>
        <path fill="url(#ds-g)" d="M19.5 7.2c-.6-.4-1.2-.7-1.9-.9.3.4.5 1 .5 1.5 0 1.4-1.2 2.6-2.6 2.6-1 0-1.9-.6-2.3-1.4-.9.7-1.6 1.6-2 2.7-2.4.4-4.2 2.5-4.2 5 0 2.8 2.3 5.1 5.1 5.1.7 0 1.4-.1 2-.4.5.2 1 .4 1.5.4 1.7 0 3.2-1 3.9-2.5 1.7-.8 2.9-2.5 2.9-4.5 0-2-1.2-3.7-2.9-4.5.1-.4.1-.8.1-1.2 0-.6-.1-1.2-.1-1.9Zm-7.7 11.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5Zm.6-3.6c-.4 0-.7.3-.7.7 0 .4.3.7.7.7s.7-.3.7-.7c0-.4-.3-.7-.7-.7Z"/>
        <circle cx="15.6" cy="7.6" r="1.4" fill="url(#ds-g)"/>
      </svg>`,
  },
];

/* ============== STATE ============== */
const STATE = {
  modelId: localStorage.getItem("aigent.model") || "gemini",
  conversations: [],
  activeId: null,
  generating: false,
  abort: false,
};

const SAMPLE_CONVS = [
  { id: cid(), title: "خطة تسويقية لمتجر إلكتروني", group: "اليوم", model: "claude" },
  { id: cid(), title: "ترجمة عقد إيجار للعربية", group: "اليوم", model: "gemini" },
  { id: cid(), title: "مراجعة كود React + Tailwind", group: "أمس", model: "deepseek" },
  { id: cid(), title: "تلخيص ورقة بحثية عن LLMs", group: "أمس", model: "chatgpt" },
  { id: cid(), title: "أفكار لبودكاست تقني", group: "هذا الأسبوع", model: "gemini" },
];
STATE.conversations = SAMPLE_CONVS;
STATE.activeId = SAMPLE_CONVS[0].id;

/* ============== HELPERS ============== */
function cid() { return Math.random().toString(36).slice(2, 10); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function getModel(id = STATE.modelId) {
  return MODELS.find((m) => m.id === id) || MODELS[0];
}
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatRich(text) {
  // Light markdown: **bold**, `inline code`, links, line breaks preserved by white-space
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\b(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color: var(--accent); text-decoration: underline;">$1</a>');
  return s;
}

/* ============== RENDER: Sidebar conversations ============== */
function renderConversationList(filter = "") {
  const list = $("#conversationList");
  const groups = {};
  STATE.conversations
    .filter((c) => !filter || c.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((c) => {
      groups[c.group] ??= [];
      groups[c.group].push(c);
    });

  const html = Object.entries(groups)
    .map(([group, items]) => {
      return `
        <div>
          <div class="conv-group-label">${group}</div>
          ${items
            .map((c) => {
              const m = getModel(c.model);
              return `
                <button class="conv-item" role="button" data-id="${c.id}"
                  aria-current="${c.id === STATE.activeId}">
                  <span class="dot"></span>
                  <span class="title">${escapeHtml(c.title)}</span>
                  <span class="meta" title="${escapeHtml(m.name)}">${m.vendor}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      `;
    })
    .join("");
  list.innerHTML =
    html ||
    `<div class="px-4 py-6 text-center text-xs text-muted">لا توجد نتائج</div>`;

  $$(".conv-item", list).forEach((el) => {
    el.addEventListener("click", () => {
      STATE.activeId = el.dataset.id;
      renderConversationList(filter);
      // For demo, switching just updates title — keeps current chat
      const conv = STATE.conversations.find((c) => c.id === STATE.activeId);
      if (conv) $("#chatTitle").textContent = conv.title;
      closeMobileSidebar();
    });
  });
}

/* ============== RENDER: Models ============== */
function renderModelGrid() {
  const grid = $("#modelGrid");
  grid.innerHTML = MODELS.map((m) => {
    const active = m.id === STATE.modelId;
    return `
      <button class="model-card" type="button" data-id="${m.id}"
        aria-pressed="${active}" title="${escapeHtml(m.name)}">
        <span class="model-icon">${m.icon}</span>
        <span class="name">${escapeHtml(m.id === "chatgpt" ? "ChatGPT" : m.name.split(" ")[0])}</span>
        <span class="vendor">${escapeHtml(m.vendor)} · ${escapeHtml(m.tag)}</span>
        <span class="check" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="w-2.5 h-2.5" fill="none">
            <path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>`;
  }).join("");

  $$(".model-card", grid).forEach((el) => {
    el.addEventListener("click", () => selectModel(el.dataset.id));
  });
}

function renderModelPill() {
  const m = getModel();
  $("#modelPillIcon").innerHTML = m.icon;
  $("#modelPillName").textContent = m.name;
}

function renderModelMenu() {
  const menu = $("#modelMenu");
  menu.innerHTML = MODELS.map((m) => {
    const sel = m.id === STATE.modelId;
    return `
      <button type="button" class="row" role="option" data-id="${m.id}"
        aria-selected="${sel}">
        <span class="model-icon">${m.icon}</span>
        <span class="flex-1 min-w-0 text-start">
          <div class="text-sm font-semibold truncate">${escapeHtml(m.name)}</div>
          <div class="meta">${escapeHtml(m.vendor)} · ${escapeHtml(m.tag)}</div>
        </span>
        ${
          sel
            ? `<svg viewBox="0 0 24 24" class="w-4 h-4 text-[color:var(--primary)]" fill="none">
                <path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="2.4"
                  stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`
            : ""
        }
      </button>`;
  }).join("");

  $$(".row", menu).forEach((el) => {
    el.addEventListener("click", () => {
      selectModel(el.dataset.id);
      toggleModelMenu(false);
    });
  });
}

function selectModel(id) {
  STATE.modelId = id;
  localStorage.setItem("aigent.model", id);
  renderModelGrid();
  renderModelPill();
  renderModelMenu();
}

function toggleModelMenu(force) {
  const menu = $("#modelMenu");
  const willOpen = force ?? menu.classList.contains("hidden");
  menu.classList.toggle("hidden", !willOpen);
  $("#modelPill").setAttribute("aria-expanded", String(willOpen));
}

/* ============== SUGGESTIONS ============== */
const SUGGESTIONS = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" class="w-[14px] h-[14px]"><path d="M4 4h16v12H5l-1 4V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    h: "اشرح لي مفهوماً معقداً",
    p: "بسّط لي مفهوم الـ Transformers في تعلّم الآلة بأسلوب مبسّط.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" class="w-[14px] h-[14px]"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    h: "ساعدني في كتابة كود",
    p: "اكتب دالة JavaScript لحساب فيبوناتشي بطريقة Memoization.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" class="w-[14px] h-[14px]"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    h: "أفكار للعمل",
    p: "أعطني 5 أفكار مشاريع SaaS قابلة للتنفيذ هذا العام.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" class="w-[14px] h-[14px]"><path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    h: "ساعدني في الكتابة",
    p: "اصِغ بريداً احترافياً للاعتذار عن تأخر تسليم مشروع.",
  },
];

function renderSuggestions() {
  const grid = $("#suggestionsGrid");
  grid.innerHTML = SUGGESTIONS.map(
    (s, i) => `
    <button class="suggestion" type="button" data-i="${i}" tabindex="0">
      <span class="icon">${s.icon}</span>
      <span class="h">${escapeHtml(s.h)}</span>
      <span class="p">${escapeHtml(s.p)}</span>
    </button>`
  ).join("");

  $$(".suggestion", grid).forEach((el) => {
    el.addEventListener("click", () => {
      const s = SUGGESTIONS[+el.dataset.i];
      const ta = $("#prompt");
      ta.value = s.p;
      ta.dispatchEvent(new Event("input"));
      ta.focus();
    });
  });
}

/* ============== MESSAGES ============== */
function ensureChatVisible() {
  $("#emptyState").style.display = "none";
}
function ensureEmptyIfNoMessages() {
  if (!$("#messages").children.length) {
    $("#emptyState").style.display = "";
  }
}

function renderUserMessage(text) {
  const li = document.createElement("li");
  li.className = "msg user";
  li.innerHTML = `
    <div class="row">
      <div class="bubble">${formatRich(text)}</div>
    </div>
    <div class="meta-row">
      <span>${new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}</span>
      <span>·</span>
      <span>أنت</span>
    </div>`;
  $("#messages").appendChild(li);
  scrollToBottom();
}

function renderAssistantPlaceholder() {
  const m = getModel();
  const li = document.createElement("li");
  li.className = "msg ai";
  li.innerHTML = `
    <div class="row">
      <div class="ai-avatar">${m.icon}</div>
      <div class="bubble">
        <div class="typing" aria-label="جاري الكتابة">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
    <div class="meta-row">
      <span>${escapeHtml(m.name)}</span>
      <span class="actions">
        <button class="action-btn" data-action="copy" title="نسخ" aria-label="نسخ">
          <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="action-btn" data-action="regenerate" title="إعادة التوليد" aria-label="إعادة">
          <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
            <path d="M3 12a9 9 0 0 1 15.5-6.3M21 12a9 9 0 0 1-15.5 6.3M21 4v5h-5M3 20v-5h5"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="action-btn" data-action="like" title="مفيد" aria-label="مفيد">
          <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
            <path d="M7 11V21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0 5-8a2.5 2.5 0 0 1 2.5 3L13 11h6.5a2 2 0 0 1 2 2.4l-1.5 6A2 2 0 0 1 18 21H7"
              stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>
    </div>`;
  $("#messages").appendChild(li);
  scrollToBottom();
  return li;
}

/* ============== STREAMING SIMULATION ============== */
const REPLY_BANK = {
  gemini: [
    "بالتأكيد! إليك إجابة منظّمة:\n\n**النقاط الرئيسية:**\n• أولاً: نحدد السياق بدقّة قبل البدء.\n• ثانياً: نقسّم المهمة إلى خطوات واضحة.\n• ثالثاً: نفحص النتيجة مقابل المطلوب الأصلي.\n\nهل تودّ أن أتعمّق في إحدى النقاط؟ يمكنني أيضاً تحويلها إلى قائمة مهام قابلة للتنفيذ.",
    "خيار جيد للسؤال. سأجيبك من زاويتين:\n\n1. **الناحية النظرية:** المفهوم يقوم على ربط `المدخلات` بـ `السياق` ثم توليد المخرجات وفق احتمالات.\n2. **الناحية العملية:** ابدأ بأبسط مثال ثم وسّعه تدريجياً، وراقب التكلفة.\n\nأضف لي تفاصيل أكثر لأخصّص الإجابة.",
  ],
  claude: [
    "سؤال ممتاز، دعني أُفكّر فيه بعناية قبل أن أُجيب.\n\nأرى أن الجواب يتفرّع إلى ثلاث طبقات:\n\n• **الطبقة المفاهيمية:** ما الذي نحاول حقّاً تحقيقه؟\n• **الطبقة العملية:** ما الأدوات والمدخلات المتاحة؟\n• **الطبقة التقييمية:** كيف نعرف أنّنا نجحنا؟\n\nأنصحك بالبدء من الطبقة الأولى لأنها تحدّد بقية القرارات. هل تريد أن أُكمل التفصيل؟",
    "أتفهم ما تطلبه. سأكون صريحاً: المسألة بها مقايضات.\n\n- إذا أردت السرعة، اختر الحل البسيط ولو على حساب المرونة.\n- إذا أردت قابلية التوسّع، استثمر في البنية مبكراً.\n\nالاختيار الأمثل يعتمد على **سياقك**. شاركني معاييرك لأقدّم توصية محدّدة.",
  ],
  chatgpt: [
    "تمام! خلّيني أساعدك خطوة بخطوة:\n\n**خطّة سريعة:**\n1. حدّد الهدف النهائي بكلمة واحدة.\n2. اكتب قائمة بالموارد المتاحة.\n3. ابدأ بأصغر إصدار قابل للعمل (`MVP`).\n4. اجمع الملاحظات وكرّر.\n\nلو تحب أعطيك مثال تطبيقي مباشر على حالتك، اكتب لي تفاصيل المشروع وسأجهّز خطة مفصّلة.",
    "أكيد، إليك إجابة مباشرة بدون لفّ:\n\nالأفضل أن تركّز على **النتيجة** بدل التركيز على الأدوات. أدوات كثيرة ستوصلك لنفس الهدف، لكن وضوح الهدف هو ما يفرّق بين النجاح والتأخير.\n\nاكتب لي ما هو الناتج الذي تريده بنهاية اليوم — وسأرسم لك المسار.",
  ],
  deepseek: [
    "دعنا نحلّ هذا بطريقة هندسية:\n\n```js\n// مثال على نمط Memoization\nconst memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const v = fib(n - 1) + fib(n - 2);\n  memo.set(n, v);\n  return v;\n}\n```\n\n**التحليل:**\n• تعقيد زمني: `O(n)` بدلاً من `O(2^n)`.\n• تعقيد مكاني: `O(n)` للمخزن المؤقّت.\n\nهل تريد نسخة Iterative أكثر كفاءة في الذاكرة؟",
    "تحليل منطقي للمسألة:\n\n1. **المُدخل:** ما هي البيانات الأوّلية؟\n2. **التحويل:** ما العمليات اللازمة؟\n3. **المُخرَج:** ما الشكل النهائي المتوقّع؟\n\nإذا أعطيتني عيّنة من البيانات، أستطيع أن أكتب لك حلّاً مع اختبارات (`unit tests`) قابلة للتشغيل.",
  ],
};

function pickReply(modelId) {
  const arr = REPLY_BANK[modelId] || REPLY_BANK.gemini;
  return arr[Math.floor(Math.random() * arr.length)];
}

async function streamResponse(bubbleEl, fullText) {
  bubbleEl.innerHTML = "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    bubbleEl.innerHTML = formatRich(fullText);
    return;
  }
  const tokens = fullText.match(/(\s+|\S+)/g) || [fullText];
  let acc = "";
  for (let i = 0; i < tokens.length; i++) {
    if (STATE.abort) break;
    acc += tokens[i];
    bubbleEl.innerHTML = formatRich(acc) + `<span class="caret"></span>`;
    scrollToBottom(true);
    // tiny variable delay for natural feel
    const base = tokens[i].match(/[.\u060C\u061F!?]/) ? 90 : 16;
    const jitter = Math.random() * 18;
    await sleep(base + jitter);
  }
  bubbleEl.innerHTML = formatRich(acc);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ============== SUBMIT ============== */
async function handleSubmit(e) {
  e.preventDefault();
  if (STATE.generating) {
    STATE.abort = true;
    return;
  }
  const ta = $("#prompt");
  const text = ta.value.trim();
  if (!text) return;

  ensureChatVisible();
  renderUserMessage(text);
  ta.value = "";
  ta.dispatchEvent(new Event("input"));
  ta.style.height = "auto";

  STATE.generating = true;
  STATE.abort = false;
  setSendingUI(true);

  const li = renderAssistantPlaceholder();
  const bubble = li.querySelector(".bubble");
  // small thinking delay then start streaming
  await sleep(450 + Math.random() * 400);
  if (STATE.abort) { afterGeneration(); return; }

  const reply = pickReply(STATE.modelId);
  await streamResponse(bubble, reply);
  afterGeneration();

  // wire actions on this message
  li.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () => onMessageAction(btn.dataset.action, bubble));
  });
}

function afterGeneration() {
  STATE.generating = false;
  STATE.abort = false;
  setSendingUI(false);
}

function setSendingUI(isSending) {
  const btn = $("#sendBtn");
  const send = btn.querySelector(".send-icon");
  const stop = btn.querySelector(".stop-icon");
  btn.disabled = isSending ? false : !$("#prompt").value.trim();
  send.classList.toggle("hidden", isSending);
  stop.classList.toggle("hidden", !isSending);
  btn.setAttribute("aria-label", isSending ? "إيقاف التوليد" : "إرسال");
}

function onMessageAction(action, bubble) {
  if (action === "copy") {
    const text = bubble.innerText.trim();
    navigator.clipboard?.writeText(text);
    flashToast("تم النسخ");
  } else if (action === "regenerate") {
    // Re-stream with a different reply
    const reply = pickReply(STATE.modelId);
    streamResponse(bubble, reply);
  } else if (action === "like") {
    flashToast("شكراً على التقييم");
  }
}

let toastTimer;
function flashToast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    Object.assign(t.style, {
      position: "fixed",
      bottom: "24px",
      insetInlineEnd: "24px",
      padding: "10px 14px",
      background: "var(--bg-elev)",
      border: "1px solid var(--divider)",
      borderRadius: "10px",
      fontSize: "12.5px",
      color: "var(--fg)",
      boxShadow: "0 12px 30px -12px rgba(0,0,0,.3)",
      zIndex: 100,
      transition: "opacity 200ms, transform 200ms",
      opacity: "0",
      transform: "translateY(6px)",
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => {
    t.style.opacity = "1";
    t.style.transform = "translateY(0)";
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(6px)";
  }, 1600);
}

/* ============== SCROLL HELPERS ============== */
function scrollToBottom(soft = false) {
  const sc = $("#chatScroll");
  if (soft) {
    // only auto-scroll if user is near bottom
    const distance = sc.scrollHeight - sc.scrollTop - sc.clientHeight;
    if (distance > 200) return;
  }
  sc.scrollTo({ top: sc.scrollHeight, behavior: "smooth" });
}

function updateScrollDownBtn() {
  const sc = $("#chatScroll");
  const btn = $("#scrollDownBtn");
  const distance = sc.scrollHeight - sc.scrollTop - sc.clientHeight;
  btn.classList.toggle("hidden", distance < 200 || !$("#messages").children.length);
}

/* ============== COMPOSER ============== */
function setupComposer() {
  const ta = $("#prompt");
  const btn = $("#sendBtn");
  const charCount = $("#charCount");

  ta.addEventListener("input", () => {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
    charCount.textContent = ta.value.length;
    btn.disabled = !ta.value.trim() && !STATE.generating;
  });

  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      $("#composer").requestSubmit();
    }
  });

  $("#composer").addEventListener("submit", handleSubmit);

  // chips toggle
  $$(".chip").forEach((c) =>
    c.addEventListener("click", () => {
      const pressed = c.getAttribute("aria-pressed") === "true";
      c.setAttribute("aria-pressed", String(!pressed));
    })
  );
}

/* ============== KEYBOARD SHORTCUTS ============== */
function setupShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Cmd/Ctrl + N — new chat
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      newChat();
    }
    // "/" focus search if not in input
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      $("#searchInput").focus();
    }
    // Escape closes model menu / mobile sidebar
    if (e.key === "Escape") {
      toggleModelMenu(false);
      closeMobileSidebar();
    }
  });
}

/* ============== UI ACTIONS ============== */
function newChat() {
  $("#messages").innerHTML = "";
  $("#chatTitle").textContent = "محادثة جديدة";
  ensureEmptyIfNoMessages();
  $("#prompt").focus();
}

function clearActions() {
  $$("[data-action]").forEach((el) => {
    el.addEventListener("click", () => {
      const action = el.dataset.action;
      switch (action) {
        case "new-chat": newChat(); break;
        case "toggle-theme": toggleTheme(); break;
        case "open-sidebar": openMobileSidebar(); break;
        case "scroll-down": scrollToBottom(); break;
        case "clear":
          if ($("#messages").children.length) {
            $("#messages").innerHTML = "";
            ensureEmptyIfNoMessages();
            flashToast("تم مسح المحادثة");
          }
          break;
        case "share": flashToast("تم نسخ رابط المحادثة"); break;
        case "attach": flashToast("الإرفاق متاح في الإصدار الكامل"); break;
      }
    });
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("aigent.theme", next);
}

function openMobileSidebar() {
  const sb = $("#sidebar");
  sb.dataset.open = "true";
  sb.classList.remove("hidden");
  $("#sidebarOverlay").classList.remove("hidden");
}
function closeMobileSidebar() {
  if (window.matchMedia("(min-width: 768px)").matches) return;
  const sb = $("#sidebar");
  sb.dataset.open = "false";
  $("#sidebarOverlay").classList.add("hidden");
}

/* ============== INIT ============== */
function init() {
  // Theme
  const savedTheme = localStorage.getItem("aigent.theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  renderConversationList();
  renderModelGrid();
  renderModelMenu();
  renderModelPill();
  renderSuggestions();
  setupComposer();
  setupShortcuts();
  clearActions();

  // Search filter
  $("#searchInput").addEventListener("input", (e) =>
    renderConversationList(e.target.value)
  );

  // Model pill toggle
  $("#modelPill").addEventListener("click", () => toggleModelMenu());
  document.addEventListener("click", (e) => {
    const menu = $("#modelMenu");
    const pill = $("#modelPill");
    if (!menu.contains(e.target) && !pill.contains(e.target)) {
      toggleModelMenu(false);
    }
  });

  // Sidebar overlay
  $("#sidebarOverlay").addEventListener("click", closeMobileSidebar);

  // Scroll
  $("#chatScroll").addEventListener("scroll", updateScrollDownBtn);
  window.addEventListener("resize", updateScrollDownBtn);

  // Initial focus
  setTimeout(() => $("#prompt").focus(), 80);
}

document.addEventListener("DOMContentLoaded", init);
