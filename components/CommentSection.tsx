import React, { useState } from 'react';
import { Comment } from '../types';
import { MessageCircle, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
        <MessageCircle className="h-7 w-7 text-sky-500 dark:text-sky-400" />
        التعليقات ({comments.length})
      </h3>
      <div className="space-y-4 mb-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-800 dark:text-slate-200">{comment.author}</p>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 dark:text-slate-400">لا توجد تعليقات بعد. كن أول من يعلق!</p>
        )}
      </div>
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="أضف تعليقاً..."
            className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-2 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed"
            disabled={!newComment.trim()}
            >
            <Send className="h-5 w-5" />
            <span>إرسال</span>
            </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;