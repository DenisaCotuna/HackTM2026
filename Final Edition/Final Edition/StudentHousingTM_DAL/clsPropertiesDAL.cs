using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM.DAL
{
    /// <summary>
    /// DAL for Properties and related lookup tables.
    /// Covers: usp_CreateProperty | usp_GetPropertyStatuses | usp_GetPropertyTypes
    /// </summary>
    public static class clsPropertiesDAL
    {
        // ─────────────────────────────────────────────────────────────────────
        // usp_CreateProperty
        //   Behaviour  : Validates inputs and FK references, inserts a new
        //                Property row inside a transaction.
        //   OUTPUT     : @NewPropertyID INT
        //   Result set : SELECT @NewPropertyID AS NewPropertyID
        //   RETURN     : 0 on success; THROW on any validation / FK error
        //
        //   C# return  : DataTable (confirmation row) + ref newPropertyID
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable CreateProperty(
            int      ownerProfileID,
            string   title,
            int      propertyTypeID,
            string   address,
            string   areaZone,
            decimal  pricePerMonth,
            bool     utilitiesIncluded,
            bool     furnished,
            bool     insuranceRequired,
            int      maxTenants,
            DateTime availableFrom,
            DateTime? availableUntil,           // NULL = open-ended
            int      preferredGenderID,         // 1 | 2 | 3 (no preference)
            bool     acceptsInternational,
            bool     smokersAllowed,
            bool     petsAllowed,
            string?  description,
            ref int  newPropertyID)
        {
            DataTable dt = new DataTable();
            newPropertyID = -1;

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_CreateProperty", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@OwnerProfileID",       SqlDbType.Int).Value = ownerProfileID;
                command.Parameters.Add("@Title",                SqlDbType.NVarChar, 300).Value = title;
                command.Parameters.Add("@PropertyTypeID",       SqlDbType.Int).Value = propertyTypeID;
                command.Parameters.Add("@Address",              SqlDbType.NVarChar, 500).Value = address;
                command.Parameters.Add("@AreaZone",             SqlDbType.NVarChar, 150).Value = areaZone;

                SqlParameter priceParam = command.Parameters.Add("@PricePerMonth", SqlDbType.Decimal);
                priceParam.Precision = 10;
                priceParam.Scale     = 2;
                priceParam.Value     = pricePerMonth;

                command.Parameters.Add("@UtilitiesIncluded",    SqlDbType.Bit).Value = utilitiesIncluded;
                command.Parameters.Add("@Furnished",            SqlDbType.Bit).Value = furnished;
                command.Parameters.Add("@InsuranceRequired",    SqlDbType.Bit).Value = insuranceRequired;
                command.Parameters.Add("@MaxTenants",           SqlDbType.Int).Value = maxTenants;
                command.Parameters.Add("@AvailableFrom",        SqlDbType.Date).Value = availableFrom;
                command.Parameters.Add("@AvailableUntil",       SqlDbType.Date).Value = (object?)availableUntil ?? DBNull.Value;
                command.Parameters.Add("@PreferredGenderID",    SqlDbType.Int).Value = preferredGenderID;
                command.Parameters.Add("@AcceptsInternational", SqlDbType.Bit).Value = acceptsInternational;
                command.Parameters.Add("@SmokersAllowed",       SqlDbType.Bit).Value = smokersAllowed;
                command.Parameters.Add("@PetsAllowed",          SqlDbType.Bit).Value = petsAllowed;
                command.Parameters.Add("@Description",          SqlDbType.NVarChar, -1).Value = (object?)description ?? DBNull.Value;

                // ── OUTPUT param ──────────────────────────────────────
                SqlParameter outPropertyID = new SqlParameter("@NewPropertyID", SqlDbType.Int)
                    { Direction = ParameterDirection.Output };
                command.Parameters.Add(outPropertyID);

                try
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        dt.Load(reader);
                    }
                    newPropertyID = (int)command.Parameters["@NewPropertyID"].Value;
                }
                catch { }
            }

            return dt;
        }

        // ─────────────────────────────────────────────────────────────────────
        // usp_GetPropertyStatuses
        //   Result set : StatusID, Status (all rows from PropertyStatuses)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetPropertyStatuses()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetPropertyStatuses", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

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
        // usp_GetPropertyTypes
        //   Result set : PropertyTypeID, PropertyType (all rows from PropertyTypes)
        //
        //   C# return  : DataTable
        // ─────────────────────────────────────────────────────────────────────
        public static DataTable GetPropertyTypes()
        {
            DataTable dt = new DataTable();

            using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (SqlCommand command = new SqlCommand("usp_GetPropertyTypes", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

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
