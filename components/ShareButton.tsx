import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Check for navigator support on component mount.
    if (typeof navigator !== 'undefined') {
      if (navigator.share) {
        setCanNativeShare(true);
        setIsSupported(true);
      } else if (navigator.clipboard) {
        setIsSupported(true);
      }
    }
  }, []);

  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        // Added more detailed logging for debugging
        console.error('Share API error:', error);
        console.error('Data shared:', { title, text, url });
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy link:', err);
        alert('فشل نسخ الرابط.');
      });
    }
  };

  const buttonTitle = !isSupported
    ? "المشاركة غير مدعومة في هذا المتصفح"
    : canNativeShare
    ? 'مشاركة القصة'
    : copied
    ? 'تم النسخ!'
    : 'نسخ الرابط';

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-slate-600 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 text-white flex items-center gap-2 transition-all duration-200 disabled:bg-slate-500 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
      title={buttonTitle}
      disabled={!isSupported || copied}
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-400" />
      ) : (
        canNativeShare ? <Share2 className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ShareButton;
