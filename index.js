const inquirer = require('inquirer');
const figlet = require('figlet');

const connection = require("./lib/connection");
const UserChoices = require('./lib/commandeMenu');
const questions = require('./lib/questions');

//calling class
const InquirerFunctions = require('./lib/inquirer');
const SQLquery = require('./lib/Sql_query');
const { viewAllEmpByDep } = require('./lib/questions');

//Text title - worked
console.log(figlet.textSync('Employee Management System', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

//calling
mainMenu()

function mainMenu() {
    const mainMenu = new InquirerFunctions('list', 'menuChoice', questions.mainMenu, UserChoices);
    inquirer
        .prompt([mainMenu.ask()])
        .then(res =>{
            const query1 = "SELECT role.title FROM role"
            const positionArray = new SQLquery(query1);

            const depNameQuery = "SELECT department.name FROM department";
            const depNameArray = new SQLquery(depNameQuery);

            //Switch statement
            switch (res.menuChoice) {
                case "View all employees": // --0 function done
                    viewAllEmp();
                    break;
            
                case "View all departments": // --1 function done
                    viewAllDep();
                    break;

                case "View all roles": // --2 function done
                    viewAllRoles();
                    break;

                case "view all employees by department": // --3 function done
                    depNameArray.queryReturnResult(viewAllEmpDep);
                    break;
                
                case "view all employees by manager": // --4 function done
                    const viewEmpByManager = "VIEW BY MANAGER"
                    // return viewAllEmpManager
                    dummyArr = [];
                    EmpInfoPrompts(dummyArr, viewEmpByManager);
                    break;

                case "View all employees by role": // --5
                    // duplicate function NoRepeats() for same role title 
                    positionArray.NoRepeats(viewAllEmpRole)
                    break;

                case "View all managers":// --6 function done
                    viewAllManager();
                    break

                case "Add a department": // --7
                    depNameArray.queryReturnResult(addDep);
                    break;

                case "Remove a department": // --8
                    depNameArray.queryReturnResult(removeDep);
                    break;

                case "Add a role": // --9 function done
                    addRole();
                    break;

                case "Remove a role": // --10
                    const DeleteRole = "Delete ROLE";
                    positionArray.NoRepeats(deleteRole, DeleteRole);
                    break;

                case "Add employee": // --11
                    const addEmployee = "ADD"
                    positionArray.NoRepeats(EmpInfoPrompts, addEmployee);
                    break;

                case "Remove employee": // --12
                    const deleteEmployee = "Delete Employee"
                    positionArray.NoRepeats(EmpInfoPrompts, deleteEmployee);
                    break;

                case  "Update employee role": // --13
                    const updateRole = "Update Employee Role"
                    positionArray.NoRepeats(EmpInfoPrompts, updateRole);
                    break;

                case "Update employee manager": // --14
                    const updateManager = "Update Employee Manager";
                    positionArray.NoRepeats(EmpInfoPrompts, updateManager);
                    break;

            }
        })
}

function viewAllEmp(){
    // tested and worked on workbench
    const query = 
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
            FROM employee
            INNER JOIN role on role.id = employee.role_id
            INNER JOIN department on department.id = role.department_id;`

    const empTable = new SQLquery(query);
    empTable.generalTableQuery(mainMenu);
};

function viewAllDep(){
    // tested and worked on workbench
    const query = 
            `SELECT department.name
            FROM department`

    const depTable = new SQLquery(query);
    depTable.generalTableQuery(mainMenu);
};

function viewAllRoles(){
    // tested and worked on workbench
    const query = 
            `SELECT role.title, role.salary, department.name 
            FROM role 
            INNER JOIN department ON department.id = role.department_id`

    const roleTable = new SQLquery(query);
    roleTable.generalTableQuery(mainMenu);
};

function viewAllManager(){
    // tested and worked on workbench
   const query = 
               `SELECT employee.id, employee.first_name, employee.last_name, department.name
                   FROM employee
                   INNER JOIN role on role.id = employee.role_id
                   INNER JOIN department on department.id = role.department_id
                   WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`;

   const managerTable = new SQLquery(query);
   managerTable.generalTableQuery(mainMenu);
};

function viewAllEmpDep(depNamesArray){
    
    const departmentNamePrompt = new InquirerFunctions('list', 'department_Name', questions.viewAllEmpByDep, depNamesArray);

    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {
        // tested and worked on workbench
        const query = 
                `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department on department.id = role.department_id AND department.name = ? ;`

        const empByDepTable = new SQLquery(query, userResp.department_Name);
        empByDepTable.generalTableQuery(mainMenu);
    })
}

function EmpInfoPrompts(compRoles, actionChoice){

    const query = 
            "SELECT id, first_name, last_name FROM employee WHERE employee.id IN ( SELECT employee.manager_id FROM employee )";

    connection.query(query, function (err, res) {
        if (err) throw err
        
        let managerNamesArr = [];
        let managerObjArr = [];

        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            let managersobj = {
                ID: res[i].id,
                firstName: res[i].first_name,
                lastName: res[i].last_name
            }

            managerObjArr.push(managersobj);
            managerNamesArr.push(name);
        }

        const first_name = new InquirerFunctions('input', 'first_name', questions.addEmployee1);

        const last_name = new InquirerFunctions('input', 'last_name', questions.addEmployee2);

        const emp_role = new InquirerFunctions('list', 'employee_role', questions.addEmployee3, compRoles);
        
        const emp_manager = new InquirerFunctions('list', 'employee_manager', questions.addEmployee4, managerNamesArr);

        if (actionChoice === "ADD") { 
            Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {
                    addEmp(emp_info, managerObjArr);
                })
            })
        } else if (actionChoice === "VIEW BY MANAGER") {
            viewAllEmpManager(managerObjArr, managerNamesArr);
        } else {
            Promise.all([first_name.ask(), last_name.ask()]).then(prompts => {
                    inquirer.prompt(prompts).then(emp_info => {
                        if (actionChoice === "Update Employee Role") {
                            EmpMultiplesCheck(emp_info, actionChoice, compRoles);
                        } else if (actionChoice === "Update Employee Manager") {
                            EmpMultiplesCheck(emp_info, actionChoice, managerObjArr, managerNamesArr);
                        } else {
                            EmpMultiplesCheck(emp_info, actionChoice);
                        }
                    })
                })
        }
    })
};

function addEmp(emp_info, managerObjArr){
    // tested and worked on workbench
    const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = (?) ;"

    connection.query(queryRoleIdFromTitle, emp_info.employee_role, function (err, res) {
        if (err) throw err;

        const empRoleId = res[0].id;
        const empFirstName = emp_info.first_name;
        const empLastName = emp_info.last_name;
        const empManagerName = emp_info.employee_manager.split(" ");
        const empManagerFirstName = empManagerName[0];
        const empManagerLastName = empManagerName[1];

        let empManagerID = 0;

        //This for loop is done to get the manager Id of the employee being added so that it can be added to the database
        for (let manager of managerObjArr) {
            if (manager.firstName == empManagerFirstName && manager.lastName === empManagerLastName) {
                empManagerID = manager.ID;
            }
        }

        const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"
        connection.query(queryInsertEmpInfo, [empFirstName, empLastName, empRoleId, empManagerID], function (err, res) {
            if (err) throw err;
            console.log("Employee Added");
            mainMenu();
        })
    })
}

function viewAllEmpManager(managerObj, namesArr){
    const chosenManager = new InquirerFunctions('list', 'manager_choice', questions.searchByManager, namesArr);

    inquirer.prompt([chosenManager.ask()]).then(userChoice => {

        console.log(`Manager Searched By: ${userChoice.manager_choice}`);

        let chosenManagerID = 0;
        const chosenManagerName = userChoice.manager_choice.split(" ", 2)

        //This for loop then compares the last name with the last names of managers in managerObj delivered as parameters
        //because the id for each manager is also in this obj.  When a match is found the id of that match is set to chosenManagerID.
        for (manager of managerObj) {
            if (chosenManagerName[1] == manager.lastName) {
                chosenManagerID = manager.ID;
            }
        }

        // tested and worked on workbench
        const queryManagerSearch = 
                `SELECT employee.last_name, employee.first_name, role.title, department.name
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department on department.id = role.department_id
                    WHERE employee.manager_id = (?) `

        const managerSearch = new SQLquery(queryManagerSearch, chosenManagerID);
        managerSearch.generalTableQuery(mainMenu);
    })
}

function EmpMultiplesCheck(emp_info, actionChoice, arrayNeededForNextStep){
    const empFirstName = emp_info.first_name;
    const empLastName = emp_info.last_name;
    const queryMultipleEmpCheck = 
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
                employee.manager_id, department.name
                FROM employee 
                INNER JOIN role on role.id = employee.role_id
                INNER JOIN department on department.id = role.department_id
                WHERE employee.first_name = (?) AND employee.last_name = (?);`

    connection.query(queryMultipleEmpCheck, [empFirstName, empLastName], function (err, res) {


        if (res.length > 1) {
            console.log("Multiple Employees Found!")
            let multipleName = [];
            for (employee of res) {
                let empStr = `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.title} ${employee.name}`
                multipleName.push(empStr);
            }
            const which_employee_to_Delete = new InquirerFunctions('list', 'employee_delete', questions.deleteEmployee1, multipleName);

            inquirer.prompt([which_employee_to_Delete.ask()]).then(userChoice => {
                const chosenEmpInfo = userChoice.employee_delete.split(" ");
                const chosenEmpFirstName = chosenEmpInfo[1];
                const chosenEmpLastName = chosenEmpInfo[2];
                const chosenEmpID = chosenEmpInfo[0];
                const chosenEmpRole = chosenEmpInfo[3];

                if (actionChoice === "Delete Employee") {
                    deleteEmp(chosenEmpFirstName, chosenEmpLastName, chosenEmpID);
                } else if (actionChoice === "Update Employee Role") {
                    updateEmpRole(chosenEmpID, arrayNeededForNextStep);
                } else if (actionChoice === "Update Employee Manager") {
                    updateEmpManager(chosenEmpID, arrayNeededForNextStep);
                }
            })

        } else if (res[0].id === "undefined" || 0 ) {
            console.log("Could not find employee. Rerouted to Main Menu")
            mainMenu();

        } else {
            console.log("One Employee Found!")

            if (actionChoice === "Delete Employee") {
                deleteEmp(empFirstName, empLastName, res[0].id)
            } else if (actionChoice === "Update Employee Role") {
                updateEmpRole(res[0].id, arrayNeededForNextStep);
            } else if (actionChoice === "Update Employee Manager") {
                updateEmpManager(res[0].id, arrayNeededForNextStep);
            }
        }
    })
}

function viewAllEmpRole(compRoles, actionChoice){
    const rolePrompt = new InquirerFunctions('list', 'role_Title', questions.viewAllEmpByRole, compRoles);
    inquirer.prompt(rolePrompt.ask()).then(userResp => {

         // tested and worked on workbench
        const query = 
                `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                    FROM employee 
                    INNER JOIN role on role.id = employee.role_id AND role.title = (?)
                    INNER JOIN department on department.id = role.department_id;`;


        const empByRoleTable = new SQLquery(query, userResp.role_Title);
        empByRoleTable.generalTableQuery(mainMenu);
    })
}

function addRole(){
    const queryDeps = "SELECT department.name FROM department;"

    connection.query(queryDeps, function (err, res) {
        if (err) throw err;
        let depNameArr = [];

        for (let i = 0; i < res.length; i++) {
            depNameArr.push(res[i].name)
        }
        const whatRole = new InquirerFunctions('input', 'role_to_add', questions.newRole)
        const whatSalary = new InquirerFunctions('input', 'role_salary', questions.salary)
        const whatdepartment = new InquirerFunctions('list', 'department', questions.department, depNameArr)


        Promise.all([whatRole.ask(), whatSalary.ask(), whatdepartment.ask()]).then(prompts => {
            inquirer.prompt(prompts).then(userChoices => {

                const getDepId = 
                        `SELECT department.id FROM department WHERE department.name = (?);`
                connection.query(getDepId, userChoices.department, function (err, res) {
                    if (err) throw err;

                    const addRolequery = 
                        `INSERT INTO role (role.title, role.salary, role.department_id) VALUES ( (?), (?), (?));`
                    const addRole = new SQLquery(addRolequery, [userChoices.role_to_add, userChoices.role_salary, res[0].id]);

                    addRole.update(mainMenu, "Role added!");
                })
            })
        })
    })
}

function deleteEmp(firstName, lastName, employeeID) {

    const queryDelete = "DELETE FROM employee WHERE employee.id = (?);"
    const confirmDelete = new InquirerFunctions('list', 'confirm_choice', questions.deleteEmployee2 + firstName + " " + lastName + "?", ["yes", "no"]);
    const deleteQuery = new SQLquery(queryDelete, employeeID);

    //I created a confirm method in inquirer.js but was having trouble keeping scope and keeping functions from waiting so I did a list inquirer instead.
    inquirer.prompt([confirmDelete.ask()]).then(respObj => {
        if (respObj.confirm_choice === "yes") {
            deleteQuery.delete(mainMenu);
        } else {
            mainMenu();
        }
    })
}

function updateEmpRole(employeeID, RolesArray) {

    const empNewRole = new InquirerFunctions('list', 'employee_role', questions.updateRole, RolesArray);
    const queryGetRoleId = 
                `SELECT role.id
                    FROM role
                    Where role.title = (?);`
    inquirer.prompt([empNewRole.ask()]).then(chosenRole => {
                connection.query(queryGetRoleId, chosenRole.employee_role, function (err, res) {
                if (err) throw err;

                const queryUpdateRoleId = 
                            `UPDATE employee
                                SET employee.role_id = (?)
                                WHERE employee.id = (?)`

            const updateEmpRoleId = new SQLquery(queryUpdateRoleId, [res[0].id, employeeID])
            updateEmpRoleId.update(mainMenu, "Employee Role Updated!");
        })
    })
}

function updateEmpManager(employeeID, managerObjectArray) {
    console.log("Entered update employee manager.")

    const queryCurrentManager = 
                        `SELECT employee.manager_id
                            FROM employee
                            WHERE employee.id = (?);`

    connection.query(queryCurrentManager, employeeID, function (err, res) {
        if (err) throw err;

        const currentManagerID = res[0].manager_id;
        const managerChoices = managerObjectArray.filter(manager => {
            if (manager.ID != currentManagerID) {
                return true;
            };
        })

        possibleNewManagerNames = [];
        for (manager of managerChoices) {
            managerName = "ID: " + manager.ID + " " + manager.firstName + " " + manager.lastName;
            possibleNewManagerNames.push(managerName);
        }

        const newManagerChoice = new InquirerFunctions('list', 'new_Manager', questions.newManager, possibleNewManagerNames)

        inquirer.prompt([newManagerChoice]).then(userChoice => {
                const userInputSplitAtId = userChoice.new_Manager.split(" ", 2);
                const newManagerID = userInputSplitAtId[1];

                const queryUpdateNewManager = 
                                    `UPDATE employee
                                        SET employee.manager_id = (?)
                                        WHERE employee.id = (?)`

                connection.query(queryUpdateNewManager, [newManagerID, employeeID], function (err, res) {
                    if (err) throw err;
                    console.log("Manager Updated!");
                    mainMenu();
                })
            })
    })
}

function deleteRole(compRolesArr) {

    const whatRole = new InquirerFunctions('list', 'role_to_delete', questions.deleteRole, compRolesArr);
    inquirer.prompt([whatRole.ask()]).then(userChoice => {

        const role_id_Query = `SELECT role.id FROM role WHERE role.title = (?);`
        connection.query(role_id_Query, userChoice.role_to_delete, function (err, res) {

            const roleDeleteID = res[0].id;
            const roleDeleteTitle = userChoice.role_to_delete;

            if (res.length > 1) {
                console.log("Role found in multiple departments!");
                // tested and worked on workbench
                const departmentsWithRolequery = 
                                `SELECT department.name, role.department_id
                                    FROM department
                                    INNER JOIN role on role.department_id = department.id AND role.title = (?);`

                connection.query(departmentsWithRolequery, userChoice.role_to_delete, function (err, res) {
                    if (err) throw err
                    const departmentsWithRoleArr = [];
                    for (let department of res) {
                        departmentsWithRoleArr.push(department);
                    }

                    const whichDeparment = new InquirerFunctions('list', 'department_to_delete_Role_From', questions.departmentDeleteRole, departmentsWithRoleArr);

                    inquirer.prompt([whichDeparment.ask()]).then(userChoice => {
                        console.log(res);
                        const departmentName_ID_Arr = res.filter(department => {
                            if (department.name == userChoice.department_to_delete_Role_From) {
                                return true;
                            }
                        })

                        deleteRoleQuery2 = "DELETE FROM role WHERE role.title = (?) AND role.department_id = (?)"
                        const deleteInstance2 = new SQLquery(deleteRoleQuery2, [roleDeleteTitle, departmentName_ID_Arr[0].department_id])
                        deleteInstance2.delete(mainMenu);
                    })
                })

            } else {
                const deleteRoleQuery = "DELETE FROM role WHERE role.id = (?);"
                const deleteInstance = new SQLquery(deleteRoleQuery, roleDeleteID);
                deleteInstance.delete(mainMenu);
            }
        })
    })
}

function addDep(depNameArr) {

    const whatDep = new InquirerFunctions('input', 'dep_to_add', questions.newDep)

    inquirer.prompt([whatDep.ask()]).then(userChoice => {

        const alreadyExist = depNameArr.filter(department => {

            if (department.name == userChoice.dep_to_add) return true;
        })

        if (alreadyExist.length >= 1) {
            console.log("Department Already exists!")
            mainMenu();
        } else {
            const addDepQuery = `INSERT INTO department (department.name) VALUES (?);`
            const addDep = new SQLquery(addDepQuery, userChoice.dep_to_add);

            addDep.update(mainMenu, "Department added!");
        }
    })
}

function removeDep() {

    const whatDepartment = new InquirerFunctions('input', 'dep_to_delete', questions.deleteDep)

    inquirer.prompt([whatDepartment.ask()]).then(userChoice => {

        const deleteDepQuery = `DELETE FROM department WHERE department.name = (?);`
        const deleteDep = new SQLquery(deleteDepQuery, userChoice.dep_to_delete);

        deleteDep.update(mainMenu, "Department deleted!");
    })
}