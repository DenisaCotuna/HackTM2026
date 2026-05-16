using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/student-requests")]
    public class StudentRequestsController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateStudentRequestRequest(
            int StudentProfileID,
            string Title,
            decimal BudgetMin,
            decimal BudgetMax,
            DateTime MoveInDate,
            DateTime? MoveOutDate,
            int PropertyTypePreferredID,  // 1=Room, 2=Apartment, 3=House, 4=Any
            bool? FurnishedRequired,      // null = no preference
            bool UtilitiesRequired,
            bool PetsAllowed,
            bool SmokersAllowed,
            string? AdditionalNotes
        );

        public record UpdateStudentRequestRequest(
            string Title,
            decimal BudgetMin,
            decimal BudgetMax,
            DateTime MoveInDate,
            DateTime? MoveOutDate,
            int PropertyTypePreferredID,
            bool? FurnishedRequired,
            bool UtilitiesRequired,
            bool PetsAllowed,
            bool SmokersAllowed,
            string? AdditionalNotes,
            int StatusID   // 1=Active, 2=Matched, 3=Closed
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/student-requests/by-student/{studentProfileID}
        [HttpGet("by-student/{studentProfileID:int}")]
        public IActionResult GetByStudent(int studentProfileID)
        {
            var requests = StudentRequestBLL.GetByStudent(studentProfileID);
            return Ok(requests);
        }

        // GET /api/student-requests/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var request = StudentRequestBLL.GetByID(id);
            if (request == null) return NotFound(new { message = "Student request not found." });
            return Ok(request);
        }

        // POST /api/student-requests
        [HttpPost]
        public IActionResult Create([FromBody] CreateStudentRequestRequest req)
        {
            if (req.BudgetMax < req.BudgetMin)
                return BadRequest(new { message = "BudgetMax must be >= BudgetMin." });

            int newID = StudentRequestBLL.Insert(
                req.StudentProfileID, req.Title, req.BudgetMin, req.BudgetMax,
                req.MoveInDate, req.MoveOutDate, req.PropertyTypePreferredID,
                req.FurnishedRequired, req.UtilitiesRequired,
                req.PetsAllowed, req.SmokersAllowed, req.AdditionalNotes
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { requestID = newID });
        }

        // PUT /api/student-requests/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateStudentRequestRequest req)
        {
            if (req.BudgetMax < req.BudgetMin)
                return BadRequest(new { message = "BudgetMax must be >= BudgetMin." });

            int rows = StudentRequestBLL.Update(
                id, req.Title, req.BudgetMin, req.BudgetMax,
                req.MoveInDate, req.MoveOutDate, req.PropertyTypePreferredID,
                req.FurnishedRequired, req.UtilitiesRequired,
                req.PetsAllowed, req.SmokersAllowed, req.AdditionalNotes, req.StatusID
            );
            if (rows == 0) return NotFound(new { message = "Student request not found." });
            return NoContent();
        }

        // DELETE /api/student-requests/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            int rows = StudentRequestBLL.Delete(id);
            if (rows == 0) return NotFound(new { message = "Student request not found." });
            return NoContent();
        }
    }
}
