# 🚀 LeadFlow CRM - Premium Lead Management System (Mini CRM)

LeadFlow CRM is a full-stack, state-of-the-art **Lead Management System (Mini CRM)** engineered with **React** (Vite), **Node.js** (Express), and **PostgreSQL**. 

Designed with modern UI aesthetics—including an elegant glassmorphism overlay, responsive CSS grids, dynamic KPI dashboards, slide-in toasts, full client-side validations, and direct WhatsApp CRM reach-outs—it is built with clean, comment-rich, beginner-friendly code.

---

## 🌟 Key Features

* **📊 Live Dashboard Statistics:** Instantly displays *Total*, *Interested*, and *Converted* metrics, including dynamic conversion rate math percentages.
* **🌗 Intelligent Theme Selector:** Smooth transitions between a sleek Light mode and a highly-calibrated, high-contrast Slate Dark mode.
* **📱 Responsive Multi-View Layout:** Switch dynamically between a responsive **Card Grid** view and a clean **Data Table** view.
* **🛡️ Secure Admin Area:** Simple administrator session login (`JWT` based). Keeps standard actions open but secures destructive lead deletions to authenticated admins.
* **💬 WhatsApp Click-to-Chat:** Direct integration utilizing WhatsApp deep links, auto-populating custom reach-out messages for the lead's name.
* **⚡ Robust Search & Filters:** Search fuzzy strings (name/phone) and instantly filter directories by lead status and communication source.
* **🛠️ Full Validations:** In-app real-time feedback with custom warnings for names, phone numbers, and communication channels.
* **📦 Production Architecture:** Clean separation between `client/` and `server/` with global Express error catchers, parameter query sanitization, and structured indexes.

---

## 🛠️ Technology Stack

| Tier | Component | Technology Used |
| :--- | :--- | :--- |
| **Frontend** | Application Shell | **React (Vite)** |
| | HTTP Client | **Axios** |
| | Custom Styling | **CSS3 Variables (Vanilla CSS)** |
| | Graphic Assets | **Lucide-React** |
| **Backend** | API Engine | **Node.js / Express** |
| | DB Client | **pg (node-postgres)** |
| | Authentication | **jsonwebtoken (JWT), bcryptjs** |
| | Logger | **Morgan** |
| **Database** | Database Engine | **PostgreSQL** |

---

## 📂 Project Structure

```text
├── database/
│   └── schema.sql          # PostgreSQL table creation & seed queries
├── server/
│   ├── config/
│   │   └── db.js           # PostgreSQL client pool configuration
│   ├── middleware/
│   │   ├── auth.js         # JWT verification middleware
│   │   └── errorHandler.js # Global Express centralized error handling
│   ├── routes/
│   │   ├── auth.js         # Admin authorization endpoint
│   │   └── leads.js        # REST endpoints (GET, POST, PUT, DELETE) for CRM
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
│   │   │   ├── Login.jsx     # Slide-in admin authentication modal
│   │   │   ├── Navbar.jsx    # Sticky navigation, auth switches & theme selectors
│   │   │   └── Toast.jsx     # Self-dismissing UI toast feedback
│   │   ├── services/
│   │   │   └── api.js        # Axios instance configuring JWT request wrappers
│   │   ├── App.jsx           # Main controller orchestration
│   │   └── index.css         # CSS design token custom variables stylesheet
│   └── package.json        # Frontend npm script declarations
└── README.md               # Extensive guide setup & project highlights
```

---

## ⚙️ Installation & Setup

Follow these instructions to run the full-stack system locally:

### 1. Database Setup (PostgreSQL)
1. Launch your PostgreSQL CLI (`psql`) or open an interface like **pgAdmin**.
2. Create a new database named `lead_crm`:
   ```sql
   CREATE DATABASE lead_crm;
   ```
3. Execute the SQL script located in `database/schema.sql` to build tables, constraints, performance indexes, and seed mock data:
   ```bash
   # From your terminal:
   psql -U postgres -d lead_crm -f database/schema.sql
   ```
   *(Alternatively, copy-paste the queries inside `database/schema.sql` directly into your query editor and execute them).*

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
4. Verify the database configurations inside `.env`:
   ```env
   PORT=5000
   PG_HOST=localhost
   PG_USER=postgres
   PG_PASSWORD=your_postgres_password_here
   PG_DATABASE=lead_crm
   PG_PORT=5432
   JWT_SECRET=supersecretcrmtokenkey123
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
5. Start the backend development server using nodemon:
   ```bash
   npm run dev
   ```
   The API will launch successfully at: `http://localhost:5000`

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

## 🔑 Default Administrator Credentials

To test the admin functionality (such as deleting leads or updating information), authenticate using:
* **Username:** `admin`
* **Password:** `admin123`

---

## 🚀 Advanced Performance Configurations

* **Performance Optimization:** Index hooks on `status` and `source` columns guarantee ultra-fast querying as the database grows to thousands of records.
* **Request Security:** All SQL operations utilize parameterized arguments (`$1`, `$2`, etc.), preventing SQL injections.
* **Auto-Session Restore:** Logging in securely caches token configurations inside local storage. Reloading the browser preserves your administrative session seamlessly.
