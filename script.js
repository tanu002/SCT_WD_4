let A = document.getElementById('task-area');
let B = document.getElementById('single-task');
let C = document.getElementById('tasks');
let date_time = document.getElementById('date-time');
let isEditing = false; // Flag for edit mode
let currentTask; // Variable to store the task being edited

// Load tasks from localStorage when page loads
window.onload = () => {
    loadTasks();
};

// Add new tasks to the list or update existing task
const addTask = (event) => {
    event.preventDefault();
    if (B.value === '') return;

    if (isEditing) {
        updateTask(B.value, date_time.value);
    } else {
        const task = createTask(B.value, date_time.value);
        C.appendChild(task);
        saveTasks(); // Save the task after adding
    }

    B.value = '';
    date_time.value = '';
    isEditing = false; // Reset after adding/updating task
}

// Format date and time for display
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}

// Create new task
const createTask = (taskName, dateTime) => {
    const date = formatDateTime(dateTime);
    const task = document.createElement('li');
    task.classList.add('task');
    task.dataset.datetime = dateTime; // Store the raw datetime for re-editing
    task.innerHTML = `
        <input type="checkbox">
        <label>${taskName} : ${date}</label>
        <span class="edit">✎</span>
        <span class="delete">&times;</span>
    `;

    // Add delete button
    const delButton = task.querySelector('.delete');
    delButton.addEventListener('click', () => {
        task.remove();
        saveTasks(); // Save after deletion
    });

    // Add edit button
    const editButton = task.querySelector('.edit');
    editButton.addEventListener('click', () => editTask(task, taskName));

    return task;
}

// Edit a task
const editTask = (taskElement, taskName) => {
    B.value = taskName; // Fill task name into input
    
    // Get the raw datetime from the dataset
    const rawDateTime = taskElement.dataset.datetime;

    // Set the date and time correctly formatted for the datetime-local input
    const formattedDate = new Date(rawDateTime).toISOString().slice(0, 16);
    date_time.value = formattedDate; // Fill task date into input

    isEditing = true;
    currentTask = taskElement; // Store the current task being edited
}

// Update task after editing
const updateTask = (updatedTaskName, updatedDateTime) => {
    const label = currentTask.querySelector('label');
    const date = formatDateTime(updatedDateTime);
    
    // Update task text and date in the label
    label.textContent = `${updatedTaskName} : ${date}`;
    
    // Update the stored raw datetime for future edits
    currentTask.dataset.datetime = updatedDateTime;

    // Save the updated tasks
    saveTasks();

    // Clear the input fields after updating
    B.value = ''; 
    date_time.value = '';

    isEditing = false;
    currentTask = null; // Clear the editing state
}

// Save tasks to localStorage
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        tasks.push({
            name: task.querySelector('label').textContent.split(':')[0].trim(),
            datetime: task.dataset.datetime
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(taskData => {
        const task = createTask(taskData.name, taskData.datetime);
        C.appendChild(task);
    });
}

A.addEventListener('submit', addTask);
