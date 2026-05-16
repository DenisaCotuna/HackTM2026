using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class UserBLL
    {
        // Fields matching the Users table
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public int NationalityID { get; set; }
        public int GenderID { get; set; }
        public string Role { get; set; }
        public string ProfilePhoto { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

        // -------------------------------------------------------
        // Helper: fills a UserBLL from a DataRow
        // -------------------------------------------------------
        private static UserBLL MapFromRow(DataRow row)
        {
            return new UserBLL
            {
                UserID       = (int)row["UserID"],
                FullName     = row["FullName"].ToString(),
                Email        = row["Email"].ToString(),
                PasswordHash = row["PasswordHash"].ToString(),
                PhoneNumber  = row["PhoneNumber"] == DBNull.Value ? null : row["PhoneNumber"].ToString(),
                NationalityID= (int)row["NationalityID"],
                GenderID     = (int)row["GenderID"],
                Role         = row["Role"].ToString(),
                ProfilePhoto = row["ProfilePhoto"] == DBNull.Value ? null : row["ProfilePhoto"].ToString(),
                CreatedAt    = (DateTime)row["CreatedAt"],
                IsActive     = (bool)row["IsActive"]
            };
        }

        // -------------------------------------------------------
        // Methods
        // -------------------------------------------------------

        // Returns all users as a list
        public static List<UserBLL> GetAllUsers()
        {
            DataTable dt = UserDAL.GetAllUsers();
            List<UserBLL> users = new List<UserBLL>();
            foreach (DataRow row in dt.Rows)
                users.Add(MapFromRow(row));
            return users;
        }

        // Returns a single user by ID, or null if not found
        public static UserBLL GetByID(int userID)
        {
            DataTable dt = UserDAL.GetUserByID(userID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        // Returns a single user by Email, or null if not found (used for login)
        public static UserBLL GetByEmail(string email)
        {
            DataTable dt = UserDAL.GetUserByEmail(email);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        // Inserts a new user, returns the new UserID
        public static int Insert(string fullName, string email, string passwordHash,
            string phoneNumber, int nationalityID, int genderID, string role, string profilePhoto)
        {
            return UserDAL.InsertUser(fullName, email, passwordHash, phoneNumber,
                nationalityID, genderID, role, profilePhoto);
        }

        // Updates an existing user, returns rows affected
        public static int Update(int userID, string fullName, string phoneNumber,
            int nationalityID, int genderID, string profilePhoto)
        {
            return UserDAL.UpdateUser(userID, fullName, phoneNumber, nationalityID, genderID, profilePhoto);
        }

        // Deactivates a user (soft delete), returns rows affected
        public static int Deactivate(int userID)
        {
            return UserDAL.DeactivateUser(userID);
        }

        // Updates password, returns rows affected
        public static int UpdatePassword(int userID, string newPasswordHash)
        {
            return UserDAL.UpdatePassword(userID, newPasswordHash);
        }
    }
}
