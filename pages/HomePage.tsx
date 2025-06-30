import React, { useState, useMemo } from 'react';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';
import { PlusCircle, BookDashed, Search, X, TrendingUp, BookOpen } from 'lucide-react';
import { storyCategories } from '../constants';

interface HomePageProps {
  stories: Story[];
}

const HomePage: React.FC<HomePageProps> = ({ stories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  const trendingStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => {
        const scoreA = a.likedBy.length * 2 + a.comments.length;
        const scoreB = b.likedBy.length * 2 + b.comments.length;
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [stories]);

  const filteredStories = useMemo(() => {
    let tempStories = stories;

    // Filter by category
    if (activeCategory !== 'الكل') {
      tempStories = tempStories.filter(story => story.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      tempStories = tempStories.filter(story =>
        story.title.toLowerCase().includes(lowercasedQuery) ||
        story.content.toLowerCase().includes(lowercasedQuery)
      );
    }

    return tempStories;
  }, [stories, searchQuery, activeCategory]);

  const allCategories = ['الكل', ...storyCategories];

  return (
    <div className="animate-fade-in space-y-16">
      <div className="text-center pt-8 pb-12 px-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mb-4">
          أطلق العنان لـ
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
            خيالك
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-8">
          منصة عربية مدعومة بالذكاء الاصطناعي لإنشاء ومشاركة قصص فريدة. اكتب عنوانًا، ودع السحر يبدأ.
        </p>
        <Link 
          to="/create" 
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50"
        >
          <PlusCircle className="h-6 w-6" />
          <span>أنشئ قصتك الآن</span>
        </Link>
      </div>
      
      {trendingStories.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-3xl font-bold">القصص الأكثر رواجًا</h2>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingStories.map(story => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>
          </section>
      )}

      <div>
        <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-3xl font-bold">كل القصص</h2>
        </div>

        <div className="mb-10 space-y-6 p-6 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative max-w-lg mx-auto">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن قصة..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full py-3 pr-12 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 pointer-events-none">
                    <Search className="h-5 w-5" />
                </div>
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')} 
                        className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        aria-label="مسح البحث"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {allCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                            activeCategory === category
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredStories.map(story => (
                <StoryCard key={story.id} story={story} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <BookDashed className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                    {stories.length === 0 ? "لم يتم نشر أي قصص بعد" : "لا توجد قصص تطابق بحثك"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {stories.length === 0 ? "كن أول من يبدع قصة جديدة!" : "جرّب البحث بكلمات أخرى أو تغيير التصنيف."}
                </p>
                {stories.length === 0 && (
                    <Link 
                    to="/create" 
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105"
                    >
                    <PlusCircle className="h-5 w-5" />
                    <span>أنشئ قصة الآن</span>
                    </Link>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;