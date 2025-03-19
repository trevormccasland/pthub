import { FC, useEffect, useState } from "react"
import { Workout } from "../types"
import { Box } from "@mui/material"
import WorkoutCard from "../components/WorkoutCard"
import workoutServiceClient from "../services/workoutServiceClient"


const WorkoutList: FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    useEffect(() => {
        const callGetWorkouts = async () => {
            const data = await workoutServiceClient.getWorkouts()
            setWorkouts(data.workouts)
        }
        callGetWorkouts()
    }, [])
    return <div>{workouts.map(workout => (<Box>
        <WorkoutCard workout={workout} />
    </Box>))}</div>
}

export default WorkoutList