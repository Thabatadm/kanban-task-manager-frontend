import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Layout> 
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <div className="text-black dark:text-white bg-slate-100 dark:bg-slate-950 text-2xl font-bold text-center mt-10 italic">Welcome to the Terminal Workspace</div> : <Navigate to="/login" />} 
        />
      </Routes>
    </Layout>
  );
}

export default App;