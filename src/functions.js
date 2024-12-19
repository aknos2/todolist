import { da, ta } from "date-fns/locale";
import { displayForm, date, priorityButtons, time, reminder, addFormButton, initialTaskList, mainTitle, searchbar} from "./dom-elements";

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};
let completedReminders = JSON.parse(localStorage.getItem("completed")) || [];
let daytime;
const DEFAULT_PRIORITY = "Medium";
let selectPriority = DEFAULT_PRIORITY;
const today = new Date().toISOString().split('T')[0];
let currentMainTitle = "All";
date.value = today;

export const closeForm = (event) => {
    const button = event.target;
    if (button.matches("#close-task-form-btn")) {
        event.preventDefault();
        resetForm();
        overlay.style.display = "none";
    }
}

const getDaytime = (time) => {
    if (time < "12:00") {
        return "Morning";
    } else if (time < "18:00") {
        return "Afternoon";
    } else {
        return "Evening";
    }
};


export const updateTaskContainer = (tasks = taskData) => {
    content.innerHTML = "";

    tasks.forEach(({id, priority, time, date, description}) => {    
        const isExpired = date < today;
        
        content.innerHTML += `
                    <div class="reminder-card ${isExpired ? "expired-task" : ""}" id="${id}">         
                        <div id="reminder-card-upper-description">           
                            <h2>${getDaytime(time)}</h2>
                            <p id="reminder-card-description">${description}</p>
                            <p><strong>Priority: </strong>${priority}</p>
                        </div>    
                        <div id="time-date-container">
                        <p id="date-content">${date}</p>
                        <p id="time-content">${time}</p>
                        ${!isExpired ? `<input type="image" src="./icons/edit.svg" class="edit-btn container-btn" alt="edit button">` : ""}
                        </div>
                        ${!isExpired ? `<input type="image" src="./icons/close-icon.svg" id="delete-btn" class="close-task-btn container-btn" alt="close button">` : ""}
                    </div>`
    });

    console.log("Updated DOM with Task Data:", taskData); // Debug log
}

const validateInput = () => {
    if (!reminder.value.trim() && reminder.value.length !== 0) {
        alert("Only space inputs are not valid");
        return false;
    }
    return true;
}

