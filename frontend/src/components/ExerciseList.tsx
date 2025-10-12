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
import { Exercise, Page, Workout, Activity } from "../types";
import exerciseServiceClient from "../services/exerciseServiceClient";
import ExerciseCard from "./ExerciseCard";
import { ModeEdit, Visibility } from "@mui/icons-material";

interface ExerciseListProps {
  setSelectedItem: React.Dispatch<
    React.SetStateAction<Workout | Exercise | Activity | undefined>
  >;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const ExerciseList: FC<ExerciseListProps> = ({ setSelectedItem, setPage }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [view, setView] = useState({ index: -1, edit: false, view: false });

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await exerciseServiceClient.getExercises();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  if (view.edit) {
    setPage("exercise");
    setSelectedItem(exercises[view.index]);
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
            {exercises.map((exercise, i) => (
              <TableRow
                key={exercise.name + i}
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
                  {exercise.name}
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
        <DialogTitle>Exercise Details</DialogTitle>
        <DialogContent>
          {view.index !== -1 && (
            <ExerciseCard exercise={exercises[view.index]} />
          )}
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

export default ExerciseList;
