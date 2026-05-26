import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Projects from "./pages/Projects";
import Layout from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";
import Register from "./pages/Registrer";
import { Profile } from "./pages/Profile";
import { KanbanBoard } from "./pages/KanbanBoard";
import { KanbanCalendar } from "./pages/KanbanCalendar";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? (
        <Layout>
          <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/projects/:projectId/kanban"
              element={<KanbanBoard />}
            />
            <Route
              path="/projects/:projectId/calendar"
              element={<KanbanCalendar />}
            />

            <Route
              path="/login"
              element={<Navigate to="/projects" replace />}
            />
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
