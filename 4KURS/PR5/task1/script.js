document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const newTaskInput = document.getElementById("newTask");
    const sortButton = document.getElementById("sortButton");
    const sortSelector = document.getElementById("sortSelector");

    sortButton.addEventListener("click", sortTasks);

    function sortTasks() {
        const sortBy = sortSelector.value;
        const tasks = getTasks();

        tasks.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) {
                return 1;
            } else if (a[sortBy] < b[sortBy]) {
                return -1;
            }
            return 0;
        });

        taskList.innerHTML = "";
        tasks.forEach(addTask);
        updateLocalStorage(tasks);
    }

    function updateLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(addTask);
    }

    function addTask(task) {
        const li = document.createElement("li");
        li.className = "task";
        if (task.taskDate === undefined) {
            task.taskDate = getFormattedDate();
        }
        li.innerHTML = `
            <input type="checkbox">
            <span class="task-text">${task.text}</span>
            <div>
                <span class="task-date">${task.taskDate}</span>
                <button class="delete-btn">X</button>
            </div>
        `;

        taskList.appendChild(li);

        const checkbox = li.querySelector("input[type='checkbox']");
        const taskTextElement = li.querySelector(".task-text");
        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.checked = task.completed;
        li.classList.toggle("completed", task.completed);

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            li.classList.toggle("completed", checkbox.checked);
            updateLocalStorage(getTasks());
        });

        taskTextElement.addEventListener("dblclick", function () {
            const input = document.createElement("input");
            input.type = "text";
            input.value = task.text;
            input.classList.add("edit-input");
            li.replaceChild(input, taskTextElement);
            input.focus();

            input.addEventListener("keyup", function (event) {
                if (event.key === "Enter" && input.value.trim() !== "") {
                    const newText = input.value;
                    taskTextElement.textContent = newText;
                    task.text = newText;
                    li.replaceChild(taskTextElement, input);
                    updateLocalStorage(getTasks());
                }
            });
        });

        deleteBtn.addEventListener("click", function () {
            taskList.removeChild(li);
            updateLocalStorage(getTasks());
        });
    }

    function addTaskFromInput() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== "") {
            const task = { text: taskText, completed: false };
            addTask(task);
            newTaskInput.value = "";
            updateLocalStorage(getTasks());
        }
    }

    function getTasks() {
        const tasks = [];
        const taskElements = document.querySelectorAll(".task");
        taskElements.forEach(function (taskElement) {
            const checkbox = taskElement.querySelector("input[type='checkbox']");
            const text = taskElement.querySelector(".task-text").textContent;
            const date = taskElement.querySelector(".task-date").textContent;
            const completed = taskElement.classList.contains("completed");
            tasks.push({ text, taskDate: date, completed });
        });
        return tasks;
    }

    function getFormattedDate() {
        const now = new Date();
        return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`;
    }

    newTaskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addTaskFromInput();
        }
    });

    loadTasks();
});
