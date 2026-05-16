using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsVisitRequest
    {
        // ── Properties (from result set of usp_CreateVisitRequest) ────────────
        public int VisitRequestID { get; set; }
        public int ConversationID { get; set; }
        public int StudentUserID { get; set; }
        public string? StudentNote { get; set; }
        public string? ProposedDates { get; set; }   // aggregated CSV from STRING_AGG
        public int? VisitStatusID { get; set; }
        public string? VisitStatus { get; set; }   // joined label

        // ── CreateVisitRequest ────────────────────────────────────────────────
        /// <summary>
        /// Creates a new visit request with one or more proposed dates.
        /// proposedDates must be a comma-separated YYYY-MM-DD string, e.g. "2026-06-10,2026-06-15".
        /// Returns the populated clsVisitRequest on success, null on failure.
        /// newVisitRequestID is set to the new ID (or -1 on failure).
        /// </summary>
        public static clsVisitRequest? Create(
            int conversationID,
            int studentUserID,
            string? studentNote,
            string proposedDates,
            ref int newVisitRequestID)
        {
            newVisitRequestID = -1;

            DataTable dt = clsVisitRequestsDAL.CreateVisitRequest(
                conversationID, studentUserID, studentNote, proposedDates,
                ref newVisitRequestID);

            if (dt.Rows.Count == 0 || newVisitRequestID == -1)
                return null;

            return MapRow(dt.Rows[0]);
        }

        // ── GetVisitStatuses ──────────────────────────────────────────────────
        /// <summary>Returns all visit statuses (VisitStatusID, Status).</summary>
        public static DataTable GetStatuses()
            => clsVisitRequestsDAL.GetVisitStatuses();

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsVisitRequest MapRow(DataRow row)
        {
            return new clsVisitRequest
            {
                VisitRequestID = row.Table.Columns.Contains("VisitRequestID") && row["VisitRequestID"] != DBNull.Value ? (int)row["VisitRequestID"] : 0,
                ConversationID = row.Table.Columns.Contains("ConversationID") && row["ConversationID"] != DBNull.Value ? (int)row["ConversationID"] : 0,
                StudentUserID = row.Table.Columns.Contains("StudentUserID") && row["StudentUserID"] != DBNull.Value ? (int)row["StudentUserID"] : 0,
                StudentNote = row.Table.Columns.Contains("StudentNote") && row["StudentNote"] != DBNull.Value ? row["StudentNote"].ToString() : null,
                ProposedDates = row.Table.Columns.Contains("ProposedDates") && row["ProposedDates"] != DBNull.Value ? row["ProposedDates"].ToString() : null,
                VisitStatusID = row.Table.Columns.Contains("VisitStatusID") && row["VisitStatusID"] != DBNull.Value ? (int?)row["VisitStatusID"] : null,
                VisitStatus = row.Table.Columns.Contains("VisitStatus") && row["VisitStatus"] != DBNull.Value ? row["VisitStatus"].ToString() : null,
            };
        }
    }
}
