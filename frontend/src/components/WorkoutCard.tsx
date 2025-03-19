import { Box, Stack, Typography } from "@mui/material"
import { Workout } from "../types"
import ActivityCard from "./ActivityCard"

interface WorkoutCardProps {
    workout: Workout
}

const WorkoutCard = ({workout}: WorkoutCardProps) => {
    return <Stack>
        <Box>
            <Typography variant="h2">{workout.name}</Typography>
        </Box>
        <Stack>
            <Typography variant="h3">Warm Up</Typography>
            <Stack>
                {workout.warmup.map(activity => <ActivityCard activity={activity} />)}
            </Stack>
        </Stack>
        <Stack>
            <Typography variant="h3">Work</Typography>
            <Stack>
                {workout.work.map((activity, i) => <Box>
                    <Typography>{String.fromCharCode(65 + i)}</Typography>
                    <ActivityCard activity={activity} />
                </Box>)}
            </Stack>
        </Stack>
        <Stack>
            <Typography variant="h3">Cool Down</Typography>
            <Stack>
                {workout.cooldown.map(activity => <ActivityCard activity={activity} />)}
            </Stack>
        </Stack>
    </Stack>
}

export default WorkoutCard