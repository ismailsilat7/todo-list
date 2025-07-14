export default class IDGenerator {
    static TaskID = Number(localStorage.getItem("taskCounter")) || 0;
    
    static ProjectID = Number(localStorage.getItem("projectCounter")) || 0;

    static get taskID() {
        const id = `task-${IDGenerator.TaskID}`;
        localStorage.setItem("taskCounter", IDGenerator.TaskID++)
        localStorage.setItem("taskCounter", IDGenerator.TaskID);
        return id;
    }

    static get projectID() {
        const id = `project-${IDGenerator.ProjectID}`;
        IDGenerator.ProjectID++;
        localStorage.setItem("projectCounter", IDGenerator.ProjectID);
        return id;
    }

}