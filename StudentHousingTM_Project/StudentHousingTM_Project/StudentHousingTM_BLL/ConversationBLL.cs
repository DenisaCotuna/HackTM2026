using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class ConversationBLL
    {
        // Fields matching the Conversations table
        public int ConversationID { get; set; }
        public int MatchID { get; set; }
        public int StudentProfileID { get; set; }
        public int OwnerProfileID { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        private static ConversationBLL MapFromRow(DataRow row)
        {
            return new ConversationBLL
            {
                ConversationID   = (int)row["ConversationID"],
                MatchID          = (int)row["MatchID"],
                StudentProfileID = (int)row["StudentProfileID"],
                OwnerProfileID   = (int)row["OwnerProfileID"],
                IsActive         = (bool)row["IsActive"],
                CreatedAt        = (DateTime)row["CreatedAt"]
            };
        }

        public static List<ConversationBLL> GetByUser(int userID)
        {
            DataTable dt = ConversationDAL.GetConversationsByUser(userID);
            List<ConversationBLL> list = new List<ConversationBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static ConversationBLL GetByID(int conversationID)
        {
            DataTable dt = ConversationDAL.GetConversationByID(conversationID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static ConversationBLL GetByMatch(int matchID)
        {
            DataTable dt = ConversationDAL.GetConversationByMatch(matchID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int matchID, int studentProfileID, int ownerProfileID)
        {
            return ConversationDAL.InsertConversation(matchID, studentProfileID, ownerProfileID);
        }

        public static int Deactivate(int conversationID)
        {
            return ConversationDAL.DeactivateConversation(conversationID);
        }
    }
}
