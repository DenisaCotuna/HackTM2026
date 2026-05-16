using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsMessage
    {
        // ── Properties (from result sets of usp_SendMessage / usp_GetMessagesByConversation) ──
        public int MessageID { get; set; }
        public int ConversationID { get; set; }
        public int SenderID { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string SenderRole { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public bool IsOwnMessage { get; set; }   // populated by GetByConversation only

        // ── SendMessage ───────────────────────────────────────────────────────
        /// <summary>
        /// Sends a message to an active conversation.
        /// Returns the saved clsMessage on success, or null on failure.
        /// </summary>
        public static clsMessage? Send(int conversationID, int senderID, string messageText)
        {
            DataTable dt = clsMessagesDAL.SendMessage(conversationID, senderID, messageText);
            if (dt.Rows.Count == 0) return null;
            return MapRow(dt.Rows[0]);
        }

        // ── GetByConversation ─────────────────────────────────────────────────
        /// <summary>
        /// Returns all messages in a conversation ordered by SentAt ASC.
        /// Also marks messages from the other participant as read (side-effect in SP).
        /// Returns null on failure (bad participant, inactive conversation, etc.).
        /// </summary>
        public static List<clsMessage>? GetByConversation(int conversationID, int requestingUserID)
        {
            DataTable dt = clsMessagesDAL.GetMessagesByConversation(conversationID, requestingUserID);
            if (dt == null) return null;

            var list = new List<clsMessage>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapRow(row));

            return list;
        }

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsMessage MapRow(DataRow row)
        {
            return new clsMessage
            {
                MessageID = row.Table.Columns.Contains("MessageID") && row["MessageID"] != DBNull.Value ? (int)row["MessageID"] : 0,
                ConversationID = row.Table.Columns.Contains("ConversationID") && row["ConversationID"] != DBNull.Value ? (int)row["ConversationID"] : 0,
                SenderID = row.Table.Columns.Contains("SenderID") && row["SenderID"] != DBNull.Value ? (int)row["SenderID"] : 0,
                SenderName = row.Table.Columns.Contains("SenderName") && row["SenderName"] != DBNull.Value ? row["SenderName"].ToString()! : string.Empty,
                SenderRole = row.Table.Columns.Contains("SenderRole") && row["SenderRole"] != DBNull.Value ? row["SenderRole"].ToString()! : string.Empty,
                MessageText = row.Table.Columns.Contains("MessageText") && row["MessageText"] != DBNull.Value ? row["MessageText"].ToString()! : string.Empty,
                SentAt = row.Table.Columns.Contains("SentAt") && row["SentAt"] != DBNull.Value ? (DateTime)row["SentAt"] : DateTime.MinValue,
                IsRead = row.Table.Columns.Contains("IsRead") && row["IsRead"] != DBNull.Value && (bool)row["IsRead"],
                IsOwnMessage = row.Table.Columns.Contains("IsOwnMessage") && row["IsOwnMessage"] != DBNull.Value && Convert.ToBoolean(row["IsOwnMessage"]),
            };
        }
    }
}
