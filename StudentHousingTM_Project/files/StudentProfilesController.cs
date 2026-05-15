using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/student-profiles")]
    public class StudentProfilesController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateStudentProfileRequest(
            int UserID,
            string University,
            string FieldOfStudy,
            int YearOfStudyID,   // 1–7
            bool IsSmoker,
            bool HasPets
        );

        public record UpdateStudentProfileRequest(
            string University,
            string FieldOfStudy,
            int YearOfStudyID,
            bool IsSmoker,
            bool HasPets
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/student-profiles/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var profile = StudentProfileBLL.GetByID(id);
            if (profile == null) return NotFound(new { message = "Student profile not found." });
            return Ok(profile);
        }

        // GET /api/student-profiles/by-user/{userID}
        [HttpGet("by-user/{userID:int}")]
        public IActionResult GetByUserID(int userID)
        {
            var profile = StudentProfileBLL.GetByUserID(userID);
            if (profile == null) return NotFound(new { message = "No student profile for this user." });
            return Ok(profile);
        }

        // POST /api/student-profiles
        [HttpPost]
        public IActionResult Create([FromBody] CreateStudentProfileRequest req)
        {
            int newID = StudentProfileBLL.Insert(
                req.UserID, req.University, req.FieldOfStudy,
                req.YearOfStudyID, req.IsSmoker, req.HasPets
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { studentProfileID = newID });
        }

        // PUT /api/student-profiles/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateStudentProfileRequest req)
        {
            int rows = StudentProfileBLL.Update(
                id, req.University, req.FieldOfStudy,
                req.YearOfStudyID, req.IsSmoker, req.HasPets
            );
            if (rows == 0) return NotFound(new { message = "Student profile not found." });
            return NoContent();
        }
    }
}
