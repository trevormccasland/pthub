import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Workout, Page, Exercise, Activity } from "../types";
import workoutServiceClient from "../services/workoutServiceClient";
import WorkoutCard from "./WorkoutCard";
import { ModeEdit, Visibility } from "@mui/icons-material";

interface WorkoutListProps {
  setSelectedItem: React.Dispatch<
    React.SetStateAction<Workout | Exercise | Activity | undefined>
  >;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const WorkoutList: FC<WorkoutListProps> = ({ setSelectedItem, setPage }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [view, setView] = useState({ index: -1, edit: false, view: false });

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await workoutServiceClient.getWorkouts();
      setWorkouts(data);
    };
    fetchWorkouts();
  }, []);

  if (view.edit) {
    setPage("workout");
    setSelectedItem(workouts[view.index]);
  }

  const handleCloseDialog = () =>
    setView({ index: -1, edit: false, view: false });

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "grey.200",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "grey.200",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout, i) => (
              <TableRow
                key={workout.name + i}
                sx={{
                  backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  "&:hover": {
                    backgroundColor: "#f0f4ff",
                    transform: "scale(1.01)",
                    boxShadow: 2,
                  },
                  cursor: "pointer",
                  borderRadius: 1,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <TableCell
                  align="center"
                  onClick={() => setView({ index: i, view: true, edit: false })}
                  sx={{ paddingY: 1.5, paddingX: 2, fontWeight: 500 }}
                >
                  {workout.name}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        setView({ index: i, edit: true, view: false })
                      }
                    >
                      <ModeEdit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        setView({ index: i, edit: false, view: true })
                      }
                    >
                      <Visibility />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={view.view}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Workout Details</DialogTitle>
        <DialogContent>
          {view.index !== -1 && <WorkoutCard workout={workouts[view.index]} />}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutList;
