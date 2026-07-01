/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Brain } from "lucide-react";
import { generateContextAwareResponse, getLatestAssessmentData } from "../utils/aiResponseEngine";

const SUGGESTED_PROMPTS = [
  "Why is my burnout high?",
  "How can I reduce stress?",
  "What should I do today?"
];

// Wrapper to add realistic typing delay
const generateAIResponse = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get assessment data for context
      const assessmentData = getLatestAssessmentData();
      
      // Generate context-aware response
      const response = generateContextAwareResponse(message, assessmentData);
      
      resolve(response);
    }, 1200); // 1.2s delay to simulate thinking
  });
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("burnoutChat");
    return saved ? JSON.parse(saved) : [{ role: "ai", content: "Hi there! I'm your AI Wellness Assistant. How can I support you today?" }];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("burnoutChat", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Call AI response engine with context
    const aiResponseText = await generateAIResponse(text);
    
    const aiMsg = { role: "ai", content: aiResponseText };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl sm:right-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Wellness AI</h3>
                  <p className="text-[10px] text-cyan-400">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.role === "ai" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 mt-1">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none" 
                      : "bg-white/10 text-slate-200 rounded-bl-none border border-white/5"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 mt-1">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 rounded-bl-none border border-white/5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts (only show if latest message is from AI) */}
            {messages[messages.length - 1]?.role === "ai" && !isTyping && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 whitespace-nowrap rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/10 bg-white/5 p-3">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Wellness AI..."
                  className="w-full rounded-full border border-white/10 bg-slate-900/50 py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-white transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30 transition-shadow hover:shadow-cyan-500/50 sm:right-10"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </motion.button>
    </>
  );
}
