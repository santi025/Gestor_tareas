document.addEventListener('DOMContentLoaded', function() {
    fetchTasks();

    function fetchTasks() {
        fetch('http://localhost:8000/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                let taskList = document.getElementById('task-list');
                taskList.innerHTML = '';

                tasks.forEach(task => {
                    let taskDiv = document.createElement('div');
                    taskDiv.className = 'task';
                    taskDiv.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p><strong>Status:</strong> ${task.status}</p>
                        <p><strong>Priority:</strong> ${task.priority}</p>
                    `;

                    if (task.status === 'impedimento') {
                        taskDiv.classList.add('impedimento');
                    }

                    taskList.appendChild(taskDiv);
                });
            });
    }
});

