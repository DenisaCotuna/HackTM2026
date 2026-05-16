using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class MatchDAL
    {
        // Returns all matches for a student (by StudentProfileID)
        public static DataTable GetMatchesByStudent(int studentProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID", studentProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetMatchesByStudent", parameters);
        }

        // Returns all matches for an owner (by OwnerProfileID)
        public static DataTable GetMatchesByOwner(int ownerProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID", ownerProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetMatchesByOwner", parameters);
        }

        // Returns a single match by MatchID
        public static DataTable GetMatchByID(int matchID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID", matchID)
            };
            return DBHelper.ExecuteQuery("usp_GetMatchByID", parameters);
        }

        // Inserts a new match, returns new MatchID
        public static int InsertMatch(int studentRequestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentRequestID", studentRequestID),
                
            };
            object result = DBHelper.ExecuteScalar("usp_GenerateMatches", parameters);
            return result != null ? (int)result : 0;
        }

        // Student marks interest on a match
        public static int SetStudentInterested(int matchID,string Role, bool interested)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID",    matchID),
                new SqlParameter("@Role",       Role),
                new SqlParameter("@Interested", interested)
            };
            return DBHelper.ExecuteNonQuery("usp_ExpressInterest", parameters);
        }

        // Owner marks interest on a match
        public static int SetOwnerInterested(int matchID,string Role,   bool interested)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID",    matchID),
                new SqlParameter("@Role",       Role),
                new SqlParameter("@Interested", interested)
            };
            return DBHelper.ExecuteNonQuery("usp_ExpressInterest", parameters);
        }

        // Rejects a match
        public static int RejectMatch(int matchID, int rejectedBy)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID",    matchID),
                new SqlParameter("@RejectedBy", rejectedBy)
            };
            return DBHelper.ExecuteNonQuery("usp_RejectMatch", parameters);
        }

        // Confirms mutual match (both interested)
        public static int ConfirmMutualMatch(int matchID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID", matchID)
            };
            return DBHelper.ExecuteNonQuery("usp_ConfirmMutualMatch", parameters);
        }
    }
}
