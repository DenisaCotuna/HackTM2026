using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class StudentProfileBLL
    {
        // Fields matching the StudentProfiles table
        public int StudentProfileID { get; set; }
        public int UserID { get; set; }
        public string University { get; set; }
        public string FieldOfStudy { get; set; }
        public int YearOfStudyID { get; set; }
        public bool IsSmoker { get; set; }
        public bool HasPets { get; set; }

        private static StudentProfileBLL MapFromRow(DataRow row)
        {
            return new StudentProfileBLL
            {
                StudentProfileID = (int)row["StudentProfileID"],
                UserID           = (int)row["UserID"],
                University       = row["University"].ToString(),
                FieldOfStudy     = row["FieldOfStudy"].ToString(),
                YearOfStudyID    = (int)row["YearOfStudyID"],
                IsSmoker         = (bool)row["IsSmoker"],
                HasPets          = (bool)row["HasPets"]
            };
        }

        public static StudentProfileBLL GetByUserID(int userID)
        {
            DataTable dt = StudentProfileDAL.GetStudentProfileByUserID(userID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static StudentProfileBLL GetByID(int studentProfileID)
        {
            DataTable dt = StudentProfileDAL.GetStudentProfileByID(studentProfileID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int userID, string university, string fieldOfStudy,
            int yearOfStudyID, bool isSmoker, bool hasPets)
        {
            return StudentProfileDAL.InsertStudentProfile(userID, university, fieldOfStudy,
                yearOfStudyID, isSmoker, hasPets);
        }

        public static int Update(int studentProfileID, string university, string fieldOfStudy,
            int yearOfStudyID, bool isSmoker, bool hasPets)
        {
            return StudentProfileDAL.UpdateStudentProfile(studentProfileID, university,
                fieldOfStudy, yearOfStudyID, isSmoker, hasPets);
        }
    }
}
