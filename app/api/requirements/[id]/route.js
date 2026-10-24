import { connectToDatabase } from "@/lib/mongodb";
import { Requirement } from "@/models/Requirement";

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const requirement = await Requirement.findById(id).lean();
    if (!requirement) return Response.json({ message: "Requirement not found" }, { status: 404 });
    return Response.json({ requirement });
  } catch (error) {
    if (error.name === "CastError") {
      return Response.json({ message: "Invalid requirement ID" }, { status: 400 });
    }
    if (error.name === "MongooseServerSelectionError") {
      return Response.json({ message: "Unable to connect to the database. Check MongoDB Atlas network access and MONGODB_URI." }, { status: 503 });
    }
    console.error("Unable to get requirement", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
