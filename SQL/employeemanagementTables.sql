

use employeedb;

 create table Employee(
 empId int auto_increment primary key,
 empName varchar(100) not null,
 email varchar(100) not null unique,
 department varchar(50) not null,
 salary decimal(10,2) not null check(salary>=0)
);

select *  from  Employee;

INSERT INTO Employee (empName, email, department, salary) VALUES
('Menaga Kumaresan', 'menaga.kumerasan@gmail.com', 'HR', 45000.00),
('Vanshika Lingaraj', 'vanshika.lingaraj@gmail.com', 'IT', 60000.00),
('Harish Kumaresan', 'harish.kumerasan@gmail.com', 'Finance', 55000.00),
('Mokith Harish', 'mokith.harish@gmail.com', 'Marketing', 48000.00),
('Hemanika Harish', 'hemanika.harish@gmail.com', 'Operations', 52000.00),
('Menaga Lingaraj', 'menaga.lingaraj@gmail.com', 'IT', 62000.00),
('Sona Harish', 'sona.harish@gmail.com', 'Finance', 57000.00),
('Lingaraj Mathan', 'lingaraj.mathan@gmail.com', 'HR', 46000.00),
('Malliga Kumaresan', 'malliga.kumerasan@gmail.com', 'Marketing', 49000.00),
('Sundari Mathan', 'sundari.mathan@gmail.com', 'Operations', 53000.00);