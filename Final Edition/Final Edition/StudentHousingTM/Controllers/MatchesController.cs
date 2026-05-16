using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;
using StudentHousingTM.Controllers;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/matches")]
    public class MatchesController : ControllerBase
    {
        // ── DTOs ──────────────────────────────────────────────────────────────
        public record ExpressInterestRequest(
            string Role,          // "Student" | "Owner"
            bool Interested
        );

        public record RejectMatchRequest(int RejectingUserID);

        // ── PATCH /api/matches/{matchID}/interest ─────────────────────────────
        [HttpPatch("{matchID:int}/interest")]
        public IActionResult ExpressInterest(int matchID, [FromBody] ExpressInterestRequest req)
        {
            if (req.Role != "Student" && req.Role != "Owner")
                return ApiResponse.BadRequest(this, "Role must be 'Student' or 'Owner'.");

            clsMatch? match = clsMatch.ExpressInterest(matchID, req.Role, req.Interested);

            if (match == null)
                return ApiResponse.NotFound(this,
                    $"Match {matchID} not found or the operation was rejected by the server.");

            return ApiResponse.Ok(this, new
            {
                match.MatchID,
                match.MatchStatus,
                match.StudentInterested,
                match.OwnerInterested,
                match.ConversationID,
                MutuallyConfirmed = match.ConversationID.HasValue,
            });
        }

        // ── PATCH /api/matches/{matchID}/reject ───────────────────────────────
        [HttpPatch("{matchID:int}/reject")]
        public IActionResult Reject(int matchID, [FromBody] RejectMatchRequest req)
        {
            clsMatch? match = clsMatch.Reject(matchID, req.RejectingUserID);

            if (match == null)
                return ApiResponse.NotFound(this,
                    $"Match {matchID} not found or you are not a participant.");

            return ApiResponse.Ok(this, new
            {
                match.MatchID,
                match.MatchStatus,
                match.ConversationID,
                ConversationClosed = match.ConversationActive == false,
            });
        }

        // ── GET /api/matches/statuses ─────────────────────────────────────────
        [HttpGet("statuses")]
        public IActionResult GetStatuses()
        {
            var dt = clsMatch.GetStatuses();
            var list = dt.Rows.Cast<System.Data.DataRow>()
                .Select(r => new
                {
                    MatchStatusID = (int)r["MatchStatusID"],
                    Status = r["Status"].ToString()
                }).ToList();

            return ApiResponse.Ok(this, list);
        }
    }

}
