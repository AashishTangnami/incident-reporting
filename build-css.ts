import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

console.log("Building CSS...");

try {
    // Run Tailwind CSS to process the input CSS
    execSync("npx tailwindcss -i ./src/index.css -o ./dist/styles.css --watch=false", {
        stdio: "inherit",
        cwd: process.cwd()
    });

    console.log("CSS build completed successfully!");
} catch (error) {
    console.error("CSS build failed:", error);
    process.exit(1);
}
