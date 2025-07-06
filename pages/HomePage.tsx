import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Story } from '../types';
import { fetchStories } from '../services/storyService';
import StoryCard from '../components/StoryCard';
import StoryCardSkeleton from '../components/StoryCardSkeleton';
import { Search, Tag } from 'lucide-react';
import { STORY_CATEGORIES } from '../constants';
import { motion } from 'framer-motion';
import AnimatedPage from '../AnimatedPage';

const HomePage: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get('search') || '';
    const activeCategory = searchParams.get('category') || 'الكل';

    useEffect(() => {
        const loadStories = async () => {
            try {
                setLoading(true);
                const fetchedStories = await fetchStories();
                setStories(fetchedStories);
            } catch (err) {
                setError('فشل في تحميل القصص. الرجاء المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };

        loadStories();
    }, []);

    const handleCategoryChange = (category: string) => {
        setSearchParams(params => {
            if (category === 'الكل') {
                params.delete('category');
            } else {
                params.set('category', category);
            }
            return params;
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchQuery = e.target.value;
        setSearchParams(params => {
            if (newSearchQuery) {
                params.set('search', newSearchQuery);
            } else {
                params.delete('search');
            }
            return params;
        });
    };

    const filteredStories = useMemo(() => {
        return stories
            .filter(story => {
                if (activeCategory === 'الكل') return true;
                return story.category === activeCategory;
            })
            .filter(story => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    story.title.toLowerCase().includes(query) ||
                    story.author.name.toLowerCase().includes(query)
                );
            });
    }, [stories, searchQuery, activeCategory]);

    const trendingStories = [...filteredStories]
      .sort((a, b) => (b.views + b.likes.length * 5) - (a.views + a.likes.length * 5))
      .slice(0, 3);

    const otherStories = filteredStories.filter(story => !trendingStories.find(t => t.id === story.id));

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <AnimatedPage>
            <div className="space-y-12">
                {/* Search and Filter */}
                <div className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ابحث عن قصة أو مؤلف..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag size={20} className="text-amber-400"/>
                        <button
                            onClick={() => handleCategoryChange('الكل')}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${activeCategory === 'الكل' ? 'bg-amber-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            الكل
                        </button>
                        {STORY_CATEGORIES.map(cat => (
                             <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${activeCategory === cat ? 'bg-amber-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div>
                        <div className="h-8 w-48 bg-gray-700 rounded-md animate-pulse mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <StoryCardSkeleton key={i} />)}
                        </div>
                    </div>
                ) : (
                    <>
                        {trendingStories.length > 0 && activeCategory === 'الكل' && !searchQuery && (
                            <div>
                                <h1 className="text-3xl font-bold text-amber-400 border-b-2 border-amber-400 pb-2 mb-6">الأكثر رواجاً</h1>
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {trendingStories.map(story => (
                                        <motion.div key={story.id} variants={itemVariants}>
                                            <StoryCard story={story} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    
                        <div>
                            <h2 className="text-3xl font-bold text-white pb-2 mb-6">
                                {searchQuery ? `نتائج البحث` : activeCategory !== 'الكل' ? `قصص في تصنيف "${activeCategory}"` : 'أحدث القصص'}
                            </h2>
                            {otherStories.length > 0 ? (
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {otherStories.map(story => (
                                        <motion.div key={story.id} variants={itemVariants}>
                                            <StoryCard story={story} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-10 bg-gray-800 rounded-lg">
                                    <p className="text-gray-400">لم يتم العثور على قصص تطابق المعايير المحددة.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AnimatedPage>
    );
};

export default HomePage;