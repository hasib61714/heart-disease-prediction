# 🚀 Deployment Guide - Heart Disease Prediction System

Complete guide to deploy your project on **FREE** platforms!

---

## 🎯 Deployment Options

### Backend Options (Choose One):
1. **Render.com** ⭐ RECOMMENDED - Easy, reliable
2. **Railway.app** - Good alternative
3. **PythonAnywhere** - Simple for Python

### Frontend Options (Choose One):
1. **Vercel** ⭐ RECOMMENDED - Best for React
2. **Netlify** - Great alternative
3. **GitHub Pages** - Simple static hosting

---

## 📦 Backend Deployment - Render.com (FREE)

### Step 1: Prepare Backend for Deployment

Create `render.yaml` in backend folder:

```yaml
services:
  - type: web
    name: heart-disease-api
    env: python
    buildCommand: "pip install -r requirements.txt && python train_model.py"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
```

### Step 2: Update Backend for Production

Update `backend/main.py` - add CORS for your frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app",  # Add your Vercel URL
        "*"  # For testing only, remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Deploy to Render

1. **Create Account**: Go to https://render.com
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**: Authorize Render to access your repo
4. **Configure**:
   - Name: `heart-disease-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt && python train_model.py`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: `Free`

5. **Deploy**: Click "Create Web Service"

6. **Wait**: First deployment takes 5-10 minutes

7. **Get URL**: Copy your API URL (e.g., `https://heart-disease-api.onrender.com`)

### ✅ Test Backend

Open: `https://your-api-url.onrender.com/docs`

You should see FastAPI Swagger documentation!

---

## 🌐 Frontend Deployment - Vercel (FREE)

### Step 1: Prepare Frontend

Update `frontend/.env`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  }
})
```

### Step 2: Deploy to Vercel

**Method 1: Using Vercel CLI** (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? heart-disease-frontend
# - Directory? ./
# - Override settings? No
```

**Method 2: Using Vercel Website**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Environment Variables:
   - Add `VITE_API_URL` = `https://your-backend.onrender.com`

6. Click "Deploy"

### Step 3: Update Backend CORS

After getting Vercel URL, update backend `main.py`:

```python
allow_origins=[
    "https://your-frontend.vercel.app",
    "http://localhost:3000"
],
```

Redeploy backend on Render (it will auto-redeploy).

### ✅ Test Frontend

Open: `https://your-frontend.vercel.app`

---

## 🔄 Alternative: Railway.app (Backend)

### Deploy to Railway

1. Go to https://railway.app
2. "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt && python train_model.py`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `PORT` = `8000` (Railway provides this automatically)
   - `PYTHON_VERSION` = `3.10`

6. Generate Domain → Copy URL

---

## 🔄 Alternative: Netlify (Frontend)

### Deploy to Netlify

1. Go to https://netlify.com
2. "Add new site" → "Import an existing project"
3. Connect GitHub → Select repo
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

5. Environment variables:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`

6. Deploy

---

## 📝 Post-Deployment Checklist

### ✅ Backend Checks:
- [ ] API docs accessible at `/docs`
- [ ] ML model loaded successfully
- [ ] Database created
- [ ] CORS configured for frontend URL
- [ ] All endpoints working

### ✅ Frontend Checks:
- [ ] Homepage loads
- [ ] Can create patient
- [ ] Prediction works
- [ ] PDF download works
- [ ] Excel export works
- [ ] Language switch works
- [ ] Dark mode works

---

## 🐛 Common Deployment Issues

### Issue 1: Backend - "Module not found"

**Solution**: Ensure `requirements.txt` has all dependencies:

```bash
cd backend
pip freeze > requirements.txt
```

### Issue 2: Frontend - "API call failed"

**Solution**: Check CORS settings in backend:

```python
# backend/main.py
allow_origins=["https://your-vercel-url.vercel.app"]
```

### Issue 3: Backend - "Model file not found"

**Solution**: Ensure `train_model.py` runs in build command:

```
pip install -r requirements.txt && python train_model.py
```

### Issue 4: Frontend - Environment variables not working

**Solution**: Restart Vercel build after adding env vars.

### Issue 5: Render - Service not starting

**Solution**: Check logs in Render dashboard. Common fixes:
- Add `--host 0.0.0.0` to uvicorn command
- Use `$PORT` environment variable
- Check Python version (use 3.10)

---

## 💰 Free Tier Limits

### Render.com (Backend):
- ✅ 750 hours/month (enough for 24/7)
- ✅ Sleeps after 15 min inactivity
- ✅ First request after sleep takes ~30s
- ✅ 512 MB RAM

### Vercel (Frontend):
- ✅ Unlimited bandwidth
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

### Railway.app:
- ✅ $5 free credit/month
- ✅ No sleep (stays active)
- ✅ Better for active projects

---

## 🎯 Production Optimization

### Backend Optimization:

1. **Add Database Persistence** (Render PostgreSQL):
```python
# Use PostgreSQL instead of SQLite for production
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./heart_disease.db")
```

2. **Add Caching**:
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_prediction(patient_data):
    # Cache predictions
    pass
```

3. **Add Rate Limiting**:
```bash
pip install slowapi
```

### Frontend Optimization:

1. **Build Optimization**:
```javascript
// vite.config.js
build: {
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom']
      }
    }
  }
}
```

2. **Image Optimization**: Use WebP format

3. **Code Splitting**: Lazy load pages

---

## 📊 Monitoring

### Render Dashboard:
- View logs
- Monitor CPU/memory
- Track deployments

### Vercel Analytics:
- Page views
- Performance metrics
- Error tracking

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use Render environment variables
3. **CORS**: Restrict to your frontend domain only
4. **HTTPS**: Both platforms provide free SSL
5. **Rate Limiting**: Implement on backend

---

## 🆘 Support & Resources

### Render.com:
- Docs: https://render.com/docs
- Community: https://community.render.com

### Vercel:
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

### Issues:
- Check deployment logs first
- Google error messages
- Ask on Stack Overflow

---

## ✅ Final Steps

After successful deployment:

1. **Update README**: Add live demo links
2. **Test Everything**: Full user flow
3. **Share Links**: 
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-api.onrender.com`
   - API Docs: `https://your-api.onrender.com/docs`

4. **Monitor**: Check for errors in first 24 hours

---

## 🎉 You're Live!

Your Heart Disease Prediction System is now deployed and accessible worldwide!

**Share your project:**
- Add to LinkedIn
- Share on Twitter
- Include in portfolio
- Show to potential employers

---

**Questions? Issues?** Open an issue on GitHub!

Happy Deploying! 🚀
