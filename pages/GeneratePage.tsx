import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateStoryFromPrompt } from '../services/geminiService';
import { addStory } from '../services/storyService';
import Spinner from '../components/Spinner';
import { Sparkles, Edit, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AnimatedPage from '../AnimatedPage';

const GeneratePage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedTitle, setGeneratedTitle] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [generatedCategory, setGeneratedCategory] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            showToast('الرجاء إدخال فكرة للقصة.', 'error');
            return;
        }
        setIsGenerating(true);
        setGeneratedContent('');
        setGeneratedTitle('');
        setGeneratedCategory('');
        try {
            const result = await generateStoryFromPrompt(prompt);
            setGeneratedTitle(result.title);
            setGeneratedContent(result.content);
            setGeneratedCategory(result.category);
            showToast("تم توليد القصة بنجاح!", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
            showToast(message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handlePublish = async () => {
        if (!user) {
            showToast('يجب عليك تسجيل الدخول أولاً لنشر قصة.', 'error');
            return;
        }
        if (!generatedTitle.trim() || !generatedContent.trim() || !generatedCategory) return;
        setIsPublishing(true);
        try {
            const storyData = {
                title: generatedTitle,
                content: generatedContent,
                category: generatedCategory,
                image: `https://picsum.photos/seed/${Date.now()}/1200/600`
            };
            const newStory = await addStory(storyData, user);
            showToast("تم نشر قصتك المولدة بنجاح!", "success");
            navigate(`/story/${newStory.id}`);
        } catch (err) {
            showToast('فشل في نشر القصة.', 'error');
            setIsPublishing(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
                <div className="text-center">
                    <Sparkles className="mx-auto text-amber-400 h-12 w-12"/>
                    <h1 className="text-3xl font-bold text-amber-400 mt-4 mb-2">توليد قصة بالذكاء الاصطناعي</h1>
                    <p className="text-gray-300 mb-6">اكتب فكرة بسيطة، ودع السحر يبدأ!</p>
                </div>
                
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="مثال: قطة صغيرة تحلم بأن تصبح رائدة فضاء..."
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !process.env.API_KEY}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Spinner size="6" /> : <><Sparkles size={20}/> <span>ولّد القصة</span></>}
                    </button>
                    {!process.env.API_KEY && <p className="text-center text-yellow-500 text-sm mt-2">ميزة الذكاء الاصطناعي معطلة حالياً. يجب تعيين مفتاح API.</p>}
                </div>

                {isGenerating && (
                    <div className="text-center my-8">
                        <Spinner size="12" />
                        <p className="text-gray-400 mt-4">جاري كتابة القصة... قد يستغرق هذا بعض الوقت.</p>
                    </div>
                )}

                {generatedContent && (
                    <div className="mt-8 pt-6 border-t border-gray-700 animate-fade-in">
                        <h2 className="text-2xl font-bold text-white mb-4">القصة المولّدة</h2>
                        <div className="space-y-4 bg-gray-900/50 p-6 rounded-lg">
                            <input
                                type="text"
                                value={generatedTitle}
                                onChange={(e) => setGeneratedTitle(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                             <div className="text-sm text-amber-400">التصنيف المقترح: <strong>{generatedCategory}</strong></div>
                            <textarea
                                value={generatedContent}
                                onChange={(e) => setGeneratedContent(e.target.value)}
                                rows={15}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                            ></textarea>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => { setGeneratedContent(''); setGeneratedTitle(''); setPrompt('') }}
                                disabled={isPublishing}
                                className="flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                <Edit size={20}/> <span>البدء من جديد</span>
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
                            >
                                {isPublishing ? <Spinner size="6" /> : <><Send size={20}/> <span>نشر القصة</span></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
};

export default GeneratePage;