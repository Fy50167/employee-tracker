DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary INT NOT NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    manager VARCHAR(30)
    FOREIGN KEY (manager)
    REFERENCES employees(id)
    ON DELETE SET NULL,
    FOREIGN KEY (title)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (department)
    REFERENCES departments(id)
    ON DELETE SET NULL,
);
