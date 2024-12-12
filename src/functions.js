import { da } from "date-fns/locale";
import { displayForm, date, priorityButtons, time, reminder, addFormButton, initialTaskList, mainTitle} from "./dom-elements";

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};
let completedReminders = [];
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
        console.log("Updating DOM with Task ID:", id); // Debug log
        
        content.innerHTML += `
                    <div class="reminder-card" id="${id}">         
                        <div id="reminder-card-upper-description">           
                            <h2>${getDaytime(time)}</h2>
                            <p id="reminder-card-description">${description}</p>
                            <p><strong>Priority: </strong>${priority}</p>
                        </div>    
                        <div id="time-date-container">
                        <p id="date-content">${date}</p>
                        <p id="time-content">${time}</p>
                        <input type="image" src="./icons/edit.svg" class="edit-btn" alt="edit button">
                        </div>
                        <input type="image" src="./icons/close-icon.svg" id="delete-btn" class="close-task-btn" alt="close button">
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

    
    saveData();
    updateTaskContainer();
    resetForm();
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
    const dataArrIndex = findDataArrIndex(button);

    button.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data", stringifyData(taskData));
}

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
    const todayTasks = taskData.filter((task) => task.date === today);
    updateTaskContainer(todayTasks);
    currentMainTitle = "today";
    mainTitleField();
}

export const displayAllTasks = () => {
    updateTaskContainer(taskData);
    currentMainTitle = "all";
    mainTitleField();
}

export const displayScheduledTasks = () => {
    content.innerHTML = "";


    content.innerHTML += `
                <div id="scheduled-container">
                    <div id="tasks-count"><strong>${taskData.length}</strong> total reminders</div>
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
                    <p>Completed</p> <button id="show-completed-btn">Show</button>
                    </div>
                    <div id="completed-list-content" class="hidden">
                        ${completedTasks()}
                    </div>
                </div>`
}   

const todayScheduledTasks = () => {
    const todayTasks = taskData.filter((task) => task.date === today);

    return todayTasks.map((task) => `
                <div class="today-reminder">
                    <p>${task.priority} priority</p>
                    <p>${task.date} - ${task.time}</p>
                    <p>${getDaytime(time)}</p>
                    <p>${task.description}</p>
                </div>
    `).join("");
}

const futureScheduledTasks = () => {
    const futureTasks = taskData.filter((task) => task.date > today);

    return futureTasks.map((task) => `
                <div class="today-reminder">
                    <p>${task.priority} priority</p>
                    <p>${task.date} - ${task.time}</p>
                    <p>${getDaytime(time)}</p>
                    <p>${task.description}</p>
                </div>
    `).join("");
}

const completedTasks = () => {
    const completedTasks = taskData.filter((task) => task.date < today);

    return completedTasks.map((task) => `
                <div class="today-reminder">
                    <p>${task.priority} priority</p>
                    <p>${task.date} - ${task.time}</p>
                    <p>${getDaytime(time)}</p>
                    <p>${task.description}</p>
                </div>
    `).join("");
}

const mainTitleField = () => {
    if (currentMainTitle === "today") {
        mainTitle.innerHTML = "Today";
    } else if (currentMainTitle === "all") {
        mainTitle.innerHTML = "All";
    }
}

const stringifyData = (data) => {
    return JSON.stringify(data);
}

const saveData = () => {
    localStorage.setItem("data", stringifyData(taskData));
}

const removeSpecialChars = (val) => {
    return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
}
