import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Story } from '../types';
import { fetchStoryById, toggleLike, addComment, deleteStory } from '../services/storyService';
import Spinner from '../components/Spinner';
import { Heart, MessageCircle, Send, User, Calendar, Pencil, Trash2, Clock, Tag, Play, Pause, StopCircle, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AnimatedPage from '../AnimatedPage';
import SocialShare from '../components/SocialShare';

const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);

    const handleScroll = () => {
        const contentEl = document.getElementById('story-content');
        if (!contentEl) return;

        const { top, height } = contentEl.getBoundingClientRect();
        const scrollableHeight = height - window.innerHeight;
        
        if (scrollableHeight <= 0) {
            setProgress(top < 0 ? 100 : 0);
            return;
        }

        const scrollY = Math.max(0, -top);
        const scrollPercent = (scrollY / scrollableHeight) * 100;
        setProgress(Math.min(100, scrollPercent));
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
            <div className="bg-amber-500 h-full" style={{ width: `${progress}%` }} />
        </div>
    );
};


const StoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // State for Text-to-Speech
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const loadStory = useCallback(async () => {
        if (!id) return;
        try {
            const fetchedStory = await fetchStoryById(id);
            if (fetchedStory) {
                setStory(fetchedStory);
            } else {
                setError('لم يتم العثور على القصة.');
            }
        } catch (err) {
            setError('فشل في تحميل القصة.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        setLoading(true);
        loadStory();

        // Cleanup function to stop speech when the component unmounts
        return () => {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [loadStory]);

    const handleLike = async () => {
        if (!id || isLiking || !user) return;
        setIsLiking(true);
        try {
            const updatedStory = await toggleLike(id, user.id);
            setStory(updatedStory);
        } catch (error) {
            showToast("فشل تسجيل الإعجاب", "error");
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim() || isCommenting || !user) return;
        setIsCommenting(true);
        try {
            const updatedStory = await addComment(id, newComment, user);
            setStory(updatedStory);
            setNewComment('');
            showToast("تم إضافة تعليقك بنجاح", "success");
        } catch (error) {
            showToast("فشل إضافة التعليق", "error");
        } finally {
            setIsCommenting(false);
        }
    };
    
    const handleDelete = async () => {
        if (!id || !user || isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteStory(id, user.id);
            showToast("تم حذف القصة بنجاح", "success");
            navigate('/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "فشل حذف القصة";
            showToast(errorMessage, "error");
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const calculateReadingTime = (content: string): number => {
        const wordsPerMinute = 150;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };
    
    const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const handlePlayPause = () => {
        if (!story || !isSpeechSupported) return;

        const startSpeech = () => {
            const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.content}`);
            utteranceRef.current = utterance;

            const voices = window.speechSynthesis.getVoices();
            const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));
            if (arabicVoice) {
                utterance.voice = arabicVoice;
            }
            utterance.lang = 'ar-SA'; 

            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };
            utterance.onerror = (e) => {
                console.error("Speech synthesis error", e);
                showToast("حدث خطأ أثناء تشغيل الصوت.", "error");
                setIsSpeaking(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);
        };

        if (window.speechSynthesis.speaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        } else if (window.speechSynthesis.speaking && isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else {
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    startSpeech();
                    window.speechSynthesis.onvoiceschanged = null;
                };
            } else {
                startSpeech();
            }
        }
    };

    const handleStop = () => {
        if (isSpeechSupported && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="16" /></div>;
    }

    if (error || !story) {
        return <div className="text-center text-red-400 text-2xl mt-10">{error || 'لم يتم العثور على القصة'}</div>;
    }

    const isLikedByCurrentUser = user ? story.likes.some(like => like.userId === user.id) : false;
    const isAuthor = user?.id === story.author.id;
    const readingTime = calculateReadingTime(story.content);

    return (
        <AnimatedPage>
             <ReadingProgressBar />
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 lg:p-12">
                     <div className="mb-4">
                        <Link 
                            to={`/?category=${encodeURIComponent(story.category)}`}
                            className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-sm font-bold px-3 py-1 rounded-full hover:bg-amber-500/20 transition-colors"
                        >
                            <Tag size={14}/> {story.category}
                        </Link>
                    </div>

                    <div className="md:flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{story.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{story.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{formatDate(story.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{readingTime} {readingTime > 2 ? 'دقائق' : 'دقيقة'} قراءة</span>
                                </div>
                            </div>
                        </div>
                        {isAuthor && (
                            <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                                <Link to={`/story/${story.id}/edit`} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Pencil size={18}/> <span>تعديل</span>
                                </Link>
                                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                    <Trash2 size={18}/> <span>حذف</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {story.image && (
                        <img src={story.image} alt={story.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg" />
                    )}

                    <div id="story-content" className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {story.content}
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-gray-700 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleLike}
                                disabled={isLiking || !user}
                                className={`flex items-center gap-2 text-lg font-semibold transition-transform duration-200 ease-in-out hover:scale-110 ${isLikedByCurrentUser ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
                            >
                                <Heart size={24} className={isLikedByCurrentUser ? 'fill-current' : ''} />
                                <span>{story.likes.length} إعجاب</span>
                            </button>
                            <div className="flex items-center gap-2 text-lg text-gray-300">
                                <MessageCircle size={24} />
                                <span>{story.comments.length} تعليق</span>
                            </div>
                        </div>
                        <SocialShare storyUrl={window.location.href} storyTitle={story.title} />
                    </div>

                    {isSpeechSupported && (
                        <div className="mt-8 pt-6 border-t-2 border-gray-700">
                            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                                <Volume2 />
                                <span>الاستماع للقصة</span>
                            </h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePlayPause}
                                    className="flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                                >
                                    {isSpeaking && !isPaused ? <Pause size={18} /> : <Play size={18} />}
                                    <span>{isSpeaking && !isPaused ? 'إيقاف مؤقت' : (isPaused ? 'استئناف' : 'تشغيل')}</span>
                                </button>
                                <button
                                    onClick={handleStop}
                                    disabled={!isSpeaking}
                                    className="flex items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                                >
                                    <StopCircle size={18} />
                                    <span>إيقاف</span>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    { user && (<div className="mt-8 pt-6 border-t-2 border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-4">التعليقات</h3>
                        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                            <img src={user.avatar} alt="your avatar" className="w-10 h-10 rounded-full object-cover"/>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="أضف تعليقاً..."
                                className="flex-grow bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                disabled={isCommenting}
                            />
                            <button type="submit" className="bg-amber-500 text-white rounded-full p-3 hover:bg-amber-600 disabled:bg-gray-500 transition-colors" disabled={isCommenting || !newComment.trim()}>
                                {isCommenting ? <Spinner size="5" /> : <Send size={20} />}
                            </button>
                        </form>

                        <div className="space-y-4">
                            {story.comments.slice().reverse().map(comment => (
                                <div key={comment.id} className="flex gap-3 bg-gray-700/50 p-3 rounded-lg">
                                    <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full mt-1 object-cover"/>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-amber-400">{comment.user.name}</span>
                                            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-200">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>)}
                </div>

                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] transition-opacity">
                        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full animate-fade-in">
                            <h3 className="text-xl font-bold text-white mb-4">تأكيد الحذف</h3>
                            <p className="text-gray-300 mb-6">هل أنت متأكد أنك تريد حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                            <div className="flex justify-end gap-4">
                                <button onClick={() => setShowDeleteConfirm(false)} className="py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">
                                    إلغاء
                                </button>
                                <button onClick={handleDelete} disabled={isDeleting} className="py-2 px-4 bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-800 flex items-center gap-2 transition-colors">
                                    {isDeleting && <Spinner size="5" />}
                                    نعم، احذف
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
};

export default StoryPage;