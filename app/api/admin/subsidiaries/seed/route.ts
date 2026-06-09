import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import Subsidiary from "@/models/Subsidiary";

export const POST = withApiHandler(async () => {
  await assertRole("admin");
  await connectToDatabase();

  const existing = await Subsidiary.countDocuments();
  if (existing > 0) {
    return apiSuccess({ seeded: false, count: existing }, "Subsidiaries already seeded");
  }

  const name = "Shree Suryodaya Khadya Udhyog Limited";
  await Subsidiary.create({
    slug:             slugify(name),
    name,
    industry:         "Rice Milling & Food Processing",
    shortDescription: "A wholly-owned subsidiary of Ghamkheti Guru Company Limited, operating a modern rice milling and food processing facility in Nawalpur, Nepal.",
    description:      "Shree Suryodaya Khadya Udhyog Limited is a fully integrated food processing enterprise established in Gaindakot, Nawalpur. The company operates state-of-the-art rice milling facilities and is committed to adding agricultural value through modern processing techniques. As a 100% owned subsidiary of Ghamkheti Guru Company Limited, it serves as the group's agri-industrial arm, connecting local farmers to national and regional markets through quality-assured rice and food products.",
    location:         "Gaindakot, Nawalpur, Nepal",
    ownership:        "100% Owned by Ghamkheti Guru Company Limited",
    establishedYear:  2020,
    activities: [
      { title: "Rice Milling",                description: "Large-scale modern rice milling operations processing locally sourced paddy into premium white rice products.", order: 0 },
      { title: "Rice Processing",             description: "Cleaning, sorting, grading, and packaging of various rice varieties to meet quality standards for domestic and export markets.", order: 1 },
      { title: "Agricultural Value Addition", description: "Transforming raw agricultural produce into value-added food products, increasing farmer income and reducing post-harvest losses.", order: 2 },
      { title: "Food Production",             description: "Production of packaged food products including rice flour, rice bran, and other by-products from the milling process.", order: 3 },
    ],
    products: [
      { name: "Sona Mansuli Rice",  description: "Premium long-grain Sona Mansuli rice, carefully milled and sorted for consistent quality and taste.", order: 0 },
      { name: "Jeera Masino Rice",  description: "Fine-grain Jeera Masino rice with a delicate aroma, ideal for everyday cooking and special occasions.", order: 1 },
      { name: "Katarni Rice",       description: "Aromatic Katarni rice variety known for its unique fragrance and superior cooking quality.", order: 2 },
    ],
    contact: {
      phone:   "+977-78-540000",
      email:   "suryodaya@ghamkhetiguru.com.np",
      website: "https://ghamkhetiguru.com.np/subsidiaries/shree-suryodaya-khadya-udhyog-limited",
    },
    isActive:   true,
    isFeatured: true,
    order:      0,
    seoTitle:        "Shree Suryodaya Khadya Udhyog Limited — Rice Milling, Nawalpur Nepal",
    seoDescription:  "Rice milling and food processing subsidiary of Ghamkheti Guru Company Limited, based in Gaindakot, Nawalpur. Producing Sona Mansuli, Jeera Masino, and Katarni rice.",
  });

  return apiSuccess({ seeded: true }, "Initial subsidiary seeded successfully");
});
