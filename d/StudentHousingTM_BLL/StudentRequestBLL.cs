using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class StudentRequestBLL
    {
        // Fields matching the StudentRequests table
        public int RequestID { get; set; }
        public int StudentProfileID { get; set; }
        public string Title { get; set; }
        public decimal BudgetMin { get; set; }
        public decimal BudgetMax { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }
        public int PropertyTypePreferredID { get; set; }
        public bool? FurnishedRequired { get; set; }
        public bool UtilitiesRequired { get; set; }
        public bool PetsAllowed { get; set; }
        public bool SmokersAllowed { get; set; }
        public string AdditionalNotes { get; set; }
        public int StatusID { get; set; }
        public DateTime CreatedAt { get; set; }

        public string PreferedAreas{ get; set; }

        private static StudentRequestBLL MapFromRow(DataRow row)
        {
            return new StudentRequestBLL
            {
                RequestID               = (int)row["RequestID"],
                StudentProfileID        = (int)row["StudentProfileID"],
                Title                   = row["Title"].ToString(),
                BudgetMin               = (decimal)row["BudgetMin"],
                BudgetMax               = (decimal)row["BudgetMax"],
                MoveInDate              = (DateTime)row["MoveInDate"],
                MoveOutDate             = row["MoveOutDate"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MoveOutDate"],
                PropertyTypePreferredID = (int)row["PropertyTypePreferredID"],
                FurnishedRequired       = row["FurnishedRequired"] == DBNull.Value ? (bool?)null : (bool)row["FurnishedRequired"],
                UtilitiesRequired       = (bool)row["UtilitiesRequired"],
                PetsAllowed             = (bool)row["PetsAllowed"],
                SmokersAllowed          = (bool)row["SmokersAllowed"],
                AdditionalNotes         = row["AdditionalNotes"] == DBNull.Value ? null : row["AdditionalNotes"].ToString(),
                StatusID                = (int)row["StatusID"],
                CreatedAt               = (DateTime)row["CreatedAt"],
                 PreferedAreas = row["PreferedAreas"] == DBNull.Value ? null : row["PreferedAreas"].ToString(),
            };
        }

        public static List<StudentRequestBLL> GetByStudent(int studentProfileID)
        {
            DataTable dt = StudentRequestDAL.GetRequestsByStudent(studentProfileID);
            List<StudentRequestBLL> list = new List<StudentRequestBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static StudentRequestBLL GetByID(int requestID)
        {
            DataTable dt = StudentRequestDAL.GetRequestByID(requestID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int studentProfileID, string title, decimal budgetMin,
            decimal budgetMax, DateTime moveInDate, DateTime? moveOutDate,
            int propertyTypePreferredID, bool? furnishedRequired, bool utilitiesRequired,
            bool petsAllowed, bool smokersAllowed, string additionalNotes)
        {
            return StudentRequestDAL.InsertStudentRequest(studentProfileID, title, budgetMin,
                budgetMax, moveInDate, moveOutDate, propertyTypePreferredID, furnishedRequired,
                utilitiesRequired, petsAllowed, smokersAllowed, additionalNotes);
        }

        public static int Update(int requestID, string title, decimal budgetMin, decimal budgetMax,
            DateTime moveInDate, DateTime? moveOutDate, int propertyTypePreferredID,
            bool? furnishedRequired, bool utilitiesRequired, bool petsAllowed,
            bool smokersAllowed, string additionalNotes, int statusID)
        {
            return StudentRequestDAL.UpdateStudentRequest(requestID, title, budgetMin, budgetMax,
                moveInDate, moveOutDate, propertyTypePreferredID, furnishedRequired,
                utilitiesRequired, petsAllowed, smokersAllowed, additionalNotes, statusID);
        }

        public static int Delete(int requestID)
        {
            return StudentRequestDAL.DeleteStudentRequest(requestID);
        }
    }
}
