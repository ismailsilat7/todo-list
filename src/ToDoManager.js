import Task from "./classes/Task";
import Project from "./classes/Project";

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1
};

import {
  isToday,
  isTomorrow,
  isThisWeek,
  parseISO,
  format,
  isBefore,
  differenceInDays,
  isSameDay,
  isAfter
} from 'date-fns';

export default class ToDoManager {

    constructor() {
        this.tasks = [];
        this.projects = [];

        const data = JSON.parse(localStorage.getItem("todoData"));
        if (!data) {
            // Add initial projects
            const defaultProject = new Project("Personal");
            const workProject = new Project("Work");

            this.projects.push(defaultProject, workProject);

            // Add initial tasks
            const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
            const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

            this.tasks.push(
                new Task("Buy groceries", "Milk, eggs, bread", today, "medium", defaultProject.id),
                new Task("Prepare slides", "Project update slides", tomorrow, "high", workProject.id)
            );

            this.saveToStorage();
            return;
        }


        this.tasks = data.tasks.map(Task.fromJSON);
        
        this.projects = data.projects.map(Project.fromJSON);

    }

    addTask(title, description, dueDate, priority, projectID) {
        if (this.projects.some(p => p.id === projectID)) {
            this.tasks.push(new Task(title, description, dueDate, priority, projectID));
            this.saveToStorage();
        }
    }

    updateTask(taskID, title, description, dueDate, priority, projectID) {
        for(let task of this.tasks) {
            if(task.id == taskID) {
                task.update(title, description, dueDate, priority, projectID);
                this.saveToStorage();
            }
        }
    }

    toggleTaskCompletion(taskID) {
        const task = this.tasks.find(t => t.id === taskID);
        if (task) {
            task.updateStatus();
            this.saveToStorage();
        }
    }

    removeTask(taskID) {
        this.tasks = this.tasks.filter((task) => {
            return task.id != taskID;
        })
        this.saveToStorage();
    }

    addProject(title, color) {
        if (!this.projects.some(p => p.title === title)) {
            this.projects.push(new Project(title, color));
            this.saveToStorage();
        }
    }

    removeProject(projectID) {
        this.tasks = this.tasks.filter((task) => {
            return task.projectID != projectID;
        })
        this.projects = this.projects.filter((project) => {
            return project.id != projectID;
        })
        this.saveToStorage();
    }

    tasksDueOn(date) {
        return this.tasks.filter(task =>
            isSameDay(parseISO(task.dueDate), parseISO(date))
        );
    }

    filterTasks(type, projectID = null) {
        const now = new Date();

        let filteredTasks = this.tasks;

        if (projectID !== null) {
            filteredTasks = filteredTasks.filter(t => t.projectID === projectID);
        }

        switch (type) {
            case "inbox":
                return filteredTasks;
            case "today":
                return filteredTasks.filter(t => isToday(parseISO(t.dueDate)));
            case "thisWeek":
                return filteredTasks.filter(t =>
                    isThisWeek(parseISO(t.dueDate), { weekStartsOn: 1 })
                );
            case "upcoming":
                return filteredTasks.filter(t =>
                    isAfter(parseISO(t.dueDate), now) &&
                    !isThisWeek(parseISO(t.dueDate), { weekStartsOn: 1 })
                );
            case "overdue":
                return filteredTasks.filter(t =>
                    isBefore(parseISO(t.dueDate), now) && !t.completed
                );
            case "completed":
                return filteredTasks.filter(t => t.completed);
            case "incomplete":
                return filteredTasks.filter(t => !t.completed);
            default:
                return filteredTasks;
        }
    }

    saveToStorage() {
        const data = {
            tasks: this.tasks,
            projects: this.projects
        };
        localStorage.setItem("todoData", JSON.stringify(data));
    }

    filterByPriority(level, projectID = null) {
        return this.tasks.filter(task => task.priority === level && (projectID != null && task.projectID === projectID));
    }

    getTasksSortedByPriority(tasks = this.tasks) {
        return [...tasks].sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
    }

}

export {
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
};