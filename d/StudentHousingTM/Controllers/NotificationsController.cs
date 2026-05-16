using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateNotificationRequest(
            int UserID,
            int NotificationTypeID,
            int ReferenceTypeID,
            string Message
        );

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/notifications/by-user/{userID}
        [HttpGet("by-user/{userID:int}")]
        public IActionResult GetByUser(int userID)
        {
            var notifications = NotificationBLL.GetByUser(userID);
            return Ok(notifications);
        }

        // GET /api/notifications/unread-count/{userID}
        [HttpGet("unread-count/{userID:int}")]
        public IActionResult GetUnreadCount(int userID)
        {
            int count = NotificationBLL.GetUnreadCount(userID);
            return Ok(new { unreadCount = count });
        }

        // POST /api/notifications
        // Called server-side after key events (new match, new message, appointment confirmed, etc.)
        [HttpPost]
        public IActionResult Create([FromBody] CreateNotificationRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Message))
                return BadRequest(new { message = "Message cannot be empty." });

            int newID = NotificationBLL.Insert(
                req.UserID, req.NotificationTypeID, req.ReferenceTypeID, req.Message
            );
            return Created(string.Empty, new { notificationID = newID });
        }

        // PUT /api/notifications/{id}/read
        [HttpPut("{id:int}/read")]
        public IActionResult MarkAsRead(int id,int userID)
        {
            int rows = NotificationBLL.MarkAsRead(id,userID);
            if (rows == 0) return NotFound(new { message = "Notification not found." });
            return NoContent();
        }

        // PUT /api/notifications/mark-all-read/{userID}
        [HttpPut("mark-all-read/{userID:int}")]
        public IActionResult MarkAllAsRead(int userID)
        {
            int rows = NotificationBLL.MarkAllAsRead(userID);
            return Ok(new { markedRead = rows });
        }
    }
}
