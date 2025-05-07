import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Exercise } from "../types"
import exerciseServiceClient from "../services/exerciseServiceClient";
import ExercisePage from "../pages/ExercisePage";
import ExerciseCard from "./ExerciseCard";
import { ModeEdit, Visibility } from "@mui/icons-material";

const ExerciseList = () => {
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
    if (view.view) {
        return <ExerciseCard exercise={exercises[view.index]} />
    }
    if (view.edit) {
        return <ExercisePage exercise={exercises[view.index]} />
    }
    return <List>
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
}

export default ExerciseList