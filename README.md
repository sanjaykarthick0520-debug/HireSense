# HireSense – AI-Powered Resume Analyzer

HireSense is a full-stack AI-powered resume analysis platform that helps candidates evaluate their resumes against specific job roles. It uses artificial intelligence to analyze resume content, calculate ATS-oriented scores, identify missing keywords, highlight strengths and weaknesses, and provide actionable recommendations.

The application provides an interactive dashboard where users can upload resumes, view analysis results, manage previously analyzed resumes, and compare multiple candidates.

---

## 🚀 Features

### 📄 Resume Upload & Analysis

* Upload resumes in PDF format.
* Extract text from uploaded resumes.
* Specify the target job role.
* Automatically analyze the resume using Google Gemini AI.
* Generate an ATS-oriented overall score.

### 📊 Resume Scoring

The system evaluates resumes across multiple dimensions:

* Overall ATS Score
* Job Match
* Keyword Match
* Technical Skills
* Experience Relevance
* Project Relevance
* Resume Structure

### 🤖 AI-Powered Insights

HireSense generates:

* Resume strengths
* Resume weaknesses
* Missing keywords
* Improvement suggestions
* Job-role-specific recommendations

### 📋 Resume Management

* View previously analyzed resumes.
* Search resumes by filename or target role.
* View detailed analysis results.
* Delete resumes and their associated analysis records.

### 👥 Candidate Comparison

Users can select multiple analyzed resumes and compare candidates based on:

* ATS Score
* Job Match
* Keyword Match
* Technical Skills
* Experience Relevance
* Project Relevance
* Resume Structure
* Overall ranking

The system also supports AI-powered candidate recommendations.

### 📈 Interactive Dashboard

The dashboard provides:

* Total resumes analyzed
* Average ATS score
* Resume history
* Search functionality
* Analysis access
* Candidate comparison
* Resume management

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      Vite            │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express.js │
                    │      Backend         │
                    └──────┬───────┬───────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
    ┌──────────────────┐                ┌─────────────────┐
    │ Prisma ORM       │                │ Google Gemini   │
    │                  │                │      API        │
    └────────┬─────────┘                └────────┬────────┘
             │                                   │
             ▼                                   │
    ┌──────────────────┐                         │
    │ PostgreSQL /      │                         │
    │ Neon Database     │                         │
    └──────────────────┘                         │
                                                 │
                              Resume Text ───────┘
```

Screenshots 

<img width="1876" height="907" alt="Screenshot 2026-08-20 180707" src="https://github.com/user-attachments/assets/2fae1e0b-6947-40a8-b90e-3beafd59b3c6" />

<img width="1882" height="905" alt="Screenshot 2026-08-20 180716" src="https://github.com/user-attachments/assets/3f75c2c6-2078-478f-8f77-930d2fd15ad3" />

<img width="1876" height="908" alt="Screenshot 2026-08-20 180735" src="https://github.com/user-attachments/assets/530010de-7d2e-4d89-bf98-a3644ab62233" />

<img width="1878" height="908" alt="Screenshot 2026-08-20 180745" src="https://github.com/user-attachments/assets/9ce2fc49-0f9b-459b-baa0-74b8b33ea650" />

<img width="1879" height="909" alt="Screenshot 2026-08-20 180757" src="https://github.com/user-attachments/assets/d8d23bb8-6038-4d09-a9fb-ce99c008f126" />

<img width="1874" height="907" alt="Screenshot 2026-08-20 180807" src="https://github.com/user-attachments/assets/7a2629dc-6ce3-4169-8f62-fff5a8e0cabe" />

<img width="1879" height="906" alt="Screenshot 2026-08-20 180822" src="https://github.com/user-attachments/assets/015b3a73-5aad-4139-8730-21821f06c43e" />

<img width="1878" height="904" alt="Screenshot 2026-08-20 180844" src="https://github.com/user-attachments/assets/dceca889-35da-423e-9e39-835978177fd4" />

<img width="1878" height="913" alt="Screenshot 2026-08-20 180924" src="https://github.com/user-attachments/assets/52265b90-25a6-475a-a0d4-77394b200062" />

<img width="1880" height="901" alt="Screenshot 2026-08-20 180940" src="https://github.com/user-attachments/assets/3e2eb1b2-5091-4af4-9488-d72e6b1dd7b0" />


---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Framer Motion
* Lucide React
* React Hot Toast
* jsPDF

### Backend

* Node.js
* Express.js
* Prisma ORM
* Multer
* PDF.js
* CORS
* dotenv

### Database

* PostgreSQL
* Neon PostgreSQL
* Prisma Client

### Artificial Intelligence

* Google Gemini API

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

---

## 📁 Project Structure

```text
HireSense/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Upload/
│   │   │   └── Analysis/
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── resumeController.js
│   │   │   ├── getResumeController.js
│   │   │   ├── deleteResumeController.js
│   │   │   └── compareResumeController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   └── resumeRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── geminiService.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── prisma/
│       └── schema.prisma
│
└── README.md
```

---

## 🗄️ Database Schema

HireSense uses PostgreSQL with Prisma ORM.

### User

Stores user account information.

```text
User
├── id
├── fullName
├── email
├── password
└── createdAt
```

### Resume

Stores uploaded resume information.

```text
Resume
├── id
├── title
├── originalName
├── fileUrl
├── targetRole
├── atsScore
├── aiStatus
├── uploadedAt
├── updatedAt
└── userId
```

### Analysis

Stores the AI-generated resume analysis.

```text
Analysis
├── id
├── targetRole
├── overallScore
├── jobMatch
├── keywordMatch
├── technicalSkills
├── experienceRelevance
├── projectRelevance
├── resumeStructure
├── strengths
├── weaknesses
├── suggestions
├── missingKeywords
├── createdAt
└── resumeId
```

---

## 🔄 Application Workflow

```text
1. User opens HireSense
        ↓
