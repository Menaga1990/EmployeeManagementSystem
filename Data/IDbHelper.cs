using System.Data;

namespace EmployeeManagementSystem.Data
{
    public interface IDbHelper
    {
        DataTable ExecuteDataTable(string spName, params MySql.Data.MySqlClient.MySqlParameter[] parameters);
        object ExecuteScalar(string spName, params MySql.Data.MySqlClient.MySqlParameter[] parameters);
        int ExecuteNonQuery(string spName, params MySql.Data.MySqlClient.MySqlParameter[] parameters);

     
    }
}
