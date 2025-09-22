import browser from "webextension-polyfill";
import { ExtensionMessage, ExtensionResponse, ESPNCookies } from "../types";

browser.runtime.onMessage.addListener(
    async (rawMessage: unknown): Promise<ExtensionResponse> => {
        const message = rawMessage as ExtensionMessage;

        if (message.type === "GET_COOKIES") {
            try {
                const swid = await browser.cookies.get({
                    url: "https://www.espn.com",
                    name: "SWID",
                });

                const espn_s2 = await browser.cookies.get({
                    url: "https://www.espn.com",
                    name: "espn_s2",
                });

                const cookies: ESPNCookies = {
                    swid: swid?.value ?? null,
                    espn_s2: espn_s2?.value ?? null,
                    isValid: !!(swid && espn_s2),
                };

                return { success: true, cookies };
            } catch (err) {
                return { success: false, error: (err as Error).message };
            }
        }

        if (message.type === "SYNC_TEAM") {
            return {
                success: true,
                syncedTeam: {
                    leagueId: message.leagueId,
                    timestamp: Date.now(),
                },
            };
        }

        return { success: false, error: "Unknown message type" };
    }
);
