# 🚀 LeadFlow CRM - Premium Simplified Lead Management System

LeadFlow CRM is a full-stack, state-of-the-art **Lead Management System (Mini CRM)** engineered with **React** (Vite), **Node.js** (Express), and **Supabase (PostgreSQL)**. 

This version has been beautifully simplified to remove all administrative login gates, keeping the CRM entirely open, extremely fast, and lightweight. Anyone can add, view, update status, and delete leads directly without any authentication required.

---

## 🌟 Key Features

* **📊 Live Dashboard Statistics:** Instantly displays *Total*, *Interested*, and *Converted* metrics, including dynamic conversion rate math percentages.
* **🌗 Intelligent Theme Selector:** Smooth transitions between a sleek Light mode and a highly-calibrated, high-contrast Slate Dark mode.
* **📱 Responsive Multi-View Layout:** Switch dynamically between a responsive **Card Grid** view and a clean **Data Table** view.
* **⚡ Supabase REST Direct Connection:** Features a dual-backend connector. Bypasses raw connection pooling issues by dynamically talking directly to Supabase REST endpoints when configuring API keys.
* **💬 WhatsApp Click-to-Chat:** Direct integration utilizing WhatsApp deep links, auto-populating custom reach-out messages for the lead's name.
* **🔍 Fuzzy Search & Filter Queries:** Search fuzzy strings (name/phone) and instantly filter directories by lead status and communication source.
* **🛠️ Full Validations:** In-app real-time feedback with custom warnings for names, phone numbers, and communication channels.
* **📦 Lightweight & Structured:** Extremely clean folder layout, removing bloated auth routes, middlewares, and local session variables for maximum performance.

---

## 🛠️ Technology Stack

| Tier | Component | Technology Used |
| :--- | :--- | :--- |
| **Frontend** | Application Shell | **React (Vite)** |
| | HTTP Client | **Axios** |
| | Custom Styling | **CSS3 Variables (Vanilla CSS)** |
| | Graphic Assets | **Lucide-React** |
| **Backend** | API Engine | **Node.js / Express** |
| | DB Client | **pg (node-postgres) & Native Fetch** |
| | Logger | **Morgan** |
| **Database** | Database Engine | **PostgreSQL (Supabase)** |

---

## 📂 Simplified Project Structure

```text
├── database/
│   └── schema.sql          # PostgreSQL table creation & seed queries
├── server/
│   ├── config/
│   │   └── db.js           # PostgreSQL client pool configuration (local fallback)
│   ├── middleware/
│   │   └── errorHandler.js # Global Express centralized error handling
│   ├── routes/
│   │   └── leads.js        # REST endpoints (GET, POST, PUT, DELETE) with Supabase REST
│   ├── .env.example        # Environment variables configuration template
│   ├── package.json        # Backend npm script declarations
│   └── index.js            # Main Express application orchestrator
├── client/
│   ├── index.html          # App wrapper with optimized SEO meta markers
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx # Dynamic statistics metrics header
│   │   │   ├── LeadCard.jsx  # Lead layout card with WhatsApp button
│   │   │   ├── LeadForm.jsx  # Multi-state validator lead entry form
│   │   │   ├── Navbar.jsx    # Sticky navigation & theme selectors
│   │   │   └── Toast.jsx     # Self-dismissing UI toast feedback
│   │   ├── services/
│   │   │   └── api.js        # Axios instance configured with base URL
│   │   ├── App.jsx           # Main controller orchestration
│   │   └── index.css         # CSS design token custom variables stylesheet
│   └── package.json        # Frontend npm script declarations
├── .gitignore              # Safely ignores node_modules and private .env configurations
└── README.md               # Extensive guide setup & project highlights
```

---

## ⚙️ Installation & Setup

Follow these instructions to run the simplified full-stack system locally:

### 1. Database Setup (Supabase)
1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Click **New Query**.
3. Copy the full content of the [database/schema.sql](database/schema.sql) file and click **Run**.
4. **Important (Disable RLS for public access):** Create a new query, paste the following command, and click **Run** to allow the API to write leads:
   ```sql
   ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
   ```

---

### 2. Backend Server Setup (`server/`)
1. Open a new terminal inside the `server/` directory.
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Duplicate the `.env.example` file and save it as `.env`:
   ```bash
   cp .env.example .env
   ```
4. Verify the database configurations inside `.env` using your **Supabase REST credentials** (found under Project Settings -> API):
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Supabase REST Direct Connection
   SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
   SUPABASE_KEY=your_supabase_anon_publishable_key_here
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will launch successfully at: `http://127.0.0.1:5000`

---

### 3. Frontend Client Setup (`client/`)
1. Open a second terminal inside the `client/` directory.
2. Install the client packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local address in your browser:
   `http://localhost:5173`

---

## 💡 Port Mismatch Troubleshoot
If your frontend returns a network error `Failed to connect to the backend server`, it is usually because the browser resolves `localhost` to IPv6 (`::1`) while the server binds to IPv4 (`127.0.0.1`). 
This CRM solves that by explicitly binding the Express server to `0.0.0.0` and routing Axios requests directly to `http://127.0.0.1:5000/api` for absolute stability!
