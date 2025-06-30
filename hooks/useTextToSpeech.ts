
import { useState, useEffect, useCallback, useRef } from 'react';

interface TextToSpeechControls {
  isSpeaking: boolean;
  isPaused: boolean;
  play: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

// A more robust text-to-speech hook with chunking and better error handling.
const useTextToSpeech = (): TextToSpeechControls => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const chunkQueueRef = useRef<string[]>([]);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  // This ref helps prevent race conditions with the `onend` event handler.
  const speechCleanupRef = useRef<() => void>(() => {});

  const updateVoices = useCallback(() => {
    if (synthRef.current) {
      const allVoices = synthRef.current.getVoices();
      if (allVoices.length) {
          voicesRef.current = allVoices;
      }
    }
  }, []);
  
  // Effect to initialize synthesis engine and handle voices
  useEffect(() => {
    if (!isSupported) return;

    synthRef.current = window.speechSynthesis;
    
    const onVoicesChanged = () => updateVoices();

    // Initial attempt to get voices
    updateVoices();
    if (synthRef.current.getVoices().length > 0) {
        updateVoices();
    }
    
    // Subscribe to voice changes
    synthRef.current.addEventListener('voiceschanged', onVoicesChanged);
    
    // This keep-alive interval is crucial for some mobile browsers that might
    // put the speech engine to sleep after a period of inactivity.
    const keepAliveInterval = setInterval(() => {
      if (synthRef.current?.paused) {
        synthRef.current.resume();
      }
    }, 5000);

    return () => {
      clearInterval(keepAliveInterval);
      if (synthRef.current) {
        synthRef.current.removeEventListener('voiceschanged', onVoicesChanged);
        // Ensure any active speech is stopped and cleaned up on unmount.
        speechCleanupRef.current(); 
      }
    };
  }, [isSupported, updateVoices]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      chunkQueueRef.current = [];
      // This check is needed because cancel() on a non-speaking synth can throw an error on some browsers.
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);
  
  // Set up the cleanup function in the ref to be the `stop` function.
  speechCleanupRef.current = stop;

  const speakChunk = useCallback((chunk: string) => {
    if (!synthRef.current || !chunk) return;
    
    // Double-check for voices and update if needed, as they can load late.
    if (voicesRef.current.length === 0) {
        updateVoices();
    }
    
    const utterance = new SpeechSynthesisUtterance(chunk);
    utteranceRef.current = utterance;
    
    const arabicVoice = voicesRef.current.find(v => v.lang === 'ar-SA') || voicesRef.current.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };
    
    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onend = () => {
      // If there are more chunks in the queue, speak the next one.
      if (chunkQueueRef.current.length > 0) {
        const nextChunk = chunkQueueRef.current.shift();
        if (nextChunk) {
            // A tiny delay can help prevent issues between utterances.
            setTimeout(() => speakChunk(nextChunk), 50);
        }
      } else {
        // All chunks have been spoken.
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech Synthesis Error:", event.error);
      // Clean up on error.
      stop();
    };
    
    synthRef.current.speak(utterance);
  }, [updateVoices, stop]);


  const play = useCallback((text: string) => {
    if (!isSupported || !text.trim() || !synthRef.current) return;

    // Stop any ongoing speech before starting new.
    stop();

    const textToSpeak = text.replace(/(\r\n|\n|\r)/gm, " ").trim();
    // Split text into chunks that are less likely to be rejected by the API.
    // Splitting by sentences is more natural. This regex splits by sentence-ending punctuation.
    const chunks = textToSpeak.match(/[^.!?…]+[.!?…]?/g) || [textToSpeak];
    
    chunkQueueRef.current = chunks.map(c => c.trim()).filter(Boolean);
    
    const firstChunk = chunkQueueRef.current.shift();
    if(firstChunk){
      // A small delay after `stop()` can improve reliability.
      setTimeout(() => speakChunk(firstChunk), 100);
    }
    
  }, [isSupported, stop, speakChunk]);

  const pause = useCallback(() => {
    if (synthRef.current?.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
    }
  }, []);

  return { isSpeaking, isPaused, play, pause, resume, stop, isSupported };
};

export default useTextToSpeech;
