import ToDoManager from "./ToDoManager";
import "./style.css"
import { updateProject } from "./form/form";
import taskContent from "./filter/filter";
import formContent from "./form/form";
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

const manager = new ToDoManager();
window.manager = manager;

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

// had to convert this to function as previously the load time data was being storeddd :/
const views = {
    inbox: () => manager.filterTasks("inbox"),
    today: () => manager.filterTasks("today"),
    thisWeek: () => manager.filterTasks("thisWeek"),
    upcoming: () => manager.filterTasks("upcoming"),
    overdue: () => manager.filterTasks("overdue"),
    completed: () => manager.filterTasks("completed"),
};


function removeActiveSidebar() {
    document.querySelectorAll(".viewButton").forEach(b => b.classList.remove("active-sidebar"));
}

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
            taskContent(document.querySelector("#content"), button.id, views[button.id](), manager);
        });
    });

    document.querySelectorAll(".viewButton").forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeActiveSidebar();
            btn.classList.add("active-sidebar");
        })
    })
    const addTask = document.querySelector("#addTask")
    addTask.addEventListener("click", () => {
        removeActiveSidebar();
        document.querySelector("#content").textContent = ""
        formContent("addTask")
    });

    const addProject = document.querySelector("#addProject")
    addProject.addEventListener("click", () => {
        removeActiveSidebar();
        document.querySelector("#content").textContent = ""
        addProject.classList.add("active-sidebar");
        formContent("addProject")
    });

    if(window.innerWidth < 768) {
        document.querySelector(".sidebar-content").classList.toggle("inactive-sidebar");
    }

});

taskContent(document.querySelector("#content"), "inbox", views["inbox"](), manager);
document.querySelector("#inbox").classList.add("active-sidebar");

const sidebar = document.querySelector(".sidebar-content");
document.querySelector("#sidebar-icon").addEventListener('click', () => {
    sidebar.classList.toggle("inactive-sidebar");
})

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (sidebar.classList.contains("inactive-sidebar")) {
            sidebar.classList.remove("inactive-sidebar");
        }
    }
});

