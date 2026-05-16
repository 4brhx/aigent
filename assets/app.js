// AIgent — front-end (v2). Built by IB.
// Design tokens from UI/UX Pro Max skill (AI-Native UI style).
// All conversations are persisted in localStorage and switching works.

/* ============================================================
   MODELS
   ============================================================ */
const MODELS = [
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    short: "Gemini",
    vendor: "Google",
    tag: "Multimodal",
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
    short: "Claude",
    vendor: "Anthropic",
    tag: "تحليل عميق",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#D97757"/>
        <path fill="#fff" d="M9.4 7.5h1.8l3 9h-1.7l-.7-2.1H8.7L8 16.5H6.3l3.1-9Zm-.3 5.5h2.5l-1.2-3.8-1.3 3.8Zm6.4-5.5h1.6v9h-1.6v-9Z"/>
      </svg>`,
  },
  {
    id: "chatgpt",
    name: "ChatGPT (GPT-4o)",
    short: "ChatGPT",
    vendor: "OpenAI",
    tag: "متعدد الاستخدامات",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true" fill="#10A37F">
        <path d="M22.3 9.9a5.5 5.5 0 0 0-.5-4.5 5.6 5.6 0 0 0-6-2.7A5.5 5.5 0 0 0 11.7 1a5.6 5.6 0 0 0-5.3 3.9 5.5 5.5 0 0 0-3.7 2.7 5.6 5.6 0 0 0 .7 6.6 5.5 5.5 0 0 0 .5 4.5 5.6 5.6 0 0 0 6 2.7 5.5 5.5 0 0 0 4.1 1.7 5.6 5.6 0 0 0 5.3-3.9 5.5 5.5 0 0 0 3.7-2.7 5.6 5.6 0 0 0-.7-6.6Zm-8.3 11.6a4.1 4.1 0 0 1-2.7-1l.1-.1 4.5-2.6c.2-.1.4-.4.4-.7v-6.4l1.9 1.1v5.2a4.2 4.2 0 0 1-4.2 4.5Zm-9-3.8a4.1 4.1 0 0 1-.5-2.8v-.1l4.5 2.6c.2.1.5.1.8 0l5.5-3.2v2.2L11 19c-.2.1-.4.1-.6 0L5 16.4Zm-1.2-9.7a4.1 4.1 0 0 1 2.2-1.8v5.3c0 .3.1.5.4.7l5.5 3.2-1.9 1.1L4.5 14a4.2 4.2 0 0 1-.7-5.8Zm15.6 3.6L13.9 8.4c-.2-.1-.5-.1-.8 0l-5.5 3.2V9.4l4.8-2.8c.2-.1.4-.1.6 0l4.8 2.8.7-.5Z"/>
      </svg>`,
  },
  {
    id: "deepseek",
    name: "DeepSeek V3",
    short: "DeepSeek",
    vendor: "DeepSeek",
    tag: "استدلال + كود",
    icon: `
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true">
        <defs>
          <linearGradient id="ds-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#4D6BFE"/>
            <stop offset="100%" stop-color="#7C8DFF"/>
          </linearGradient>
        </defs>
        <path fill="url(#ds-g)" d="M19.5 7.2c-.6-.4-1.2-.7-1.9-.9.3.4.5 1 .5 1.5 0 1.4-1.2 2.6-2.6 2.6-1 0-1.9-.6-2.3-1.4-.9.7-1.6 1.6-2 2.7-2.4.4-4.2 2.5-4.2 5 0 2.8 2.3 5.1 5.1 5.1.7 0 1.4-.1 2-.4.5.2 1 .4 1.5.4 1.7 0 3.2-1 3.9-2.5 1.7-.8 2.9-2.5 2.9-4.5 0-2-1.2-3.7-2.9-4.5.1-.4.1-.8.1-1.2 0-.6-.1-1.2-.1-1.9Z"/>
        <circle cx="15.6" cy="7.6" r="1.4" fill="url(#ds-g)"/>
      </svg>`,
  },
];

