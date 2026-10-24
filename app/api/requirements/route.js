import { connectToDatabase } from "@/lib/mongodb";
import { requirementSchema } from "@/lib/validation";
import { Requirement } from "@/models/Requirement";

export async function POST(request) {
  try {
    const parsed = requirementSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ message: "Invalid requirement payload", errors: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();
    const requirement = await Requirement.create(parsed.data);
    return Response.json({ requirement }, { status: 201 });
  } catch (error) {
    console.error("Unable to create requirement", error);
    if (error.name === "MongooseServerSelectionError") {
      return Response.json({ message: "Unable to connect to the database. Check MongoDB Atlas network access and MONGODB_URI." }, { status: 503 });
    }
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const filter = ["planner", "performer", "crew"].includes(category) ? { category } : {};
    const requirements = await Requirement.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return Response.json({ requirements });
  } catch (error) {
    console.error("Unable to list requirements", error);
    if (error.name === "MongooseServerSelectionError") {
      return Response.json({ message: "Unable to connect to the database. Check MongoDB Atlas network access and MONGODB_URI." }, { status: 503 });
    }
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
