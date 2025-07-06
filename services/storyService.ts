import { Story, Comment, Like, User } from '../types';
import { STORIES_STORAGE_KEY, STORY_CATEGORIES } from '../constants';
import { getUsers, getUserById } from './userService';

const getInitialStories = (): Story[] => {
    const initialUsers = getUsers();
    const user2 = initialUsers['user-2'] || { id: 'user-2', name: 'علي حسن', avatar: 'https://i.pravatar.cc/150?u=user-2' };
    const user3 = initialUsers['user-3'] || { id: 'user-3', name: 'فاطمة الزهراء', avatar: 'https://i.pravatar.cc/150?u=user-3' };
    const user4 = initialUsers['user-4'] || { id: 'user-4', name: 'عمر شريف', avatar: 'https://i.pravatar.cc/150?u=user-4' };

    return [
        {
            id: 'story-1',
            title: 'التاجر الأمين والثعلب الماكر',
            content: 'في قديم الزمان، كان هناك تاجر أمين يُدعى "سعيد". كان سعيد يسافر بين المدن لبيع بضاعته. في إحدى رحلاته عبر الغابة، التقى بثعلب ماكر عرض عليه المساعدة في حمل بضاعته مقابل جزء صغير منها. وافق سعيد، لكن الثعلب كان يخطط لسرقة كل شيء. لاحظ سعيد ذكاء الثعلب وشك في نواياه. وعندما وصلوا إلى النهر، طلب سعيد من الثعلب أن يعبر أولاً ليختبر عمق المياه. عندما دخل الثعلب، دفعه سعيد بخفة إلى منتصف النهر وقال: "هذا جزاء الطمع!". تعلم الثعلب درساً قاسياً، وأكمل سعيد رحلته بسلام.',
            author: user2,
            category: STORY_CATEGORIES[8], // أخلاقية
            image: 'https://picsum.photos/seed/story-1/1200/600',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            views: 152,
            likes: [{ userId: 'user-3', createdAt: new Date().toISOString() }, { userId: 'user-4', createdAt: new Date().toISOString() }],
            comments: [
                { id: 'comment-1', text: 'قصة رائعة ومعبرة!', user: user3, createdAt: new Date().toISOString() },
            ],
        },
        {
            id: 'story-2',
            title: 'نجمة السماء الحزينة',
            content: 'كانت هناك نجمة صغيرة في السماء تشعر بالوحدة. كل النجوم الأخرى كانت تتلألأ بسعادة، لكنها كانت تشعر بأن لا أحد يلاحظها. في ليلة صافية، رآها طفل صغير من نافذة غرفته وقال لأمه: "انظري يا أمي، تلك النجمة الصغيرة هي أجمل نجمة في السماء لأنها تذكرني بكِ، فريدة ومميزة". سمعت النجمة كلام الطفل وشعرت بسعادة غامرة. ومنذ ذلك اليوم، أصبحت تتلألأ أكثر من أي نجمة أخرى، عالمة أن لكل شخص مكانه الخاص في هذا الكون.',
            author: user3,
            category: STORY_CATEGORIES[5], // قصص أطفال
            image: 'https://picsum.photos/seed/story-2/1200/600',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            views: 289,
            likes: [{ userId: 'user-2', createdAt: new Date().toISOString() }, { userId: 'user-4', createdAt: new Date().toISOString() }],
            comments: [
                 { id: 'comment-2', text: 'قصة جميلة جداً، أثرت فيّ.', user: user2, createdAt: new Date().toISOString() },
                 { id: 'comment-3', text: 'أحببت الفكرة!', user: user4, createdAt: new Date().toISOString() },
            ],
        },
    ];
};