/* ============================================================
   STORAGE
   ============================================================ */
const STORAGE_KEY = "aigent.state.v2";
const THEME_KEY = "aigent.theme";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.conversations)) return parsed;
    }
  } catch {}
  return null;
}

function saveState() {
  const data = {
    modelId: STATE.modelId,
    conversations: STATE.conversations,
    activeId: STATE.activeId,
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

/* ============================================================
   STATE
   ============================================================ */
const STATE = {
  modelId: "gemini",
  conversations: [],
  activeId: null,
  generating: false,
  abort: false,
};

function bootstrapState() {
  const persisted = loadState();
  if (persisted) {
    STATE.modelId = persisted.modelId || "gemini";
    STATE.conversations = persisted.conversations;
    STATE.activeId = persisted.activeId || persisted.conversations[0]?.id || null;
  } else {
    // First-run sample conversations
    STATE.modelId = "gemini";
    STATE.conversations = [
      {
        id: cid(), title: "خطة تسويقية لمتجر إلكتروني",
        modelId: "claude", messages: [], createdAt: Date.now() - 1000 * 60 * 60,
      },
      {
        id: cid(), title: "ترجمة عقد إيجار للعربية",
        modelId: "gemini", messages: [], createdAt: Date.now() - 1000 * 60 * 90,
      },
      {
        id: cid(), title: "مراجعة كود React + Tailwind",
        modelId: "deepseek", messages: [], createdAt: Date.now() - 1000 * 60 * 60 * 26,
      },
      {
        id: cid(), title: "تلخيص ورقة بحثية عن LLMs",
        modelId: "chatgpt", messages: [], createdAt: Date.now() - 1000 * 60 * 60 * 30,
      },
    ];
    STATE.activeId = STATE.conversations[0].id;
    saveState();
  }
}

function getActiveConv() {
  return STATE.conversations.find((c) => c.id === STATE.activeId);
}

function createConversation(opts = {}) {
  const conv = {
    id: cid(),
    title: opts.title || "محادثة جديدة",
    modelId: opts.modelId || STATE.modelId,
    messages: [],
    createdAt: Date.now(),
  };
  STATE.conversations.unshift(conv);
  STATE.activeId = conv.id;
  saveState();
  return conv;
}

function deleteConversation(id) {
  const idx = STATE.conversations.findIndex((c) => c.id === id);
  if (idx === -1) return;
  STATE.conversations.splice(idx, 1);
  if (STATE.activeId === id) {
    STATE.activeId =
      STATE.conversations[idx]?.id ||
      STATE.conversations[idx - 1]?.id ||
      STATE.conversations[0]?.id ||
      null;
    if (!STATE.activeId) {
      const fresh = createConversation();
      STATE.activeId = fresh.id;
    }
  }
  saveState();
}

function renameConversation(id, newTitle) {
  const c = STATE.conversations.find((c) => c.id === id);
  if (!c) return;
  c.title = (newTitle || "").trim() || c.title;
  saveState();
}

/* ============================================================
   HELPERS
   ============================================================ */
function cid() { return Math.random().toString(36).slice(2, 11); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function getModel(id) { return MODELS.find((m) => m.id === id) || MODELS[0]; }
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatRich(text) {
  let s = escapeHtml(text);
  s = s.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre style="background:var(--bg-soft);border:1px solid var(--divider);border-radius:10px;padding:10px 12px;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.6;margin:8px 0;"><code style="background:transparent;border:none;padding:0;">${code}</code></pre>`);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\b(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;">$1</a>');
  return s;
}
function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} س`;
  return `${Math.floor(diff / 86400)} ي`;
}
function groupOf(ts) {
  const diff = Date.now() - ts;
  const day = 1000 * 60 * 60 * 24;
  if (diff < day) return "اليوم";
  if (diff < day * 2) return "أمس";
  if (diff < day * 7) return "هذا الأسبوع";
  if (diff < day * 30) return "هذا الشهر";
  return "أقدم";
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ============================================================
   RENDER: Sidebar conversations
   ============================================================ */
function renderConversationList(filter = "") {
  const list = $("#conversationList");
  const f = filter.trim().toLowerCase();

  const filtered = STATE.conversations.filter(
    (c) => !f || c.title.toLowerCase().includes(f)
  );

  if (!filtered.length) {
    list.innerHTML = `<div class="conv-empty">لا توجد نتائج</div>`;
    return;
  }

  // Group by date bucket
  const groups = {};
  for (const c of filtered) {
    const g = groupOf(c.createdAt);
    (groups[g] ??= []).push(c);
  }
  // Preserve order
  const order = ["اليوم", "أمس", "هذا الأسبوع", "هذا الشهر", "أقدم"];
  const html = order
    .filter((g) => groups[g]?.length)
    .map((group) => {
      const items = groups[group];
      return `
        <div>
          <div class="conv-group-label">${group}</div>
          ${items.map(convItemHtml).join("")}
        </div>`;
    })
    .join("");
  list.innerHTML = html;

  // Wire interactions
  $$(".conv-item", list).forEach((el) => {
    const id = el.dataset.id;

    // Switch on click (but not when clicking action buttons)
    el.addEventListener("click", (e) => {
      if (e.target.closest(".conv-mini-btn") || e.target.closest(".conv-rename-input")) return;
      switchConversation(id);
    });

    // Action buttons
    const renameBtn = el.querySelector('[data-mini="rename"]');
    const deleteBtn = el.querySelector('[data-mini="delete"]');
    renameBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      startInlineRename(el, id);
    });
    deleteBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      onDeleteConversation(id);
    });
  });
}

