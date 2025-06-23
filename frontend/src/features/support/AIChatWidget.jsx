import React, { useState, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  startChatSession,
  getChatHistory,
  sendMessage,
  connectWebSocket,
} from "../support/supportSlice";

export default function AIChatWidget() {
  const dispatch = useDispatch();
  const { session, messages, loading, error } = useSelector(
    (state) => state.support
  );

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");

  const userEmail = isAuthenticated && user ? user.email : email;

  // Initialize session & WS mounting 
  useEffect(() => {
    if (!userEmail || !isOpen) return;
    dispatch(startChatSession({ email: userEmail }))
      .unwrap()
      .then((sessionData) => {
        const id = sessionData.id;
        if (id) {
          dispatch(getChatHistory({ sessionId: id }));
          dispatch(connectWebSocket({ sessionId: id }));
        }
      })
      .catch(console.error);
  }, [dispatch, userEmail, isOpen]);

  const handleChatButtonClick = () => {
    if (!isAuthenticated || !user) {
      setShowEmailForm(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setShowEmailForm(false);
      setIsOpen(true);
    }
  };

  // After sending a message, re-fetch history to include AI response
  const handleSend = () => {
    if (!input.trim() || !session?.id) return;
    dispatch(sendMessage({ sessionId: session.id, message: input }))
      .unwrap()
      .then(() => dispatch(getChatHistory({ sessionId: session.id })))
      .catch(console.error);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen && !showEmailForm && (
        <button
          className="bg-gradient-to-r cursor-pointer from-purple-600 to-blue-500 text-white font-semibold shadow-xl rounded-xl p-4 hover:scale-105 hover:shadow-2xl transition-transform flex items-center space-x-2"
          onClick={handleChatButtonClick}
        >
          <Bot className="w-5 h-5" />
          <span>AI Chat</span>
        </button>
      )}

      {showEmailForm && (
        <div className="mt-4 w-72 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-300">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">Enter Email</span>
            <button onClick={() => setShowEmailForm(false)}>
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleEmailSubmit} className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              Start Chat
            </button>
          </form>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 w-72 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-300">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          <div className="flex-1 p-3 flex flex-col-reverse gap-2 overflow-y-auto text-sm">
            {[...messages].reverse().map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end ml-auto text-right"
                    : "bg-gray-100 self-start mr-auto"
                }`}
              >
                {msg.message || msg.text}
              </div>
            ))}
            {loading && <div className="text-center text-sm">Loading...</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>

          <div className="p-3 border-t flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
            />
            <button onClick={handleSend}>
              <Send className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}