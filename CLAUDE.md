# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Uniconnect is a university platform with three services: a Node.js/Express backend, a React/Vite frontend, and a Python FastAPI ML microservice. Students share interview experiences (auto-analyzed by NLP) and report lost/found items (matched via cosine similarity). Auth uses JWT cookies with MongoDB (Atlas) as the database.

## Development Commands

### Backend (Express, port 5000)
```bash
cd backend
npm install
npm run dev          # nodemon server.js
```

### Frontend (React + Vite + TailwindCSS, port 5173)
```bash
cd frontend
npm install
npm run dev          # vite dev server
npm run build        # production build
npm run lint         # eslint
```

### ML Service (FastAPI, port 8000)
```bash
cd ml-service
pip install -r requirements.txt
# requirements.txt is incomplete — also needs: sentence_transformers, scikit-learn
uvicorn main:app --reload --port 8000
```

All three services must run simultaneously. The Vite config proxies `/api/*` to `http://localhost:5000`.

## Architecture

```
Frontend (React/Vite :5173)
  → proxies /api/* to Backend (Express :5000)
    → async calls ML Service (FastAPI :8000) for NLP processing
    → MongoDB Atlas for all persistence
```

### Backend (`backend/`)
- **Entry:** `server.js` — Express setup, MongoDB connection, route mounting
- **Auth:** JWT in httpOnly cookies; middleware at `middleware/authMiddleware.js`
- **Modules are feature-organized:**
  - `experience/` — interview experience CRUD + triggers ML pipeline for question extraction
  - `lost-found/` — item reporting, cosine-similarity matching, chat messaging, notifications
- **Models:** User (rollNo-based), Experience, ExtractedQuestion, LostFoundItem, Message, Notification

### Frontend (`frontend/src/`)
- **Router:** `App.jsx` with `ProtectedRoute.jsx` wrapper
- **Feature dirs:** `experience-hub/`, `lost-found/`
- **API calls:** fetch-based, service files per feature (e.g., `experienceService.js`)
- **Styling:** TailwindCSS

### ML Service (`ml-service/`)
- **Entry:** `main.py` — FastAPI with `/analyze` endpoint
- **Pipeline** (`semantic_engine/`): normalize → split → extract → classify
- **Classification:** SentenceTransformer embeddings + cosine similarity against subject anchors (DSA, OS, DBMS, CLOUD/DEVOPS, FRONTEND, SYSTEM DESIGN, HR)
- **Grievance engine** (`grievance_engine/`): fine-tuned model checkpoint (work in progress)

### Key Integration
- When an experience is created, the backend POSTs to `http://localhost:8000/process-experience` asynchronously. The ML service returns classified questions which are stored as ExtractedQuestion documents.
- Lost/found matching uses TF-IDF-style word vectors with cosine similarity (threshold: 0.4) and auto-creates notifications.
- CORS is configured for `http://localhost:5173` only.
