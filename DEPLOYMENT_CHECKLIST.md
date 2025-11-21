# Quick Deployment Checklist

## 🚀 Option 1: Separate Projects (Recommended)

### Backend Deployment

1. **Create Backend Project on Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your repository
   - Settings:
     - Root Directory: `/` (leave as root)
     - Framework: Other
     - Build Command: (leave empty)
     - Output Directory: (leave empty)

2. **Set Environment Variables:**
   - `OPENAI_API_KEY` = `your-openai-api-key-here`

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - **Copy the deployment URL** (e.g., `https://your-backend-abc123.vercel.app`)

---

### Frontend Deployment

1. **Create Frontend Project on Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import the **same** repository
   - Settings:
     - Root Directory: `frontend-hot-mess`
     - Framework: Next.js (auto-detected)
     - Build Command: `npm run build` (auto)
     - Output Directory: `.next` (auto)

2. **Set Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-abc123.vercel.app` (use the backend URL from step above)
   - ⚠️ **Important**: Add this for all environments (Production, Preview, Development)

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Your app is live! 🎉

---

## ✅ Verification Steps

1. **Test Backend:**
   ```bash
   curl -X POST https://your-backend-url.vercel.app/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```
   Should return: `{"reply":"..."}`

2. **Test Frontend:**
   - Open your frontend URL
   - Send a test message
   - Check browser console (F12) for errors
   - Message should appear and get a response

3. **Check Environment Variables:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all variables are set correctly

---

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `api/index.py` `allow_origins` to include your frontend domain |
| 404 on API calls | Check `NEXT_PUBLIC_API_URL` is set correctly (no trailing slash) |
| Environment variable not working | Redeploy after adding/changing variables |
| Backend returns 500 | Check Vercel function logs, verify `OPENAI_API_KEY` is set |

---

## 📝 Notes

- Backend URL format: `https://your-backend-abc123.vercel.app` (no trailing slash)
- Frontend will automatically use the environment variable in production
- Both projects can be in the same GitHub repo, just different Vercel projects
- Preview deployments will use the same environment variables

---

## 🎯 Quick Commands

After deployment, test with:

```bash
# Test backend
curl -X POST https://YOUR_BACKEND_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'

# Or use the frontend at:
# https://YOUR_FRONTEND_URL
```

