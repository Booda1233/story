import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../types';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface StoryCardProps {
    story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
    const { user } = useAuth();
    const isLikedByCurrentUser = user ? story.likes.some(like => like.userId === user.id) : false;

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `قبل ${Math.floor(interval)} سنوات`;
        interval = seconds / 2592000;
        if (interval > 1) return `قبل ${Math.floor(interval)} أشهر`;
        interval = seconds / 86400;
        if (interval > 1) return `قبل ${Math.floor(interval)} أيام`;
        interval = seconds / 3600;
        if (interval > 1) return `قبل ${Math.floor(interval)} ساعات`;
        interval = seconds / 60;
        if (interval > 1) return `قبل ${Math.floor(interval)} دقائق`;
        return `قبل ${Math.floor(seconds)} ثوان`;
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-amber-500/20 flex flex-col">
            <div className="relative">
                 <Link to={`/story/${story.id}`}>
                    <img className="w-full h-48 object-cover" src={story.image || `https://picsum.photos/seed/${story.id}/1200/600`} alt={story.title} />
                 </Link>
                 <Link 
                    to={`/?category=${encodeURIComponent(story.category)}`}
                    className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full hover:bg-amber-600 transition-colors"
                >
                    {story.category}
                </Link>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/story/${story.id}`}>
                    <h3 className="text-xl font-bold text-white hover:text-amber-400 transition-colors truncate">{story.title}</h3>
                </Link>
                <div className="flex items-center mt-2 text-gray-400 text-sm">
                    <img src={story.author.avatar} alt={story.author.name} className="w-6 h-6 rounded-full mr-2 border border-gray-600 object-cover" />
                    <span>{story.author.name}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{timeAgo(story.createdAt)}</span>
                </div>
                <p className="text-gray-300 mt-3 h-20 overflow-hidden text-ellipsis flex-grow">
                    {story.content}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-gray-400">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <Heart size={18} className={isLikedByCurrentUser ? 'text-red-500 fill-current' : ''} />
                            <span>{story.likes.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle size={18} />
                            <span>{story.comments.length}</span>
                        </div>
                         <div className="flex items-center gap-1">
                            <Eye size={18} />
                            <span>{story.views}</span>
                        </div>
                    </div>
                     <Link to={`/story/${story.id}`} className="text-sm font-semibold text-amber-400 hover:text-amber-300">
                        اقرأ المزيد &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StoryCard;