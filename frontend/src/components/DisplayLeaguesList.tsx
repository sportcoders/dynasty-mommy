import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from "@mui/material";
import type { League } from "@services/sleeper";
import { DisplayAvatar } from "./DisplayAvatar";

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
    leagues: League[];
    displayAvatar: boolean;
    onLeagueClick: (league_id: string) => void;
    loggedIn: boolean;
    saveDelete?: {
        saveLeague: (league_id: string) => Promise<boolean>;
        deleteLeague: (league_id: string) => Promise<boolean>;
        userLeagues: string[];
    };
    stylingOptions?: {
        background_color?: string;
        show_border?: boolean,
        fontSize?: string,
        fontWeight?: string,
        padding?: string,
        border_radius?: string,
        text_color?: string,
    };

}

export function DisplayLeaguesList({ leagues,
    onLeagueClick,
    displayAvatar = true,
    loggedIn = false,
    saveDelete,
    stylingOptions = {} }: displayLeaguesListProps) {
    /**
     * @returns List component that displays all leagues it was passed
     */
    return (
        <List sx={{ p: 0 }}>
            {leagues.map((league) => (
                <ListItem key={league.league_id}
                    onClick={() => onLeagueClick(league.league_id)}
                    sx={{
                        mb: 1,
                        borderRadius: stylingOptions.border_radius || 2,
                        p: stylingOptions.padding || 2,
                        px: 1,
                        backgroundColor: stylingOptions.background_color || 'background.default',
                        backdropFilter: 'blur(10px)',
                        border: stylingOptions.show_border ? '1px solid' : '',
                        borderColor: 'divider',
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12) ',
                            color: '#1976d2 ',
                            cursor: 'pointer'
                            // borderColor: 'rgba(25, 118, 210, 0.3)',
                            // border: '1px solid rgba(25, 118, 210, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                        '&.MuiButton-root': {
                            textAlign: 'left',
                            alignItems: 'center',
                            width: '100%'
                        }
                    }}
                    secondaryAction={loggedIn && saveDelete ? (
                        <IconButton
                            edge="end"
                            aria-label="add"
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (saveDelete.userLeagues.includes(league.league_id))
                                    saveDelete.deleteLeague(league.league_id);
                                else
                                    saveDelete.saveLeague(league.league_id);
                            }}
                        >
                            {saveDelete.userLeagues.includes(league.league_id) ?
                                <RemoveCircle /> : <AddCircle />}
                        </IconButton>) : null
                    }
                >
                    {displayAvatar && (
                        <ListItemAvatar>
                            <DisplayAvatar
                                avatar_url={league.avatar}
                                size={48}
                                platform="sleeper"
                            />
                        </ListItemAvatar>
                    )}
                    <Tooltip title={league.name} arrow>
                        <ListItemText
                            primary={league.name}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: stylingOptions.fontWeight || 500,
                                    fontSize: stylingOptions.fontSize || '1.1rem',
                                    transition: 'color 0.3s ease',
                                    color: stylingOptions.text_color || 'text.primary',
                                },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                                minWidth: 0,
                                whiteSpace: 'nowrap'
                            }}
                        />
                    </Tooltip>
                </ListItem>
            ))}
        </List>
    );
}