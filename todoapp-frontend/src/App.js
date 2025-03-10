import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Typography,
  Paper,
  Chip,
  Table,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import client from "./api/server";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

const TaskPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

const HighPriorityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: 10,
}));

const MediumPriorityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.dark,
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: 10,
}));

const LowPriorityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: 10,
}));

const priorityChip = (priority) => {
  switch (priority) {
    case "low":
      return <LowPriorityChip label={`${priority} priority`} />;
    case "medium":
      return <MediumPriorityChip label={`${priority} priority`} />;
    default:
      return <HighPriorityChip label={`${priority} priority`} />;
  }
};

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = (notifcationAfterExecute=true) => {
    client
      .get("/api/tasks?filter[completed]=false") // Treat incompleted tasks as the default
      .then((response) => {
        setTasks(response.data.data);
        if (notifcationAfterExecute) {
          toast.success("Get data successfully!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTaskComplete = (id, complete) => {
    client.put(`/api/tasks/${id}`, {
      data: {
        id: id,
        type: 'tasks',
        attributes: {
          completed: complete
        }
      },
    }).then(response => {
      toast.success("Update record successfully!");
      getTasks(false)
    }).catch(error => {
      console.log(error)
    })
  };

  return (
    <div>
      <TaskPaper>
        <Typography variant="h6" fontWeight={"bold"}>
          Tasks
        </Typography>
        <Table aria-labelledby="Tasks">
          {tasks.map((task, index) => {
            let task_data = task.attributes;
            return (
              <TableRow
                hover
                role="checkbox"
                key={index}
                sx={{ cursor: "pointer", border: "none" }}
              >
                <TableCell padding="checkbox">
                  {!task_data.completed && <Checkbox key={index} color="primary" onClick={(event) => updateTaskComplete(task.id, event.target.value)} />
                }
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography fontWeight={"bold"}>
                      {task_data.title}
                    </Typography>
                    <Typography>{task.attributes.sub_title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{priorityChip(task_data.priority)}</TableCell>
                <TableCell>
                  <Chip
                    icon={<AccessTimeIcon style={{ marginRight: 2 }} />}
                    label={moment(task_data.due_date)
                      .format("ddd, DD MMM YYYY, h:mma")
                      .toString()}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </TaskPaper>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
