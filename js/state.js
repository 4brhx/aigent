/* === STATE MANAGEMENT === */
const STORAGE_KEY = 'aigent.v3';
const THEME_KEY = 'aigent.theme';

const MODELS = [
  { id:'gemini', name:'Gemini 1.5 Pro', short:'Gemini', vendor:'Google', tag:'Multimodal',
    icon:'<svg viewBox="0 0 24 24" width="18" height="18"><defs><linearGradient id="gg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1C6FF3"/><stop offset="55%" stop-color="#9168F0"/><stop offset="100%" stop-color="#F94B8A"/></linearGradient></defs><path fill="url(#gg)" d="M12 2c.6 4.5 3.5 7.4 8 8-4.5.6-7.4 3.5-8 8-.6-4.5-3.5-7.4-8-8 4.5-.6 7.4-3.5 8-8Z"/></svg>' },
  { id:'claude', name:'Claude 3.5 Sonnet', short:'Claude', vendor:'Anthropic', tag:'تحليل',
    icon:'<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="#D97757"/><path fill="#fff" d="M9.4 7.5h1.8l3 9h-1.7l-.7-2.1H8.7L8 16.5H6.3l3.1-9Zm-.3 5.5h2.5l-1.2-3.8-1.3 3.8Z"/></svg>' },
  { id:'chatgpt', name:'ChatGPT (GPT-4o)', short:'ChatGPT', vendor:'OpenAI', tag:'عام',
    icon:'<svg viewBox="0 0 24 24" width="18" height="18" fill="#10A37F"><path d="M22.3 9.9a5.5 5.5 0 0 0-.5-4.5 5.6 5.6 0 0 0-6-2.7A5.5 5.5 0 0 0 11.7 1a5.6 5.6 0 0 0-5.3 3.9 5.5 5.5 0 0 0-3.7 2.7 5.6 5.6 0 0 0 .7 6.6 5.5 5.5 0 0 0 .5 4.5 5.6 5.6 0 0 0 6 2.7 5.5 5.5 0 0 0 4.1 1.7 5.6 5.6 0 0 0 5.3-3.9 5.5 5.5 0 0 0 3.7-2.7 5.6 5.6 0 0 0-.7-6.6Z"/></svg>' },
  { id:'deepseek', name:'DeepSeek V3', short:'DeepSeek', vendor:'DeepSeek', tag:'كود',
    icon:'<svg viewBox="0 0 24 24" width="18" height="18"><defs><linearGradient id="dg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#4D6BFE"/><stop offset="100%" stop-color="#7C8DFF"/></linearGradient></defs><path fill="url(#dg)" d="M19.5 7.2c-.6-.4-1.2-.7-1.9-.9.3.4.5 1 .5 1.5 0 1.4-1.2 2.6-2.6 2.6-1 0-1.9-.6-2.3-1.4-.9.7-1.6 1.6-2 2.7-2.4.4-4.2 2.5-4.2 5 0 2.8 2.3 5.1 5.1 5.1.7 0 1.4-.1 2-.4.5.2 1 .4 1.5.4 1.7 0 3.2-1 3.9-2.5 1.7-.8 2.9-2.5 2.9-4.5 0-2-1.2-3.7-2.9-4.5.1-.4.1-.8.1-1.2 0-.6-.1-1.2-.1-1.9Z"/><circle cx="15.6" cy="7.6" r="1.4" fill="url(#dg)"/></svg>' },
];

const REPLIES = {
  gemini:["بالتأكيد! إليك إجابة منظّمة:\n\n**النقاط الرئيسية:**\n• نحدّد السياق بدقّة.\n• نقسّم المهمة لخطوات.\n• نفحص النتيجة.\n\nهل تريد تفصيلاً أكثر؟","سأجيبك من زاويتين:\n\n1. **النظرية:** ربط المدخلات بالسياق ثم التوليد.\n2. **العملية:** ابدأ ببسيط ثم وسّع.\n\nشاركني تفاصيل أكثر."],
  claude:["سؤال ممتاز.\n\nثلاث طبقات:\n• **مفاهيمية:** ما الهدف؟\n• **عملية:** ما المتاح؟\n• **تقييمية:** كيف نقيس النجاح؟\n\nابدأ من الأولى.","المسألة فيها مقايضات:\n\n- السرعة → حل بسيط.\n- التوسّع → استثمر بالبنية.\n\nيعتمد على **سياقك**."],
  chatgpt:["خلّيني أساعدك:\n\n1. حدّد الهدف.\n2. اكتب الموارد المتاحة.\n3. ابدأ بـ `MVP`.\n4. كرّر.\n\nشاركني تفاصيل المشروع.","ركّز على **النتيجة** بدل الأدوات.\n\nوضوح الهدف هو الفارق. اكتب لي الناتج المطلوب وأرسم لك المسار."],
  deepseek:["حل هندسي:\n\n```js\nconst memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const v = fib(n-1) + fib(n-2);\n  memo.set(n, v);\n  return v;\n}\n```\n\nتعقيد: `O(n)` زمني و`O(n)` مكاني.","1. **المُدخل:** البيانات الأوّلية.\n2. **التحويل:** العمليات.\n3. **المُخرَج:** الشكل النهائي.\n\nأعطني عيّنة بيانات وأكتب حلّاً مع tests."],
};

let state = { modelId:'gemini', conversations:[], activeId:null, generating:false, abort:false };

function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && Array.isArray(d.conversations)) {
      state.modelId = d.modelId || 'gemini';
      state.conversations = d.conversations;
      state.activeId = d.activeId || d.conversations[0]?.id || null;
      return;
    }
  } catch {}
  // First run
  state.conversations = [
    { id: uid(), title:'خطة تسويقية لمتجر', modelId:'claude', messages:[], ts:Date.now()-3600000 },
    { id: uid(), title:'مراجعة كود React', modelId:'deepseek', messages:[], ts:Date.now()-86400000 },
  ];
  state.activeId = state.conversations[0].id;
  save();
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ modelId:state.modelId, conversations:state.conversations, activeId:state.activeId })); } catch {}
}

function uid() { return Math.random().toString(36).slice(2,11); }
function getModel(id) { return MODELS.find(m=>m.id===id)||MODELS[0]; }
function activeConv() { return state.conversations.find(c=>c.id===state.activeId); }
function pickReply(mid) { const a=REPLIES[mid]||REPLIES.gemini; return a[Math.floor(Math.random()*a.length)]; }

function createConv() {
  const c = { id:uid(), title:'محادثة جديدة', modelId:state.modelId, messages:[], ts:Date.now() };
  state.conversations.unshift(c);
  state.activeId = c.id;
  save();
  return c;
}
function deleteConv(id) {
  const i = state.conversations.findIndex(c=>c.id===id);
  if (i===-1) return;
  state.conversations.splice(i,1);
  if (state.activeId===id) state.activeId = state.conversations[0]?.id || null;
  if (!state.activeId) createConv();
  save();
}
function renameConv(id,t) { const c=state.conversations.find(x=>x.id===id); if(c){c.title=(t||'').trim()||c.title; save();} }
function groupLabel(ts) {
  const d=(Date.now()-ts)/86400000;
  if(d<1)return'اليوم'; if(d<2)return'أمس'; if(d<7)return'هذا الأسبوع'; return'أقدم';
}
