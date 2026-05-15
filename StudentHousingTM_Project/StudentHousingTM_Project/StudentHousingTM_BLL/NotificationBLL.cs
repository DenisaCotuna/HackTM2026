using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class NotificationBLL
    {
        // Fields matching the Notifications table
        public int NotificationID { get; set; }
        public int UserID { get; set; }
        public int NotificationTypeID { get; set; }
        public int ReferenceTypeID { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        private static NotificationBLL MapFromRow(DataRow row)
        {
            return new NotificationBLL
            {
                NotificationID     = (int)row["NotificationID"],
                UserID             = (int)row["UserID"],
                NotificationTypeID = (int)row["NotificatonTypeID"], // note: typo in DB column name
                ReferenceTypeID    = (int)row["ReferenceTypeID"],
                Message            = row["Message"].ToString(),
                IsRead             = (bool)row["IsRead"],
                CreatedAt          = (DateTime)row["CreatedAt"]
            };
        }

        public static List<NotificationBLL> GetByUser(int userID)
        {
            DataTable dt = NotificationDAL.GetNotificationsByUser(userID);
            List<NotificationBLL> list = new List<NotificationBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static int GetUnreadCount(int userID)
        {
            return NotificationDAL.GetUnreadNotificationCount(userID);
        }

        public static int Insert(int userID, int notificationTypeID, int referenceTypeID, string message)
        {
            return NotificationDAL.InsertNotification(userID, notificationTypeID, referenceTypeID, message);
        }

        public static int MarkAsRead(int notificationID)
        {
            return NotificationDAL.MarkNotificationAsRead(notificationID);
        }

        public static int MarkAllAsRead(int userID)
        {
            return NotificationDAL.MarkAllNotificationsAsRead(userID);
        }
    }
}
