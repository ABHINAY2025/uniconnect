import { useState } from "react";
import { createExperience } from "./experienceService";

const AddExperienceModal = ({ onClose }) => {
  const [companyName, setCompanyName] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rawText.trim()) return;

    try {
      setLoading(true);
      await createExperience({ companyName, rawText });
      onClose();
    } catch {
  alert("Failed to submit experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Share Your Experience
        </h2>

        <input
          type="text"
          placeholder="Company Name (optional)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />

        <textarea
          placeholder="Write your experience here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white 
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;
