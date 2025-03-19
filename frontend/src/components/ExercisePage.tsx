import { FC, useState } from "react"
import { Exercise } from "../types"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import exerciseServiceClient from "../services/exerciseServiceClient"

interface ExercisePageProps {
    exercise: Exercise
}

const ExercisePage: FC<ExercisePageProps> = ({exercise}) => {
    const [updates, setUpdates] = useState<Exercise>({...exercise});
    const onSave = async () => {
        await exerciseServiceClient.updateExercise(updates)
    }
    return <Stack direction='column'>
        <Box>
            <TextField label='Name' value={updates.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, name: e.target.value}))}/>
        </Box>
        <Box>
            <TextField label='Load' type='number' value={updates.load} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, load: parseInt(e.target.value)}))} />
        </Box>
        <Stack direction='row'>
            <Box>
                <TextField label='Reps' type='number' value={updates.reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, reps: parseInt(e.target.value)}))} />
            </Box>
            <Box>
                <TextField label='Time' type='number' value={updates.time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, time: parseInt(e.target.value)}))} />
            </Box>
        </Stack>
        <Box>
            <TextField label='Sets' type='number' value={updates.sets} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, time: parseInt(e.target.value)}))} />
        </Box>
        <Box>
            <TextField label='Rest in Seconds' type='number' value={updates.rest} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, time: parseInt(e.target.value)}))} />
        </Box>
        <Stack direction='column'>
            <Box><Typography>Tempo</Typography></Box>
            <Stack direction='row'>
                <TextField label='Eccentric' value={updates.tempo?.[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, tempo: [parseInt(e.target.value), prev?.tempo?.[1] ?? -1, prev?.tempo?.[2] ?? -1, prev?.tempo?.[3] ?? -1]}))}/>
                <TextField label='Eccentric Hold' value={updates.tempo?.[1] === -1 ? null : updates.tempo?.[1]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, tempo: [prev?.tempo?.[0] ?? -1, parseInt(e.target.value), prev?.tempo?.[2] ?? -1, prev?.tempo?.[3] ?? -1]}))}/>
                <TextField label='Concentric' value={updates.tempo?.[2] === -1 ? null : updates.tempo?.[2]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, tempo: [prev?.tempo?.[0] ?? -1, prev?.tempo?.[1] ?? -1, parseInt(e.target.value), prev?.tempo?.[3] ?? -1]}))}/>
                <TextField label='Concentric Hold' value={updates.tempo?.[3] === -1 ? null : updates.tempo?.[3]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, tempo: [prev?.tempo?.[0] ?? -1, prev?.tempo?.[1] ?? -1, prev?.tempo?.[2] ?? -1, parseInt(e.target.value)]}))}/>
            </Stack>
        </Stack>
        <Stack direction='row'>
            <Button onClick={onSave}>Save</Button>
            <Button onClick={() => setUpdates({...exercise})}>Reset</Button>
        </Stack>
    </Stack>
}

export default ExercisePage