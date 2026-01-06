import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    authorRollNo: {
      type: String,
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    rawText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
