using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        // ── DTO ───────────────────────────────────────────────────────────────
        public record SendMessageRequest(
            int ConversationID,
            int SenderID,
            string MessageText
        );

        // ── POST /api/messages ────────────────────────────────────────────────
        [HttpPost]
        public IActionResult Send([FromBody] SendMessageRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.MessageText))
                return ApiResponse.BadRequest(this, "MessageText cannot be empty.");

            clsMessage? message = clsMessage.Send(req.ConversationID, req.SenderID, req.MessageText);

            if (message == null)
                return ApiResponse.BadRequest(this,
                    "Failed to send message. The conversation may be inactive or you are not a participant.");

            return ApiResponse.Created(this, new
            {
                message.MessageID,
                message.ConversationID,
                message.SenderID,
                message.SenderName,
                message.SenderRole,
                message.MessageText,
                message.SentAt,
                message.IsRead,
            });
        }

        // ── GET /api/messages/conversation/{conversationID}?requestingUserID= ─
        [HttpGet("conversation/{conversationID:int}")]
        public IActionResult GetByConversation(int conversationID, [FromQuery] int requestingUserID)
        {
            if (requestingUserID <= 0)
                return ApiResponse.BadRequest(this, "requestingUserID query parameter is required.");

            List<clsMessage>? messages =
                clsMessage.GetByConversation(conversationID, requestingUserID);

            if (messages == null)
                return ApiResponse.BadRequest(this,
                    "Could not retrieve messages. The conversation may not exist or you are not a participant.");

            return ApiResponse.Ok(this, messages.Select(m => new
            {
                m.MessageID,
                m.SenderID,
                m.SenderName,
                m.SenderRole,
                m.MessageText,
                m.SentAt,
                m.IsRead,
                m.IsOwnMessage,
            }));
        }
    }
}
