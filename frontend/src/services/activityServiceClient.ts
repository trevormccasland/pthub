const url = 'http://localhost:3000/activity'

const getActivities = async () => {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'no-cors'
    })
    if (!resp.ok) throw new Error(`${resp.statusText} ${await resp.text()}`)
    const data = await resp.json()
    return data
}

export default {
    getActivities
}