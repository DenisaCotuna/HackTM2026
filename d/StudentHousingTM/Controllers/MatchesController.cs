using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/matches")]
    public class MatchesController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        // Created by the matching algorithm — the system inserts matches automatically
        public record CreateMatchRequest(
            int StudentRequestID,
            int PropertyID,
            int MatchScore,      // 0–100
            string MatchType     // "Perfect" | "Partial"
        );

        public record SetInterestRequest(bool Interested);

        public record RejectMatchRequest(int RejectedBy); // "Student" | "Owner"

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/matches/by-student/{studentProfileID}
        [HttpGet("by-student/{studentProfileID:int}")]
        public IActionResult GetByStudent(int studentProfileID)
        {
            var matches = MatchBLL.GetByStudent(studentProfileID);
            return Ok(matches);
        }

        // GET /api/matches/by-owner/{ownerProfileID}
        [HttpGet("by-owner/{ownerProfileID:int}")]
        public IActionResult GetByOwner(int ownerProfileID)
        {
            var matches = MatchBLL.GetByOwner(ownerProfileID);
            return Ok(matches);
        }

        // GET /api/matches/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var match = MatchBLL.GetByID(id);
            if (match == null) return NotFound(new { message = "Match not found." });
            return Ok(match);
        }

        // POST /api/matches
        // Called by the matching engine after scoring
        [HttpPost]
        public IActionResult Create([FromBody] CreateMatchRequest req)
        {
            if (req.MatchType != "Perfect" && req.MatchType != "Partial")
                return BadRequest(new { message = "MatchType must be 'Perfect' or 'Partial'." });

            if (req.MatchScore < 0 || req.MatchScore > 100)
                return BadRequest(new { message = "MatchScore must be between 0 and 100." });

            int newID = MatchBLL.Insert(req.StudentRequestID, req.PropertyID, req.MatchScore, req.MatchType);
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { matchID = newID });
        }

        // PUT /api/matches/{id}/student-interest
        // Student swipes interest (true = interested, false = not interested)
        [HttpPut("{id:int}/student-interest")]
        public IActionResult SetStudentInterest(int id, [FromBody] SetInterestRequest req)
        {
            int rows = MatchBLL.SetStudentInterested(id, req.Interested);
            if (rows == 0) return NotFound(new { message = "Match not found." });
            return NoContent();
        }

        // PUT /api/matches/{id}/owner-interest
        // Owner swipes interest
        [HttpPut("{id:int}/owner-interest")]
        public IActionResult SetOwnerInterest(int id, [FromBody] SetInterestRequest req)
        {
            int rows = MatchBLL.SetOwnerInterested(id, req.Interested);
            if (rows == 0) return NotFound(new { message = "Match not found." });
            return NoContent();
        }

        // PUT /api/matches/{id}/reject
        // Either side explicitly rejects
        [HttpPut("{id:int}/reject")]
        public IActionResult Reject(int id, [FromBody] RejectMatchRequest req)
        {
            

            int rows = MatchBLL.Reject(id, req.RejectedBy);
            if (rows == 0) return NotFound(new { message = "Match not found." });
            return NoContent();
        }

        // PUT /api/matches/{id}/confirm
        // Called when both parties have marked interest — creates a mutual match
        [HttpPut("{id:int}/confirm")]
        public IActionResult ConfirmMutual(int id)
        {
            int rows = MatchBLL.ConfirmMutual(id);
            if (rows == 0) return NotFound(new { message = "Match not found." });
            return NoContent();
        }
    }
}
