using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class OwnerProfileDAL
    {
        // Returns owner profile by UserID
        public static DataTable GetOwnerProfileByUserID(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteQuery("usp_GetOwnerProfileByUserID", parameters);
        }

        // Returns owner profile by OwnerProfileID
        public static DataTable GetOwnerProfileByID(int ownerProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID", ownerProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetOwnerProfileByID", parameters);
        }

        // Inserts a new owner profile, returns new OwnerProfileID
        public static int InsertOwnerProfile(int userID, int numberOfProperties,
            bool requiresInsurance, bool acceptsInternational, int preferredTenantGenderID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID",                  userID),
                new SqlParameter("@NumberOfProperties",      numberOfProperties),
                new SqlParameter("@RequiresInsurance",       requiresInsurance),
                new SqlParameter("@AcceptsInternational",    acceptsInternational),
                new SqlParameter("@PreferredTenantGenderID", preferredTenantGenderID)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertOwnerProfile", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates an existing owner profile
        public static int UpdateOwnerProfile(int ownerProfileID, bool requiresInsurance,
            bool acceptsInternational, int preferredTenantGenderID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID",          ownerProfileID),
                new SqlParameter("@RequiresInsurance",       requiresInsurance),
                new SqlParameter("@AcceptsInternational",    acceptsInternational),
                new SqlParameter("@PreferredTenantGenderID", preferredTenantGenderID)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateOwnerProfile", parameters);
        }
    }
}
