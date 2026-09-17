import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid"; // NEW: For secure ID generation

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

function sanitizeInput(input) {
  if (!input || typeof input !== "string") return "";

  const htmlEscapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char]);
}
function validateTask(taskInput, taskDate) {
  // Check if task input exists and is not just whitespace
  if (!taskInput || typeof taskInput !== "string") {
    return "Task input is required";
  }

  const trimmedTask = taskInput.trim();

  if (trimmedTask.length === 0) {
    return "Task cannot be empty or contain only whitespace";
  }

  if (trimmedTask.length > 500) {
    return "Task cannot exceed 500 characters";
  }

  // Validate date if provided
  if (taskDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!dateRegex.test(taskDate)) {
      return "Invalid date format";
    }

    // Check if date is not in the past
    const inputDate = new Date(taskDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return "Date cannot be in the past";
    }
  }

  return null;
  //If no ewrors, return null
}

export const apiTasks = (req, res) => {
  const userId = req.session.user.id; // Always from session, never from body
  const { task: taskInput, date: taskDate } = req.body;

  // VALIDATION FIX: Check for empty input
  const validationError = validateTask(taskInput, taskDate);
  if (validationError) {
    return res.status(400).json({
      error: validationError,
      code: "INVALID_INPUT",
    });
  }
  const sanitizedTask = sanitizeInput(taskInput.trim());

  const newTask = {
    id: uuidv4(),
    task: sanitizedTask,
    date: taskDate || "",
    userId: userId,
    completed: false,
    createdAt: new Date().toISOString(), // Track when task was created
  };

  console.log("Creating task for user:", userId, "Task:", sanitizedTask);

  fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
    let tasks = [];

    // Handle file read errors
    if (err && err.code !== "ENOENT") {
      console.error("Error reading tasks file:", err);
      return res.status(500).json({
        error: "Failed to read tasks",
        code: "FILE_READ_ERROR",
      });
    }

    // Parse existing tasks
    if (!err && data) {
      try {
        tasks = JSON.parse(data);
        if (!Array.isArray(tasks)) {
          tasks = [];
        }
      } catch (parseError) {
        console.error("Error parsing tasks JSON:", parseError);
        return res.status(500).json({
          error: "Corrupted tasks file",
          code: "JSON_PARSE_ERROR",
        });
      }
    }

    // Add new task
    tasks.push(newTask);

    // Write to file
    fs.writeFile(
      "./model/tasks.json",
      JSON.stringify(tasks, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing tasks file:", writeErr);
          return res.status(500).json({
            error: "Failed to save task",
            code: "FILE_WRITE_ERROR",
          });
        }

        console.log("Task saved successfully:", newTask.id);

        // Return created task (without userId for security)
        res.status(201).json({
          id: newTask.id,
          task: newTask.task,
          date: newTask.date,
          completed: newTask.completed,
          createdAt: newTask.createdAt,
        });
      },
    );
  });
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  // Validate ID format (must be UUID)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      error: "Invalid task ID format",
      code: "INVALID_ID",
    });
  }

  fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading tasks file:", err);
      return res.status(500).json({
        error: "Failed to read tasks",
        code: "FILE_READ_ERROR",
      });
    }

    let tasks = [];
    try {
      tasks = JSON.parse(data || "[]");
      if (!Array.isArray(tasks)) {
        tasks = [];
      }
    } catch (parseError) {
      console.error("Error parsing tasks JSON:", parseError);
      return res.status(500).json({
        error: "Corrupted tasks file",
        code: "JSON_PARSE_ERROR",
      });
    }

    // Find task and ensure it belongs to the user
    const taskIndex = tasks.findIndex(
      (t) => t.id === id && t.userId === userId,
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        error: "Task not found",
        code: "TASK_NOT_FOUND",
      });
    }

    // Remove task from array
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    // Write updated tasks back to file
    fs.writeFile(
      "./model/tasks.json",
      JSON.stringify(tasks, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing tasks file:", writeErr);
          return res.status(500).json({
            error: "Failed to delete task",
            code: "FILE_WRITE_ERROR",
          });
        }

        console.log("Task deleted successfully:", id);

        res.status(200).json({
          message: "Task deleted successfully",
          id: deletedTask.id,
        });
      },
    );
  });
};
