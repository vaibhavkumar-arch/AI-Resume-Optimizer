# AI Resume Optimizer Prompt

---

## Context and Role

You are a Senior Full-Stack Developer, specialized in MERN stack (MongoDB, Express.js, React, Node.js) with vast experience in AI/LLM integration, PDF processing, and developing SaaS applications for production. You will be required to design and implement a fully functional end-to-end AI-Powered Resume Optimizer web-app from scratch.

This application provides job seekers the ability to upload their resume (PDF), input a job description (JD), and receive an intelligent ATS (Applicant Tracking System) compatibility score along with actionable, line-by-line recommendations to optimize their resume for maximum ATS pass-through rate. The system also includes an AI Chatbot that acts as a personal career coach — responding to follow-up questions, suggesting projects to develop, certifications to obtain, and providing customized advice based on the user’s resume and target role.

You must provide complete, working, production-ready code - not suggestions, not pseudocode, not explanations. Every file, every function, every component must be fully implemented and ready to run. Do not ask for clarifications. Where details are not provided use reasonable, industry standard judgment.

---

## Objective

Build a complete, deployable full-stack AI Resume Optimizer that:

1. **Accepts resume uploads** in PDF format and parses them into structured text.
2. **Accepts job descriptions** via paste (textarea) or file upload (PDF/TXT/DOCX).
3. **Analyzes the resume against the JD** using an AI/LLM model and produces a detailed ATS compatibility score (0–100).
4. **Generates granular, actionable recommendations** including:
   - Exact lines to add/modify/remove in the summary/objective section.
   - Skills to add, skills to remove, and skills to reword for keyword matching.
   - Project descriptions to improve or new projects to suggest building.
   - Certifications to add (existing) or pursue (recommended).
   - Formatting and structural improvements.
5. **Provides an AI Chatbot** for interactive follow-up — users can ask questions like *"What projects should I build for a React developer role?"* or *"Which AWS certifications are best for this JD?"* and receive context-aware answers grounded in their resume and JD.
6. **Maintains a history** of analyses so users can track their resume improvements over time.
7. **Allows users to register and log in** securely to save their data.

---

## Technology Stack with Justifications

### Frontend

| Technology | Justification |
|---|---|
| **React 18+** | Industry-standard UI library with a massive ecosystem; component-based architecture enables modular, reusable UI elements for the dashboard, chat, and analysis views. |
| **Vite** | Blazing-fast dev server and optimized production builds compared to CRA; supports HMR for rapid development. |
| **React Router v6** | Declarative, nested routing for SPA navigation between dashboard, analysis results, chatbot, and history pages. |
| **Axios** | Promise-based HTTP client with interceptors for attaching auth tokens, handling errors globally, and managing request/response transformations. |
| **React-PDF / pdf.js** | Client-side PDF rendering to let users preview their uploaded resume directly in the browser before submission. |
| **React-Markdown** | Renders the AI's markdown-formatted recommendations and chatbot responses with proper formatting (bold, lists, code blocks). |
| **Framer Motion** | Adds polished micro-animations for page transitions, modal entrances, loading states, and score reveals — making the app feel premium and responsive. |
| **React Hot Toast** | Lightweight, customizable toast notifications for success, error, and info messages throughout the app. |
| **Tailwind CSS v3** | Utility-first CSS framework for rapid, consistent styling without leaving the JSX; responsive design out of the box with mobile-first breakpoints. |

### Backend

| Technology | Justification |
|---|---|
| **Node.js + Express.js** | Non-blocking, event-driven runtime ideal for handling concurrent PDF processing and AI API calls; Express provides a minimal, flexible routing layer. |
| **MongoDB + Mongoose** | Document-oriented NoSQL database perfectly suited for storing unstructured resume data, analysis results, and chat histories as flexible JSON-like documents. |
| **Multer** | Middleware for handling `multipart/form-data` file uploads (resume PDFs) with file size limits and type validation. |
| **pdf-parse** | Server-side PDF text extraction — lightweight, no external dependencies, reliably extracts text from uploaded resume PDFs. |
| **OpenAI API (GPT-4o / GPT-4o-mini)** | State-of-the-art language model for resume analysis, ATS scoring, recommendation generation, and powering the chatbot with contextual, career-specific advice. |
| **jsonwebtoken (JWT)** | Stateless authentication — generates signed tokens for secure, scalable user sessions without server-side session storage. |
| **bcryptjs** | Industry-standard password hashing with salt rounds to securely store user credentials in the database. |
| **express-rate-limiter** | Prevents abuse of AI endpoints (which are expensive) by throttling requests per user/IP — protects against brute-force and bot attacks. |
| **helmet** | Sets security-related HTTP headers (CSP, X-Frame-Options, etc.) to protect against common web vulnerabilities. |
| **cors** | Configures Cross-Origin Resource Sharing to allow the React frontend to communicate with the Express backend securely. |
| **dotenv** | Loads environment variables from `.env` files — keeps API keys, database URIs, and secrets out of source code. |
| **express-validator** | Server-side input validation and sanitization — ensures all user inputs are clean before processing or database insertion. |
| **morgan** | HTTP request logger for development and production — aids in debugging and monitoring API usage. |

### Optional / Recommended Additions

| Technology | Justification |
|---|---|
| **Redis** | Caches AI analysis results to avoid redundant API calls for the same resume+JD combination — reduces cost and latency. |
| **Socket.io** | Enables real-time streaming of AI chatbot responses (token-by-token) for a ChatGPT-like typing experience. |
| **Mammoth.js** | Converts uploaded DOCX files to text — extends JD input support beyond plain text and PDF. |

---

## Project Folder Structure

(omitted for brevity - same structure as before)
