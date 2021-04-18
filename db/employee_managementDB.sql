DROP DATABASE IF EXISTS Employee_ManagementDB;

CREATE DATABASE Employee_ManagementDB; 

USE Employee_ManagementDB;

CREATE TABLE department(
id INT auto_increment KEY NOT NULL,
name VARCHAR(30)
);

CREATE TABLE role(
id INT auto_increment PRIMARY KEY NOT NULL,
title VARCHAR(30),
salary DECIMAL(10),
department_id INT
);

CREATE TABLE employee(
id INT auto_increment PRIMARY KEY NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT
);
