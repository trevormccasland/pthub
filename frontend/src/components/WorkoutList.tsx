import { FC, useEffect, useState } from "react"
import { Activity, Exercise, Page, Workout } from "../types"
import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import WorkoutCard from "./WorkoutCard"
import workoutServiceClient from "../services/workoutServiceClient"
import { ModeEdit, Visibility } from "@mui/icons-material"

interface WorkoutListProps {
    setSelectedItem: React.Dispatch<React.SetStateAction<Workout | Exercise | Activity | undefined>>;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const WorkoutList: FC<WorkoutListProps> = ({setSelectedItem, setPage}) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [view, setView] = useState({
        index: -1,
        view: false,
        edit: false
    })
    useEffect(() => {
        const callGetWorkouts = async () => {
            const data = await workoutServiceClient.getWorkouts()
            setWorkouts(data)
        }
        callGetWorkouts()
    }, [])
    const handleCloseDialog = () => {
        setView({ index: -1, edit: false, view: false });
    };
    if (view.edit) {
       setPage('workout')
       setSelectedItem(workouts[view.index])
    }
    return <>
        <List>{workouts.map((workout, i) => (<ListItem>
            <ListItemText>{workout.name}</ListItemText>
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
        </ListItem>))}</List>
        <Dialog open={view.view} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Workout Details</DialogTitle>
            <DialogContent>
                {view.index !== -1 && <WorkoutCard workout={workouts[view.index]} />}
                <Button onClick={handleCloseDialog} color="primary" variant="contained" sx={{ mt: 2, float: 'right' }}>
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    </>
}

export default WorkoutList