"use strict";

// Display current date
const dateElement = document.getElementById("appDate");
const currentDate = new Date();
dateElement.textContent = currentDate.toDateString();

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskListContainer = document.getElementById("taskList");
const emptyStateEl = document.getElementById("empty-state");

let localTasksArray = [];

function showError(message) {
  // Create error notification
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-notification";
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f8d7da;
    color: #721c24;
    padding: 15px 20px;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
    z-index: 1000;
    max-width: 300px;
    word-wrap: break-word;
  `;
  errorDiv.textContent = message;

  document.body.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function showSuccess(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-notification";
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #d4edda;
    color: #155724;
    padding: 15px 20px;
    border-radius: 4px;
    border: 1px solid #c3e6cb;
    z-index: 1000;
    max-width: 300px;
    word-wrap: break-word;
  `;
  successDiv.textContent = message;

  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

function validateTaskInput() {
  const inputValue = taskInput.value;

  // Check if empty
  if (!inputValue || typeof inputValue !== "string") {
    return "Task input is required";
  }

  // Check if only whitespace
  const trimmedValue = inputValue.trim();
  if (trimmedValue.length === 0) {
    return "Task cannot be empty or contain only whitespace";
  }

  // Check max length
  if (trimmedValue.length > 500) {
    return "Task cannot exceed 500 characters";
  }

  // Validate date if provided
  if (taskDate.value) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(taskDate.value)) {
      return "Invalid date format";
    }
  }

  return null; // No errors
}

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Validate input before sending
  const validationError = validateTaskInput();
  if (validationError) {
    showError(validationError);
    taskInput.focus(); // Focus back on input
    return;
  }

  const newTask = {
    task: taskInput.value.trim(),
    date: taskDate.value || "",
    // NOTE: Server will generate the ID (UUID)
    // Frontend no longer sends ID
  };

  try {
    // FIX #6: Use relative URL instead of hardcoded localhost
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const createdTask = await response.json();
    console.log("✅ Task created successfully:", createdTask);

    // Clear form and reload tasks
    taskForm.reset();
    showSuccess("Task added successfully!");
    await loadTasks();
  } catch (error) {
    console.error("❌ Failed to create task:", error);
    showError(`Failed to add task: ${error.message}`);
  }
});

function updateCounts() {
  const taskCountEl = document.getElementById("task-count");
  const remainingEl = document.getElementById("tasks-remaining-count");

  taskCountEl.textContent = localTasksArray.length;
  remainingEl.textContent = localTasksArray.filter((t) => !t.completed).length;
  emptyStateEl.hidden = localTasksArray.length > 0;
}

async function loadTasks() {
  try {
    // FIX #6: Relative URL
    const response = await fetch("/tasks.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load tasks`);
    }

    localTasksArray = await response.json();

    // Validate data structure
    if (!Array.isArray(localTasksArray)) {
      console.error("Tasks data is not an array:", localTasksArray);
      localTasksArray = [];
    }

    renderTaskList();
    updateCounts();
  } catch (error) {
    console.error("❌ Error loading tasks:", error);
    taskListContainer.innerHTML = "";
    showError(`Failed to load tasks: ${error.message}`);
    emptyStateEl.hidden = false;
  }
}

function renderTaskList() {
  taskListContainer.innerHTML = ""; // Clear existing list

  localTasksArray.forEach((taskItem) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = taskItem.id;

    // Checkbox for completion status
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-status";
    checkbox.checked = Boolean(taskItem.completed);

    // Task details container
    const details = document.createElement("div");
    details.className = "task-details";

    // Task name span
    const nameSpan = document.createElement("span");
    nameSpan.className = "task-name";
    nameSpan.textContent = taskItem.task; // textContent prevents XSS

    // Due date span
    const dateSpan = document.createElement("span");
    dateSpan.className = "task-due";
    dateSpan.textContent = taskItem.date || "(no date)";

    details.appendChild(nameSpan);
    details.appendChild(dateSpan);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.title = "Delete task";

    // FIX #4: Add delete button click handler
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // Confirm deletion
      if (!confirm("Are you sure you want to delete this task?")) {
        return;
      }

      try {
        // FIX #6: Relative URL
        const response = await fetch(`/api/tasks/${taskItem.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to delete task`);
        }

        console.log("✅ Task deleted successfully:", taskItem.id);
        showSuccess("Task deleted!");
        await loadTasks();
      } catch (error) {
        console.error("❌ Failed to delete task:", error);
        showError(`Failed to delete task: ${error.message}`);
      }
    });

    // Assemble task item
    li.appendChild(checkbox);
    li.appendChild(details);
    li.appendChild(deleteBtn);

    taskListContainer.appendChild(li);
  });
}
taskListContainer.addEventListener("change", async function (event) {
  if (!event.target.classList.contains("task-status")) return;

  const li = event.target.closest(".task-item");
  const taskId = li.dataset.id;
  const completed = event.target.checked;

  try {
    // FIX #6: Relative URL
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update task`);
    }

    // Update local array
    const task = localTasksArray.find((t) => t.id === taskId);
    if (task) {
      task.completed = completed;
    }

    updateCounts();
    console.log("✅ Task updated:", taskId);
  } catch (error) {
    console.error("❌ Failed to update task:", error);
    event.target.checked = !completed; // Revert checkbox
    showError(`Failed to update task: ${error.message}`);
  }
});

async function loadUserData() {
  const greetingEl = document.getElementById("user-greeting");

  try {
    // Call the getSession endpoint from your authController
    const response = await fetch("/session");

    if (!response.ok) {
      throw new Error("Failed to fetch session");
    }

    const data = await response.json();

    // If authenticated, update the text to the username
    if (data.authenticated && data.user) {
      greetingEl.textContent = data.user.username;
      // Note: You could also use data.user.fullname if you prefer!
    } else {
      greetingEl.textContent = "My Tasks"; // Fallback if logged out
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
    greetingEl.textContent = "My Tasks"; // Fallback on error
  }
}

// Load tasks on page load
loadTasks();

// Load user data
loadUserData();
