import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const AuthGate: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl dark:shadow-slate-950/50 animate-fade-in text-center border border-slate-200 dark:border-slate-700">
        <User className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">مرحباً بك في نسيج الحكايات</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">الرجاء إدخال اسمك للمتابعة والمشاركة.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك هنا..."
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-slate-900 dark:text-white text-center placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthGate;