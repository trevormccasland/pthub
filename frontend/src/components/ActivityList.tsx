import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import React, { FC, useEffect, useState } from "react"
import { Activity, Exercise, Page, Workout } from "../types"
import activityServiceClient from "../services/activityServiceClient";
import ActivityPage from "../pages/ActivityPage";
import { ModeEdit, Visibility } from "@mui/icons-material";
import ActivityCard from "./ActivityCard";

interface ActivityListProps {
    setSelectedItem: React.Dispatch<React.SetStateAction<Workout | Exercise | Activity | undefined>>;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}


const ActivityList: FC<ActivityListProps> = ({setSelectedItem, setPage}) => {
    const [activitys, setActivitys] = useState<Activity[]>([]);
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
        setPage('activity')
        setSelectedItem(activitys[view.index])
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