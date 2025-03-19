const url = 'http://localhost:3000/workout'

const getWorkouts = async () => {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data
}

export default {
    getWorkouts
}