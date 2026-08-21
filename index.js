import express from "express";
import app from "./app.js";
import http from "http";
import path from "path";
import fs from "fs";

const PORT = 3000;

app.get("/tasks.json", (req, res) => {
  // fs.readFile("tasks.json", "utf-8", (err, data) => {
  //   if (err) {
  //     if (err.code === "ENOENT") {
  //       return res.json([]);
  //     }
  //     console.error("Error Reading File:", err);
  //     return res.status(500).send("Error Reading File");
  //   }
  //   res.json(data ? JSON.parse(data) : []);
  // });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.post("/api/tasks", (req, res) => {
//   // const newTask = { completed: false, ...req.body };
//   // console.log("Received task:", newTask);
//   // fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
//   //   let tasks = [];
//   //   if (!err && data) {
//   //     tasks = JSON.parse(data);
//   //   }
//   //   tasks.push(newTask);
//   //   fs.writeFile("./model/tasks.json", JSON.stringify(tasks), (err) => {
//   //     if (err) {
//   //       console.error("Error writing to file:", err);
//   //       res.status(500).send("Error Saving Task");
//   //     } else {
//   //       console.log("Task saved successfully.");
//   //       res.status(201).json(newTask);
//   //     }
//   //   });
//   // });
// });

app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error Reading File");
    }
    let tasks = JSON.parse(data || "[]");
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    if (typeof req.body.completed === "boolean") {
      task.completed = req.body.completed;
    }
    fs.writeFile("./model/tasks.json", JSON.stringify(tasks), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).send("Error Saving Task");
      }
      res.json(task);
    });
  });
});
