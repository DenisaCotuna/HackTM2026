using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        // ── DTO ───────────────────────────────────────────────────────────────
        public record ConfirmAppointmentRequest(
            int VisitRequestID,
            int OwnerUserID,
            DateTime ConfirmedDate,
            TimeSpan? ConfirmedTime    // null = date-only, no specific time
        );

        // ── POST /api/appointments/confirm ────────────────────────────────────
        [HttpPost("confirm")]
        public IActionResult Confirm([FromBody] ConfirmAppointmentRequest req)
        {
            if (req.ConfirmedDate.Date < DateTime.Today)
                return ApiResponse.BadRequest(this, "ConfirmedDate cannot be in the past.");

            int newAppointmentID = -1;

            clsAppointment? appointment = clsAppointment.Confirm(
                req.VisitRequestID, req.OwnerUserID,
                req.ConfirmedDate, req.ConfirmedTime,
                ref newAppointmentID);

            if (appointment == null || newAppointmentID == -1)
                return ApiResponse.BadRequest(this,
                    "Failed to confirm appointment. The visit request may not be Pending, " +
                    "you may not be the property owner, or the date is not among the proposed dates.");

            return ApiResponse.Created(this, new
            {
                appointment.AppointmentID,
                appointment.VisitRequestID,
                appointment.PropertyID,
                appointment.PropertyTitle,
                appointment.PropertyAddress,
                appointment.StudentUserID,
                appointment.StudentName,
                appointment.OwnerUserID,
                appointment.OwnerName,
                appointment.ConfirmedDate,
                appointment.ConfirmedTime,
                appointment.AppointmentStatus,
            });
        }

        // ── GET /api/appointments/statuses ────────────────────────────────────
        [HttpGet("statuses")]
        public IActionResult GetStatuses()
        {
            var dt = clsAppointment.GetStatuses();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    AppointmentStatusID = (int)r["AppointmentStatusID"],
                    Status = r["Status"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }
}
