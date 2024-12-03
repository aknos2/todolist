import { cardForm, displayForm, content, closeTaskFormBtn, confirmCloseDialog, addButton, reminderCard, priorityButtons, deleteBtn, editButtons, deleteButtons} from './dom-elements.js';
import { reset, addOrUpdateTask, updateTaskContainer, addPriority, removePriority, deleteTask, editTask} from './functions.js';


export const openForm = () => {
    addButton.addEventListener("click", () => {
        displayForm.classList.toggle("hidden");
    });
};

cardForm.addEventListener("submit", e => {
    e.preventDefault();
    addOrUpdateTask();
});

priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
        priorityButtons.forEach(btn => removePriority(btn));
        addPriority(button);
    });
});

deleteButtons.forEach((button) => {
    button.addEventListener("click", () => deleteTask(button));
});

editButtons.forEach((button) => {
    button.addEventListener("click", () =>  editTask(button));
});



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