function convItemHtml(c) {
  const m = getModel(c.modelId);
  const active = c.id === STATE.activeId;
  return `
    <div class="conv-item" role="button" data-id="${c.id}"
      aria-current="${active}" tabindex="0">
      <span class="conv-icon">${m.icon}</span>
      <span class="title">${escapeHtml(c.title)}</span>
      <span class="conv-actions">
        <button class="conv-mini-btn" data-mini="rename" title="إعادة تسمية" aria-label="إعادة تسمية">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
            <path d="M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="conv-mini-btn danger" data-mini="delete" title="حذف" aria-label="حذف">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
            <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>
    </div>`;
}

function startInlineRename(itemEl, id) {
  const titleEl = itemEl.querySelector(".title");
  const conv = STATE.conversations.find((c) => c.id === id);
  if (!conv) return;
  const input = document.createElement("input");
  input.className = "conv-rename-input";
  input.type = "text";
  input.value = conv.title;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    renameConversation(id, input.value);
    renderConversationList($("#searchInput").value);
    if (id === STATE.activeId) updateChatTitle();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); input.blur(); }
    if (e.key === "Escape") { e.preventDefault(); renderConversationList($("#searchInput").value); }
  });
  input.addEventListener("blur", commit, { once: true });
}

function onDeleteConversation(id) {
  const conv = STATE.conversations.find((c) => c.id === id);
  if (!conv) return;
  if (conv.messages.length && !confirm(`حذف "${conv.title}"؟`)) return;
  deleteConversation(id);
  renderAll();
  flashToast("تم حذف المحادثة");
}

function switchConversation(id) {
  if (STATE.generating) STATE.abort = true;
  STATE.activeId = id;
  saveState();
  renderConversationList($("#searchInput").value);
  renderActiveConversation();
  closeMobileSidebar();
}

/* ============================================================
   RENDER: Models
   ============================================================ */
