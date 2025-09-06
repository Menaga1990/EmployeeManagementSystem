using MySql.Data.MySqlClient;
using System.Data;

namespace EmployeeManagementSystem.Data
{
    public class MySqlDbHelper
    {
        private readonly string _connectionString;

        public MySqlDbHelper(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("EmployeeDBConnection");
        }
        public async Task<DataTable> ExecuteDataTableAsync(string spName, params MySqlParameter[] parameters)
        {
            var dt = new DataTable();


            try
            {
                await using var conn = new MySqlConnection(_connectionString);
                await using var cmd = new MySqlCommand(spName, conn) { CommandType = CommandType.StoredProcedure };


                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);


                await conn.OpenAsync();
                await using var reader = await cmd.ExecuteReaderAsync();
                dt.Load(reader);
            }
            catch
            {
                throw; 
            }


            return dt;
        }

    }
}
