import { Box, Link, Stack, Typography } from "@mui/material"
import { Exercise } from "../types"
import { FC } from "react"
import { makeStyles } from '@mui/styles'

interface ExerciseCardProps {
    exercise: Exercise
}

const useStyles = makeStyles({
    root: {
        backgroundColor: 'ghostwhite',
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
        border: '0.125rem solid rgb(161, 161, 161)',
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'ghostwhite',
        borderRadius: '0.75rem',
        border: '0.125rem solid lightgray',
        padding: '0 0.3rem 0.3rem 0.3rem'
    },
    content: {
        margin: '1rem',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignContent: 'center'
    },
    labelRight: {
        color: 'black',
        marginLeft: '0.25rem',
        borderBottom: '0.125rem solid black'
    },
    group: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '0.5rem'
    },
    valueGroup: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        padding: '0.25rem',
        borderRight: '0.05rem solid black'
    },
    valueGroupEnd: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        padding: '0.25rem',
    },
    valueItem: {
        color: 'red',
        fontWeight: 'bold'
    }
})

const ExerciseCard: FC<ExerciseCardProps> = ({ exercise }: ExerciseCardProps) => {
    const classes = useStyles()
    return <Box className={classes.root}>
       <Stack direction='column' className={classes.content}>
            <Box className={classes.title}>
                <Typography variant="h5"><Link href={exercise.url}>{exercise.name}</Link></Typography>
            </Box>
            {exercise?.load && <Stack direction='row' className={classes.group}>
                <Typography>Load</Typography>
                <Typography variant="subtitle1">{exercise.load}</Typography>
            </Stack>}
            <Stack direction='row' className={classes.group}>
                <Stack direction='row' className={classes.valueGroup}>
                    <Typography className={classes.valueItem} variant='subtitle1'>{exercise.reps ? exercise.reps : exercise.time}</Typography><Box className={classes.labelRight}><Typography variant='caption'>{exercise.reps ? 'Reps' : 'Seconds' }</Typography></Box>
                </Stack>
                <Stack direction='row' className={classes.valueGroup}>
                    <Typography className={classes.valueItem} variant='subtitle1'>{exercise.sets}</Typography><Box className={classes.labelRight}><Typography variant='caption'>Sets</Typography></Box>
                </Stack>
                <Stack direction='row' className={classes.valueGroupEnd}>
                    <Typography className={classes.valueItem} variant='subtitle1'>{exercise.rest}</Typography><Box className={classes.labelRight}><Typography variant='caption'>Seconds Rest</Typography></Box>
                </Stack>
            </Stack>
            <Stack direction='row' className={classes.group}>
                <Box><Typography>Tempo</Typography></Box>
                <Box><Typography variant='subtitle1'>{exercise.tempo?.[0]}-{exercise.tempo?.[1]}-{exercise.tempo?.[2]}-{exercise.tempo?.[3]}</Typography></Box>
            </Stack>
       </Stack>
    </Box>
}

export default ExerciseCard