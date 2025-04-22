import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
} from '@mui/material';
import userServiceClient from '../services/userServiceClient';
import { Page, User, UserRole } from '../types';

interface UserFormProps {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setPage: React.Dispatch<React.SetStateAction<Page>>
}

const UserForm: React.FC<UserFormProps> = ({user, setUser, setPage}) => {
  const [formData, setFormData] = useState<User>(user ?? {
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
    clients: []
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'role' ? UserRole[value as keyof typeof UserRole] : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id !== undefined && user?.id !== null) {
      await userServiceClient.updateUsers([formData]);
      setUser(formData)
      setPage('default')
      return
    }
    const newUser = await userServiceClient.createUser(formData)
    setUser(newUser)
    setPage('default')
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="First Name"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Last Name"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
        required
        fullWidth
      />
      <RadioGroup
        name="role"
        value={formData.role}
        onChange={handleChange}
        row
      >
        <FormControlLabel value="USER" control={<Radio />} label="User" />
        <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
        <FormControlLabel value="TRAINER" control={<Radio />} label="Trainer" />
      </RadioGroup>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {user?.id !== undefined && user?.id !== null ? 'Update' : 'Create' } User
      </Button>
    </Box>
  );
};

export default UserForm;