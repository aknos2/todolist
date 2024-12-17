import { cardForm, displayForm, content, addButton, priorityButtons, todayBtn, allTasksBtn, scheduledBtn} from './dom-elements.js';
import { addOrUpdateTask, addPriority, removePriority, deleteTask, editTask, closeForm, resetForm, displayTodayAddedTasks, displayAllTasks, displayScheduledTasks, deleteExpiredTasks} from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
    deleteExpiredTasks();
    updateTaskContainer(); // Ensure the DOM reflects the updated tasks
});

export const openForm = () => {
    addButton.addEventListener("click", () => {
        resetForm();
        displayForm.classList.toggle("hidden");
        overlay.style.display = "block";
    });
};

displayForm.addEventListener("submit", e => {
    e.preventDefault();
    addOrUpdateTask();
});

priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
        priorityButtons.forEach(btn => removePriority(btn));
        addPriority(button);
    });
});

document.addEventListener("click", closeForm);

content.addEventListener("click", (event) => {
    const button = event.target;

    // Check if the clicked element is a delete button
    if (button.matches("#delete-btn")) {
        deleteTask(button);
    }

    // Check if the clicked element is an edit button
    if (button.matches(".edit-btn")) {
        editTask(button);
    }

    //show button function for completed tasks
    if (button.matches("#show-completed-btn")) {
        const completedListContent = document.getElementById("completed-list-content");
        completedListContent.classList.toggle("hidden");
        const showCompletedBtn = event.target;

        if (completedListContent.classList.contains("hidden")) {
            showCompletedBtn.innerHTML = "Show";
        } else {
            showCompletedBtn.innerHTML = "Hide";
        }
    }
});


todayBtn.addEventListener("click", displayTodayAddedTasks);
scheduledBtn.addEventListener("click", displayScheduledTasks);
allTasksBtn.addEventListener("click", displayAllTasks);




// const forms = [
//     { buttonId: "#add-task-btn", formId: "#add-task-form" },
//     { buttonId: "#edit-task-btn", formId: "#edit-task-form" },
//     { buttonId: "#add-reminder-btn", formId: "#add-reminder-form" },
// ];

// forms.forEach(({ buttonId, formId }) => {
//     const button = document.querySelector(buttonId);
//     const form = document.querySelector(formId);

//     // Use the refactored function to bind the toggle behavior
//     openForm(button, form);
// });