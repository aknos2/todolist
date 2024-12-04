import { da } from "date-fns/locale";
import { displayForm, date, priorityButtons, time, reminder, addFormButton} from "./dom-elements";

const taskData = [];
let currentTask = {};
let selectPriority = null;
const today = new Date().toISOString().split('T')[0];
date.value = today;

export const closeForm = (event) => {
    const button = event.target;
    if (button.matches("#close-task-form-btn")) {
        event.preventDefault();
        reset();
    }
}

export const updateTaskContainer = () => {
    content.innerHTML = "";

    taskData.forEach(({id, priority, time, date, description}) => {    
        console.log("Updating DOM with Task ID:", id); // Debug log
        let daytime;
        if (time < "12:00") {
            daytime = "Morning";
        } else if (time < "18:00") {
            daytime = "Afternoon";
        } else {
            daytime = "Evening";
        }
        
        content.innerHTML += `
                    <div class="reminder-card" id="${id}">                    
                        <h2>${daytime}</h2>
                        <p>${description}</p>
                        <p><strong>Priority: </strong>${priority}</p>
                        <div id="time-date-container">
                        <p id="date-content">${date}</p>
                        <p id="time-content">${time}</p>
                        </div>
                        <input type="image" src="./icons/close-icon.svg" id="delete-btn" class="close-task-btn" alt="close button">
                        <input type="image" src="./icons/edit.svg" class="edit-btn" alt="edit button">
                    </div>`
    });
  
      console.log("Updated DOM with Task Data:", taskData); // Debug log
}

export const addOrUpdateTask = () => {
    let daytime;

    if(!selectPriority) {
        console.error("Please select a priority.");
        return;
    }
    
        const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    
        const taskObj = {
            id: `${reminder.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
            priority: selectPriority,
            time: time.value,
            date: date.value,
            description: reminder.value,
            daytime: daytime
        }
       
        if (dataArrIndex === -1) {
            taskData.unshift(taskObj); //add a new task
        } else {
            taskData[dataArrIndex] = taskObj;
        }
        console.log("Updated Task Data:", taskData); // Debug log
 
    updateTaskContainer();
    reset();
}

export const addPriority = (button) => {
    button.classList.add("selected");
    selectPriority = button.getAttribute("data-value");
}

export const removePriority = (btn) => {
    btn.classList.remove("selected");
}

export const reset = () => {
    time.value = ""; 
    date.value = "";
    reminder.value = "";
    priorityButtons.forEach(btn => btn.classList.remove("selected"));
    date.value = today;

    displayForm.classList.toggle("hidden");
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

    displayForm.classList.remove("hidden");
    addFormButton.innerHTML = "Update";
}