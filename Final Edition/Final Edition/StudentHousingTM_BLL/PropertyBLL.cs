using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;

namespace StudentHousingTM.BLL
{
    public class clsProperty
    {
        // ── Properties (from result set of usp_CreateProperty) ────────────────
        public int PropertyID { get; set; }
        public int OwnerProfileID { get; set; }
        public string Title { get; set; } = string.Empty;
        public int? PropertyTypeID { get; set; }   // raw FK – may come from SP
        public string? PropertyType { get; set; }   // joined label – may come from SP
        public string Address { get; set; } = string.Empty;
        public string AreaZone { get; set; } = string.Empty;
        public decimal PricePerMonth { get; set; }
        public bool UtilitiesIncluded { get; set; }
        public bool Furnished { get; set; }
        public bool InsuranceRequired { get; set; }
        public int MaxTenants { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime? AvailableUntil { get; set; }   // NULL = open-ended
        public int? PreferredGenderID { get; set; }
        public string? PreferredGender { get; set; }
        public bool AcceptsInternational { get; set; }
        public bool SmokersAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public string? Description { get; set; }
        public int? PropertyStatusID { get; set; }
        public string? PropertyStatus { get; set; }

        // ── CreateProperty ────────────────────────────────────────────────────
        /// <summary>
        /// Inserts a new property.
        /// Returns the confirmation clsProperty on success, null on failure.
        /// newPropertyID is set to the new ID (or -1 on failure).
        /// </summary>
        public static clsProperty? Create(
            int ownerProfileID,
            string title,
            int propertyTypeID,
            string address,
            string areaZone,
            decimal pricePerMonth,
            bool utilitiesIncluded,
            bool furnished,
            bool insuranceRequired,
            int maxTenants,
            DateTime availableFrom,
            DateTime? availableUntil,
            int preferredGenderID,
            bool acceptsInternational,
            bool smokersAllowed,
            bool petsAllowed,
            string? description,
            ref int newPropertyID)
        {
            newPropertyID = -1;

            DataTable dt = clsPropertiesDAL.CreateProperty(
                ownerProfileID, title, propertyTypeID, address, areaZone,
                pricePerMonth, utilitiesIncluded, furnished, insuranceRequired,
                maxTenants, availableFrom, availableUntil, preferredGenderID,
                acceptsInternational, smokersAllowed, petsAllowed, description,
                ref newPropertyID);

            if (dt.Rows.Count == 0 || newPropertyID == -1)
                return null;

            return MapRow(dt.Rows[0]);
        }

        // ── GetPropertyStatuses ───────────────────────────────────────────────
        /// <summary>Returns all property statuses (StatusID, Status).</summary>
        public static DataTable GetStatuses()
            => clsPropertiesDAL.GetPropertyStatuses();

        // ── GetPropertyTypes ──────────────────────────────────────────────────
        /// <summary>Returns all property types (PropertyTypeID, PropertyType).</summary>
        public static DataTable GetTypes()
            => clsPropertiesDAL.GetPropertyTypes();

        // ── Internal mapper ───────────────────────────────────────────────────
        private static clsProperty MapRow(DataRow row)
        {
            return new clsProperty
            {
                PropertyID = row.Table.Columns.Contains("PropertyID") && row["PropertyID"] != DBNull.Value ? (int)row["PropertyID"] : 0,
                OwnerProfileID = row.Table.Columns.Contains("OwnerProfileID") && row["OwnerProfileID"] != DBNull.Value ? (int)row["OwnerProfileID"] : 0,
                Title = row.Table.Columns.Contains("Title") && row["Title"] != DBNull.Value ? row["Title"].ToString()! : string.Empty,
                PropertyTypeID = row.Table.Columns.Contains("PropertyTypeID") && row["PropertyTypeID"] != DBNull.Value ? (int?)row["PropertyTypeID"] : null,
                PropertyType = row.Table.Columns.Contains("PropertyType") && row["PropertyType"] != DBNull.Value ? row["PropertyType"].ToString() : null,
                Address = row.Table.Columns.Contains("Address") && row["Address"] != DBNull.Value ? row["Address"].ToString()! : string.Empty,
                AreaZone = row.Table.Columns.Contains("AreaZone") && row["AreaZone"] != DBNull.Value ? row["AreaZone"].ToString()! : string.Empty,
                PricePerMonth = row.Table.Columns.Contains("PricePerMonth") && row["PricePerMonth"] != DBNull.Value ? (decimal)row["PricePerMonth"] : 0m,
                UtilitiesIncluded = row.Table.Columns.Contains("UtilitiesIncluded") && row["UtilitiesIncluded"] != DBNull.Value && (bool)row["UtilitiesIncluded"],
                Furnished = row.Table.Columns.Contains("Furnished") && row["Furnished"] != DBNull.Value && (bool)row["Furnished"],
                InsuranceRequired = row.Table.Columns.Contains("InsuranceRequired") && row["InsuranceRequired"] != DBNull.Value && (bool)row["InsuranceRequired"],
                MaxTenants = row.Table.Columns.Contains("MaxTenants") && row["MaxTenants"] != DBNull.Value ? (int)row["MaxTenants"] : 0,
                AvailableFrom = row.Table.Columns.Contains("AvailableFrom") && row["AvailableFrom"] != DBNull.Value ? (DateTime)row["AvailableFrom"] : DateTime.MinValue,
                AvailableUntil = row.Table.Columns.Contains("AvailableUntil") && row["AvailableUntil"] != DBNull.Value ? (DateTime?)row["AvailableUntil"] : null,
                PreferredGenderID = row.Table.Columns.Contains("PreferredGenderID") && row["PreferredGenderID"] != DBNull.Value ? (int?)row["PreferredGenderID"] : null,
                PreferredGender = row.Table.Columns.Contains("PreferredGender") && row["PreferredGender"] != DBNull.Value ? row["PreferredGender"].ToString() : null,
                AcceptsInternational = row.Table.Columns.Contains("AcceptsInternational") && row["AcceptsInternational"] != DBNull.Value && (bool)row["AcceptsInternational"],
                SmokersAllowed = row.Table.Columns.Contains("SmokersAllowed") && row["SmokersAllowed"] != DBNull.Value && (bool)row["SmokersAllowed"],
                PetsAllowed = row.Table.Columns.Contains("PetsAllowed") && row["PetsAllowed"] != DBNull.Value && (bool)row["PetsAllowed"],
                Description = row.Table.Columns.Contains("Description") && row["Description"] != DBNull.Value ? row["Description"].ToString() : null,
                PropertyStatusID = row.Table.Columns.Contains("PropertyStatusID") && row["PropertyStatusID"] != DBNull.Value ? (int?)row["PropertyStatusID"] : null,
                PropertyStatus = row.Table.Columns.Contains("PropertyStatus") && row["PropertyStatus"] != DBNull.Value ? row["PropertyStatus"].ToString() : null,
            };
        }
    }
}