function renderModelGrid() {
  const grid = $("#modelGrid");
  grid.innerHTML = MODELS.map((m) => {
    const active = m.id === STATE.modelId;
    return `
      <button class="model-card" type="button" data-id="${m.id}"
        aria-pressed="${active}" title="${escapeHtml(m.name)}">
        <span class="model-icon">${m.icon}</span>
        <span class="name">${escapeHtml(m.short)}</span>
        <span class="vendor">${escapeHtml(m.vendor)}</span>
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

  const tag = $("#activeModelTag");
  if (tag) tag.textContent = getModel(STATE.modelId).tag;
}

function renderModelPill() {
  const conv = getActiveConv();
  const id = conv?.modelId || STATE.modelId;
  const m = getModel(id);
  $("#modelPillIcon").innerHTML = m.icon;
  $("#modelPillName").textContent = m.name;
}

function renderModelMenu() {
  const menu = $("#modelMenu");
  const currentId = getActiveConv()?.modelId || STATE.modelId;
  menu.innerHTML = MODELS.map((m) => {
    const sel = m.id === currentId;
    return `
      <button type="button" class="row" role="option" data-id="${m.id}"
        aria-selected="${sel}">
        <span class="model-icon">${m.icon}</span>
        <span class="flex-1 min-w-0 text-start">
          <div class="text-sm font-semibold truncate">${escapeHtml(m.name)}</div>
          <div class="meta">${escapeHtml(m.vendor)} · ${escapeHtml(m.tag)}</div>
        </span>
        ${sel ? `<svg viewBox="0 0 24 24" class="w-4 h-4 text-[color:var(--primary)]" fill="none">
          <path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="2.4"
            stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}
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
  // Update active conversation's model only if it has no messages yet
  const conv = getActiveConv();
  if (conv && conv.messages.length === 0) {
    conv.modelId = id;
  }
  saveState();
  renderModelGrid();
  renderModelPill();
  renderModelMenu();
  renderConversationList($("#searchInput").value);
}

function toggleModelMenu(force) {
  const menu = $("#modelMenu");
  const willOpen = force ?? menu.classList.contains("hidden");
  menu.classList.toggle("hidden", !willOpen);
  $("#modelPill").setAttribute("aria-expanded", String(willOpen));
}

/* ============================================================
   SUGGESTIONS
   ============================================================ */
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
    p: "اصِغ بريداً احترافياً للاعتذار عن تأخّر تسليم مشروع.",
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

/* ============================================================
   RENDER: Active conversation
   ============================================================ */
function renderActiveConversation() {
  const conv = getActiveConv();
  const ol = $("#messages");
  ol.innerHTML = "";

  if (!conv || !conv.messages.length) {
    $("#emptyState").style.display = "";
  } else {
    $("#emptyState").style.display = "none";
    conv.messages.forEach((msg) => {
      if (msg.role === "user") appendUserMessage(msg.content, msg.ts, false);
      else appendAssistantMessage(msg.content, msg.modelId || conv.modelId, msg.ts, false);
    });
  }
  updateChatTitle();
  renderModelPill();
  renderModelMenu();
  renderModelGrid();
  setTimeout(() => scrollToBottom(false, true), 30);
}

function updateChatTitle() {
  const conv = getActiveConv();
  $("#chatTitle").textContent = conv?.title || "محادثة جديدة";
}

/* ============================================================
   MESSAGE RENDERING
   ============================================================ */
function appendUserMessage(text, ts = Date.now(), animate = true) {
  const li = document.createElement("li");
  li.className = "msg user";
  if (!animate) li.style.animation = "none";
  li.innerHTML = `
    <div class="row">
      <div class="bubble">${formatRich(text)}</div>
    </div>
    <div class="meta-row">
      <span>${formatTime(ts)}</span>
      <span>·</span>
      <span>أنت</span>
    </div>`;
  $("#messages").appendChild(li);
  scrollToBottom(true);
  return li;
}

function appendAssistantMessage(text, modelId, ts = Date.now(), animate = true, isPlaceholder = false) {
  const m = getModel(modelId || STATE.modelId);
  const li = document.createElement("li");
  li.className = "msg ai";
  if (!animate) li.style.animation = "none";
  li.innerHTML = `
    <div class="row">
      <div class="ai-avatar">${m.icon}</div>
      <div class="bubble">${
        isPlaceholder
          ? `<div class="typing" aria-label="جاري الكتابة"><span></span><span></span><span></span></div>`
          : formatRich(text || "")
      }</div>
    </div>
    <div class="meta-row">
      <span>${escapeHtml(m.name)}</span>
      <span>·</span>
      <span>${formatTime(ts)}</span>
      <span class="actions">
        <button class="action-btn" data-action="copy" title="نسخ" aria-label="نسخ">
          <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="action-btn" data-action="regenerate" title="إعادة" aria-label="إعادة">
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
  const bubble = li.querySelector(".bubble");

  // Wire actions
  li.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () => onMessageAction(btn.dataset.action, bubble, li));
  });

  scrollToBottom(true);
  return li;
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
}

