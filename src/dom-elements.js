export const cardForm = document.querySelector("#card-form");
export const displayForm = document.querySelector("#card-form");
export const addButton = document.querySelector("#add-button");
export const reminder = document.querySelector("#reminder"); 
export const time = document.querySelector("#time"); 
export const date = document.querySelector("#date-input"); 
export const priorityButtons = document.querySelectorAll("#priority input[type='button']");
export const content = document.querySelector("#content");
export const deleteButtons = document.querySelectorAll("#delete-btn");
export const editButtons = document.querySelectorAll(".edit-btn");
export const addFormButton = document.querySelector("#add-form-btn");
export const todayBtn = document.querySelector("#today-btn");
export const allTasksBtn = document.querySelector("#all-btn");
export const mainTitle = document.querySelector("#main-title");
export const scheduledBtn = document.querySelector("#scheduled-btn");
export const completeTasksDeleteBtn = document.querySelector(".close-task-btn");
export const searchbar = document.querySelector("#searchbar");

export const initialTaskList = [
    {
        priority: "High",
        time: "12:00",
        date: "2024-12-30",
        description: "Do the dishes",
        daytime: "Morning"
    },
    {
        priority: "Low",
        time: "19:00",
        date: "2025-01-13",
        description: "Ken's birthday",
        daytime: "Evening"
    }
];