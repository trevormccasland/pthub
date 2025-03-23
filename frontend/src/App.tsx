import React, { useState, FC } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import ActivityList from "./components/ActivityList"; 
import ExerciseList from "./components/ExerciseList";
import WorkoutList from "./components/WorkoutList";

const App: FC = () => {
  const [selectedList, setSelectedList] = useState<string>('workout');

  const handleListChange = (event: SelectChangeEvent) => {
    setSelectedList(event.target.value);
  };

  return (
    <>
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

      {selectedList === 'activity' && <ActivityList />}
      {selectedList === 'exercise' && <ExerciseList />}
      {selectedList === 'workout' && <WorkoutList />}
    </>
  );
};

export default App;
