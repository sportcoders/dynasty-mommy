import { NextFunction, Request as ExpressRequest, Response } from "express";

import { AppDataSource } from "../app";
import { EspnCookies } from "../models/espn_cookies";

import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { EspnLeague } from "../models/espn_league";
import { EspnRequest } from "../middleware/espn_authenticate";

// Sub-type for FBA Type
interface FBASubSeason {
    abbrev: string;
    active: boolean;
    currentScoringPeriod: {
        id: number;
    };
    display: boolean;
    displayOrder: number;
    endDate: number;
    gameId: number;
    id: number;
    name: string;
    startDate: number;
}

// Type for ESPN Fantasy Men's Basketball Response Object
interface FBA {
    abbrev: string;
    active: boolean;
    currentSeason: FBASubSeason;
    currentSeasonId: number;
    display: boolean;
    displayOrder: number;
    id: number;
    name: string;
    proSportAbbrev: string;
    proSportName: string;
}


/**
 * Gets the current season year of the ESPN Fantasy Basketball Season.
 * 
 * @returns the current season year
 */
async function fetchCurrentEspnSeasonYear() {
    const url = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba";

    const response = await fetch(url);

    if (!response.ok) {
        throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "Failed to fetch Espn Fantasy Basketball Info" });
    }

    const data: FBA = await response.json();

    return data.currentSeasonId;
}

/**
 * Helper function to make API calls
 * 
 * @param method - GET or POST
 * @param url - The endpoint url  
 * @param cookies - The ESPN Cookies
 * @param postData - Any data needed for POST request
 * 
 * @returns A JSON response of the ESPN API request
 */
async function api(method: "GET" | "POST", url: string, cookies: EspnCookies, postData?: any) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cookie": `espn_s2=${cookies.espn_s2}; SWID=${cookies.swid}`,
        "Accept": "application/json",
    };

    const response = await fetch(url, {
        method,
        headers,
        body: method === "POST" && postData ? JSON.stringify(postData) : undefined,
    });

    if (!response.ok) {
        throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "ESPN API request failed" });
    }

    return response.json();
}

/**
 * Saves or updates a user's ESPN authentication cookies in the database.
 *
 * @remarks
 * This function ensures that each user has only one cookie record.
 * - If no record exists for the given userId, a new one is created.
 * - If a record already exists, it is updated with the latest values.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns A JSON response with a success message when cookies are saved
 */
export async function saveEspnCookies(req: ExpressRequest, res: Response) {
    const userId = req.user!.user_id;
    const { swid, espn_s2 } = req.body;

    const repo = AppDataSource.getRepository(EspnCookies);

    let cookies = await repo.findOneBy({ userId });
    const lastUpdated = new Date(Date.now());

    if (!cookies) {
        cookies = repo.create({ userId, swid, espn_s2, lastUpdated });
    } else {
        cookies.swid = swid;
        cookies.espn_s2 = espn_s2;
        cookies.lastUpdated = new Date(Date.now());
    }

    await repo.save(cookies);

    res.status(HttpSuccess.OK).json({ message: "ESPN account linked sucessfully." });
}

/**
 * Checks the user's synced ESPN account status.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns A JSON response with a boolean or if the user is synced 
 */
export async function getEspnStatus(req: ExpressRequest, res: Response) {
    const userId = req.user!.user_id;

    const repo = AppDataSource.getRepository(EspnCookies);
    let cookies = await repo.findOneBy({ userId });

    res.status(HttpSuccess.OK).json({
        isSynced: !!cookies,
    });
}

/**
 * Saves ESPN League.
 *
 * @param req - EspnRequest (must have req.espnCookies from middleware)
 * @param res - Express response object
 *
 * @returns A JSON response with a success message when league is saved
 */
export async function saveEspnLeague(req: EspnRequest, res: Response) {
    const userId = req.user!.user_id;
    const { league_id } = req.body;

    if (!req.espnCookies) {
        throw new AppError({
            statusCode: HttpError.UNAUTHORIZED,
            message: "ESPN account is not synced"
        });
    }

    const leagueRepo = AppDataSource.getRepository(EspnLeague);

    await leagueRepo.save({
        userId: userId,
        leagueId: league_id
    });

    res.status(HttpSuccess.OK).json({ message: "ESPN League saved successfully" });
}

