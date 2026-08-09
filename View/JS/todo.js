// Get the current date and parse it as a string.

const dateElement = document.getElementById("appDate");
const currentDate = new Date();
dateElement.textContent = currentDate.toDateString();

// Get the task form and add an event listener for the submit event
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const highestId = localTasksArray.reduce((max, task) => {
    const parsed = parseInt(task.id, 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);
  const nextNumericId = highestId + 1;
  const formattedId = String(nextNumericId).padStart(2, "0");
  const taskInput = document.getElementById("taskInput").value;
  const taskDate = document.getElementById("taskDate").value;

  const newTask = {
    id: formattedId,
    task: taskInput,
    date: taskDate,
  };

  try {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      console.log("Data successfully sent!");
      taskForm.reset();
      await loadTasks();
    } else {
      console.error("Server returned an error.");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
});

// Fetch Data And insert into UL
let localTasksArray = [];

function updateCounts() {
  const taskCountEl = document.getElementById("task-count");
  const remainingEl = document.getElementById("tasks-remaining-count");
  const emptyStateEl = document.getElementById("empty-state");

  taskCountEl.textContent = localTasksArray.length;
  remainingEl.textContent = localTasksArray.filter((t) => !t.completed).length;
  emptyStateEl.hidden = localTasksArray.length !== 0;
}

async function loadTasks() {
  const taskListContainer = document.getElementById("taskList");
  // const listcontainer = document.getElementById("taskList");

  try {
    const response = await fetch("http://localhost:3000/data.json");
    if (!response.ok) {
      throw new Error("Network response error");
    }
    localTasksArray = await response.json();
    taskListContainer.innerHTML = "";
    localTasksArray.forEach((taskItem) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = taskItem.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-status";
      checkbox.checked = Boolean(taskItem.completed);

      const details = document.createElement("div");
      details.className = "task-details";

      const nameSpan = document.createElement("span");
      nameSpan.className = "task-name";
      nameSpan.textContent = taskItem.task;

      const dateSpan = document.createElement("span");
      dateSpan.className = "task-due";
      dateSpan.textContent = taskItem.date;

      details.appendChild(nameSpan);
      details.appendChild(dateSpan);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "&times;";

      li.appendChild(checkbox);
      li.appendChild(details);
      li.appendChild(deleteBtn);

      taskListContainer.appendChild(li);
    });
    updateCounts();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    taskListContainer.innerHTML = "<li>Error loading tasks</li>";
  }
}

// Mark a task done/undone: listen once on the container, since the <li>s
// get rebuilt every time loadTasks() runs (event delegation survives that)
const taskListContainer = document.getElementById("taskList");
taskListContainer.addEventListener("change", async function (event) {
  if (!event.target.classList.contains("task-status")) return;

  const li = event.target.closest(".task-item");
  const id = li.dataset.id;
  const completed = event.target.checked;

  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      console.error("Failed to update task status.");
      event.target.checked = !completed; // revert the checkbox on failure
      return;
    }

    const task = localTasksArray.find((t) => t.id === id);
    if (task) task.completed = completed;
    updateCounts();
  } catch (error) {
    console.error("Fetch failed:", error);
    event.target.checked = !completed;
  }
});
loadTasks();
