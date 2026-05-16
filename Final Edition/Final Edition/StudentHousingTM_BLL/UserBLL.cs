using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsUser
    {
        // ── Shared User fields ────────────────────────────────────────────────
        public int UserID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public int? NationalityID { get; set; }
        public string? Nationality { get; set; }   // joined from Countries
        public int? GenderID { get; set; }
        public string? Gender { get; set; }   // joined from Genders
        public string Role { get; set; } = string.Empty;   // "Student" | "Owner"
        public string? ProfilePhoto { get; set; }
        public DateTime CreatedAt { get; set; }

        // ── Student-only fields ───────────────────────────────────────────────
        public int? StudentProfileID { get; set; }
        public string? University { get; set; }
        public string? FieldOfStudy { get; set; }
        public int? YearOfStudyID { get; set; }
        public string? YearOfStudy { get; set; }   // joined from StudyYears ("1st", "2nd", …)
        public bool? IsSmoker { get; set; }
        public bool? HasPets { get; set; }

        // ── Owner-only fields ─────────────────────────────────────────────────
        public int? OwnerProfileID { get; set; }
        public int? NumberOfProperties { get; set; }
        public bool? RequiresInsurance { get; set; }
        public bool? AcceptsInternational { get; set; }
        public int? PreferredTenantGenderID { get; set; }
        public string? PreferredTenantGender { get; set; }   // joined from Genders

        // ── RegisterUser ──────────────────────────────────────────────────────
        /// <summary>
        /// Registers a new user (Student or Owner) with a profile.
        /// Returns the confirmation clsUser on success, null on failure.
        /// newUserID and newProfileID are set on success (or -1 on failure).
        /// </summary>
        public static clsUser? Register(
            string fullName,
            string email,
            string passwordHash,
            string? phoneNumber,
            int nationalityID,
            int genderID,
            string role,
            string? profilePhoto,
            // Student-only
            string? university,
            string? fieldOfStudy,
            int? yearOfStudyID,
            bool isSmoker,
            bool hasPets,
            // Owner-only
            int numberOfProperties,
            bool requiresInsurance,
            bool acceptsInternational,
            int preferredTenantGenderID,
            // Out params
            ref int newUserID,
            ref int newProfileID)
        {
            newUserID = -1;
            newProfileID = -1;

            DataTable dt = clsUsersDAL.RegisterUser(
                fullName, email, passwordHash, phoneNumber, nationalityID, genderID, role,
                profilePhoto, university, fieldOfStudy, yearOfStudyID, isSmoker, hasPets,
                numberOfProperties, requiresInsurance, acceptsInternational,
                preferredTenantGenderID, ref newUserID, ref newProfileID);

            if (dt.Rows.Count == 0 || newUserID == -1)
                return null;

            // The confirmation row only contains NewUserID / NewProfileID –
            // populate just those fields; a full Find() call is needed for the rest.
            return new clsUser
            {
                UserID = newUserID,
                Role = role,
                FullName = fullName,
                Email = email,
                StudentProfileID = role == "Student" ? newProfileID : null,
                OwnerProfileID = role == "Owner" ? newProfileID : null,
            };
        }

        // ── FindByEmail ───────────────────────────────────────────────────────
        /// <summary>
        /// Returns the full user + profile row for the given email (used for login).
        /// Column set varies by role. Returns null if not found or on error.
        /// </summary>
        public static clsUser? FindByEmail(string email)
        {
            DataTable dt = clsUsersDAL.GetUserByEmail(email);
            if (dt.Rows.Count == 0) return null;
            return MapRow(dt.Rows[0]);
        }

        // ── FindStudentByUserID ───────────────────────────────────────────────
        /// <summary>
        /// Returns the full Users ⨝ StudentProfiles row for the given UserID.
        /// Returns null if not found or on error.
        /// </summary>
        public static clsUser? FindStudentByUserID(int userID)
        {
            DataTable dt = clsUsersDAL.GetStudentByUserID(userID);
            if (dt.Rows.Count == 0) return null;
            return MapRow(dt.Rows[0]);
        }

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsUser MapRow(DataRow row)
        {
            return new clsUser
            {
                // ── Shared ──────────────────────────────────────────────────────
                UserID = row.Table.Columns.Contains("UserID") && row["UserID"] != DBNull.Value ? (int)row["UserID"] : 0,
                FullName = row.Table.Columns.Contains("FullName") && row["FullName"] != DBNull.Value ? row["FullName"].ToString()! : string.Empty,
                Email = row.Table.Columns.Contains("Email") && row["Email"] != DBNull.Value ? row["Email"].ToString()! : string.Empty,
                PasswordHash = row.Table.Columns.Contains("PasswordHash") && row["PasswordHash"] != DBNull.Value ? row["PasswordHash"].ToString()! : string.Empty,
                PhoneNumber = row.Table.Columns.Contains("PhoneNumber") && row["PhoneNumber"] != DBNull.Value ? row["PhoneNumber"].ToString() : null,
                NationalityID = row.Table.Columns.Contains("NationalityID") && row["NationalityID"] != DBNull.Value ? (int?)row["NationalityID"] : null,
                Nationality = row.Table.Columns.Contains("Nationality") && row["Nationality"] != DBNull.Value ? row["Nationality"].ToString() : null,
                GenderID = row.Table.Columns.Contains("GenderID") && row["GenderID"] != DBNull.Value ? (int?)row["GenderID"] : null,
                Gender = row.Table.Columns.Contains("Gender") && row["Gender"] != DBNull.Value ? row["Gender"].ToString() : null,
                Role = row.Table.Columns.Contains("Role") && row["Role"] != DBNull.Value ? row["Role"].ToString()! : string.Empty,
                ProfilePhoto = row.Table.Columns.Contains("ProfilePhoto") && row["ProfilePhoto"] != DBNull.Value ? row["ProfilePhoto"].ToString() : null,
                CreatedAt = row.Table.Columns.Contains("CreatedAt") && row["CreatedAt"] != DBNull.Value ? (DateTime)row["CreatedAt"] : DateTime.MinValue,

                // ── Student-only ─────────────────────────────────────────────
                StudentProfileID = row.Table.Columns.Contains("StudentProfileID") && row["StudentProfileID"] != DBNull.Value ? (int?)row["StudentProfileID"] : null,
                University = row.Table.Columns.Contains("University") && row["University"] != DBNull.Value ? row["University"].ToString() : null,
                FieldOfStudy = row.Table.Columns.Contains("FieldOfStudy") && row["FieldOfStudy"] != DBNull.Value ? row["FieldOfStudy"].ToString() : null,
                YearOfStudyID = row.Table.Columns.Contains("YearOfStudyID") && row["YearOfStudyID"] != DBNull.Value ? (int?)row["YearOfStudyID"] : null,
                YearOfStudy = row.Table.Columns.Contains("YearOfStudy") && row["YearOfStudy"] != DBNull.Value ? row["YearOfStudy"].ToString() : null,
                IsSmoker = row.Table.Columns.Contains("IsSmoker") && row["IsSmoker"] != DBNull.Value ? (bool?)row["IsSmoker"] : null,
                HasPets = row.Table.Columns.Contains("HasPets") && row["HasPets"] != DBNull.Value ? (bool?)row["HasPets"] : null,

                // ── Owner-only ───────────────────────────────────────────────
                OwnerProfileID = row.Table.Columns.Contains("OwnerProfileID") && row["OwnerProfileID"] != DBNull.Value ? (int?)row["OwnerProfileID"] : null,
                NumberOfProperties = row.Table.Columns.Contains("NumberOfProperties") && row["NumberOfProperties"] != DBNull.Value ? (int?)row["NumberOfProperties"] : null,
                RequiresInsurance = row.Table.Columns.Contains("RequiresInsurance") && row["RequiresInsurance"] != DBNull.Value ? (bool?)row["RequiresInsurance"] : null,
                AcceptsInternational = row.Table.Columns.Contains("AcceptsInternational") && row["AcceptsInternational"] != DBNull.Value ? (bool?)row["AcceptsInternational"] : null,
                PreferredTenantGenderID = row.Table.Columns.Contains("PreferredTenantGenderID") && row["PreferredTenantGenderID"] != DBNull.Value ? (int?)row["PreferredTenantGenderID"] : null,
                PreferredTenantGender = row.Table.Columns.Contains("PreferredTenantGender") && row["PreferredTenantGender"] != DBNull.Value ? row["PreferredTenantGender"].ToString() : null,
            };
        }
    }
}
