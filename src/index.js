import ToDoManager from "./ToDoManager";
import "./style.css"
import { 
    priorityRank,
    isToday,
    isTomorrow,
    isThisWeek,
    parseISO,
    format,
    isBefore,
    differenceInDays,
    isSameDay,
    isAfter
} from "./ToDoManager";

import taskContent from "./filter/filter";

import hashIconRaw from "./images/hash.svg?raw";
import deleteIcon from "./images/delete.svg";

import logoIcon from "./images/logo-nobg-white.png";
import sidebarIcon from "./images/sidebar-icon.png";
import addIcon from "./images/add.svg";
import inboxIcon from "./images/inbox.svg";
import todayIcon from "./images/today.svg";
import weekIcon from "./images/week.svg";
import upcomingIcon from "./images/upcoming.svg";
import overdueIcon from "./images/overdue.svg";
import completedIcon from "./images/completed.svg";
import addProjectIcon from "./images/addproject.svg"


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


const manager = new ToDoManager();
window.manager = manager;

const projects = document.querySelector(".projectsButtons");

function updateProject() {
    projects.innerHTML = "";
    for (let i = 0; i < manager.projects.length; i++) {
    
        const project = manager.projects[i];
        const div = document.createElement("div");
        div.id = project.id;
        div.classList.add("project-entry");
    
        const name = document.createElement("span");

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
    }
}

const iconMap = {
  logo: logoIcon,
  sidebar: sidebarIcon,
  add: addIcon,
  inbox: inboxIcon,
  today: todayIcon,
  week: weekIcon,
  upcoming: upcomingIcon,
  overdue: overdueIcon,
  completed: completedIcon,
  addproject: addProjectIcon,
};

const views = {
    inbox: manager.filterTasks("inbox"),
    today: manager.filterTasks("today"),
    thisWeek: manager.filterTasks("thisWeek"),
    upcoming: manager.filterTasks("upcoming"),
    overdue: manager.filterTasks("overdue"),
    completed: manager.filterTasks("completed"),
};



document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img[data-icon]").forEach((img) => {
        const iconKey = img.getAttribute("data-icon");
        if (iconMap[iconKey]) {
            img.src = iconMap[iconKey];
        }
    });
    updateProject();

    document.querySelectorAll(".button").forEach(button => {
        button.addEventListener('click', (e) => {
            taskContent(document.querySelector("#content"), button.id, views[button.id], manager);
        });
    });
});

taskContent(document.querySelector("#content"), "inbox", views["inbox"], manager);

const sidebar = document.querySelector(".sidebar-content");
document.querySelector("#sidebar-icon").addEventListener('click', () => {
    sidebar.classList.toggle("inactive-sidebar");
})

