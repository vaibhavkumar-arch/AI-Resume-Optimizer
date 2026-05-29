# AI Resume Optimizer Prompt

---

## Context and Role

You are a senior MERN stack developer who has built SaaS products. You understand AI and LLM integration PDF handling and how production apps run.

Build a complete **AI-Powered Resume Optimizer** from scratch. The app lets job seekers upload a resume PDF and a job description then get an ATS score from 0 to 100 and clear line level recommendations to improve their results. Add an AI chatbot that acts as a career advisor. The chatbot should use the user's resume and the target job to suggest projects recommend certifications rewrite bullets and answer follow up questions.

Provide complete runnable code for every file. No TODOs or pseudocode. Choose sensible defaults when details are missing and proceed.

---


## What It Needs to Do

1. Accept a resume PDF and extract the text.
2. Accept a job description by paste or upload (PDF TXT DOCX).
3. Compare the resume to the JD with an LLM and produce a scored ATS report from 0 to 100.
4. Return clear actionable recommendations
  - Summary and objective rewrites
  - Skills to add remove or rename for better keyword matching
  - Project ideas or ways to improve existing projects
  - Certifications to list or pursue
  - Formatting fixes
5. Provide an AI chatbot that answers the questions asked based on the resume of the user and the JD.
6. Store analysis history to track progress overtime.
7. Support user accounts with register login and saved data.

---

## Tech Stack


### Frontend

| Tech | Why |
|---|---|
| **React 18+** | Reusable UI components for dashboard analysis and chat views. | 
| **Vite** | Fast dev server, clean production builds and good HMR. | 
| **React Router v6** | Nested routing for SPA dashboard, results chatbot and history. | 
| **Axios** | HTTP client with interceptors for auth tokens and global error handling. | 
| **React-PDF / pdf.js** | Preview PDF in browser before user submits. | 
| **React-Markdown** | Renders AI output like recommendations and chat using markdown. | 
| **Framer Motion** | Page transitions reveal animations modal and loading screens. | 
| **React Hot Toast** | Toast notifications everywhere in your app | 
| **Tailwind CSS v3** | Utility-first responsive styling without ever leaving your markup |


### Backend

| Tech | Why |
|---|---|
| **Node.js + Express.js** | Non-blocking server for PDF processing and AI calls.  |
| **MongoDB + Mongoose** | Flexible document storage for the results of resume analysis and chat history.|
| **Multer** | Supports multipart file uploads with size and type limits. |
| **pdf-parse** | Extract text from PDF - server side for Node.js. | 
| **OpenAI API (GPT-4o / GPT-4o-mini)** | Runs the ATS analysis scoring recommendations & chatbot. |
| **jsonwebtoken (JWT)** | Stateless auth with signed tokens no server side session needed. |
| **bcryptjs** | Hash passwords before storing them in the DB. | 
| **express-rate-limiter** | Limit AI endpoints to control costs and block abuse. | 
| **helmet** | Set security related HTTP headers. | 
| **cors** | Enable React frontend to connect securely to Express 
| **dotenv** | Keep secrets out of source | 
| **express-validator** | Validate and sanitize inputs on server before db/ai calls. |
| **morgan** | Request logging for dev and production. |


## Folder Structure

```
ai-resume-optimizer/
│
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── resume/
│   │   │   │   ├── ResumeUploader.jsx
│   │   │   │   ├── ResumePreviewer.jsx
│   │   │   │   └── ResumeDropzone.jsx
│   │   │   ├── jd/
│   │   │   │   ├── JDInput.jsx
│   │   │   │   └── JDUploader.jsx
│   │   │   ├── analysis/
│   │   │   │   ├── ATSScoreGauge.jsx
│   │   │   │   ├── ScoreBreakdown.jsx
│   │   │   │   ├── RecommendationCard.jsx
│   │   │   │   ├── SkillsComparison.jsx
│   │   │   │   ├── SummaryRewrite.jsx
│   │   │   │   └── ProjectSuggestions.jsx
│   │   │   └── chat/
│   │   │       ├── ChatWindow.jsx
│   │   │       ├── ChatMessage.jsx
│   │   │       ├── ChatInput.jsx
│   │   │       └── ChatSidebar.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AnalyzePage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AnalysisContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useAnalysis.js
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── resumeService.js
│   │   │   ├── analysisService.js
│   │   │   └── chatService.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── rateLimiter.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── analysisController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Analysis.js
│   │   └── ChatHistory.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── chatRoutes.js
│   ├── services/
│   │   ├── pdfService.js
│   │   ├── aiService.js
│   │   ├── atsService.js
│   │   └── chatService.js
│   ├── prompts/
│   │   ├── atsAnalysisPrompt.js
│   │   ├── recommendationPrompt.js
│   │   └── chatbotPrompt.js
│   ├── utils/
│   │   ├── sanitizer.js
│   │   ├── responseHelper.js
│   │   └── logger.js
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```


