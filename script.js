// Welcome Screen Showing

// DOM Elements for welcome screen
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeGreeting = document.getElementById('welcome-greeting');
const userNameInput = document.getElementById('user-name-input');
const continueButton = document.getElementById('continue-button');

// Function to determine appropriate greeting based on time
function determineGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
}

// Set initial greeting
welcomeGreeting.textContent = determineGreeting();

// Function to show main app and hide welcome screen
function showMainApp() {
    const userName = userNameInput.value.trim();
    if (userName) {
        // Store username in localStorage
        localStorage.setItem('userName', userName);

        // Update greeting in header
        const greetingElement = document.getElementById('greeting');
        greetingElement.textContent = `${determineGreeting().replace('!', ',')} ${userName}!`;

        // Hide welcome screen with transition
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 500);
    }
}

// Event listeners for welcome screen
continueButton.addEventListener('click', showMainApp);

// Also allow pressing Enter to continue
userNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        showMainApp();
    }
});

// Initially show the welcome screen
welcomeScreen.style.display = 'flex';

// Function to update the clock and date
function updateClock() {
    // Get current date and time
    const now = new Date();

    // Format hours, minutes, and seconds with leading zeros
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Create time string in HH:MM:SS format
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Format date components
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    // Create date string in "Day, Month Date, Year" format
    const dateString = `${day}, ${month} ${date}, ${year}`;

    // Update the clock and date elements
    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

// Update the clock and date immediately when the page loads
updateClock();

// Update the clock every second (1000 milliseconds)
setInterval(updateClock, 1000);


/**
 * Creating the task and setting the deadline
 */

// Global tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Generate unique ID for tasks

// DOM Elements
const addTaskButton = document.getElementById('add-task-button');
const modal = document.getElementById('add-task-modal');
const closeButton = document.getElementById('close-button');
const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');

// Show modal when add task button is clicked
addTaskButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Function to create a task card
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.dataset.id = task.id;

    // Create task card HTML
    taskCard.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="countdown">--:--:--:--</div>
        <h3 class="task-name">${task.name}</h3>
        <p class="task-deadline">Deadline: ${formatDate(new Date(task.deadline))}</p>
        <button class="delete-task">Delete</button>
    `;

    // Add event listeners
    taskCard.querySelector('.task-checkbox').addEventListener('change', () => {
        toggleTaskCompletion(task.id);
    });

    taskCard.querySelector('.delete-task').addEventListener('click', () => {
        deleteTask(task.id);
    });

    // Update countdown
    updateCountdown(taskCard, task.deadline);

    return taskCard;
}

function generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


// Function to format date
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

// Function to pad numbers with leading zero
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Function to update countdown timer
function updateCountdown(taskCard, deadline) {
    function update() {
        const now = new Date();
        const timeRemaining = new Date(deadline) - now;

        if (timeRemaining <= 0) {
            taskCard.querySelector('.countdown').textContent = 'Time\'s up!';
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        taskCard.querySelector('.countdown').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    update();
    setInterval(update, 1000);
}

// Handle form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const deadline = document.getElementById('task-deadline').value;

    if (taskName && deadline) {
        const newTask = {
            id: generateTaskId(),
            name: taskName,
            deadline: deadline,
            completed: false
        };

        tasks.push(newTask);
        const taskCard = createTaskCard(newTask);
        taskContainer.appendChild(taskCard);

        taskForm.reset();
        modal.style.display = 'none';

        updateTaskCounts();
        saveTasksToLocalStorage();
    }
});

// Function to toggle task completion status
function toggleTaskCompletion(taskId) {
    for (const task of tasks) {
        if (task.id === taskId) {
            task.completed = !task.completed;
            break;
        }
    }
    updateTaskCounts();
    saveTasksToLocalStorage();

    const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (taskCard) {
        if (tasks.find(t => t.id === taskId).completed) {
            taskCard.classList.add('completed');
        } else {
            taskCard.classList.remove('completed');
        }
    }
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    const taskCards = document.querySelectorAll('.task-card');
    for (const card of taskCards) {
        if (card.dataset.id === taskId) {
            card.remove();
            break;
        }
    }

    updateTaskCounts();
    saveTasksToLocalStorage();
}

// Function to update task counts
function updateTaskCounts() {
    let completedCount = 0;
    let incompleteCount = 0;

    for (const task of tasks) {
        if (task.completed) {
            completedCount++;
        } else {
            incompleteCount++;
        }
    }

    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('incomplete-count').textContent = incompleteCount;
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Demonstrate a loop with array manipulation
    const taskSummaries = [];
    for (let i = 0; i < tasks.length; i++) {
        taskSummaries.push({
            name: tasks[i].name,
            deadline: tasks[i].deadline,
            completed: tasks[i].completed
        });
    }
}

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskCard = createTaskCard(task);
        taskContainer.appendChild(taskCard);
    }

    tasks.forEach(task => {
        const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
        if (taskCard) {
            updateCountdown(taskCard, task.deadline);
        }
    });

    updateTaskCounts();
});