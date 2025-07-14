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

    addProject(title) {
        if (!this.projects.some(p => p.title === title)) {
            this.projects.push(new Project(title));
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

    filterTasks(type) {
        const now = new Date();

        switch (type) {
            case "today":
                return this.tasks.filter(t => isToday(parseISO(t.dueDate)));
            case "tomorrow":
                return this.tasks.filter(t => isTomorrow(parseISO(t.dueDate)));
            case "thisWeek":
                return this.tasks.filter(t => isThisWeek(parseISO(t.dueDate), { weekStartsOn: 1 }));
            case "upcoming":
                return this.tasks.filter(t => isAfter(parseISO(t.dueDate), now) && !isThisWeek(parseISO(t.dueDate)));
            case "overdue":
                return this.tasks.filter(t => isBefore(parseISO(t.dueDate), now) && !t.completed);
            case "completed":
                return this.tasks.filter(t => t.completed);
            case "incomplete":
                return this.tasks.filter(t => !t.completed);
            default:
                return this.tasks;
        }
    }


    saveToStorage() {
        const data = {
            tasks: this.tasks,
            projects: this.projects
        };
        localStorage.setItem("todoData", JSON.stringify(data));
    }

    filterByPriority(level) {
        return this.tasks.filter(task => task.priority === level);
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