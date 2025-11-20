# Frontend-Backend Connection Guide

This guide explains how to connect the Next.js frontend with the FastAPI backend.

## Overview

- **Backend**: FastAPI application in `api/index.py` running on port 8000
- **Frontend**: Next.js application in `frontend-hot-mess/` 
- **Connection**: Frontend makes POST requests to backend `/chat` endpoint

## Setup Instructions

### 1. Local Development

#### Backend Setup

1. Navigate to the project root:
   ```bash
   cd /Users/swarabankhele/aimakers/github/AIE01-3-homework
   ```

2. Start the FastAPI backend:
   ```bash
   # Using uv (recommended)
   uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   
   # Or using Python directly
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

3. Verify backend is running:
   - Open http://localhost:8000 in your browser
   - You should see the API documentation page
   - Visit http://localhost:8000/docs for Swagger UI

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-hot-mess
   ```

2. Create a `.env.local` file (for local development):
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

### 2. Production Deployment (Vercel)

#### Environment Variables

1. In your Vercel project settings, add the environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your deployed backend URL (e.g., `https://your-backend.vercel.app`)

2. The frontend will automatically use this URL in production.

#### Backend Deployment

The backend is configured in `vercel.json` to route all requests to `/api/index.py`. Make sure:
- Your backend is deployed on Vercel
- CORS is properly configured (already done in `api/index.py`)
- Environment variables (like `OPENAI_API_KEY`) are set in Vercel

## How It Works

1. **Frontend** (`frontend-hot-mess/app/page.tsx`):
   - Uses `NEXT_PUBLIC_API_URL` environment variable to determine backend URL
   - Falls back to `http://localhost:8000` if not set (for local dev)
   - Makes POST requests to `${backendUrl}/chat` with JSON body: `{message: "user message"}`

2. **Backend** (`api/index.py`):
   - Receives POST requests at `/chat` endpoint
   - Expects JSON body: `{"message": "string"}`
   - Returns JSON response: `{"reply": "string"}`
   - CORS middleware allows cross-origin requests from frontend

## Testing the Connection

1. Start both backend and frontend
2. Open the frontend in your browser (http://localhost:3000)
3. Type a message and send it
4. Check browser console (F12) for any errors
5. Check backend terminal for request logs

## Troubleshooting

### CORS Errors
- Backend already has CORS middleware configured
- If you see CORS errors, check that `allow_origins=["*"]` is set in `api/index.py`

### Connection Refused
- Make sure backend is running on port 8000
- Check that `NEXT_PUBLIC_API_URL` in frontend matches backend URL
- Verify no firewall is blocking the connection

### Environment Variables Not Working
- In Next.js, environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart the Next.js dev server after changing `.env.local`
- Check that `.env.local` is in the `frontend-hot-mess/` directory

### Backend Not Responding
- Check backend terminal for errors
- Verify OpenAI API key is set in backend environment
- Test backend directly: `curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"message":"test"}'`

