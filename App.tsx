import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import CreatePage from './pages/CreatePage';
import GeneratePage from './pages/GeneratePage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Spinner from './components/Spinner';
import EditStoryPage from './pages/EditStoryPage';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { AnimatePresence } from 'framer-motion';

const AppContent = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/story/:id" element={<StoryPage />} />
                <Route path="/story/:id/edit" element={<EditStoryPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </AnimatePresence>
    )
}

const AuthGate = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900"><Spinner size="16" /></div>;
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
               <AppContent />
            </main>
            <Footer />
        </div>
    );
}

function App() {
  return (
    <ToastProvider>
        <AuthProvider>
            <AuthGate />
            <ToastContainer />
        </AuthProvider>
    </ToastProvider>
  );
}

export default App;