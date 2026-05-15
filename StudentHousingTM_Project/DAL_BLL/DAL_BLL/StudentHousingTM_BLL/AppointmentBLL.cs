using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class AppointmentBLL
    {
        // Fields matching the Appointments table
        public int AppointmentID { get; set; }
        public int VisitRequestID { get; set; }
        public int ConversationID { get; set; }
        public int StudentProfileID { get; set; }
        public int OwnerProfileID { get; set; }
        public int PropertyID { get; set; }
        public DateTime ConfirmedDate { get; set; }
        public TimeSpan? ConfirmedTime { get; set; }
        public int StatusID { get; set; }
        public DateTime CreatedAt { get; set; }

        private static AppointmentBLL MapFromRow(DataRow row)
        {
            return new AppointmentBLL
            {
                AppointmentID    = (int)row["AppointmentID"],
                VisitRequestID   = (int)row["VisitRequestID"],
                ConversationID   = (int)row["ConversationID"],
                StudentProfileID = (int)row["StudentProfileID"],
                OwnerProfileID   = (int)row["OwnerProfileID"],
                PropertyID       = (int)row["PropertyID"],
                ConfirmedDate    = (DateTime)row["ConfirmedDate"],
                ConfirmedTime    = row["ConfirmedTime"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)row["ConfirmedTime"],
                StatusID         = (int)row["StatusID"],
                CreatedAt        = (DateTime)row["CreatedAt"]
            };
        }

        public static List<AppointmentBLL> GetByStudent(int studentProfileID)
        {
            DataTable dt = AppointmentDAL.GetAppointmentsByStudent(studentProfileID);
            List<AppointmentBLL> list = new List<AppointmentBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static List<AppointmentBLL> GetByOwner(int ownerProfileID)
        {
            DataTable dt = AppointmentDAL.GetAppointmentsByOwner(ownerProfileID);
            List<AppointmentBLL> list = new List<AppointmentBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static AppointmentBLL GetByID(int appointmentID)
        {
            DataTable dt = AppointmentDAL.GetAppointmentByID(appointmentID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int visitRequestID, int conversationID, int studentProfileID,
            int ownerProfileID, int propertyID, DateTime confirmedDate, TimeSpan? confirmedTime)
        {
            return AppointmentDAL.InsertAppointment(visitRequestID, conversationID,
                studentProfileID, ownerProfileID, propertyID, confirmedDate, confirmedTime);
        }

        public static int UpdateStatus(int appointmentID, int statusID)
        {
            return AppointmentDAL.UpdateAppointmentStatus(appointmentID, statusID);
        }
    }
}
