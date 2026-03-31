# 🚀 HexaPath AI

**Real-time AI-powered TSR Career Navigation Platform**

HexaPath AI is a real-time, AI-driven career navigation system designed for enterprise consultants. It empowers employees to clearly understand their current skill gaps, explore Technical Skill Requirement (TSR) roles, and generate hyper-personalized career roadmaps using cutting-edge AI. By bridging the gap between current proficiencies and future goals, HexaPath equips the modern workforce to upskill intelligently.

---

## ✨ Features

* **🧠 AI Career Path Generator**: Instantly generate realistic, step-by-step career roadmaps customized to the user's specific skill level and target role.
* **📊 Skill Gap Analysis**: Multi-dimensional radar charts and structured metrics identifying critical hard and soft skill deficiencies.
* **⚡ Real-time Dashboard**: Interactive, dynamic visualization of progress, goals, and role intelligence.
* **🔒 Secure Authentication**: Battle-tested JWT and Supabase-backed user authentication ensuring data privacy.
* **🛡️ Fallback AI Engine**: Zero-downtime architecture featuring a high-quality static fallback system to ensure 100% demo reliability even if AI rate limits are exceeded.

---

## 🧠 How It Works

1. **Profile Sync**: The user authenticates and completes a digital intake detailing their current skills, industry, and target TSR.
2. **Analysis Engine**: The FastAPI backend cross-references the user's profile with a vast knowledge base of role requirements to compute precise gap scores.
3. **AI Generation**: The OpenRouter AI engine synthesizes the gap data to construct an actionable, timeline-based career development plan.
4. **Actionable Insights**: The user is presented with curated learning modules and coaching feedback designed specifically to bridge their identified gaps.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), TailwindCSS, Chart.js
* **Backend**: FastAPI (Python), SQLAlchemy
* **Database & Auth**: Supabase (PostgreSQL), JWT
* **AI Intelligence**: OpenRouter (Multi-Model Fallback: Mistral/Gemma)
* **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📸 Screenshots

*(Replace placeholders with actual project screenshots)*

> **Dashboard Overview**
> `![Dashboard Screenshot](link-to-image)`

> **AI Skill Gap Analyzer**
> `![Analyzer Screenshot](link-to-image)`

> **Personalized Career Roadmap**
> `![Roadmap Screenshot](link-to-image)`

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/HexapathAI.git
cd HexapathAI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create `.env` files in both your `frontend` and `backend` directories using the following templates:

### `backend/.env`
```env
DATABASE_URL=postgresql://postgres.xxx:xxx@aws-0-xxxx.pooler.supabase.com:6543/postgres
SUPABASE_JWT_SECRET="your_supabase_jwt_secret"
OPENROUTER_API_KEY="sk-or-v1-xxx"
```

### `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJxxx
REACT_APP_EMAILJS_SERVICE_ID=your_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_key
```

---

## ▶️ Running Locally

Start both the frontend and backend servers simultaneously to run the application locally.

**Start the Backend (Port 8000)**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Start the Frontend (Port 3000)**
```bash
cd frontend
npm start
```

---

## 🌐 Deployment

HexaPath AI is designed for robust, decoupled edge deployment:

* **Frontend**: Hosted on [Vercel](https://vercel.com). Configure the `Root Directory` in Vercel to `frontend`.
* **Backend**: Hosted on [Render](https://render.com). Simply link the repository, supply the `requirements.txt` build command, and start the FastAPI web service via uvicorn.

---

## 🎯 Use Case

**Scenario**: A Mid-Level Software Engineer wants to transition into a Cloud Architect role.
Usually, this consultant would have to navigate dozens of generic online courses without knowing exactly what standard their enterprise requires. HexaPath AI analyzes their current profile, highlights critical gaps (e.g., Kubernetes, Terraform), and builds a focused 6-month roadmap bypassing the skills they already possess. This optimizes time-to-productivity for the enterprise and eliminates career friction for the employee.

---

## ⚠️ Limitations

* **AI Generation Constraints**: API rate-limits may occasionally force the system into local fallback mode during heavy parallel usage.
* **Role Knowledge Base**: The current static knowledge base evaluates ~15 core tech roles, but hasn't yet scaled to niche enterprise specific functional roles.

---

## 🚀 Future Improvements

* **ATS Resume Integration**: Automatic skill gap parsing directly from PDF resumes.
* **LMS Integration**: Direct course linking from enterprise platforms (e.g., Udemy Business, LinkedIn Learning).
* **Manager Dashboards**: Aggregate team-level upskilling metrics for HR and L&D leaders.
