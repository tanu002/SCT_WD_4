let taskForm = document.getElementById('task-area');
let taskInput = document.getElementById('single-task');
let taskList = document.getElementById('tasks');
let dateTimeInput = document.getElementById('date-time');
let isEditing = false; // Flag for edit mode
let currentTaskIndex; // Store the index of the task being edited

// Load tasks from localStorage when page loads
window.onload = () => {
    loadTasks();
};

// Add new tasks to the list or update existing task
const addTask = (event) => {
    event.preventDefault();

    // Ensure the input field is not empty
    if (taskInput.value === '') return;

    // If in editing mode, update the task
    if (isEditing) {
        updateTask(taskInput.value, dateTimeInput.value); // Update task with new values
    } else {
        // Create a new task
        const task = createTask(taskInput.value, dateTimeInput.value);
        taskList.appendChild(task);
        saveTasks(); // Save the task after adding
    }

    // Clear input fields after adding/updating
    taskInput.value = '';
    dateTimeInput.value = '';
    isEditing = false; // Reset the editing mode
    currentTask = null; // Clear the currentTask reference
};

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
    const date = formatDateTime(dateTime); // For display purposes
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
    editButton.addEventListener('click', () => editTask(task));

    return task;
}

// Edit a task
const editTask = (taskElement) => {
    const taskName = taskElement.querySelector('label').textContent.split(':')[0].trim();
    taskInput.value = taskName; // Fill task name into input

    // Get the raw datetime from the dataset
    const rawDateTime = taskElement.dataset.datetime;

    // Ensure the datetime is in the correct format for the datetime-local input (YYYY-MM-DDTHH:MM)
    if (rawDateTime) {
        const date = new Date(rawDateTime);

        // Manually construct the string in the 'YYYY-MM-DDTHH:MM' format
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero
        const hours = ('0' + date.getHours()).slice(-2); // Add leading zero
        const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero

        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateTimeInput.value = formattedDateTime; // Fill task date into input
    }

    isEditing = true; // Set editing mode
    currentTask = taskElement; // Store the current task being edited
}

// Update task after editing
const updateTask = (updatedTaskName, updatedDateTime) => {
    const label = currentTask.querySelector('label');
    const date = formatDateTime(updatedDateTime);

    // Update the task label with the new name and date
    label.textContent = `${updatedTaskName} : ${date}`;

    // Update the stored raw datetime for future edits
    currentTask.dataset.datetime = updatedDateTime;

    // Save the updated task list to localStorage
    saveTasks();

    // Clear the input fields after updating
    taskInput.value = '';
    dateTimeInput.value = '';

    isEditing = false; // Reset the editing mode
    currentTask = null; // Clear the current task reference
};

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
};

// Load tasks from localStorage
const loadTasks = () => {
    taskList.innerHTML = ''; // Clear current task list
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(taskData => {
        const task = createTask(taskData.name, taskData.datetime);
        taskList.appendChild(task);
    });
}

taskForm.addEventListener('submit', addTask);