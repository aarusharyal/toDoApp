import path from "path";
import fs from "fs";

export const getLogin = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/login.html");
  res.sendFile(absoluteValue);
};

export const getRegister = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/register.html");
  res.sendFile(absoluteValue);
};

export const getTodo = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/todo.html");
  res.sendFile(absoluteValue);
};

export const apiTasks = (req, res) => {
  const newTask = { completed: false, ...req.body };
  console.log("Received task:", newTask);
  fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
    let tasks = [];
    if (!err && data) {
      tasks = JSON.parse(data);
    }
    tasks.push(newTask);
    fs.writeFile("./model/tasks.json", JSON.stringify(tasks), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send("Error Saving Task");
      } else {
        console.log("Task saved successfully.");
        res.status(201).json(newTask);
      }
    });
  });
};
