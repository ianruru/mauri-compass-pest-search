import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { pests } from "../drizzle/schema.js";
import pestsData from "../client/src/data/pests.json" assert { type: "json" };

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log(`Starting seed with ${pestsData.length} pests...`);

// Clear existing pests
console.log("Clearing existing pests...");
await db.delete(pests);

let successCount = 0;
let errorCount = 0;

for (const pest of pestsData) {
  try {
    await db.insert(pests).values({
      title: pest.Title || "",
      latin: pest.Latin || "",
      alsoKnownAs: pest.AlsoKnownAs || "",
      keywords: pest.keywords || "",
      pestGroups: pest.pestgroups || "",
      pestTypes: pest.pesttypes || "",
      managementApproaches: pest.managementapproaches || "",
      alert: pest.Alert === true,
      pinned: pest.Pinned === true,
      visible: pest.visible === true,
      featuredImage: pest.FeaturedImage || "",
      link: pest.Link || "",
    });
    successCount++;
    if (successCount % 10 === 0) {
      console.log(`Progress: ${successCount}/${pestsData.length}`);
    }
  } catch (error: any) {
    errorCount++;
    console.error(`Error inserting "${pest.Title}":`, error.message);
  }
}

console.log(`\n✅ Seed complete!`);
console.log(`   Success: ${successCount}`);
console.log(`   Errors: ${errorCount}`);
console.log(`   Total: ${pestsData.length}`);

await connection.end();
process.exit(0);
