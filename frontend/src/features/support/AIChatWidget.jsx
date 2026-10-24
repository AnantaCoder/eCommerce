import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  User,
  Check,
  CheckCheck,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  Search,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  startChatSession,
  getChatHistory,
  sendMessage,
  connectWebSocket,
  clearMessages
} from "../support/supportSlice";

// Curated suggestion chips for instant testing
const SUGGESTED_QUERIES = [
  {
    icon: "📚",
    label: "Wings of Fire book",
    query: "Do you have Wings of Fire book in stock and what is its price?"
  },
  {
    icon: "🚴",
    label: "Bicycle air pump",
    query: "Show me bicycle pump options with prices"
  },
  {
    icon: "👗",
    label: "Women kurta",
    query: "Do you have any women kurta available right now?"
  },
  {
    icon: "💰",
    label: "Deals under Rs. 500",
    query: "What items do you have under Rs. 500?"
  }
];

// Multi-stage simulation pipeline messages & status icons
const SIMULATION_STAGES = [
  {
    label: "Query Understanding",
    desc: "Extracting product intent & search keywords...",
    icon: Search
  },
  {
    label: "Catalog Retrieval",
    desc: "Scanning product catalog via LangChain BM25...",
    icon: Layers
  },
  {
    label: "Inventory Verification",
    desc: "Verifying live prices, stock levels & brand specs...",
    icon: ShieldCheck
  },
  {
    label: "Response Synthesis",
    desc: "Formulating verified catalog recommendation...",
    icon: Cpu
  }
];

// Lightweight synthesized Web Audio feedback (zero external audio files needed)
const playTone = (freq, duration, type = "sine", gainVal = 0.05) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio failure silent fallback
  }
};

const playSendSound = () => {
  playTone(587.33, 0.12, "sine", 0.04); // D5 soft pop
};

const playReceiveSound = () => {
  try {
    playTone(523.25, 0.1, "sine", 0.03); // C5
    setTimeout(() => playTone(659.25, 0.15, "sine", 0.03), 80); // E5
  } catch {
    // silent fallback
  }
};

