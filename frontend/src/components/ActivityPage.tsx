import { FC, useCallback, useMemo, useState } from "react"
import { Activity, Exercise } from "../types"
import { Autocomplete, Box, Button, Container, Divider, IconButton, LinearProgress, List, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Add, Check, Delete } from "@mui/icons-material"
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
    const [loading, setLoading] = useState(false)
    const [updates, setUpdates] = useState<Activity>({...activity})
    const [inputUpdate, setInputUpdate] = useState<string | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>();
    const onAddExercise = async () => {
        if (!exercises) {
            setLoading(true)
            const data = await exerciseServiceClient.getExercises()
            setExercises(data)
            setLoading(false)
        }
        setInputUpdate('')
    }
    const handleInputValueChange = useCallback(
        (newInputValue: string | null) => {
            setInputUpdate(newInputValue);
        },
        [setInputUpdate]
    );
    const getNameInputValue = useCallback(() => inputUpdate ?? '', [inputUpdate])
    const options = useMemo(() => exercises?.reduce<string[]>((result, e) => {
        if (result.includes(e.name)) {
            return result
        }
        result.push(e.name)
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
    
    const handleApprove = useCallback(
        () => {
          if (inputUpdate && exercises) {
            setUpdates(prev => {
                let newGroup;
                const index = exercises.findIndex((e) => e.name === inputUpdate)
                newGroup = [...prev.group, { ...exercises[index] }];
                return { ...prev, group: newGroup };
            });
          }
    
          setInputUpdate(null);
        },
        [setUpdates, setInputUpdate, activity.group.length, inputUpdate, exercises]
    );
    return <Container>
        <Stack direction='column'>
            <Box className={classes.title}>
                <Typography variant='h3'>Activity Page</Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box>
                <TextField label='Name' value={updates.name} />
            </Box>
            <Stack direction='column'>
                <Button disabled={inputUpdate !== null} endIcon={<Add />} onClick={onAddExercise}>
                    Add Exercise
                </Button>
                {inputUpdate !== null &&
                    <Stack direction='row'>
                        <Autocomplete
                            inputValue={getNameInputValue()}
                            onInputChange={(event, newInputValue) => handleInputValueChange(newInputValue)}
                            
                            options={options}
                            renderInput={(params) => (
                                <TextField {...params} className={classes.exerciseSelect} fullWidth label='Name' value={inputUpdate} />
                            )}
                        />
                        <Box className={classes.center}>
                            <IconButton onClick={() => handleApprove()}>
                                <Check />
                            </IconButton>
                        </Box>
                    </Stack>
                }
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
                { loading && <LinearProgress />}
            </Stack>
        </Stack>
    </Container>
}

export default ActivityPage