import "./styles.css";
import { openForm } from './event-handlers.js';
import { initialTasks, transferExpiredTasks, updateTaskContainer, alarm } from "./functions.js";

openForm();

document.addEventListener("DOMContentLoaded", () => {
    initialTasks();
    transferExpiredTasks();
    updateTaskContainer();
    alarm();
    setInterval(() => {
        alarm();
    }, 60000);
});