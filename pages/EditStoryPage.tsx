import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStory, fetchStoryById } from '../services/storyService';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Story } from '../types';
import AnimatedPage from '../AnimatedPage';
import { STORY_CATEGORIES } from '../constants';

const EditStoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [story, setStory] = useState<Story | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id || !user) {
            navigate('/');
            return;
        }

        const loadStory = async () => {
            try {
                const fetchedStory = await fetchStoryById(id);
                if (fetchedStory) {
                    if (fetchedStory.author.id !== user.id) {
                        showToast("غير مصرح لك بتعديل هذه القصة.", "error");
                        navigate(`/story/${id}`);
                    } else {
                        setStory(fetchedStory);
                        setTitle(fetchedStory.title);
                        setContent(fetchedStory.content);
                        setCategory(fetchedStory.category);
                        setImage(fetchedStory.image);
                        setImagePreview(fetchedStory.image || null);
                    }
                } else {
                    showToast('لم يتم العثور على القصة.', 'error');
                    navigate('/');
                }
            } catch (err) {
                showToast('فشل في تحميل بيانات القصة.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadStory();
    }, [id, user, navigate, showToast]);

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
        if (!id || !user) return;

        if (!title.trim() || !content.trim() || !category) {
            showToast('جميع الحقول (العنوان، المحتوى، التصنيف) مطلوبة.', 'error');
            return;
        }

        setIsSaving(true);

        try {
            await updateStory(id, { title, content, category, image }, user.id);
            showToast('تم تحديث القصة بنجاح!', 'success');
            navigate(`/story/${id}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'فشل في تحديث القصة. الرجاء المحاولة مرة أخرى.';
            showToast(message, 'error');
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="16" /></div>;
    }
    
    if (!story) {
        return null;
    }

    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-amber-400 mb-6">تعديل القصة</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">عنوان القصة</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-lg font-medium text-gray-300 mb-2">تغيير صورة القصة (اختياري)</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-400 mb-2">معاينة الصورة الحالية:</p>
                                <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg shadow-md"/>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/story/${id}`)}
                            className="flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors"
                        >
                        إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Spinner size="6" /> : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default EditStoryPage;