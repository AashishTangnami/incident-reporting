import { serve } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
let envVars: Record<string, string> = {};
try {
    const envContent = readFileSync(join(process.cwd(), ".env"), "utf-8");
    envVars = envContent
        .split("\n")
        .filter(line => line.trim() && !line.startsWith("#"))
        .reduce((acc, line) => {
            const [key, ...valueParts] = line.split("=");
            if (key && valueParts.length > 0) {
                acc[key.trim()] = valueParts.join("=").trim();
            }
            return acc;
        }, {} as Record<string, string>);

    Object.assign(process.env, envVars);
    console.log("Environment variables loaded:", Object.keys(envVars));
} catch (error) {
    console.warn("Could not load .env file:", error);
}

const server = serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        // Serve the main HTML file
        if (url.pathname === "/" || url.pathname === "/login" || url.pathname === "/dashboard" || url.pathname === "/report") {
            try {
                const htmlPath = join(process.cwd(), "src", "index.html");
                const html = readFileSync(htmlPath, "utf-8");
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            } catch (error) {
                return new Response("Error loading page", { status: 500 });
            }
        }

        // Serve processed CSS
        if (url.pathname === "/styles.css") {
            try {
                const cssPath = join(process.cwd(), "dist", "styles.css");
                const css = readFileSync(cssPath, "utf-8");
                return new Response(css, {
                    headers: {
                        "Content-Type": "text/css",
                    },
                });
            } catch (error) {
                console.error('CSS serving error:', error);
                return new Response("CSS not found", { status: 404 });
            }
        }

        // Serve static assets
        if (url.pathname.startsWith("/src/")) {
            try {
                const filePath = join(process.cwd(), url.pathname);
                const ext = url.pathname.split('.').pop() || '';

                // Handle TypeScript/TSX files by transpiling them
                if (ext === 'tsx' || ext === 'ts') {
                    try {
                        const transpiled = await Bun.build({
                            entrypoints: [filePath],
                            target: 'browser',
                            format: 'esm',
                            define: {
                                "import.meta.env": JSON.stringify({
                                    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
                                    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
                                }),
                                "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL || ""),
                                "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ""),
                            },
                        });

                        const output = await transpiled.outputs[0].text();
                        return new Response(output, {
                            headers: {
                                "Content-Type": "application/javascript",
                            },
                        });
                    } catch (buildError) {
                        console.error('Build error:', buildError);
                        const errorMessage = buildError instanceof Error ? buildError.message : String(buildError);
                        return new Response(`Build error: ${errorMessage}`, { status: 500 });
                    }
                }

                // Handle other static files
                const file = readFileSync(filePath);
                const contentType = {
                    'js': 'application/javascript',
                    'css': 'text/css',
                    'svg': 'image/svg+xml',
                    'png': 'image/png',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'gif': 'image/gif',
                    'ico': 'image/x-icon',
                }[ext] || 'text/plain';

                return new Response(file, {
                    headers: {
                        "Content-Type": contentType,
                    },
                });
            } catch (error) {
                console.error('File serving error:', error);
                return new Response("File not found", { status: 404 });
            }
        }

        // API routes
        if (url.pathname.startsWith("/api/")) {
            return new Response(JSON.stringify({ message: "API endpoint" }), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        return new Response("Not found", { status: 404 });
    },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
