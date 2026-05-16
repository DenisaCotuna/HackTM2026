using StudentHousingTM.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentHousingTM_BLL
{
    public static class clsLookup
    {
        /// <summary>Returns all countries (CountryID, CountryName) ordered by name.</summary>
        public static DataTable GetCountries()
            => clsLookupDAL.GetCountries();

        /// <summary>Returns all genders (GenderID, Gender) ordered by ID.</summary>
        public static DataTable GetGenders()
            => clsLookupDAL.GetGenders();

        /// <summary>Returns all study years (YearID, YearOfStudy) ordered by ID.</summary>
        public static DataTable GetStudyYears()
            => clsLookupDAL.GetStudyYears();
    }
}
