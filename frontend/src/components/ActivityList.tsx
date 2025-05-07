import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Stack, Dialog, DialogTitle, DialogContent, Button } from "@mui/material"
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
    const handleCloseDialog = () => {
        setView({ index: -1, edit: false, view: false });
    };
    return <>
        <List>
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
        <Dialog open={view.view} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Activity Details</DialogTitle>
            <DialogContent>
                {view.index !== -1 && <ActivityCard activity={activitys[view.index]} />}
                <Button onClick={handleCloseDialog} color="primary" variant="contained" sx={{ mt: 2, float: 'right' }}>
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    </>
}

export default ActivityList