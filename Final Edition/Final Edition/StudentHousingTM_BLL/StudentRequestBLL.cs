using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsStudentRequest
    {
        // ── Properties (from result sets of usp_CreateStudentRequest / usp_GenerateMatches) ──
        public int StudentRequestID { get; set; }
        public int StudentProfileID { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal BudgetMin { get; set; }
        public decimal BudgetMax { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }   // NULL = open-ended
        public int? PropertyTypePreferredID { get; set; }
        public string? PropertyTypePreferred { get; set; }   // joined label
        public bool? FurnishedRequired { get; set; }   // NULL = no preference
        public bool UtilitiesRequired { get; set; }
        public bool PetsAllowed { get; set; }
        public bool SmokersAllowed { get; set; }
        public string? AdditionalNotes { get; set; }
        public string? PreferredAreas { get; set; }   // aggregated CSV string

        // ── CreateStudentRequest ──────────────────────────────────────────────
        /// <summary>
        /// Inserts a new student housing request.
        /// Returns the populated clsStudentRequest on success, null on failure.
        /// newRequestID is set to the new ID (or -1 on failure).
        /// </summary>
        public static clsStudentRequest? Create(
            int studentProfileID,
            string title,
            decimal budgetMin,
            decimal budgetMax,
            DateTime moveInDate,
            DateTime? moveOutDate,
            int propertyTypePreferredID,
            bool? furnishedRequired,
            bool utilitiesRequired,
            bool petsAllowed,
            bool smokersAllowed,
            string? additionalNotes,
            string? preferredAreas,
            ref int newRequestID)
        {
            newRequestID = -1;

            DataTable dt = clsStudentRequestsDAL.CreateStudentRequest(
                studentProfileID, title, budgetMin, budgetMax,
                moveInDate, moveOutDate, propertyTypePreferredID,
                furnishedRequired, utilitiesRequired, petsAllowed,
                smokersAllowed, additionalNotes, preferredAreas,
                ref newRequestID);

            if (dt.Rows.Count == 0 || newRequestID == -1)
                return null;

            return MapRow(dt.Rows[0]);
        }

        // ── GenerateMatches ───────────────────────────────────────────────────
        /// <summary>
        /// Runs the matching engine for a given student request.
        /// Returns the list of newly created matches ordered by MatchScore DESC,
        /// or an empty list if none were generated (or on failure).
        /// </summary>
        public static List<clsMatch> GenerateMatches(int studentRequestID)
        {
            DataTable dt = clsStudentRequestsDAL.GenerateMatches(studentRequestID);
            var list = new List<clsMatch>();

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new clsMatch
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
                });
            }

            return list;
        }

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsStudentRequest MapRow(DataRow row)
        {
            return new clsStudentRequest
            {
                StudentRequestID = row.Table.Columns.Contains("StudentRequestID") && row["StudentRequestID"] != DBNull.Value ? (int)row["StudentRequestID"] : 0,
                StudentProfileID = row.Table.Columns.Contains("StudentProfileID") && row["StudentProfileID"] != DBNull.Value ? (int)row["StudentProfileID"] : 0,
                Title = row.Table.Columns.Contains("Title") && row["Title"] != DBNull.Value ? row["Title"].ToString()! : string.Empty,
                BudgetMin = row.Table.Columns.Contains("BudgetMin") && row["BudgetMin"] != DBNull.Value ? (decimal)row["BudgetMin"] : 0m,
                BudgetMax = row.Table.Columns.Contains("BudgetMax") && row["BudgetMax"] != DBNull.Value ? (decimal)row["BudgetMax"] : 0m,
                MoveInDate = row.Table.Columns.Contains("MoveInDate") && row["MoveInDate"] != DBNull.Value ? (DateTime)row["MoveInDate"] : DateTime.MinValue,
                MoveOutDate = row.Table.Columns.Contains("MoveOutDate") && row["MoveOutDate"] != DBNull.Value ? (DateTime?)row["MoveOutDate"] : null,
                PropertyTypePreferredID = row.Table.Columns.Contains("PropertyTypePreferredID") && row["PropertyTypePreferredID"] != DBNull.Value ? (int?)row["PropertyTypePreferredID"] : null,
                PropertyTypePreferred = row.Table.Columns.Contains("PropertyTypePreferred") && row["PropertyTypePreferred"] != DBNull.Value ? row["PropertyTypePreferred"].ToString() : null,
                FurnishedRequired = row.Table.Columns.Contains("FurnishedRequired") && row["FurnishedRequired"] != DBNull.Value ? (bool?)row["FurnishedRequired"] : null,
                UtilitiesRequired = row.Table.Columns.Contains("UtilitiesRequired") && row["UtilitiesRequired"] != DBNull.Value && (bool)row["UtilitiesRequired"],
                PetsAllowed = row.Table.Columns.Contains("PetsAllowed") && row["PetsAllowed"] != DBNull.Value && (bool)row["PetsAllowed"],
                SmokersAllowed = row.Table.Columns.Contains("SmokersAllowed") && row["SmokersAllowed"] != DBNull.Value && (bool)row["SmokersAllowed"],
                AdditionalNotes = row.Table.Columns.Contains("AdditionalNotes") && row["AdditionalNotes"] != DBNull.Value ? row["AdditionalNotes"].ToString() : null,
                PreferredAreas = row.Table.Columns.Contains("PreferredAreas") && row["PreferredAreas"] != DBNull.Value ? row["PreferredAreas"].ToString() : null,
            };
        }
    }
}
