import inquirer from "inquirer";
import DB from './server.js';
const dbInstance = new DB();
function startProgram() {
    console.log('---------Employee Tracker---------');
    inquirer.prompt({
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add An Employee',
            'Update An Employee Role',
            'View All Roles',
            'Add A Role',
            'View All Departments',
            'Add A Department',
            'Quit'
        ],
    }).then((answer) => {
        const option = answer.options;
        switch (option) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add An Employee':
                addEmployee();
                break;
            case 'Update An Employee Role':
                updateEmployeeRole();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add A Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add A Department':
                addDepartment();
                break;
            case 'Quit':
                quit();
                break;
            default:
                console.log('Option not valid');
        }
    });
}
async function viewAllEmployees() {
    try {
        const { rows } = await dbInstance.listAllEmployees();
        console.table(rows);
    }
    catch (error) {
        console.error('Error retrieving employees:', error);
    }
    finally {
        startProgram();
    }
}
async function addEmployee() {
    try {
        const { rows } = await dbInstance.listAllEmployees();
        const roleChoices = rows.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        const managerChoices = rows.map(({ id, first_name }) => ({
            name: first_name,
            value: id,
        }));
        // Prompt for employee data
        const data = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name', // Changed to match the database schema
                message: 'What is the first name?'
            },
            {
                type: 'input',
                name: 'last_name', // Changed to match the database schema
                message: 'What is the last name?'
            },
            {
                type: 'list',
                name: 'role_id', // Changed to match the database schema
                message: 'What role does the employee belong to?',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id', // Changed to match the database schema
                message: 'What manager does the employee belong to?',
                choices: managerChoices
            }
        ]);
        // Call the method to add a new employee
        await dbInstance.addNewEmployee(data.first_name, data.last_name, data.role_id, data.manager_id);
        console.log('Employee added successfully!');
    }
    catch (error) {
        console.error('Error adding employee:', error);
    }
    finally {
        await startProgram();
    }
}
async function updateEmployeeRole() {
    try {
        const { rows } = await dbInstance.listAllEmployees();
        const roleChoices = rows.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        const managerChoices = rows.map(({ id, first_name }) => ({
            name: first_name,
            value: id,
        }));
        const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        // Prompt for selecting an employee to update
        const { employeeId } = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Which employee do you want to update?',
            choices: employeeChoices
        });
        // Prompt for new employee data
        const newData = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the new first name:'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the new last name:'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role:',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the new manager:',
                choices: managerChoices
            }
        ]);
        // Call the method to update the employee's role
        await dbInstance.updateAnEmployeeRole(employeeId, newData);
        console.log('Employee updated successfully!');
    }
    catch (error) {
        console.error('Error updating employee:', error);
    }
    finally {
        await startProgram();
    }
}
async function viewAllRoles() {
    try {
        const { rows } = await dbInstance.viewRoles();
        console.table(rows);
    }
    catch (error) {
        console.error('Error retrieving roles:', error);
    }
    finally {
        await startProgram();
    }
}
async function addRole() {
    try {
        const { rows } = await dbInstance.viewDepartments();
        const departmentChoices = rows.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        const data = await inquirer.prompt([
            {
                type: 'input',
                name: 'titleName',
                message: 'What role title would you like to add?',
            },
            {
                type: 'input',
                name: 'salaryAmount',
                message: 'What salary amount would you like to add?',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'What department for the role?',
                choices: departmentChoices,
            },
        ]);
        await dbInstance.addRoles(data.titleName, data.salaryAmount, data.departmentId);
        console.log('Role created successfully!');
    }
    catch (error) {
        console.error('Error adding role:', error);
    }
    finally {
        await startProgram();
    }
}
async function viewAllDepartments() {
    try {
        const { rows } = await dbInstance.viewDepartments();
        console.table(rows);
    }
    catch (error) {
        console.error('Error retrieving departments:', error);
    }
    finally {
        await startProgram();
    }
}
async function addDepartment() {
    try {
        const data = await inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What department would you like to add?',
            },
        ]);
        await dbInstance.addADepartment(data.departmentName);
        console.log('Department created successfully!');
    }
    catch (error) {
        console.error('Error adding department:', error);
    }
    finally {
        await startProgram();
    }
}
function quit() {
    dbInstance.quitProcess();
}
// Start the program
startProgram();
