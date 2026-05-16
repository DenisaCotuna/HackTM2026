using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for reference / lookup tables that need no writes from the app layer.
    /// Covers: usp_GetCountries | usp_GetGenders | usp_GetStudyYears
    /// </summary>
    public static class clsLookupDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_GetCountries
        //   Result set : CountryID, CountryName  (ordered by CountryName)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetCountries()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetCountries", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                try
                {
                    connection.Open();
                    dt.Load(command.ExecuteReader());
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetGenders
        //   Result set : GenderID, Gender  (ordered by GenderID)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetGenders()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetGenders", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                try
                {
                    connection.Open();
                    dt.Load(command.ExecuteReader());
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetStudyYears
        //   Result set : YearID, YearOfStudy  (ordered by YearID)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetStudyYears()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetStudyYears", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                try
                {
                    connection.Open();
                    dt.Load(command.ExecuteReader());
                }
                catch { }
            }

            return dt;
        }
    }
}
