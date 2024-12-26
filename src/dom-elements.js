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
export const sideMenuButtons = document.querySelectorAll(".side-menu-button");

const today = new Date().toISOString().split('T')[0];

export const initialTaskList = [
    {
        priority: "High",
        time: "12:00",
        date: "2025-12-30",
        description: "Do the dishes",
    },
    {
        priority: "Low",
        time: "19:00",
        date: "2030-12-13",
        description: "Bob's birthday",
    },
    {
        priority: "Medium",
        time: "23:00",
        date: today,
        description: "This reminder is for today. Have a good day!",
    },
    {
        priority: "Low",
        time: "06:00",
        date: "2024-12-01",
        description: "Expired reminder",
    }
];