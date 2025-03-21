import { List, ListItem, ListItemText, ListItemButton } from "@mui/material"
import { useEffect, useState } from "react"
import { Exercise } from "../types"
import exerciseServiceClient from "../services/exerciseServiceClient";
import ExercisePage from "./ExercisePage";
import ExerciseCard from "./ExerciseCard";

const ExerciseList = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    useEffect(() => {
        const callGetExercises = async () => {
            const data = await exerciseServiceClient.getExercises()
            setExercises(data)
        }
        callGetExercises()
    }, [])
    if (selectedIndex !== -1) {
        return <ExerciseCard exercise={exercises[selectedIndex]} />
    }
    return <List>
        {exercises.map((exercise, i) => (
            <ListItem key={exercise.name + i}>
                <ListItemButton onClick={() => setSelectedIndex(i)}>
                    <ListItemText primary={exercise.name} />
                </ListItemButton>
            </ListItem>
        ))}
    </List>
}

export default ExerciseList