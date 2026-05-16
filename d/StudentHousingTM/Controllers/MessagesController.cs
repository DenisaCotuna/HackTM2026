using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record SendMessageRequest(
            int ConversationID,
            int SenderID,        // UserID of sender (not ProfileID)
            string MessageText
        );

        public record MarkReadRequest(
            int ConversationID,
            int UserID           // mark all messages not sent by this user as read
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/messages/by-conversation/{conversationID}
        [HttpGet("by-conversation/{conversationID:int}")]
        public IActionResult GetByConversation(int conversationID,int userID)
        {
            var messages = MessageBLL.GetByConversation(conversationID,userID);
            return Ok(messages);
        }

        // GET /api/messages/unread-count?conversationID=1&userID=2
        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount([FromQuery] int conversationID, [FromQuery] int userID)
        {
            int count = MessageBLL.GetUnreadCount(conversationID, userID);
            return Ok(new { unreadCount = count });
        }

        // POST /api/messages
        [HttpPost]
        public IActionResult Send([FromBody] SendMessageRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.MessageText))
                return BadRequest(new { message = "MessageText cannot be empty." });

            int newID = MessageBLL.Insert(req.ConversationID, req.SenderID, req.MessageText);
            return Created(string.Empty, new { messageID = newID });
        }

        // PUT /api/messages/mark-read
        [HttpPut("mark-read")]
        public IActionResult MarkAsRead([FromBody] MarkReadRequest req)
        {
            int rows = MessageBLL.MarkAsRead(req.ConversationID, req.UserID);
            return Ok(new { markedRead = rows });
        }
    }
}
