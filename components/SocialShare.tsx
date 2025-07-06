import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SocialShareProps {
    storyUrl: string;
    storyTitle: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ storyUrl, storyTitle }) => {
    const { showToast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(storyUrl)
            .then(() => {
                showToast("تم نسخ رابط القصة بنجاح!", "success");
            })
            .catch(() => {
                 showToast("فشل نسخ الرابط.", "error");
            });
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-300">مشاركة:</span>
             <button onClick={handleCopy} className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 text-white transition-colors" title="نسخ الرابط">
                <Copy size={18} />
            </button>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(storyUrl)}&text=${encodeURIComponent(storyTitle)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 text-white transition-colors" title="مشاركة على تويتر">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.1 0 .8-.2 1.5-.4 2.1-.7 1.9-2.2 3.2-4.1 3.8-1.5.5-3.1.6-4.6.4-1.8-.2-3.4-.9-4.8-2-1.1-.9-2-2.1-2.6-3.4-.6-1.3-.9-2.8-.9-4.3 0-2.6 1.1-5 2.8-6.6.3-.3.6-.6.9-.8.4-.3.8-.5 1.3-.7 1.5-.6 3.1-.9 4.7-.9 1.1 0 2.2.2 3.2.5.3.1.6.2.8.3.2.1.4.2.6.3.3.1.5.2.7.3.2.1.3.2.4.2z"></path></svg>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 text-white transition-colors" title="مشاركة على فيسبوك">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
        </div>
    );
};

export default SocialShare;
