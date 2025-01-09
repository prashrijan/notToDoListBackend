import express, { json } from "express";
import taskData from "./data/task.json" assert { type: "json" };
import fs from "fs-extra";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});

// Create the task
app.post("/api/v1/tasks", async (req, res) => {
  const newTask = req.body;
  newTask.id = taskData.length + 1;

  taskData.push(newTask);

  await fs.writeFile("./data/task.json", JSON.stringify(taskData));
  console.log("Task Created Successfully");
  res.send({
    status: 200,
    message: "Task Create Successfully",
    taskData,
  });
});

// Read The task
app.get("/api/v1/tasks", async (req, res) => {
  const tasks = await fs.readFile("./data/task.json");
  res.send(JSON.parse(tasks));
});

// Update task type
app.patch("/api/v1/tasks/type/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);

  const taskToBeUpdated = taskData.find((task) => task.id === parseInt(id));

  taskToBeUpdated.isGood = !taskToBeUpdated.isGood;

  console.log(typeof taskToBeUpdated.isGood);
  await fs.writeFile("./data/task.json", JSON.stringify(taskData));

  res.send({
    status: 200,
    message: "Task Type updated",
    taskData,
  });
});

// Toggle the completed
app.patch("/api/v1/tasks/complete/:id", async (req, res) => {
  const { id } = req.params;

  const taskToBeUpdated = taskData.find((task) => task.id === parseInt(id));

  taskToBeUpdated.isCompleted = !taskToBeUpdated.isCompleted;

  await fs.writeFile("./data/task.json", JSON.stringify(taskData));

  res.send({
    status: 200,
    message: "Task Complete updated",
    taskData,
  });
});

// delete the task
app.delete("/api/v1/tasks/delete/:id", async (req, res) => {
  const { id } = req.params;

  const newTaskData = taskData.filter((task) => task.id !== parseInt(id));

  console.log(newTaskData);
  await fs.writeFile("./data/task.json", JSON.stringify(newTaskData));

  res.send({
    status: 200,
    message: "Task Deleted",
    newTaskData,
  });
});
