import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import type { League } from "../services/sleeper"

interface displayLeaguesListProps {
    /**
     * leagues:
     *   array of type leagues, used to map over in function
     * onLeaugeClick:
     *   function/action to be done when the user clicks on a leauge
     *   function exists in the parent component with the parent component handling the logic
     * displayAvatar:
     *   optional parameter for styling, enables and disables displaying of avatar
     *   leave empty if avatar should not be displayed
     */
    leagues: League[]
    displayAvatar?: boolean
    onLeagueClick: (league_id: string) => void
}
export function DisplayLeaguesList({ leagues, onLeagueClick, displayAvatar }: displayLeaguesListProps) {
    /**
     * @returns List component that displays all leagues it was passed
     */
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