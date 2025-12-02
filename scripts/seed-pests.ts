import { drizzle } from "drizzle-orm/mysql2";
import { pests } from "../drizzle/schema";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = drizzle(process.env.DATABASE_URL!);

async function seedPests() {
  console.log("Starting pest data migration...");
  
  // Read the JSON file
  const jsonPath = join(__dirname, "../client/src/data/pests.json");
  const pestsData = JSON.parse(readFileSync(jsonPath, "utf-8"));
  
  console.log(`Found ${pestsData.length} pests to migrate`);

  let successCount = 0;
  let errorCount = 0;

  for (const pest of pestsData) {
    try {
      await db.insert(pests).values({
        title: pest.Title,
        latin: pest.Latin || null,
        alsoKnownAs: typeof pest.AlsoKnownAs === "string" ? pest.AlsoKnownAs : null,
        keywords: pest.keywords ? pest.keywords.substring(0, 500) : null,
        pestGroups: pest.pestgroups ? pest.pestgroups.substring(0, 500) : null,
        pestTypes: pest.pesttypes ? pest.pesttypes.substring(0, 500) : null,
        managementApproaches: pest.managementapproaches ? pest.managementapproaches.substring(0, 500) : null,
        alert: pest.Alert || false,
        pinned: pest.Pinned || false,
        visible: pest.visible !== false, // Default to true if not specified
        featuredImage: pest.FeaturedImage || null,
        link: pest.Link || null,
      });
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`Migrated ${successCount} pests...`);
      }
    } catch (error: any) {
      errorCount++;
      console.error(`Error migrating pest "${pest.Title}":`, error.message);
    }
  }

  console.log("\n=== Migration Complete ===");
  console.log(`✓ Successfully migrated: ${successCount} pests`);
  console.log(`✗ Failed: ${errorCount} pests`);
  
  process.exit(0);
}

seedPests().catch((error) => {
  console.error("Fatal error during migration:", error);
  process.exit(1);
});
