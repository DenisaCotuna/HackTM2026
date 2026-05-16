using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public  class DBHelper
    {
        // Change this connection string to match your SQL Server
        public static  string ConnectionString = "";

        /// <summary>
        /// Executes a stored procedure and returns a DataTable (for SELECT queries)
        /// </summary>
        public static DataTable ExecuteQuery(string spName, SqlParameter[] parameters = null)
        {

            Console.WriteLine("THE NAME OF THE SP :"+spName);
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
