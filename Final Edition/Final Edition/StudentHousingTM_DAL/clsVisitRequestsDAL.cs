using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for VisitRequests (and VisitProposedDates which is always managed together).
    /// Covers: usp_CreateVisitRequest | usp_GetVisitStatuses
    /// </summary>
    public static class clsVisitRequestsDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_CreateVisitRequest
        //   Behaviour  : Validates the conversation, proposed dates (all future,
        //                all valid YYYY-MM-DD), and blocks if a pending visit
        //                request already exists. Inserts the VisitRequest row
        //                + one VisitProposedDates row per date in a transaction.
        //   OUTPUT     : @NewVisitRequestID INT
        //   Result set : Visit request details + STRING_AGG of proposed dates
        //   RETURN     : 0 on success; THROW on any validation error
        //
        //   C# return  : DataTable (request details row) + ref newVisitRequestID
        //
        //   Parameters :
        //     proposedDates → comma-separated date strings in YYYY-MM-DD format
        //                     e.g. "2026-06-10,2026-06-12,2026-06-15"
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable CreateVisitRequest(
            int     conversationID,
            int     studentUserID,
            string? studentNote,
            string  proposedDates,          // comma-separated YYYY-MM-DD values
            ref int newVisitRequestID)
        {
            DataTable dt = new DataTable();
            newVisitRequestID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_CreateVisitRequest", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@ConversationID", SqlDbType.Int).Value = conversationID;
                command.Parameters.Add("@StudentUserID",  SqlDbType.Int).Value = studentUserID;
                command.Parameters.Add("@StudentNote",    SqlDbType.NVarChar, 500).Value = (object?)studentNote ?? DBNull.Value;
                command.Parameters.Add("@ProposedDates",  SqlDbType.NVarChar, -1).Value = proposedDates;

                // ── OUTPUT param ──────────────────────────────────────
                SqlParameter outVisitRequestID = new SqlParameter("@NewVisitRequestID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outVisitRequestID);

                try
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        dt.Load(reader);
                    }
                    newVisitRequestID = (int)command.Parameters["@NewVisitRequestID"].Value;
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetVisitStatuses
        //   Result set : VisitStatusID, Status (all rows from VisitStatuses)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetVisitStatuses()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetVisitStatuses", connection))
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
