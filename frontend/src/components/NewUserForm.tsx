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
import { User, UserRole } from '../types';

interface NewUserFormProps {
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const NewUserForm: React.FC<NewUserFormProps> = ({setUser}) => {
  const [formData, setFormData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
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
    const user = await userServiceClient.createUser(formData)
    setUser(user)
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
        <FormControlLabel value="user" control={<Radio />} label="User" />
        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        <FormControlLabel value="trainer" control={<Radio />} label="Trainer" />
      </RadioGroup>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Create User
      </Button>
    </Box>
  );
};

export default NewUserForm;