import { useState, useEffect, useRef } from "react";

export default function Chatbot({ currentUser, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: `Chào ${currentUser?.full_name || 'bạn'}! Tôi là trợ lý AI của Fresh Milk. Tôi có thể tư vấn loại sữa phù hợp cho bạn.` }
  ]);
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userText = chatMessage;
    setChatMessage("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chatbot/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error("Lỗi kết nối server");

      const data = await response.json();
      setMessages((prev) => [...prev, { 
        role: "ai", 
        text: data.reply || "Tôi không nhận được phản hồi phù hợp.",
        suggested_ids: data.suggested_ids || []
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Xin lỗi, server AI đang bận. Bạn thử lại sau nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 md:w-96 bg-white shadow-2xl rounded-2xl border border-gray-200 z-[60] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-[#1a3c7e] p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-bold text-sm">AI Tư Vấn Sữa</span>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 rounded-full p-1 transition-colors">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Messages List */}
      <div ref={scrollRef} className="h-80 overflow-y-auto p-4 bg-gray-50 text-sm flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[85%] shadow-sm ${
              msg.role === "ai"
                ? "bg-blue-100 text-[#1a3c7e] self-start rounded-tl-none border border-blue-200"
                : "bg-[#1a3c7e] text-white self-end rounded-tr-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            AI đang phân tích dữ liệu...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-100 border-none outline-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#1a3c7e]"
          placeholder="Hỏi về sữa bột, sữa tươi..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
          disabled={isLoading}
        />
        <button
          onClick={handleChatSubmit}
          disabled={isLoading || !chatMessage.trim()}
          className={`bg-[#1a3c7e] text-white p-2 rounded-full transition-all ${
            isLoading || !chatMessage.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800 active:scale-95"
          }`}
        >
          <span className="material-symbols-outlined text-xl leading-none">send</span>
        </button>
      </div>
    </div>
  );
}