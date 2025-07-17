import "./filter.css";

import completeIcon from "../images/complete-checkbox.svg";
import incompleteIcon from "../images/incomplete-checkbox.svg";
import editIcon from "../images/edit.svg";
import deleteIcon from "../images/delete.svg";
import formContent from "../form/form";

function taskCard(task, manager, isProject, onUpdate) {
    const card = document.createElement("div");
    card.classList.add("taskCard");
    card.id = task.id;

    const title = document.createElement("h3");
    title.textContent = task.title;
    title.classList.add("taskTitle");

    const desc = document.createElement("p");
    desc.textContent = task.description;
    desc.classList.add("taskDesc");

    const dueDate = document.createElement("p");
    dueDate.textContent = task.dueDate;
    dueDate.classList.add("taskDueDate");

    const status = document.createElement("span");
    const complete = document.createElement("img");
    complete.src = task.completed ? completeIcon : incompleteIcon;
    status.classList.add(task.completed ? "completed" : "incomplete", "statusBtn");
    status.append(complete);
    status.onclick = () => {
        manager.toggleTaskCompletion(task.id);
        onUpdate();
    };

    const priority = document.createElement("span");
    priority.textContent = task.priority;
    priority.classList.add(`priority-${task.priority}`, "priority");
    if (isProject) {
        priority.classList.add("priority-project");
    }

    const editBtn = document.createElement("span");
    editBtn.classList.add("editBtn");
    const editImg = document.createElement("img");
    editImg.src = editIcon;
    editBtn.append(editImg);
    editBtn.onclick = () => {
        formContent("editTask", task.id);
        document.querySelectorAll(".viewButton").forEach(b => b.classList.remove("active-sidebar"));
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

    if (!isProject) {
        const projectName = document.createElement("p");
        projectName.classList.add("projectName");
        const project = manager.projects.find(p => p.id === task.projectID);
        projectName.textContent = project ? project.title : "";
        projectName.style.color = project ? project.color : "#FFFFFF";
        const projectTasks = manager.filterTasks("project", project.id);
        projectName.addEventListener('click', () => {
            document.querySelectorAll(".viewButton").forEach(b => b.classList.remove("active-sidebar"));
            taskContent(document.querySelector("#content"), project.title, projectTasks, manager, true, project.id);
            document.querySelector(`#${project.id} .viewButton`).classList.add("active-sidebar")
        })
        card.append(projectName);
    }
    return card;
}

const options = {
    "filter": {
        label: "Default",
        filter: tasks => tasks,
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
        filter: tasks => tasks.filter(t => t.completed),
    },
    "incomplete": {
        label: "Incomplete Only",
        filter: tasks => tasks.filter(t => !t.completed),
    },
    "date": {
        label: "Furthest Due First",
        filter: tasks => tasks.slice().sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    },
    "oldDate": {
        label: "Closest Due First",
        filter: tasks => tasks.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }
};

let prevState = "filter"

export default function taskContent(content, id, tasks = null, manager, project = false, projectID = null) {
    content.innerHTML = "";

    // Refetch latest tasks if not passed in
    const fetchTasks = () => {
        let filterTasks =  project ? manager.filterTasks("project", projectID) : manager.filterTasks(id);
        return (options[prevState]) ? options[prevState].filter(filterTasks, manager) : filterTasks;
    };

    let currentTasks = tasks ?? fetchTasks();

    const rerender = () => {
        taskContent(content, id, null, manager, project, projectID, prevState);
    };

    const contentHead = document.createElement("div");
    contentHead.classList.add("contentHead");

    const pageTitle = document.createElement("h1");
    pageTitle.textContent = (id == "thisWeek") ? "This Week" : id;
    contentHead.append(pageTitle);

    const filterBtn = document.createElement("select");
    filterBtn.id = "filterBtn";

    for (const key in options) {
        if ((id === "completed" || id === "overdue") && (key === "completed" || key === "incomplete")) {
            continue;
        }

        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = options[key].label;
        if (key === prevState) {
            opt.selected = true;
        }
        filterBtn.appendChild(opt);
    }

    contentHead.append(filterBtn);

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const completedCount = currentTasks.filter(t => t.completed).length;
    const progressText = document.createElement("p");
    progressText.textContent = currentTasks.length ? `Completed ${completedCount}/${currentTasks.length} tasks` : "Nothing to view here!";

    if (!currentTasks.length) {
        progress.classList.add("empty-progress");
    }

    progress.append(progressText);

    const tasksSection = document.createElement("div");
    tasksSection.classList.add("taskSection");

    currentTasks.forEach(task => {
        tasksSection.appendChild(taskCard(task, manager, project, rerender));
    });

    filterBtn.addEventListener("change", () => {
        const selected = filterBtn.value;
        prevState = selected;
        let filteredTasks = fetchTasks();

        if (options[selected]) {
            filteredTasks = options[selected].filter(filteredTasks, manager);
        }

        tasksSection.innerHTML = "";
        filteredTasks.forEach(task => {
            tasksSection.appendChild(taskCard(task, manager, project, rerender));
        });
        taskContent(content, id, null, manager, project, projectID)
    });

    content.append(contentHead, progress, tasksSection);
}
