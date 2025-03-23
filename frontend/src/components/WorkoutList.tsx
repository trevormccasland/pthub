import { FC, useEffect, useState } from "react"
import { Workout } from "../types"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import WorkoutCard from "./WorkoutCard"
import workoutServiceClient from "../services/workoutServiceClient"
import { ModeEdit, Visibility } from "@mui/icons-material"
import ExercisePage from "./ExercisePage"
import WorkoutPage from "./WorkoutPage"


const WorkoutList: FC = () => {
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
    if (view.edit) {
        return <WorkoutPage workout={workouts[view.index]} />
    }
    if (view.view) {
        return <WorkoutCard workout={workouts[view.index]} /> 
    }
    return <List>{workouts.map((workout, i) => (<ListItem>
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
}

export default WorkoutList