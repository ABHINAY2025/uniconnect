import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        // Fetch User
        fetch(`${API_BASE}/api/auth/check`, { credentials: "include" })
            .then(res => res.json())
            .then(data => setCurrentUser(data.user))
            .catch(err => console.error("Auth check failed", err));

        // Fetch Item
        fetch(`${API_BASE}/api/lost-found/item/${id}`)
            .then(res => res.json())
            .then(data => setItem(data))
            .catch(err => console.error("Fetch item failed", err));
    }, [id]);

    const isMe = currentUser?.rollNo === item?.reportedBy;

    useEffect(() => {
        if (isMe && item && currentUser && item.status !== 'closed') {
            fetch(`${API_BASE}/api/lost-found/message/conversations-list?itemId=${item._id}&userId=${currentUser.rollNo}`)
                .then(res => res.json())
                .then(data => setConversations(data))
                .catch(err => console.error("Fetch conversations failed", err));
        }
    }, [isMe, item, currentUser]);

    if (!item) return <div className="text-center p-10">Loading item details...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('/bg-pattern.png')" }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row">
                {/* Left/Top Detail Section */}
                <div className="w-full">
                    <div className={`h-32 ${item.type === 'lost' ? 'bg-amber-100' : 'bg-emerald-100'} flex items-center justify-center relative`}>
                        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>
                        <span className={`text-6xl ${item.type === 'lost' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {item.type === 'lost' ? '🔍' : '📦'}
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className={`text-sm font-bold uppercase tracking-wide mb-1 ${item.type === 'lost' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                                </p>
                                <h1 className="text-3xl font-bold text-slate-800">{item.description.substring(0, 30)}...</h1>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Reported on</p>
                                <p className="font-medium text-slate-800">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                            <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                    {item.reportedBy.slice(-2)}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Reported by</p>
                                    <p className="font-semibold text-slate-800">{item.reportedBy} {isMe && '(You)'}</p>
                                </div>
                            </div>

                            {!isMe && currentUser && (
                                <div className="flex gap-2">
                                    {item.status !== 'closed' ? (
                                        <button
                                            onClick={() => navigate(`/lost-found/chat/${item._id}/${item.reportedBy}`)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                            Chat with Reporter
                                        </button>
                                    ) : (
                                        <div className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold border border-slate-200 flex items-center gap-2 cursor-not-allowed">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Case Closed
                                        </div>
                                    )}

                                    {/* If looking at a FOUND item, I (Visitor) am the Owner. I key verify receipt to award points to Reporter (Finder) */}
                                    {item.type === 'found' && item.status !== 'closed' && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Is this your item? Confirming receipt will close this case and award recognition points to User ${item.reportedBy} for finding it.`)) {
                                                    fetch(`${API_BASE}/api/lost-found/solve`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        // Here 'finderId' is the reporter of the found item
                                                        body: JSON.stringify({ itemId: item._id, finderId: item.reportedBy })
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            alert(data.message);
                                                            navigate("/lost-found");
                                                        })
                                                        .catch(err => alert("Error resolving item"));
                                                }
                                            }}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                                            I Received This
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Conversations List for Item Owner */}
                        {isMe && (
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Messages regarding this item</h3>
                                {item.status === 'closed' ? (
                                    <div className="p-4 bg-slate-100 rounded-lg text-slate-500 text-center italic">
                                        This case has been resolved and closed. Chat history is no longer available.
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <p className="text-slate-500 italic">No messages yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {conversations.map(conv => (
                                            <div
                                                key={conv.partnerId}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                                            >
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                                    onClick={() => navigate(`/lost-found/chat/${item._id}/${conv.partnerId}`)}
                                                >
                                                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                                        {conv.partnerId.slice(-2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-700">User {conv.partnerId}</p>
                                                        <p className="text-xs text-slate-400">Click to reply</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Only show 'Mark as Finder' button if I reported a LOST item (I am Owner, Partner is Finder) */}
                                                    {item.type === 'lost' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm(`Did User ${conv.partnerId} return your item? This will close the case and award them recognition points.`)) {
                                                                    fetch(`${API_BASE}/api/lost-found/solve`, {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ itemId: item._id, finderId: conv.partnerId })
                                                                    })
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                            alert(data.message);
                                                                            navigate("/lost-found");
                                                                        })
                                                                        .catch(err => alert("Error resolving item"));
                                                                }
                                                            }}
                                                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200"
                                                        >
                                                            Mark as Finder
                                                        </button>
                                                    )}
                                                    <div className="text-blue-500 cursor-pointer" onClick={() => navigate(`/lost-found/chat/${item._id}/${conv.partnerId}`)}>
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;
