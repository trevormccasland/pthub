import { AccountCircle, Add } from "@mui/icons-material";
import { AppBar, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react"
import { User } from "../types";

const useStyles = makeStyles({
    title: {
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})

interface NavBarProps {
    selectedList: string;
    setSelectedList: (list: string) => void;
    handleAddButtonClick: () => void;
    user: User
    setIsUserEdit: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar: FC<NavBarProps> = ({selectedList, setSelectedList, handleAddButtonClick, user, setIsUserEdit}) => {
    const handleListChange = (event: SelectChangeEvent) => {
        setSelectedList(event.target.value);
    };
    const classes = useStyles()
    return <>
      <AppBar color='secondary' position="static">
        <Toolbar>
          {user.id !== null && user.id !== undefined && <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'primary.main',
              }
            }}
            onClick={() => setIsUserEdit(true)}
          >
            <AccountCircle />
            <Typography variant="h6">{user.firstName}</Typography>
          </Box>}
          <Box className={classes.title}>
            <Button color='primary' startIcon={<Add />} onClick={handleAddButtonClick}>
              {selectedList}
            </Button>
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