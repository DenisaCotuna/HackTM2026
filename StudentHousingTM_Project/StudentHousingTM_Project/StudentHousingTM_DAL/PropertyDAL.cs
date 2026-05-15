using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentHousingTM_DAL
{
    public static class PropertyDAL
    {
        // Returns all active properties
        public static DataTable GetAllProperties()
        {
            return DBHelper.ExecuteQuery("usp_GetAllProperties");
        }

        // Returns a single property by PropertyID
        public static DataTable GetPropertyByID(int propertyID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PropertyID", propertyID)
            };
            return DBHelper.ExecuteQuery("usp_GetPropertyByID", parameters);
        }

        // Returns all properties owned by a specific owner
        public static DataTable GetPropertiesByOwner(int ownerProfileID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID", ownerProfileID)
            };
            return DBHelper.ExecuteQuery("usp_GetPropertiesByOwner", parameters);
        }

        // Inserts a new property, returns new PropertyID
        public static int InsertProperty(int ownerProfileID, string title, int propertyTypeID,
            string address, string areaZone, decimal pricePerMonth, bool utilitiesIncluded,
            bool furnished, bool insuranceRequired, int maxTenants, DateTime availableFrom,
            DateTime? availableUntil, int preferredGenderID, bool acceptsInternational,
            bool smokersAllowed, bool petsAllowed, string description)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@OwnerProfileID",       ownerProfileID),
                new SqlParameter("@Title",                title),
                new SqlParameter("@PropertyTypeID",       propertyTypeID),
                new SqlParameter("@Address",              address),
                new SqlParameter("@AreaZone",             areaZone),
                new SqlParameter("@PricePerMonth",        pricePerMonth),
                new SqlParameter("@UtilitiesIncluded",    utilitiesIncluded),
                new SqlParameter("@Furnished",            furnished),
                new SqlParameter("@InsuranceRequired",    insuranceRequired),
                new SqlParameter("@MaxTenants",           maxTenants),
                new SqlParameter("@AvailableFrom",        availableFrom),
                new SqlParameter("@AvailableUntil",       (object)availableUntil ?? DBNull.Value),
                new SqlParameter("@PreferredGenderID",    preferredGenderID),
                new SqlParameter("@AcceptsInternational", acceptsInternational),
                new SqlParameter("@SmokersAllowed",       smokersAllowed),
                new SqlParameter("@PetsAllowed",          petsAllowed),
                new SqlParameter("@Description",          (object)description ?? DBNull.Value)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertProperty", parameters);
            return result != null ? (int)result : 0;
        }

        // Updates an existing property
        public static int UpdateProperty(int propertyID, string title, int propertyTypeID,
            string address, string areaZone, decimal pricePerMonth, bool utilitiesIncluded,
            bool furnished, bool insuranceRequired, int maxTenants, DateTime availableFrom,
            DateTime? availableUntil, int preferredGenderID, bool acceptsInternational,
            bool smokersAllowed, bool petsAllowed, string description, int statusID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PropertyID",           propertyID),
                new SqlParameter("@Title",                title),
                new SqlParameter("@PropertyTypeID",       propertyTypeID),
                new SqlParameter("@Address",              address),
                new SqlParameter("@AreaZone",             areaZone),
                new SqlParameter("@PricePerMonth",        pricePerMonth),
                new SqlParameter("@UtilitiesIncluded",    utilitiesIncluded),
                new SqlParameter("@Furnished",            furnished),
                new SqlParameter("@InsuranceRequired",    insuranceRequired),
                new SqlParameter("@MaxTenants",           maxTenants),
                new SqlParameter("@AvailableFrom",        availableFrom),
                new SqlParameter("@AvailableUntil",       (object)availableUntil ?? DBNull.Value),
                new SqlParameter("@PreferredGenderID",    preferredGenderID),
                new SqlParameter("@AcceptsInternational", acceptsInternational),
                new SqlParameter("@SmokersAllowed",       smokersAllowed),
                new SqlParameter("@PetsAllowed",          petsAllowed),
                new SqlParameter("@Description",          (object)description ?? DBNull.Value),
                new SqlParameter("@StatusID",             statusID)
            };
            return DBHelper.ExecuteNonQuery("usp_UpdateProperty", parameters);
        }

        // Deletes a property
        public static int DeleteProperty(int propertyID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PropertyID", propertyID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeleteProperty", parameters);
        }

        // Returns all photos for a property
        public static DataTable GetPhotosByProperty(int propertyID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PropertyID", propertyID)
            };
            return DBHelper.ExecuteQuery("usp_GetPhotosByProperty", parameters);
        }

        // Inserts a property photo, returns new PhotoID
        public static int InsertPropertyPhoto(int propertyID, string photoURL)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PropertyID", propertyID),
                new SqlParameter("@PhotoURL",   photoURL)
            };
            object result = DBHelper.ExecuteScalar("usp_InsertPropertyPhoto", parameters);
            return result != null ? (int)result : 0;
        }

        // Deletes a property photo
        public static int DeletePropertyPhoto(int photoID)
        {
            SqlParameter[] parameters = {
                new SqlParameter("@PhotoID", photoID)
            };
            return DBHelper.ExecuteNonQuery("usp_DeletePropertyPhoto", parameters);
        }
    }
}
