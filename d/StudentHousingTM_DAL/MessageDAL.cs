using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class MessageDAL
    {
        // Returns all messages in a conversation
        public static DataTable GetMessagesByConversation(int conversationID,int RequestingUserID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID), 
                new SqlParameter("@RequestingUserID", RequestingUserID)
            };
            return DBHelper.ExecuteQuery("usp_GetMessagesByConversation", parameters);
        }

        // Inserts a new message, returns new MessageID
        public static int InsertMessage(int conversationID, int senderID, string messageText)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID),
                new SqlParameter("@SenderID",       senderID),
                new SqlParameter("@MessageText",    messageText)
            };
            object result = DBHelper.ExecuteScalar("usp_SendMessage", parameters);
            return result != null ? (int)result : 0;
        }

        // Marks all messages in a conversation as read for a specific user
        public static int MarkMessagesAsRead(int conversationID, int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID),
                new SqlParameter("@UserID",         userID)
            };
            return DBHelper.ExecuteNonQuery("usp_MarkMessagesAsRead", parameters);
        }

        // Returns the count of unread messages for a user in a conversation
        public static int GetUnreadMessageCount(int conversationID, int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID),
                new SqlParameter("@UserID",         userID)
            };
            object result = DBHelper.ExecuteScalar("usp_GetUnreadMessageCount", parameters);
            return result != null ? (int)result : 0;
        }
    }
}
