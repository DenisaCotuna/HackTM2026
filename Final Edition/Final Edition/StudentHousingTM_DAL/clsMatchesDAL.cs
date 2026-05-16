using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Matches.
    /// Covers: usp_ExpressInterest | usp_RejectMatch | usp_GetMatchStatuses
    /// </summary>
    public static class clsMatchesDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_ExpressInterest
        //   Behaviour  : Flips the StudentInterested or OwnerInterested bit.
        //                If BOTH sides are now interested, the match is marked
        //                "Mutually confirmed" (StatusID = 3) and a Conversation
        //                row is created inside a transaction.
        //   Result set : Updated match state + ConversationID (NULL if not mutual yet)
        //   RETURN     : 0 on success; THROW on validation errors
        //
        //   C# return  : DataTable (updated match row)
        //
        //   Parameters :
        //     role       → "Student" | "Owner"
        //     interested → true  = express interest
        //                  false = withdraw interest
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable ExpressInterest(int matchID, string role, bool interested)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_ExpressInterest", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@MatchID",    SqlDbType.Int).Value = matchID;
                command.Parameters.Add("@Role",       SqlDbType.NVarChar, 10).Value = role;
                command.Parameters.Add("@Interested", SqlDbType.Bit).Value = interested;

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
        // usp_RejectMatch
        //   Behaviour  : Resolves which side (Student | Owner) the rejecting user
        //                belongs to, marks the match as Rejected (StatusID = 4),
        //                and closes any open Conversation tied to the match.
        //                All inside a transaction.
        //   Result set : Updated match state including ConversationID + IsActive
        //   RETURN     : 0 on success; THROW on validation errors
        //
        //   C# return  : DataTable (updated match + conversation row)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable RejectMatch(int matchID, int rejectingUserID)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_RejectMatch", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@MatchID",         SqlDbType.Int).Value = matchID;
                command.Parameters.Add("@RejectingUserID", SqlDbType.Int).Value = rejectingUserID;

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
        // usp_GetMatchStatuses
        //   Result set : MatchStatusID, Status (all rows from MatchStatuses)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetMatchStatuses()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetMatchStatuses", connection))
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
