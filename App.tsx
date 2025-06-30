import React, { useCallback, FC, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Story } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import StoryDetailPage from './pages/StoryDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ReadingListPage from './pages/ReadingListPage';
import { initialStories } from './constants';
import usePersistentState from './hooks/usePersistentState';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthGate from './components/AuthGate';
import SplashScreen from './components/SplashScreen';

const AppContent: FC = () => {
  const { user } = useUser();
  const [stories, setStories] = usePersistentState<Story[]>('stories', initialStories);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddStory = (newStoryData: Omit<Story, 'id' | 'likedBy' | 'comments' | 'author'>) => {
    if (!user) return;
    const newStory: Story = {
      ...newStoryData,
      id: Date.now().toString(),
      author: user,
      likedBy: [],
      comments: [],
    };
    setStories(prevStories => [newStory, ...prevStories]);
  };

  const handleEditStory = (updatedStory: Story) => {
    setStories(prevStories =>
      prevStories.map(story => (story.id === updatedStory.id ? updatedStory : story))
    );
  };

  const handleDeleteStory = (storyId: string): boolean => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.')) {
        setStories(prevStories => prevStories.filter(story => story.id !== storyId));
        return true;
    }
    return false;
  };

  const handleLike = (storyId: string) => {
    if (!user) {
      alert('الرجاء تسجيل الدخول لتتمكن من الإعجاب بالقصة.');
      return;
    }
    setStories(prevStories =>
      prevStories.map(story => {
        if (story.id === storyId) {
          const alreadyLiked = story.likedBy.includes(user);
          const newLikedBy = alreadyLiked
            ? story.likedBy.filter(name => name !== user)
            : [...story.likedBy, user];
          return { ...story, likedBy: newLikedBy };
        }
        return story;
      })
    );
  };

  const handleAddComment = (storyId: string, commentText: string) => {
    if (!user) {
      alert('الرجاء تسجيل الدخول لتتمكن من إضافة تعليق.');
      return;
    }
    setStories(prevStories =>
      prevStories.map(story => {
        if (story.id === storyId) {
          const newComment = {
            id: `${storyId}-${Date.now()}`,
            author: user,
            text: commentText,
          };
          return { ...story, comments: [newComment, ...story.comments] };
        }
        return story;
      })
    );
  };
  
  if (showSplash) {
      return <SplashScreen />;
  }

  if (!user) {
    return <AuthGate />;
  }

  return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage stories={stories} />} />
            <Route path="/profile/:authorName" element={<ProfilePage stories={stories} />} />
             <Route path="/reading-list" element={<ReadingListPage stories={stories} />} />
            <Route
              path="/story/:id"
              element={
                <StoryDetailPage
                  stories={stories}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  onDelete={handleDeleteStory}
                />
              }
            />
            <Route
              path="/create"
              element={<DashboardPage onAddStory={handleAddStory} stories={stories} />}
            />
             <Route
              path="/edit/:id"
              element={<DashboardPage onEditStory={handleEditStory} stories={stories} />}
            />
          </Routes>
        </main>
      </div>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
