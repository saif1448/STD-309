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
function createTaskCard(taskName, deadline) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    // Parse deadline date
    const deadlineDate = new Date(deadline);

    // Create countdown timer
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = deadlineDate - now;

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

    // Create task card HTML
    taskCard.innerHTML = `
    <div class="countdown">--:--:--:--</div>
    <h3 class="task-name">${taskName}</h3>
    <p class="task-deadline">Deadline: ${formatDate(deadlineDate)}</p>
  `;

    // Update countdown immediately and every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    return taskCard;
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

// Handle form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const deadline = document.getElementById('task-deadline').value;

    if (taskName && deadline) {
        // Create new task card
        const taskCard = createTaskCard(taskName, deadline);

        // Add task card to container
        taskContainer.appendChild(taskCard);

        // Reset form
        taskForm.reset();

        // Close modal
        modal.style.display = 'none';
    }
});