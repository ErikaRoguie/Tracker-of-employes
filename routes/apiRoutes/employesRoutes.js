/*WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids,
 first names, last names, job titles, departments, salaries, and managers that the employees report to*/

 const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department,
    roles.salary,
    concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee
    LEFT JOIN roles
    on employee.roles_id = roles.id
    LEFT JOIN department
    on roles.department_id = department.id
    LEFT JOIN employee manager
    on manager.id = employee.manager_id`;


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

/*WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, 
and that employee is added to the database*/

const addEmployee = () => {
    DB.findAllRoles().then(([employee]) => {
        const employeeRoleOptions = employee.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        //let idObject;
        //for (let i=0; i < employee.length; i++){
        // idObject[employee[i].title] = employee[i].id
        //   }
        DB.findAllEmployees().then(([manager]) => {
            const managerOptions = manager.map(
                ({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id,

                })
            );
            // let employeeObject;
            // for (let i = 0; i< manager.length; i++) {
            //    employeeObject[`${manager[i].first_name} ${manager[i].last_name}`] = manager[i].id
            // }
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Please enter employee first name.,'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Please enter last name.',

                },
                {
                    type: 'list',
                    name: 'roles',
                    message: ' What is the employees role?',
                    choices: employeeRoleOptions,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Choose manager',
                    choices: managerOptions,
                },
            ]).then((answers) => {

                DB.addEmployee(
                    answers.firstName,
                    answers.lastName,
                    answers.roles,
                    answers.manager,
                )
                    .then(() =>
                        console.log(
                            `added ${answers.roles}, added ${answers.firstName}, add ${answers.lastName}, added ${answers.manager}`
                        ))
                    .then(() => start());
            });
        });

    });
}
/*WHEN I  update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database*/
const updateEmployee = () => {
    DB.findAllEmployees().then(([employee]) => {
        const employeeOptions = employee.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Choose employee',
                choices: employeeOptions,
            },



        ]).then((answers) => {
            let employeeId = answers.employee;
            console.log(answers.employee);
            DB.findAllRoles().then(([role]) => {
                const roleOptions = role.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Pick role',
                        choices: roleOptions,
                    },
                ])
                    .then((answers) => {
                        let role = answers.role;
                        console.log(answers.role);
                        console.log('employeeId', employeeId)
                        DB.updateRole(role, employeeId)
                            .then(() => console.log('Employee role updated'))
                            .then(() => start());

                    })
            })
        })

    })
}



function quit() {
    console.log("Goodbye!");
    process.exit();
};

module.exports = router;