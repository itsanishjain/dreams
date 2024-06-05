"use server";

import { users, feedback } from "../drizzle/schema";
import { db } from "./db";
import { generateUsername } from "unique-username-generator";

export const addEmail = async (email: string) => {
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

export const addFeedback = async (text: string) => {
  try {
    await db.insert(feedback).values({
      text: text,
    });
    console.log("succs");
    return "success";
  } catch (e) {
    console.log("Error,", e);
    return "error";
  }
};
