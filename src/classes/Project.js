import IDGenerator from "./IDGenerator";

export default class Project {

    constructor(title, color, id = null) {
        this.ID = id ?? IDGenerator.projectID;
        this.title = title;
        this.color = color;
    }

    static fromJSON(obj) {
        return new Project(obj.title, obj.color, obj.ID);
    }

    get id() {
        return this.ID;
    }

}