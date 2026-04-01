<div align="center">
  <img src="assets/favicon.png" alt="HexaPath AI Logo" width="120" />
</div>

#  HexaPath AI**Real-time AI-powered TSR Career Navigation Platform**

HexaPath AI is a real-time, AI-driven career navigation system designed for enterprise consultants. It empowers employees to clearly understand their current skill gaps, explore Technical Skill Requirement (TSR) roles, and generate hyper-personalized career roadmaps using cutting-edge AI. By bridging the gap between current proficiencies and future goals, HexaPath equips the modern workforce to upskill intelligently.

---
## 🔗 Live Demo
👉 https://hexapath-ai-7idb.vercel.app

## 💻 GitHub Repository
👉 https://github.com/biyalizabraham08/HexapathAI

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
2. **Analysis Engine**: The FastAPI backend cross-references the user's profile with a structured role requirement dataset to compute precise gap scores.
3. **AI Generation**: The OpenRouter AI engine synthesizes the gap data to construct an actionable, timeline-based career development plan.
4. **Actionable Insights**: The user is presented with curated learning modules and coaching feedback designed specifically to bridge their identified gaps.
5. **Fallback AI Engine**: Ensures uninterrupted experience by providing high-quality precomputed career paths when AI services are unavailable.

---

## 🛠️ Tech Stack

**Frontend:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend:**
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

**Database &Auth:**
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**AI:**
![Mistral](https://img.shields.io/badge/Mistral_7B-100000?style=for-the-badge&logo=mistral&logoColor=white)

**Deployment:**
>**- Frontend:**![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
>**- Backend:**![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

---

## 📸 Screenshots


> **Dashboard Overview**
> ![Dashboard Screenshot](assets/dashboard1.png)

> **AI Skill Gap Analyzer**
> ![Analyzer Screenshot](assets/analyzer.png)

> **Personalized Career Roadmap**
> ![Roadmap Screenshot](assets/roadmap.png)

---

## 🗂️ Project Structure

```text
HexapathAI/
├── assets/                  # Documentation images and screenshots
├── backend/                 # Python FastAPI Server
│   ├── app/                 # Application codebase
│   │   ├── agents/          # OpenRouter AI Integrations
│   │   ├── api/             # API Endpoints (FastAPI Routers)
│   │   ├── core/            # Configs, Security, and JWT
│   │   ├── db/              # SQLAlchemy Database Setup
│   │   └── schemas/         # Pydantic Data Models
│   ├── requirements.txt     # Python Dependencies
│   └── .env                 # Backend Secrets
├── frontend/                # React UI Application
│   ├── public/              # Static Frontend Assets
│   ├── src/                 # Application codebase
│   │   ├── components/      # Reusable React UI Components
│   │   ├── context/         # React Context (Auth State)
│   │   ├── pages/           # Application Views/Routes
│   │   └── services/        # API and Supabase Client
│   ├── package.json         # Node Dependencies
│   └── .env                 # Frontend Secrets
└── README.md                # Project Documentation
```

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
* **Manager Dashboards Enhancements**: Advanced team-level analytics, multi-user tracking, and enterprise reporting features.
