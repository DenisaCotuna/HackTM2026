using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Appointments.
    /// Covers: usp_ConfirmAppointment | usp_GetAppointmentStatuses
    /// </summary>
    public static class clsAppointmentsDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_ConfirmAppointment
        //   Behaviour  : Validates that the visit request is still Pending, that
        //                the confirming user is the property owner, and that the
        //                chosen date is one of the student's proposed dates.
        //                Inside a transaction: marks the VisitRequest as Accepted
        //                and inserts an Appointment row (StatusID = 1 Scheduled).
        //   OUTPUT     : @NewAppointmentID INT
        //   Result set : Full appointment details (property, student, owner info)
        //   RETURN     : 0 on success; THROW on any validation error
        //
        //   C# return  : DataTable (appointment details row) + ref newAppointmentID
        //
        //   Parameters :
        //     confirmedTime → pass null if the owner only confirms the date,
        //                     not a specific time (the SP accepts TIME = NULL)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable ConfirmAppointment(
            int       visitRequestID,
            int       ownerUserID,
            DateTime  confirmedDate,
            TimeSpan? confirmedTime,         // NULL = date only, no specific time
            ref int   newAppointmentID)
        {
            DataTable dt = new DataTable();
            newAppointmentID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_ConfirmAppointment", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@VisitRequestID", SqlDbType.Int).Value  = visitRequestID;
                command.Parameters.Add("@OwnerUserID",    SqlDbType.Int).Value  = ownerUserID;
                command.Parameters.Add("@ConfirmedDate",  SqlDbType.Date).Value = confirmedDate;

                // SqlDbType.Time maps to .NET TimeSpan; pass DBNull if not provided
                command.Parameters.Add("@ConfirmedTime",  SqlDbType.Time).Value =
                    confirmedTime.HasValue ? (object)confirmedTime.Value : DBNull.Value;

                // ── OUTPUT param ──────────────────────────────────────
                SqlParameter outAppointmentID = new SqlParameter("@NewAppointmentID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outAppointmentID);

                try
                {
                    connection.Open();

                    // ExecuteReader to capture the result set (appointment details).
                    // OUTPUT param is available only after the reader is disposed.
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        dt.Load(reader);
                    }

                    newAppointmentID = (int)command.Parameters["@NewAppointmentID"].Value;
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetAppointmentStatuses
        //   Result set : AppointmentStatusID, Status
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetAppointmentStatuses()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetAppointmentStatuses", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

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
