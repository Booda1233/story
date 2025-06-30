import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';
import { User, Heart, MessageCircle, BookOpen } from 'lucide-react';

interface ProfilePageProps {
  stories: Story[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ stories }) => {
  const { authorName } = useParams<{ authorName: string }>();

  const authorStories = useMemo(
    () => stories.filter(story => story.author === authorName),
    [stories, authorName]
  );

  const stats = useMemo(() => {
    return authorStories.reduce(
      (acc, story) => {
        acc.likes += story.likedBy.length;
        acc.comments += story.comments.length;
        return acc;
      },
      { likes: 0, comments: 0 }
    );
  }, [authorStories]);

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-slate-800/50 p-8 rounded-lg mb-12 shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-indigo-500 rounded-full h-24 w-24 flex items-center justify-center text-white shrink-0">
            <User className="h-12 w-12" />
          </div>
          <div className="text-center sm:text-right">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{authorName}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">مؤلف في نسيج الحكايات</p>
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <span className="font-semibold">{authorStories.length}</span> قصة
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 dark:text-red-400" />
                <span className="font-semibold">{stats.likes}</span> إعجاب
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                <span className="font-semibold">{stats.comments}</span> تعليق
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">قصص بقلم {authorName}</h2>
      
      {authorStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {authorStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
          <BookOpen className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            لم يقم {authorName} بنشر أي قصص بعد.
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;