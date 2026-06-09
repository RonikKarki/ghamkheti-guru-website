import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectCategory = "hydropower" | "solar" | "agriculture" | "agri-solar" | "tourism";
export type ProjectStatus =
  | "operational" | "under_construction" | "commissioning"
  | "under_development" | "licensed" | "on_hold";

export interface IProjectHighlight { label: string; value: string }
export interface IProjectImage     { url: string; alt: string; isCover: boolean }
export interface IProjectDocument  { url: string; name: string; type: string; size?: number }
export interface IProjectMilestone {
  title:       string;
  date?:       Date;
  completed:   boolean;
  description?: string;
}

export interface IProject extends Document {
  slug:              string;
  name:              string;
  category:          ProjectCategory;
  status:            ProjectStatus;
  isActive:          boolean;
  description:       string;
  objectives?:       string;
  bannerImage?:      string;
  logoImage?:        string;
  location: {
    district:  string;
    province:  string;
    river?:    string;
    elevation?: number;
  };
  capacity?: { value: number; unit: string };
  highlights:   IProjectHighlight[];
  images:       IProjectImage[];
  documents:    IProjectDocument[];
  timeline:     IProjectMilestone[];
  codDate?:           Date;
  constructionStart?: Date;
  investmentValue?:   number;
  ppa?: { authority: string; term: number; tariff?: number };
  isFeatured:    boolean;
  order:         number;
  seoTitle?:     string;
  seoDescription?: string;
  createdAt:     Date;
  updatedAt:     Date;
}

const HL  = new Schema<IProjectHighlight>( { label: String, value: String }, { _id: false });
const IMG = new Schema<IProjectImage>( { url: String, alt: { type: String, default: "" }, isCover: { type: Boolean, default: false } }, { _id: false });
const DOC = new Schema<IProjectDocument>( { url: String, name: String, type: String, size: Number }, { _id: false });
const MS  = new Schema<IProjectMilestone>( { title: String, date: Date, completed: { type: Boolean, default: false }, description: String }, { _id: false });

const ProjectSchema = new Schema<IProject>(
  {
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, enum: ["hydropower","solar","agriculture","agri-solar","tourism"], index: true },
    status:      { type: String, required: true, enum: ["operational","under_construction","commissioning","under_development","licensed","on_hold"], default: "under_development", index: true },
    isActive:    { type: Boolean, default: true, index: true },
    description: { type: String, required: true, maxlength: 3000 },
    objectives:  { type: String, maxlength: 2000 },
    bannerImage: { type: String },
    logoImage:   { type: String },
    location: {
      district:  { type: String, required: true },
      province:  { type: String, required: true },
      river:     { type: String },
      elevation: { type: Number },
    },
    capacity: { value: Number, unit: String },
    highlights:  { type: [HL],  default: [] },
    images:      { type: [IMG], default: [] },
    documents:   { type: [DOC], default: [] },
    timeline:    { type: [MS],  default: [] },
    codDate:           Date,
    constructionStart: Date,
    investmentValue:   Number,
    ppa: { authority: String, term: Number, tariff: Number },
    isFeatured:    { type: Boolean, default: false, index: true },
    order:         { type: Number, default: 0 },
    seoTitle:      { type: String, maxlength: 70 },
    seoDescription:{ type: String, maxlength: 160 },
  },
  { timestamps: true }
);

ProjectSchema.index({ category: 1, status: 1, order: 1 });
ProjectSchema.index({ isActive: 1, order: 1 });
ProjectSchema.index({ slug: 1 });

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
