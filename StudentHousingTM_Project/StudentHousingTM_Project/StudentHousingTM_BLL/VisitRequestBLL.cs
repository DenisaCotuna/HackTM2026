using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class VisitRequestBLL
    {
        // Fields matching the VisitRequests table
        public int VisitRequestID { get; set; }
        public int ConversationID { get; set; }
        public int StudentProfileID { get; set; }
        public int PropertyID { get; set; }
        public string StudentNote { get; set; }
        public int StatusID { get; set; }
        public DateTime CreatedAt { get; set; }

        private static VisitRequestBLL MapFromRow(DataRow row)
        {
            return new VisitRequestBLL
            {
                VisitRequestID   = (int)row["VisitRequestID"],
                ConversationID   = (int)row["ConversationID"],
                StudentProfileID = (int)row["StudentProfileID"],
                PropertyID       = (int)row["PropertyID"],
                StudentNote      = row["StudentNote"] == DBNull.Value ? null : row["StudentNote"].ToString(),
                StatusID         = (int)row["StatusID"],
                CreatedAt        = (DateTime)row["CreatedAt"]
            };
        }

        public static List<VisitRequestBLL> GetByConversation(int conversationID)
        {
            DataTable dt = VisitRequestDAL.GetVisitRequestsByConversation(conversationID);
            List<VisitRequestBLL> list = new List<VisitRequestBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static VisitRequestBLL GetByID(int visitRequestID)
        {
            DataTable dt = VisitRequestDAL.GetVisitRequestByID(visitRequestID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int conversationID, int studentProfileID, int propertyID, string studentNote)
        {
            return VisitRequestDAL.InsertVisitRequest(conversationID, studentProfileID, propertyID, studentNote);
        }

        public static int UpdateStatus(int visitRequestID, int statusID)
        {
            return VisitRequestDAL.UpdateVisitRequestStatus(visitRequestID, statusID);
        }

        public static int AddProposedDate(int visitRequestID, DateTime proposedDate)
        {
            return VisitRequestDAL.InsertProposedDate(visitRequestID, proposedDate);
        }
    }
}
