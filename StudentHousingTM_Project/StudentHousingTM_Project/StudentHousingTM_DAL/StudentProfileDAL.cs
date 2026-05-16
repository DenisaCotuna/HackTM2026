using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class StudentProfileDAL
    {
        // Returns student profile by UserID
        public static DataTable GetStudentProfileByUserID(int userID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID", userID)
            };
            return DBHelper.ExecuteQuery("usp_GetStudentProfileByUserID", parameters);
        }

        // Returns student profile by StudentProfileID
        public static DataTable GetStudentProfileByID(int studentProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID", studentProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetStudentProfileByID", parameters);
        }

        // Inserts a new student profile, returns new StudentProfileID
        public static int InsertStudentProfile(int userID, string university,
            string fieldOfStudy, int yearOfStudyID, bool isSmoker, bool hasPets)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@UserID",        userID),
                new SqlParameter("@University",    university),
                new SqlParameter("@FieldOfStudy",  fieldOfStudy),
                new SqlParameter("@YearOfStudyID", yearOfStudyID),
                new SqlParameter("@IsSmoker",      isSmoker),
                new SqlParameter("@HasPets",       hasPets)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertStudentProfile", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates an existing student profile
        public static int UpdateStudentProfile(int studentProfileID, string university,
            string fieldOfStudy, int yearOfStudyID, bool isSmoker, bool hasPets)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID", studentProfileID),
                new SqlParameter("@University",       university),
                new SqlParameter("@FieldOfStudy",     fieldOfStudy),
                new SqlParameter("@YearOfStudyID",    yearOfStudyID),
                new SqlParameter("@IsSmoker",         isSmoker),
                new SqlParameter("@HasPets",          hasPets)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateStudentProfile", parameters);
        }
    }
}
