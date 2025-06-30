import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, PlusCircle, User, LogOut, Bookmark } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useUser();

  const activeLinkStyle = {
    backgroundColor: 'rgb(71 85 105)', // slate-600
    color: 'white',
  };
   const darkActiveLinkStyle = {
    backgroundColor: 'rgb(51 65 85)', // slate-700
    color: 'white',
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-md dark:shadow-lg dark:shadow-slate-950/20 border-b border-slate-200 dark:border-slate-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
              <BookOpen className="h-7 w-7 text-indigo-500 dark:text-indigo-400" />
              <span>نسيج الحكايات</span>
            </NavLink>
            <div className="hidden md:flex items-center gap-2">
                <NavLink
                to="/"
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                style={({ isActive }) => (isActive ? (document.documentElement.classList.contains('dark') ? darkActiveLinkStyle : activeLinkStyle) : {})}
                >
                <BookOpen className="h-5 w-5" />
                <span >القصص</span>
                </NavLink>
                <NavLink
                to="/create"
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                style={({ isActive }) => (isActive ? (document.documentElement.classList.contains('dark') ? darkActiveLinkStyle : activeLinkStyle) : {})}
                >
                <PlusCircle className="h-5 w-5" />
                <span>أنشئ قصة</span>
                </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user && (
              <>
                <NavLink
                  to="/reading-list"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full"
                  title="قائمة القراءة"
                >
                  <Bookmark className="h-5 w-5" />
                </NavLink>
                <NavLink
                  to={`/profile/${user}`}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="ملفك الشخصي"
                >
                    <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <span className="font-medium hidden sm:inline">{user}</span>
                </NavLink>
                <button
                  onClick={logout}
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;