/* ============================================================
   STREAMING SIMULATION
   ============================================================ */
const REPLY_BANK = {
  gemini: [
    "بالتأكيد! إليك إجابة منظّمة:\n\n**النقاط الرئيسية:**\n• أولاً: نحدّد السياق بدقّة قبل البدء.\n• ثانياً: نقسّم المهمة إلى خطوات واضحة.\n• ثالثاً: نفحص النتيجة مقابل المطلوب الأصلي.\n\nهل تودّ أن أتعمّق في إحدى النقاط؟",
    "خيار جيد للسؤال. سأجيبك من زاويتين:\n\n1. **الناحية النظرية:** المفهوم يقوم على ربط `المدخلات` بـ `السياق` ثم توليد المخرجات وفق احتمالات.\n2. **الناحية العملية:** ابدأ بأبسط مثال ثم وسّعه تدريجياً، وراقب التكلفة.\n\nأضف لي تفاصيل أكثر لأخصّص الإجابة.",
  ],
  claude: [
    "سؤال ممتاز، دعني أُفكّر فيه بعناية.\n\nأرى أن الجواب يتفرّع إلى ثلاث طبقات:\n\n• **الطبقة المفاهيمية:** ما الذي نحاول حقّاً تحقيقه؟\n• **الطبقة العملية:** ما الأدوات والمدخلات المتاحة؟\n• **الطبقة التقييمية:** كيف نعرف أنّنا نجحنا؟\n\nأنصحك بالبدء من الطبقة الأولى لأنها تحدّد بقية القرارات.",
    "أتفهم ما تطلبه. سأكون صريحاً: المسألة بها مقايضات.\n\n- إذا أردت السرعة، اختر الحل البسيط ولو على حساب المرونة.\n- إذا أردت قابلية التوسّع، استثمر في البنية مبكّراً.\n\nالاختيار الأمثل يعتمد على **سياقك**.",
  ],
  chatgpt: [
    "تمام! خلّيني أساعدك خطوة بخطوة:\n\n**خطّة سريعة:**\n1. حدّد الهدف النهائي بكلمة واحدة.\n2. اكتب قائمة بالموارد المتاحة.\n3. ابدأ بأصغر إصدار قابل للعمل (`MVP`).\n4. اجمع الملاحظات وكرّر.\n\nشاركني تفاصيل المشروع وسأعدّ خطة مفصّلة.",
    "أكيد، إليك إجابة مباشرة:\n\nالأفضل أن تركّز على **النتيجة** بدل الأدوات. أدوات كثيرة ستوصلك لنفس الهدف، لكن وضوح الهدف هو ما يفرّق بين النجاح والتأخير.",
  ],
  deepseek: [
    "دعنا نحلّ هذا بطريقة هندسية:\n\n```js\n// نمط Memoization\nconst memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const v = fib(n - 1) + fib(n - 2);\n  memo.set(n, v);\n  return v;\n}\n```\n\n**التحليل:**\n• تعقيد زمني: `O(n)` بدلاً من `O(2^n)`.\n• تعقيد مكاني: `O(n)` للمخزن المؤقّت.",
    "تحليل منطقي للمسألة:\n\n1. **المُدخل:** ما هي البيانات الأوّلية؟\n2. **التحويل:** ما العمليات اللازمة؟\n3. **المُخرَج:** ما الشكل النهائي المتوقّع؟\n\nأعطني عيّنة بيانات وأكتب لك الحلّ مع `unit tests`.",
  ],
};
function pickReply(modelId) {
  const arr = REPLY_BANK[modelId] || REPLY_BANK.gemini;
  return arr[Math.floor(Math.random() * arr.length)];
}

