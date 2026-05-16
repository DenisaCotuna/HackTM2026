using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/properties")]
    public class PropertiesController : ControllerBase
    {
        // ── DTO ───────────────────────────────────────────────────────────────
        public record CreatePropertyRequest(
            int OwnerProfileID,
            string Title,
            int PropertyTypeID,
            string Address,
            string AreaZone,
            decimal PricePerMonth,
            bool UtilitiesIncluded,
            bool Furnished,
            bool InsuranceRequired,
            int MaxTenants,
            DateTime AvailableFrom,
            DateTime? AvailableUntil,
            int PreferredGenderID,
            bool AcceptsInternational,
            bool SmokersAllowed,
            bool PetsAllowed,
            string? Description
        );

        // ── POST /api/properties ──────────────────────────────────────────────
        [HttpPost]
        public IActionResult Create([FromBody] CreatePropertyRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.Address))
                return ApiResponse.BadRequest(this, "Title and Address are required.");

            if (req.PricePerMonth <= 0)
                return ApiResponse.BadRequest(this, "PricePerMonth must be greater than zero.");

            if (req.MaxTenants <= 0)
                return ApiResponse.BadRequest(this, "MaxTenants must be at least 1.");

            int newPropertyID = -1;

            clsProperty? property = clsProperty.Create(
                req.OwnerProfileID, req.Title, req.PropertyTypeID,
                req.Address, req.AreaZone, req.PricePerMonth,
                req.UtilitiesIncluded, req.Furnished, req.InsuranceRequired,
                req.MaxTenants, req.AvailableFrom, req.AvailableUntil,
                req.PreferredGenderID, req.AcceptsInternational,
                req.SmokersAllowed, req.PetsAllowed, req.Description,
                ref newPropertyID);

            if (property == null || newPropertyID == -1)
                return ApiResponse.BadRequest(this,
                    "Failed to create property. Check that all IDs are valid.");

            return ApiResponse.Created(this, new { NewPropertyID = newPropertyID });
        }

        // ── GET /api/properties/statuses ──────────────────────────────────────
        [HttpGet("statuses")]
        public IActionResult GetStatuses()
        {
            var dt = clsProperty.GetStatuses();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    StatusID = (int)r["StatusID"],
                    Status = r["Status"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }

        // ── GET /api/properties/types ─────────────────────────────────────────
        [HttpGet("types")]
        public IActionResult GetTypes()
        {
            var dt = clsProperty.GetTypes();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    PropertyTypeID = (int)r["PropertyTypeID"],
                    PropertyType = r["PropertyType"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }
}
