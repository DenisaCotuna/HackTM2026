using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class StudentRequestDAL
    {
        // Returns all requests for a student
        public static DataTable GetRequestsByStudent(int studentProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID", studentProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetRequestsByStudent", parameters);
        }

        // Returns a single request by RequestID
        public static DataTable GetRequestByID(int requestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID", requestID)
            };
            return DBHelper.ExecuteQuery("usp_GetRequestByID", parameters);
        }

        // Inserts a new student request, returns new RequestID
        public static int InsertStudentRequest(int studentProfileID, string title,
            decimal budgetMin, decimal budgetMax, DateTime moveInDate, DateTime? moveOutDate,
            int propertyTypePreferredID, bool? furnishedRequired, bool utilitiesRequired,
            bool petsAllowed, bool smokersAllowed, string additionalNotes)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@StudentProfileID",       studentProfileID),
                new SqlParameter("@Title",                  title),
                new SqlParameter("@BudgetMin",              budgetMin),
                new SqlParameter("@BudgetMax",              budgetMax),
                new SqlParameter("@MoveInDate",             moveInDate),
                new SqlParameter("@MoveOutDate",            (object)moveOutDate ?? DBNull.Value),
                new SqlParameter("@PropertyTypePreferredID",propertyTypePreferredID),
                new SqlParameter("@FurnishedRequired",      (object)furnishedRequired ?? DBNull.Value),
                new SqlParameter("@UtilitiesRequired",      utilitiesRequired),
                new SqlParameter("@PetsAllowed",            petsAllowed),
                new SqlParameter("@SmokersAllowed",         smokersAllowed),
                new SqlParameter("@AdditionalNotes",        (object)additionalNotes ?? DBNull.Value),
                new SqlParameter("@NewRequestID", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };
            object result = DBHelper.ExecuteScalar("usp_CreateStudentRequest", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates an existing request
        public static int UpdateStudentRequest(int requestID, string title,
            decimal budgetMin, decimal budgetMax, DateTime moveInDate, DateTime? moveOutDate,
            int propertyTypePreferredID, bool? furnishedRequired, bool utilitiesRequired,
            bool petsAllowed, bool smokersAllowed, string additionalNotes, int statusID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID",              requestID),
                new SqlParameter("@Title",                  title),
                new SqlParameter("@BudgetMin",              budgetMin),
                new SqlParameter("@BudgetMax",              budgetMax),
                new SqlParameter("@MoveInDate",             moveInDate),
                new SqlParameter("@MoveOutDate",            (object)moveOutDate ?? DBNull.Value),
                new SqlParameter("@PropertyTypePreferredID",propertyTypePreferredID),
                new SqlParameter("@FurnishedRequired",      (object)furnishedRequired ?? DBNull.Value),
                new SqlParameter("@UtilitiesRequired",      utilitiesRequired),
                new SqlParameter("@PetsAllowed",            petsAllowed),
                new SqlParameter("@SmokersAllowed",         smokersAllowed),
                new SqlParameter("@AdditionalNotes",        (object)additionalNotes ?? DBNull.Value),
                new SqlParameter("@StatusID",               statusID)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateStudentRequest", parameters);
        }

        // Deletes a request
        public static int DeleteStudentRequest(int requestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID", requestID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeleteStudentRequest", parameters);
        }

        // Returns preferred areas for a request
        public static DataTable GetPreferredAreasByRequest(int requestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID", requestID)
            };
            return DBHelper.ExecuteQuery("usp_GetPreferredAreasByRequest", parameters);
        }

        // Inserts a preferred area for a request
        public static int InsertPreferredArea(int requestID, string areaName)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID", requestID),
                new SqlParameter("@AreaName",  areaName)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertPreferredArea", parameters);
            return result != null ? (int)result : 0;
        }

        // Deletes all preferred areas for a request (used when updating)
        public static int DeletePreferredAreasByRequest(int requestID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@RequestID", requestID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeletePreferredAreasByRequest", parameters);
        }
    }
}
