// /actions/feedback.js

import { db } from "@/lib/db"; // your Drizzle / Neon setup
import { feedback } from "@/lib/schema"; // your database schema

export async function getFeedbackByInterviewId(interviewId) {
  const feedbackData = await db
    .select()
    .from(feedback)
    .where(eq(feedback.interviewId, interviewId)); // import eq from drizzle

  return feedbackData;
}
