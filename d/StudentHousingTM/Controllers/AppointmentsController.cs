using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record CreateAppointmentRequest(
            int VisitRequestID,
            int ConversationID,
            int StudentProfileID,
            int OwnerProfileID,
            int PropertyID,
            DateTime ConfirmedDate,
            string? ConfirmedTime   // "HH:mm:ss" — nullable, owner may confirm time later
        );

        public record UpdateStatusRequest(int StatusID); // 1=Scheduled, 2=Completed, 3=Cancelled

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/appointments/by-student/{studentProfileID}
        [HttpGet("by-student/{studentProfileID:int}")]
        public IActionResult GetByStudent(int studentProfileID)
        {
            var appointments = AppointmentBLL.GetByStudent(studentProfileID);
            return Ok(appointments);
        }

        // GET /api/appointments/by-owner/{ownerProfileID}
        [HttpGet("by-owner/{ownerProfileID:int}")]
        public IActionResult GetByOwner(int ownerProfileID)
        {
            var appointments = AppointmentBLL.GetByOwner(ownerProfileID);
            return Ok(appointments);
        }

        // GET /api/appointments/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var appointment = AppointmentBLL.GetByID(id);
            if (appointment == null) return NotFound(new { message = "Appointment not found." });
            return Ok(appointment);
        }

        // POST /api/appointments
        // Owner picks a date from the visit request's proposed dates and confirms the appointment
        [HttpPost]
        public IActionResult Create([FromBody] CreateAppointmentRequest req)
        {
            // Parse optional time string "HH:mm:ss" → TimeSpan
            TimeSpan? confirmedTime = null;
            if (!string.IsNullOrWhiteSpace(req.ConfirmedTime))
            {
                if (!TimeSpan.TryParse(req.ConfirmedTime, out var ts))
                    return BadRequest(new { message = "ConfirmedTime must be in HH:mm:ss format." });
                confirmedTime = ts;
            }

            int newID = AppointmentBLL.Insert(
                req.VisitRequestID, req.ConversationID, req.StudentProfileID,
                req.OwnerProfileID, req.PropertyID, req.ConfirmedDate, confirmedTime
            );
            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { appointmentID = newID });
        }

        // PUT /api/appointments/{id}/status
        [HttpPut("{id:int}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
        {
            int rows = AppointmentBLL.UpdateStatus(id, req.StatusID);
            if (rows == 0) return NotFound(new { message = "Appointment not found." });
            return NoContent();
        }
    }
}
