//then i am presented with the options to view or do
function start() {
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'options',
                message: 'What do you want to view?',
                choices: [
                    {
                        name: 'view all departments',
                        value: 'view_all_departments'
                    },
                    {
                        name: 'view all roles',
                        value: 'view_all_roles'
                    },
                    {
                        name: 'view all employees',
                        value: 'view_all_employees'
                    },
                    {
                        name: 'add a department',
                        value: 'add_a_department'
                    },
                    {
                        name: 'add a role',
                        value: 'add_a_role'
                    },
                    {
                        name: 'add an employee',
                        value: 'add_an_employee'
                    },
                    {
                        name: 'update an employee',
                        value: 'update_an_employee'
                    },
                    {
                        name: 'quit',
                        value: 'quit'
                    }
                ]
            }
        ]
    )
        .then(res => {
            switch (res.options) {
                case 'view_all_departments':
                    viewAllDepartments();
                    break;
                case 'view_all_roles':
                    viewAllRoles();
                    break;
                case 'view_all_employees':
                    viewAllEmployees()
                    break;
                case 'add_a_department':
                    addDepartment();
                    break;
                case 'add_a_role':
                    addRole();
                    break;
                case 'add_an_employee':
                    addEmployee();
                    break;
                case 'update_an_employee':
                    updateEmployee()
                    break;
                default:
                    quit();
            };
        });
}
// select view all departments

const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        start();
    });
};


/*WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role*/
const viewAllRoles = () => {
    const sql = `SELECT * FROM roles`;


    connect.query(sql, (err, res) => {
        if (res) {
            const table = console.table(res);
            console.log(table);
            start();
        } else {
            console.log('Something went wrong', err);
        }
    });
};

/*WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database*/
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'addDepartment',
        message: 'Please enter department name!',

    })
        .then(res => {
            let department = res.addDepartment;
            DB.createDepartment(department).then(() =>
                console.log(`add ${department}`)
            );
        })
        .then(() => start());
};

/*WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department 
for the role and that role is added to the database*/

const addRole = () => {
    DB.findAllDepartments().then(([department]) => {
        const departmentOptions = department.map(({ id, name }) => ({
            name: name,
            value: id,

        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'addRole',
                message: 'Please enter new role name!',
            },
            {
                type: "input",
                name: 'addSalary',
                message: 'please enter salary',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Please enter the department for the role.',
                choices: departmentOptions,
            },
        ]).then(answers => {
            DB.createRole(answers.addRole, answers.department, answers.addSalary)
                .then(() =>
                    console.log(`added ${answers.addRole}, added ${answers, department}, added ${answers.addSalary}`
                    )
                )
                .then(() => start());
        }
        )
    })

};

function quit() {
    console.log("Goodbye!");
    process.exit();
};

module.exports = router;