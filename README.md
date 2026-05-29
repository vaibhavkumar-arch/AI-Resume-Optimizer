# AI Resume Optimizer — Golden Response

A full-stack AI Resume Optimizer (MERN) that analyzes resumes against job descriptions to produce an ATS score and actionable recommendations. This repository contains both the frontend (React + Vite) and backend (Node.js + Express) located under the `Golden Response/` folder.

This README contains quick setup, environment configuration, running instructions, and deployment notes intended for pushing the project to GitHub.

Table of Contents
- [Features](#features)
- [Repository Structure](#repository-structure)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing the Streaming Analyze Flow](#testing-the-streaming-analyze-flow)
- [Deployment Notes](#deployment-notes)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features
- Upload resume (PDF) and extract text server-side
- Upload or paste job description (PDF/TXT/DOCX support)
- AI-powered ATS scoring and granular recommendations
- Analysis history and downloadable reports
- JWT authentication (register/login)
- OpenAI and Google Gemini integrations with fallback and retry
- Streaming analysis endpoint (OpenAI) for real-time progress updates

## Repository Structure
All application code lives inside the `Golden Response/` folder. Top-level files `justification.md` and `prompt.md` were intentionally left at the repository root.

- Golden Response/
   - client/ — React + Vite frontend
   - server/ — Express backend, services, and API
   - main instructions.md — project design and prompts

## Requirements
- Node.js 18+ (recommended)
- npm 9+ or yarn
- MongoDB connection (Atlas or local)
- OpenAI API key (optional, used for streaming fallback)
- Google Gemini API key (optional)

## Environment Variables
Create a `.env` file in `Golden Response/server/` and **never commit it**.

Example `.env` (replace placeholder values locally):

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/resume-ai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
OPENAI_API_KEY=sk-...your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo
CLIENT_URL=http://localhost:5173
PORT=5000
```

## Local Development
1. Install server dependencies and start the backend

```bash
cd "Golden Response/server"
npm install
npm run dev
```

2. Install client dependencies and start the frontend

```bash
cd "Golden Response/client"
npm install
npm run dev
```

3. Open the app at `http://localhost:5173`

## Testing the Streaming Analyze Flow
- Ensure `OPENAI_API_KEY` is present in the server `.env`.
- On the Analyze page, upload a resume PDF and either paste a JD or upload a JD PDF.
- Click `Generate ATS Report`. The client now uses a streaming endpoint (`/api/analysis/stream-analyze`) which returns token chunks; when the analysis completes the client will navigate to the results page.

Server logs will show if OpenAI or Gemini is called. On quota errors the server falls back to a local heuristic analyzer so users still receive results.

## Deployment Notes
- Use environment variables in your cloud provider (do not store secrets in the repo).
- Enable billing and request quota for Google Gemini if you plan to use it in production.
- For production streaming and scaling, consider using Redis for caching and a managed message broker or WebSocket provider for real-time streams.

## Security
- Rotate API keys immediately if accidentally exposed.
- Do not commit `.env` to GitHub. Add `server/.env` to `.gitignore` if not already.

## Contributing
- Fork the repository, create a feature branch, and open a pull request.

## License
- MIT
