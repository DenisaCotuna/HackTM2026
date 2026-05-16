using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/visit-requests")]
    public class VisitRequestsController : ControllerBase
    {
        // ── DTO ───────────────────────────────────────────────────────────────
        public record CreateVisitRequestDto(
            int ConversationID,
            int StudentUserID,
            string? StudentNote,
            string ProposedDates    // comma-separated YYYY-MM-DD e.g. "2026-06-10,2026-06-15"
        );

        // ── POST /api/visit-requests ──────────────────────────────────────────
        [HttpPost]
        public IActionResult Create([FromBody] CreateVisitRequestDto req)
        {
            if (string.IsNullOrWhiteSpace(req.ProposedDates))
                return ApiResponse.BadRequest(this, "At least one proposed date is required.");

            // Basic client-side guard: reject obviously malformed dates before hitting the SP
            string[] dates = req.ProposedDates
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            foreach (string d in dates)
            {
                if (!DateTime.TryParseExact(d, "yyyy-MM-dd",
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.None, out _))
                {
                    return ApiResponse.BadRequest(this,
                        $"Date '{d}' is not in the required YYYY-MM-DD format.");
                }
            }

            int newVisitRequestID = -1;

            clsVisitRequest? visitRequest = clsVisitRequest.Create(
                req.ConversationID, req.StudentUserID,
                req.StudentNote, req.ProposedDates,
                ref newVisitRequestID);

            if (visitRequest == null || newVisitRequestID == -1)
                return ApiResponse.BadRequest(this,
                    "Failed to create visit request. A pending request may already exist, " +
                    "or the conversation / proposed dates are invalid.");

            return ApiResponse.Created(this, new
            {
                visitRequest.VisitRequestID,
                visitRequest.ConversationID,
                visitRequest.StudentUserID,
                visitRequest.StudentNote,
                visitRequest.ProposedDates,
                visitRequest.VisitStatus,
            });
        }

        // ── GET /api/visit-requests/statuses ──────────────────────────────────
        [HttpGet("statuses")]
        public IActionResult GetStatuses()
        {
            var dt = clsVisitRequest.GetStatuses();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    VisitStatusID = (int)r["VisitStatusID"],
                    Status = r["Status"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }
}
