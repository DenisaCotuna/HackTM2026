using System;
using System.Collections.Generic;
using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class PropertyBLL
    {
        // Fields matching the Properties table
        public int PropertyID { get; set; }
        public int OwnerProfileID { get; set; }
        public string Title { get; set; }
        public int PropertyTypeID { get; set; }
        public string Address { get; set; }
        public string AreaZone { get; set; }
        public decimal PricePerMonth { get; set; }
        public bool UtilitiesIncluded { get; set; }
        public bool Furnished { get; set; }
        public bool InsuranceRequired { get; set; }
        public int MaxTenants { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime? AvailableUntil { get; set; }
        public int PreferredGenderID { get; set; }
        public bool AcceptsInternational { get; set; }
        public bool SmokersAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public string Description { get; set; }
        public int StatusID { get; set; }
        public DateTime CreatedAt { get; set; }

        private static PropertyBLL MapFromRow(DataRow row)
        {
            return new PropertyBLL
            {
                PropertyID           = (int)row["PropertyID"],
                OwnerProfileID       = (int)row["OwnerProfileID"],
                Title                = row["Title"].ToString(),
                PropertyTypeID       = (int)row["PropertyTypeID"],
                Address              = row["Address"].ToString(),
                AreaZone             = row["AreaZone"].ToString(),
                PricePerMonth        = (decimal)row["PricePerMonth"],
                UtilitiesIncluded    = (bool)row["UtilitiesIncluded"],
                Furnished            = (bool)row["Furnished"],
                InsuranceRequired    = (bool)row["InsuranceRequired"],
                MaxTenants           = (int)row["MaxTenants"],
                AvailableFrom        = (DateTime)row["AvailableFrom"],
                AvailableUntil       = row["AvailableUntil"] == DBNull.Value ? (DateTime?)null : (DateTime)row["AvailableUntil"],
                PreferredGenderID    = (int)row["PreferredGenderID"],
                AcceptsInternational = (bool)row["AcceptsInternational"],
                SmokersAllowed       = (bool)row["SmokersAllowed"],
                PetsAllowed          = (bool)row["PetsAllowed"],
                Description          = row["Description"] == DBNull.Value ? null : row["Description"].ToString(),
                StatusID             = (int)row["StatusID"],
                CreatedAt            = (DateTime)row["CreatedAt"]
            };
        }

        public static List<PropertyBLL> GetAll()
        {
            DataTable dt = PropertyDAL.GetAllProperties();
            List<PropertyBLL> list = new List<PropertyBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static PropertyBLL GetByID(int propertyID)
        {
            DataTable dt = PropertyDAL.GetPropertyByID(propertyID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static List<PropertyBLL> GetByOwner(int ownerProfileID)
        {
            DataTable dt = PropertyDAL.GetPropertiesByOwner(ownerProfileID);
            List<PropertyBLL> list = new List<PropertyBLL>();
            foreach (DataRow row in dt.Rows)
                list.Add(MapFromRow(row));
            return list;
        }

        public static int Insert(int ownerProfileID, string title, int propertyTypeID,
            string address, string areaZone, decimal pricePerMonth, bool utilitiesIncluded,
            bool furnished, bool insuranceRequired, int maxTenants, DateTime availableFrom,
            DateTime? availableUntil, int preferredGenderID, bool acceptsInternational,
            bool smokersAllowed, bool petsAllowed, string description)
        {
            return PropertyDAL.InsertProperty(ownerProfileID, title, propertyTypeID, address,
                areaZone, pricePerMonth, utilitiesIncluded, furnished, insuranceRequired,
                maxTenants, availableFrom, availableUntil, preferredGenderID,
                acceptsInternational, smokersAllowed, petsAllowed, description);
        }

        public static int Update(int propertyID, string title, int propertyTypeID,
            string address, string areaZone, decimal pricePerMonth, bool utilitiesIncluded,
            bool furnished, bool insuranceRequired, int maxTenants, DateTime availableFrom,
            DateTime? availableUntil, int preferredGenderID, bool acceptsInternational,
            bool smokersAllowed, bool petsAllowed, string description, int statusID)
        {
            return PropertyDAL.UpdateProperty(propertyID, title, propertyTypeID, address,
                areaZone, pricePerMonth, utilitiesIncluded, furnished, insuranceRequired,
                maxTenants, availableFrom, availableUntil, preferredGenderID,
                acceptsInternational, smokersAllowed, petsAllowed, description, statusID);
        }

        public static int Delete(int propertyID)
        {
            return PropertyDAL.DeleteProperty(propertyID);
        }
    }
}
