import { users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { generateUsername } from "unique-username-generator";

export async function POST(request: Request) {
  const { email, name } = await request.json();

  try {
    await db.insert(users).values({
      email: email,
      name: generateUsername(),
    });

    return Response.json("successs");
  } catch (err) {
    console.error(err);
    return Response.json("Error processing image."); // error
  }
}

export async function GET(request: Request) {
  return Response.json("email API");
}
