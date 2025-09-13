import React from 'react';
import { ESPNCookies } from '../types';
import { CopyButton } from './CopyButton';
import { CookieExtractor } from '../utils/cookieExtractor';

interface CookieDisplayProps {
    cookies: ESPNCookies;
}

export const CookieDisplay: React.FC<CookieDisplayProps> = ({ cookies }) => {
    if (!cookies.isValid) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">No valid cookies found. Please make sure you're logged in to ESPN Fantasy Football.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-yellow-400">SWID</h3>
                <div className="bg-black/20 p-3 rounded border-l-4 border-green-400 font-mono text-sm break-all">
                    {cookies.swid}
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-yellow-400">ESPN_S2</h3>
                <div className="bg-black/20 p-3 rounded border-l-4 border-green-400 font-mono text-sm break-all">
                    {cookies.espn_s2}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <CopyButton
                    text={CookieExtractor.formatForJSON(cookies)}
                    label="JSON"
                />
                <CopyButton
                    text={CookieExtractor.formatForEnv(cookies)}
                    label="ENV"
                />
            </div>

            <div className="text-xs text-gray-400 text-center">
                Extracted: {new Date(cookies.extractedAt).toLocaleString()}
            </div>
        </div>
    );
};
