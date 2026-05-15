using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/properties")]
    public class PropertiesController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreatePropertyRequest(
            int OwnerProfileID,
            string Title,
            int PropertyTypeID,       // 1=Room, 2=Apartment, 3=House (per DB check)
            string Address,
            string AreaZone,
            decimal PricePerMonth,
            bool UtilitiesIncluded,
            bool Furnished,
            bool InsuranceRequired,
            int MaxTenants,
            DateTime AvailableFrom,
            DateTime? AvailableUntil,
            int PreferredGenderID,    // 1=Male, 2=Female, 3=No preference
            bool AcceptsInternational,
            bool SmokersAllowed,
            bool PetsAllowed,
            string? Description
        );

        public record UpdatePropertyRequest(
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
            string? Description,
            int StatusID             // 1=Active, 2=Rented, 3=Inactive
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/properties
        [HttpGet]
        public IActionResult GetAll()
        {
            var properties = PropertyBLL.GetAll();
            return Ok(properties);
        }

        // GET /api/properties/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var property = PropertyBLL.GetByID(id);
            if (property == null) return NotFound(new { message = "Property not found." });
            return Ok(property);
        }

        // GET /api/properties/by-owner/{ownerProfileID}
        [HttpGet("by-owner/{ownerProfileID:int}")]
        public IActionResult GetByOwner(int ownerProfileID)
        {
            var properties = PropertyBLL.GetByOwner(ownerProfileID);
            return Ok(properties);
        }

        // POST /api/properties
        [HttpPost]
        public IActionResult Create([FromBody] CreatePropertyRequest req)
        {
            int newID = PropertyBLL.Insert(
                req.OwnerProfileID, req.Title, req.PropertyTypeID,
                req.Address, req.AreaZone, req.PricePerMonth,
                req.UtilitiesIncluded, req.Furnished, req.InsuranceRequired,
                req.MaxTenants, req.AvailableFrom, req.AvailableUntil,
                req.PreferredGenderID, req.AcceptsInternational,
                req.SmokersAllowed, req.PetsAllowed, req.Description
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { propertyID = newID });
        }

        // PUT /api/properties/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdatePropertyRequest req)
        {
            int rows = PropertyBLL.Update(
                id, req.Title, req.PropertyTypeID,
                req.Address, req.AreaZone, req.PricePerMonth,
                req.UtilitiesIncluded, req.Furnished, req.InsuranceRequired,
                req.MaxTenants, req.AvailableFrom, req.AvailableUntil,
                req.PreferredGenderID, req.AcceptsInternational,
                req.SmokersAllowed, req.PetsAllowed, req.Description, req.StatusID
            );
            if (rows == 0) return NotFound(new { message = "Property not found." });
            return NoContent();
        }

        // DELETE /api/properties/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            int rows = PropertyBLL.Delete(id);
            if (rows == 0) return NotFound(new { message = "Property not found." });
            return NoContent();
        }
    }
}
