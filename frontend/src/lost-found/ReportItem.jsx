import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const ReportItem = () => {
    const { type } = useParams(); // 'lost' or 'found'
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: "",
        date: "",
    });
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user for 'reportedBy'
    useEffect(() => {
        fetch(`${API_BASE}/api/auth/check`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setCurrentUser(data.user))
            .catch(err => console.error("Auth check failed", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Please login first");
            return;
        }

        const payload = {
            reportedBy: currentUser.rollNo, // Assuming rollNo is the identifier
            description: formData.description,
            date: formData.date,
            type: type, // 'lost' or 'found'
        };

        try {
            const response = await fetch(`${API_BASE}/api/lost-found/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Report submitted successfully!");
                navigate("/lost-found");
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const isLost = type === 'lost';
    const themeColor = isLost ? 'amber' : 'emerald';
    const title = isLost ? 'Report Lost Item' : 'Report Found Item';

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border-t-4 ${isLost ? 'border-amber-500' : 'border-emerald-500'}`}>
                <div className={`p-6 ${isLost ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                    <h2 className={`text-2xl font-bold ${isLost ? 'text-amber-800' : 'text-emerald-800'}`}>{title}</h2>
                    <p className="text-slate-600 mt-2">Please provide details about the item.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors h-32 resize-none"
                            placeholder="Describe the item (color, brand, location, etc.)..."
                            style={{
                                borderColor: 'var(--tw-border-opacity)',
                                // Dynamic focus color logic would be messy inline, sticking to tailwind classes
                            }}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Date {isLost ? 'Lost' : 'Found'}</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-3 text-white rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${isLost ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportItem;
