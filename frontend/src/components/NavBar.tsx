import { Add } from "@mui/icons-material";
import { AppBar, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react"

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
}

const NavBar: FC<NavBarProps> = ({selectedList, setSelectedList, handleAddButtonClick}) => {
    const handleListChange = (event: SelectChangeEvent) => {
        setSelectedList(event.target.value);
    };
    const classes = useStyles()
    return <>
      <AppBar color='secondary' position="static">
        <Toolbar>
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