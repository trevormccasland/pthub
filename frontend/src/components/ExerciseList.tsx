import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Box, Stack, Dialog, DialogTitle, DialogContent, Button } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { Activity, Exercise, Page, Workout } from "../types"
import exerciseServiceClient from "../services/exerciseServiceClient";
import ExercisePage from "../pages/ExercisePage";
import ExerciseCard from "./ExerciseCard";
import { ModeEdit, Visibility } from "@mui/icons-material";

interface ExerciseListProps {
    setSelectedItem: React.Dispatch<React.SetStateAction<Workout | Exercise | Activity | undefined>>;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const ExerciseList: FC<ExerciseListProps> = ({setSelectedItem, setPage}) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [view, setView] = useState({
        edit: false,
        view: false,
        index: -1
    })
    useEffect(() => {
        const callGetExercises = async () => {
            const data = await exerciseServiceClient.getExercises()
            setExercises(data)
        }
        callGetExercises()
    }, [])
    const handleCloseDialog = () => {
        setView({ index: -1, edit: false, view: false });
    };
    if (view.edit) {
        setPage('exercise')
        setSelectedItem(exercises[view.index])
    }
    return <>
        <List>
            {exercises.map((exercise, i) => (
                <ListItem key={exercise.name + i}>
                    <ListItemText primary={exercise.name} />
                    <Stack direction='row'>
                        <ListItemButton onClick={() => setView({
                                    index: i,
                                    edit: true,
                                    view: false
                                })}>
                            <ListItemIcon>
                                <ModeEdit />
                            </ListItemIcon>
                        </ListItemButton>
                        <ListItemButton onClick={() => setView({
                                    index: i,
                                    edit: false,
                                    view: true
                                })}>
                            <ListItemIcon>
                                <Visibility />
                            </ListItemIcon>
                        </ListItemButton>
                    </Stack>
                </ListItem>
            ))}
        </List>
        <Dialog open={view.view} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Exercise Details</DialogTitle>
            <DialogContent>
                {view.index !== -1 && <ExerciseCard exercise={exercises[view.index]} />}
                <Button onClick={handleCloseDialog} color="primary" variant="contained" sx={{ mt: 2, float: 'right' }}>
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    </>
}

export default ExerciseList