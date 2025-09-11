import { build } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

console.log("Building incident reporting system...");

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

    // Set environment variables for the build process
    Object.assign(process.env, envVars);
    console.log("Environment variables loaded:", Object.keys(envVars));
} catch (error) {
    console.warn("Could not load .env file:", error);
}

// Build the frontend bundle
await build({
    entrypoints: ["./src/frontend.tsx"],
    outdir: "./dist",
    target: "browser",
    minify: true,
    sourcemap: "external",
    splitting: true,
    format: "esm",
    external: ["react", "react-dom", "react-router-dom"],
    define: {
        "import.meta.env": JSON.stringify({
            VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
            VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
        }),
        "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL || ""),
        "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ""),
    },
});

// Build the server bundle
await build({
    entrypoints: ["./src/server.tsx"],
    outdir: "./dist",
    target: "bun",
    minify: true,
    sourcemap: "external",
    format: "esm",
});

console.log("Build completed successfully!");
