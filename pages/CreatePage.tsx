import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStory } from '../services/storyService';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AnimatedPage from '../AnimatedPage';
import { STORY_CATEGORIES } from '../constants';

const CreatePage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(STORY_CATEGORIES[0]);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast('يجب عليك تسجيل الدخول أولاً لنشر قصة.', 'error');
            return;
        }
        if (!title.trim() || !content.trim() || !category) {
            showToast('جميع الحقول (العنوان، المحتوى، التصنيف) مطلوبة.', 'error');
            return;
        }

        setLoading(true);

        try {
            const newStory = await addStory({ title, content, category, image }, user);
            showToast('تم نشر قصتك بنجاح!', 'success');
            navigate(`/story/${newStory.id}`);
        } catch (err) {
            showToast('فشل في نشر القصة. الرجاء المحاولة مرة أخرى.', 'error');
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-amber-400 mb-6">اكتب قصتك الجديدة</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">عنوان القصة</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="مثال: الأسد الشجاع والفأر الصغير"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-lg font-medium text-gray-300 mb-2">تصنيف القصة</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        >
                            {STORY_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-lg font-medium text-gray-300 mb-2">محتوى القصة</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="كان يا مكان في قديم الزمان..."
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-lg font-medium text-gray-300 mb-2">صورة القصة (اختياري)</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg shadow-md"/>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {loading ? <Spinner size="6" /> : 'انشر القصة'}
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default CreatePage;