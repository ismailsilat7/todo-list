import "./filter.css";

import completeIcon from "../images/complete-checkbox.svg";
import incompleteIcon from "../images/incomplete-checkbox.svg";
import editIcon from "../images/edit.svg";
import deleteIcon from "../images/delete.svg";

function taskCard(task, manager, isProject, onUpdate) {
    const card = document.createElement('div');
    card.classList.add("taskCard");
    card.id = task.id;

    const title = document.createElement('h3');
    title.textContent = task.title;
    title.classList.add("taskTitle");

    const desc = document.createElement('p');
    desc.textContent = task.description;
    desc.classList.add("taskDesc");

    const dueDate = document.createElement('p');
    dueDate.textContent = task.dueDate;
    dueDate.classList.add("taskDueDate");

    const status = document.createElement('span');
    const complete = document.createElement('img');
    complete.src = task.completed ? completeIcon : incompleteIcon;
    status.classList.add(task.completed ? "completed" : "incomplete", "statusBtn");
    status.append(complete);
    status.onclick = () => {
        manager.toggleTaskCompletion(task.id);
        onUpdate();
    };

    const priority = document.createElement('span');
    priority.textContent = `${task.priority}`;
    priority.classList.add(`priority-${task.priority}`, "priority");
    if(isProject) {
        priority.classList.add("priority-project");
    }

    const editBtn = document.createElement("span");
    editBtn.classList.add("editBtn");
    const editImg = document.createElement("img");
    editImg.src = editIcon;
    editBtn.append(editImg);
    editBtn.onclick = () => {
        const newTitle = prompt("Edit task title:", task.title);
        if (newTitle) {
            task.title = newTitle;
            manager.updateTask(task.id, task.title, task.description, task.dueDate, task.priority, task.projectID);
            onUpdate();
        }
    };

    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("deleteBtn");
    const deleteImg = document.createElement("img");
    deleteImg.src = deleteIcon;
    deleteBtn.append(deleteImg);
    deleteBtn.onclick = () => {
        manager.removeTask(task.id);
        onUpdate();
    };

    card.append(title, desc, dueDate, status, priority, editBtn, deleteBtn);
    console.log(isProject);
    if(!isProject) {
        const projectName = document.createElement('p');
        projectName.classList.add("projectName");
        const project = manager.projects.find((p) => p.id === task.projectID);
        projectName.textContent = project ? project.title : "";
        projectName.style.color = project ? project.color : "#000000";
        card.append(projectName);
    }
    return card;
}


const options = {
    "filter": {
        label: "Default",
        filter: (tasks) => tasks.filter(t => t),
    },
    "priority-desc": {
        label: "High to Low priority",
        filter: (tasks, manager) => manager.getTasksSortedByPriority(tasks),
    },
    "priority-asc": {
        label: "Low to High priority",
        filter: (tasks, manager) => manager.getTasksSortedByPriority(tasks).reverse(),
    },
    "completed": {
        label: "Completed Only",
        filter: (tasks) => tasks.filter(t => t.completed),
    },
    "incomplete": {
        label: "Incomplete Only",
        filter: (tasks) => tasks.filter(t => !t.completed),
    },
};


export default function taskContent(content, id, initialTasks, manager, project = false, projectID = null) {
    content.innerHTML = "";

    const getFilteredTasks = () => {
        if (project) return manager.filterTasks("project", projectID);
        return manager.filterTasks(id);
    };

    let tasks = getFilteredTasks();

    const contentHead = document.createElement('div');
    contentHead.classList.add('contentHead');

    const pageTitle = document.createElement('h1');
    pageTitle.textContent = id;

    const filterBtn = document.createElement("select");
    filterBtn.id = "filterBtn";

    for (const key in options) {
        if ((id === "completed" || id === "overdue") && (key === "completed" || key === "incomplete")) {
            continue;
        }

        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = options[key].label;
        if (key === "filter") {
            opt.selected = true;
        }
        filterBtn.appendChild(opt);
    }

    contentHead.append(pageTitle, filterBtn);

    const progress = document.createElement('div');
    progress.classList.add("progress");
    const completedTasks = document.createElement('p');
    const count = tasks.filter(t => t.completed).length;
    completedTasks.textContent = tasks.length ? `Completed ${count}/${tasks.length} tasks` : "Nothing to view here!";
    if (!tasks.length) {
        progress.classList.add("empty-progress");
    }
    progress.append(completedTasks);

    const tasksSection = document.createElement('div');
    tasksSection.classList.add("taskSection");

    const rerenderPage = () => {
        taskContent(content, id, null, manager, project, projectID);
    };

    tasks.forEach(task => {
        tasksSection.appendChild(taskCard(task, manager, project, rerenderPage));
    });

    filterBtn.addEventListener("change", () => {
        let filteredTasks = getFilteredTasks();
        const selected = filterBtn.value;

        if (options[selected]) {
            filteredTasks = options[selected].filter(filteredTasks, manager);
        }

        tasksSection.innerHTML = "";
        filteredTasks.forEach(t =>
            tasksSection.appendChild(taskCard(t, manager, project, rerenderPage))
        );
    });

    content.append(contentHead, progress, tasksSection);
}
