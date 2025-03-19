import { Box, Stack, Typography } from "@mui/material"
import ExerciseCard from "./ExerciseCard"
import { Activity, Exercise } from "../types"
import { makeStyles } from '@mui/styles'

interface ActivityCardProps {
    activity: Activity
}

const useStyles = makeStyles({
    root: {
        border: '0.125rem solid rgb(161, 161, 161)',
    },
    content: {
        padding: '1rem'
    },
    row: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap'
    },
    lastRow: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginTop: '0.5rem'
    },
    label: {
        width: '25%',
        margin: 'auto',
        textAlign: 'center'
    },
    exercise: {
        width: '75%'
    }
})

const ActivityCard = ({activity}: ActivityCardProps) => {
    const classes = useStyles()
    return <Stack className={classes.root}>
        <Box className={classes.content}>
            {activity.group.map((exercise, i) => (
                <Stack direction='row' className={classes.row}>
                    <Box className={classes.label}>
                        <Typography variant="h4">{i + 1}.</Typography>
                    </Box>
                    <Box className={classes.exercise}>
                        <ExerciseCard exercise={exercise} />
                    </Box>
                </Stack>
            ))}
        </Box>
    </Stack>
}

export default ActivityCard