import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Page, User, UserRole } from '../types';
import userServiceClient from '../services/userServiceClient';

interface LoginPageProps {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

// in the future we will use a login service to authenticate the user
const LoginPage: React.FC<LoginPageProps> = ({ setUser, setPage }) => {
  const [formData, setFormData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    isActive: true,
    clients: [],
    instagramHandle: '',
  });
  const [users, setUsers] = useState<User[]>([])
  
  useEffect(() => {
    const fetchUsers = async () => {
        try {
        const users = await userServiceClient.getUsers();
        setUsers(users);
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    };
    fetchUsers();
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    const user = users.find((user) => user.email === formData.email);
    if (user) {
      setUser(user);
      setPage('default');
    } else {
      alert('User not found!');
    }
  }, [setPage, setUser, formData.email, users]);
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
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Login
      </Typography>
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" textAlign="center">
          Don't have an account?{' '}
          <Button variant="text" color="secondary" onClick={() => setPage('signup')}>
            Sign Up
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginPage;