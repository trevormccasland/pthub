import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Activity } from "../types"
import activityServiceClient from "../services/activityServiceClient";
import ActivityPage from "./ActivityPage";
import { ModeEdit, Visibility } from "@mui/icons-material";
import ActivityCard from "./ActivityCard";

const ActivityList = () => {
    const [activitys, setActivitys] = useState<Activity[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [view, setView] = useState({
        index: -1,
        edit: false,
        view: false
    })
    useEffect(() => {
        const callGetActivitys = async () => {
            const data = await activityServiceClient.getActivities()
            setActivitys(data)
        }
        callGetActivitys()
    }, [])
    if (view.edit) {
        return <ActivityPage activity={activitys[view.index]} />
    }
    if (view.view) {
        return <ActivityCard activity={activitys[view.index]} />
    }
    return <List>
        {activitys.map((activity, i) => (
            <ListItem key={activity.name + i}>
                <ListItemText primary={activity.name} />
                <Stack direction='row'>
                    <ListItemButton  onClick={() => setView({
                            index: i,
                            view: false,
                            edit: true
                        })}
                    >
                        <ListItemIcon>
                            <ModeEdit />
                        </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton onClick={() => setView({
                            index: i,
                            view: true,
                            edit: false
                        })}
                    >
                        <ListItemIcon>
                            <Visibility />
                        </ListItemIcon>
                    </ListItemButton>
                </Stack>
            </ListItem>
        ))}
    </List>
}

export default ActivityList