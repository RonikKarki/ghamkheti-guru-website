/**
 * Seeds the Gallery collection with all real company photos and logos.
 * Run: node scripts/seed-gallery.mjs
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI || readEnvFile();

function readEnvFile() {
  try {
    const env = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
    const match = env.match(/^MONGODB_URI=(.+)$/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found. Set it in .env.local or as env var.");
  process.exit(1);
}

const GallerySchema = new mongoose.Schema({
  title:        { type: String, required: true },
  alt:          { type: String, default: "" },
  category:     { type: String, required: true },
  fileUrl:      { type: String, required: true },
  thumbnailUrl: { type: String },
  fileType:     { type: String, default: "image" },
  isFeatured:   { type: Boolean, default: false },
  order:        { type: Number, default: 0 },
  dimensions:   { width: Number, height: Number },
}, { timestamps: true });

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

const entries = [
  /* ── Sisakhola Hydropower Site Photos ── */
  {
    title: "Sisakhola Hydropower — Project Site",
    alt: "Cleared project site at Sisakhola Hydropower, Solududhkunda Municipality, Solukhumbu",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-site-01.jpg",
    isFeatured: true,
    order: 1,
  },
  {
    title: "Sisakhola Hydropower — Site Survey",
    alt: "Project site survey area near Sisakhola River",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-site-02.jpg",
    order: 2,
  },
  {
    title: "Sisakhola Hydropower — Riverbank",
    alt: "Riverbank at Sisakhola hydropower project site",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-site-03.jpg",
    order: 3,
  },
  {
    title: "Solududhkunda Municipality — Ward 10 Signage",
    alt: "Welcome to Ward No. 10 Solududhkunda Municipality sign in Solukhumbu",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-site-04.jpg",
    order: 4,
  },
  {
    title: "Sisakhola River — Wooden Bridge Crossing",
    alt: "Wooden footbridge crossing the Sisakhola River at the hydropower project site",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-bridge-01.png",
    isFeatured: true,
    order: 5,
  },
  {
    title: "Sisakhola Hydropower — River Flow Survey",
    alt: "Survey team measuring river flow at Sisakhola for hydropower feasibility study",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-flow-measurement.png",
    isFeatured: true,
    order: 6,
  },
  {
    title: "Sisakhola River — Hydrology Assessment",
    alt: "Clear mountain river at Sisakhola hydropower site, Solukhumbu",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-river-01.png",
    order: 7,
  },
  {
    title: "Sisakhola Hydropower — Geological Survey",
    alt: "Site investigation team on rocky terrain along Sisakhola River",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-rocky-terrain.png",
    order: 8,
  },
  {
    title: "Sisakhola — Survey Team at River Crossing",
    alt: "Engineering survey team at river crossing, Sisakhola hydropower project",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-01.jpg",
    order: 9,
  },
  {
    title: "Sisakhola — River Flow Measurement",
    alt: "Team measuring river water flow for Sisakhola 4.9 MW hydropower project",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-02.jpg",
    order: 10,
  },
  {
    title: "Sisakhola — Village Bridge Infrastructure",
    alt: "Steel bridge crossing near Solududhkunda village, Sisakhola project area",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-03.jpg",
    order: 11,
  },
  {
    title: "Sisakhola — Hydrological Survey",
    alt: "Survey team conducting hydrological assessment at Sisakhola River",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-04.jpg",
    order: 12,
  },
  {
    title: "Sisakhola — River Gauging Station",
    alt: "Engineers measuring river gauge at Sisakhola hydropower project",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-05.jpg",
    order: 13,
  },
  {
    title: "Sisakhola — Site Investigation",
    alt: "Site investigation and geological assessment at Sisakhola, Solukhumbu",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-06.jpg",
    order: 14,
  },
  {
    title: "Sisakhola — Rocky Terrain Assessment",
    alt: "Survey team traversing rocky terrain at Sisakhola project site",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-07.jpg",
    order: 15,
  },
  {
    title: "Sisakhola — Mountain River Crossing",
    alt: "Survey crossing mountain river terrain at Sisakhola hydropower location",
    category: "Hydropower",
    fileUrl: "/images/gallery/sisakhola-survey-08.jpg",
    order: 16,
  },

  /* ── Agriculture / Rice Mill ── */
  {
    title: "Shree Suryodaya Rice Mill — Industrial Satake Dryer",
    alt: "Japanese Satake milling technology tower at Shree Suryodaya Khadya Udhyog Limited, Nawalpur",
    category: "Agriculture",
    fileUrl: "/images/gallery/rice-mill-satake-tower.png",
    isFeatured: true,
    order: 20,
  },
  {
    title: "Shree Suryodaya Rice Mill — Facility & Operations",
    alt: "Shree Suryodaya Khadya Udhyog Limited rice mill facility with paddy trucks, Gaindakot, Nawalpur",
    category: "Agriculture",
    fileUrl: "/images/gallery/rice-mill-exterior-trucks.png",
    isFeatured: true,
    order: 21,
  },
  {
    title: "Namche Gold — Premium Long Grain Rice",
    alt: "Namche Gold premium long grain rice packaging, 20 KG bags by Shree Suryodaya",
    category: "Agriculture",
    fileUrl: "/images/gallery/namche-gold-packaging.png",
    isFeatured: true,
    order: 22,
  },

  /* ── Corporate ── */
  {
    title: "Ghamkheti Guru — Head Office, Kathmandu",
    alt: "Ghamkheti Guru Company Limited head office building in Kathmandu, Nepal",
    category: "Corporate",
    fileUrl: "/images/gallery/ghamkheti-office-1.png",
    isFeatured: false,
    order: 30,
  },
];

async function seed() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const exists = await Gallery.findOne({ fileUrl: entry.fileUrl });
    if (exists) {
      skipped++;
      continue;
    }
    await Gallery.create(entry);
    created++;
    console.log(`  ✓ ${entry.title}`);
  }

  console.log(`\nDone — ${created} created, ${skipped} skipped (already exist).`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
