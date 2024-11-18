import { pool, connectToDb } from './connections';

interface NewEmployeeData {
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id?: number | null;
}

class DB {
    constructor() {}

    async query(sql: any, _args = []) {
        const client = await connectToDb();
        try {
            const result = await client.query(sql, _args);
            return result;
        } finally {
            client.release();
        }

    }

    listAllEmployees() {
        return this.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id");
    }

    addNewEmployee(firstName: string, lastName: string, roleID: number, managerId?: number | null) {
        const params: (string | number | null)[] = [
            firstName,
            lastName,
            roleID,
            managerId === undefined ? null : managerId
        ];
    
        return this.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            params
        );
    }

    async updateAnEmployeeRole(employeeId: number, newData: NewEmployeeData) {
        const { first_name, last_name, role_id, manager_id } = newData;
        return this.query("UPDATE employee SET first_name = $1, last_name = $2, role_id = $3, manager_id = $4 WHERE id = $5",
            [first_name, last_name, role_id, manager_id === undefined ? null : manager_id, employeeId]
        )
    }

    viewRoles(){
        return this.query("SELECT * FROM role");
    }

    addRoles(titleName: string, salaryAmount: number, departmentId: number){
        return this.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [titleName, salaryAmount, departmentId]);
    }

    viewDepartments() {
        return this.query("SELECT * FROM department");
    }

    addADepartment(departmentName: string) {
        return this.query("INSERT INTO department (name) VALUES ($1)", [departmentName]);
    }

    quitProcess() {
        return process.exit();
    }
}

export default DB;