import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
      title={theme === 'light' ? 'التحويل للوضع المظلم' : 'التحويل للوضع المضيء'}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;