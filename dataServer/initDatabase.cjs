const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "db.json");
console.log("🚀 ~ __dirname:", __dirname);

function initDatabase() {
  console.log("=======================================");
  console.log("🛠️  Starting database initialization...");

  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
    console.log("🗑️  db.json file removed.");
    console.log("---------------------------------------");
  }

  const initialData = {
    messages: [],
    users: [],
  };

  fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2));
  console.log("✅ db.json file recreated with empty messages list.");

  console.log("🎉 Database initialization complete.");
  console.log("=======================================");
}

initDatabase();
