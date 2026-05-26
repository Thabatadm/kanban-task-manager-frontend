import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-bg-main-light dark:bg-bg-main-dark">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && <Sidebar />}

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