---

## Database Schemas

### User
```javascript
{
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 8 },
  avatar:        { type: String, default: null },
  analysisCount: { type: Number, default: 0 },
  plan:          { type: String, enum: ['free', 'pro'], default: 'free' },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
}
```

### Resume
```javascript
{
  userId:         { type: ObjectId, ref: 'User', required: true },
  originalName:   { type: String, required: true },
  filePath:       { type: String, required: true },
  extractedText:  { type: String, required: true },
  parsedSections: {
    summary:        String,
    experience:     [{ title: String, company: String, duration: String, description: String }],
    education:      [{ degree: String, institution: String, year: String }],
    skills:         [String],
    projects:       [{ name: String, description: String, techStack: [String] }],
    certifications: [{ name: String, issuer: String, year: String }]
  },
  uploadedAt: { type: Date, default: Date.now }
}
```

### Analysis
```javascript
{
  userId:         { type: ObjectId, ref: 'User', required: true },
  resumeId:       { type: ObjectId, ref: 'Resume', required: true },
  jobDescription: { type: String, required: true },
  jobTitle:       { type: String },
  company:        { type: String },
  atsScore:       { type: Number, min: 0, max: 100, required: true },
  scoreBreakdown: {
    keywordMatch:     { score: Number, maxScore: Number, details: String },
    skillsAlignment:  { score: Number, maxScore: Number, details: String },
    experienceMatch:  { score: Number, maxScore: Number, details: String },
    formatting:       { score: Number, maxScore: Number, details: String },
    summaryQuality:   { score: Number, maxScore: Number, details: String },
    overallStructure: { score: Number, maxScore: Number, details: String }
  },
  recommendations: {
    summary:          { current: String, suggested: String, reasoning: String },
    skillsToAdd:      [{ skill: String, reason: String }],
    skillsToRemove:   [{ skill: String, reason: String }],
    skillsToReword:   [{ current: String, suggested: String, reason: String }],
    experienceTweaks: [{ section: String, suggestion: String }],
    projectsToAdd:    [{ name: String, description: String, techStack: [String], whyRelevant: String }],
    certsToAdd:       [{ existing: String }],
    certsToGet:       [{ name: String, provider: String, estimatedTime: String, whyRelevant: String }],
    formattingTips:   [String],
    additionalNotes:  [String]
  },
  optimizedScore: { type: Number, min: 0, max: 100 },
  analyzedAt:     { type: Date, default: Date.now }
}
```

### ChatHistory
```javascript
{
  userId:     { type: ObjectId, ref: 'User', required: true },
  analysisId: { type: ObjectId, ref: 'Analysis', default: null },
  title:      { type: String, default: 'New Chat' },
  messages:   [{
    role:      { type: String, enum: ['user', 'assistant', 'system'] },
    content:   { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```


---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register with name, email and password. Returns JWT. |
| `POST` | `/api/auth/login` | Login and get JWT. |
| `GET` | `/api/auth/me` | Get logged-in user's profile. |
| `PUT` | `/api/auth/update-profile` | Update profile info. |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/upload` | Upload resume PDF, extract text and return `resumeId`. |
| `GET` | `/api/resume/:id` | Get a resume's details. |
| `GET` | `/api/resume/all` | List all resumes for this user. |
| `DELETE` | `/api/resume/:id` | Delete resume + file. |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analysis/analyze` | Pass `resumeId` + JD text → run AI analysis → return full result. |
| `GET` | `/api/analysis/:id` | Fetch one analysis by ID. |
| `GET` | `/api/analysis/history` | All analyses for the user, newest first. |
| `DELETE` | `/api/analysis/:id` | Delete an analysis. |

### Chatbot
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat/send` | Send message, optionally with `analysisId` to get context. Returns AI reply. |
| `GET` | `/api/chat/history` | All chat sessions for the user. |
| `GET` | `/api/chat/:sessionId` | Messages of a specific session. |
| `DELETE` | `/api/chat/:sessionId` | Remove session. |


---

## AI System Prompts

### ATS Analysis Prompt

```
You are an expert ATS analyst and career consultant with 15 or more years working in recruitment tech and hiring.

