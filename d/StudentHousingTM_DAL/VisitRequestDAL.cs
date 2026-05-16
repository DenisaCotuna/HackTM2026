using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class VisitRequestDAL
    {
        // Returns all visit requests in a conversation
        public static DataTable GetVisitRequestsByConversation(int conversationID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID", conversationID)
            };
            return DBHelper.ExecuteQuery("usp_GetVisitRequestsByConversation", parameters);
        }

        // Returns a single visit request by ID
        public static DataTable GetVisitRequestByID(int visitRequestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@VisitRequestID", visitRequestID)
            };
            return DBHelper.ExecuteQuery("usp_GetVisitRequestByID", parameters);
        }

        // Inserts a new visit request, returns new VisitRequestID
        public static int InsertVisitRequest(int conversationID, int studentProfileID,
            int propertyID, string studentNote)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@ConversationID",   conversationID),
                new SqlParameter("@StudentProfileID", studentProfileID),
                new SqlParameter("@PropertyID",       propertyID),
                new SqlParameter("@StudentNote",      (object)studentNote ?? DBNull.Value),
                new SqlParameter("@NewVisitRequestID", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };
            object result = DBHelper.ExecuteScalar("usp_CreateVisitRequest", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates the status of a visit request
        public static int UpdateVisitRequestStatus(int visitRequestID, int statusID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@VisitRequestID", visitRequestID),
                new SqlParameter("@StatusID",       statusID)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateVisitRequestStatus", parameters);
        }

        // Inserts a proposed date for a visit request
        public static int InsertProposedDate(int visitRequestID, DateTime proposedDate)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@VisitRequestID", visitRequestID),
                new SqlParameter("@ProposedDate",   proposedDate)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertProposedDate", parameters);
            return result != null ? (int)result : 0;
        }

        // Returns all proposed dates for a visit request
        public static DataTable GetProposedDatesByVisitRequest(int visitRequestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@VisitRequestID", visitRequestID)
            };
            return DBHelper.ExecuteQuery("usp_GetProposedDatesByVisitRequest", parameters);
        }
    }
}
