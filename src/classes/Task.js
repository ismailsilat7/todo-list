
import IDGenerator from "./IDGenerator";

export default class Task {

    constructor(title, description, dueDate, priority, projectID, id = null, completed = false) {
        this.ID = id ?? IDGenerator.taskID;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectID = projectID;
        this.completed = completed;
    }

    static fromJSON(obj) {
        return new Task(
            obj.title,
            obj.description,
            obj.dueDate,
            obj.priority,
            obj.projectID,
            obj.ID,
            obj.completed
        );
    }

    get id() {
        return this.ID;
    }

    updateStatus() {
        this.completed = !this.completed;
    }

    update(title, description, dueDate, priority, projectID) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectID = projectID;
    }

}