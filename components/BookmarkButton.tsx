import React from 'react';
import { Bookmark } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface BookmarkButtonProps {
  storyId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ storyId }) => {
  const { bookmarks, toggleBookmark, user } = useUser();
  
  if (!user) return null;

  const isBookmarked = bookmarks.includes(storyId);

  return (
    <button
      onClick={() => toggleBookmark(storyId)}
      className={`p-2 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center gap-2 transition-colors duration-200`}
      title={isBookmarked ? 'إزالة من قائمة القراءة' : 'إضافة إلى قائمة القراءة'}
    >
      <Bookmark className={`h-5 w-5 transition-all ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
    </button>
  );
};

export default BookmarkButton;