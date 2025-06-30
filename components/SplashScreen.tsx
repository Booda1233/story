import React from 'react';
import { BookOpen } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center z-[200] animate-fade-in">
      <div className="relative">
        <BookOpen className="h-24 w-24 text-indigo-500 dark:text-indigo-400 animate-float" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-6">نسيج الحكايات</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">... جاري نسج عالم من الخيال ...</p>
    </div>
  );
};

export default SplashScreen;