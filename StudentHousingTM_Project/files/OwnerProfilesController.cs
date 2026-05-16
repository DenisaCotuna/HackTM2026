using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/owner-profiles")]
    public class OwnerProfilesController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateOwnerProfileRequest(
            int UserID,
            int NumberOfProperties,
            bool RequiresInsurance,
            bool AcceptsInternational,
            int PreferredTenantGenderID  // 1=Male, 2=Female, 3=No preference
        );

        public record UpdateOwnerProfileRequest(
            bool RequiresInsurance,
            bool AcceptsInternational,
            int PreferredTenantGenderID
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/owner-profiles/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var profile = OwnerProfileBLL.GetByID(id);
            if (profile == null) return NotFound(new { message = "Owner profile not found." });
            return Ok(profile);
        }

        // GET /api/owner-profiles/by-user/{userID}
        [HttpGet("by-user/{userID:int}")]
        public IActionResult GetByUserID(int userID)
        {
            var profile = OwnerProfileBLL.GetByUserID(userID);
            if (profile == null) return NotFound(new { message = "No owner profile for this user." });
            return Ok(profile);
        }

        // POST /api/owner-profiles
        [HttpPost]
        public IActionResult Create([FromBody] CreateOwnerProfileRequest req)
        {
            int newID = OwnerProfileBLL.Insert(
                req.UserID, req.NumberOfProperties, req.RequiresInsurance,
                req.AcceptsInternational, req.PreferredTenantGenderID
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { ownerProfileID = newID });
        }

        // PUT /api/owner-profiles/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateOwnerProfileRequest req)
        {
            int rows = OwnerProfileBLL.Update(
                id, req.RequiresInsurance, req.AcceptsInternational, req.PreferredTenantGenderID
            );
            if (rows == 0) return NotFound(new { message = "Owner profile not found." });
            return NoContent();
        }
    }
}
