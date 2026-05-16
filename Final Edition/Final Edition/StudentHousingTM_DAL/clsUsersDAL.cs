using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Users, StudentProfiles, and OwnerProfiles.
    /// Covers: usp_RegisterUser | usp_GetUserByEmail | usp_GetStudentByUserID
    /// </summary>
    public static class clsUsersDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_RegisterUser
        //   Behaviour  : Validates inputs, inserts into Users + StudentProfiles
        //                or OwnerProfiles inside a single transaction.
        //   OUTPUT     : @NewUserID INT, @NewProfileID INT
        //   Result set : SELECT NewUserID, NewProfileID
        //   RETURN     : 0 on success; THROW on any error
        //
        //   C# return  : DataTable (confirmation row) + two ref ints
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable RegisterUser(
            string fullName,
            string email,
            string passwordHash,
            string? phoneNumber,
            int nationalityID,
            int genderID,
            string role,                        // 'Student' | 'Owner'
            string? profilePhoto,
            // ── Student-only ──────────────────────────────────────────
            string? university,
            string? fieldOfStudy,
            int?    yearOfStudyID,
            bool    isSmoker,
            bool    hasPets,
            // ── Owner-only ────────────────────────────────────────────
            int  numberOfProperties,
            bool requiresInsurance,
            bool acceptsInternational,
            int  preferredTenantGenderID,
            // ── Output params ─────────────────────────────────────────
            ref int newUserID,
            ref int newProfileID)
        {
            DataTable dt = new DataTable();
            newUserID   = -1;
            newProfileID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_RegisterUser", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                // ── Shared params ─────────────────────────────────────
                command.Parameters.Add("@FullName",     SqlDbType.NVarChar, 150).Value = fullName;
                command.Parameters.Add("@Email",        SqlDbType.NVarChar, 255).Value = email;
                command.Parameters.Add("@PasswordHash", SqlDbType.NVarChar, 512).Value = passwordHash;
                command.Parameters.Add("@PhoneNumber",  SqlDbType.NVarChar,  30).Value = (object?)phoneNumber ?? DBNull.Value;
                command.Parameters.Add("@NationalityID",SqlDbType.Int).Value = nationalityID;
                command.Parameters.Add("@GenderID",     SqlDbType.Int).Value = genderID;
                command.Parameters.Add("@Role",         SqlDbType.NVarChar,  10).Value = role;
                command.Parameters.Add("@ProfilePhoto", SqlDbType.NVarChar, 500).Value = (object?)profilePhoto ?? DBNull.Value;

                // ── Student-only params ───────────────────────────────
                command.Parameters.Add("@University",    SqlDbType.NVarChar, 200).Value = (object?)university    ?? DBNull.Value;
                command.Parameters.Add("@FieldOfStudy",  SqlDbType.NVarChar, 200).Value = (object?)fieldOfStudy  ?? DBNull.Value;
                command.Parameters.Add("@YearOfStudyID", SqlDbType.Int).Value           = (object?)yearOfStudyID  ?? DBNull.Value;
                command.Parameters.Add("@IsSmoker",      SqlDbType.Bit).Value = isSmoker;
                command.Parameters.Add("@HasPets",       SqlDbType.Bit).Value = hasPets;

                // ── Owner-only params ─────────────────────────────────
                command.Parameters.Add("@NumberOfProperties",      SqlDbType.Int).Value = numberOfProperties;
                command.Parameters.Add("@RequiresInsurance",       SqlDbType.Bit).Value = requiresInsurance;
                command.Parameters.Add("@AcceptsInternational",    SqlDbType.Bit).Value = acceptsInternational;
                command.Parameters.Add("@PreferredTenantGenderID", SqlDbType.Int).Value = preferredTenantGenderID;

                // ── OUTPUT params ─────────────────────────────────────
                SqlParameter outUserID = new SqlParameter("@NewUserID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outUserID);

                SqlParameter outProfileID = new SqlParameter("@NewProfileID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outProfileID);

                try
                {
                    connection.Open();

                    // ExecuteReader so we can load the confirmation row AND
                    // still read OUTPUT params once the reader is disposed.
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        dt.Load(reader);
                    }

                    newUserID    = (int)command.Parameters["@NewUserID"].Value;
                    newProfileID = (int)command.Parameters["@NewProfileID"].Value;
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetUserByEmail
        //   Behaviour  : Validates email format, resolves role, returns the
        //                full user row joined with StudentProfiles or
        //                OwnerProfiles depending on the role.
        //   Result set : One row with user + profile columns
        //   RETURN     : 0 on success; THROW on any error
        //
        //   C# return  : DataTable (one row, column set depends on role)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetUserByEmail(string email)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetUserByEmail", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@Email", SqlDbType.NVarChar, 255).Value = email;

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
        // usp_GetStudentByUserID
        //   Behaviour  : Returns user + student profile row for the given UserID.
        //   Result set : One row (Users ⨝ StudentProfiles ⨝ Countries ⨝ Genders ⨝ StudyYears)
        //
        //   C# return  : DataTable (one row or empty if not found)
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetStudentByUserID(int userID)
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetStudentByUserID", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@UserID", SqlDbType.Int).Value = userID;

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
