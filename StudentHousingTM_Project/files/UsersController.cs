using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        // ── DTOs ────────────────────────────────────────────────────────────────

        public record RegisterRequest(
            string FullName,
            string Email,
            string PasswordHash,
            string? PhoneNumber,
            int NationalityID,
            int GenderID,
            string Role,           // "Student" | "Owner"
            string? ProfilePhoto
        );

        public record UpdateUserRequest(
            string FullName,
            string? PhoneNumber,
            int NationalityID,
            int GenderID,
            string? ProfilePhoto
        );

        public record UpdatePasswordRequest(string NewPasswordHash);

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/users
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = UserBLL.GetAllUsers();
            return Ok(users);
        }

        // GET /api/users/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var user = UserBLL.GetByID(id);
            if (user == null) return NotFound(new { message = "User not found." });
            return Ok(user);
        }

        // GET /api/users/by-email?email=...
        // Used during login: fetch user then verify password hash on client or a dedicated auth layer
        [HttpGet("by-email")]
        public IActionResult GetByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required." });

            var user = UserBLL.GetByEmail(email);
            if (user == null) return NotFound(new { message = "No user with that email." });
            return Ok(user);
        }

        // POST /api/users
        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (req.Role != "Student" && req.Role != "Owner")
                return BadRequest(new { message = "Role must be 'Student' or 'Owner'." });

            int newID = UserBLL.Insert(
                req.FullName, req.Email, req.PasswordHash,
                req.PhoneNumber, req.NationalityID, req.GenderID,
                req.Role, req.ProfilePhoto
            );

            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { userID = newID });
        }

        // PUT /api/users/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateUserRequest req)
        {
            int rows = UserBLL.Update(id, req.FullName, req.PhoneNumber,
                req.NationalityID, req.GenderID, req.ProfilePhoto);

            if (rows == 0) return NotFound(new { message = "User not found." });
            return NoContent();
        }

        // PUT /api/users/{id}/deactivate
        [HttpPut("{id:int}/deactivate")]
        public IActionResult Deactivate(int id)
        {
            int rows = UserBLL.Deactivate(id);
            if (rows == 0) return NotFound(new { message = "User not found." });
            return NoContent();
        }

        // PUT /api/users/{id}/password
        [HttpPut("{id:int}/password")]
        public IActionResult UpdatePassword(int id, [FromBody] UpdatePasswordRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.NewPasswordHash))
                return BadRequest(new { message = "NewPasswordHash is required." });

            int rows = UserBLL.UpdatePassword(id, req.NewPasswordHash);
            if (rows == 0) return NotFound(new { message = "User not found." });
            return NoContent();
        }
    }
}
