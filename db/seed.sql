USE Employee_ManagementDB;
INSERT INTO department (name)
 VALUES 
		("Sales"), -- ID: 1
		("Engineering"), -- ID: 2
		("Accounting"),-- ID: 3
		("Legal");-- ID: 4
-- SELECT * FROM department;

INSERT INTO role (title, salary, department_ID) 
VALUES 
    ("Lead Sales", 100000, 1),
    ("Salesperson", 80000, 1),
    ("lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000 , 4),
    ("Lawyer", 190000, 4),
    ("Lead Engineer", 150000, 2);
-- SELECT * FROM role;

USE Employee_ManagementDB;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ("John", "Doe", 1, 3 ),
		("Mike", "Chan", 2, 1),
		("Ashley", "Rodriguez", 3, NULL),
		("Kevin", "Tupik", 4, 3),
		("Malia", "Brown", 5, NULL),
		("Sarah", "Lourd", 6, NULL),
		("Tom", "Allen", 7, 6),
		("Christian", "Echenrode",8, 2);
-- SELECT * FROM employee;
