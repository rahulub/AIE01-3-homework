# Production Deployment Guide

This guide covers deploying both the Next.js frontend and FastAPI backend to production on Vercel.

## Deployment Options

You have two main options for deploying to Vercel:

### Option 1: Separate Projects (Recommended)
Deploy frontend and backend as separate Vercel projects. This is cleaner and easier to manage.

### Option 2: Monorepo Deployment
Deploy everything in one Vercel project with proper routing.

---

## Option 1: Separate Projects (Recommended)

### Step 1: Deploy Backend

1. **Create a new Vercel project for the backend:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Root Directory**: `/` (project root)
     - **Framework Preset**: Other
     - **Build Command**: (leave empty or `pip install -r requirements.txt`)
     - **Output Directory**: (leave empty)

2. **Configure Backend Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY`: Your OpenAI API key

3. **Update `vercel.json` for backend:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "api/index.py"
       }
     ]
   }
   ```

4. **Deploy:**
   - Push to your main branch or manually deploy
   - Note the deployment URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Create a new Vercel project for the frontend:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import the same GitHub repository
   - Configure the project:
     - **Root Directory**: `frontend-hot-mess`
     - **Framework Preset**: Next.js (auto-detected)
     - **Build Command**: `npm run build` (auto-detected)
     - **Output Directory**: `.next` (auto-detected)

2. **Configure Frontend Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-backend.vercel.app`)
   - Make sure to add this for **Production**, **Preview**, and **Development** environments

3. **Deploy:**
   - Push to your main branch or manually deploy
   - Your frontend will be available at `https://your-frontend.vercel.app`

### Step 3: Update CORS (if needed)

If you get CORS errors, update `api/index.py` to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://your-frontend-*.vercel.app",  # For preview deployments
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Option 2: Monorepo Deployment (Single Project)

### Step 1: Update `vercel.json`

Create/update `vercel.json` in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend-hot-mess/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend-hot-mess/$1"
    }
  ]
}
```

### Step 2: Update Frontend API URL

Update `frontend-hot-mess/app/page.tsx` to use relative URLs when in production:

```typescript
// In production, use relative URL if deployed together
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? window.location.origin + '/api' : 'http://localhost:8000')
```

### Step 3: Deploy to Vercel

1. **Create a Vercel project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `/` (project root)
     - **Framework Preset**: Other

2. **Set Environment Variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_API_URL`: `/api` (for relative routing) or your backend URL

3. **Deploy:**
   - Push to main branch or manually deploy

---

## Quick Setup Script

For **Option 1 (Separate Projects)**, here's a quick checklist:

### Backend Deployment Checklist:
- [ ] Create Vercel project for backend
- [ ] Set root directory to `/`
- [ ] Add `OPENAI_API_KEY` environment variable
- [ ] Update `vercel.json` (see Step 1 above)
- [ ] Deploy and note the URL

### Frontend Deployment Checklist:
- [ ] Create Vercel project for frontend
- [ ] Set root directory to `frontend-hot-mess`
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable (backend URL)
- [ ] Deploy and test connection

---

## Testing Production Deployment

1. **Test Backend:**
   ```bash
   curl -X POST https://your-backend.vercel.app/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello from production!"}'
   ```

2. **Test Frontend:**
   - Open your frontend URL
   - Send a test message
   - Check browser console (F12) for errors
   - Check Network tab to see API calls

3. **Verify Environment Variables:**
   - In Vercel dashboard, check that all environment variables are set
   - Make sure `NEXT_PUBLIC_API_URL` matches your backend URL exactly (no trailing slash)

---

## Troubleshooting

### CORS Errors
- Update `allow_origins` in `api/index.py` to include your frontend domain
- Make sure credentials are properly configured

### 404 Errors on API Calls
- Check that `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is deployed and accessible
- Check Vercel function logs for errors

### Environment Variables Not Working
- `NEXT_PUBLIC_*` variables must be set in Vercel dashboard
- Redeploy after adding/changing environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

### Backend Not Responding
- Check Vercel function logs
- Verify `OPENAI_API_KEY` is set
- Test backend directly with curl
- Check that `vercel.json` routes are correct

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `requirements.txt` (backend) and `package.json` (frontend)
- Make sure Python version is compatible (Vercel uses Python 3.9 by default)

---

## Recommended: Option 1 (Separate Projects)

**Why separate projects?**
- ✅ Cleaner separation of concerns
- ✅ Independent scaling
- ✅ Easier to manage environment variables
- ✅ Better for team collaboration
- ✅ Can deploy frontend/backend independently

**When to use Option 2 (Monorepo)?**
- You want everything in one place
- You're okay with deploying both together
- You want to use relative URLs

---

## Next Steps After Deployment

1. Set up custom domains (optional)
2. Configure preview deployments
3. Set up monitoring and error tracking
4. Configure rate limiting (if needed)
5. Set up CI/CD pipelines

