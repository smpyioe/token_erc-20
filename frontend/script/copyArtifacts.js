// scripts/copyArtifacts.js
import fs from "fs";
import path from "path";



function copyArtifacts(source,destination){
  console.log(destination);
  console.log(source);
  try {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
    console.log(" Token.json copied to frontend/src/artifacts/");
  } catch (error) {
    console.error(" Error copying artifact:", error);
    process.exit(1);
  }
}


const sourcetoken = path.resolve("../backend/out/Token.sol/Token.json");
const destinationtoken = path.resolve("../frontend/src/artifacts/Token.json");
copyArtifacts(sourcetoken,destinationtoken);



const sourcetokenFactory = path.resolve("../backend/out/TokenFactory.sol/TokenFactory.json");
const destinationtokenFactory = path.resolve("../frontend/src/artifacts/TokenFactory.json");
copyArtifacts(sourcetokenFactory,destinationtokenFactory);