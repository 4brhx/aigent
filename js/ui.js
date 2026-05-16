/* === UI RENDERING === */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmt(t){let s=esc(t);s=s.replace(/```([\s\S]*?)```/g,(_,c)=>`<pre><code>${c}</code></pre>`);s=s.replace(/`([^`]+)`/g,'<code>$1</code>');s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');return s;}
function timeStr(ts){return new Date(ts).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'});}

function renderConvList(filter='') {
  const el=$('#convList'); if(!el)return;
  const f=filter.toLowerCase();
  const items=state.conversations.filter(c=>!f||c.title.toLowerCase().includes(f));
  if(!items.length){el.innerHTML='<div class="conv-empty">لا توجد محادثات</div>';return;}
  const groups={};
  items.forEach(c=>{const g=groupLabel(c.ts);(groups[g]??=[]).push(c);});
  const order=['اليوم','أمس','هذا الأسبوع','أقدم'];
  el.innerHTML=order.filter(g=>groups[g]).map(g=>`<div class="conv-group">${g}</div>${groups[g].map(c=>{
    const m=getModel(c.modelId);
    return `<button class="conv-item${c.id===state.activeId?' active':''}" data-id="${c.id}"><span class="c-icon">${m.icon}</span><span class="c-title">${esc(c.title)}</span><span class="c-actions"><button class="c-btn" data-act="rename" data-cid="${c.id}" title="تعديل"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></button><button class="c-btn del" data-act="del" data-cid="${c.id}" title="حذف"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></span></button>`;
  }).join('')}`).join('');
}

function renderModelGrid() {
  const el=$('#modelGrid'); if(!el)return;
  el.innerHTML=MODELS.map(m=>`<button class="m-card${m.id===state.modelId?' selected':''}" data-mid="${m.id}"><span class="m-icon">${m.icon}</span><span class="m-name">${esc(m.short)}</span><span class="m-vendor">${esc(m.vendor)}</span><span class="m-check"><svg viewBox="0 0 24 24" fill="none" width="8" height="8"><path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>`).join('');
}

function renderPill() {
  const c=activeConv(); const m=getModel(c?.modelId||state.modelId);
  $('#pillIcon').innerHTML=m.icon;
  $('#pillName').textContent=m.name;
}

function renderDropdown() {
  const el=$('#modelMenu'); if(!el)return;
  const cur=activeConv()?.modelId||state.modelId;
  el.innerHTML=MODELS.map(m=>`<button class="dd-row${m.id===cur?' active':''}" data-mid="${m.id}"><span class="m-icon">${m.icon}</span><span style="flex:1"><div style="font-size:13px;font-weight:600">${esc(m.name)}</div><div class="dd-meta">${esc(m.vendor)} · ${esc(m.tag)}</div></span>${m.id===cur?'<svg viewBox="0 0 24 24" fill="none" width="16" height="16" style="color:var(--primary)"><path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</button>`).join('');
}

function renderSuggestions() {
  const data=[
    {icon:'<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M4 4h16v12H5l-1 4V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',h:'اشرح مفهوماً',p:'بسّط لي Transformers بأسلوب سهل.'},
    {icon:'<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="m8 8-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',h:'اكتب كود',p:'دالة Fibonacci بطريقة Memoization.'},
    {icon:'<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',h:'أفكار مشاريع',p:'5 أفكار SaaS قابلة للتنفيذ.'},
    {icon:'<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',h:'ساعدني بالكتابة',p:'بريد اعتذار عن تأخّر مشروع.'},
  ];
  const el=$('#suggestions'); if(!el)return;
  el.innerHTML=data.map((s,i)=>`<button class="sug" data-si="${i}"><span class="sug-icon">${s.icon}</span><span class="sug-h">${s.h}</span><span class="sug-p">${s.p}</span></button>`).join('');
  window._sugData=data;
}

function renderChat() {
  const c=activeConv(); const ol=$('#messages');
  ol.innerHTML='';
  if(!c||!c.messages.length){ $('#emptyState').style.display=''; return; }
  $('#emptyState').style.display='none';
  c.messages.forEach(m=>{ if(m.role==='user') addUserBubble(m.text,m.ts,false); else addAiBubble(m.text,m.modelId||c.modelId,m.ts,false); });
  scrollEnd(true);
}

function addUserBubble(text,ts=Date.now(),anim=true) {
  const li=document.createElement('li'); li.className='msg user'; if(!anim)li.style.animation='none';
  li.innerHTML=`<div class="msg-row"><div class="bubble">${fmt(text)}</div></div><div class="msg-meta">${timeStr(ts)} · أنت</div>`;
  $('#messages').appendChild(li); scrollEnd();
}

function addAiBubble(text,modelId,ts=Date.now(),anim=true,placeholder=false) {
  const m=getModel(modelId);
  const li=document.createElement('li'); li.className='msg ai'; if(!anim)li.style.animation='none';
  li.innerHTML=`<div class="msg-row"><div class="ai-icon">${m.icon}</div><div class="bubble">${placeholder?'<div class="typing"><i></i><i></i><i></i></div>':fmt(text||'')}</div></div><div class="msg-meta">${esc(m.short)} · ${timeStr(ts)}<span class="msg-actions"><button class="act-btn" data-act="copy" title="نسخ"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><button class="act-btn" data-act="regen" title="إعادة"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M3 12a9 9 0 0 1 15.5-6.3M21 12a9 9 0 0 1-15.5 6.3M21 4v5h-5M3 20v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span></div>`;
  $('#messages').appendChild(li); scrollEnd(); return li;
}

function scrollEnd(instant=false) {
  const el=$('#chatArea'); if(!el)return;
  el.scrollTo({top:el.scrollHeight,behavior:instant?'auto':'smooth'});
}

function toast(msg) {
  const t=$('#toast'); if(!t)return;
  t.querySelector('.toast-msg').textContent=msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid=setTimeout(()=>t.classList.remove('show'),1800);
}

function updateTitle() { const c=activeConv(); $('#chatTitle').textContent=c?.title||'محادثة جديدة'; }
