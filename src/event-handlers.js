import { displayForm, content, addButton, priorityButtons, todayBtn, allTasksBtn, scheduledBtn, searchbar, sideMenuButtons} from './dom-elements.js';
import { addOrUpdateTask, addPriority, removePriority, deleteTask, editTask, closeForm, resetForm, displayTodayAddedTasks, displayAllTasks, displayScheduledTasks, transferExpiredTasks, clearCompletedTasks, displaySearchResults, alarm, updateTaskContainer, setDefaultTime, setSideMenuButtonColor, initialTasks} from './functions.js';

export const openForm = () => {
    addButton.addEventListener("click", () => {
        resetForm();
        setDefaultTime();
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

content.addEventListener("click", (event) => {
    const button = event.target;

    // Check if the clicked element is a delete button
    if (button.matches("#delete-btn") || button.matches("#all-menu-delete-btn")) {
        deleteTask(button);
    };

    // Check if the clicked element is an edit button
    if (button.matches(".edit-btn")) {
        editTask(button);
    };

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
    };

    if (button.matches("#clear-btn")) {
        clearCompletedTasks();
    };
});

document.addEventListener("click", closeForm);
searchbar.addEventListener("input", displaySearchResults);

sideMenuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        setSideMenuButtonColor(event);

        if (button === todayBtn) {
            displayTodayAddedTasks();
        } else if (button === scheduledBtn) {
            displayScheduledTasks();
        } else if (button === allTasksBtn) {
            displayAllTasks();
        }
    })
})