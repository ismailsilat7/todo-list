import IDGenerator from "./IDGenerator";

export default class Project {

    constructor(title, id = null) {
        this.ID = id ?? IDGenerator.projectID;
        this.title = title;
    }

    static fromJSON(obj) {
        return new Project(obj.title, obj.ID);
    }

    get id() {
        return this.ID;
    }

}