2. User enters target job role
        ↓
3. User uploads PDF resume
        ↓
4. Backend receives the PDF
        ↓
5. PDF text is extracted
        ↓
6. Resume text + target role
   are sent to Gemini AI
        ↓
7. Gemini analyzes the resume
        ↓
8. ATS and job-match scores
   are generated
        ↓
9. Analysis is stored using Prisma
        ↓
10. Results are returned to React
        ↓
11. Dashboard displays the results
```

---

## 🔌 API Endpoints

### Get All Resumes

```http
GET /api/resume
```

Returns all uploaded resumes along with their analyses.

### Upload & Analyze Resume

```http
POST /api/resume/upload
```

Accepts:

```text
resume      → PDF file
targetRole  → Target job role
```

### Compare Resumes

```http
POST /api/resume/compare
```

Accepts multiple resume IDs and an optional target role.

### Delete Resume

```http
DELETE /api/resume/:id
```

Deletes the selected resume and its associated analysis.

---

## ⚙️ Local Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL/Neon PostgreSQL database
* Git
* Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd HireSense
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

DATABASE_URL="your_postgresql_connection_string"

JWT_SECRET="your_jwt_secret"

GEMINI_API_KEY="your_gemini_api_key"
```

> Never commit `.env` files or expose API keys, database passwords, or other credentials publicly.

---

## 4. Generate Prisma Client

From the `server` directory:

```bash
npx prisma generate
```

---

## 5. Synchronize the Database

If the Prisma schema needs to be applied to the database:

```bash
npx prisma db push
```

---

## 6. Start the Backend

From:

```text
HireSense/server
```

run:

```bash
npm start
```

The backend should run at:

```text
http://localhost:5000
```

---

## 7. Install Frontend Dependencies

Open a new terminal:

```bash
cd HireSense/client
npm install
```

---

## 8. Start the Frontend

HireSense uses Vite.

Run:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🧪 Testing the Application

After starting both servers:

### Backend

```text
http://localhost:5000
```

### Frontend

```text
http://localhost:5173
```

Then:

1. Open the frontend.
2. Navigate to the dashboard.
3. Enter a target job role.
4. Upload a PDF resume.
5. Start the analysis.
6. Wait for Gemini AI to process the resume.
7. Review the ATS score and detailed analysis.
8. View the resume in the dashboard history.
9. Upload additional resumes if required.
10. Use candidate comparison to compare analyzed resumes.

---

## 🔐 Security

The project uses environment variables for sensitive configuration.

The following values should **never be committed to GitHub**:

```text
DATABASE_URL
GEMINI_API_KEY
JWT_SECRET
```

Make sure `.env` is included in `.gitignore`.

If an API key or database credential is accidentally exposed, revoke and regenerate it immediately.

---

## 📊 Key Benefits

HireSense helps candidates:

* Understand how well their resume matches a target role.
* Identify missing job-specific keywords.
* Improve technical and project descriptions.
* Understand resume strengths and weaknesses.
* Evaluate ATS readiness.
* Compare multiple resumes.
* Receive AI-generated recommendations.

---

## 🎯 Future Enhancements

Potential improvements include:

* User authentication and authorization
* Resume version management
* Job-description upload
* Direct job-description matching
* Resume optimization suggestions
* Multiple resume templates
* LinkedIn profile analysis
* Skill-gap recommendations
* Advanced analytics
* Resume rewriting with AI
* Cloud deployment

---

## 👨‍💻 Development

HireSense follows a separated frontend/backend architecture:

```text
Frontend
React + Vite
     │
     │ Axios / REST API
     ▼
Backend
Node.js + Express
     │
     ├── Prisma → PostgreSQL
     │
     └── Gemini API → AI Analysis
```

This architecture keeps the user interface, API/business logic, database layer, and AI services separated and easier to maintain.

---

## 📜 License

This project is currently intended for educational and project-development purposes.

---

## ⭐ Project Highlights

**HireSense** combines:

* Full-stack web development
* Artificial Intelligence
* Natural language processing
* Resume analysis
* ATS scoring
* Database management
* REST API development
* Interactive dashboard design

into a single end-to-end application designed to help candidates improve their resumes for specific job opportunities.
