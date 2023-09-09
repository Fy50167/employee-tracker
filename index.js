const inquirer = require('inquirer');
const mysql = require('mysql2');

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
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ])
    .then((answers) => {
        
    })
}

init();