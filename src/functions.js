import { da } from "date-fns/locale";
import { displayForm, date, priorityButtons, time, reminder} from "./dom-elements";

const taskData = [];
let currentTask = {};
let selectPriority = null;
const today = new Date().toISOString().split('T')[0];
date.value = today;

export const updateTaskContainer = () => {
    content.innerHTML = "";

    taskData.forEach(({id, priority, time, date, description}) => {    
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
                        <button id="delete-btn" class="close-task-form-btn" type="button" aria-label="close">X</button>
                        <input type="image" src="./icons/edit.svg" class="edit-btn" aria-label="edit" alt="edit button">
                    </div>`
    });

    //Create new delete button for new task
    const deleteButtons = document.querySelectorAll("#delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => deleteTask(button));
    });
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
        }
    
 
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
    return taskData.findIndex((item) => item.id === button.parentElement.id);
}

export const deleteTask = (button) => {
    const dataArrIndex = findDataArrIndex(button);

    button.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
}

export const editTask = (button) => {
    const taskId = button.parentElement.id;
    const taskIndex = taskData.findIndex((item) => item.id === taskId);

    currentTask = taskData[taskIndex];

    time.value = currentTask.time;
    date.value = currentTask.date;
    reminder.value = currentTask.description;

    priorityButtons.forEach((button) => {
        if (button.getAttribute("data-value") === currentTask.priority) {
            button.classList.add("selected");
            selectPriority = currentTask.priority;
        } else {
            button.classList.remove("selected");
        }
    });

    displayForm.classList.toggle("hidden");

    console.log("Editing task with ID:", taskId);
}