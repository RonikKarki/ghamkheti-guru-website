import mongoose, { Schema, Document, Model } from "mongoose";

export type TeamSection = "banner" | "departments" | "leadership" | "team_members";

export interface ITeamContent extends Document {
  section:    TeamSection;
  isActive:   boolean;
  title?:     string;
  subtitle?:  string;
  body?:      string;
  items:      mongoose.Types.Array<Record<string, unknown>>;
  updatedBy?: string;
  createdAt:  Date;
  updatedAt:  Date;
}

const TeamContentSchema = new Schema<ITeamContent>(
  {
    section: {
      type:     String,
      required: true,
      unique:   true,
      enum:     ["banner", "departments", "leadership", "team_members"],
    },
    isActive:  { type: Boolean, default: true },
    title:     { type: String, trim: true },
    subtitle:  { type: String, trim: true },
    body:      { type: String },
    items:     { type: [Schema.Types.Mixed], default: [] },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

const TeamContent: Model<ITeamContent> =
  mongoose.models.TeamContent ??
  mongoose.model<ITeamContent>("TeamContent", TeamContentSchema);

export default TeamContent;
