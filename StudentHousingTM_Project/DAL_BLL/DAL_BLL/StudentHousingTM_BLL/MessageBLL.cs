using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class MessageBLL
    {
        // Fields matching the Messages table
        public int MessageID { get; set; }
        public int ConversationID { get; set; }
        public int SenderID { get; set; }
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }

        private static MessageBLL MapFromRow(DataRow row)
        {
            return new MessageBLL
            {
                MessageID      = (int)row["MessageID"],
                ConversationID = (int)row["ConversationID"],
                SenderID       = (int)row["SenderID"],
                MessageText    = row["MessageText"].ToString(),
                SentAt         = (DateTime)row["SentAt"],
                IsRead         = (bool)row["IsRead"]
            };
        }

        public static List<MessageBLL> GetByConversation(int conversationID, int requestingUserID)
        {
            DataTable dt = MessageDAL.GetMessagesByConversation(conversationID, requestingUserID);
            List<MessageBLL> list = new List<MessageBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static int Insert(int conversationID, int senderID, string messageText)
        {
            return MessageDAL.InsertMessage(conversationID, senderID, messageText);
        }

        public static int MarkAsRead(int conversationID, int userID)
        {
            return MessageDAL.MarkMessagesAsRead(conversationID, userID);
        }

        public static int GetUnreadCount(int conversationID, int userID)
        {
            return MessageDAL.GetUnreadMessageCount(conversationID, userID);
        }
    }
}
