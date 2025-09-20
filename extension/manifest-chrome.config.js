import { defineManifest } from "@crxjs/vite-plugin";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd());
const SERVER_BASE_URL = env.VITE_SERVER_URL;

export default defineManifest({
    manifest_version: 3,

    name: "Dynasty Mommy ESPN League Sync",
    version: "1.0.0",
    description: "Syncs ESPN League to Dynasty Mommy Account",

    permissions: ["cookies", "activeTab", "storage", "tabs"],
    host_permissions: [
        "https://*.espn.com/*",
        `${SERVER_BASE_URL}/*`
    ],

    action: {
        default_popup: "index.html",
        default_title: "Dynasty Mommy ESPN League Sync",
    },

    background: {
        service_worker: "src/background/index.ts",
        type: "module",
    },
});
