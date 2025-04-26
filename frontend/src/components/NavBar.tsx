import { AccountCircle, Add, AddModeratorRounded, Diversity1, MedicalServices } from "@mui/icons-material";
import { AppBar, Box, FormControl, MenuItem, Select, SelectChangeEvent, Stack, Toolbar, Typography } from "@mui/material";
import { FC } from "react"
import { Page, User, UserRole } from "../types";

interface NavBarProps {
    selectedList: string;
    setSelectedList: (list: string) => void;
    handleAddButtonClick: () => void;
    user: User
    setPage: React.Dispatch<React.SetStateAction<Page>>
}
const hoverStyle = {
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: 'primary.main',
  },
  marginRight: '2rem'
}
const NavBar: FC<NavBarProps> = ({selectedList, setSelectedList, handleAddButtonClick, user, setPage}) => {
    const handleListChange = (event: SelectChangeEvent) => {
        setSelectedList(event.target.value);
    };
    return <>
      <AppBar color='secondary' position="static">
        <Toolbar>
          {user.id !== null && user.id !== undefined && <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={hoverStyle}
            onClick={() => setPage('profile')}
          >
            <AccountCircle />
            <Typography variant="h6">{user.firstName}</Typography>
          </Box>}
          {user.role === UserRole.ADMIN && <Box
            display='flex'
            alignItems='center'
            gap={1}
            sx={hoverStyle}
            onClick={() => setPage('assignments')}>
              <AddModeratorRounded />
              <Typography variant="h6">Assignments</Typography>
          </Box>}
          <Box
            display='flex'
            alignItems='center'
            gap={1}
            sx={hoverStyle}
            onClick={() => setPage('trainers')}>
              <Diversity1 />
              <Typography variant="h6">Trainers</Typography>
          </Box>
          {user.clients && <Box
            display='flex'
            alignItems='center'
            gap={1}
            sx={hoverStyle}
            onClick={() => setPage('clients')}>
              <MedicalServices />
              <Typography variant="h6">Clients</Typography>
          </Box>}
          <Box display='flex' alignItems='center' sx={hoverStyle} onClick={handleAddButtonClick}>
            <Typography variant="h6">{selectedList.toUpperCase()}</Typography>
            <Add />
          </Box>
        </Toolbar>
      </AppBar>
      <Stack>
          <FormControl fullWidth>
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
    </>
}

export default NavBar