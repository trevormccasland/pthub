import React, { useState, FC } from 'react';
import ActivityList from "./components/ActivityList"; 
import ExerciseList from "./components/ExerciseList";
import WorkoutList from "./components/WorkoutList";
import ActivityPage from './components/ActivityPage';
import ExercisePage from './components/ExercisePage';
import WorkoutPage from './components/WorkoutPage';
import NavBar from './components/NavBar';
import { Page, User, UserRole } from './types';
import UserForm from './components/UserForm';
import { Box, Typography } from '@mui/material';
import AssignmentPage from './components/AssignmentPage';
import LoginPage from './components/LoginPage';
import ClientsPage from './components/ClientsPage';


const App: FC = () => {
  const [selectedList, setSelectedList] = useState<string>('workout');
  const [action, setAction] = useState<string>('')
  const [page, setPage] = useState<Page>('login')
  const [user, setUser] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
    clients: []
  })

  const handleAddButtonClick = () => {
    setAction(selectedList)
  };

  <Typography variant='h1'>Welcome to PT Hub</Typography>
  if (page == 'login') {
    return (
      <LoginPage setUser={setUser} setPage={setPage}/>
    );
  }
  if (page === 'signup') {
    return (
      <div>
        <h1>Welcome to PT Hub</h1>
        <p>Please create an account.</p>
        <UserForm setUser={setUser} setPage={setPage}/>
      </div>
    );
  }
  if (page === 'profile') {
    return (
      <Box>
        <Typography variant='h1'>Edit User</Typography>
        <Typography variant='body1'>Please edit your account.</Typography>
        <UserForm user={user} setUser={setUser} setPage={setPage} />
      </Box>
    );
  }
  if (page === 'assignments') {
    return (
      <Box>
        <Typography variant='h1'>Trainer Client Assignments</Typography>
        <Typography variant='body1'>Match clients with trainers here.</Typography>
        <AssignmentPage />
      </Box>
    )
  }
  if (page === 'clients') {
    return (
      <Box>
        <Typography variant='h1'>Clients</Typography>
        <Typography variant='body1'>View and manage your clients here.</Typography>
        <ClientsPage user={user} setPage={setPage} />
      </Box>
    )
  }
  if (action === 'activity') return <ActivityPage add activity={{name: 'changeme', group: [], type: 'total body'}} />
  if (action === 'exercise') return <ExercisePage add exercise={{name: 'changeme', level: 'stabilization', type: 'balance'}} />
  if (action === 'workout') return <WorkoutPage add workout={{name: 'changeme', warmup: [], work: [], cooldown: [], type: 'straight set'}} />
  return (
    <>
      <NavBar 
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        handleAddButtonClick={handleAddButtonClick}
        user={user}
        setPage={setPage}
      />
      {selectedList === 'activity' && <ActivityList />}
      {selectedList === 'exercise' && <ExerciseList />}
      {selectedList === 'workout' && <WorkoutList />}
    </>
  );
};

export default App;
