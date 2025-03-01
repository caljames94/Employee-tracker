import { connectToDb } from './connections.js';
class DB {
    constructor() { }
    // had to update connections.ts as your connectToDb function was not returning anything.
    // also updated the _args to support addNewEmployee function paramsa data type
    async query(sql, _args = []) {
        const client = await connectToDb();
        try {
            const result = await client.query(sql, _args);
            return result;
        }
        catch (error) {
            console.error("Database query error:", error);
            throw new Error("Failed to execute query.");
        }
        finally {
            client.release();
        }
    }
    listAllEmployees() {
        return this.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id");
    }
    addNewEmployee(firstName, lastName, roleID, managerId) {
        const params = [
            firstName,
            lastName,
            roleID,
            managerId === undefined ? null : managerId
        ];
        return this.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", params);
    }
    async updateAnEmployeeRole(employeeId, newData) {
        const { first_name, last_name, role_id, manager_id } = newData;
        return this.query("UPDATE employee SET first_name = $1, last_name = $2, role_id = $3, manager_id = $4 WHERE id = $5", [first_name, last_name, role_id, manager_id === undefined ? null : manager_id, employeeId]);
    }
    viewRoles() {
        return this.query("SELECT * FROM role");
    }
    addRoles(titleName, salaryAmount, departmentId) {
        return this.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [titleName, salaryAmount, departmentId]);
    }
    viewDepartments() {
        return this.query("SELECT * FROM department");
    }
    addADepartment(departmentName) {
        return this.query("INSERT INTO department (name) VALUES ($1)", [departmentName]);
    }
    quitProcess() {
        return process.exit();
    }
}
export default DB;
