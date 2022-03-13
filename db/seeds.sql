USE employees_db;

INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');


INSERT INTO roles (title, salary, department_id)
VALUES
('Salesperson', 80000, 1),
('Lead Engineer', 160000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 150000, 3),
('Accountant', 100000, 3),
('Legal team Lead', 250000, 4),
('Lawyer', 180000, 4);




INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES
('Brent', 'Hollingsworth', 2, null),
('Sam', 'Smith', 1, 1),
('Riley', 'Beach', 3, 1),
('David', 'Lewis', 4, null);