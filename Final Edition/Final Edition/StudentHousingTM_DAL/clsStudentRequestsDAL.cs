using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for StudentRequests and the matching engine.
    /// Covers: usp_CreateStudentRequest | usp_GenerateMatches
    /// </summary>
    public static class clsStudentRequestsDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_CreateStudentRequest
        //   Behaviour  : Validates inputs, inserts StudentRequest + preferred
        //                areas (comma-separated string) inside a transaction.
        //   OUTPUT     : @NewRequestID INT
        //   Result set : Full request row + aggregated PreferredAreas string
        //   RETURN     : 0 on success; THROW on any error
        //
        //   C# return  : DataTable (request details row) + ref newRequestID
        //
        //   Notes      : Pass preferredAreas as a comma-separated string,
        //                e.g. "Centru,Fabric,Lipova". Pass null / "" if none.
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable CreateStudentRequest(
            int      studentProfileID,
            string   title,
            decimal  budgetMin,
            decimal  budgetMax,
            DateTime moveInDate,
            DateTime? moveOutDate,              // NULL = open-ended
            int      propertyTypePreferredID,   // 1 Apartment | 2 Room | 3 Studio | 4 No preference
            bool?    furnishedRequired,         // NULL = no preference
            bool     utilitiesRequired,
            bool     petsAllowed,
            bool     smokersAllowed,
            string?  additionalNotes,
            string?  preferredAreas,            // comma-separated, e.g. "Centru,Fabric"
            ref int  newRequestID)
        {
            DataTable dt = new DataTable();
            newRequestID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_CreateStudentRequest", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@StudentProfileID",        SqlDbType.Int).Value = studentProfileID;
                command.Parameters.Add("@Title",                   SqlDbType.NVarChar, 300).Value = title;

                SqlParameter budgetMinParam = command.Parameters.Add("@BudgetMin", SqlDbType.Decimal);
                budgetMinParam.Precision = 10; budgetMinParam.Scale = 2;
                budgetMinParam.Value = budgetMin;

                SqlParameter budgetMaxParam = command.Parameters.Add("@BudgetMax", SqlDbType.Decimal);
                budgetMaxParam.Precision = 10; budgetMaxParam.Scale = 2;
                budgetMaxParam.Value = budgetMax;

                command.Parameters.Add("@MoveInDate",              SqlDbType.Date).Value = moveInDate;
                command.Parameters.Add("@MoveOutDate",             SqlDbType.Date).Value = (object?)moveOutDate ?? DBNull.Value;
                command.Parameters.Add("@PropertyTypePreferredID", SqlDbType.Int).Value = propertyTypePreferredID;

                // BIT = NULL is allowed in the SP for "no preference"
                command.Parameters.Add("@FurnishedRequired",  SqlDbType.Bit).Value = furnishedRequired.HasValue
                    ? (object)furnishedRequired.Value
                    : DBNull.Value;

                command.Parameters.Add("@UtilitiesRequired",  SqlDbType.Bit).Value = utilitiesRequired;
                command.Parameters.Add("@PetsAllowed",        SqlDbType.Bit).Value = petsAllowed;
                command.Parameters.Add("@SmokersAllowed",     SqlDbType.Bit).Value = smokersAllowed;
                command.Parameters.Add("@AdditionalNotes",    SqlDbType.NVarChar, -1).Value = (object?)additionalNotes ?? DBNull.Value;
                command.Parameters.Add("@PreferredAreas",     SqlDbType.NVarChar, -1).Value = (object?)preferredAreas  ?? DBNull.Value;

                // ── OUTPUT param ──────────────────────────────────────
                SqlParameter outRequestID = new SqlParameter("@NewRequestID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outRequestID);

                try
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        dt.Load(reader);
                    }
                    newRequestID = (int)command.Parameters["@NewRequestID"].Value;
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GenerateMatches
        //   Behaviour  : Runs the scoring engine against all active properties,
        //                inserts new Matches rows (skips already-matched pairs),
        //                and returns the new matches sorted by score descending.
        //   Result set : Matches + Property + Owner details, ordered by MatchScore DESC
        //   RETURN     : 0 (always; THROW on invalid request ID)
        //
        //   C# return  : DataTable (all newly created match rows)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GenerateMatches(int studentRequestID)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GenerateMatches", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@StudentRequestID", SqlDbType.Int).Value = studentRequestID;

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