export default function AIChatWidget() {
  const dispatch = useDispatch();
  const { session, messages, error } = useSelector((state) => state.support);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Widget view states
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Input & sending states
  const [input, setInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [optimisticMsg, setOptimisticMsg] = useState(null);

  // Simulation pipeline states
  const [simulationStage, setSimulationStage] = useState(0);
  const [elapsedTimer, setElapsedTimer] = useState(0.0);
  const [copiedId, setCopiedId] = useState(null);
  const [likedIds, setLikedIds] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const stageIntervalRef = useRef(null);

  const userEmail = isAuthenticated && user ? user.email : email;

  // Auto-scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, optimisticMsg, isOpen, simulationStage]);

  // Handle simulation timers & stage progressions
  useEffect(() => {
    if (isSending) {
      setSimulationStage(0);
      setElapsedTimer(0.0);

      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        setElapsedTimer(
          parseFloat(((Date.now() - startTime) / 1000).toFixed(1))
        );
      }, 100);

      stageIntervalRef.current = setInterval(() => {
        setSimulationStage((prev) => {
          if (prev < SIMULATION_STAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1200);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  }, [isSending]);

  // Ensure session is initialized
  const ensureSession = async () => {
    if (session?.id) return session.id;
    const effectiveEmail = userEmail || "guest_customer@store.com";
    try {
      const res = await dispatch(
        startChatSession({ email: effectiveEmail })
      ).unwrap();
      if (res?.id) {
        dispatch(getChatHistory({ sessionId: res.id }));
        dispatch(connectWebSocket({ sessionId: res.id }));
        return res.id;
      }
    } catch (e) {
      console.error("Failed to start session:", e);
    }
    return null;
  };

  // Mount session when chat is opened
  useEffect(() => {
    if (isOpen && !session?.id) {
      ensureSession();
    }
  }, [isOpen]);

  const handleChatButtonClick = () => {
    if (!isAuthenticated && !user && !userEmail && !session) {
      setShowEmailForm(true);
      return;
    }
    setIsOpen(true);
    setIsMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    const effectiveEmail = email.trim() || "guest_customer@store.com";
    setEmail(effectiveEmail);
    setShowEmailForm(false);
    setIsOpen(true);
    try {
      const res = await dispatch(
        startChatSession({ email: effectiveEmail })
      ).unwrap();
      if (res?.id) {
        dispatch(getChatHistory({ sessionId: res.id }));
        dispatch(connectWebSocket({ sessionId: res.id }));
      }
    } catch (err) {
      console.error("Email session error:", err);
    }
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const handleSendQuery = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isSending) return;

    // Ensure session ID is available
    const activeSessionId = session?.id || (await ensureSession());
    if (!activeSessionId) return;

    // 1. Optimistic user bubble
    const tempMsg = {
      id: "temp-" + Date.now(),
      sender: "user",
      message: query,
      timestamp: new Date().toISOString(),
      isOptimistic: true
    };
    setOptimisticMsg(tempMsg);
    setIsSending(true);
    setInput("");

    if (soundEnabled) playSendSound();

    // 2. Dispatch message
    try {
      await dispatch(
        sendMessage({ sessionId: activeSessionId, message: query })
      ).unwrap();
      if (soundEnabled) playReceiveSound();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
      setOptimisticMsg(null);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLike = (id) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefreshChat = () => {
    if (session?.id) {
      dispatch(getChatHistory({ sessionId: session.id }));
    }
  };

  // Helper to format prices, bold tags, stock status, and bullet points
  const renderFormattedBotMessage = (text) => {
    if (!text) return "";

    // Split lines for clean list formatting
    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // Highlight bold text: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const inner = part.slice(2, -2);
          return (
            <span
              key={partIdx}
              className="font-bold text-gray-900 bg-purple-50/80 px-1.5 py-0.5 rounded-md border border-purple-200/60 inline-block my-0.5"
            >
              {inner}
            </span>
          );
        }

        // Highlight Price Tags: Rs. 123 or Rs. 123.45
        const priceRegex = /(Rs\.\s*\d+(?:\.\d{1,2})?)/gi;
        const subParts = part.split(priceRegex);
        return subParts.map((sub, subIdx) => {
          if (priceRegex.test(sub)) {
            return (
              <span
                key={`${partIdx}-${subIdx}`}
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 text-[11px] mx-0.5"
              >
                <Tag className="w-3 h-3 text-emerald-600" />
                {sub}
              </span>
            );
          }

          // Highlight In Stock tags
          if (sub.includes("In Stock") || sub.includes("in stock")) {
            return (
              <span
                key={`${partIdx}-${subIdx}`}
                className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50/70 px-1.5 py-0.5 rounded text-[11px]"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {sub}
              </span>
            );
          }

          return sub;
        });
      });

      // Handle bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            <div className="flex-1">{formattedParts}</div>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="my-1 min-h-[1rem]">
          {formattedParts}
        </p>
      );
    });
  };

  // Combine Redux messages with optimistic bubble
  const displayMessages = [...(messages || [])];
  if (optimisticMsg && !displayMessages.some((m) => m.id === optimisticMsg.id)) {
    displayMessages.push(optimisticMsg);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased text-gray-800">
      {/* Floating Launcher Button */}
      {!isOpen && !showEmailForm && (
        <button
          onClick={handleChatButtonClick}
          className="group relative flex items-center gap-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-medium shadow-2xl rounded-2xl px-5 py-3.5 hover:scale-105 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer border border-white/20 select-none"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:rotate-6 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight">AI Store Assistant</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-medium">RAG</span>
            </div>
            <span className="text-[11px] text-purple-200 block font-normal">
              Instant inventory search & answers
            </span>
          </div>

          <Sparkles className="w-4 h-4 text-amber-300 ml-1 opacity-90 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Guest Fast-Start / Email Modal */}
      {showEmailForm && (
        <div className="w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col border border-purple-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm block">Welcome to AI Assistant</span>
                <span className="text-[10px] text-purple-200">Real-time Catalog Search</span>
              </div>
            </div>
            <button
              onClick={() => setShowEmailForm(false)}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5">
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Ask about products, check stock, verify prices, or get personalized recommendations powered by LangChain RAG.
            </p>

            {/* Instant Guest Start Button */}
            <button
              onClick={() => handleEmailSubmit()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mb-3"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Continue as Guest (Instant Access)</span>
            </button>

            <div className="relative my-3 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-2 text-[10px] text-gray-400 uppercase tracking-widest absolute">or enter email</span>
            </div>

            <form onSubmit={handleEmailSubmit} className="mt-4">
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 font-medium py-2 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Save Email & Start Chat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      {isOpen && (
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col border border-purple-100/80 overflow-hidden transition-all duration-300 ${
            isMinimized
              ? "h-16 w-80 sm:w-96"
              : isExpanded
              ? "w-[94vw] sm:w-[500px] h-[660px] max-h-[90vh]"
              : "w-[92vw] sm:w-96 h-[540px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white flex justify-between items-center shadow-md select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-purple-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight">Catalog AI Assistant</span>
                  <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-purple-100">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-purple-200 block font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  RAG & LangChain Catalog Verified
                </span>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute audio" : "Enable audio"}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
              </button>

              <button
                onClick={handleRefreshChat}
                title="Refresh chat messages"
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Standard view" : "Enlarge view"}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Collapse"}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <span className="text-lg leading-none font-bold">−</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white ml-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-3.5 flex flex-col gap-3.5 overflow-y-auto bg-slate-50/70 scroll-smooth">
                {/* Empty State / Welcome Screen */}
                {displayMessages.length === 0 && !isSending && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-3 animate-in fade-in duration-300">
                    <div className="relative mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                        <Sparkles className="w-7 h-7 animate-pulse text-amber-200" />
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      Hi! How can I help you today?
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 max-w-[260px] leading-relaxed">
                      Ask me anything about store products, live stock counts, pricing, or specifications.
                    </p>

                    {/* Quick Suggestion Cards */}
                    <div className="w-full flex flex-col gap-2">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pl-1">
                        Try asking about:
                      </span>
                      {SUGGESTED_QUERIES.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendQuery(item.query)}
                          className="w-full text-left bg-white hover:bg-purple-50/90 text-gray-700 hover:text-purple-700 p-2.5 rounded-xl border border-gray-200/80 hover:border-purple-300 transition-all shadow-xs hover:shadow-sm flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Bubbles */}
                {displayMessages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex gap-2.5 max-w-[88%] ${
                        isUser ? "self-end flex-row-reverse" : "self-start flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs ${
                          isUser
                            ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                            : "bg-white text-indigo-600 border border-purple-100"
                        }`}
                      >
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      {/* Content Bubble */}
                      <div className="flex flex-col gap-1 max-w-full">
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs transition-all ${
                            isUser
                              ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-tr-none"
                              : "bg-white text-gray-800 border border-purple-100 rounded-tl-none shadow-sm"
                          }`}
                        >
                          {/* Bot Header Badge */}
                          {!isUser && (
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                              <span className="text-[10px] font-semibold text-purple-700 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Store Catalog AI
                              </span>
                              <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                Grounded RAG
                              </span>
                            </div>
                          )}

                          {/* Message Body */}
                          <div className="whitespace-pre-line">
                            {isUser ? msg.message : renderFormattedBotMessage(msg.message)}
                          </div>
                        </div>

                        {/* Message Metadata & Micro-Actions */}
                        <div
                          className={`flex items-center gap-2 px-1 text-[10px] text-gray-400 ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })
                              : "Just now"}
                          </span>

                          {isUser && (
                            <span>
                              {msg.isOptimistic ? (
                                <Check className="w-3 h-3 text-purple-400 inline" />
                              ) : (
                                <CheckCheck className="w-3.5 h-3.5 text-purple-600 inline" />
                              )}
                            </span>
                          )}

                          {!isUser && (
                            <div className="flex items-center gap-1.5 ml-2">
                              <button
                                onClick={() => handleCopyText(msg.id, msg.message)}
                                title="Copy answer"
                                className="hover:text-gray-600 p-0.5 rounded cursor-pointer transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleToggleLike(msg.id)}
                                title="Helpful"
                                className={`p-0.5 rounded cursor-pointer transition-colors ${
                                  likedIds[msg.id] ? "text-purple-600" : "hover:text-gray-600"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ADVANCED AI PIPELINE LOADER & CHAT SIMULATOR */}
                {isSending && (
                  <div className="flex gap-2.5 self-start max-w-[92%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Animated Avatar */}
                    <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-4 h-4 animate-bounce" />
                      <span className="absolute inset-0 rounded-2xl border-2 border-purple-400/50 animate-ping opacity-40" />
                    </div>

                    {/* Simulation Card */}
                    <div className="flex-1 bg-white border border-purple-200/90 rounded-2xl rounded-tl-none p-3.5 shadow-md flex flex-col gap-2.5 min-w-[240px]">
                      {/* Top Status & Elapsed Timer */}
                      <div className="flex items-center justify-between border-b border-purple-50 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                          <span className="text-[11px] font-bold text-purple-900 tracking-tight">
                            AI Catalog Engine
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 font-semibold">
                          {elapsedTimer.toFixed(1)}s
                        </span>
                      </div>

                      {/* Multi-Step Pipeline Indicator */}
                      <div className="flex flex-col gap-1.5">
                        {SIMULATION_STAGES.map((stage, idx) => {
                          const isDone = idx < simulationStage;
                          const isCurrent = idx === simulationStage;
                          const isPending = idx > simulationStage;

                          const IconComponent = stage.icon;

                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 text-[11px] transition-all duration-300 ${
                                isCurrent
                                  ? "text-purple-900 font-semibold translate-x-1"
                                  : isDone
                                  ? "text-emerald-700 font-medium"
                                  : "text-gray-400 opacity-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  isCurrent
                                    ? "bg-purple-100 text-purple-700 animate-spin"
                                    : isDone
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {isDone ? (
                                  <Check className="w-2.5 h-2.5" />
                                ) : (
                                  <IconComponent className="w-2.5 h-2.5" />
                                )}
                              </div>
                              <span className="truncate">{stage.desc}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Animated Shimmer Preview Skeleton */}
                      <div className="pt-1 flex flex-col gap-1.5">
                        <div className="h-2 w-3/4 bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 rounded animate-pulse" />
                        <div className="h-2 w-full bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 rounded animate-pulse" />
                        <div className="h-2 w-1/2 bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 rounded animate-pulse" />
                      </div>

                      {/* Micro Bouncing Dots */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        <span className="text-[10px] text-purple-400 font-medium">Generating response</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center">
                    {typeof error === "string" ? error : "Chat service notice: Check connection."}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggestion Chips above input */}
              {displayMessages.length > 0 && !isSending && (
                <div className="px-3 pt-2 pb-1 bg-white border-t border-purple-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Suggested:</span>
                  {SUGGESTED_QUERIES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(item.query)}
                      className="text-[11px] text-gray-600 hover:text-purple-700 bg-gray-50 hover:bg-purple-50 px-2.5 py-1 rounded-full border border-gray-200/70 hover:border-purple-200 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Message Input Bar */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendQuery()}
                    placeholder={
                      isSending
                        ? "AI is synthesizing verified recommendation..."
                        : "Ask about product stock, prices, models..."
                    }
                    disabled={isSending}
                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-3.5 pr-9 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all disabled:opacity-60"
                  />
                  {input && !isSending && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleSendQuery()}
                  disabled={!input.trim() || isSending}
                  className="p-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-md hover:shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}