You will receive two inputs
1. RESUME TEXT — extracted from the candidate's PDF
2. JOB DESCRIPTION — the full posting the candidate is targeting

Score the resume across six dimensions and return only the JSON report. Do not wrap it in markdown. Do not add explanations. Return the JSON object only.

SCORING
1. Keyword Match (25 pts) — exact keywords job title tools and action verbs from the JD
2. Skills Alignment (25 pts) – required vs. listed skills - penalize missing critical ones - credit transferable ones
3. Relevance of Experience (20 pts) – seniority of years & relevance of role
4. Formatting & Structure (10 pts) — ATS parseable headings no tables or graphics which break parsing consistent dates
5. Quality of Summary (10 pts) - Summary specific to this role or generic
6. Completeness (10 pts) All sections present Appropriate length No red flags

RETURN this exact JSON shape

{
  "atsScore": <0-100>,
  "scoreBreakdown": {
    "keywordMatch":     { "score": <number>, "maxScore": 25, "details": "<explanation>" },
    "skillsAlignment":  { "score": <number>, "maxScore": 25, "details": "<explanation>" },
    "experienceMatch":  { "score": <number>, "maxScore": 20, "details": "<explanation>" },
    "formatting":       { "score": <number>, "maxScore": 10, "details": "<explanation>" },
    "summaryQuality":   { "score": <number>, "maxScore": 10, "details": "<explanation>" },
    "overallStructure": { "score": <number>, "maxScore": 10, "details": "<explanation>" }
  },
  "recommendations": {
    "summary": {
      "current":   "<current summary text or 'Not found'>",
      "suggested": "<complete ready to paste optimized summary paragraph>",
      "reasoning": "<why this improves the ATS score>"
    },
    "skillsToAdd":    [{ "skill": "<name>", "reason": "<why based on JD>" }],
    "skillsToRemove": [{ "skill": "<name>", "reason": "<why it hurts or adds no value>" }],
    "skillsToReword": [{ "current": "<text>", "suggested": "<JD aligned version>", "reason": "<why>" }],
    "experienceTweaks": [{ "section": "<which role>", "suggestion": "<specific change>" }],
    "projectsToAdd": [{
      "name": "<project name>",
      "description": "<1-2 sentences>",
      "techStack": ["<tech1>", "<tech2>"],
      "whyRelevant": "<how it shows skills the JD needs>"
    }],
    "certsToAdd": [{ "existing": "<cert user has but didn't list>" }],
    "certsToGet": [{
      "name": "<cert name>",
      "provider": "<issuing org>",
      "estimatedTime": "<e.g. 2-4 weeks>",
      "whyRelevant": "<how it strengthens this application>"
    }],
    "formattingTips":  ["<specific fix>"],
    "additionalNotes": ["<anything else worth flagging>"]
  },
  "optimizedScore": <realistic estimated score after applying all recommendations, 0-100>
}

RULES
- Be right and honest. Help the candidate improve do not only criticize
- Make every recommendation specific avoid vague advice
- The suggested summary must be ready to paste not a template
- If there is no projects section suggest two or three buildable projects tied to the JD
- If there are no certs suggest two or three with provider and timeframe
- Suggest only skills the JD actually asks for do not invent experience
- Make the optimizedScore realistic do not always return 100
```

### Chatbot Prompt

```
You're ResumeAI — a career advisor who actually knows what they're talking about. You're direct, warm, and grounded. No corporate handbook tone.

You have the user's resume, their target JD, their current ATS score, and the recommendations from the analysis. Use all of it.

What you can help with:
1. Resume fixes — specific section rewrites, bullet point improvements, restructuring.
2. Project ideas — suggest real, buildable projects that match the JD's required skills. Include name, description, tech stack, and key features. Match to the user's level.
3. Certifications – Full name, who issued the certification, study time, cost and why it is important for this specific role.
4. Interview prep – help them prepare for questions on the role they want.
5. Prioritizing Gaps, Transitions, and What's Next in Your Career Strategy

