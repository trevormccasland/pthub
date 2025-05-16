import { FC, useMemo } from "react";
import { Page, User, UserRole } from "../types";
import { useUserGroups } from "../hooks/users";
import { Box, Container, Typography } from "@mui/material";
import TrainerGrid from "../components/TrainerGrid";
interface TrainerPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const TrainerPage: FC<TrainerPageProps> = ({user, setPage}) => {
    const userGroups = useUserGroups()
    const [assignedTrainers, unAssignedTrainers] = useMemo(() => {
        return userGroups[UserRole.TRAINER].reduce<[User[], User[]]>((acc, trainer) => {
            if (trainer.clients.some(client => client.id === user.id)) {
                acc[0].push(trainer);
            } else {
                acc[1].push(trainer);
            }
            return acc;
        }, [[], []]);
    }, [userGroups[UserRole.TRAINER], user.id])

     return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Your Assigned Trainers
                </Typography>
                {assignedTrainers.length === 0 ? (
                    <Typography color="text.secondary">You have no assigned trainers.</Typography>
                ) : (
                    <TrainerGrid
                        trainers={assignedTrainers}
                        favorites
                    />
                )}
            </Box>
            <Typography variant="h5" gutterBottom>
                Other Available Trainers
            </Typography>
            <TrainerGrid
                trainers={unAssignedTrainers}
            />
        </Container>
    );
}

export default TrainerPage;
