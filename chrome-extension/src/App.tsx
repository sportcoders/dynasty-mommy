import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { ESPNCookies, ExtensionMessage, ExtensionResponse } from "./types";
import { StatusIndicator } from "./components/StatusIndicator";
import { CookieDisplay } from "./components/CookieDisplay";
import { RefreshCw } from "lucide-react";

export const App: React.FC = () => {
  const [cookies, setCookies] = useState<ESPNCookies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isESPNPage, setIsESPNPage] = useState(false);

  useEffect(() => {
    checkCurrentPage();
  }, []);

  const checkCurrentPage = async () => {
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      setIsESPNPage(tab.url?.includes("espn.com") || false);
    } catch (error) {
      console.error("Failed to check current page:", error);
    }
  };

  const extractCookies = async () => {
    setLoading(true);
    setError(null);
    setCookies(null);

    try {
      const message: ExtensionMessage = { type: "GET_COOKIES" };
      const response: ExtensionResponse = await browser.runtime.sendMessage(message);

      if (response.success && response.cookies) {
        if (!response.cookies.isValid) {
          setError(
            isESPNPage
              ? "No valid ESPN cookies found. Please make sure you are logged into ESPN."
              : "No valid ESPN cookies found. Please navigate to ESPN Fantasy Football and log in."
          );
          return;
        }
        setCookies(response.cookies);
      } else {
        setError(response.error || "Failed to extract cookies.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const syncTeam = async (leagueId: string) => {
    try {
      const message: ExtensionMessage = { type: "SYNC_TEAM", leagueId };
      const response: ExtensionResponse = await browser.runtime.sendMessage(message);

      if (response.success && response.syncedTeam) {
        console.log(
          `✅ Synced league ${response.syncedTeam.leagueId} at ${new Date(
            response.syncedTeam.timestamp
          ).toLocaleTimeString()}`
        );
      } else {
        console.error("❌ Sync failed:", response.error);
      }
    } catch (err) {
      console.error("❌ Sync error:", err);
    }
  };

  return (
    <div className="w-96 min-h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">ESPN Cookie Extractor</h1>
        <p className="text-sm opacity-80">Extract SWID & ESPN_S2 values</p>
      </div>

      <div className="glass rounded-lg p-4 mb-4">
        <StatusIndicator
          status={isESPNPage ? "online" : "warning"}
          text={isESPNPage ? "ESPN page detected" : "Navigate to ESPN Fantasy Football"}
        />
      </div>

      {!isESPNPage && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm">
            🔍 Please navigate to ESPN Fantasy Football and log in to extract cookies.
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={extractCookies}
          disabled={loading || !isESPNPage}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Extracting..." : "Extract Cookies"}
        </button>
        <button
          onClick={() => syncTeam("12345")} // example leagueId
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded-lg font-semibold transition-all"
        >
          🔄 Sync Team
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {cookies && <CookieDisplay cookies={cookies} />}

      {cookies && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
          <p className="text-green-400 text-sm">
            ✅ Cookies extracted successfully! Use the copy buttons above to get your values.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
