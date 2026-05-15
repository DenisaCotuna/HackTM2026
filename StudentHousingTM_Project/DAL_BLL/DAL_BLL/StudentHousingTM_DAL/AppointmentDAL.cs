using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class AppointmentDAL
    {
        // Returns appointments for a student
        public static DataTable GetAppointmentsByStudent(int studentProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID", studentProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetAppointmentsByStudent", parameters);
        }

        // Returns appointments for an owner
        public static DataTable GetAppointmentsByOwner(int ownerProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID", ownerProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetAppointmentsByOwner", parameters);
        }

        // Returns a single appointment by ID
        public static DataTable GetAppointmentByID(int appointmentID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@AppointmentID", appointmentID)
            };
            return DBHelper.ExecuteQuery("usp_GetAppointmentByID", parameters);
        }

        // Inserts a new appointment, returns new AppointmentID
        public static int InsertAppointment(int visitRequestID, int conversationID,
            int studentProfileID, int ownerProfileID, int propertyID,
            DateTime confirmedDate, TimeSpan? confirmedTime)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@VisitRequestID",   visitRequestID),
                new SqlParameter("@ConversationID",   conversationID),
                new SqlParameter("@StudentProfileID", studentProfileID),
                new SqlParameter("@OwnerProfileID",   ownerProfileID),
                new SqlParameter("@PropertyID",       propertyID),
                new SqlParameter("@ConfirmedDate",    confirmedDate),
                new SqlParameter("@ConfirmedTime",    (object)confirmedTime ?? DBNull.Value),
                new SqlParameter("@NewAppointmentID", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };
            object result = DBHelper.ExecuteScalar("usp_InsertAppointment", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates appointment status
        public static int UpdateAppointmentStatus(int appointmentID, int statusID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@AppointmentID", appointmentID),
                new SqlParameter("@StatusID",      statusID)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateAppointmentStatus", parameters);
        }
    }
}
