using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/student-requests")]
    public class StudentRequestsController : ControllerBase
    {
        // ── DTO ───────────────────────────────────────────────────────────────
        public record CreateStudentRequestDto(
            int StudentProfileID,
            string Title,
            decimal BudgetMin,
            decimal BudgetMax,
            DateTime MoveInDate,
            DateTime? MoveOutDate,
            int PropertyTypePreferredID,
            bool? FurnishedRequired,
            bool UtilitiesRequired,
            bool PetsAllowed,
            bool SmokersAllowed,
            string? AdditionalNotes,
            string? PreferredAreas            // comma-separated e.g. "Centru,Fabric"
        );

        // ── POST /api/student-requests ────────────────────────────────────────
        [HttpPost]
        public IActionResult Create([FromBody] CreateStudentRequestDto req)
        {
            if (string.IsNullOrWhiteSpace(req.Title))
                return ApiResponse.BadRequest(this, "Title is required.");

            if (req.BudgetMin <= 0 || req.BudgetMax <= 0 || req.BudgetMin > req.BudgetMax)
                return ApiResponse.BadRequest(this, "BudgetMin and BudgetMax must be positive, and BudgetMin ≤ BudgetMax.");

            int newRequestID = -1;

            clsStudentRequest? request = clsStudentRequest.Create(
                req.StudentProfileID, req.Title,
                req.BudgetMin, req.BudgetMax,
                req.MoveInDate, req.MoveOutDate,
                req.PropertyTypePreferredID,
                req.FurnishedRequired,
                req.UtilitiesRequired,
                req.PetsAllowed,
                req.SmokersAllowed,
                req.AdditionalNotes,
                req.PreferredAreas,
                ref newRequestID);

            if (request == null || newRequestID == -1)
                return ApiResponse.BadRequest(this,
                    "Failed to create student request. Verify all field values.");

            return ApiResponse.Created(this, new
            {
                request.StudentRequestID,
                request.Title,
                request.BudgetMin,
                request.BudgetMax,
                request.MoveInDate,
                request.MoveOutDate,
                request.PropertyTypePreferred,
                request.FurnishedRequired,
                request.UtilitiesRequired,
                request.PetsAllowed,
                request.SmokersAllowed,
                request.AdditionalNotes,
                request.PreferredAreas,
            });
        }

        // ── POST /api/student-requests/{requestID}/generate-matches ───────────
        [HttpPost("{requestID:int}/generate-matches")]
        public IActionResult GenerateMatches(int requestID)
        {
            List<clsMatch> matches = clsStudentRequest.GenerateMatches(requestID);

            // An empty list is a valid result (no matches found), not an error
            return ApiResponse.Ok(this, matches.Select(m => new
            {
                m.MatchID,
                m.PropertyID,
                m.PropertyTitle,
                m.MatchScore,
                m.MatchStatus,
                m.StudentInterested,
                m.OwnerInterested,
                m.ConversationID,
            }));
        }
    }
}
