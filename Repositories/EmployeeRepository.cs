
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace EmployeeManagementSystem.Repositories
{
    public class EmployeeRepository: IEmployeeRepository
    {
        private readonly MySqlDbHelper _dbhelper;
        public EmployeeRepository(MySqlDbHelper dbhelper)
        {
            _dbhelper = dbhelper;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CRUD",
            new MySqlParameter("@p_mode", "SELECT"),
            new MySqlParameter("@p_empId", 0),
            new MySqlParameter("@p_empName", DBNull.Value),
            new MySqlParameter("@p_email", DBNull.Value),
            new MySqlParameter("@p_department", DBNull.Value),
            new MySqlParameter("@p_salary", 0m)
            );


            return ConvertToList(dt);
        }
        public async Task<Employee?> GetByIdAsync(int id)
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CRUD",
            new MySqlParameter("@p_mode", "SELECT"),
            new MySqlParameter("@p_empId", id),
            new MySqlParameter("@p_empName", DBNull.Value),
            new MySqlParameter("@p_email", DBNull.Value),
            new MySqlParameter("@p_department", DBNull.Value),
            new MySqlParameter("@p_salary", 0m)
            );


            if (dt.Rows.Count == 0) return null;


            var row = dt.Rows[0];
            return new Employee
            {
                empId = Convert.ToInt32(row["empId"]),
                empName = Convert.ToString(row["empName"]) ?? string.Empty,
                email = Convert.ToString(row["email"]) ?? string.Empty,
                department = Convert.ToString(row["department"]) ?? string.Empty,
                salary = row["salary"] == DBNull.Value ? 0 : Convert.ToDecimal(row["salary"])
            };
        }
        public async Task<int> InsertAsync(Employee employee)
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CRUD",
            new MySqlParameter("@p_mode", "INSERT"),
            new MySqlParameter("@p_empId", 0),
            new MySqlParameter("@p_empName", employee.empName ?? (object)DBNull.Value),
            new MySqlParameter("@p_email", employee.email ?? (object)DBNull.Value),
            new MySqlParameter("@p_department", employee.department ?? (object)DBNull.Value),
            new MySqlParameter("@p_salary", employee.salary)
            );


            if (dt.Rows.Count > 0 && dt.Columns.Contains("newEmployeeId"))
            {
                return Convert.ToInt32(dt.Rows[0]["newEmployeeId"]);
            }


            return 0;
        }
        public async Task<bool> UpdateAsync(Employee employee)
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CRUD",
            new MySqlParameter("@p_mode", "UPADTE"),
            new MySqlParameter("@p_empId", employee.empId),
            new MySqlParameter("@p_empName", employee.empName ?? (object)DBNull.Value),
            new MySqlParameter("@p_email", employee.email ?? (object)DBNull.Value),
            new MySqlParameter("@p_department", employee.department ?? (object)DBNull.Value),
            new MySqlParameter("@p_salary", employee.salary)
            );


            
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CRUD",
            new MySqlParameter("@p_mode", "DELETE"),
            new MySqlParameter("@p_empId", id),
            new MySqlParameter("@p_empName", DBNull.Value),
            new MySqlParameter("@p_email", DBNull.Value),
            new MySqlParameter("@p_department", DBNull.Value),
            new MySqlParameter("@p_salary", 0m)
            );


            return true;
        }
        private List<Employee> ConvertToList(DataTable dt)
        {
            var list = new List<Employee>();
            foreach (DataRow row in dt.Rows)
            {
                list.Add(new Employee
                {
                    empId = Convert.ToInt32(row["empId"]),
                    empName = Convert.ToString(row["empName"]) ?? string.Empty,
                    email = Convert.ToString(row["email"]) ?? string.Empty,
                    department = Convert.ToString(row["department"]) ?? string.Empty,
                    salary = row["salary"] == DBNull.Value ? 0 : Convert.ToDecimal(row["salary"])
                });
            }
            return list;
        }

        public async Task<bool> EmailExistsAsync(string email, int? id = null)
        {
            var dt = await _dbhelper.ExecuteDataTableAsync("sp_Employee_CheckEmail",
                new MySqlParameter("@p_email", email),
                 new MySqlParameter("@p_empId", id));
               

            return dt.Rows.Count > 0;
        }

    }
}