How to respond:
- Conversational but useful. Like a mentor, not a bot.
- Use markdown — bold, lists, headers where it helps readability.
- Tie every suggestion to something in their actual resume or JD.
- Don't rehash the full analysis — reference it and build on it.
- If they seem discouraged, lead with what's working before getting into fixes.
- Do not make up certifications or course info. 
```

---

## UI/UX Requirements

### Landing Page
- Animated hero: *"Optimize Your Resume. Land Your Dream Job."*
- CTA button: **"Analyze My Resume"**
- 3-4 feature cards: ATS Score, Smart Recommendations, AI Chatbot, History
- Stats or testimonials (placeholder fine)
- Footer with nav links

### Auth Pages (Login / Register)
- Centered card with glassmorphism styling
- Real-time client-side validation
- Password strength indicator on register
- Toggle between login and register views
- "Forgot Password" link (placeholder for MVP)

### Dashboard
- Welcome with user's name
- Stats: total analyses, average ATS score, latest score
- Analyses with color badges (red < 40, orange 40–69, green 70+)
- Quick actions: "New Analysis", "Open Chatbot", "View History"

### Analyze Page
Two-column layout (stacked on mobile):
- **Left** — resume dropzone: drag-and-drop, PDF-only, preview after upload, remove button
- **Right** — JD input: toggle paste/upload, character count, clear button
- Analyze button disabled until both are filled
- Loading states with step messages: *"Uploading... Extracting text... Analyzing... Generating recommendations..."*

### Results Page
- Big animated ATS score gauge (color-coded 0–100)
- Six score breakdown cards with progress bars and expandable detail
- Recommendations in tabs or accordion:
  - Summary diff (current vs suggested + Copy button)
  - Skills: Add / Remove / Reword columns with tooltips
  - Experience tweaks per role
  - Project cards with tech stack tags
  - Certs: "Add to Resume" vs "Go Get This"
  - Formatting checklist
- Estimated optimized score gauge
- Action buttons: "Download PDF Report", "Ask AI Chatbot", "Re-Analyze"

### Chatbot Page
- ChatGPT-style layout: left sidebar (sessions), main chat area (bubbles), input at bottom
- Markdown-rendered AI responses
- Typing indicator while AI is thinking
- Shift+Enter for new lines
- Pre-loaded context when opened from an analysis result
- Prompt chips: "What projects should I build?", "Improve my summary", "Write my experience bullets again"

### History Page
- Chronological list: date, job title, company, ATS score badge, resume name
- Click-through to full results
- Score trend line chart
- Filters: date range, score range
- Bulk delete

### Global
- Navbar: logo, links (Dashboard, Analyze, Chat, History), avatar dropdown (Profile, Logout)
- Dark/Light mode switch (localStorage)
- Skeleton screens instead of blank loading states
- Friendly empty states with illustrations
- Full mobile support with hamburger menu

---

## Animations (Framer Motion)

| Element | Animation |
|---|---|
| Page transitions | Fade + slide with `AnimatePresence` |
| ATS score gauge | Count-up from 0 to final score with easing |
| Score breakdown bars | Staggered fill on scroll into view |
| Recommendation cards | Fade-in with staggered delay |
| Modal open/close | Scale + fade with backdrop blur |
| File dropzone | Pulse on drag-over |
| Chat messages | Slide in from bottom |
| Buttons | Scale on hover (1.02), press (0.98) |
| Toast notifications | Slide in from top-right |

---

## Security

### Input Sanitization
- Sanitize all user text inputs (JD, chat messages) against XSS and injection
- `express-validator` on every endpoint
- Strip HTML from PDF-extracted text
- Check MIME type on uploads, not just the extension

### Auth
- `bcryptjs` with 12+ salt rounds
- JWT expiry at 7 days
- `httpOnly` cookie storage (preferred), or localStorage with XSS precautions
- Re-login or token refresh on expiry

### File Handling
- 5MB max per upload
- Resumes: `.pdf` only. JDs: `.pdf`, `.txt`, `.docx`
- Delete files from disk after text extraction
- UUID filenames to prevent path traversal

### Rate Limits for API
- AI endpoints: 10 analyses/hr (free), 50 analyses/hr (pro)
- Chat: 30 messages/hr per user
- Auth: 5 login attempts per 15 min per IP
- Helmet headers on all routes
- CORS locked to frontend origin only

---

## Error Handling

### Frontend
| Scenario | Handling |
|---|---|
| Non-PDF upload | Toast: "Only PDF files are accepted." Block submit. |
| File > 5MB | Toast: "File exceeds 5MB. Compress and try again." |
| Empty/corrupted PDF | Toast: "Couldn't extract text. Use a text-based PDF, not a scan." |
| Empty JD | Disable analyze button + inline message. |
| JD under 50 characters | Warning: "JD seems too short for accurate analysis." |
| AI API error | Modal with retry: "AI service unavailable. Try again shortly." |
| Malformed AI JSON | Toast: "Analysis failed. Please try again." Log raw response. |
| Network drop mid-analysis | Reconnection toast. Auto-retry once. |
| Navigating away mid-analysis | Confirm dialog: "Analysis in progress. Leave anyway?" |
| JWT expire | Redirect to login: "Session expires. Please log in again." |
| Accessing another user's data | 403 + logged server-side. |
| Duplicate submissions | Debounce button + backend dedup check. |
| Scanned PDF (no text) | Error: "Looks like a scanned resume. Please upload a text-based PDF." |
| Non-English resume | Proceed + note: "Non-English detected. Accuracy may vary." |

### Backend
| Scenario | Handling |
|---|---|
| MongoDB down | Retry 3× with exponential backoff. 503 if all fail. |
| OpenAI timeout | 60s timeout, retry once. 504 if second fails. |
| OpenAI 429 | Queue request. Return 202: "Analysis queued." |
| Disk full | Monitor uploads dir. 507 if threshold exceeded. |
| Malicious file upload | Validate magic bytes. Cap extraction at 10s. Reject if memory threshold hit. |
| Quota exceeded | 429: "Free tier limit reached. Upgrade or wait." |

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/ai-resume-optimizer

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=4096

CLIENT_URL=http://localhost:5173

RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=10

MAX_FILE_SIZE=5242880

# REDIS_URL=redis://localhost:6379
```

