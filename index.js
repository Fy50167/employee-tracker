const inquirer = require('inquirer');
const mysql = require('mysql2');
let departments;  
let roles;
let employees;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '50167',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do with your database?",
            name: "database_choices",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])
    .then((answers) => {
        switch(answers.database_choices) {
            case 'Exit': // Adding option to allow for exiting out of the node process
                console.log('Bye!');
                process.exit();
                break;
            case 'View all departments':
                console.log('Displaying all departments');
                db.query('SELECT * FROM departments', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log(''); // Blank console logs to have the formatted table show up on the next line, otherwise top of table is cut off.
                    console.table(res);
                  });
                init();
                break;
            case 'View all roles':
                console.log('Displaying all roles');
                db.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department_name FROM roles INNER JOIN departments ON roles.department_id = departments.id;', (err, res) => { // Using join to display the correct information
                    if (err) {
                        throw err;
                    }
                    console.log('');
                    console.table(res);
                  });
                init();
                break;
            case 'View all employees':
                console.log('Displaying all employees');
                db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department_name, roles.salary, employees_2.full_name AS manager FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS employees_2 ON employees.manager_id = employees_2.id;", (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log('');
                    console.table(res);
                  });
                init();
                break;
            case 'Add a department':
                inquirer.prompt([
                    {
                        type: "prompt",
                        message: "What is the name of the department?",
                        name: "department_name",
                    }
                ])
                .then((department_answers) => {
                    db.query(`INSERT INTO departments(name) VALUES ('${department_answers.department_name}')`, (err, res) => {
                        if (err) {
                            throw err;
                        }
                      });
                      init();
                });
                break;
            case 'Add a role':
                departments = []; // Resetting departments
                db.query('SELECT name FROM departments', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < res.length; i++) {
                        departments.push(res[i].name); // Filling empty array with names of all of the departments
                    }
                  });
                inquirer.prompt([
                    {
                        type: "prompt",
                        message: "What is the name of the role?",
                        name: "role_name",
                    },
                    {
                        type: "prompt",
                        message: "What is the salary of the role?",
                        name: "role_salary"
                    },
                    {
                        type: "list",
                        message: "What department is the role in?",
                        name: "role_department",
                        choices: departments
                    }
                ])
                .then((role_answers) => {
                    db.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${role_answers.role_name}', ${role_answers.role_salary}, ${departments.indexOf(role_answers.role_department) + 1})`, (err, res) => {
                        if (err) {
                            throw err;
                        }
                      });
                      init();
                });
                break;
            case 'Add an employee':
                roles = []; // Resetting roles
                db.query('SELECT title FROM roles', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < res.length; i++) {
                        roles.push(res[i].title); // Filling empty array with names of all of the roles
                    }
                  });

                employees = ['No manager']; // Resetting employees
                db.query('SELECT full_name FROM employees', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < res.length; i++) {
                        employees.push(res[i].full_name); // Filling empty array with names of all of the roles
                    }
                });
                inquirer.prompt([
                    {
                        type: "prompt",
                        message: "What is the first name of the employee?",
                        name: "employee_first",
                    },
                    {
                        type: "prompt",
                        message: "What is the last name of the employee?",
                        name: "employee_last"
                    },
                    {
                        type: "list",
                        message: "What role does the exmployee have?",
                        name: "employee_role",
                        choices: roles
                    },
                    {
                        type: "list",
                        message: "Does the employee have a manager?",
                        name: "employee_manager",
                        choices: employees
                    }
                ])
                .then((employee_answers) => {
                    const full_name = employee_answers.employee_first + ' ' + employee_answers.employee_last;
                    if (employee_answers.employee_manager === 'No manager') { // If statement to check if the added employee has a manager or not.
                        console.log(full_name);
                        db.query(`INSERT INTO employees(first_name, last_name, full_name, role_id, manager_id) VALUES ('${employee_answers.employee_first}', '${employee_answers.employee_last}', '${full_name}', ${roles.indexOf(employee_answers.employee_role) + 1}, null)`, (err, res) => {
                            if (err) {
                                throw err;
                            }
                          });
                          init();
                    } else {
                        console.log(full_name);
                        console.log(employees.indexOf(employee_answers.employee_manager) + 2);
                        db.query(`INSERT INTO employees(first_name, last_name, full_name, role_id, manager_id) VALUES ('${employee_answers.employee_first}', '${employee_answers.employee_last}', '${full_name}', ${roles.indexOf(employee_answers.employee_role) + 1}, ${employees.indexOf(employee_answers.employee_manager) + 2})`, (err, res) => {
                            if (err) {
                                throw err;
                            }
                          });
                          init();
                    }
                });
                break;
            case 'Update an employee role':
                roles = []; // Resetting roles
                db.query('SELECT title FROM roles', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < res.length; i++) {
                        roles.push(res[i].title); // Filling empty array with names of all of the roles
                    }
                  });

                employees = []; // Resetting employees
                db.query('SELECT full_name FROM employees', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 0; i < res.length; i++) {
                        employees.push(res[i].full_name); // Filling empty array with names of all of the roles
                    }
                });

                inquirer.prompt([
                    {
                        type: "confirm", // This confirm serves no actual function; However, for some reason the following list choices didn't function (were completely empty) without at least one inquirer question coming before.
                        // Not sure what caused this bug to occur but was unable to find any information on it online so for now I'm defaulting to include a throwaway confirm before to make the choices work for questions 2 and 3. 
                        message: "Are you sure you want to update an employee's information?",
                        name: "update_confirm"
                    },
                    {
                        type: "list",
                        message: "Which employee do you want to update information for?",
                        name: "update_name",
                        choices: employees // These choices were empty without a preceding question.
                    },
                    {
                        type: "list",
                        message: "What new role should this employee have?",
                        name: "update_role",
                        choices: roles // These choices as well.
                    }
                ])
                .then((update_answers) => {
                    db.query(`UPDATE employees SET role_id = ${roles.indexOf(update_answers.update_role) + 1} WHERE full_name = '${update_answers.update_name}'`, (err, res) => {
                        if (err) {
                            throw err;
                        }
                    });
                    init();
                });
                break;
        }
    })
}

init();