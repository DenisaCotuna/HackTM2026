using System.Data;
using StudentHousingTM_DAL;

namespace StudentHousingTM.BLL
{
    public class OwnerProfileBLL
    {
        // Fields matching the OwnerProfiles table
        public int OwnerProfileID { get; set; }
        public int UserID { get; set; }
        public int NumberOfProperties { get; set; }
        public bool RequiresInsurance { get; set; }
        public bool AcceptsInternational { get; set; }
        public int PreferredTenantGenderID { get; set; }

        private static OwnerProfileBLL MapFromRow(DataRow row)
        {
            return new OwnerProfileBLL
            {
                OwnerProfileID          = (int)row["OwnerProfileID"],
                UserID                  = (int)row["UserID"],
                NumberOfProperties      = (int)row["NumberOfProperties"],
                RequiresInsurance       = (bool)row["RequiresInsurance"],
                AcceptsInternational    = (bool)row["AcceptsInternational"],
                PreferredTenantGenderID = (int)row["PreferredTenantGenderID"]
            };
        }

        public static OwnerProfileBLL GetByUserID(int userID)
        {
            DataTable dt = OwnerProfileDAL.GetOwnerProfileByUserID(userID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static OwnerProfileBLL GetByID(int ownerProfileID)
        {
            DataTable dt = OwnerProfileDAL.GetOwnerProfileByID(ownerProfileID);
            if (dt.Rows.Count == 0) return null;
            return MapFromRow(dt.Rows[0]);
        }

        public static int Insert(int userID, int numberOfProperties, bool requiresInsurance,
            bool acceptsInternational, int preferredTenantGenderID)
        {
            return OwnerProfileDAL.InsertOwnerProfile(userID, numberOfProperties,
                requiresInsurance, acceptsInternational, preferredTenantGenderID);
        }

        public static int Update(int ownerProfileID, bool requiresInsurance,
            bool acceptsInternational, int preferredTenantGenderID)
        {
            return OwnerProfileDAL.UpdateOwnerProfile(ownerProfileID, requiresInsurance,
                acceptsInternational, preferredTenantGenderID);
        }
    }
}
