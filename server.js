const inquirer = require('inquirer');
const connect = require('./db/connect');
const consoleTable = require('console.table');
const DB = require('./db/index')
const connection = require('./db/connect');



connect.connect((err) => {
    if (err) throw err;
    start();
});

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
    connection.query(sql, (err, rows)=> {
        if (err) throw err;
        console.table(rows);
        start();
    });
};
    

/*WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role*/
const viewAllRoles = () => {
    const sql = `SELECT * FROM roles`;
    

    connect.query (sql, (err, res) => {
        if (res)  {
            const table = console.table(res);
            console.log(table);
            start();
        }else{
            console.log('Something went wrong', err);
        }
    });
};
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
    
    
    connect.query (sql, (err, res) => {
        if (res)  {
            const table = console.table(res);
            console.log(table);
            start();
        }else{
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
        const departmentOptions = department.map(({ id, name}) => ({
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
        console.log(`added ${answers.addRole}, added ${answers,department}, added ${answers.addSalary}`
        )
        )
        .then(() => start());
    }
    )})

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
        DB.findAllEmployees().then(([manager]) =>{
            const managerOptions = manager.map(
               ({ id, first_name, last_name}) => ({
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
/*WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database*/
const updateEmployee = () => {
    DB.findAllEmployees().then(([employee]) => {
        const employeeOptions = employee.map(({ id, first_name, last_name}) => ({
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
            let employeeId =answers.employee;
            console.log(answers.employee);
            DB.findAllRoles().then(([role]) => {
                const roleOptions = role.map(({ id, title}) => ({
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
                    console.log (answers.role);
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