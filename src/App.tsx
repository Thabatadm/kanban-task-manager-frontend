import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Projects from './pages/Projects'; 
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<div className="text-black dark:text-white text-2xl font-bold text-center mt-10 italic">Welcome to the Terminal Workspace</div>} />
            <Route path="/projects" element={<Projects />} />
            
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
           
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      ) : (
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;