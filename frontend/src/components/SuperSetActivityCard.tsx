import { Box, Stack, Typography } from "@mui/material"
import ExerciseCard from "./ExerciseCard"
import { Exercise } from "../types"
import { makeStyles } from '@mui/styles'

interface SuperSetActivityCardProps {
    exercise1: Exercise,
    exercise2: Exercise
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

const SuperSetActivityCard = ({exercise1, exercise2}: SuperSetActivityCardProps) => {
    const classes = useStyles()
    return <Stack className={classes.root}>
        <Box className={classes.content}>
            <Stack direction='row' className={classes.row}>
                <Box className={classes.label}>
                    <Typography variant="h4">1</Typography>
                </Box>
                <Box className={classes.exercise}>
                    <ExerciseCard exercise={exercise1} />
                </Box>
            </Stack>
            <Stack direction='row' className={classes.lastRow}>
                <Box className={classes.label}>
                    <Typography variant="h4">2</Typography>
                </Box>
                <Box className={classes.exercise}>
                    <ExerciseCard exercise={exercise2} />
                </Box>
            </Stack>
        </Box>
    </Stack>
}

export default SuperSetActivityCard