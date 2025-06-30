import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { Story } from '../types';
import CommentSection from '../components/CommentSection';
import useTextToSpeech from '../hooks/useTextToSpeech';
import ShareButton from '../components/ShareButton';
import BookmarkButton from '../components/BookmarkButton';
import ReadingProgressBar from '../components/ReadingProgressBar';
import { Heart, Play, Pause, Square, User, Tag, Trash2, Edit, Type } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface StoryDetailPageProps {
  stories: Story[];
  onLike: (storyId: string) => void;
  onAddComment: (storyId: string, text: string) => void;
  onDelete: (storyId: string) => boolean;
}

const StoryDetailPage: React.FC<StoryDetailPageProps> = ({ stories, onLike, onAddComment, onDelete }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSpeaking, isPaused, play, pause, resume, stop, isSupported: isTtsSupported } = useTextToSpeech();
  const { user } = useUser();
  
  const story = stories.find(s => s.id === id);

  const [fontSize, setFontSize] = useState('md'); // sm, md, lg
  const [fontFamily, setFontFamily] = useState('sans'); // sans, serif

  const sizeClasses = { sm: 'prose-base', md: 'prose-lg', lg: 'prose-xl' };
  const familyClasses = { sans: 'font-sans', serif: 'font-serif' };

  useEffect(() => {
    // Cleanup text-to-speech on component unmount or story change
    return () => stop();
  }, [id, stop]);

  if (!story) {
    return <Navigate to="/" />;
  }
  
  const isAuthor = user === story.author;
  const hasLiked = user ? story.likedBy.includes(user) : false;

  const handlePlayPause = () => {
    if (!isTtsSupported) return;
    if (isSpeaking) {
      isPaused ? resume() : pause();
    } else {
      play(`${story.title}. ${story.content}`);
    }
  };

  const handleDelete = () => {
    if (onDelete(story.id)) {
      navigate('/');
    }
  };

  return (
    <>
      <ReadingProgressBar />
      <div className={`max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-slate-950/50 overflow-hidden animate-fade-in ${familyClasses[fontFamily]}`}>
        <img src={story.coverImage} alt={story.title} className="w-full h-64 md:h-96 object-cover" />
        
        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
              <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
                  <Tag className="h-4 w-4" />
                  {story.category}
              </span>
              {isAuthor && (
                  <div className="flex items-center gap-2">
                      <Link to={`/edit/${story.id}`} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-2 px-3 rounded-md transition-colors text-xs">
                          <Edit className="h-4 w-4" />
                          <span>تعديل</span>
                      </Link>
                      <button onClick={handleDelete} className="flex items-center gap-2 bg-red-700/80 dark:bg-red-800/70 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md transition-colors text-xs">
                          <Trash2 className="h-4 w-4" />
                          <span>حذف</span>
                      </button>
                  </div>
              )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-slate-900 dark:text-slate-100">{story.title}</h1>
          <Link to={`/profile/${story.author}`} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 text-sm hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors w-fit">
            <User className="h-4 w-4" />
            <span>بقلم: {story.author}</span>
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-6 mb-8 p-4 bg-slate-50 dark:bg-slate-850/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                  <button onClick={() => onLike(story.id)} className={`flex items-center gap-2 transition-colors duration-200 ${hasLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-400'}`} aria-pressed={hasLiked} title={hasLiked ? 'إلغاء الإعجاب' : 'أعجبني'}>
                      <Heart className={`h-6 w-6 transition-transform ${hasLiked ? 'fill-current scale-110' : 'scale-100'}`} />
                      <span className="font-bold text-lg">{story.likedBy.length}</span>
                  </button>

                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-600"></div>

                  <div className="flex items-center gap-2 text-white">
                      <button 
                        onClick={handlePlayPause}
                        title={!isTtsSupported ? 'السرد الصوتي غير مدعوم في هذا المتصفح' : (isSpeaking && !isPaused ? 'إيقاف مؤقت' : (isPaused ? 'استئناف' : 'تشغيل السرد الصوتي'))}
                        className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-500 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
                        disabled={!isTtsSupported}
                      >
                          {isSpeaking && !isPaused ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      {isSpeaking && isTtsSupported && <button onClick={stop} title="إيقاف السرد" className="p-2 rounded-full bg-slate-600 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600"><Square className="h-5 w-5" /></button>}
                  </div>

                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-600"></div>
                  
                  <div className="flex items-center gap-2 text-white">
                    <ShareButton title={story.title} text={`اقرأ قصة "${story.title}" على نسيج الحكايات!`} />
                    <BookmarkButton storyId={story.id} />
                  </div>

              </div>
              <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700/50 p-1 rounded-lg">
                  <button onClick={() => setFontFamily('sans')} className={`p-2 rounded-md transition-colors ${fontFamily === 'sans' ? 'bg-indigo-500 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`} title="خط عصري"><Type className="h-5 w-5"/></button>
                  <button onClick={() => setFontFamily('serif')} className={`p-2 rounded-md transition-colors ${fontFamily === 'serif' ? 'bg-indigo-500 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`} title="خط كلاسيكي"><i className="font-serif not-italic text-xl">أ</i></button>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                  <button onClick={() => setFontSize('sm')} className={`px-2 py-1 text-xs rounded-md transition-colors ${fontSize === 'sm' ? 'bg-indigo-500 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>صغير</button>
                  <button onClick={() => setFontSize('md')} className={`px-2 py-1 text-sm rounded-md transition-colors ${fontSize === 'md' ? 'bg-indigo-500 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>وسط</button>
                  <button onClick={() => setFontSize('lg')} className={`px-2 py-1 text-base rounded-md transition-colors ${fontSize === 'lg' ? 'bg-indigo-500 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>كبير</button>
              </div>
          </div>
          
          <div className={`prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-wrap ${sizeClasses[fontSize]}`}>
            {story.content}
          </div>
          
          <CommentSection comments={story.comments} onAddComment={(text) => onAddComment(story.id, text)} />
        </div>
      </div>
    </>
  );
};

export default StoryDetailPage;