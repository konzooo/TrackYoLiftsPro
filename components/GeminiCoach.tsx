import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, Volume2, VolumeX, Mic, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Workout, RepoExercise } from '../types';

interface GeminiCoachProps {
  workouts: Workout[];
  exerciseRepository: RepoExercise[];
  availableTags: string[];
}

const INITIAL_MESSAGE = "Hey! I'm your TrackYoLifts Coach. Ask me about your progress, what to do next, or anything training related!";

const GeminiCoach: React.FC<GeminiCoachProps> = ({ workouts, exerciseRepository, availableTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatRef = useRef<Chat | null>(null);

  // --- CONFIGURATION ---
  const COACH_ICON_PATH = '/mr_swole.png';
  const BUTTON_SIZE = 'w-20 h-20';

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  // Create a fresh chat session with workout data baked into the system instruction
  const createChatSession = useCallback(() => {
    const systemInstruction = `
      You are "TrackYoLifts Coach", a professional, motivating, and knowledgeable fitness assistant.
      Your goal is to help the user with their workouts, analyze their progress, and provide advice.

      CURRENT USER DATA (snapshot from when this session started):
      - Workouts & History: ${JSON.stringify(workouts)}
      - Exercise Library: ${JSON.stringify(exerciseRepository)}
      - Available Tags: ${JSON.stringify(availableTags)}

      CONTEXT:
      The user is at the gym or reviewing their training. You have their full workout history above.
      Be concise, encouraging, and science-based. If they ask about progress, reference their actual numbers.
      If they ask for a new routine, use exercises from their library or suggest new ones.
      Keep responses short and conversational — this is a mobile chat interface.
    `;

    chatRef.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction },
    });
  }, [workouts, exerciseRepository, availableTags]);

  // Open: create session. Close: destroy session and reset messages.
  const handleOpen = () => {
    createChatSession();
    setIsOpen(true);
  };

  const handleClose = () => {
    chatRef.current = null;
    setIsOpen(false);
    setMessages([{ role: 'model', text: INITIAL_MESSAGE }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading || !chatRef.current) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: textToSend });
      const modelText = result.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
      speak(modelText);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorMessage = error?.message?.includes('API_KEY_INVALID')
        ? "Invalid API Key. Please check your configuration."
        : "Sorry, I'm having trouble connecting right now. Please try again!";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 ${BUTTON_SIZE} p-[2px] bg-gradient-to-br from-slate-100 to-slate-300 rounded-full shadow-2xl z-[1000] group transition-all`}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={COACH_ICON_PATH}
            alt="Coach"
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-[450px] h-[650px] max-h-[85vh] bg-white rounded-3xl shadow-2xl z-[1001] flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Coach</h3>
                  <p className="text-xs text-indigo-100">Always active</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2">
                <button 
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-colors ${
                    isListening ? 'bg-rose-500 text-white' : 'text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your coach..."
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-1"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Powered by Gemini • Voice enabled
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiCoach;
