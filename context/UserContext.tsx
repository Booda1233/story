import React, { createContext, useContext, ReactNode, FC } from 'react';
import usePersistentState from '../hooks/usePersistentState';

interface UserContextType {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
  bookmarks: string[];
  toggleBookmark: (storyId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = usePersistentState<string | null>('story-user', null);
  const [allBookmarks, setAllBookmarks] = usePersistentState<Record<string, string[]>>('all_bookmarks', {});

  const login = (name: string) => setUser(name);
  const logout = () => {
    setUser(null);
  };

  const userBookmarks = user ? allBookmarks[user] || [] : [];

  const toggleBookmark = (storyId: string) => {
    if (!user) return;
    setAllBookmarks(prev => {
        const currentUserBookmarks = prev[user] || [];
        const updatedBookmarks = currentUserBookmarks.includes(storyId)
            ? currentUserBookmarks.filter(id => id !== storyId)
            : [...currentUserBookmarks, storyId];
        return { ...prev, [user]: updatedBookmarks };
    });
  };

  const value = { user, login, logout, bookmarks: userBookmarks, toggleBookmark };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};