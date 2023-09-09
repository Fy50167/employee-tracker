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
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])
    .then((answers) => {
        switch(answers.database_choices) {
            case 'Exit':
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
                db.query('SELECT * FROM roles', (err, res) => {
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
                db.query('SELECT * FROM employees', (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log('');
                    console.table(res);
                  });
                init();
                break;
            case 'Add a department':
                init();
                break;
            case 'Add a role':
                init();
                break;
            case 'Add an employee':
                init();
                break;
            case 'Update an employee role':
                init();
                break;
        }
    })
}

init();