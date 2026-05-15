using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/conversations")]
    public class ConversationsController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        // A conversation is always created from a confirmed mutual match
        public record CreateConversationRequest(
            int MatchID,
            int StudentProfileID,
            int OwnerProfileID
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/conversations/by-user/{userID}
        // Works for both Student and Owner userIDs — the DAL/SP handles it
        [HttpGet("by-user/{userID:int}")]
        public IActionResult GetByUser(int userID)
        {
            var conversations = ConversationBLL.GetByUser(userID);
            return Ok(conversations);
        }

        // GET /api/conversations/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var conversation = ConversationBLL.GetByID(id);
            if (conversation == null) return NotFound(new { message = "Conversation not found." });
            return Ok(conversation);
        }

        // GET /api/conversations/by-match/{matchID}
        [HttpGet("by-match/{matchID:int}")]
        public IActionResult GetByMatch(int matchID)
        {
            var conversation = ConversationBLL.GetByMatch(matchID);
            if (conversation == null) return NotFound(new { message = "No conversation for this match." });
            return Ok(conversation);
        }

        // POST /api/conversations
        // Should be called right after a mutual match is confirmed
        [HttpPost]
        public IActionResult Create([FromBody] CreateConversationRequest req)
        {
            int newID = ConversationBLL.Insert(req.MatchID, req.StudentProfileID, req.OwnerProfileID);
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { conversationID = newID });
        }

        // PUT /api/conversations/{id}/deactivate
        [HttpPut("{id:int}/deactivate")]
        public IActionResult Deactivate(int id)
        {
            int rows = ConversationBLL.Deactivate(id);
            if (rows == 0) return NotFound(new { message = "Conversation not found." });
            return NoContent();
        }
    }
}
