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
import React, { FC, useEffect, useState } from "react";
import { Activity, Page, Workout, Exercise } from "../types";
import activityServiceClient from "../services/activityServiceClient";
import ActivityCard from "./ActivityCard";
import { ModeEdit, Visibility } from "@mui/icons-material";

interface ActivityListProps {
  setSelectedItem: React.Dispatch<
    React.SetStateAction<Workout | Exercise | Activity | undefined>
  >;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const ActivityList: FC<ActivityListProps> = ({ setSelectedItem, setPage }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [view, setView] = useState({ index: -1, edit: false, view: false });

  useEffect(() => {
    const callGetActivities = async () => {
      const data = await activityServiceClient.getActivities();
      setActivities(data);
    };
    callGetActivities();
  }, []);

  if (view.edit) {
    setPage("activity");
    setSelectedItem(activities[view.index]);
  }

  const handleCloseDialog = () => {
    setView({ index: -1, edit: false, view: false });
  };

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
                  backgroundColor: "grey.200",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {activities.map((activity, i) => (
              <TableRow
                key={activity.name + i}
                sx={{
                  backgroundColor: i % 2 === 0 ? "#ffffffff" : "#fafafa",
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
                  {activity.name}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        setView({ index: i, view: false, edit: true })
                      }
                    >
                      <ModeEdit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        setView({ index: i, view: true, edit: false })
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
        <DialogTitle>Activity Details</DialogTitle>
        <DialogContent>
          {view.index !== -1 && (
            <ActivityCard activity={activities[view.index]} />
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

export default ActivityList;
