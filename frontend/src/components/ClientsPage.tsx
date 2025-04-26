import { FC, useState } from "react";
import { Page, User } from "../types";
import { Container, List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { Email } from "@mui/icons-material";
import EmailForm from "./EmailForm";

interface ClientsPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}
const ClientsPage: FC<ClientsPageProps> = ({user}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const handleEmailClick = (email: string) => {
        setSelectedEmail(email);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmail("");
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
        <EmailForm
            open={openDialog}
            onClose={handleCloseDialog}
            recipientEmail={selectedEmail}
        />
    </Container>
}

export default ClientsPage;
