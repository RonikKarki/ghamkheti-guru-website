import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type NewsCategory =
  | "hydropower"
  | "solar"
  | "agriculture"
  | "corporate"
  | "sustainability"
  | "investor";

export type NewsStatus = "draft" | "published" | "archived";

export interface INews extends Document {
  slug:        string;
  title:       string;
  excerpt:     string;
  content:     string;    // Markdown / rich text
  category:    NewsCategory;
  status:      NewsStatus;
  coverImage?: string;
  author:      string;
  tags:        string[];
  isFeatured:  boolean;
  publishedAt?: Date;
  views:       number;
  seoTitle?:       string;
  seoDescription?: string;
  createdAt:   Date;
  updatedAt:   Date;
}

const NewsSchema = new Schema<INews>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 250 },
    excerpt: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    category: {
      type:  String,
      required: true,
      enum:  ["hydropower", "solar", "agriculture", "corporate", "sustainability", "investor"],
      index: true,
    },
    status: {
      type:    String,
      enum:    ["draft", "published", "archived"],
      default: "draft",
      index:   true,
    },
    coverImage: { type: String },
    author: { type: String, required: true, trim: true, default: "Ghamkheti Guru" },
    tags:   { type: [String], default: [], index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    views:       { type: Number, default: 0, min: 0 },
    seoTitle:       { type: String, maxlength: 70 },
    seoDescription: { type: String, maxlength: 160 },
  },
  { timestamps: true }
);

NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ category: 1, status: 1, publishedAt: -1 });
NewsSchema.index({ isFeatured: 1, status: 1 });
NewsSchema.index({ slug: 1 });

const News: Model<INews> =
  mongoose.models.News ?? mongoose.model<INews>("News", NewsSchema);

export default News;
