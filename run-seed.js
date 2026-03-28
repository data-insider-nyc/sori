const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the seed SQL file
const fs = require("fs");
const seedSql = fs.readFileSync("./SEED_COMMUNITY_DATA.sql", "utf-8");

async function runSeed() {
  try {
    console.log("🌱 Running seed data...");
    
    // Execute the SQL
    const { error } = await supabase.rpc("sql_execute", {
      sql: seedSql,
    });

    if (error) {
      // RPC might not exist, try direct query
      console.log("Trying direct query execution...");
      const result = await supabase.functions.invoke("seed-data", {
        body: { sql: seedSql },
      });
      console.log("Result:", result);
    } else {
      console.log("✅ Seed data applied successfully!");
    }
  } catch (err) {
    console.error("Error running seed:", err.message);
  }
}

runSeed();
