import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, PlusCircle, Sparkles, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user } = useAuth();

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-amber-500 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
                        <BookOpen className="text-amber-400" />
                        <span>حكايات</span>
                    </NavLink>
                    <nav className="hidden md:flex items-center gap-4">
                        <NavLink to="/create" className={navLinkClasses}>
                            <PlusCircle size={20} />
                            <span>قصة جديدة</span>
                        </NavLink>
                        <NavLink to="/generate" className={navLinkClasses}>
                            <Sparkles size={20} />
                            <span>توليد بالذكاء الاصطناعي</span>
                        </NavLink>
                    </nav>
                     {user && (
                        <NavLink to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                            <span>{user.name}</span>
                            <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover" />
                        </NavLink>
                    )}
                </div>
            </div>
             {/* Mobile Navigation */}
            <div className="md:hidden bg-gray-800 p-2">
                 <nav className="flex justify-around items-center gap-1">
                    <NavLink to="/" className={navLinkClasses} end>
                        <BookOpen size={20} /> <span className="text-xs">الرئيسية</span>
                    </NavLink>
                    <NavLink to="/create" className={navLinkClasses}>
                        <PlusCircle size={20} /> <span className="text-xs">جديدة</span>
                    </NavLink>
                    <NavLink to="/generate" className={navLinkClasses}>
                        <Sparkles size={20} /> <span className="text-xs">توليد</span>
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClasses}>
                        <UserCircle size={20} /> <span className="text-xs">ملفي</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
