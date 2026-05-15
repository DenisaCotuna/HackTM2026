using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class ConversationDAL
    {
        // Returns all conversations for a user (student or owner)
        public static DataTable GetConversationsByUser(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteQuery("usp_GetConversationsByUser", parameters);
        }

        // Returns a single conversation by ConversationID
        public static DataTable GetConversationByID(int conversationID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID)
            };
            return DBHelper.ExecuteQuery("usp_GetConversationByID", parameters);
        }

        // Returns conversation by MatchID
        public static DataTable GetConversationByMatch(int matchID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID", matchID)
            };
            return DBHelper.ExecuteQuery("usp_GetConversationByMatch", parameters);
        }

        // Inserts a new conversation (called when match becomes mutual), returns new ConversationID
        public static int InsertConversation(int matchID, int studentProfileID, int ownerProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@MatchID",          matchID),
                new SqlParameter("@StudentProfileID", studentProfileID),
                new SqlParameter("@OwnerProfileID",   ownerProfileID)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertConversation", parameters);
            return result != null ? (int)result : 0;
        }

        // Deactivates a conversation
        public static int DeactivateConversation(int conversationID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeactivateConversation", parameters);
        }
    }
}
