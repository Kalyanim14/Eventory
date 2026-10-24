import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({
  category: { type: String, enum: ["planner", "performer", "crew"], required: true, index: true },
  organizer: { kind: { type: String, enum: ["individual", "organization"], required: true }, name: { type: String, required: true, trim: true }, organizationName: { type: String, default: "", trim: true } },
  event: { name: { type: String, default: "", trim: true }, type: { type: String, required: true }, typeOther: { type: String, default: "" }, startDate: { type: Date, required: true }, endDate: { type: Date, required: true }, country: { type: String, required: true }, state: { type: String, default: "" }, location: { type: String, default: "", trim: true }, pincode: { type: String, required: true }, venue: { type: String, default: "", trim: true } },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true, versionKey: false });

export const Requirement = mongoose.model("Requirement", requirementSchema);