const createTaskObject = () => ({
    id: `${removeSpecialChars(reminder.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    priority: selectPriority,
    time: time.value,
    date: date.value,
    description: removeSpecialChars(reminder.value) || "No description",
    daytime: daytime
})

export const addOrUpdateTask = () => {
    if (!validateInput()) return;

    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = createTaskObject();
    
    if (dataArrIndex === -1) {
        taskData.unshift(taskObj); //add a new task
    } else {
        taskData[dataArrIndex] = taskObj;
    }
    console.log("Updated Task Data:", taskData); // Debug log

    
    saveData("data", taskData);
    saveData("complete", completedReminders);

    updateTaskContainer();
    resetForm();
    displayAllTasks();
}

export const addPriority = (button) => {
    button.classList.add("selected");
    selectPriority = button.getAttribute("data-value");
}

export const removePriority = (btn) => {
    btn.classList.remove("selected");
}

export const resetForm = () => {
    time.value = ""; 
    date.value = "";
    reminder.value = "";
    selectPriority = DEFAULT_PRIORITY;
    date.value = today;

    priorityButtons.forEach((btn) => {
        if (btn.getAttribute("data-value") === DEFAULT_PRIORITY) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        };
        });

    overlay.style.display = "none";
    displayForm.classList.add("hidden");
    addFormButton.innerHTML = "Add reminder";
    mainTitle.innerHTML = "";
}

if (taskData.length) {
    updateTaskContainer();
  }

const findDataArrIndex = (button) => {
    const card = button.closest(".reminder-card");

    if (!card) {
        console.error("Reminder card not found for the clicked button.");
        return -1;
    }

    const cardId = card.id;
    console.log("Found Card ID:", cardId);

    const index = taskData.findIndex((item) => item.id === cardId);
    if (index === -1) {
        console.error(`Task with ID ${cardId} not found in taskData.`, taskData); // Debug log
    }
    return index;
};

export const deleteTask = (button) => {
    let taskId;

    // Determine the task ID based on the button type
    if (button.matches("#delete-btn")) {
        // Get the task ID from the parent `.reminder-card`
        const card = button.closest(".reminder-card");
        if (!card) {
            console.error("Reminder card not found for the delete button.");
            return;
        }
        taskId = card.id;
    } else if (button.matches("#all-menu-delete-btn")) {
        // Get the task ID from the `data-task-id` attribute
        taskId = button.getAttribute("data-task-id");
        if (!taskId) {
            console.error("Task ID not found for the delete button.");
            return;
        }
    } else {
        console.error("Delete button does not match any known types.");
        return;
    }

    // Find the index of the task in taskData
    const dataArrIndex = taskData.findIndex((task) => task.id === taskId);

    if (dataArrIndex === -1) {
        console.error(`Task with ID ${taskId} not found in taskData.`);
        return;
    }

    // Move the task to the completed reminders list
    completedReminders.push(taskData[dataArrIndex]);
    saveData("completed", completedReminders);

    // Remove the task from taskData
    taskData.splice(dataArrIndex, 1);
    saveData("data", taskData);

    // Remove the task's DOM element
    const taskElement = button.closest(".reminder-card") || button.closest(".today-reminder");
    if (taskElement) {
        taskElement.remove();
    } else {
        console.error("Task element not found in the DOM.");
    }

    displayAllTasks();
};

export const editTask = (button) => {
    const dataArrIndex = findDataArrIndex(button);

    if (dataArrIndex === -1) {
        console.error("Task not found. Cannot edit.");
        return; // Stop execution if no task is found
    }

    currentTask = taskData[dataArrIndex];
    console.log("Editing Task:", currentTask); // Debug log

     // Update the form fields with the current task's data
     time.value = currentTask.time || "";
     date.value = currentTask.date || "";
     reminder.value = currentTask.description || "";

    priorityButtons.forEach((button) => {
        if (button.getAttribute("data-value") === currentTask.priority) {
            button.classList.add("selected");
            selectPriority = currentTask.priority;
        } else {
            button.classList.remove("selected");
        }
    });

    overlay.style.display = "block";
    displayForm.classList.toggle("hidden");
    addFormButton.innerHTML = "Update";
}

export const initialTasks = () => {
    if (taskData.length === 0) {
        initialTaskList.forEach((task) => {
            // Set form values temporarily
            reminder.value = task.description;
            time.value = task.time;
            date.value = task.date;
            selectPriority = task.priority;
    
            // Call the function to add the task
            addOrUpdateTask();
        });
    }
};

export const displayTodayAddedTasks = () => {
    const todayTasks = getFilteredTasks("today");

    updateTaskContainer(todayTasks);
    currentMainTitle = "today";
    mainTitleField();
}

export const displayScheduledTasks = () => {    
    const filteredTasks = getFilteredTasks("future");

    updateTaskContainer(filteredTasks);
    currentMainTitle = "scheduled";
    mainTitleField();
}

export const displayAllTasks = () => {
    content.innerHTML = "";


    content.innerHTML += `
                <div id="scheduled-container">
                    <div id="tasks-count"><strong>${todayAndFutureTasksCount()}</strong> 
                    total active ${todayAndFutureTasksCount() === 1 ? "reminder" : "reminders"}</div>
                    <hr>
                    <h4>Today reminders</h4>
                    <div id="today-reminders-list">
                        ${todayScheduledTasks()}
                    </div>
                    <hr>
                    <h4>Future reminders</h4>
                    <div id="others-reminders-list">
                        ${futureScheduledTasks()}
                    </div>
                    <hr>
                    <div id="completed-list-container">
                    <p><strong>${completedTaskCount()}</strong> Completed/Expired</p> 
                    <button id="show-completed-btn">Show</button>
                    <button id="clear-btn">Clear</button>
                    </div>
                    <div id="completed-list-content" class="hidden">
                        ${completedTasks()}
                    </div>
                </div>`
    
    currentMainTitle = "all";
    mainTitleField();
}   

const renderTaskTemplate = (task) => `
    <div class="today-reminder">
        <p>${task.priority} priority</p>
        <p>${task.date} - ${task.time}</p>
        <input type="image" src="./icons/close-icon.svg" id="all-menu-delete-btn" class="close-task-btn" alt="close button" data-task-id="${task.id}">
        <p>${getDaytime(task.time)}</p>
        <p>${task.description}</p>
    </div>
`;

const renderCompleteTaskTemplate = (task) => `
    <div class="completed-reminder">
        <p>${task.priority} priority</p>
        <p>${task.date} - ${task.time}</p>
        <p>${getDaytime(task.time)}</p>
        <p>${task.description}</p>
    </div>
`;

const todayScheduledTasks = () => {
    const todayTasks = getFilteredTasks("today");

    return todayTasks.map(renderTaskTemplate).join("");
}

const futureScheduledTasks = () => {
    const futureTasks = getFilteredTasks("future");

    return futureTasks.map(renderTaskTemplate).join("");
}

const completedTasks = () => {
    const completedReminders = getFilteredTasks("completed");
    const previousDateTasks = taskData.filter(//get previous date tasks and also exclude duplicated from completed ones
        (task) => task.date < today && !completedReminders.some((completedTasks) => completedTasks.id === task.id)) 

    const allTasks = [...completedReminders, ...previousDateTasks];

    return allTasks.map(renderCompleteTaskTemplate).join("");
}

export const clearCompletedTasks = () => {
    const notExpiredTasks = getFilteredTasks("todayAndFuture");

    // Check if completed tasks exist in localStorage
    if (!completedReminders || completedReminders.length === 0) {
        console.warn("No completed tasks to clear.");
        return;
    }

    // Clear the "completed" key in local storage
    localStorage.removeItem("completed");

    // Clear the `completedReminders` array
    completedReminders = [];

    taskData.splice(0, taskData.length, ...notExpiredTasks);
    saveData("data", taskData);

     // Clear the DOM container for completed tasks
     const completedTasksContainer = document.querySelector("#completed-list-content");
     completedTasksContainer.innerHTML = "";
     displayAllTasks();
};


export const transferExpiredTasks = () => {
    const previousDateTasks = getFilteredTasks("expired")

    previousDateTasks.forEach((task) => {
        const taskElement = document.getElementById(task.id);

        if (taskElement) {
            taskElement.remove();
        }

        // Add the task to the completed reminders (or handle as needed)
        completedReminders.push(task);
    });    
   
    // Remove expired tasks from taskData
    taskData = getFilteredTasks("todayAndFuture")

    saveData("complete", completedReminders);
    saveData("data", taskData);
};

export const searchbarFunction = () => {
    const searchWord = searchbar.value.toLowerCase();
    return taskData.filter(task => {
        return (
            task.description.toLowerCase().includes(searchWord) ||
            task.date.includes(searchWord) ||
            task.priority.toLowerCase().includes(searchWord) ||
            task.time.includes(searchWord)
        );
    });
}

export const displaySearchResults = () => {
    const results = searchbarFunction();
    updateTaskContainer(results);
}

const mainTitleField = () => {
    if (currentMainTitle === "today") {
        mainTitle.innerHTML = "Today";
    } else if (currentMainTitle === "all") {
        mainTitle.innerHTML = "All";
    } else if (currentMainTitle === "scheduled") {
        mainTitle.innerHTML = "Scheduled";
    } else if (currentMainTitle === "last added") {
        mainTitle.innerHTML = "Last added"
    }
}

const getFilteredTasks = (filterType) => {
    if (filterType === "todayAndFuture") {
        return taskData.filter((task) => task.date >= today);
    } else if (filterType === "expired") {
        return taskData.filter((task) => task.date < today);
    } else if (filterType === "completed") {
        return JSON.parse(localStorage.getItem("completed")) || [];
    } else if (filterType === "future") {
        return taskData.filter((task) => task.date > today);
    } else if (filterType === "today") {
        return taskData.filter((task) => task.date === today);
    }
    return taskData; // Default: return all tasks
};


const stringifyData = (data) => {
    return JSON.stringify(data);
}

const saveData = (key, data) => {
    localStorage.setItem(key, stringifyData(data));
}

const removeSpecialChars = (val) => {
    return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
}

export const completedTaskCount = () => {
    const completedTasks = getFilteredTasks("completed");
    const expiredTasks = getFilteredTasks("expired");
    const bothTasks = [...completedTasks, ...expiredTasks];
    return bothTasks.length;
}

const todayAndFutureTasksCount = () => {
    const filteredTasks = getFilteredTasks("todayAndFuture");
    return filteredTasks.length;
};