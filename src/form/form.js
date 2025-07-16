
import "./form.css";
import taskContent from "../filter/filter";

import hashIconRaw from "../images/hash.svg?raw";
import deleteIcon from "../images/delete.svg";
function injectColoredIcon(color) {
    if(color == null) {
        color = "#ffffff";
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = hashIconRaw;
    const svg = wrapper.querySelector("svg");

    svg.style.width = "16px";
    svg.style.height = "16px";
    svg.style.fill = color;

    return svg;
}

function updateProject() {
    const projects = document.querySelector(".projectsButtons");
    projects.innerHTML = "";
    for (let i = 0; i < manager.projects.length; i++) {
    
        const project = manager.projects[i];
        const div = document.createElement("div");
        div.id = project.id;
        div.classList.add("project-entry");
    
        const name = document.createElement("span");
        name.classList.add("viewButton");

        const colorSpan = document.createElement("span");
        const svg = injectColoredIcon(project.color);
        colorSpan.appendChild(svg);
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = project.title.toLowerCase();
        name.append(colorSpan, nameSpan);

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("removeBtn")
        const removeImg = document.createElement("img");
        removeImg.src = deleteIcon;
        removeBtn.append(removeImg);
        removeBtn.onclick = () => {
            manager.removeProject(project.id);
            div.remove();
        };
    
        div.append(name, removeBtn);
        projects.appendChild(div);

        name.addEventListener('click', () => {
            const projectTasks = manager.filterTasks("project", project.id);
            taskContent(document.querySelector("#content"), project.title, projectTasks, manager, true, project.id);
        });
    }
}

const types = {
    addTask: "Add Task",
    editTask: "Edit Task",
    addProject: "Add Project"
};

function message(m) {
    const body = document.querySelector("body");
    const p = document.createElement('p');
    p.textContent = m;
    p.classList.add('message');
    body.appendChild(p);

    setTimeout(() => {
        p.remove();
    }, 2500);

}

function taskForm(form) {
    const inputTitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.name = "title";
    inputTitle.placeholder = "Enter task title";
    inputTitle.required = true;
    inputTitle.id = "title";
    inputTitle.classList.add("formInput");

    const inputDesc = document.createElement('textarea');
    inputDesc.name = "description";
    inputDesc.placeholder = "Enter task description";
    inputDesc.id = "description";
    inputDesc.classList.add("formInput");
    inputDesc.required = true;

    const inputDate = document.createElement('input');
    inputDate.type = "date";
    inputDate.name = "dueDate";
    inputDate.id = "dueDate";
    inputDate.classList.add("formInput");
    inputDate.required = true;

    const selectPriority = document.createElement('select');
    selectPriority.name = "priority";
    selectPriority.id = "priority";
    selectPriority.classList.add("formInput");
    selectPriority.required = true;

    ["low", "medium", "high"].forEach(level => {
        const opt = document.createElement("option");
        opt.value = level;
        opt.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        selectPriority.appendChild(opt);
    });

    const selectProject = document.createElement("select");
    selectProject.name = "projectID";
    selectProject.id = "projectID";
    selectProject.classList.add("formInput");
    selectProject.required = true;

    window.manager.projects.forEach(project => {
        const opt = document.createElement("option");
        opt.value = project.id;
        opt.textContent = project.title;
        selectProject.appendChild(opt);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.id = "submitBtn";
    submitBtn.textContent = "Add Task";
    form.append(inputTitle, inputDesc, inputDate, selectPriority, selectProject, submitBtn);

    return { inputTitle, inputDesc, inputDate, selectPriority, selectProject, submitBtn };
}

function addTaskForm(form) {
    const { inputTitle, inputDesc, inputDate, selectPriority, selectProject, submitBtn } = taskForm(form);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.manager.addTask(inputTitle.value, inputDesc.value, inputDate.value, selectPriority.value, selectProject.value);
        message(`${inputTitle.value} added successfully!`)
    })
}

function editTaskForm(form, taskID) {
    const task = window.manager.tasks.find(t => t.id === taskID);
    if (!task) return;
    const { inputTitle, inputDesc, inputDate, selectPriority, selectProject, submitBtn } = taskForm(form);

    inputTitle.value = task.title;
    inputDesc.value = task.description;
    inputDate.value = task.dueDate;
    selectPriority.value = task.priority;
    selectProject.value = task.projectID;
    submitBtn.textContent = "Save Task";

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.manager.updateTask(taskID, inputTitle.value, inputDesc.value, inputDate.value, selectPriority.value, selectProject.value);
        message(`${inputTitle.value} updated successfully!`)
    })
}

const textColorOptions = [
  { name: "Choose label color", value: "#ffffff"},
  { name: "White", value: "#FFFFFF"},
  { name: "Soft White", value: "#F5F5F5"},
  { name: "Sky Blue", value: "#89CFF0"},
  { name: "Powder Blue", value: "#B0E0E6"},
  { name: "Mint Green", value: "#98FF98"},
  { name: "Peach", value: "#FFDAB9"},
  { name: "Lavender", value: "#E6E6FA"},
  { name: "Salmon", value: "#FFA07A"},
  { name: "Light Coral", value: "#F08080"},
  { name: "Light Gray", value: "#CCCCCC"},
  { name: "Cool Gray", value: "#AEB6BF"}
];

function addProjectForm(form) {
    const inputTitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.name = "title";
    inputTitle.placeholder = "Enter project title";
    inputTitle.required = true;
    inputTitle.id = "title";
    inputTitle.classList.add("formInput");

    const colorSelect = document.createElement("select");
    colorSelect.name = "color";
    colorSelect.id = "color";
    colorSelect.classList.add("formInput");
    colorSelect.required = true;

    textColorOptions.forEach(color => {
        const option = document.createElement("option");
        option.value = color.value;
        if(color.name == "Choose label color") {
            option.selected = true;
            option.disabled = true;
        }
        option.textContent = color.name;
        option.style.color = color.value;
        option.style.backgroundColor = "#373643";
        colorSelect.appendChild(option);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.manager.addProject(inputTitle.value, colorSelect.value);
        message(`${inputTitle.value} added successfully!`)
        form.reset();
        updateProject();
    })

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.id = "submitBtn";
    submitBtn.textContent = "Add Project";

    form.append(inputTitle, colorSelect, submitBtn);
}


export default function formContent(type, taskID = null) {
    const content = document.querySelector("#content");
    content.innerHTML = "";

    const formSection = document.createElement('div');
    formSection.classList.add('formSection');

    if (!(type in types)) {
        content.textContent = "BROKEN PATH";
        return;
    }

    const head = document.createElement("div");
    head.classList.add("formHead");

    const title = document.createElement("h2");
    title.textContent = types[type];

    head.append(title);

    const form = document.createElement("form");
    form.classList.add("form");

    if (type === "addTask") {
        addTaskForm(form);
    } else if (type === "editTask") {
        editTaskForm(form, taskID);
    } else if (type === "addProject") {
        addProjectForm(form);
    }

    formSection.append(head, form);

    content.appendChild(formSection)
}

export {updateProject};
