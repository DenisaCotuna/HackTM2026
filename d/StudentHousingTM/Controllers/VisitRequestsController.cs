using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/visit-requests")]
    public class VisitRequestsController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateVisitRequestRequest(
            int ConversationID,
            int StudentProfileID,
            int PropertyID,
            string? StudentNote
        );

        public record UpdateStatusRequest(int StatusID); // 1=Pending, 2=Accepted, 3=Declined, 4=Cancelled

        public record AddProposedDateRequest(DateTime ProposedDate);

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/visit-requests/by-conversation/{conversationID}
        [HttpGet("by-conversation/{conversationID:int}")]
        public IActionResult GetByConversation(int conversationID)
        {
            var requests = VisitRequestBLL.GetByConversation(conversationID);
            return Ok(requests);
        }

        // GET /api/visit-requests/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var request = VisitRequestBLL.GetByID(id);
            if (request == null) return NotFound(new { message = "Visit request not found." });
            return Ok(request);
        }

        // POST /api/visit-requests
        [HttpPost]
        public IActionResult Create([FromBody] CreateVisitRequestRequest req)
        {
            int newID = VisitRequestBLL.Insert(
                req.ConversationID, req.StudentProfileID, req.PropertyID, req.StudentNote
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { visitRequestID = newID });
        }

        // PUT /api/visit-requests/{id}/status
        [HttpPut("{id:int}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
        {
            int rows = VisitRequestBLL.UpdateStatus(id, req.StatusID);
            if (rows == 0) return NotFound(new { message = "Visit request not found." });
            return NoContent();
        }

        // POST /api/visit-requests/{id}/proposed-dates
        // Student adds multiple available dates for the visit
        [HttpPost("{id:int}/proposed-dates")]
        public IActionResult AddProposedDate(int id, [FromBody] AddProposedDateRequest req)
        {
            if (req.ProposedDate.Date < DateTime.Today)
                return BadRequest(new { message = "Proposed date cannot be in the past." });

            int rows = VisitRequestBLL.AddProposedDate(id, req.ProposedDate);
            if (rows == 0) return NotFound(new { message = "Visit request not found or date already exists." });
            return Created(string.Empty, new { added = true });
        }
    }
}
