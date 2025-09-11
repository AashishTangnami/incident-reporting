import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
try {
    const envContent = readFileSync(join(process.cwd(), ".env"), "utf-8");
    const envVars = envContent
        .split("\n")
        .filter(line => line.trim() && !line.startsWith("#"))
        .reduce((acc, line) => {
            const [key, ...valueParts] = line.split("=");
            if (key && valueParts.length > 0) {
                acc[key.trim()] = valueParts.join("=").trim();
            }
            return acc;
        }, {} as Record<string, string>);

    // Set environment variables for the process
    Object.assign(process.env, envVars);
    console.log("Environment variables loaded:", Object.keys(envVars));
} catch (error) {
    console.warn("Could not load .env file:", error);
}

// Start the server with hot reload
import("./src/server.tsx");
