import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../contexts/StoreContext';
import { generateSpeech } from '../services/geminiService';
import { Mic, MicOff, X, MessageSquare, Sparkles } from 'lucide-react';

interface VoiceAssistantProps {
    onNavigate: (page: string) => void;
}

const QA_DATABASE = [
    { keys: ["namaste", "hello", "hi", "hey"], answer: "Namaste! Welcome to Bharat E Mart. Main aapki kaise madad kar sakta hoon?" },
    { keys: ["kaise ho", "how are you", "kya haal"], answer: "Main ek AI hoon, hamesha badhiya! Bataiye kya khareedna hai aaj?" },
    { keys: ["tum kaun ho", "who are you"], answer: "Main Bharat E Mart ka digital assistant hoon. Hinglish samajhta hoon." },
    { keys: ["return policy", "wapas", "refund"], answer: "Hamari 7 days easy return policy hai. No questions asked." },
    { keys: ["delivery", "shipping", "kab aayega"], answer: "Delivery usually 2 se 4 din mein ho jaati hai." },
    { keys: ["payment", "pay", "cash"], answer: "Aap UPI, Card ya Cash on Delivery se payment kar sakte hain." },
    { keys: ["support", "customer care", "help"], answer: "Aap 1800-123-456 par call kar sakte hain 24/7." },
    { keys: ["joke"], answer: "Ek phone ne charger se kaha - Tumhare bina main adhura hoon!" },
    { keys: ["thank you", "shukriya", "thanks"], answer: "Aapka swagat hai! Happy Shopping." },
    { keys: ["bye", "alvida"], answer: "Alvida! Phir milenge." },
];

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigate }) => {
    const { products, setVoiceRequest } = useStore();
    const [isListening, setIsListening] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [userText, setUserText] = useState('...');
    const [aiText, setAiText] = useState('Hello! Click mic to start.');
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // Refs for speech objects to persist across renders
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
    const isAutoListeningRef = useRef(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-IN';
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setUserText("Listening...");
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserText(`"${transcript}"`);
                setShowChat(true);
                processCommand(transcript);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Web Speech API not supported");
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const toggleVoiceAssistant = () => {
        if (!recognitionRef.current) {
            alert("Voice features not supported in this browser.");
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        // Stop any ongoing speech
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        
        isAutoListeningRef.current = true;
        setShowChat(true);
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error(e);
        }
    };

    const stopListening = () => {
        isAutoListeningRef.current = false;
        recognitionRef.current.stop();
        setAiText("Auto-listen stopped.");
    };

    const speak = async (text: string) => {
        // Cancel browser speech if active
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        // Stop listening while speaking/processing
        if (recognitionRef.current) {
             try { recognitionRef.current.stop(); } catch(e) {}
        }

        setIsSpeaking(true);

        // Try Gemini TTS first (Humanoid Voice)
        const audioData = await generateSpeech(text);

        if (audioData) {
            try {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                }
                const audioContext = audioContextRef.current;
                
                // Decode Base64
                const binaryString = atob(audioData);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const buffer = await audioContext.decodeAudioData(bytes.buffer);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                
                source.onended = () => {
                     setIsSpeaking(false);
                     // Resume listening if auto-listen is on
                     if (isAutoListeningRef.current) {
                        try { recognitionRef.current.start(); } catch(e) {}
                    }
                };
                
                source.start(0);
            } catch (e) {
                console.error("Audio playback failed", e);
                setIsSpeaking(false);
                fallbackSpeak(text);
            }
        } else {
            // Fallback to browser TTS
            fallbackSpeak(text);
        }
    };

    const fallbackSpeak = (text: string) => {
        if (text !== '') {
            const utterThis = new SpeechSynthesisUtterance(text);
            
            // Ensure voices are loaded
            let voices = synthRef.current.getVoices();
            
            const targetVoice = voices.find(v => 
                v.name.includes('Heera') || 
                v.name.includes('Veena') || 
                v.name.includes('Google हिन्दी') || 
                v.name.includes('Google Hindi') ||
                ((v.lang === 'en-IN' || v.lang === 'hi-IN') && v.name.toLowerCase().includes('female'))
            ) || voices.find(v => 
                v.name.toLowerCase().includes('female') && v.lang.startsWith('en')
            ) || voices.find(v => 
                v.lang === 'en-IN'
            );

            if (targetVoice) {
                utterThis.voice = targetVoice;
            }
            
            utterThis.pitch = 1.1;
            utterThis.rate = 1;

            utterThis.onend = () => {
                setIsSpeaking(false);
                if (isAutoListeningRef.current) {
                    setTimeout(() => {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            // Already started or error
                        }
                    }, 500);
                }
            };

            synthRef.current.speak(utterThis);
        } else {
            setIsSpeaking(false);
        }
    };

    const processCommand = (rawText: string) => {
        const text = rawText.toLowerCase();
        let response = "";
        let actionTaken = false;

        // 1. QA Database Check
        for (const item of QA_DATABASE) {
            if (item.keys.some(key => text.includes(key))) {
                response = item.answer;
                actionTaken = true;
                break;
            }
        }

        // 2. Logic: Categories
        if (!actionTaken) {
            let categoryFilter = 'All';
            let sortOption: any = 'default';
            let searchQuery = '';
            let shouldNavigate = false;

            if (text.includes("mobile") || text.includes("phone")) {
                categoryFilter = "Electronics";
                searchQuery = "phone";
                response = "Ye rahe hamare behtareen electronics aur phones.";
                shouldNavigate = true;
            } else if (text.includes("laptop") || text.includes("computer") || text.includes("pc")) {
                 categoryFilter = "Computers";
                 searchQuery = "";
                 response = "Computers aur Laptops ka collection open kar diya hai.";
                 shouldNavigate = true;
            } else if (text.includes("fridge") || text.includes("washing machine") || text.includes("appliance")) {
                 categoryFilter = "Home Appliances";
                 searchQuery = "";
                 response = "Home Appliances section dikha raha hoon.";
                 shouldNavigate = true;
            } else if (text.includes("accessory") || text.includes("watch") || text.includes("sunglass")) {
                categoryFilter = "Accessories";
                response = "Accessories section open kar diya hai.";
                shouldNavigate = true;
            } else if (text.includes("furniture") || text.includes("chair")) {
                categoryFilter = "Furniture";
                response = "Furniture collection dekhiye.";
                shouldNavigate = true;
            }

            // Logic: Sorting
            if (text.includes("best") || text.includes("top") || text.includes("badhiya")) {
                sortOption = 'rating-desc';
                response = response ? response + " Rating ke hisaab se sort kiya hai." : "Maine inhe rating ke hisaab se sort kar diya hai.";
                shouldNavigate = true;
            } else if (text.includes("cheap") || text.includes("sasta") || text.includes("budget") || text.includes("low price")) {
                sortOption = 'price-asc';
                response = response ? response + " Price low to high laga diya hai." : "Maine inhe price (low to high) laga diya hai.";
                shouldNavigate = true;
            } else if (text.includes("expensive") || text.includes("mehnga")) {
                sortOption = 'price-desc';
                response = response ? response + " Premium products dikha raha hoon." : "Ye rahe premium expensive models.";
                shouldNavigate = true;
            }

            // Logic: Specific Price Query
            const mentionedProduct = products.find(p => text.includes(p.name.toLowerCase()));
            if (mentionedProduct) {
                if (text.includes("price") || text.includes("rate") || text.includes("kitne ka")) {
                    response = `${mentionedProduct.name} ki price hai ${mentionedProduct.price} rupaye.`;
                } else {
                    response = `Yeh raha ${mentionedProduct.name}.`;
                }
                searchQuery = mentionedProduct.name;
                categoryFilter = 'All'; 
                shouldNavigate = true;
            }

            if (shouldNavigate) {
                setVoiceRequest({
                    category: categoryFilter,
                    sortBy: sortOption,
                    query: searchQuery,
                    timestamp: Date.now()
                });
                onNavigate('shop');
                actionTaken = true;
            }
        }

        // 3. Fallback
        if (!actionTaken) {
            response = "Maaf kijiye, mujhe samajh nahi aaya. Aap 'Sasta phone', 'Best laptop', ya 'Help' bol sakte hain.";
        }

        setAiText(response);
        speak(response);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-none">
            {/* Chat Bubble */}
            {showChat && (
                <div className="pointer-events-auto bg-white mb-4 p-4 rounded-2xl shadow-2xl border border-indigo-100 max-w-xs w-72 animate-in slide-in-from-bottom-5 fade-in duration-300 relative">
                    <button 
                        onClick={() => { setShowChat(false); stopListening(); }} 
                        className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">ShopSmart AI</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mb-2 border-l-2 border-indigo-100 pl-2">
                        {userText}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                        {aiText}
                        {isSpeaking && <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full ml-2 animate-bounce"></span>}
                    </p>
                </div>
            )}

            {/* Floating Mic Button */}
            <button
                onClick={toggleVoiceAssistant}
                className={`pointer-events-auto w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isListening 
                    ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse' 
                    : isSpeaking 
                        ? 'bg-indigo-500 text-white ring-4 ring-indigo-200 animate-bounce'
                        : 'bg-gradient-to-r from-indigo-600 to-primary-600 text-white hover:shadow-indigo-500/30'
                }`}
                aria-label="Voice Assistant"
            >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
        </div>
    );
};

export default VoiceAssistant;