
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import StarField from './components/StarField';
import { AppStep, UserProfile, TrapMode, Question, AnswerMap, ChatMessage } from './types';
import { calculateLifePath, calculateYearCode, determineHDType, determineTrapMode, calculateMBTI, generateSystemPrompt, generateMBTIAssessmentPrompt } from './utils/calculator';
import { QuizQuestions, LifePathDB, YearCodeDB, HDEnergyDB } from './services/soulDatabase';

// --- FEATURE TOGGLE ---
const ENABLE_AI_QUIZ = false; 
// ----------------------

// --- SAFE API KEY RETRIEVAL (Fix for Vercel/Vite White Screen) ---
const getApiKey = () => {
  let key = '';
  // 1. Try Vite Environment Variable (Standard for Vercel + Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("Vite env access error", e);
  }

  // 2. Fallback to process.env (Node.js/Legacy)
  if (!key) {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        // @ts-ignore
        key = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Process env access error", e);
    }
  }
  
  return key;
};

const API_KEY = getApiKey();

// Initialize Gemini API with a dummy key if missing to prevent crash on load
// We will check for valid key later
const ai = new GoogleGenAI({ apiKey: API_KEY || 'placeholder_key' });

// Helper to render text with bold markdown and line breaks
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, lineIndex) => {
         if (!line.trim()) return <div key={lineIndex} className="h-2" />;
         const parts = line.split(/(\*\*.*?\*\*)/g);
         return (
           <p key={lineIndex} className="min-h-[1em]">
             {parts.map((part, i) => {
               if (part.startsWith('**') && part.endsWith('**')) {
                 return <span key={i} className="font-bold text-soul-dark bg-soul-gold/10 px-1 rounded">{part.slice(2, -2)}</span>;
               }
               return <span key={i}>{part}</span>;
             })}
           </p>
         );
      })}
    </div>
  );
};

