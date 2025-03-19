import { FC, useEffect, useState } from "react"
import ExerciseCard from './components/ExerciseCard'
import { Exercise, Workout } from "./types"
import { Box } from "@mui/material"
import WorkoutCard from "./components/WorkoutCard"
import workoutServiceClient from "./services/workoutServiceClient"


const App: FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    useEffect(() => {
        const callGetWorkouts = async () => {
            const data = await workoutServiceClient.getWorkouts()
            console.log('setting data', data)
            setWorkouts(data.workouts)
        }
        callGetWorkouts()
    }, [])
    return <div>{workouts.map(workout => (<Box>
        <WorkoutCard workout={workout} />
    </Box>))}</div>
}

export default App