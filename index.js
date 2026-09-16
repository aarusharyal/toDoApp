import app from "./app.js";
import fs from "fs";
import { requireAuthApi } from "./middleware/requireAuth.js";
import { deleteTask } from "./controller/pageController.js";

const PORT = process.env.PORT || 3000;
app.get("/tasks.json", requireAuthApi, (req, res) => {
  const userId = req.session.user.id;

  fs.readFile("./model/tasks.json", "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File doesn't exist yet - return empty array
        return res.json([]);
      }
      console.error("Error reading tasks file:", err);
      return res.status(500).json({
        error: "Failed to read tasks",
        code: "FILE_READ_ERROR",
      });
    }

    try {
      const tasks = data ? JSON.parse(data) : [];

      if (!Array.isArray(tasks)) {
        return res.status(500).json({
          error: "Tasks data is corrupted",
          code: "DATA_CORRUPTION",
        });
      }

      // SECURITY: Filter to only return tasks belonging to this user
      const userTasks = tasks.filter((task) => task.userId === userId);

      res.json(userTasks);
    } catch (parseError) {
      console.error("Error parsing tasks JSON:", parseError);
      return res.status(500).json({
        error: "Failed to parse tasks",
        code: "JSON_PARSE_ERROR",
      });
    }
  });
});

app.patch("/api/tasks/:id", requireAuthApi, (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;
  const { completed } = req.body;

  // Validate completed is boolean
  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "completed must be a boolean",
      code: "INVALID_COMPLETED_VALUE",
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

    try {
      let tasks = JSON.parse(data || "[]");

      if (!Array.isArray(tasks)) {
        return res.status(500).json({
          error: "Tasks data is corrupted",
          code: "DATA_CORRUPTION",
        });
      }

      // Find task matching both ID AND userId (security check)
      // This prevents users from updating other users' tasks
      const task = tasks.find((t) => t.id === id && t.userId === userId);

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
          code: "TASK_NOT_FOUND",
        });
      }

      // Update completion status
      task.completed = completed;
      task.updatedAt = new Date().toISOString(); // Track when updated

      // Write updated tasks to file
      fs.writeFile(
        "./model/tasks.json",
        JSON.stringify(tasks, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing tasks file:", writeErr);
            return res.status(500).json({
              error: "Failed to update task",
              code: "FILE_WRITE_ERROR",
            });
          }

          console.log("Task updated successfully:", id);

          res.json({
            id: task.id,
            task: task.task,
            date: task.date,
            completed: task.completed,
            updatedAt: task.updatedAt,
          });
        },
      );
    } catch (parseError) {
      console.error("Error parsing tasks JSON:", parseError);
      return res.status(500).json({
        error: "Failed to parse tasks",
        code: "JSON_PARSE_ERROR",
      });
    }
  });
});

app.delete("/api/tasks/:id", requireAuthApi, deleteTask);

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "NOT_FOUND",
    path: req.path,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    code: "INTERNAL_ERROR",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Session storage: ./sessions`);
  console.log(`Tasks storage: ./model/tasks.json`);
  console.log(`Users storage: ./model/data.json`);
});