---

## Local Setup

```bash
git clone https://github.com/yourusername/ai-resume-optimizer.git
cd ai-resume-optimizer

# Backend
cd server && npm install
cp .env.example .env   # fill in MONGODB_URI and OPENAI_API_KEY

# Frontend
cd ../client && npm install

# Start MongoDB locally
mongod --dbpath /data/db

# Run both (separate terminals)
cd server && npm run dev     # http://localhost:5000
cd client && npm run dev     # http://localhost:5173
```

---

    ## Production Deployment

    | Part | Platform | Notes |
    |---|---|---|
    | Frontend | Vercel or Netlify | Set `VITE_API_URL` to backend URL. Auto-deploy from Git. |
    | Backend | Render, Railway, or AWS EC2 | Set env vars in platform dashboard. |
    | Database | MongoDB Atlas (free M0 tier) | Whitelist backend IP. Paste the connection string in `MONGODB_URI`. |
    | File Storage | Local (dev) → AWS S3 (prod) | Store URL of S3 in MongoDB inspite of local file path. |

    **Before going live:**
    - [ ] HTTPS on all endpoints
    - [ ] `CLIENT_URL` set to real frontend domain
    - [ ] MongoDB Atlas IP whitelist
    - [ ] Sentry or similar for error tracking
    - [ ] CORS restricted to frontend domain
    - [ ] Rate limits tuned for prod traffic
    - [ ] `compression` middleware on Express
    - [ ] `npm run build` on the frontend

    ---

    ## Performance Notes

    - Lazy load heavy components (pdf viewer, charts) with React.lazy() + Suspense
    - Debounce JD textarea (300ms)
    - Cache AI results by resume+JD hash — skip the API call if we've seen this before
    - Paginate history (20 per page)
    - Index MongoDB on `userId`, `analyzedAt`, `atsScore`
    - Stream chatbot responses via SSE or WebSockets for real-time feel

    ---

    ## SEO and Accessibility

    - - Semantic HTML all over the place (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
    - ARIA labels on all interactive elements
    -  Full keyboard navigation (Tab, Enter, Esc)
    - Each page contains `<title>` and `<meta description>`
    - Only `<h1>` per page, heading order must be right
    - `<label>` elements for all form inputs
    - `aria-live` regions for loading states, errors, success messages
    - Alt text on all images and icons

    ---

    ## Final Checklist

    1. Generate every file in the folder structure — complete, working code.
    2. Zero placeholders. No `// TODO`. Every function fully implemented.
    3. AI analysis output must match the JSON shape exactly — the frontend parses it directly.
    4. Test the full flow: Register → Login → Upload Resume → Paste JD → Analyze → View Results → Chat → View History.
    5. Error handling at all layers – fail gracefully, never crash.
    6. ES modules, async/await, optional chaining, nullish coalescing - all modern JS, all over.
    7. Code is readable and clean - meaningful names, consistent formatting.

---