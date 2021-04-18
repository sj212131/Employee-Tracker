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
console.log(figlet.textSync('Employee Management', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

//calling
startApp()

function startApp() {
    const mainMenu = new InquirerFunctions(list, 'menuChoice', questions.mainMenu, UserChoices);
    inquirer
        .prompt([mainMenu.ask()])
        .then(res =>{
            const query1 = "SELECT role.title FROM role"
            const positionArray = new SQLquery(query1);

            const depNameQuery = "SELECT department.name FROM department";
            const depNameArray = new SQLquery(depNameQuery);

            //Switch statement
            switch (operation.menuChoice) {
                case "View all employees": // --0
                    viewAllEmp();
                    break;
            
                case "View all departments": // --1
                    viewAllDep();
                    break;

                case "View all roles": // --2
                    viewAllRoles();
                    break;

                case "view all employees by department": // --3
                    depNameArray.queryReturnResult(viewAllEmpDep);
                    break;
                
                case "view all employees by manager": // --4
                    const viewAllManager = "VIEW BY MANAGER"
                    // return viewAllEmpManager
                    dummyArr = [];
                    EmpInfoPrompts(dummyArr, viewAllManager);
                    break;

                case "View all employees by role": // --5
                    // duplicate function getQueryNoRepeats() for same role title 
                    positionArray.getQueryNoRepeats(viewAllEmpRole)
                    break;

                case "View all managers":// --6
                    viewAllManager();
                    break

                case "Add a department": // --7
                    depNameArray.queryReturnResult(addDep);
                    break;

                case "Remove a department": // --8
                    depNameArray.queryReturnResult(removeDep);
                    break;

                case "Add a role": // --9
                    addRole();
                    break;

                case "Remove a role": // --10
                    const DeleteRole = "Delete ROLE";
                    positionArray.getQueryNoRepeats(deleteRole, DeleteRole);
                    break;

                case "Add employee": // --11
                    const addEmployee = "Add Employee"
                    positionArray.getQueryNoRepeats(EmpInfoPrompts, addEmployee);
                    break;

                case "Remove employee": // --12
                    const deleteEmployee = "Delete Employee"
                    positionArray.getQueryNoRepeats(EmpInfoPrompts, deleteEmployee);
                    break;

                case  "Update employee role": // --13
                    const updateRole = "Update Employee Role"
                    positionArray.getQueryNoRepeats(EmpInfoPrompts, updateRole);

                case "Update employee manager": // --14
                    const updateManager = "UPDATE EMP MANAGER";
                    positionArray.getQueryNoRepeats(EmpInfoPrompts, updateManager);
                    break;

            }
        })
}