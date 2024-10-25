var taskCard = document.querySelector(".task-card");
var taskDisplay = document.querySelector(".task-display");

// Close task-display when clicking outside the task card
taskDisplay.addEventListener("click", function (e) {
  if (e.target === taskDisplay) {
    taskDisplay.style.display = "none";
  }
});

// Function to view task details
function view(id) {
  var url = `/admin/api/d/task/${id}`;
  fetch(url)
    .then((result) => result.json())
    .then((res) => {
      // Display task details
      taskDisplay.style.display = "flex";
      taskCard.querySelector("#task-title").innerText = res["result"].Title;
      taskCard.querySelector("#task-duedate").innerText = formatDate(
        res["result"].DueDate
      );
      taskCard.querySelector("#task-members").innerText =
        res["result"].MemberList;
      taskCard.querySelector("#task-created_at").innerText = formatDate(
        res["result"].CreatedAt
      );
      taskCard.querySelector("#task-description").innerText =
        res["result"].Description;
      taskCard.querySelector("#task-status-text").setAttribute("data-id", id);
      taskCard.querySelector("#task-status-text").innerText = getStatusString(
        res["result"].Status
      );
      taskCard.querySelector("#task-priority_level").innerText =
        getPriorityString(res["result"].PriorityLevel);

      // Disable dropdown items based on the due date
      disableDropdownItems(res["result"].DueDate);
    })
    .catch((err) => {
      console.error("Error occurred fetching task. ", err);
    });
}

// Helper function to get status string
function getStatusString(status) {
  switch (status) {
    case 1:
      return "To do";
    case 2:
      return "In Progress";
    case 3:
      return "Done";
    default:
      return "Unknown";
  }
}

// Helper function to get priority string
function getPriorityString(priority) {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    default:
      return "Unknown";
  }
}

// Function to disable dropdown items based on due date
function disableDropdownItems(dueDate) {
  const now = new Date();
  const specificDate = new Date(dueDate); // Convert dueDate to Date object
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  if (now > specificDate) {
    dropdownItems.forEach((item) => {
      item.classList.add("disabled"); // Add a 'disabled' class for styling
      item.style.pointerEvents = "none"; // Prevent clicking
      item.style.opacity = "0.5"; // Indicate disabled state
    });
  } else {
    dropdownItems.forEach((item) => {
      item.classList.remove("disabled");
      item.style.pointerEvents = "auto";
      item.style.opacity = "1"; // Restore full opacity
    });
  }
}

// Add event listeners to each dropdown item for status change
const dropdownItems = document.querySelectorAll(".dropdown-item");
const statusText = document.getElementById("task-status-text");

dropdownItems.forEach((item) => {
  item.addEventListener("click", async function (event) {
    event.preventDefault();

    const newStatus = this.getAttribute("data-status");
    const returnText = this.getAttribute("data-val");
    statusText.textContent = newStatus;

    const taskID = statusText.getAttribute("data-id");
    let session = getCookie("session");

    if (session == null) {
      console.log("Session cookie not found. Redirecting to login...");
      return;
    }

    // Construct the URL for the API request
    let url = `/admin/api/d/task/edit/${taskID}/?_status=${returnText}&x-csrf-token=${session}`;

    try {
      // Await the fetch request
      let req = await fetch(url);
      if (!req.ok) {
        throw new Error(`HTTP error! status: ${req.status}`);
      }

      // Parse the response as JSON
      let resp = await req.json();
      console.log(resp);
      if (resp.status == "ok") {
        $("#task-list").load(window.location.href + " #task-list > *");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  });
});
