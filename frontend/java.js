// frontend/app.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('form-tarea');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('titulo');
    const taskDescInput = document.getElementById('descripcion');
    const taskDateInput = document.getElementById('fecha-estimada-finalizacion');
    const taskCreatorInput = document.getElementById('creador');
    const taskResponsibleInput = document.getElementById('responsable');
    const taskPriorityInput = document.getElementById('prioridad');
    const taskObservationsInput = document.getElementById('observaciones');
    const tasksTableBody = document.getElementById('tasks');
    const searchForm = document.getElementById('form-busqueda');
    const searchTitleInput = document.getElementById('buscar-titulo');
    const searchDateStartInput = document.getElementById('buscar-fecha-inicio');
    const searchDateEndInput = document.getElementById('buscar-fecha-fin');
    const searchPriorityInput = document.getElementById('buscar-prioridad');
    const searchResponsibleInput = document.getElementById('buscar-responsable');
    const searchDescriptionInput = document.getElementById('buscar-descripcion');
    const tasksGrouped = document.getElementById('tasks-grouped');
    const reassignForm = document.getElementById('form-reasignar');
    const reassignIdInput = document.getElementById('reasignar-id');
    const newResponsibleInput = document.getElementById('nuevo-responsable');
    const notificationDiv = document.getElementById('notification');

    const showNotification = (message, isError = false) => {
        notificationDiv.textContent = message;
        notificationDiv.style.backgroundColor = isError ? 'red' : '#007BFF';
        notificationDiv.classList.remove('hidden');
        setTimeout(() => {
            notificationDiv.classList.add('hidden');
        }, 3000);
    };

    // Validación adicional para asegurar que los campos requeridos están completos
    const validateForm = (form) => {
        for (const input of form.elements) {
            if (input.hasAttribute('required') && !input.value.trim()) {
                return false;
            }
        }
        return true;
    };

    // Función para listar tareas
    const listTasks = () => {
        fetch('/api/tareas')
            .then(response => response.json())
            .then(tasks => {
                tasksTableBody.innerHTML = '';
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.titulo}</td>
                        <td>${task.descripcion}</td>
                        <td>${task.prioridad}</td>
                        <td>${task.fecha_estimada_finalizacion}</td>
                        <td>${task.estado}</td>
                        <td>
                            <button onclick="editTask(${task.id})">Editar</button>
                            <button onclick="deleteTask(${task.id})">Eliminar</button>
                            <button onclick="changeTaskState(${task.id}, 'pendiente')">Pendiente</button>
                            <button onclick="changeTaskState(${task.id}, 'en proceso')">En Proceso</button>
                            <button onclick="changeTaskState(${task.id}, 'terminada')">Terminada</button>
                            <button onclick="changeTaskState(${task.id}, 'en impedimento')">En Impedimento</button>
                        </td>
                    `;
                    tasksTableBody.appendChild(row);
                });
            })
            .catch(() => showNotification('Error al listar tareas', true));
    };

    // Función para crear o actualizar una tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(taskForm)) {
            showNotification('Por favor, complete todos los campos requeridos', true);
            return;
        }

        const taskId = taskIdInput.value;
        const taskData = {
            titulo: taskTitleInput.value,
            descripcion: taskDescInput.value,
            fecha_estimada_finalizacion: taskDateInput.value,
            creador: taskCreatorInput.value,
            responsable: taskResponsibleInput.value,
            prioridad: taskPriorityInput.value,
            observaciones: taskObservationsInput.value,
        };

        const url = taskId ? `/api/tareas/${taskId}` : '/api/tareas';
        const method = taskId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(() => {
            taskForm.reset();
            listTasks();
            showNotification(taskId ? 'Tarea actualizada' : 'Tarea creada');
        })
        .catch(() => showNotification('Error al guardar la tarea', true));
    });

    // Función para editar una tarea
    window.editTask = (id) => {
        fetch(`/api/tareas/${id}`)
            .then(response => response.json())
            .then(task => {
                taskIdInput.value = task.id;
                taskTitleInput.value = task.titulo;
                taskDescInput.value = task.descripcion;
                taskDateInput.value = task.fecha_estimada_finalizacion;
                taskCreatorInput.value = task.creador;
                taskResponsibleInput.value = task.responsable;
                taskPriorityInput.value = task.prioridad;
                taskObservationsInput.value = task.observaciones;
            })
            .catch(() => showNotification('Error al cargar la tarea', true));
    };

    // Función para eliminar una tarea
    window.deleteTask = (id) => {
        fetch(`/api/tareas/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            listTasks();
            showNotification('Tarea eliminada');
        })
        .catch(() => showNotification('Error al eliminar la tarea', true));
    };

    // Función para buscar tareas
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        
        if (searchTitleInput.value) searchParams.append('titulo', searchTitleInput.value);
        if (searchDateStartInput.value) searchParams.append('fecha_inicio', searchDateStartInput.value);
        if (searchDateEndInput.value) searchParams.append('fecha_fin', searchDateEndInput.value);
        if (searchPriorityInput.value) searchParams.append('prioridad', searchPriorityInput.value);
        if (searchResponsibleInput.value) searchParams.append('responsable', searchResponsibleInput.value);
        if (searchDescriptionInput.value) searchParams.append('descripcion', searchDescriptionInput.value);

        fetch(`/api/tareas/buscar?${searchParams.toString()}`)
            .then(response => response.json())
            .then(tasks => {
                tasksTableBody.innerHTML = '';
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.titulo}</td>
                        <td>${task.descripcion}</td>
                        <td>${task.prioridad}</td>
                        <td>${task.fecha_estimada_finalizacion}</td>
                        <td>${task.estado}</td>
                        <td>
                            <button onclick="editTask(${task.id})">Editar</button>
                            <button onclick="deleteTask(${task.id})">Eliminar</button>
                            <button onclick="changeTaskState(${task.id}, 'pendiente')">Pendiente</button>
                            <button onclick="changeTaskState(${task.id}, 'en proceso')">En Proceso</button>
                            <button onclick="changeTaskState(${task.id}, 'terminada')">Terminada</button>
                            <button onclick="changeTaskState(${task.id}, 'en impedimento')">En Impedimento</button>
                        </td>
                    `;
                    tasksTableBody.appendChild(row);
                });
            })
            .catch(() => showNotification('Error al buscar tareas', true));
    });

    // Función para agrupar tareas por estado
    const groupTasksByState = () => {
        fetch('/api/tareas/estado')
            .then(response => response.json())
            .then(groupedTasks => {
                tasksGrouped.innerHTML = '';
                Object.keys(groupedTasks).forEach(state => {
                    const groupDiv = document.createElement('div');
                    groupDiv.classList.add('task-group');
                    groupDiv.innerHTML = `
                        <h3>${state.charAt(0).toUpperCase() + state.slice(1)}</h3>
                        <ul>
                            ${groupedTasks[state].map(task => `
                                <li class="${task.estado === 'en impedimento' ? 'impedimento' : ''}">
                                    ${task.titulo} - ${task.descripcion} - ${task.prioridad} - ${task.fecha_estimada_finalizacion}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    tasksGrouped.appendChild(groupDiv);
                });
            })
            .catch(() => showNotification('Error al agrupar tareas', true));
    };

    // Función para cambiar el estado de una tarea
    window.changeTaskState = (id, estado) => {
        fetch(`/api/tareas/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado })
        })
        .then(response => response.json())
        .then(() => {
            listTasks();
            groupTasksByState();
            showNotification('Estado de la tarea actualizado');
        })
        .catch(() => showNotification('Error al cambiar el estado de la tarea', true));
    };

    // Función para reasignar una tarea a otro responsable
    reassignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(reassignForm)) {
            showNotification('Por favor, complete todos los campos requeridos', true);
            return;
        }

        const taskId = reassignIdInput.value;
        const newResponsible = newResponsibleInput.value;

        fetch(`/api/tareas/${taskId}/reasignar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nuevo_responsable: newResponsible })
        })
        .then(response => response.json())
        .then(() => {
            reassignForm.reset();
            listTasks();
            groupTasksByState();
            showNotification('Tarea reasignada');
        })
        .catch(() => showNotification('Error al reasignar la tarea', true));
    });

    // Listar tareas y agrupar por estado al cargar la página
    listTasks();
    groupTasksBy
});
