using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        // ── DTOs ──────────────────────────────────────────────────────────────
        public record CreateNotificationRequest(
            int UserID,
            int NotificationTypeID,
            int ReferenceTypeID,
            string Message
        );

        public record MarkReadRequest(
            int UserID,
            int? NotificationID    // null = mark ALL unread as read
        );

        // ── POST /api/notifications ───────────────────────────────────────────
        [HttpPost]
        public IActionResult Create([FromBody] CreateNotificationRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Message))
                return ApiResponse.BadRequest(this, "Message cannot be empty.");

            bool success = clsNotification.Create(
                req.UserID, req.NotificationTypeID, req.ReferenceTypeID, req.Message);

            if (!success)
                return ApiResponse.BadRequest(this,
                    "Failed to create notification. Check that UserID, NotificationTypeID, " +
                    "and ReferenceTypeID are all valid.");

            return ApiResponse.Created(this, new { created = true });
        }

        // ── GET /api/notifications/user/{userID}?unreadOnly=false ─────────────
        [HttpGet("user/{userID:int}")]
        public IActionResult GetByUser(int userID, [FromQuery] bool unreadOnly = false)
        {
            List<clsNotification> notifications = clsNotification.GetByUser(userID, unreadOnly);

            return ApiResponse.Ok(this, notifications.Select(n => new
            {
                n.NotificationID,
                n.NotificationType,
                n.ReferenceType,
                n.Message,
                n.IsRead,
                n.CreatedAt,
            }));
        }

        // ── PATCH /api/notifications/mark-read ────────────────────────────────
        [HttpPatch("mark-read")]
        public IActionResult MarkRead([FromBody] MarkReadRequest req)
        {
            int unreadCount = clsNotification.MarkAsRead(req.UserID, req.NotificationID);

            if (unreadCount == -1)
                return ApiResponse.BadRequest(this,
                    "Failed to mark notification(s) as read. Verify UserID and NotificationID.");

            return ApiResponse.Ok(this, new { UnreadCount = unreadCount });
        }

        // ── GET /api/notifications/types ──────────────────────────────────────
        [HttpGet("types")]
        public IActionResult GetTypes()
        {
            var dt = clsNotification.GetNotificationTypes();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    NotificationTypeID = (int)r["NotificationTypeID"],
                    Type = r["Type"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }

        // ── GET /api/notifications/reference-types ────────────────────────────
        [HttpGet("reference-types")]
        public IActionResult GetReferenceTypes()
        {
            var dt = clsNotification.GetReferenceTypes();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    ReferenceTypeID = (int)r["ReferenceTypeID"],
                    Reference = r["Reference"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }

}
