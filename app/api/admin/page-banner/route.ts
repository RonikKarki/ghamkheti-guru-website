import { NextRequest, NextResponse } from "next/server";
import { assertRole, getSession } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import PageBannerContent, { type BannerPage } from "@/models/PageBannerContent";

const VALID_PAGES: BannerPage[] = [
  "about","projects","blog","media","contact","investor_relations","services","team","gallery",
];

export async function PUT(req: NextRequest) {
  try {
    await assertRole("admin");
    const session = await getSession();
    const body = await req.json() as { page?: string; imageUrl?: string; imageAlt?: string; isActive?: boolean };

    const { page, imageUrl, imageAlt, isActive } = body;

    if (!page || !VALID_PAGES.includes(page as BannerPage)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }

    await connectToDatabase();

    const doc = await PageBannerContent.findOneAndUpdate(
      { page: page as BannerPage },
      {
        $set: {
          imageUrl:  imageUrl  ?? "",
          imageAlt:  imageAlt  ?? "",
          isActive:  isActive  ?? true,
          updatedBy: session?.user?.email ?? "admin",
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ ok: true, doc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Forbidden" || message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await assertRole("admin");
    await connectToDatabase();
    const docs = await PageBannerContent.find().lean();
    return NextResponse.json({ docs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
