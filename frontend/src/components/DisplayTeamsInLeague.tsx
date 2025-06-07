import { CircularProgress, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { getTeamInfo } from "@services/sleeper";
import type { TeamInfo } from "@services/sleeper";
interface DisplayTeamsInLeaugeProps {
    league_id: string,
    onTeamClick: (team_id: string) => void,
    displayAvatar?: boolean,
    displayRecord?: boolean
}

export default function DisplayTeamsInLeauge({ league_id, onTeamClick, displayAvatar }: DisplayTeamsInLeaugeProps) {
    const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const [error, setError] = useState("")
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await getTeamInfo(league_id)
                console.log(res)
                if (res)
                    setTeams(res)
                setError("")
            }
            catch (e) {
                setError("An error occured")
            }
        }
        fetchTeams()
    }, [])
    if (!teams) return <CircularProgress />
    return (
        <List>
            {teams!.map((team) =>
            (
                <ListItem>
                    <ListItemButton sx={{ borderRadius: 5 }} onClick={() => onTeamClick("teamid")} key={team.user_id}>
                        <ListItemAvatar>
                            {/* {displayAvatar && <Avatar src={team.avatar && team.avatar}></Avatar>} */}
                        </ListItemAvatar>
                        <ListItemText
                            primary={team.display_name}
                            secondary={true ? `${team.record.wins} - ${team.record.ties} - ${team.record.losses}` : undefined}
                        ></ListItemText>
                    </ListItemButton>
                </ListItem>
            )
            )
            }
        </List>

    )
}