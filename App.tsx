
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Projects from './pages/Projects.tsx';
import ProjectDetail from './pages/ProjectDetail.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Gallery from './pages/Gallery.tsx';
import ChatBot from './components/ChatBot.tsx';

// Admin Pages
import AdminLogin from './pages/admin/Login.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminProjectForm from './pages/admin/ProjectForm.tsx';
import AdminContentEditor from './pages/admin/ContentEditor.tsx';
import AdminMediaGallery from './pages/admin/MediaGallery.tsx';
import { DataProvider, useData } from './context/DataContext.tsx';

// Fix: Use React.FC with explicit children property to satisfy TypeScript requirements
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useData();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />;
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Fix: Use React.FC with explicit children property to satisfy TypeScript requirements
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <ChatBot />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/new" element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/edit/:id" element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute>
                <AdminContentEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/media" element={
              <ProtectedRoute>
                <AdminMediaGallery />
              </ProtectedRoute>
            } />

            <Route path="*" element={
              <div className="pt-40 pb-24 text-center">
                <h1 className="text-6xl font-black text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">The page you are looking for has vanished into thin air.</p>
                <a href="#/" className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold">Return Home</a>
              </div>
            } />
          </Routes>
        </MainLayout>
      </Router>
    </DataProvider>
  );
};

export default App;
