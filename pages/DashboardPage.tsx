import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Story } from '../types';
import { generateStory } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { Wand2, Sparkles, UploadCloud, X, PenSquare, Edit } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { storyCategories } from '../constants';

interface DashboardPageProps {
  stories: Story[];
  onAddStory?: (newStory: Omit<Story, 'id' | 'likedBy' | 'comments' | 'author'>) => void;
  onEditStory?: (updatedStory: Story) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ stories, onAddStory, onEditStory }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const isEditMode = Boolean(id);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);

  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
  const [title, setTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [category, setCategory] = useState(storyCategories[0]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && stories) {
      const foundStory = stories.find(s => s.id === id);
      if (foundStory) {
        // Ensure only the author can edit
        if (foundStory.author !== user) {
          navigate('/'); // or a '/unauthorized' page
          return;
        }
        setStoryToEdit(foundStory);
        setTitle(foundStory.title);
        setManualContent(foundStory.content);
        setCategory(foundStory.category);
        setCoverImage(foundStory.coverImage);
        setCreationMode('manual'); // Default to manual for editing
      } else {
        navigate('/'); // Story not found
      }
    }
  }, [id, stories, isEditMode, navigate, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB size limit
         setError("حجم الملف كبير جداً. الرجاء اختيار ملف أصغر من 4 ميجابايت.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setCoverImage(null);
    const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('الرجاء إدخال عنوان القصة.');
      return;
    }
     if (creationMode === 'manual' && !manualContent.trim()) {
      setError('الرجاء كتابة محتوى القصة.');
      return;
    }
    if (!coverImage) {
        setError('الرجاء رفع صورة غلاف للقصة.');
        return;
    }

    setIsLoading(true);
    
    try {
      let storyContent = '';
      if (creationMode === 'ai' && !isEditMode) { // AI generation only for new stories
        setLoadingMessage('جاري كتابة القصة...');
        storyContent = await generateStory(title);
      } else {
        storyContent = manualContent;
      }
      
      if (isEditMode && storyToEdit && onEditStory) {
        const updatedStory: Story = {
          ...storyToEdit,
          title,
          content: storyContent,
          category,
          coverImage: coverImage!,
        };
        onEditStory(updatedStory);
        navigate(`/story/${storyToEdit.id}`);
      } else if (!isEditMode && onAddStory) {
        const newStory = {
          title,
          category,
          content: storyContent,
          coverImage: coverImage!,
        };
        onAddStory(newStory);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('فشل في معالجة القصة. الرجاء التأكد من صحة مفتاح الواجهة البرمجية والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const PageIcon = isEditMode ? Edit : Wand2;
  const pageTitle = isEditMode ? "تعديل القصة" : "إنشاء قصة جديدة";
  const buttonText = isEditMode ? "حفظ التعديلات" : "أبدِع القصة";

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg dark:shadow-xl dark:shadow-slate-950/50 animate-fade-in border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <PageIcon className="h-10 w-10 text-indigo-500 dark:text-indigo-400 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
            مرحباً <span className="font-bold text-indigo-600 dark:text-indigo-300">{user}</span>! {isEditMode ? 'قم بتعديل تحفتك الفنية.' : 'اختر طريقتك في الإبداع.'}
        </p>
      </div>
      
      {!isEditMode && (
        <div className="flex items-center justify-center gap-2 mb-6 border border-slate-200 dark:border-slate-700 p-1 rounded-lg bg-slate-100 dark:bg-slate-900/50">
          <button type="button" onClick={() => setCreationMode('ai')} className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${creationMode === 'ai' ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            <Sparkles className="h-5 w-5" />
            <span>إنشاء بالذكاء الاصطناعي</span>
          </button>
          <button type="button" onClick={() => setCreationMode('manual')} className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${creationMode === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            <PenSquare className="h-5 w-5" />
            <span>كتابة يدوية</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">عنوان القصة</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: الفارس المفقود في وادي النجوم" className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required />
        </div>
        
        {(creationMode === 'manual' || isEditMode) && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">محتوى القصة</label>
            <textarea id="content" value={manualContent} onChange={(e) => setManualContent(e.target.value)} placeholder="اكتب قصتك هنا..." className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition h-64 resize-y" required />
          </div>
        )}

        <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تصنيف القصة</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                {storyCategories.map(cat => (<option key={cat} value={cat} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">{cat}</option>))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">صورة الغلاف</label>
            {coverImage ? (
                <div className="mt-2 relative">
                    <img src={coverImage} alt="معاينة الغلاف" className="w-full h-auto max-h-72 object-contain rounded-md bg-slate-100 dark:bg-slate-900/50" />
                    <button type="button" onClick={handleRemoveImage} aria-label="إزالة الصورة" className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"><X className="h-5 w-5" /></button>
                </div>
            ) : (
                <div className="mt-2">
                    <label htmlFor="cover-upload" className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-slate-100/50 dark:bg-slate-700/20 hover:bg-slate-200/50 dark:hover:bg-slate-700/40">
                        <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-500 dark:text-slate-400"><p className="pl-1">ارفع ملفًا أو اسحبه وأفلته هنا</p></div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WEBP بحد أقصى 4 ميجابايت</p>
                        </div>
                        <input id="cover-upload" name="cover-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                    </label>
                </div>
            )}
        </div>
        
        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed text-lg">
          {isLoading ? (<><Spinner size="h-5 w-5" /><span>{loadingMessage || 'جاري المعالجة...'}</span></>) : (<><Sparkles className="h-6 w-6" /><span>{buttonText}</span></>)}
        </button>
      </form>
    </div>
  );
};

export default DashboardPage;
