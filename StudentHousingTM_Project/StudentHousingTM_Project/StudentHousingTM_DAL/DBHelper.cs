using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class DBHelper
    {
        // Change this connection string to match your SQL Server
        private static readonly string ConnectionString =
            "Server=.;Database=StudentHousingTM;Integrated Security=True;";

        /// <summary>
        /// Executes a stored procedure and returns a DataTable (for SELECT queries)
        /// </summary>
        public static DataTable ExecuteQuery(string spName, SqlParameter[] parameters = null)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            using (SqlCommand cmd = new SqlCommand(spName, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);
            }
            return dt;
        }

        /// <summary>
        /// Executes a stored procedure and returns rows affected or output value (for INSERT/UPDATE/DELETE)
        /// </summary>
        public static int ExecuteNonQuery(string spName, SqlParameter[] parameters = null)
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            using (SqlCommand cmd = new SqlCommand(spName, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        /// <summary>
        /// Executes a stored procedure and returns a single scalar value (e.g. new ID after INSERT)
        /// </summary>
        public static object ExecuteScalar(string spName, SqlParameter[] parameters = null)
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            using (SqlCommand cmd = new SqlCommand(spName, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                conn.Open();
                return cmd.ExecuteScalar();
            }
        }
    }
}
