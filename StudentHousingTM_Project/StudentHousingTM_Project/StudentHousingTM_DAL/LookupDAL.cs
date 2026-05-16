using System.Data;

namespace StudentHousingTM_DAL
{
    public static class LookupDAL
    {
        public static DataTable GetGenders()
        {
            return DBHelper.ExecuteQuery("usp_GetGenders");
        }

        public static DataTable GetCountries()
        {
            return DBHelper.ExecuteQuery("usp_GetCountries");
        }

        public static DataTable GetStudyYears()
        {
            return DBHelper.ExecuteQuery("usp_GetStudyYears");
        }

        public static DataTable GetPropertyTypes()
        {
            return DBHelper.ExecuteQuery("usp_GetPropertyTypes");
        }

        public static DataTable GetPropertyStatuses()
        {
            return DBHelper.ExecuteQuery("usp_GetPropertyStatuses");
        }

        public static DataTable GetMatchStatuses()
        {
            return DBHelper.ExecuteQuery("usp_GetMatchStatuses");
        }

        public static DataTable GetVisitStatuses()
        {
            return DBHelper.ExecuteQuery("usp_GetVisitStatuses");
        }

        public static DataTable GetAppointmentStatuses()
        {
            return DBHelper.ExecuteQuery("usp_GetAppointmentStatuses");
        }

        public static DataTable GetNotificationTypes()
        {
            return DBHelper.ExecuteQuery("usp_GetNotificationTypes");
        }

        public static DataTable GetNotificationReferenceTypes()
        {
            return DBHelper.ExecuteQuery("usp_GetNotificationReferenceTypes");
        }
    }
}
