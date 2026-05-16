using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class NotificationDAL
    {
        // Returns all notifications for a user
        public static DataTable GetNotificationsByUser(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteQuery("usp_GetNotificationsByUser", parameters);
        }

        // Returns unread notifications count for a user
        public static int GetUnreadNotificationCount(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            object result = DBHelper.ExecuteScalar("usp_GetUnreadNotificationCount", parameters);
            return result != null ? (int)result : 0;
        }

        // Inserts a new notification, returns new NotificationID
        public static int InsertNotification(int userID, int notificationTypeID,
            int referenceTypeID, string message)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID",             userID),
                new SqlParameter("@NotificationTypeID", notificationTypeID),
                new SqlParameter("@ReferenceTypeID",    referenceTypeID),
                new SqlParameter("@Message",            message)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertNotification", parameters);
            return result != null ? (int)result : 0;
        }

        // Marks a single notification as read
        public static int MarkNotificationAsRead(int notificationID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@NotificationID", notificationID)
            };
            return DBHelper.ExecuteNonQuery("usp_MarkNotificationAsRead", parameters);
        }

        // Marks all notifications for a user as read
        public static int MarkAllNotificationsAsRead(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteNonQuery("usp_MarkAllNotificationsAsRead", parameters);
        }
    }
}
