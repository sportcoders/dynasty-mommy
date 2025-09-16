import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useUnlinkAccount from '../hooks/useUnlinkAccount';

type YahooUnlinkAccountAlertProps = {
    open: boolean;
    handleClose: () => void;
};
export default function YahooUnlinkAccountAlert({ open, handleClose }: YahooUnlinkAccountAlertProps) {
    const { mutate: unlink } = useUnlinkAccount();


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Unlink Yahoo Account
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description"
                    sx={{
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        color: 'text.primary'
                    }}
                >
                    Unlinking your Yahoo Account will permanently delete all saved Yahoo leagues
                    and associated data. This action cannot be undone.
                    {/* Do you Wish To Continue? */}
                </DialogContentText>

                <DialogContentText
                    sx={{
                        fontSize: '1.1rem',
                        pt: 2,
                        fontWeight: 'bold'
                    }}
                >
                    Are you sure you want to continue?
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}
                    variant="outlined"
                    size="large"
                >Cancel</Button>
                <Button onClick={() => {
                    unlink();
                    handleClose();
                }}
                    variant="contained"
                    color="warning"
                    size="large"
                    autoFocus>
                    Unlink
                </Button>
            </DialogActions>
        </Dialog>

    );
}