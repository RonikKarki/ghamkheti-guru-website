import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ProjectCategory = "hydropower" | "solar" | "agriculture" | "agri-solar" | "tourism";
export type ProjectStatus =
  | "operational"
  | "under_construction"
  | "commissioning"
  | "under_development"
  | "licensed"
  | "on_hold";

export interface IProjectHighlight {
  label: string;
  value: string;
}

export interface IProjectImage {
  url:       string;
  alt:       string;
  isCover:   boolean;
}

export interface IProject extends Document {
  slug:            string;
  name:            string;
  category:        ProjectCategory;
  status:          ProjectStatus;
  description:     string;
  location: {
    district:  string;
    province:  string;
    river?:    string;
    elevation?: number;   // metres above sea level
  };
  capacity?: {
    value: number;
    unit:  string;       // "MW", "kW", "MT/yr", "Ha"
  };
  highlights:      IProjectHighlight[];
  images:          IProjectImage[];
  codDate?:        Date;    // Commercial Operation Date
  constructionStart?: Date;
  investmentValue?: number; // NPR crores
  ppa?: {
    authority:  string;   // e.g. "Nepal Electricity Authority"
    term:       number;   // years
    tariff?:    number;   // NPR / kWh
  };
  isFeatured:      boolean;
  order:           number;  // display order within category
  seoTitle?:       string;
  seoDescription?: string;
  createdAt:       Date;
  updatedAt:       Date;
}

const ProjectHighlightSchema = new Schema<IProjectHighlight>(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const ProjectImageSchema = new Schema<IProjectImage>(
  {
    url:     { type: String, required: true },
    alt:     { type: String, default: "" },
    isCover: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["hydropower", "solar", "agriculture", "agri-solar", "tourism"],
      index: true,
    },
    status: {
      type:    String,
      required: true,
      enum:    ["operational", "under_construction", "commissioning", "under_development", "licensed", "on_hold"],
      default: "under_development",
      index:   true,
    },
    description: { type: String, required: true, maxlength: 2000 },
    location: {
      district:  { type: String, required: true },
      province:  { type: String, required: true },
      river:     { type: String },
      elevation: { type: Number },
    },
    capacity: {
      value: { type: Number },
      unit:  { type: String },
    },
    highlights:         { type: [ProjectHighlightSchema], default: [] },
    images:             { type: [ProjectImageSchema], default: [] },
    codDate:            { type: Date },
    constructionStart:  { type: Date },
    investmentValue:    { type: Number },
    ppa: {
      authority: { type: String },
      term:      { type: Number },
      tariff:    { type: Number },
    },
    isFeatured:      { type: Boolean, default: false, index: true },
    order:           { type: Number, default: 0 },
    seoTitle:        { type: String, maxlength: 70 },
    seoDescription:  { type: String, maxlength: 160 },
  },
  { timestamps: true }
);

ProjectSchema.index({ category: 1, status: 1, order: 1 });
ProjectSchema.index({ isFeatured: 1, category: 1 });
ProjectSchema.index({ slug: 1 });

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
