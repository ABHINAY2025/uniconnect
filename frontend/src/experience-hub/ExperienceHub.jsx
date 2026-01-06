import React, { useEffect, useState } from "react";
import AddExperienceModal from "./AddExperienceModal";
import { fetchMyExperiences, searchQuestions } from "./experienceService";

const ExperienceHub = () => {
  const [open, setOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [subject, setSubject] = useState("");
  const [company, setCompany] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await searchQuestions({ subject, company });
      setResults(data);
    } catch {
      alert("Search failed");
    }
  };

  const loadExperiences = async () => {
    try {
      const data = await fetchMyExperiences();
      setExperiences(data);
    } catch {
      console.error("Failed to load experiences");
    }
  };

  useEffect(() => {
    (async () => {
      await loadExperiences();
    })();
  }, []);

  const categories = ["DSA", "OS", "DBMS", "CN", "HR", "Aptitude", "DevOps"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Experience Hub
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Unlock insights from your peers. Share your interview journey and discover patterns in the chaos.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">Select Topic</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
            </div>

            <div className="relative flex-[2]">
              <input
                type="text"
                placeholder="Search by Company (e.g. Google, Amazon)..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95"
            >
              Search Insights
            </button>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-purple-500">✨</span> Discovered Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((q) => (
                <div key={q._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg uppercase tracking-wider">{q.subject}</span>
                    {q.companyName && <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">🏢 {q.companyName}</span>}
                  </div>
                  <p className="font-medium text-slate-700 leading-relaxed group-hover:text-purple-700 transition-colors">{q.questionText}</p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Recent Experiences */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Your Shared Journey</h2>
            <span className="text-sm font-semibold text-slate-500">{experiences.length} Experiences</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-slate-500 font-medium">Your portfolio is empty. Share your first experience!</p>
              </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp._id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-200">
                      {(exp.companyName || "G").charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-semibold text-slate-700">{new Date(exp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1">{exp.companyName || "General Interview"}</h3>

                  <div className="flex-1 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    <p className="text-slate-600 text-sm leading-relaxed mt-4 line-clamp-4 relative">
                      {exp.rawText}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50">
                    <button className="text-purple-600 text-sm font-bold hover:text-purple-700 flex items-center gap-1 transition-colors">
                      Read Full Story <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white w-16 h-16 rounded-full text-3xl flex items-center justify-center shadow-2xl shadow-slate-400/50 hover:bg-black hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
      >
        <div className="group-hover:rotate-90 transition-transform duration-300">+</div>
      </button>

      {open && (
        <AddExperienceModal
          onClose={() => {
            setOpen(false);
            loadExperiences();
          }}
        />
      )}
    </div>
  );
};

export default ExperienceHub;
