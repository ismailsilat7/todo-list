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
  isAfter,
  startOfDay
} from 'date-fns';

export default class ToDoManager {

    constructor() {
        this.tasks = [];
        this.projects = [];

        const data = JSON.parse(localStorage.getItem("todoData"));
        if (!data) {
            const todoTour = new Project("Upnext tour", "#18cb96");
            const personal = new Project("Personal", "#8BC34A");
            const work = new Project("Work", "#00BCD4");

            this.projects.push(todoTour, personal, work);

            const today = new Date();
            const formatDate = (offsetDays) =>
                new Date(today.getTime() + offsetDays * 86400000).toISOString().split("T")[0];

            this.tasks.push(
                new Task("Add your first task", "Try clicking the 'Add Task' button and fill out the form.", formatDate(0), "low", todoTour.id),
                new Task("Create a new project", "Add a project to organize your tasks.", formatDate(0), "low", todoTour.id),
                new Task("Edit a task", "Click the pencil icon on a task card to edit it.", formatDate(0), "low", todoTour.id),
                new Task("Mark a task as complete", "Click the checkbox icon to mark a task as done!", formatDate(0), "low", todoTour.id),

                new Task("Buy groceries", "Milk, eggs, bread, fruits", formatDate(0), "low", personal.id),
                new Task("Call parents", "Catch up over a video call", formatDate(1), "high", personal.id),
                new Task("Pay rent", "Transfer rent to landlord", formatDate(-2), "high", personal.id),

                new Task("Team standup", "Daily sync at 10 AM", formatDate(0), "medium", work.id),
                new Task("Submit report", "Quarterly performance report", formatDate(1), "high", work.id),
                new Task("Client feedback", "Review and summarize feedback notes", formatDate(2), "medium", work.id),
                new Task("Prepare presentation", "Q3 roadmap presentation", formatDate(5), "low", work.id)
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
                    isBefore(parseISO(t.dueDate), startOfDay(now)) && !t.completed
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