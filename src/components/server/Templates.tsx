import { db } from "@/lib/db";
import TemplatePop from "../TemplatePop";

export default async function Templates() {
  // Fetch templates from database
  const templates = await db.query.templates.findMany({
    columns: {
      metadata: true,
      metadataText: true,
    },
  });
  return <TemplatePop templates={templates} />;
}
