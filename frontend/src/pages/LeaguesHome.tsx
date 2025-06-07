import DisplayTeamsInLeauge from "@components/DisplayTeamsInLeague";

export default function LeagueHome() {
    return (
        <DisplayTeamsInLeauge league_id={'1206147191521935360'} onTeamClick={(team_id: string) => console.log(team_id)} />
    )
}