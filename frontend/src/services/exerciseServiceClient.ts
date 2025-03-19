import { Exercise } from "../types"

const url = 'http://localhost:3000/exercise'

const getExercises = async () => {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data
}
const headers = new Headers({
    "Content-Type": "application/json"
  });
const updateExercise = async (exercise: Exercise) => {
    const resp = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(exercise)
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data
}

export default {
    getExercises,
    updateExercise
}