import { useState, useEffect } from 'react';

const useReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const windowHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;
      const scrollTop = el.scrollTop;
      
      const maxScrollableHeight = scrollHeight - windowHeight;
      if (maxScrollableHeight <= 0) {
          setProgress(0);
          return;
      }

      const currentProgress = (scrollTop / maxScrollableHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Calculate progress on mount in case the page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
};

export default useReadingProgress;