const getAllStories = (): Story[] => {
    const storiesJSON = localStorage.getItem(STORIES_STORAGE_KEY);
    if (storiesJSON) {
        const stories: Story[] = JSON.parse(storiesJSON);
        // Hydrate user data for comments and author to reflect potential updates (e.g., avatar change)
        return stories.map(story => ({
            ...story,
            author: getUserById(story.author.id) || story.author,
            comments: story.comments.map(comment => ({
                ...comment,
                user: getUserById(comment.user.id) || comment.user
            }))
        }));
    }
    const initialStories = getInitialStories();
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(initialStories));
    return initialStories;
};

const saveAllStories = (stories: Story[]) => {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
};

export const fetchStories = async (): Promise<Story[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getAllStories());
        }, 500);
    });
};

export const fetchStoryById = async (id: string): Promise<Story | undefined> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const stories = getAllStories();
            const story = stories.find(s => s.id === id);
            if(story){
                story.views += 1;
                saveAllStories(stories);
            }
            resolve(story);
        }, 300);
    });
};

export const addStory = async (data: { title: string; content: string; category: string; image?: string }, author: User): Promise<Story> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const stories = getAllStories();
            const newStory: Story = {
                id: `story-${Date.now()}`,
                title: data.title,
                content: data.content,
                category: data.category,
                image: data.image,
                author: author,
                createdAt: new Date().toISOString(),
                views: 0,
                likes: [],
                comments: [],
            };
            stories.unshift(newStory);
            saveAllStories(stories);
            resolve(newStory);
        }, 500);
    });
};

export const updateStory = async (storyId: string, data: { title: string; content: string; category: string; image?: string; }, userId: string): Promise<Story> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const stories = getAllStories();
            const storyIndex = stories.findIndex(s => s.id === storyId);
            if (storyIndex === -1) {
                return reject(new Error('لم يتم العثور على القصة'));
            }
            if (stories[storyIndex].author.id !== userId) {
                return reject(new Error('غير مصرح لك بتعديل هذه القصة'));
            }

            stories[storyIndex] = {
                ...stories[storyIndex],
                title: data.title,
                content: data.content,
                category: data.category,
                image: data.image !== undefined ? data.image : stories[storyIndex].image,
            };
            
            saveAllStories(stories);
            resolve(stories[storyIndex]);
        }, 500);
    });
};


export const deleteStory = async (storyId: string, userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const stories = getAllStories();
            const storyIndex = stories.findIndex(s => s.id === storyId);
            if (storyIndex === -1) {
                return reject(new Error('لم يتم العثور على القصة'));
            }
            if (stories[storyIndex].author.id !== userId) {
                return reject(new Error('غير مصرح لك بحذف هذه القصة'));
            }

            stories.splice(storyIndex, 1);
            saveAllStories(stories);
            resolve();
        }, 300);
    });
};

export const toggleLike = async (storyId: string, userId: string): Promise<Story> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const stories = getAllStories();
            const storyIndex = stories.findIndex(s => s.id === storyId);
            if (storyIndex === -1) {
                return reject(new Error('Story not found'));
            }

            const story = stories[storyIndex];
            const likeIndex = story.likes.findIndex(l => l.userId === userId);

            if (likeIndex > -1) {
                story.likes.splice(likeIndex, 1);
            } else {
                story.likes.push({ userId: userId, createdAt: new Date().toISOString() });
            }
            
            stories[storyIndex] = story;
            saveAllStories(stories);
            resolve(story);
        }, 200);
    });
};

export const addComment = async (storyId: string, text: string, user: User): Promise<Story> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const stories = getAllStories();
            const storyIndex = stories.findIndex(s => s.id === storyId);
            if (storyIndex === -1) {
                return reject(new Error('Story not found'));
            }

            const story = stories[storyIndex];
            const newComment: Comment = {
                id: `comment-${Date.now()}`,
                text,
                user: user,
                createdAt: new Date().toISOString(),
            };
            story.comments.push(newComment);
            
            stories[storyIndex] = story;
            saveAllStories(stories);
            resolve(story);
        }, 400);
    });
};