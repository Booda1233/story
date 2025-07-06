import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import { BookOpen } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';

const LoginPage: React.FC = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('الرجاء إدخال اسمك.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await login(name);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ ما.');
            setIsLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl shadow-amber-500/10 text-center">
                    <BookOpen className="mx-auto text-amber-400 h-16 w-16 mb-4"/>
                    <h1 className="text-4xl font-bold text-white mb-2">مرحباً في حكايات</h1>
                    <p className="text-gray-300 mb-8">سجّل اسمك للمتابعة أو إنشاء حساب جديد</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="sr-only">الاسم</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                placeholder="اكتب اسمك هنا"
                                required
                            />
                        </div>
                        {error && <p className="text-red-400">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Spinner size="6" /> : 'دخول / تسجيل'}
                        </button>
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default LoginPage;