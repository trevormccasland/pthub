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
import { Workout, Activity, WorkoutType } from '../types';
import workoutServiceClient from '../services/workoutServiceClient';
import activityServiceClient from '../services/activityServiceClient';

interface WorkoutPageProps {
  workout: Workout;
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

const WorkoutPage: FC<WorkoutPageProps> = ({ workout }) => {
  const classes = useStyles();
  const [updates, setUpdates] = useState<Workout>({ ...workout });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedWarmupActivity, setSelectedWarmupActivity] =
    useState<Activity | null>(null);
  const [selectedWorkActivity, setSelectedWorkActivity] =
    useState<Activity | null>(null);
  const [selectedCooldownActivity, setSelectedCooldownActivity] =
    useState<Activity | null>(null);

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

  const handleAddWarmupActivity = () => {
    if (selectedWarmupActivity) {
      setUpdates((prevWorkout) => ({
        ...prevWorkout,
        warmup: [...prevWorkout.warmup, selectedWarmupActivity],
      }));
      setSelectedWarmupActivity(null);
    }
  };

  const handleAddWorkActivity = () => {
    if (selectedWorkActivity) {
      setUpdates((prevWorkout) => ({
        ...prevWorkout,
        work: [...prevWorkout.work, selectedWorkActivity],
      }));
      setSelectedWorkActivity(null);
    }
  };

  const handleAddCooldownActivity = () => {
    if (selectedCooldownActivity) {
      setUpdates((prevWorkout) => ({
        ...prevWorkout,
        cooldown: [...prevWorkout.cooldown, selectedCooldownActivity],
      }));
      setSelectedCooldownActivity(null);
    }
  };

  const handleRemoveWarmupActivity = (index: number) => {
    setUpdates((prevWorkout) => ({
      ...prevWorkout,
      warmup: prevWorkout.warmup.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveWorkActivity = (index: number) => {
    setUpdates((prevWorkout) => ({
      ...prevWorkout,
      work: prevWorkout.work.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCooldownActivity = (index: number) => {
    setUpdates((prevWorkout) => ({
      ...prevWorkout,
      cooldown: prevWorkout.cooldown.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateWorkout = async () => {
    try {
      await workoutServiceClient.updateWorkout(updates);
      alert('Workout updated successfully!');
    } catch (error) {
      console.error('Error updating workout:', error);
      alert('Failed to update workout.');
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
            value={updates.type}
            onChange={handleTypeChange}
          >
            <option value={'straight set'}>Straight Set</option>
            <option value={'circuit'}>Circuit</option>
          </TextField>
        </Box>

        <Stack direction='column'>
          <Typography variant="h6">Warmup Activities</Typography>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedWarmupActivity}
            onChange={(_, newValue) => setSelectedWarmupActivity(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Warmup Activity" />
            )}
          />
          <Button startIcon={<Add />} onClick={handleAddWarmupActivity}>Add Warmup</Button>
          <Stack direction="column" className={classes.activityList}>
            {updates.warmup.map((activity, i) => (
              <Box key={activity.name + i} className={classes.activityItem}>
                <Typography>{activity.name}</Typography>
                <IconButton onClick={() => handleRemoveWarmupActivity(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Stack direction='column'>
          <Typography variant="h6">Work Activities</Typography>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedWorkActivity}
            onChange={(_, newValue) => setSelectedWorkActivity(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Work Activity" />
            )}
          />
          <Button startIcon={<Add />} onClick={handleAddWorkActivity}>Add Work</Button>
          <Stack direction="column" className={classes.activityList}>
            {updates.work.map((activity, i) => (
              <Box key={activity.name + i} className={classes.activityItem}>
                <Typography>{activity.name}</Typography>
                <IconButton onClick={() => handleRemoveWorkActivity(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Stack direction='column'>
          <Typography variant="h6">Cooldown Activities</Typography>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedCooldownActivity}
            onChange={(_, newValue) => setSelectedCooldownActivity(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Cooldown Activity" />
            )}
          />
          <Button startIcon={<Add />} onClick={handleAddCooldownActivity}>Add Cooldown</Button>
          <Stack direction="column" className={classes.activityList}>
            {updates.cooldown.map((activity, i) => (
              <Box key={activity.name + i} className={classes.activityItem}>
                <Typography>{activity.name}</Typography>
                <IconButton onClick={() => handleRemoveCooldownActivity(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Stack className={classes.actionRow} direction="row-reverse" spacing={2}>
          <Button variant="contained" onClick={handleUpdateWorkout}>
            Update Workout
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default WorkoutPage;
