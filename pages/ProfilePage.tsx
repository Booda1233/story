import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Story } from '../types';
import { fetchStories, deleteStory } from '../services/storyService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Spinner from '../components/Spinner';
import { Heart, MessageSquare, BookOpen, LogOut, Camera, Pencil, Trash2, PlusCircle } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';

const ProfilePage: React.FC = () => {
    const { user, logout, updateAvatar } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [allStories, setAllStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const stories = await fetchStories();
                setAllStories(stories);
            } catch (error) {
                console.error("Failed to load stories for profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };
    
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                await updateAvatar(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDeleteStory = async (storyId: string) => {
        if (!user) return;
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذه القصة؟")) {
            try {
                await deleteStory(storyId, user.id);
                setAllStories(prevStories => prevStories.filter(s => s.id !== storyId));
                showToast("تم حذف القصة بنجاح", "success");
            } catch (err) {
                const message = err instanceof Error ? err.message : "فشل حذف القصة.";
                showToast(message, "error");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="16" /></div>;
    }
    
    if (!user) {
        return <p className="text-center mt-10">الرجاء تسجيل الدخول لعرض الملف الشخصي.</p>;
    }

    const myStories = allStories.filter(story => story.author.id === user.id);
    const likedStories = allStories.filter(story => story.likes.some(like => like.userId === user.id));
    const commentedStories = allStories.filter(story => story.comments.some(comment => comment.user.id === user.id));
    
    const StoryListItem: React.FC<{ story: Story, isAuthor: boolean }> = ({ story, isAuthor }) => (
        <div className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors group">
            <div className="flex items-center justify-between gap-4">
                 <Link to={`/story/${story.id}`} className="flex items-center gap-3 flex-grow min-w-0">
                    <img src={story.image || `https://picsum.photos/seed/${story.id}/200/200`} alt={story.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0"/>
                    <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">{story.title}</h4>
                        <p className="text-sm text-gray-400">بواسطة {isAuthor ? 'أنت' : story.author.name}</p>
                    </div>
                </Link>
                {isAuthor && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to={`/story/${story.id}/edit`} className="p-2 rounded-full hover:bg-blue-500/20 text-blue-400 transition-colors">
                            <Pencil size={18}/>
                        </Link>
                        <button onClick={() => handleDeleteStory(story.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors">
                            <Trash2 size={18}/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
    
    const EmptyState: React.FC<{icon: React.ReactNode, text: string, ctaText: string, ctaLink: string}> = ({icon, text, ctaText, ctaLink}) => (
        <div className="text-center py-8 px-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-700/50 rounded-full text-amber-400 mb-4">
                {icon}
            </div>
            <p className="text-gray-400 mb-4">{text}</p>
            <Link to={ctaLink} className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">
                <PlusCircle size={18} />
                <span>{ctaText}</span>
            </Link>
        </div>
    );

    return (
        <AnimatedPage>
            <div className="max-w-5xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-amber-400 object-cover group-hover:opacity-70 transition-opacity" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white h-8 w-8" />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                    <div className="flex-grow text-center md:text-right">
                        <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                        <p className="text-lg text-gray-300 mt-1">مرحباً بك في صفحتك الشخصية</p>
                    </div>
                    <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        <LogOut size={20}/>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2"><BookOpen/> قصصي</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {myStories.length > 0 ? (
                                myStories.map(story => <StoryListItem key={`my-${story.id}`} story={story} isAuthor={true} />)
                            ) : (
                            <EmptyState icon={<BookOpen size={24} />} text="لم تقم بنشر أي قصة بعد." ctaText="اكتب قصتك الأولى" ctaLink="/create" />
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2"><Heart className="text-red-500"/> أعجبني</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {likedStories.length > 0 ? (
                                likedStories.map(story => <StoryListItem key={`liked-${story.id}`} story={story} isAuthor={story.author.id === user.id} />)
                            ) : (
                                <EmptyState icon={<Heart size={24} />} text="لم تعجب بأي قصة بعد." ctaText="تصفح القصص" ctaLink="/" />
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2"><MessageSquare className="text-blue-400"/> تعليقاتي</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {[...new Map(commentedStories.map(item => [item.id, item])).values()].length > 0 ? (
                                [...new Map(commentedStories.map(item => [item.id, item])).values()].map(story => <StoryListItem key={`commented-${story.id}`} story={story} isAuthor={story.author.id === user.id} />)
                            ) : (
                                <EmptyState icon={<MessageSquare size={24} />} text="لم تعلق على أي قصة بعد." ctaText="تصفح القصص" ctaLink="/" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ProfilePage;