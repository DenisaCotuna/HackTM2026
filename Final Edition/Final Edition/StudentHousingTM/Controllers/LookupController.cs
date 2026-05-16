using Microsoft.AspNetCore.Mvc;
using StudentHousingTM_BLL;

namespace StudentHousingTM.Controllers
{
    [ApiController]
    [Route("api/lookup")]
    public class LookupController : ControllerBase
    {
        // ── GET /api/lookup/countries ─────────────────────────────────────────
        [HttpGet("countries")]
        public IActionResult GetCountries()
        {
            var dt = clsLookup.GetCountries();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    CountryID = (int)r["CountryID"],
                    CountryName = r["CountryName"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }

        // ── GET /api/lookup/genders ───────────────────────────────────────────
        [HttpGet("genders")]
        public IActionResult GetGenders()
        {
            var dt = clsLookup.GetGenders();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    GenderID = (int)r["GenderID"],
                    Gender = r["Gender"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }

        // ── GET /api/lookup/study-years ───────────────────────────────────────
        [HttpGet("study-years")]
        public IActionResult GetStudyYears()
        {
            var dt = clsLookup.GetStudyYears();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    YearID = (int)r["YearID"],
                    YearOfStudy = r["YearOfStudy"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }
}
