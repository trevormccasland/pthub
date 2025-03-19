import { FC } from "react"
import ExerciseCard from './components/ExerciseCard'
import { Exercise, Superset, Workout } from "./types"
import { Box } from "@mui/material"
import SuperSetActivityCard from "./components/SuperSetActivityCard"
import WorkoutCard from "./components/WorkoutCard"

const exercise: Exercise = {
    name: 'touch down squat',
    level: 'stabilization',
    type: 'balance',
    reps: 10,
    sets: 3,
    rest: 30,
    tempo: [2,0,1,0],
    url: 'https://www.youtube.com/watch?v=h6lET2_DLA0'
}

const exercise2: Exercise = {
    name: 'goblet squat',
    level: 'strength',
    type: 'resistance',
    load: 25,
    reps: 10,
    rest: 60,
    sets: 3,
    tempo: [3,0,1,0]
}

const activity1: Superset = {
    type: 'synergistic',
    group: [exercise2, exercise]
}

const exercise3: Exercise = {
    name: 'single leg leg extension machine',
    level: 'strength',
    type: 'resistance',
    load: 50,
    reps: 12,
    rest: 0,
    sets: 3,
    tempo: [3,0, 1, 0]
}

const exercise4: Exercise = {
    name: 'jumping split squat',
    level: 'power',
    type: 'plyometric',
    reps: 24,
    rest: 60
}

const activity2: Superset = {
    type: 'synergistic',
    group: [exercise3, exercise4]
}

const warmup1: Exercise = {
    name: 'Single Arm KettleBell March',
    level: 'stabilization',
    type: 'balance',
    load: 15,
    time: 30,
    rest: 30,
    sets: 1
}

const cooldown: Exercise = {
    name: 'Walking',
    level: 'stabilization',
    type: 'cardio',
    time: 300,
    sets: 1
}

const workout: Workout = {
    name: 'Leg Day',
    type: 'straight set',
    warmup: [warmup1],
    work: [activity1, activity2],
    cooldown: [cooldown]
}

const App: FC = () => {
    return <Box>
        <WorkoutCard workout={workout} />
    </Box>
}

export default App