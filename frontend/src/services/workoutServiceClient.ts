import { Workout } from "../types"

const url = 'http://localhost:3000/workout'

const getWorkouts = async () => {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.workouts
}

const headers = new Headers({
    "Content-Type": "application/json"
  });
const updateWorkout = async (workout: Workout) => {
    const resp = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(workout)
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.workout
}

const createWorkout = async (workout: Workout) => {
    const resp = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(workout)
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.workout
}

export default {
    getWorkouts,
    updateWorkout,
    createWorkout
}