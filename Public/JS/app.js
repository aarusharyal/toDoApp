// Get the current date and parse it as a string.

const dateElement = document.getElementById("appDate");
const currentDate = new Date();
dateElement.textContent = currentDate.toDateString();

// Get the task form and add an event listener for the submit event
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const taskInput = document.getElementById("taskInput").value;
    const taskDate = document.getElementById("taskDate").value;

    const newTask = {
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
      } else {
        console.error("Server returned an error.");
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  });
});

// Fetch Data And insert into UL

fetch("/data.json")
  .then((response) => response.json())
  .then((tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "taskItem";
      li.innerHTML = `
        <input type="checkbox" class="task-status" id="task-status-${task.id}">
        <div class="task-details">
          <span class="task-name">${task.task}</span>
          <span class="task-due"><span class="task-due-icon" aria-hidden="true"></span>${task.date}</span>
        </div>
      `;
      taskList.appendChild(li);
    });
  })
  .catch((error) => console.error("Error fetching tasks:", error));
