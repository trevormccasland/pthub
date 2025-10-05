import { Box, Stack, Typography } from "@mui/material";
import { Workout, WorkoutActivity } from "../types";
import ActivityCard from "./ActivityCard";

interface WorkoutCardProps {
    workout: Workout;
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
    // Group activities by phase
    const warmupActivities = workout.workoutActivities?.filter(
        (wa) => wa.phase === "warmup"
    ).sort((a,b) => a.order - b.order) || [];
    const workActivities = workout.workoutActivities?.filter(
        (wa) => wa.phase === "work"
    ).sort((a,b) => a.order - b.order) || [];
    const cooldownActivities = workout.workoutActivities?.filter(
        (wa) => wa.phase === "cooldown"
    ).sort((a,b) => a.order - b.order) || [];

    return (
        <Stack>
            <Box>
                <Typography variant="h2">{workout.name}</Typography>
            </Box>
            <Stack>
                <Typography variant="h3">Warm Up</Typography>
                <Stack>
                    {warmupActivities.map((wa: WorkoutActivity) => (
                        <ActivityCard key={wa.id} activity={wa.activity} />
                    ))}
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="h3">Work</Typography>
                <Stack>
                    {workActivities.map((wa: WorkoutActivity, i: number) => (
                        <Box key={wa.id}>
                            <Typography>{String.fromCharCode(65 + i)}</Typography>
                            <ActivityCard activity={wa.activity} />
                        </Box>
                    ))}
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="h3">Cool Down</Typography>
                <Stack>
                    {cooldownActivities.map((wa: WorkoutActivity) => (
                        <ActivityCard key={wa.id} activity={wa.activity} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default WorkoutCard;