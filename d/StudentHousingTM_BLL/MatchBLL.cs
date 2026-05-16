using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class MatchBLL
    {
        // Fields matching the Matches table
        public int MatchID { get; set; }
        public int StudentRequestID { get; set; }
        public int PropertyID { get; set; }
        public int MatchScore { get; set; }
        public string MatchType { get; set; }
        public bool StudentInterested { get; set; }
        public bool OwnerInterested { get; set; }
        public int MatchStatusID { get; set; }
        public string RejectedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? MutualConfirmedAt { get; set; }

        private static MatchBLL MapFromRow(DataRow row)
        {
            return new MatchBLL
            {
                MatchID             = (int)row["MatchID"],
                StudentRequestID    = (int)row["StudentRequestID"],
                PropertyID          = (int)row["PropertyID"],
                MatchScore          = (int)row["MatchScore"],
                MatchType           = row["MatchType"].ToString(),
                StudentInterested   = (bool)row["StudentInterested"],
                OwnerInterested     = (bool)row["OwnerInterested"],
                MatchStatusID       = (int)row["MatchStatusID"],
                RejectedBy          = row["RejectedBy"] == DBNull.Value ? null : row["RejectedBy"].ToString(),
                CreatedAt           = (DateTime)row["CreatedAt"],
                MutualConfirmedAt   = row["MutualConfirmedAt"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MutualConfirmedAt"]
            };
        }

        public static List<MatchBLL> GetByStudent(int studentProfileID)
        {
            DataTable dt = MatchDAL.GetMatchesByStudent(studentProfileID);
            List<MatchBLL> list = new List<MatchBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static List<MatchBLL> GetByOwner(int ownerProfileID)
        {
            DataTable dt = MatchDAL.GetMatchesByOwner(ownerProfileID);
            List<MatchBLL> list = new List<MatchBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static MatchBLL GetByID(int matchID)
        {
            DataTable dt = MatchDAL.GetMatchByID(matchID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int studentRequestID, int propertyID, int matchScore, string matchType)
        {
            return MatchDAL.InsertMatch(studentRequestID);
        }

        public static int SetStudentInterested(int matchID, bool interested)
        {
            return MatchDAL.SetStudentInterested(matchID, "Student", interested);
        }

        public static int SetOwnerInterested(int matchID, bool interested)
        {
            return MatchDAL.SetOwnerInterested(matchID, "Owner", interested);
        }

        public static int Reject(int matchID, int   rejectedBy)
        {
            return MatchDAL.RejectMatch(matchID, rejectedBy);
        }

        public static int ConfirmMutual(int matchID)
        {
            return MatchDAL.ConfirmMutualMatch(matchID);
        }
    }
}
