using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Notifications and their lookup tables.
    /// Covers: usp_CreateNotification | usp_GetNotificationsByUser |
    ///         usp_MarkNotificationsAsRead | usp_GetNotificationTypes |
    ///         usp_GetNotificationReferenceTypes
    /// </summary>
    public static class clsNotificationsDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_CreateNotification
        //   Behaviour  : Validates all FK references, inserts a Notification
        //                row inside a transaction.
        //   Result set : NONE  (write-only SP)
        //   RETURN     : 0 on success; THROW on any validation error
        //
        //   C# return  : bool  — true if the INSERT succeeded, false otherwise
        //
        //   Execution  : ExecuteNonQuery — no result set is expected.
        //                We rely purely on try/catch because the SP always
        //                returns 0 on success and throws on failure, so there
        //                is no meaningful RETURN value to inspect.
        // ─────────────────────────────────────────────────────────────────────
        public static bool CreateNotification(
            int    userID,
            int    notificationTypeID,
            int    referenceTypeID,
            string message)
        {
            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_CreateNotification", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@UserID",             SqlDbType.Int).Value = userID;
                command.Parameters.Add("@NotificationTypeID", SqlDbType.Int).Value = notificationTypeID;
                command.Parameters.Add("@ReferenceTypeID",    SqlDbType.Int).Value = referenceTypeID;
                command.Parameters.Add("@Message",            SqlDbType.NVarChar, 500).Value = message;

                try
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                    return true;
                }
                catch { return false; }
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetNotificationsByUser
        //   Behaviour  : Returns all (or only unread) notifications for a user,
        //                ordered by CreatedAt DESC.
        //   Result set : NotificationID, NotificationType, ReferenceType,
        //                Message, IsRead, CreatedAt
        //   RETURN     : 0 on success; THROW if UserID not found
        //
        //   C# return  : DataTable
        //
        //   Parameters :
        //     unreadOnly → false (default) = all notifications
        //                  true            = only unread
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetNotificationsByUser(int userID, bool unreadOnly = false)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetNotificationsByUser", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@UserID",     SqlDbType.Int).Value = userID;
                command.Parameters.Add("@UnreadOnly", SqlDbType.Bit).Value = unreadOnly;

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
        // usp_MarkNotificationsAsRead
        //   Behaviour  : Marks one specific notification OR all unread
        //                notifications for a user as read, inside a transaction.
        //                After the UPDATE, returns the remaining unread count
        //                so the frontend can update its badge immediately.
        //   Result set : UnreadCount (INT, single scalar row)
        //   RETURN     : 0 on success; THROW on validation errors
        //
        //   C# return  : DataTable (one row: { UnreadCount })
        //
        //   Parameters :
        //     notificationID → null  = mark ALL unread notifications as read
        //                      value = mark only that specific notification
        //
        //   Execution  : ExecuteReader — the SP ends with a SELECT COUNT(*),
        //                so we need the reader to capture that scalar row.
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable MarkNotificationsAsRead(int userID, int? notificationID = null)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_MarkNotificationsAsRead", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@UserID",         SqlDbType.Int).Value = userID;
                command.Parameters.Add("@NotificationID", SqlDbType.Int).Value = (object?)notificationID ?? DBNull.Value;

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
        // usp_GetNotificationTypes
        //   Result set : NotificationTypeID, Type
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetNotificationTypes()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetNotificationTypes", connection))
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

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetNotificationReferenceTypes
        //   Result set : ReferenceTypeID, Reference
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetNotificationReferenceTypes()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetNotificationReferenceTypes", connection))
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
