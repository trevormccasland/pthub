import { FC, useState } from "react"
import { Exercise } from "../types"
import { Box, Button, Container, Divider, Stack, TextField, Typography } from "@mui/material"
import exerciseServiceClient from "../services/exerciseServiceClient"
import { makeStyles } from "@mui/styles"
import ReactPlayer from 'react-player' // Import ReactPlayer

interface ExercisePageProps {
  exercise: Exercise
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
  or: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  verticalTextField: {
    margin: '0.5rem'
  },
  tempoRow: {
    margin: '0.5rem'
  },
  tempoField: {
    width: '70px',
  },
  actionRow: {
    marginTop: '1rem',

  },
  container: {
    width: '80%'
  },
  videoContainer:{
    marginTop: '1rem',
    display:'flex',
    justifyContent:'center',
  }
})

const ExercisePage: FC<ExercisePageProps> = ({ exercise }) => {
  const classes = useStyles()
  const [updates, setUpdates] = useState<Exercise>({ ...exercise });
  const onSave = async () => {
    await exerciseServiceClient.updateExercise(updates)
  }

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdates((prev) => ({ ...prev, url: e.target.value }));
  };

  return <Container className={classes.container}>
    <Stack direction='column'>
      <Box className={classes.title}>
        <Typography variant='h3'>Exercise Page</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box>
        <TextField className={classes.verticalTextField} label='Name' value={updates.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, name: e.target.value }))} />
      </Box>
      <Box>
        <TextField className={classes.verticalTextField} label='Load' type='number' value={updates.load} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, load: parseInt(e.target.value) }))} />
      </Box>
      <Stack direction='row'>
        <Box>
          <TextField className={classes.verticalTextField} label='Reps' type='number' value={updates.reps ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, time: null, reps: parseInt(e.target.value) }))} />
        </Box>
        <Typography className={classes.or}>OR</Typography>
        <Box>
          <TextField className={classes.verticalTextField} label='Time' type='number' value={updates.time ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, reps: null, time: parseInt(e.target.value) }))} />
        </Box>
      </Stack>
      <Box>
        <TextField className={classes.verticalTextField} label='Sets' type='number' value={updates.sets} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, time: parseInt(e.target.value) }))} />
      </Box>
      <Box>
        <TextField className={classes.verticalTextField} label='Rest in Seconds' type='number' value={updates.rest} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, time: parseInt(e.target.value) }))} />
      </Box>
      <Stack direction='column'>
        <Box><Typography>Tempo</Typography></Box>
        <Stack className={classes.tempoRow} direction='row' spacing={2}>
          <TextField className={classes.tempoField} size='small' type='number' label='E' value={updates.tempo?.[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, tempo: [parseInt(e.target.value), prev?.tempo?.[1] ?? -1, prev?.tempo?.[2] ?? -1, prev?.tempo?.[3] ?? -1] }))} />
          <TextField className={classes.tempoField} size='small' type='number' label='EH' value={updates.tempo?.[1] === -1 ? null : updates.tempo?.[1]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, tempo: [prev?.tempo?.[0] ?? -1, parseInt(e.target.value), prev?.tempo?.[2] ?? -1, prev?.tempo?.[3] ?? -1] }))} />
          <TextField className={classes.tempoField} size='small' type='number' label='C' value={updates.tempo?.[2] === -1 ? null : updates.tempo?.[2]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, tempo: [prev?.tempo?.[0] ?? -1, prev?.tempo?.[1] ?? -1, parseInt(e.target.value), prev?.tempo?.[3] ?? -1] }))} />
          <TextField className={classes.tempoField} size='small' type='number' label='CH' value={updates.tempo?.[3] === -1 ? null : updates.tempo?.[3]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdates((prev) => ({ ...prev, tempo: [prev?.tempo?.[0] ?? -1, prev?.tempo?.[1] ?? -1, prev?.tempo?.[2] ?? -1, parseInt(e.target.value)] }))} />
        </Stack>
      </Stack>
      <Box>
        <TextField fullWidth className={classes.verticalTextField} label='Youtube Link' value={updates.url || ''} onChange={handleYoutubeLinkChange} />
      </Box>
      {updates.url && (
        <Box className={classes.videoContainer}>
           <ReactPlayer url={updates.url} controls width="560px" height="315px"/>
        </Box>
      )}
      <Stack className={classes.actionRow} direction='row-reverse' spacing={2}>
        <Button variant="contained" onClick={onSave}>Save</Button>
        <Button variant='outlined' onClick={() => setUpdates({ ...exercise })}>Reset</Button>
      </Stack>
    </Stack>
  </Container>
}

export default ExercisePage