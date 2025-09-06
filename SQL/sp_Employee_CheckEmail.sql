DELIMITER $$

CREATE PROCEDURE sp_Employee_CheckEmail (
    IN p_email VARCHAR(100),
    IN p_empId INT
)
BEGIN
    SELECT empId
    FROM Employee
    WHERE email = p_email
      AND (p_empId = 0 OR empId <> p_empId);
END$$

DELIMITER ;
