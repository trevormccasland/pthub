import React, { useState, FC } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Stack, Button } from '@mui/material';
import ActivityList from "./components/ActivityList"; 
import ExerciseList from "./components/ExerciseList";
import WorkoutList from "./components/WorkoutList";
import { Add } from '@mui/icons-material';
import ActivityPage from './components/ActivityPage';
import ExercisePage from './components/ExercisePage';
import WorkoutPage from './components/WorkoutPage';

const App: FC = () => {
  const [selectedList, setSelectedList] = useState<string>('workout');
  const [action, setAction] = useState<string>('')

  const handleListChange = (event: SelectChangeEvent) => {
    setSelectedList(event.target.value);
  };

  const handleAddButtonClick = () => {
    setAction(selectedList)
  };
  if (action === 'activity') return <ActivityPage add activity={{name: 'changeme', group: [], type: 'total body'}} />
  if (action === 'exercise') return <ExercisePage add exercise={{name: 'changeme', level: 'stabilization', type: 'balance'}} />
  if (action === 'workout') return <WorkoutPage add workout={{name: 'changeme', warmup: [], work: [], cooldown: [], type: 'straight set'}} />
  return (
    <>
      <Stack>
        <Stack direction='row'>
          <Button startIcon={<Add />} onClick={handleAddButtonClick}>{selectedList}</Button>
        </Stack>
        <FormControl fullWidth>
          <InputLabel id="list-select-label">Select List</InputLabel>
          <Select
            labelId="list-select-label"
            id="list-select"
            value={selectedList}
            label="Select List"
            onChange={handleListChange}
          >
            <MenuItem value={'activity'}>Activity List</MenuItem>
            <MenuItem value={'exercise'}>Exercise List</MenuItem>
            <MenuItem value={'workout'}>Workout List</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {selectedList === 'activity' && <ActivityList />}
      {selectedList === 'exercise' && <ExerciseList />}
      {selectedList === 'workout' && <WorkoutList />}
    </>
  );
};

export default App;
