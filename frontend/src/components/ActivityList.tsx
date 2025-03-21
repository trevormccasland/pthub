import { List, ListItem, ListItemText, ListItemButton } from "@mui/material"
import { useEffect, useState } from "react"
import { Activity } from "../types"
import activityServiceClient from "../services/activityServiceClient";
import ActivityPage from "./ActivityPage";

const ActivityList = () => {
    const [activitys, setActivitys] = useState<Activity[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    useEffect(() => {
        const callGetActivitys = async () => {
            const data = await activityServiceClient.getActivities()
            setActivitys(data.activities)
        }
        callGetActivitys()
    }, [])
    if (selectedIndex !== -1) {
        return <ActivityPage activity={activitys[selectedIndex]} />
    }
    return <List>
        {activitys.map((activity, i) => (
            <ListItem key={activity.name + i}>
                <ListItemButton onClick={() => setSelectedIndex(i)}>
                    <ListItemText primary={activity.name} />
                </ListItemButton>
            </ListItem>
        ))}
    </List>
}

export default ActivityList