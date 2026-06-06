import mongoose, { Schema, Document, Model } from "mongoose";
import type { UserRole } from "./User";

export type DocumentType =
  | "annual_report"
  | "quarterly_results"
  | "prospectus"
  | "agm_notice"
  | "agm_minutes"
  | "board_resolution"
  | "governance_policy"
  | "sustainability_report"
  | "project_brief"
  | "other";

export interface IInvestorDocument extends Document {
  title:            string;
  type:             DocumentType;
  fiscalYear?:      string;   // e.g. "FY 2081/82"
  description?:     string;
  fileUrl:          string;
  fileSize?:        number;   // bytes
  fileType:         string;   // "pdf", "xlsx", etc.
  isRestricted:     boolean;
  allowedRoles:     UserRole[];
  downloadCount:    number;
  publishedAt?:     Date;
  order:            number;
  showOnHomepage:   boolean;  // show a popup announcement on the homepage
  homepageLabel?:   string;   // custom CTA label in the popup
  createdAt:        Date;
  updatedAt:        Date;
}

const InvestorDocumentSchema = new Schema<IInvestorDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 250 },
    type: {
      type:     String,
      required: true,
      enum:     [
        "annual_report", "quarterly_results", "prospectus",
        "agm_notice", "agm_minutes", "board_resolution",
        "governance_policy", "sustainability_report", "project_brief", "other",
      ],
      index: true,
    },
    fiscalYear:    { type: String, trim: true },
    description:   { type: String, maxlength: 500 },
    fileUrl:       { type: String, required: true },
    fileSize:      { type: Number },
    fileType:      { type: String, default: "pdf", lowercase: true },
    isRestricted:   { type: Boolean, default: false, index: true },
    allowedRoles:   { type: [String], enum: ["super_admin", "admin", "editor"], default: [] },
    downloadCount:  { type: Number, default: 0, min: 0 },
    publishedAt:    { type: Date, index: true },
    order:          { type: Number, default: 0 },
    showOnHomepage: { type: Boolean, default: false, index: true },
    homepageLabel:  { type: String, trim: true },
  },
  { timestamps: true }
);

InvestorDocumentSchema.index({ type: 1, isRestricted: 1, publishedAt: -1 });
InvestorDocumentSchema.index({ fiscalYear: 1, type: 1 });

const InvestorDocument: Model<IInvestorDocument> =
  mongoose.models.InvestorDocument ??
  mongoose.model<IInvestorDocument>("InvestorDocument", InvestorDocumentSchema);

export default InvestorDocument;
