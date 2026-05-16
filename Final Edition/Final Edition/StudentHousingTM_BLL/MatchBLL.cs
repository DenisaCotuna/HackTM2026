using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsMatch
    {
        // ── Properties (from result sets of usp_ExpressInterest / usp_RejectMatch) ──
        public int MatchID { get; set; }
        public int StudentRequestID { get; set; }
        public int PropertyID { get; set; }
        public string PropertyTitle { get; set; } = string.Empty;
        public int MatchStatusID { get; set; }
        public string MatchStatus { get; set; } = string.Empty;
        public int MatchScore { get; set; }
        public bool StudentInterested { get; set; }
        public bool OwnerInterested { get; set; }

        // Populated only when a mutual confirmation occurs
        public int? ConversationID { get; set; }   // NULL until mutually confirmed
        public bool? ConversationActive { get; set; }   // NULL until conversation exists

        // ── ExpressInterest ───────────────────────────────────────────────────
        /// <summary>
        /// Flips StudentInterested / OwnerInterested for the given match.
        /// If both sides are now interested the SP creates a Conversation automatically.
        /// Returns the updated clsMatch, or null on failure.
        /// </summary>
        public static clsMatch? ExpressInterest(int matchID, string role, bool interested)
        {
            DataTable dt = clsMatchesDAL.ExpressInterest(matchID, role, interested);
            if (dt.Rows.Count == 0) return null;
            return MapRow(dt.Rows[0]);
        }

        // ── RejectMatch ───────────────────────────────────────────────────────
        /// <summary>
        /// Marks the match as Rejected and closes any open Conversation.
        /// Returns the updated clsMatch (with ConversationID + IsActive), or null on failure.
        /// </summary>
        public static clsMatch? Reject(int matchID, int rejectingUserID)
        {
            DataTable dt = clsMatchesDAL.RejectMatch(matchID, rejectingUserID);
            if (dt.Rows.Count == 0) return null;
            return MapRow(dt.Rows[0]);
        }

        // ── GetMatchStatuses ──────────────────────────────────────────────────
        /// <summary>Returns all match statuses as a DataTable (MatchStatusID, Status).</summary>
        public static DataTable GetStatuses()
            => clsMatchesDAL.GetMatchStatuses();

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsMatch MapRow(DataRow row)
        {
            return new clsMatch
            {
                MatchID = row.Table.Columns.Contains("MatchID") && row["MatchID"] != DBNull.Value ? (int)row["MatchID"] : 0,
                StudentRequestID = row.Table.Columns.Contains("StudentRequestID") && row["StudentRequestID"] != DBNull.Value ? (int)row["StudentRequestID"] : 0,
                PropertyID = row.Table.Columns.Contains("PropertyID") && row["PropertyID"] != DBNull.Value ? (int)row["PropertyID"] : 0,
                PropertyTitle = row.Table.Columns.Contains("PropertyTitle") && row["PropertyTitle"] != DBNull.Value ? row["PropertyTitle"].ToString()! : string.Empty,
                MatchStatusID = row.Table.Columns.Contains("MatchStatusID") && row["MatchStatusID"] != DBNull.Value ? (int)row["MatchStatusID"] : 0,
                MatchStatus = row.Table.Columns.Contains("MatchStatus") && row["MatchStatus"] != DBNull.Value ? row["MatchStatus"].ToString()! : string.Empty,
                MatchScore = row.Table.Columns.Contains("MatchScore") && row["MatchScore"] != DBNull.Value ? (int)row["MatchScore"] : 0,
                StudentInterested = row.Table.Columns.Contains("StudentInterested") && row["StudentInterested"] != DBNull.Value && (bool)row["StudentInterested"],
                OwnerInterested = row.Table.Columns.Contains("OwnerInterested") && row["OwnerInterested"] != DBNull.Value && (bool)row["OwnerInterested"],
                ConversationID = row.Table.Columns.Contains("ConversationID") && row["ConversationID"] != DBNull.Value ? (int?)row["ConversationID"] : null,
                ConversationActive = row.Table.Columns.Contains("IsActive") && row["IsActive"] != DBNull.Value ? (bool?)row["IsActive"] : null,
            };
        }
    }
}
