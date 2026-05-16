using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsNotification
    {
        // ── Properties (from result set of usp_GetNotificationsByUser) ────────
        public int NotificationID { get; set; }
        public string NotificationType { get; set; } = string.Empty;
        public string ReferenceType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        // ── CreateNotification ────────────────────────────────────────────────
        /// <summary>
        /// Inserts a notification. Returns true on success, false on failure.
        /// </summary>
        public static bool Create(
            int userID,
            int notificationTypeID,
            int referenceTypeID,
            string message)
            => clsNotificationsDAL.CreateNotification(userID, notificationTypeID, referenceTypeID, message);

        // ── GetByUser ─────────────────────────────────────────────────────────
        /// <summary>
        /// Returns all (or unread-only) notifications for a user, newest first.
        /// Returns an empty list on failure.
        /// </summary>
        public static List<clsNotification> GetByUser(int userID, bool unreadOnly = false)
        {
            DataTable dt = clsNotificationsDAL.GetNotificationsByUser(userID, unreadOnly);
            var list = new List<clsNotification>();

            foreach (DataRow row in dt.Rows)
                list.Add(MapRow(row));

            return list;
        }

        // ── MarkAsRead ────────────────────────────────────────────────────────
        /// <summary>
        /// Marks one specific notification (or all unread for the user) as read.
        /// Returns the remaining unread count, or -1 on failure.
        /// </summary>
        public static int MarkAsRead(int userID, int? notificationID = null)
        {
            DataTable dt = clsNotificationsDAL.MarkNotificationsAsRead(userID, notificationID);
            if (dt.Rows.Count == 0) return -1;

            DataRow row = dt.Rows[0];
            return row.Table.Columns.Contains("UnreadCount") && row["UnreadCount"] != DBNull.Value
                ? Convert.ToInt32(row["UnreadCount"])
                : -1;
        }

        // ── GetNotificationTypes ──────────────────────────────────────────────
        /// <summary>Returns all notification types (NotificationTypeID, Type).</summary>
        public static DataTable GetNotificationTypes()
            => clsNotificationsDAL.GetNotificationTypes();

        // ── GetNotificationReferenceTypes ─────────────────────────────────────
        /// <summary>Returns all reference types (ReferenceTypeID, Reference).</summary>
        public static DataTable GetReferenceTypes()
            => clsNotificationsDAL.GetNotificationReferenceTypes();

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsNotification MapRow(DataRow row)
        {
            return new clsNotification
            {
                NotificationID = row.Table.Columns.Contains("NotificationID") && row["NotificationID"] != DBNull.Value ? (int)row["NotificationID"] : 0,
                NotificationType = row.Table.Columns.Contains("NotificationType") && row["NotificationType"] != DBNull.Value ? row["NotificationType"].ToString()! : string.Empty,
                ReferenceType = row.Table.Columns.Contains("ReferenceType") && row["ReferenceType"] != DBNull.Value ? row["ReferenceType"].ToString()! : string.Empty,
                Message = row.Table.Columns.Contains("Message") && row["Message"] != DBNull.Value ? row["Message"].ToString()! : string.Empty,
                IsRead = row.Table.Columns.Contains("IsRead") && row["IsRead"] != DBNull.Value && (bool)row["IsRead"],
                CreatedAt = row.Table.Columns.Contains("CreatedAt") && row["CreatedAt"] != DBNull.Value ? (DateTime)row["CreatedAt"] : DateTime.MinValue,
            };
        }
    }
}
