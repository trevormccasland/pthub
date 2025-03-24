import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Activity, Exercise } from "../types"
import { Autocomplete, Box, Button, Container, Divider, IconButton, List, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Add, Delete } from "@mui/icons-material"
import exerciseServiceClient from "../services/exerciseServiceClient"

interface ActivityPageProps {
    activity: Activity
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

const ActivityPage: FC<ActivityPageProps> = ({activity}) => {
    const classes = useStyles()
    const [updates, setUpdates] = useState<Activity>({...activity})
    const [selectedExericse, setSelectedExercise] = useState<Exercise | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>();
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const fetchedExercises = await exerciseServiceClient.getExercises()
                setExercises(fetchedExercises)
            } catch (error) {
                console.error('Error fetch exercises', error)
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
                return { ...prev, group: newGroup };
            });
        },
        [setUpdates]
    );
    
    const handleAddExercise = useCallback(
        () => {
          if (selectedExericse) {
            setUpdates(prev => (
                { ...prev, group: [...prev.group, selectedExericse] }
            ));
          }
          setSelectedExercise(null);
        },
        [setUpdates, selectedExericse, setSelectedExercise]
    );
    return <Container>
        <Stack direction='column'>
            <Box className={classes.title}>
                <Typography variant='h3'>Activity Page</Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box>
                <TextField fullWidth label='Activity Name' value={updates.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({...prev, name: event.target.value}))} />
            </Box>
            <Stack direction='column'>
                <Typography variant="h6">Exercises</Typography>
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.name}
                    value={selectedExericse}
                    onChange={(_, newValue) => setSelectedExercise(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth className={classes.exerciseSelect} label='Name'/>
                    )}
                />
                <Button startIcon={<Add />} onClick={handleAddExercise}>
                    Add Exercise
                </Button>
                <List>
                    {updates.group.map((exercise, i) => (
                        <Stack direction='row'>
                            <Typography className={classes.center}>{i + 1}.</Typography>
                            <ListItemButton key={exercise.name}>
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
                    ))}
                </List>
            </Stack>
        </Stack>
    </Container>
}

export default ActivityPage