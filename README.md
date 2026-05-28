# 🎨 Kanban Task Manager - Frontend

A modern, high-performance, and fully responsive Kanban board dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. This application delivers a fluid user experience with context-driven state management, full mobile adaptation, dual-theming, and interactive calendar workflows.

The application consumes the production RESTful API deployed on **Render** and connects seamlessly to a **Supabase PostgreSQL** cluster.

---

# 🚀 Live Demo & Production Environment

Experience the live application directly in your browser:

👉 [Launch Live Application on Vercel](https://kanban-task-manager-frontend.vercel.app/)

---

# 🧪 Instant Testing Credentials

To explore the **Role-Based Access Control (RBAC)** matrices and layout features immediately without registering a new account, use the following pre-configured sandbox profile:

* **Email:** `anamaria@example.co`
* **Password:** `pass1234`

### 📊 Pre-Loaded Project Scenarios (RBAC Showcase)

Once logged in with Ana Maria's account, you will have access to two pre-loaded operational workspaces designed to test the security restrictions of the API:

1. **`NEON HYDRA` [Role: DEVELOPER]**
   * **Behavior:** Structural adjustments are locked. You **cannot** edit the project configurations, manage members, or delete tasks.
   * **Allowed Actions:** You can freely drag, drop, update, and modify task details to simulate daily sprint progress.
2. **`AetherScan Alpha` [Role: OWNER / MASTER]**
   * **Behavior:** Full administrative privileges are granted. You have unrestricted access to create, update, move, or permanently delete tasks, projects, and member rosters.

> 💡 *Note: While this profile is provided for quick evaluation, you can also register a brand-new user from scratch to initialize empty workspaces.*

---

# ✨ Key Features

* **Advanced Kanban Workflow:** Interactive task lifecycle tracking with real-time feedback.
* **Global Project Calendar:** A dedicated calendar view for each project that aggregates task deadlines globally, allowing users to inspect and access specific cards directly from the calendar grid.
* **Responsive Mobile-First UI:** Completely refactored modal layouts, adaptive data grids, and fluid touch paddings optimized for cross-device viewports and virtual keyboards.
* **Dynamic System Theming:** Native support for **Light Mode** and **Dark Mode** terminal aesthetics with persistent configuration storage.

---

# 🛠️ Tech Stack & Architecture

- **Core Framework:** React 18 + TypeScript (Strict Type Safety)
- **Styling Pipeline:** Tailwind CSS (Responsive Utility-First Design)
- **API Client:** Axios (Interceptors for Bearer Token injection)
- **Routing:** React Router DOM
- **State & Context:** React Context API for decoupled global workflows.

### 📂 Directory Architecture
The project follows a modular, clean-architecture pattern separating atomic UI elements from business logic layers:

```bash
src/
├── api/
│   └── axios.ts            # Axios global client instance & interceptors
├── assets/                 # Icons, logos, and static brand themes
├── components/
│   ├── card/               # Card components and detailed task modals
│   ├── layout/             # Shared shell views (Navbar, Sidebar, Footer, Layout wrapper)
│   ├── profile/            # Profile settings and management dialogs
│   ├── projects/           # Project wizards and overview interfaces
│   └── ui/                 # Atomic design tokens (Fluid responsive Buttons & Inputs)
├── context/                # Context API definitions and state providers (Auth, Theme)
├── hooks/                  # Logic abstractions wrapping contexts (useAuth, useTheme)
├── pages/                  # Route-level view components (KanbanBoard, KanbanCalendar, Login...)
├── services/               # API endpoint connection layers grouped by scope
└── types/                  # Strict TypeScript interfaces and type declaration definitions
