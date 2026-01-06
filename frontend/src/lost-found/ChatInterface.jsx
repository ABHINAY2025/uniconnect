import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChatInterface = () => {
    const { itemId, receiverId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch current user
    useEffect(() => {
        fetch("http://localhost:5000/api/auth/check", { credentials: "include" })
            .then(res => res.json())
            .then(data => setCurrentUser(data.user))
            .catch(err => console.error("Auth check failed", err));
    }, []);

    // Fetch Messages Polling
    useEffect(() => {
        if (!currentUser) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/lost-found/message/conversation?itemId=${itemId}&user1=${currentUser.rollNo}&user2=${receiverId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [currentUser, itemId, receiverId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            const res = await fetch("http://localhost:5000/api/lost-found/message/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender: currentUser.rollNo,
                    receiver: receiverId,
                    itemId: itemId,
                    content: newMessage,
                }),
            });

            if (res.ok) {
                setNewMessage("");
                // Optimistically update or wait for poll (poll is fast enough usually, or we can append)
                // Let's force a fetch immediately
                // Or manually append for instant feel
                const sentMsg = await res.json();
                setMessages([...messages, sentMsg]);
            }
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 font-sans">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10 border-b border-slate-200">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {receiverId ? receiverId.slice(-4) : "User"}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">Student {receiverId}</h2>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ded8] bg-opacity-30">
                {/* WhatsApp-like background pattern could go here */}

                {messages.map((msg) => {
                    const isMe = msg.sender === currentUser?.rollNo;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[70%] rounded-xl p-3 shadow-sm relative text-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 rounded-tl-none'
                                    }`}
                            >
                                <p>{msg.content}</p>
                                <span className={`text-[10px] block text-right mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-slate-200">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
