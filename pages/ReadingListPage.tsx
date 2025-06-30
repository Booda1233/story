import React from 'react';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';
import { Bookmark, PlusCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface ReadingListPageProps {
  stories: Story[];
}

const ReadingListPage: React.FC<ReadingListPageProps> = ({ stories }) => {
  const { bookmarks } = useUser();

  const bookmarkedStories = stories.filter(story => bookmarks.includes(story.id));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">قائمة القراءة</h1>
      </div>
      
      {bookmarkedStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bookmarkedStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800">
          <Bookmark className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            قائمة القراءة فارغة
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            ابحث عن القصص التي تثير اهتمامك وأضفها هنا للعودة إليها لاحقًا.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105"
          >
            <PlusCircle className="h-5 w-5" />
            <span>تصفح القصص</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReadingListPage;