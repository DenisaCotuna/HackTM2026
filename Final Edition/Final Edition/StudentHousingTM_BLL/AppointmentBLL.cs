using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM.DAL;

namespace StudentHousingTM.BLL
{
    public class clsAppointment
    {
        // ?? Properties (from result set of usp_ConfirmAppointment) ????????????
        public int AppointmentID { get; set; }
        public int VisitRequestID { get; set; }
        public int PropertyID { get; set; }
        public string PropertyTitle { get; set; } = string.Empty;
        public string PropertyAddress { get; set; } = string.Empty;
        public int StudentUserID { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int OwnerUserID { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public DateTime ConfirmedDate { get; set; }
        public TimeSpan? ConfirmedTime { get; set; }   // NULL = date-only
        public int AppointmentStatusID { get; set; }
        public string AppointmentStatus { get; set; } = string.Empty;

        // ?? ConfirmAppointment ????????????????????????????????????????????????
        /// <summary>
        /// Confirms a visit request, creating a new Appointment row.
        /// Returns the populated clsAppointment on success, null on failure.
        /// newAppointmentID is set to the new ID (or -1 on failure).
        /// </summary>
        public static clsAppointment? Confirm(
            int visitRequestID,
            int ownerUserID,
            DateTime confirmedDate,
            TimeSpan? confirmedTime,
            ref int newAppointmentID)
        {
            newAppointmentID = -1;

            DataTable dt = clsAppointmentsDAL.ConfirmAppointment(
                visitRequestID, ownerUserID, confirmedDate, confirmedTime,
                ref newAppointmentID);

            if (dt.Rows.Count == 0 || newAppointmentID == -1)
                return null;

            return MapRow(dt.Rows[0]);
        }

        // ?? GetAppointmentStatuses ????????????????????????????????????????????
        /// <summary>Returns all appointment statuses as a DataTable (AppointmentStatusID, Status).</summary>
        public static DataTable GetStatuses()
            => clsAppointmentsDAL.GetAppointmentStatuses();

        // ?? Internal mapper ???????????????????????????????????????????????????
        private static clsAppointment MapRow(DataRow row)
        {
            return new clsAppointment
            {
                AppointmentID = row.Table.Columns.Contains("AppointmentID") && row["AppointmentID"] != DBNull.Value ? (int)row["AppointmentID"] : 0,
                VisitRequestID = row.Table.Columns.Contains("VisitRequestID") && row["VisitRequestID"] != DBNull.Value ? (int)row["VisitRequestID"] : 0,
                PropertyID = row.Table.Columns.Contains("PropertyID") && row["PropertyID"] != DBNull.Value ? (int)row["PropertyID"] : 0,
                PropertyTitle = row.Table.Columns.Contains("PropertyTitle") && row["PropertyTitle"] != DBNull.Value ? row["PropertyTitle"].ToString()! : string.Empty,
                PropertyAddress = row.Table.Columns.Contains("PropertyAddress") && row["PropertyAddress"] != DBNull.Value ? row["PropertyAddress"].ToString()! : string.Empty,
                StudentUserID = row.Table.Columns.Contains("StudentUserID") && row["StudentUserID"] != DBNull.Value ? (int)row["StudentUserID"] : 0,
                StudentName = row.Table.Columns.Contains("StudentName") && row["StudentName"] != DBNull.Value ? row["StudentName"].ToString()! : string.Empty,
                OwnerUserID = row.Table.Columns.Contains("OwnerUserID") && row["OwnerUserID"] != DBNull.Value ? (int)row["OwnerUserID"] : 0,
                OwnerName = row.Table.Columns.Contains("OwnerName") && row["OwnerName"] != DBNull.Value ? row["OwnerName"].ToString()! : string.Empty,
                ConfirmedDate = row.Table.Columns.Contains("ConfirmedDate") && row["ConfirmedDate"] != DBNull.Value ? (DateTime)row["ConfirmedDate"] : DateTime.MinValue,
                ConfirmedTime = row.Table.Columns.Contains("ConfirmedTime") && row["ConfirmedTime"] != DBNull.Value ? (TimeSpan?)row["ConfirmedTime"] : null,
                AppointmentStatusID = row.Table.Columns.Contains("AppointmentStatusID") && row["AppointmentStatusID"] != DBNull.Value ? (int)row["AppointmentStatusID"] : 0,
                AppointmentStatus = row.Table.Columns.Contains("AppointmentStatus") && row["AppointmentStatus"] != DBNull.Value ? row["AppointmentStatus"].ToString()! : string.Empty,
            };
        }
    }
}
