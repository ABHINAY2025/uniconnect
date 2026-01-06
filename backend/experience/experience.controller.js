import Experience from "./experience.model.js";
import fetch from "node-fetch";
import ExtractedQuestion from "./extractedQuestion.model.js";


export const createExperience = async (req, res) => {
  try {
    const { companyName, rawText } = req.body;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: "Experience text is required" });
    }

    const experience = new Experience({
      authorRollNo: req.user.rollNo,
      companyName,
      rawText,
    });

    await experience.save();

    // 🔵 ASYNC ML CALL (DO NOT AWAIT)
    triggerMLProcessing(experience);

    res.status(201).json({
      message: "Experience submitted successfully",
      experienceId: experience._id,
    });
  } catch (error) {
    console.error("Create Experience Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({
      authorRollNo: req.user.rollNo,
    }).sort({ createdAt: -1 });

    res.json(experiences);
  } catch (error) {
    console.error("Fetch Experiences Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const triggerMLProcessing = async (experience) => {
  try {
    const response = await fetch("http://localhost:8000/process-experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId: experience._id.toString(),
        companyName: experience.companyName,
        text: experience.rawText,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ ML API error:", errText);
      return;
    }

    const data = await response.json();

    console.log("FULL ML RESPONSE 👉", JSON.stringify(data, null, 2));
    console.log("TYPE OF data.results 👉", typeof data.results);

    if (!data.results || !Array.isArray(data.results)) {
      console.error("❌ Invalid ML response format");
      return;
    }

    for (const item of data.results) {
      const doc = await ExtractedQuestion.create({
        experienceId: experience._id,
        authorRollNo: experience.authorRollNo,
        companyName: experience.companyName,
        questionText: item.questionText,
        subject: item.subject,
        confidenceScore: item.confidence,
      });

      console.log("📌 Inserted extracted question:", doc._id);
    }

    console.log("✅ ML processing completed for", experience._id);
  } catch (err) {
    console.error("❌ ML service failed:", err);
  }
};

export const searchExtractedQuestions = async (req, res) => {
  try {
    const { subject, company } = req.query;

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const query = {
      subject,
    };

    if (company) {
      query.companyName = company;
    }

    const results = await ExtractedQuestion.find(query)
      .sort({ confidenceScore: -1, createdAt: -1 })
      .limit(50);

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



