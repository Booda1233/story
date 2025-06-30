import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../types';
import { Heart, MessageCircle, User } from 'lucide-react';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Link to={`/story/${story.id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-indigo-500/30 border border-slate-200 dark:border-slate-700 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative">
            <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-64 object-cover"
            />
            <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {story.category}
            </span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 mb-2 truncate">
            {story.title}
          </h3>
          <Link 
            to={`/profile/${story.author}`} 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-2 hover:text-slate-800 dark:hover:text-slate-300 transition-colors w-fit"
            >
            <User className="h-3 w-3" />
            <span>{story.author}</span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 flex-grow">
            {story.content}
          </p>
          <div className="mt-4 flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs pt-3 border-t border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{story.likedBy.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-sky-500" />
              <span>{story.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;