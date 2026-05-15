using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class UserDAL
    {
        // Returns all users
        public static DataTable GetAllUsers()
        {
            return DBHelper.ExecuteQuery("usp_GetAllUsers");
        }

        // Returns a single user by UserID
        public static DataTable GetUserByID(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteQuery("usp_GetUserByID", parameters);
        }

        // Returns a single user by Email (used for login)
        public static DataTable GetUserByEmail(string email)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@Email", email)
            };
            return DBHelper.ExecuteQuery("usp_GetUserByEmail", parameters);
        }

        // Inserts a new user, returns the new UserID
        public static int InsertUser(string fullName, string email, string passwordHash,
            string phoneNumber, int nationalityID, int genderID, string role, string profilePhoto)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@FullName",     fullName),
                new SqlParameter("@Email",        email),
                new SqlParameter("@PasswordHash", passwordHash),
                new SqlParameter("@PhoneNumber",  phoneNumber),
                new SqlParameter("@NationalityID",nationalityID),
                new SqlParameter("@GenderID",     genderID),
                new SqlParameter("@Role",         role),
                new SqlParameter("@ProfilePhoto", profilePhoto)
            };
            object result = DBHelper.ExecuteScalar("usp_RegisterUser", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates an existing user
        public static int UpdateUser(int userID, string fullName, string phoneNumber,
            int nationalityID, int genderID, string profilePhoto)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID",       userID),
                new SqlParameter("@FullName",     fullName),
                new SqlParameter("@PhoneNumber",  phoneNumber),
                new SqlParameter("@NationalityID",nationalityID),
                new SqlParameter("@GenderID",     genderID),
                new SqlParameter("@ProfilePhoto", profilePhoto)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateUser", parameters);
        }

        // Deactivates a user (soft delete)
        public static int DeactivateUser(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeactivateUser", parameters);
        }

        // Updates password hash
        public static int UpdatePassword(int userID, string newPasswordHash)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID",          userID),
                new SqlParameter("@NewPasswordHash", newPasswordHash)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateUserPassword", parameters);
        }
    }
}
