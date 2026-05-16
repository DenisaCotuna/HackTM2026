using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Messages.
    /// Covers: usp_SendMessage | usp_GetMessagesByConversation
    /// </summary>
    public static class clsMessagesDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_SendMessage
        //   Behaviour  : Validates that the conversation is active and that the
        //                sender is a participant, inserts the message inside a
        //                transaction, then returns the saved message row.
        //   Result set : MessageID, ConversationID, SenderID, SenderName,
        //                SenderRole, MessageText, SentAt, IsRead
        //   RETURN     : 0 on success; THROW on validation errors
        //
        //   C# return  : DataTable (the sent message row)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable SendMessage(int conversationID, int senderID, string messageText)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_SendMessage", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@ConversationID", SqlDbType.Int).Value = conversationID;
                command.Parameters.Add("@SenderID",       SqlDbType.Int).Value = senderID;
                command.Parameters.Add("@MessageText",    SqlDbType.NVarChar, -1).Value = messageText;

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
        // usp_GetMessagesByConversation
        //   Behaviour  : Validates that the requesting user is a participant,
        //                marks all messages from the OTHER side as read (UPDATE),
        //                then returns all messages ordered by SentAt ASC.
        //   Result set : MessageID, SenderID, SenderName, SenderRole,
        //                MessageText, SentAt, IsRead, IsOwnMessage (0|1)
        //   RETURN     : 0 on success; THROW on validation errors
        //
        //   C# return  : DataTable (all messages in the conversation)
        //
        //   Note       : Combines a write (mark-as-read) with a read (fetch).
        //                ExecuteReader is the correct execution method here
        //                since the SP's final action is a SELECT.
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetMessagesByConversation(int conversationID, int requestingUserID)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetMessagesByConversation", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@ConversationID",   SqlDbType.Int).Value = conversationID;
                command.Parameters.Add("@RequestingUserID", SqlDbType.Int).Value = requestingUserID;

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