function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    birthDate: '',
    lifePathNumber: 0,
    yearCode: 0,
    hdType: 'TYPE_B' as any,
  });
  
  // Date Input State
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const [loadingText, setLoadingText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Static Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<AnswerMap>({});

  // AI Quiz Chat State
  const [aiQuizHistory, setAiQuizHistory] = useState<ChatMessage[]>([]);
  const [aiQuizSession, setAiQuizSession] = useState<Chat | null>(null);

  // Consultation Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const quizChatContainerRef = useRef<HTMLDivElement>(null);

  // Check API Key on Mount
  useEffect(() => {
    if (!API_KEY || API_KEY === 'placeholder_key') {
        console.error("API Key missing");
        setErrorMessage("⚠️ 系統未檢測到 API Key。請確認 Vercel 環境變數名稱是否為 'VITE_API_KEY'。");
    }
  }, []);

  // Update full birthDate string whenever parts change
  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
        setProfile(prev => ({
            ...prev,
            birthDate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
        }));
    }
  }, [birthYear, birthMonth, birthDay]);

  // Date Input Handlers with Auto-Focus
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.slice(0, 4);
      setBirthYear(val);
      if (val.length === 4) monthRef.current?.focus();
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.slice(0, 2);
      setBirthMonth(val);
      if (val.length === 2) dayRef.current?.focus();
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.slice(0, 2);
      setBirthDay(val);
  };

  const handleStartScan = () => {
    if (!profile.name || !profile.birthDate || birthYear.length < 4 || !birthMonth || !birthDay) return;
    
    const lp = calculateLifePath(profile.birthDate);
    const yc = calculateYearCode(profile.birthDate);
    const hd = determineHDType(lp);

    setProfile(prev => ({
      ...prev,
      lifePathNumber: lp,
      yearCode: yc,
      hdType: hd
    }));

    setStep(AppStep.LOADING);
  };

  const startQuiz = () => {
      if (ENABLE_AI_QUIZ) {
          initializeAIQuiz();
      } else {
          setStep(AppStep.QUIZ);
      }
  };

  // Loading Simulation
  useEffect(() => {
    if (step === AppStep.LOADING) {
      const texts = [
        "正在連線阿卡西紀錄...",
        "讀取靈魂原始藍圖...",
        "解析紫微星盤底層恐懼...",
        "計算人類圖能量策略...",
        "準備行為模式校準..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < texts.length) {
          setLoadingText(texts[i]);
          i++;
        } else {
          clearInterval(interval);
          setStep(AppStep.QUIZ_INTRO);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Computing Simulation & AI Initialization
  useEffect(() => {
    if (step === AppStep.COMPUTING) {
        const texts = [
            "正在交叉比對四大流派數據...",
            "偵測潛意識衝突節點...",
            "推演未來生命軌跡...",
            "建立加密診療室..."
        ];
        let i = 0;
        setLoadingText(texts[0]);
        const interval = setInterval(() => {
            if (i < texts.length - 1) {
                i++;
                setLoadingText(texts[i]);
            } else {
                clearInterval(interval);
                initializeAIChat();
            }
        }, 1500);
        return () => clearInterval(interval);
    }
  }, [step, profile]);

  // --- AI QUIZ LOGIC ---

  const initializeAIQuiz = async () => {
    setStep(AppStep.AI_QUIZ);
    const prompt = generateMBTIAssessmentPrompt(profile.name);
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: prompt, temperature: 0.7 },
        });
        setAiQuizSession(chat);
        setIsThinking(true);
        
        // Trigger AI to start interview
        const response = await chat.sendMessage({ message: "開始校準。" });
        
        setAiQuizHistory([{
            id: 'quiz-intro',
            sender: 'system',
            text: response.text || "校準程序啟動失敗。"
        }]);
        setIsThinking(false);
    } catch (e) {
        console.error(e);
        // Fallback to static quiz if AI fails
        setStep(AppStep.QUIZ); 
    }
  };

  const handleAIQuizMessage = async () => {
    if (!userInput.trim() || !aiQuizSession || isThinking) return;
    const msgText = userInput;
    setUserInput('');
    setAiQuizHistory(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: msgText }]);
    setIsThinking(true);

    try {
        const response = await aiQuizSession.sendMessageStream({ message: msgText });
        const aiMsgId = `ai-quiz-${Date.now()}`;
        setAiQuizHistory(prev => [...prev, { id: aiMsgId, sender: 'system', text: '' }]);

        let fullText = '';
        for await (const chunk of response) {
            const textChunk = chunk.text;
            fullText += textChunk;
            
            // Check for secret code
            const match = fullText.match(/<<<MBTI:([A-Za-z]{4})>>>/);
            if (match) {
                const detectedMBTI = match[1].toUpperCase();
                const trap = determineTrapMode(detectedMBTI);
                setProfile(prev => ({ ...prev, mbti: detectedMBTI, trapMode: trap }));
                setStep(AppStep.COMPUTING);
                return; // Stop processing stream
            }

            setAiQuizHistory(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: fullText } : msg
            ));
        }
    } catch (error) {
        console.error("Quiz Error:", error);
    } finally {
        setIsThinking(false);
    }
  };

  // --- CONSULTATION CHAT LOGIC ---

  const initializeAIChat = async () => {
      const systemPrompt = generateSystemPrompt(profile);
      
      try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
            },
        });
        setChatSession(chat);
        setStep(AppStep.CONSULTATION);
        
        setIsThinking(true);
        // Use a softer, connection-building trigger
        const response: GenerateContentResponse = await chat.sendMessage({ 
            message: "【系統指令】診斷開始。請先與我建立連結，同理我的處境，再溫和但堅定地點出我系統中的衝突。" 
        });
        
        setChatHistory([{
            id: 'intro',
            sender: 'system',
            text: response.text || "系統連線異常，數據庫回應超時。"
        }]);
        setIsThinking(false);

      } catch (error) {
          console.error("AI Init Error:", error);
          setStep(AppStep.CONSULTATION);
          setChatHistory([{
              id: 'error',
              sender: 'system',
              text: "靈魂數據庫連線不穩定，可能是 API Key 設定問題，請檢查系統配置。"
          }]);
      }
  };

  // Auto Scroll for both chats
  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      if (quizChatContainerRef.current) {
          quizChatContainerRef.current.scrollTop = quizChatContainerRef.current.scrollHeight;
      }
  }, [chatHistory, aiQuizHistory, isThinking]);

  const handleSendMessage = async () => {
      if (!userInput.trim() || !chatSession || isThinking) return;

      const msgText = userInput;
      setUserInput(''); // Clear input immediately to prevent text remaining
      
      setChatHistory(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: msgText }]);
      setIsThinking(true);

      try {
          const response = await chatSession.sendMessageStream({ message: msgText });
          const aiMsgId = `ai-${Date.now()}`;
          setChatHistory(prev => [...prev, { id: aiMsgId, sender: 'system', text: '' }]);
          
          let fullText = '';
          for await (const chunk of response) {
             const textChunk = chunk.text;
             fullText += textChunk;
             setChatHistory(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: fullText } : msg
             ));
          }
      } catch (error) {
          console.error("Chat Error:", error);
          setChatHistory(prev => [...prev, { id: `err-${Date.now()}`, sender: 'system', text: "訊號受到干擾，請您再說一次..." }]);
      } finally {
          setIsThinking(false);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          handleSendMessage();
      }
  };

  const handleStaticQuizAnswer = (value: string) => {
    const qId = QuizQuestions[currentQuestionIndex].id;
    const newAnswers = { ...quizAnswers, [qId]: value };
    setQuizAnswers(newAnswers);

    if (currentQuestionIndex < QuizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        const mbtiResult = calculateMBTI(newAnswers);
        const trap = determineTrapMode(mbtiResult);
        setProfile(prev => ({ ...prev, mbti: mbtiResult, trapMode: trap }));
        setStep(AppStep.COMPUTING);
    }
  };

  // --- SUB-COMPONENTS ---

  const SoulBlueprint = () => {
      const lpData = LifePathDB[profile.lifePathNumber];
      const ycData = YearCodeDB[profile.yearCode];
      const hdData = HDEnergyDB[profile.hdType];
      
      // Translate HD Type for display
      const getHDDisplay = (type: string) => {
          if (type === 'TYPE_A') return '發起者';
          if (type === 'TYPE_B') return '生產/引導者';
          return '情緒/反映者';
      };

      return (
        <div className="bg-stone-100 border-b border-soul-border p-4 md:p-6 animate-fade-in shadow-sm">
            <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
                {/* LP - The Engine */}
                <div className="flex flex-col items-center text-center p-2 bg-white rounded shadow-sm border border-soul-border">
                    <div className="text-[10px] font-mono text-soul-gold uppercase tracking-widest mb-1">核心渴望</div>
                    <div className="text-xl md:text-2xl font-serif text-soul-text font-bold">{profile.lifePathNumber}</div>
                    <div className="text-[11px] text-soul-sub mt-1 font-medium truncate w-full px-2">{lpData.archetype.split('/')[0]}</div>
                </div>

                {/* Year - The Brake */}
                <div className="flex flex-col items-center text-center p-2 bg-white rounded shadow-sm border border-soul-border">
                    <div className="text-[10px] font-mono text-soul-purple uppercase tracking-widest mb-1">深層恐懼</div>
                    <div className="text-xl md:text-2xl font-serif text-soul-text font-bold">{profile.yearCode}</div>
                    <div className="text-[11px] text-soul-sub mt-1 font-medium truncate w-full px-2">{ycData.fear.replace(/[【】]/g, '')}</div>
                </div>

                {/* HD - The Hardware */}
                <div className="flex flex-col items-center text-center p-2 bg-white rounded shadow-sm border border-soul-border">
                    <div className="text-[10px] font-mono text-soul-teal uppercase tracking-widest mb-1">原廠設定</div>
                    <div className="text-xl md:text-2xl font-serif text-soul-text font-bold">
                        {getHDDisplay(profile.hdType)}
                    </div>
                    <div className="text-[11px] text-soul-sub mt-1 font-medium truncate w-full px-2">{hdData.role.split(' ')[0]}</div>
                </div>
            </div>
            <div className="flex justify-center mt-3">
               <div className="text-[10px] font-mono text-soul-sub uppercase tracking-widest bg-stone-200 px-2 py-0.5 rounded">
                  當前人格面具: {profile.mbti}
               </div>
            </div>
        </div>
      );
  };

  const renderInput = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10 animate-fade-in">
      <div className="paper-card p-10 md:p-14 rounded-sm max-w-lg w-full border border-soul-border relative bg-white/90 backdrop-blur-sm shadow-2xl">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-soul-text/30"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-soul-text/30"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-soul-text/30"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-soul-text/30"></div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-soul-text mb-3 tracking-widest font-bold">LifeOS</h1>
          <p className="text-soul-sub font-mono text-xs tracking-[0.3em] uppercase">靈魂診斷系統 v6.0</p>
          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-soul-border to-transparent"></div>
        </div>
        
        {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-sans rounded text-center">
                {errorMessage}
            </div>
        )}
        
        <div className="space-y-10">
          <div className="relative group">
            <label className="block text-[10px] font-mono text-soul-sub mb-2 uppercase tracking-widest text-center">探索者姓名</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full bg-stone-50/50 border-b border-soul-border py-3 text-2xl text-soul-text font-serif placeholder-stone-300 focus:outline-none focus:border-soul-text transition-colors text-center"
              placeholder="請輸入姓名"
            />
          </div>
          
          <div className="relative group">
            <label className="block text-[10px] font-mono text-soul-sub mb-2 uppercase tracking-widest text-center">出生年月日 (西元)</label>
            <div className="flex gap-4 justify-center items-end">
                <input 
                  ref={yearRef}
                  type="text" 
                  maxLength={4}
                  value={birthYear}
                  onChange={handleYearChange}
                  className="w-24 bg-stone-50/50 border-b border-soul-border py-3 text-2xl text-soul-text font-serif placeholder-stone-300 focus:outline-none focus:border-soul-text transition-colors text-center"
                  placeholder="YYYY"
                />
                <span className="text-xl text-soul-sub pb-3">/</span>
                <input 
                  ref={monthRef}
                  type="text" 
                  maxLength={2}
                  value={birthMonth}
                  onChange={handleMonthChange}
                  className="w-16 bg-stone-50/50 border-b border-soul-border py-3 text-2xl text-soul-text font-serif placeholder-stone-300 focus:outline-none focus:border-soul-text transition-colors text-center"
                  placeholder="MM"
                />
                <span className="text-xl text-soul-sub pb-3">/</span>
                <input 
                  ref={dayRef}
                  type="text" 
                  maxLength={2}
                  value={birthDay}
                  onChange={handleDayChange}
                  className="w-16 bg-stone-50/50 border-b border-soul-border py-3 text-2xl text-soul-text font-serif placeholder-stone-300 focus:outline-none focus:border-soul-text transition-colors text-center"
                  placeholder="DD"
                />
            </div>
          </div>

          <button 
            onClick={handleStartScan}
            disabled={!profile.name || !birthYear || !birthMonth || !birthDay}
            className="w-full py-4 mt-6 bg-soul-text hover:bg-soul-dark text-white font-mono text-xs tracking-[0.3em] uppercase transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
          >
            啟動靈魂掃描
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 relative">
        <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute w-full h-full border-t border-b border-soul-border rounded-full animate-spin-slow opacity-60"></div>
            <div className="absolute w-3/4 h-3/4 border-r border-l border-soul-sub rounded-full animate-spin opacity-40 direction-reverse"></div>
            <div className="absolute w-1.5 h-1.5 bg-soul-text rounded-full z-10 animate-pulse"></div>
        </div>
        <div className="mt-12 font-mono text-soul-text text-xs tracking-[0.25em] animate-pulse uppercase">{loadingText}</div>
    </div>
  );

  const renderQuizIntro = () => (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 z-10 relative animate-fade-in">
        <div className="paper-card p-10 md:p-16 rounded-sm max-w-md w-full text-center border-t-4 border-soul-text shadow-xl bg-white/95">
            <h2 className="text-2xl md:text-3xl font-serif text-soul-text mb-6 font-bold tracking-wide">行為模式校準</h2>
            <p className="text-soul-sub font-sans text-base leading-loose-plus tracking-wide mb-10 text-justify">
                為了精準診斷您在壓力下的真實反應，系統需要進行{ENABLE_AI_QUIZ ? '行為校準對談' : '20 題快速直覺校準'}。
                這不是性格測驗，這是為了找出你系統中的「慣性迴圈」。
            </p>
            <button 
                onClick={startQuiz}
                className="px-12 py-4 bg-soul-text text-white font-mono text-xs tracking-[0.2em] hover:bg-soul-dark transition-colors uppercase shadow-lg rounded-sm"
            >
                開始校準
            </button>
        </div>
      </div>
  );

  const renderStaticQuiz = () => {
      const q = QuizQuestions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / QuizQuestions.length) * 100;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 z-10 relative">
            <div className="w-full max-w-xl mb-10">
                 <div className="flex justify-between text-[10px] font-mono text-soul-sub mb-3 uppercase tracking-widest">
                    <span>校準進度</span>
                    <span>{currentQuestionIndex + 1} / {QuizQuestions.length}</span>
                 </div>
                 <div className="h-0.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-soul-text transition-all duration-500 ease-out" style={{width: `${progress}%`}}></div>
                 </div>
            </div>

            <div className="paper-card p-8 md:p-16 w-full max-w-2xl shadow-2xl animate-slide-up relative bg-white border border-soul-border rounded-sm">
                 <h3 className="text-xl md:text-2xl font-serif text-soul-text text-center mb-12 leading-relaxed tracking-wide font-medium">
                    {q.text}
                 </h3>
                 
                 <div className="grid gap-5">
                    <button 
                        onClick={() => handleStaticQuizAnswer(q.optionA.value)}
                        className="group p-6 border border-soul-border hover:border-soul-text hover:bg-stone-50 transition-all text-left flex items-center rounded-sm"
                    >
                        <div className="w-5 h-5 rounded-full border border-soul-sub group-hover:bg-soul-text group-hover:border-soul-text mr-5 flex-shrink-0 transition-colors"></div>
                        <span className="font-sans text-soul-text text-base md:text-lg tracking-wide group-hover:text-black transition-colors">{q.optionA.text}</span>
                    </button>

                    <button 
                        onClick={() => handleStaticQuizAnswer(q.optionB.value)}
                        className="group p-6 border border-soul-border hover:border-soul-text hover:bg-stone-50 transition-all text-left flex items-center rounded-sm"
                    >
                        <div className="w-5 h-5 rounded-full border border-soul-sub group-hover:bg-soul-text group-hover:border-soul-text mr-5 flex-shrink-0 transition-colors"></div>
                        <span className="font-sans text-soul-text text-base md:text-lg tracking-wide group-hover:text-black transition-colors">{q.optionB.text}</span>
                    </button>
                 </div>
            </div>
        </div>
      );
  };

  const renderAIQuiz = () => (
    <div className="flex flex-col h-screen max-w-5xl mx-auto relative z-20 bg-white shadow-2xl border-x border-soul-border">
        {/* Header - Slightly different from Consultation */}
        <div className="border-b border-soul-border text-center bg-white/95 backdrop-blur sticky top-0 z-30 p-4">
            <div className="text-[10px] font-mono tracking-[0.3em] text-soul-teal uppercase mb-1">Behavioral Calibration</div>
            <h2 className="text-lg font-serif text-soul-text tracking-widest font-bold">行為模式校準中...</h2>
        </div>

        {/* Chat Container */}
        <div 
            ref={quizChatContainerRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-stone-50"
        >
            {aiQuizHistory.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                    {msg.sender === 'system' && (
                        <div className="w-8 h-8 rounded-full bg-soul-teal flex items-center justify-center text-white font-serif italic text-xs mr-4 mt-1 flex-shrink-0 shadow-md">
                        C
                        </div>
                    )}
                    <div className={`
                        relative max-w-3xl p-6 md:p-8 rounded-sm shadow-sm text-base md:text-lg leading-relaxed-plus tracking-wide
                        ${msg.sender === 'user' 
                            ? 'bg-white text-soul-text border-t border-l border-r border-soul-border font-sans' 
                            : 'bg-white text-soul-text border border-soul-border font-sans'}
                    `}>
                         <FormattedText text={msg.text.replace(/<<<MBTI:[A-Z]+>>>/g, '')} />
                    </div>
                </div>
            ))}
             {isThinking && (
                  <div className="flex justify-start animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-soul-teal/40 flex items-center justify-center text-white font-serif italic text-xs mr-4">C</div>
                      <div className="bg-white border border-soul-border p-4 rounded-sm flex items-center space-x-2 shadow-sm">
                          <div className="w-1.5 h-1.5 bg-soul-teal rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-soul-teal rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-soul-teal rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                  </div>
              )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-soul-border">
            <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAIQuizMessage();
                        }
                    }}
                    placeholder="回答問題 (Enter 發送)..."
                    className="w-full bg-stone-50 border border-soul-border p-4 focus:outline-none focus:border-soul-teal focus:bg-white font-sans text-soul-text resize-none h-14 min-h-[3.5rem] max-h-32 rounded-sm tracking-wide placeholder-stone-400 transition-all text-base"
                />
                <button 
                    onClick={handleAIQuizMessage}
                    disabled={isThinking || !userInput.trim()}
                    className="h-14 px-6 bg-soul-teal text-white font-mono text-xs tracking-widest uppercase hover:bg-teal-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center rounded-sm flex-shrink-0"
                >
                    回覆
                </button>
            </div>
        </div>
    </div>
  );


  const renderConsultation = () => (
      <div className="flex flex-col h-screen max-w-5xl mx-auto relative z-20 bg-white shadow-2xl border-x border-soul-border">
          {/* Header */}
          <div className="border-b border-soul-border text-center bg-white/95 backdrop-blur sticky top-0 z-30">
              <div className="py-3 md:py-4">
                  <div className="text-[10px] font-mono tracking-[0.3em] text-soul-sub uppercase mb-1">Soul Forensic Lab</div>
                  <h2 className="text-lg md:text-xl font-serif text-soul-text tracking-widest font-bold">靈魂駭客實驗室</h2>
              </div>
              {/* Visual Blueprint - The "Evidence" */}
              <SoulBlueprint />
          </div>

          {/* Chat Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-[#fafaf9]"
          >
              {chatHistory.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  >
                      {msg.sender === 'system' && (
                          <div className="w-8 h-8 rounded-full bg-soul-text flex items-center justify-center text-white font-serif italic text-xs mr-4 mt-1 flex-shrink-0 shadow-md">
                            S
                          </div>
                      )}
                      
                      <div className={`
                        relative max-w-3xl p-6 md:p-8 rounded-sm shadow-sm text-base md:text-lg leading-relaxed-plus tracking-wide
                        ${msg.sender === 'user' 
                            ? 'bg-white text-soul-text border-t border-l border-r border-soul-border font-sans' 
                            : 'bg-white text-soul-text border border-soul-border font-sans'}
                      `}>
                          <FormattedText text={msg.text} />
                      </div>
                  </div>
              ))}
              
              {isThinking && (
                  <div className="flex justify-start animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-soul-text/40 flex items-center justify-center text-white font-serif italic text-xs mr-4">S</div>
                      <div className="bg-white border border-soul-border p-4 rounded-sm flex items-center space-x-2 shadow-sm">
                          <div className="w-1.5 h-1.5 bg-soul-sub rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-soul-sub rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-soul-sub rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                  </div>
              )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-soul-border">
              <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="輸入您的回饋 (Enter 發送)..."
                    className="w-full bg-stone-50 border border-soul-border p-4 focus:outline-none focus:border-soul-text focus:bg-white font-sans text-soul-text resize-none h-14 min-h-[3.5rem] max-h-32 rounded-sm tracking-wide placeholder-stone-400 transition-all text-base"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isThinking || !userInput.trim()}
                    className="h-14 px-6 bg-soul-text text-white font-mono text-xs tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center rounded-sm flex-shrink-0"
                  >
                    發送
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-soul-text bg-soul-bg selection:bg-soul-text selection:text-white">
      <StarField />
      
      {/* Main Content Layer */}
      <div className="relative z-10">
        {step === AppStep.INPUT && renderInput()}
        {(step === AppStep.LOADING || step === AppStep.COMPUTING) && renderLoading()}
        {step === AppStep.QUIZ_INTRO && renderQuizIntro()}
        {step === AppStep.QUIZ && renderStaticQuiz()}
        {step === AppStep.AI_QUIZ && renderAIQuiz()}
        {step === AppStep.CONSULTATION && renderConsultation()}
      </div>
    </div>
  );
}

export default App;