async function streamInto(bubbleEl, fullText) {
  bubbleEl.innerHTML = "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    bubbleEl.innerHTML = formatRich(fullText);
    return fullText;
  }
  const tokens = fullText.match(/(\s+|\S+)/g) || [fullText];
  let acc = "";
  for (let i = 0; i < tokens.length; i++) {
    if (STATE.abort) break;
    acc += tokens[i];
    bubbleEl.innerHTML = formatRich(acc) + `<span class="caret"></span>`;
    scrollToBottom(true);
    const base = /[.\u060C\u061F!?]/.test(tokens[i]) ? 75 : 14;
    await sleep(base + Math.random() * 16);
  }
  bubbleEl.innerHTML = formatRich(acc);
  return acc;
}

/* ============================================================
   SUBMIT
   ============================================================ */
async function handleSubmit(e) {
  e.preventDefault();
  if (STATE.generating) {
    STATE.abort = true;
    return;
  }
  const ta = $("#prompt");
  const text = ta.value.trim();
  if (!text) return;

  // Make sure we have an active conversation
  let conv = getActiveConv();
  if (!conv) conv = createConversation();

  // Auto-title from first user message
  const isFirst = conv.messages.length === 0;
  if (isFirst) {
    conv.title = text.length > 48 ? text.slice(0, 48) + "…" : text;
    conv.modelId = STATE.modelId;
  }
  conv.createdAt = Date.now(); // bump to top of list

  // Persist user message
  const userMsg = { role: "user", content: text, ts: Date.now() };
  conv.messages.push(userMsg);
  saveState();
  $("#emptyState").style.display = "none";
  appendUserMessage(text);

  ta.value = "";
  ta.dispatchEvent(new Event("input"));
  ta.style.height = "auto";

  STATE.generating = true;
  STATE.abort = false;
  setSendingUI(true);

  // Placeholder typing message
  const li = appendAssistantMessage("", conv.modelId, Date.now(), true, true);
  const bubble = li.querySelector(".bubble");

  await sleep(420 + Math.random() * 380);
  if (STATE.abort) {
    bubble.innerHTML = `<em style="color:var(--fg-subtle)">تمّ الإيقاف</em>`;
    afterGeneration();
    return;
  }

  const reply = pickReply(conv.modelId);
  const finalText = await streamInto(bubble, reply);

  // Persist assistant message
  conv.messages.push({
    role: "assistant",
    content: finalText,
    modelId: conv.modelId,
    ts: Date.now(),
  });
  saveState();
  afterGeneration();
  renderConversationList($("#searchInput").value);
  updateChatTitle();
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

function onMessageAction(action, bubble, li) {
  if (action === "copy") {
    const text = bubble.innerText.trim();
    navigator.clipboard?.writeText(text);
    flashToast("تم النسخ");
  } else if (action === "regenerate") {
    const conv = getActiveConv();
    if (!conv) return;
    const reply = pickReply(conv.modelId);
    streamInto(bubble, reply).then((finalText) => {
      // Update last assistant message in store
      for (let i = conv.messages.length - 1; i >= 0; i--) {
        if (conv.messages[i].role === "assistant") {
          conv.messages[i].content = finalText;
          conv.messages[i].ts = Date.now();
          break;
        }
      }
      saveState();
    });
  } else if (action === "like") {
    flashToast("شكراً على التقييم");
  }
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function flashToast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.querySelector(".msg-text").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ============================================================
   SCROLL HELPERS
   ============================================================ */
function scrollToBottom(soft = false, instant = false) {
  const sc = $("#chatScroll");
  if (!sc) return;
  if (soft) {
    const distance = sc.scrollHeight - sc.scrollTop - sc.clientHeight;
    if (distance > 220) return;
  }
  sc.scrollTo({
    top: sc.scrollHeight,
    behavior: instant ? "auto" : "smooth",
  });
}

function updateScrollDownBtn() {
  const sc = $("#chatScroll");
  const btn = $("#scrollDownBtn");
  const distance = sc.scrollHeight - sc.scrollTop - sc.clientHeight;
  btn.classList.toggle("hidden", distance < 220 || !$("#messages").children.length);
}

/* ============================================================
   COMPOSER
   ============================================================ */
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

  $$(".chip").forEach((c) =>
    c.addEventListener("click", () => {
      const pressed = c.getAttribute("aria-pressed") === "true";
      c.setAttribute("aria-pressed", String(!pressed));
    })
  );
}

/* ============================================================
   SHORTCUTS
   ============================================================ */
function setupShortcuts() {
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
      e.preventDefault();
      newChat();
    }
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      $("#searchInput").focus();
    }
    if (e.key === "Escape") {
      toggleModelMenu(false);
      closeMobileSidebar();
    }
  });
}

