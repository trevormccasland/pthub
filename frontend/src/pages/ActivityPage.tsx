import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Activity, Exercise, ActivityExercise } from "../types"
import { Autocomplete, Box, Button, Container, Divider, IconButton, List, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Add, Delete } from "@mui/icons-material"
import exerciseServiceClient from "../services/exerciseServiceClient"
import activityServiceClient from "../services/activityServiceClient"

interface ActivityPageProps {
    activity: Activity
    add?: boolean
}

const useStyles = makeStyles({
    title: {
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    divider: {
        marginTop: '0.25rem',
        marginBottom: '2rem'
    },
    center: {
        display: 'flex',
        alignItems: 'center'
    },
    exerciseSelect: {
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
    }
})

const ActivityPage: FC<ActivityPageProps> = ({ activity, add }) => {
    const classes = useStyles()
    const [updates, setUpdates] = useState<Activity>({ ...activity, group: activity.group || [] })
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>();
    
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const fetchedExercises = await exerciseServiceClient.getExercises()
                setExercises(fetchedExercises)
            } catch (error) {
                console.error('Error fetching exercises', error)
            }
        }
        fetchExercises()
    }, [])

    const options = useMemo(() => exercises?.reduce<Exercise[]>((result, e) => {
        if (result.some(v => v.name === e.name)) {
            return result
        }
        result.push(e)
        return result
    }, []) ?? [], [exercises])

    const handleDelete = useCallback(
        (index: number) => {
            setUpdates(prev => {
                const newGroup = [...prev.group];
                newGroup.splice(index, 1);
                // Re-order the remaining exercises
                const reorderedGroup = newGroup.map((item, i) => ({ ...item, order: i + 1 }));
                return { ...prev, group: reorderedGroup };
            });
        },
        [setUpdates]
    );

    const handleAddExercise = useCallback(
        () => {
            if (selectedExercise) {
                setUpdates(prev => {
                    // Create a new ActivityExercise object
                    const newActivityExercise: ActivityExercise = {
                        activity: prev,
                        exercise: selectedExercise,
                        order: prev.group.length + 1
                    };
                    return { ...prev, group: [...prev.group, newActivityExercise] };
                });
            }
            setSelectedExercise(null);
        },
        [setUpdates, selectedExercise, setSelectedExercise]
    );

    const handleCreateActivity = async () => {
        try {
            await activityServiceClient.createActivity(updates)
            alert('Activity created successfully!')
        }
        catch (error) {
            console.error('Error creating activity', error)
            alert('Failed to create activity')
        }
    }

    const handleUpdateActivty = async () => {
        try {
            await activityServiceClient.updateActivity(updates)
            alert('Activity updated successfully!')
        }
        catch (error) {
            console.error('Error updating activity', error)
            alert('Failed to update activity')
        }
    }

    return (
        <Container>
            <Stack direction='column'>
                <Box className={classes.title}>
                    <Typography variant='h3'>Activity Page</Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box>
                    <TextField fullWidth label='Activity Name' value={updates.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, name: event.target.value }))} />
                </Box>
                <Stack direction='column'>
                    <Typography variant="h6">Exercises</Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.name}
                        value={selectedExercise}
                        onChange={(_, newValue) => setSelectedExercise(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth className={classes.exerciseSelect} label='Name' />
                        )}
                    />
                    <Button startIcon={<Add />} onClick={handleAddExercise}>
                        Add Exercise
                    </Button>
                    <List>
                        {updates.group.sort((a,b) => (a as ActivityExercise).order - (b as ActivityExercise).order).map((activityExercise, i) => {
                            const exercise = (activityExercise as ActivityExercise).exercise;
                            return (
                                <Stack key={exercise.name} direction='row'>
                                    <Typography className={classes.center}>{i + 1}.</Typography>
                                    <ListItemButton>
                                        <ListItemText>
                                            {exercise.name}
                                        </ListItemText>
                                    </ListItemButton>
                                    <Box className={classes.center}>
                                        <IconButton onClick={() => handleDelete(i)}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Stack>
                            )
                        })}
                    </List>
                </Stack>
                <Stack direction="row-reverse" spacing={2}>
                    <Button variant="contained" onClick={() => add ? handleCreateActivity() : handleUpdateActivty()}>
                        {add ? 'Create Activity' : 'Update Activity'}
                    </Button>
                    <Button variant="contained" onClick={() => setUpdates({ ...activity })}>
                        Clear
                    </Button>
                </Stack>
            </Stack>
        </Container>
    )
}

export default ActivityPage