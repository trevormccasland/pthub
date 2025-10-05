import React, { useState, useEffect, FC, useMemo } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Stack,
    Autocomplete,
    Box,
    Divider,
    IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Add, Delete as DeleteIcon } from '@mui/icons-material';
import { Workout, Activity, WorkoutType, WorkoutActivity } from '../types';
import workoutServiceClient from '../services/workoutServiceClient';
import activityServiceClient from '../services/activityServiceClient';

interface WorkoutPageProps {
    workout: Workout;
    add?: boolean;
}

const useStyles = makeStyles({
    container: {
        width: '80%',
        marginTop: '2rem',
    },
    title: {
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    divider: {
        marginTop: '0.25rem',
        marginBottom: '2rem',
    },
    verticalTextField: {
        margin: '0.5rem',
    },
    actionRow: {
        marginTop: '1rem',
    },
    activityList: {
        marginTop: '0.5rem',
    },
    activityItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: '1rem',
    },
});

const WorkoutPage: FC<WorkoutPageProps> = ({ add, workout }) => {
    const classes = useStyles();
    const [updates, setUpdates] = useState<Workout>({
        ...workout,
        workoutActivities: workout.workoutActivities || [],
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const fetchedActivities = await activityServiceClient.getActivities();
                setActivities(fetchedActivities);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setUpdates((prevWorkout) => ({
            ...prevWorkout,
            [name]: value,
        }));
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdates((prevWorkout) => ({
            ...prevWorkout,
            type: event.target.value as WorkoutType,
        }));
    };

    const handleAddActivity = (phase: WorkoutActivity['phase']) => {
        if (selectedActivity) {
            const newWorkoutActivity: WorkoutActivity = {
                activity: selectedActivity,
                phase,
                order: updates.workoutActivities?.filter(wa => wa.phase === phase).length ?? 0,
            };
            setUpdates((prevWorkout) => ({
                ...prevWorkout,
                workoutActivities: [...prevWorkout?.workoutActivities ?? [], newWorkoutActivity],
            }));
            setSelectedActivity(null);
        }
    };

    const handleRemoveActivity = (id: number) => {
        setUpdates((prevWorkout) => ({
            ...prevWorkout,
            workoutActivities: prevWorkout?.workoutActivities?.filter((wa) => wa.id !== id) ?? [],
        }));
    };
    
    // Group activities by phase for rendering
    const groupedActivities = useMemo(() => {
        const groups: Record<WorkoutActivity['phase'], WorkoutActivity[]> = {
            warmup: [],
            work: [],
            cooldown: [],
        };
        if (updates.workoutActivities) updates.workoutActivities
            .sort((a, b) => a.order - b.order)
            .forEach((wa) => {
                groups[wa.phase].push(wa);
            });

        return groups;
    }, [updates.workoutActivities]);


    const handleUpdateWorkout = async () => {
        try {
            await workoutServiceClient.updateWorkout(updates);
            alert('Workout updated successfully!');
        } catch (error) {
            console.error('Error updating workout:', error);
            alert('Failed to update workout.');
        }
    };

    const handleCreateWorkout = async () => {
        try {
            await workoutServiceClient.createWorkout(updates);
            alert('Workout created successfully!');
        } catch (error) {
            console.error('Error creating workout:', error);
            alert('Failed to create workout.');
        }
    };

    const options = useMemo(
        () =>
            activities?.reduce<Activity[]>((result, a) => {
                if (result.some((v) => v.name === a.name)) {
                    return result;
                }
                result.push(a);
                return result;
            }, []) ?? [],
        [activities]
    );

    return (
        <Container className={classes.container}>
            <Stack direction="column">
                <Box className={classes.title}>
                    <Typography variant="h3">Workout Page</Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box>
                    <TextField
                        fullWidth
                        className={classes.verticalTextField}
                        label="Name"
                        name="name"
                        value={updates.name}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box>
                    <TextField
                        fullWidth
                        className={classes.verticalTextField}
                        label="Sets"
                        name="sets"
                        type="number"
                        value={updates.sets || ''}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box>
                    <TextField
                        fullWidth
                        className={classes.verticalTextField}
                        select
                        label="Type"
                        name="type"
                        value={updates.type || ''}
                        onChange={handleTypeChange}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value=""></option>
                        <option value="straight set">Straight Set</option>
                        <option value="circuit">Circuit</option>
                    </TextField>
                </Box>

                <Stack direction='column' spacing={2}>
                    <Box mt={2}>
                        <Typography variant="h6">Add Activities</Typography>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.name}
                            value={selectedActivity}
                            onChange={(_, newValue) => setSelectedActivity(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select an Activity" />
                            )}
                        />
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Button startIcon={<Add />} onClick={() => handleAddActivity('warmup')}>Add to Warmup</Button>
                            <Button startIcon={<Add />} onClick={() => handleAddActivity('work')}>Add to Work</Button>
                            <Button startIcon={<Add />} onClick={() => handleAddActivity('cooldown')}>Add to Cooldown</Button>
                        </Box>
                    </Box>
                    <Divider />
                    <Typography variant="h6">Warmup Activities</Typography>
                    <Stack direction="column" className={classes.activityList}>
                        {groupedActivities.warmup.map((wa) => (
                            <Box key={wa.activity.name} className={classes.activityItem}>
                                <Typography>{wa.activity.name}</Typography>
                                <IconButton onClick={() => handleRemoveActivity(wa.id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                    <Divider />
                    <Typography variant="h6">Work Activities</Typography>
                    <Stack direction="column" className={classes.activityList}>
                        {groupedActivities.work.map((wa) => (
                            <Box key={wa.activity.name} className={classes.activityItem}>
                                <Typography>{wa.activity.name}</Typography>
                                <IconButton onClick={() => handleRemoveActivity(wa.id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                    <Divider />
                    <Typography variant="h6">Cooldown Activities</Typography>
                    <Stack direction="column" className={classes.activityList}>
                        {groupedActivities.cooldown.map((wa) => (
                            <Box key={wa.activity.name} className={classes.activityItem}>
                                <Typography>{wa.activity.name}</Typography>
                                <IconButton onClick={() => handleRemoveActivity(wa.id!)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
                <Stack className={classes.actionRow} direction="row-reverse" spacing={2}>
                    <Button variant="contained" onClick={() => (add ? handleCreateWorkout() : handleUpdateWorkout())}>
                        {add ? 'Add' : 'Update'} Workout
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default WorkoutPage;