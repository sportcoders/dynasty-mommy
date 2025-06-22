import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import type { League } from "@services/sleeper"

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
        <List sx={{ p: 0 }}>
            {leagues.map((league) => (
                <ListItem key={league.league_id} sx={{ p: 0, mb: 1 }}>
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'rgba(224, 224, 224, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.8)',
                                backdropFilter: 'blur(15px)',
                                color: 'white',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                                borderColor: 'rgba(33, 150, 243, 0.5)',
                                '& .MuiListItemText-primary': {
                                    color: 'white'
                                },
                                '& .MuiAvatar-root': {
                                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.4)'
                                }
                            },
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onLeagueClick(league.league_id)}
                    >
                        <ListItemAvatar>
                            {displayAvatar && (
                                <Avatar
                                    src={league.avatar}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        border: '2px solid',
                                        borderColor: 'rgba(224, 224, 224, 0.4)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                    }}
                                />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={league.name}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    transition: 'color 0.3s ease'
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}