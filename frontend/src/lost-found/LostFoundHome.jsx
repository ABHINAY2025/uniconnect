import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const LostFoundHome = () => {
    const navigate = useNavigate();
    const [rollNo, setRollNo] = useState("Loading...");
    const [points, setPoints] = useState(0);
    const [showPointsModal, setShowPointsModal] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/check`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Not authenticated");
            })
            .then((data) => {
                setRollNo(data.user.rollNo);
                setPoints(data.user.recognitionPoints || 0);
            })
            .catch((err) => {
                console.error("Auth check failed", err);
            });
    }, []);

    // Badge Logic
    const getBadgeInfo = (pts) => {
        if (pts >= 100) return { name: "Gold Hero", color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200", next: null, limit: 100 };
        if (pts >= 50) return { name: "Silver Guardian", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", next: 100, limit: 50 };
        if (pts >= 25) return { name: "Bronze Scout", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200", next: 50, limit: 25 };
        return { name: "Novice", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", next: 25, limit: 0 };
    };

    const badge = getBadgeInfo(points);
    const progress = badge.next ? ((points - badge.limit) / (badge.next - badge.limit)) * 100 : 100;

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Glass Navbar */}
            <nav className="bg-white/60 backdrop-blur-lg border-b border-white/40 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-4">
                            <Link to="/home" className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </Link>
                            <span className="font-black text-xl tracking-tight text-slate-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                                Lost & Found
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Gamification Widget */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowPointsModal(!showPointsModal)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all shadow-sm ${showPointsModal ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white/80 border-white/50 text-slate-600 hover:bg-white hover:shadow-md'}`}
                                >
                                    <span className="text-lg">🏆</span>
                                    <span>{points} pts</span>
                                </button>

                                {showPointsModal && (
                                    <div className="absolute right-0 top-14 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                            <span className="font-bold text-slate-800 text-lg">Your Status</span>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badge.bg} ${badge.color} ${badge.border}`}>{badge.name}</span>
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                                    <span>Level Progress</span>
                                                    {badge.next && <span>{points} / {badge.next}</span>}
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 leading-relaxed border border-slate-100">
                                                <p><span className="font-bold text-emerald-600">Tip:</span> Solving a lost item case awards <span className="font-bold text-slate-800">25 points</span>. Help your peers!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/notifications" className="p-2.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-all relative">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </Link>

                            <div className="hidden sm:block text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</div>
                                <div className="font-mono font-bold text-slate-800">{rollNo}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        See Something,<br />
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Say Something.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Help keep our campus secure and connected. Report lost items or help return found ones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
                    {/* Report Found */}
                    <div
                        onClick={() => navigate("/report-item/found")}
                        className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-4">I Found an Item</h3>
                        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                            Be a hero. Report an item you found and earn recognition from the community.
                        </p>
                        <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 font-black rounded-2xl shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            Start Report <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </span>
                    </div>

                    {/* Report Lost */}
                    <div
                        onClick={() => navigate("/report-item/lost")}
                        className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-200/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-4">I Lost an Item</h3>
                        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                            Don't panic. Create a report and we'll notify you when matches are found.
                        </p>
                        <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-black rounded-2xl shadow-lg group-hover:bg-amber-600 group-hover:text-white transition-all">
                            Start Report <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-24 text-center text-slate-400 font-medium text-sm relative z-10">
                    <p>&copy; 2024 UniConnect. Campus Life Simplified.</p>
                </div>
            </main>
        </div>
    );
};

export default LostFoundHome;
