import { db } from "@/db";
import { sql } from "drizzle-orm";
import ResourcesClient from "./resources-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resources / রিসোর্স | Digital Seba",
  description: "Access all Digital Seba resources, documents, and materials",
};

export default async function ResourcesPage() {
  await db.execute(sql`select 1`);

  return <ResourcesClient />;
}
