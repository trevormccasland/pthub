import { FC, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material";
import { User, UserRole } from "../types";
import { useUserGroups } from "../hooks/users";
import EmailForm from "./EmailForm";
import { Email } from "@mui/icons-material";

interface TrainerGridProps {
    user: User;
}

const TrainerGrid: FC<TrainerGridProps> = ({ user }) => {
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
    const userGroups = useUserGroups()
    const trainers = userGroups[UserRole.TRAINER].filter((trainer) => trainer.id !== user.id);

    return (
        <Box sx={{ padding: 2 }}>
            <Grid container spacing={3}>
                {trainers.map((trainer) => (
                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3 }} key={trainer.id}>
                        <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                            <CardMedia
                                component='iframe'
                                height="200"
                                src={`https://www.instagram.com/${trainer.instagramHandle}/embed`}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {`${trainer.firstName} ${trainer.lastName}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email:
                                    <IconButton onClick={() => handleEmailClick(trainer.email)} >
                                        <Email />
                                    </IconButton>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active: {trainer.isActive ? "Yes" : "No"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <EmailForm
                open={openDialog}
                onClose={handleCloseDialog}
                recipientEmail={selectedEmail}
            />
        </Box>
    );
};

export default TrainerGrid;