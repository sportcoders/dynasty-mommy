import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
    manifest_version: 3,
    name: "Dynasty Mommy ESPN League Sync",
    version: "1.0.0",
    description: "Syncs ESPN League to Dynasty Mommy Account",
    permissions: [
        "cookies",
        "activeTab",
        "storage"
    ],
    host_permissions: [
        "https://*.espn.com/*"
    ],
    action: {
        default_popup: "index.html",
        default_title: "Dynasty Mommy ESPN League Sync",
    },
    background: {
        service_worker: "src/background/index.ts",
        type: "module"
    },
    content_scripts: [
        {
            matches: ["https://*.espn.com/*"],
            js: ["src/content/index.ts"],
            run_at: "document_idle"
        }
    ],
})