/* ============================================================
   ACTIONS
   ============================================================ */
function newChat() {
  // If active conversation is empty, just stay there
  const conv = getActiveConv();
  if (conv && conv.messages.length === 0) {
    $("#prompt").focus();
    closeMobileSidebar();
    return;
  }
  createConversation();
  renderAll();
  $("#prompt").focus();
  closeMobileSidebar();
}

function shareChat() {
  const conv = getActiveConv();
  if (!conv) return;
  const url = `${location.origin}${location.pathname}#chat=${conv.id}`;
  navigator.clipboard?.writeText(url);
  flashToast("تم نسخ رابط المحادثة");
}

function deleteCurrentChat() {
  const conv = getActiveConv();
  if (!conv) return;
  if (conv.messages.length && !confirm(`حذف "${conv.title}"؟`)) return;
  deleteConversation(conv.id);
  renderAll();
  flashToast("تم الحذف");
}

function renameCurrentChat() {
  const conv = getActiveConv();
  if (!conv) return;
  const next = prompt("الاسم الجديد للمحادثة:", conv.title);
  if (next === null) return;
  renameConversation(conv.id, next);
  renderConversationList($("#searchInput").value);
  updateChatTitle();
}

function clearActions() {
  document.body.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    switch (action) {
      case "new-chat": newChat(); break;
      case "toggle-theme": toggleTheme(); break;
      case "open-sidebar": openMobileSidebar(); break;
      case "close-sidebar": closeMobileSidebar(); break;
      case "scroll-down": scrollToBottom(); break;
      case "share": shareChat(); break;
      case "rename-chat": renameCurrentChat(); break;
      case "delete-chat": deleteCurrentChat(); break;
      case "attach": flashToast("الإرفاق متاح في الإصدار الكامل"); break;
    }
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
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

/* ============================================================
   RENDER ALL
   ============================================================ */
function renderAll() {
  renderConversationList($("#searchInput")?.value || "");
  renderModelGrid();
  renderModelPill();
  renderModelMenu();
  renderActiveConversation();
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  // Theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  bootstrapState();

  // Ensure at least one conversation exists
  if (!STATE.conversations.length) {
    createConversation();
  }
  if (!getActiveConv()) {
    STATE.activeId = STATE.conversations[0].id;
    saveState();
  }

  renderConversationList();
  renderModelGrid();
  renderModelMenu();
  renderModelPill();
  renderSuggestions();
  renderActiveConversation();
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
