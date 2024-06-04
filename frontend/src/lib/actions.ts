"use server";

import { users } from "../drizzle/schema";
import { db } from "./db";
import { generateUsername } from "unique-username-generator";

export const addEmail = async (email: string) => {
  console.log(db);
  console.log("email action", email);
  try {
    await db.insert(users).values({
      email: email,
      name: generateUsername(),
    });
    console.log("succs");
    return "success";
  } catch (e) {
    console.log("Error,", e);
    return "error";
  }
};
