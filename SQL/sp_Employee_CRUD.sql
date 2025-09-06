


Delimiter $$

create procedure sp_Employee_CRUD (
IN p_mode varchar(10),
IN p_empId int,
IN p_empName varchar(100),
IN p_email varchar(100),
IN p_department varchar(50),
IN p_salary decimal(10,2)
)
BEGIN
IF p_mode ='INSERT' THEN
 INSERT INTO Employee(empName,email,department,salary)
 VALUES (p_empName,p_email,p_department,p_salary);
 select last_insert_id() as 
 newEmployeeId;
 END IF;
 IF p_mode = 'UPADTE' THEN
 UPDATE Employee
 SET empName=p_empName,
 email=p_email,
 department=p_department,
 salary=p_salary
 where empId=p_empId;
 Select 'Employee updated successfully' as Message;
 END IF;
 IF p_mode='DELETE' THEN
 DELETE from Employee where empId=p_empID;
 Select 'Emploryee deleted successfully ' as Message;
 END IF;
 IF p_mode ='SELECT' THEN
 IF p_empId is not null and p_empId>0 THEN
 SELECT empId,empName,email,department,salary from Employee where empId=p_empId;
 else
 SELECT empId,empName,email,department,salary from Employee;
 END IF;
 END IF;
 END $$
 DELIMITER ;
 
 call sp_Employee_CRUD('SELECT',2,NULL,NULL,NULL,NULL)
 
 
 
