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

async function loadTasks() {
  const taskList = document.getElementById("tasklist");

  try {
    const response = await fetch("/data.json");
    if (!response.ok) {
      throw new Error("Network response error");
    }
    const tasks = await response.json();
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");

      li.textContent = task;

      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    listContainer.innerHTML = "<li>Error loading tasks</li>";
  }
}
loadTasks();
