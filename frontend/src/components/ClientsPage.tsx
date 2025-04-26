import { FC, useState } from "react";
import { Page, User } from "../types";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from "@mui/material";
import { Email } from "@mui/icons-material";
import emailServiceClient from "../services/emailServiceClient";

interface ClientsPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}
const ClientsPage: FC<ClientsPageProps> = ({user}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const [emailContent, setEmailContent] = useState({
        subject: "",
        body: "",
    });
    const handleEmailClick = (email: string) => {
        setSelectedEmail(email);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmail("");
        setEmailContent({ subject: "", body: "" });
    };
    const handleSendEmail = () => {
        const callSendEmail = async () => {
            // TODO: Replace with actual email sending logic
            const mailtoLink = `mailto:${selectedEmail}?subject=${encodeURIComponent(
                emailContent.subject
            )}&body=${encodeURIComponent(emailContent.body)}`;
            window.location.href = mailtoLink;        }
        callSendEmail().then((message) => {
            console.log(message);
        }).catch((error) => {
            console.error("Error sending email:", error);
        });
        // Add logic to send the email via an API or email service
        handleCloseDialog();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEmailContent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return <Container>
        <Stack>
            <List>
                {user.clients.map((client) => (
                    <ListItem key={client.id}>
                        <ListItemText primary={`${client.firstName} ${client.lastName}`} secondary={client.email} />
                        <ListItemIcon sx={{ marginLeft: 'auto' }} onClick={() => handleEmailClick(client.email)}>
                            <Email />
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>
        </Stack>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Send Email to {selectedEmail}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Subject"
                        name="subject"
                        value={emailContent.subject}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Body"
                        name="body"
                        value={emailContent.body}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendEmail} color="primary" variant="contained">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
    </Container>
}

export default ClientsPage;