// TODO
export async function getSavedEspnLeagues(req: EspnRequest, res: Response) {
    const userId = req.user!.user_id;
    const leagueRepo = AppDataSource.getRepository(EspnLeague);

    const leagues = await leagueRepo.find({ where: { userId } });

    res.status(HttpSuccess.OK).json({ leagues });
}

/**
 * Gets ESPN League Info — includes league settings, teams, rosters, matchups, etc.
 * 
 * @remarks
 * - To use this function there must be a user auth token and espn cookies
 * - ESPN cookies must be valid for the given league id
 * - Season year will always be the current year
 * - Game will always be fba = fantasy men basketball
 * - One league id can have multiple seasons
 * 
 * @param req - EspnRequest (must have req.espnCookies from middleware)
 * @param res - Express response object
 *
 * @returns JSON response with league info
 */
export async function getEspnLeagueInfo(req: EspnRequest, res: Response) {
    if (!req.espnCookies) {
        throw new AppError({
            statusCode: HttpError.UNAUTHORIZED,
            message: "ESPN cookies not found"
        });
    }

    const { leagueId } = req.body;
    const seasonYear = await fetchCurrentEspnSeasonYear();

    const views = [
        "mTeam",
        "mRoster",
        "mSettings",
    ];

    const url =
        `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${seasonYear}/segments/0/leagues/${leagueId}?` +
        views.map(v => `view=${v}`).join("&");

    const data = await api("GET", url, req.espnCookies);

    const leagueInfo = {
        id: data.id,
        name: data.settings?.name,
        scoringPeriod: data.settings?.scoringPeriodId,
        rosterSettings: data.settings?.rosterSettings,
        draftSettings: data.settings?.draftSettings
    };

    res.status(HttpSuccess.OK).json({ league: leagueInfo });
}

/**
 * Get teams
 */
// export async function getEspnTeams(req: EspnRequest, res: Response) {
//     const { leagueId } = req.params;
//     const seasonYear = await fetchCurrentEspnSeasonYear();

//     const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${seasonYear}/segments/0/leagues/${leagueId}?view=mTeam`;

//     const data = await api("GET", url, req.espnCookies!);

//     const teams = data.teams.map((team: any) => ({
//         teamId: team.id,
//         name: team.name,
//         wins: team.record?.overall?.wins || 0,
//         losses: team.record?.overall?.losses || 0,
//         logoUrl: team.logo || null
//     }));

//     res.status(HttpSuccess.OK).json({ teams });
// }

/**
 * Get rosters/players
 *
 */
// export async function getEspnRosters(req: EspnRequest, res: Response) {
//     const { leagueId } = req.params;
//     const seasonYear = await fetchCurrentEspnSeasonYear();

//     const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${seasonYear}/segments/0/leagues/${leagueId}?view=mRoster`;

//     const data = await api("GET", url, req.espnCookies!);

//     const rosters = data.teams.map((team: any) => ({
//         teamId: team.id,
//         teamName: team.location + " " + team.nickname,
//         players: team.roster?.entries?.map((entry: any) => ({
//             fullName: entry.playerPoolEntry?.player?.fullName,
//             mainPosition: entry.playerPoolEntry?.player?.defaultPositionId
//         })) || []
//     }));

//     res.status(HttpSuccess.OK).json({ rosters });
// }

/**
 * Get transactions (waiver adds & drops + trades)
 *
 */
// export async function getEspnTransactions(req: EspnRequest, res: Response) {
//     const { leagueId } = req.params;
//     const seasonYear = await fetchCurrentEspnSeasonYear();

//     const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${seasonYear}/segments/0/leagues/${leagueId}?view=mPendingTransactions`;

//     const data = await api("GET", url, req.espnCookies!);

//     const transactions = data.pendingTransactions?.map((tx: any) => {
//         const type = tx.type;
//         const timestamp = tx.date;
//         const teamId = tx.teamId;
//         const playerInfo = tx.entries?.map((entry: any) => ({
//             fullName: entry.playerPoolEntry?.player?.fullName,
//             mainPosition: entry.playerPoolEntry?.player?.defaultPositionId
//         }));

//         return { type, timestamp, teamId, players: playerInfo, ...tx };
//     }) || [];

//     res.status(HttpSuccess.OK).json({ transactions });
// }



