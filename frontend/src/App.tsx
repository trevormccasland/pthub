import React, { useState, FC, useCallback } from 'react';
import ActivityList from "./components/ActivityList"; 
import ExerciseList from "./components/ExerciseList";
import WorkoutList from "./components/WorkoutList";
import ActivityPage from './pages/ActivityPage';
import ExercisePage from './pages/ExercisePage';
import WorkoutPage from './pages/WorkoutPage';
import NavBar from './components/NavBar';
import { Activity, Exercise, Page, User, UserRole, Workout } from './types';
import UserForm from './components/UserForm';
import { Box, Typography } from '@mui/material';
import AssignmentPage from './pages/AssignmentPage';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import TrainerGrid from './components/TrainerGrid';


const App: FC = () => {
  const [selectedList, setSelectedList] = useState<string>('workout');
  const [selectedItem, setSelectedItem] = useState<Workout | Exercise | Activity>();
  const [action, setAction] = useState<string>('')
  const [page, setPage] = useState<Page>('login')
  const [user, setUser] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
    clients: [],
    instagramHandle: ''
  })

  const handleAddButtonClick = () => {
    setAction(selectedList)
  };

  
  const getComponent = () => useCallback(() => {
    let component = <></>;
    if (page === 'signup') {
      component = (
        <Box>
          <Typography variant='h1'>Welcome to PT Hub</Typography>
          <Typography variant='body1'>Please create an account.</Typography>
          <UserForm setUser={setUser} setPage={setPage}/>
        </Box>
      );
    }
    else if (page === 'profile') {
      component = (
        <Box>
          <Typography variant='h1'>Edit User</Typography>
          <Typography variant='body1'>Please edit your account.</Typography>
          <UserForm user={user} setUser={setUser} setPage={setPage} />
        </Box>
      );
    }
    else if (page === 'assignments') {
      component = (
        <Box>
          <Typography variant='h1'>Trainer Client Assignments</Typography>
          <Typography variant='body1'>Match clients with trainers here.</Typography>
          <AssignmentPage />
        </Box>
      )
    }
    else if (page === 'trainers') {
      component = (
        <Box>
          <Typography variant='h1'>Trainers</Typography>
          <Typography variant='body1'>View and manage your trainers here.</Typography>
          <TrainerGrid user={user} />
        </Box>
      )
    }
    else if (page === 'clients') {
      component = (
        <Box>
          <Typography variant='h1'>Clients</Typography>
          <Typography variant='body1'>View and manage your clients here.</Typography>
          <ClientsPage user={user} setPage={setPage} />
        </Box>
      )
    }
    else if (page === 'workout' ) {
      component = <WorkoutPage workout={selectedItem as Workout} />
    }
    else if (page === 'exercise') {
      component = <ExercisePage exercise={selectedItem as Exercise} />
    }
    else if (page === 'activity') {
      component = <ActivityPage activity={selectedItem as Activity} />
    }
    else if (action === 'activity' && page === 'default') {
      component = <ActivityPage add activity={{name: 'changeme', group: [], type: 'total body'}} />
    }
    else if (action === 'exercise' && page === 'default') {
      component = <ExercisePage add exercise={{name: 'changeme', level: 'stabilization', type: 'balance'}} />
    }
    else if (action === 'workout' && page === 'default') {
      component = <WorkoutPage add workout={{name: 'changeme', warmup: [], work: [], cooldown: [], type: 'straight set'}} />
    }
    else if (action === 'activity') {
      component = <ActivityPage add activity={{name: 'changeme', group: [], type: 'total body'}} />
    }
    else if (action === 'exercise') {
      component = <ExercisePage add exercise={{name: 'changeme', level: 'stabilization', type: 'balance'}} />
    }
    else if (action === 'workout') {
      component = <WorkoutPage add workout={{name: 'changeme', warmup: [], work: [], cooldown: [], type: 'straight set'}} />
    }
    else if (selectedList === 'activity') {
      component = <ActivityList setSelectedItem={setSelectedItem} setPage={setPage} />
    }
    else if (selectedList === 'exercise') {
      component = <ExerciseList setSelectedItem={setSelectedItem} setPage={setPage} />
    }
    else if (selectedList === 'workout') {
      component = <WorkoutList setSelectedItem={setSelectedItem} setPage={setPage} />
    }
    return (
      <>
        <NavBar 
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          handleAddButtonClick={handleAddButtonClick}
          user={user}
          setPage={setPage}
        />
        {component}
      </>
    )
  }, [selectedList, action, page, user, setUser, setPage]);
  const Component = getComponent()

  return page === 'login' ? <LoginPage setUser={setUser} setPage={setPage}/> : <Component />
};

export default App;
