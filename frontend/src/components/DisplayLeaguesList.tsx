import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import type { League } from "../services/sleeper"

interface displayLeaguesListProps {
    leagues: League[]
    displayAvatar?: boolean
    onLeagueClick: (league_id: string) => void
}
export function DisplayLeaguesList({ leagues, onLeagueClick, displayAvatar }: displayLeaguesListProps) {
    return (
        <List>
            {leagues.map((league) =>
            (
                <ListItem>
                    <ListItemButton sx={{ borderRadius: 5 }} onClick={() => onLeagueClick(league.league_id)} key={league.league_id}>
                        <ListItemAvatar>
                            {displayAvatar && <Avatar src={league.avatar && league.avatar}></Avatar>}
                        </ListItemAvatar>
                        <ListItemText
                            primary={league.name}
                        ></ListItemText>
                    </ListItemButton>
                </ListItem>
            )
            )
            }
        </List>
    )
}