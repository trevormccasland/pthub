import { Activity } from "../types"

const url = 'http://localhost:3000/activity'

const getActivities = async () => {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.activities
}

const updateActivity = async (activity: Activity) => {
    const resp = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(activity)
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.activity
}

const createActivity = async (activity: Activity) => {
    const resp = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(activity)
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data.activity
}

export default {
    getActivities,
    updateActivity,
    createActivity
}