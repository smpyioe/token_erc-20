// scripts/copyArtifacts.js
import fs from "fs";
import path from "path";

const source = path.resolve("../backend/out/Token.sol/Token.json");
console.log(source);
const destination = path.resolve("../frontend/src/artifacts/Token.json");
console.log(destination);
try {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  console.log(" Token.json copied to frontend/src/artifacts/");
} catch (error) {
  console.error(" Error copying artifact:", error);
  process.exit(1);
}
