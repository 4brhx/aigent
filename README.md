# AIgent

واجهة محادثة موحّدة بأسلوب AI-Native للتحدّث مع **Gemini · Claude · ChatGPT · DeepSeek**.

> هذا الإصدار واجهة فقط (Front-end). الإجابات محاكاة محلياً ولا يوجد اتصال فعلي بالنماذج.

## التشغيل المحلي

لا يحتاج المشروع إلى أي خطوة بناء. افتح `index.html` مباشرة، أو شغّل سيرفر بسيط:

```bash
python3 -m http.server 8080
# ثم افتح http://localhost:8080
```

## النشر على Vercel

المشروع موقع ستاتيك (HTML/CSS/JS) — لا يحتاج إعدادات إضافية.

- **Framework Preset:** Other
- **Build Command:** *(اتركه فارغاً)*
- **Output Directory:** `.` *(الجذر)*
- **Install Command:** *(اتركه فارغاً)*

أو من سطر الأوامر:

```bash
npx vercel
npx vercel --prod
```

## نظام التصميم

مبني وفق **AI-Native UI** style من سكِل [`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill):

| العنصر | القيمة |
|---|---|
| Primary | `#7C3AED` |
| Secondary | `#A78BFA` |
| Accent | `#0891B2` |
| Background (light) | `#FAF5FF` |
| Background (dark) | `#0B0A1F` |
| Typography | Inter + IBM Plex Sans Arabic |
| Effects | Typing 3-dot pulse · Streaming text · Smooth reveals |

## البنية

```
aigent/
├── index.html          # الواجهة الرئيسية
├── assets/
│   ├── styles.css      # توكنات التصميم + المكوّنات
│   └── app.js          # الحالة، النماذج، محاكاة streaming
└── vercel.json         # إعدادات النشر
```

## الاختصارات

| اختصار | الوظيفة |
|---|---|
| `⌘ / Ctrl + N` | محادثة جديدة |
| `/` | تركيز البحث |
| `Enter` | إرسال |
| `Shift + Enter` | سطر جديد |
| `Esc` | إغلاق القوائم |
