import express from "express";
const app = express();
import http from "http";
import path from "path";
import fs from "fs";

const PORT = 3000;
app.use(express.json());

app.use(express.static("Public"));
app.get("/", (req, res) => {
  const absoluteValue = path.resolve("login.html");
  res.sendFile(absoluteValue);
});

app.get("/register.html", (req, res) => {
  const absoluteValue = path.resolve("register.html");
  res.sendFile(absoluteValue);
});
app.get("/login.html", (req, res) => {
  const absoluteValue = path.resolve("login.html");
  res.sendFile(absoluteValue);
});

app.get("/index.html", (req, res) => {
  const absoluteValue = path.resolve("index.html");
  res.sendFile(absoluteValue);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/api/tasks", (req, res) => {
  const newTask = req.body;
  console.log("Received task:", newTask);
  fs.readFile("data.json", "utf-8", (err, data) => {
    let tasks = [];
    if (!err && data) {
      tasks = JSON.parse(data);
      tasks.push(newTask); // ← only pushed inside this if-block
    }
    fs.writeFile("data.json", JSON.stringify(tasks), (err) => {
      //   res.status(201).json(newTask)
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send("Error Saving Task", err);
      } else {
        console.log("Task saved successfully.");
        res.status(201).json(newTask);
      }
    });
  });
});
