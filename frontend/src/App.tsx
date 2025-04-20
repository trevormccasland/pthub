import React, { useState, FC } from 'react';
import ActivityList from "./components/ActivityList"; 
import ExerciseList from "./components/ExerciseList";
import WorkoutList from "./components/WorkoutList";
import ActivityPage from './components/ActivityPage';
import ExercisePage from './components/ExercisePage';
import WorkoutPage from './components/WorkoutPage';
import NavBar from './components/NavBar';
import { User, UserRole } from './types';
import UserForm from './components/UserForm';


const App: FC = () => {
  const [selectedList, setSelectedList] = useState<string>('workout');
  const [action, setAction] = useState<string>('')
  const [isUserEdit, setIsUserEdit] = useState<boolean>(false)
  const [user, setUser] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
  })

  const handleAddButtonClick = () => {
    setAction(selectedList)
  };
  console.log({user})
  if (user.id === undefined || user.id === null) {
    return (
      <div>
        <h1>Welcome to PT Hub</h1>
        <p>Please create an account.</p>
        <UserForm setUser={setUser}/>
      </div>
    );
  }
  if (isUserEdit) {
    return (
      <div>
        <h1>Edit User</h1>
        <p>Please edit your account.</p>
        <UserForm user={user} setUser={setUser} />
      </div>
    );
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
        setIsUserEdit={setIsUserEdit}
      />
      {selectedList === 'activity' && <ActivityList />}
      {selectedList === 'exercise' && <ExerciseList />}
      {selectedList === 'workout' && <WorkoutList />}
    </>
  );
};

export default App;
