using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using StudentHousingTM.BLL;

namespace StudentHousingTM_API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        // ── DTOs ──────────────────────────────────────────────────────────────
        public record RegisterRequest(
            string  FullName,
            string  Email,
            string  Password,             // plain-text; controller hashes it
            string? PhoneNumber,
            int     NationalityID,
            int     GenderID,
            string  Role,                 // "Student" | "Owner"
            string? ProfilePhoto,
            // Student-only
            string? University,
            string? FieldOfStudy,
            int?    YearOfStudyID,
            bool    IsSmoker,
            bool    HasPets,
            // Owner-only
            int  NumberOfProperties,
            bool RequiresInsurance,
            bool AcceptsInternational,
            int  PreferredTenantGenderID
        );

        public record LoginRequest(string Email, string Password);

        // ── POST /api/users/register ──────────────────────────────────────────
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.FullName) ||
                string.IsNullOrWhiteSpace(req.Email)    ||
                string.IsNullOrWhiteSpace(req.Password))
                return StudentHousingTM.Controllers.ApiResponse.BadRequest(this, "FullName, Email, and Password are required.");

            if (req.Role != "Student" && req.Role != "Owner")
                return StudentHousingTM.Controllers.ApiResponse.BadRequest(this, "Role must be 'Student' or 'Owner'.");

            // Hash the password before passing to BLL / DAL
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            int newUserID    = -1;
            int newProfileID = -1;

            clsUser? user = clsUser.Register(
                req.FullName, req.Email, passwordHash, req.PhoneNumber,
                req.NationalityID, req.GenderID, req.Role, req.ProfilePhoto,
                req.University, req.FieldOfStudy, req.YearOfStudyID, req.IsSmoker, req.HasPets,
                req.NumberOfProperties, req.RequiresInsurance, req.AcceptsInternational,
                req.PreferredTenantGenderID,
                ref newUserID, ref newProfileID);

            if (user == null || newUserID == -1)
                return StudentHousingTM.Controllers.ApiResponse.BadRequest(this,
                    "Registration failed. The email may already be in use or a required field is invalid.");

            return StudentHousingTM.Controllers.ApiResponse.Created(this, new
            {
                user.UserID,
                user.FullName,
                user.Email,
                user.Role,
                NewProfileID = newProfileID
            });
        }

        // ── POST /api/users/login ─────────────────────────────────────────────
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return StudentHousingTM.Controllers.ApiResponse.BadRequest(this, "Email and Password are required.");

            clsUser? user = clsUser.FindByEmail(req.Email);

            if (user == null)
                return StudentHousingTM.Controllers.ApiResponse.NotFound(this, "No account found with that email.");

            // Verify the plain-text password against the stored BCrypt hash
            bool passwordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);

            if (!passwordValid)
                return StudentHousingTM.Controllers.ApiResponse.BadRequest(this, "Incorrect password.");

            // Return a safe user object — never return the hash to the client
            return StudentHousingTM.Controllers.ApiResponse.Ok(this, new
            {
                user.UserID,
                user.FullName,
                user.Email,
                user.Role,
                user.PhoneNumber,
                user.Nationality,
                user.Gender,
                user.ProfilePhoto,
                user.CreatedAt,
                // Student fields (null for owners)
                user.StudentProfileID,
                user.University,
                user.FieldOfStudy,
                user.YearOfStudy,
                user.IsSmoker,
                user.HasPets,
                // Owner fields (null for students)
                user.OwnerProfileID,
                user.NumberOfProperties,
                user.RequiresInsurance,
                user.AcceptsInternational,
                user.PreferredTenantGender,
            });
        }

        // ── GET /api/users/student/{userID} ───────────────────────────────────
        [HttpGet("student/{userID:int}")]
        public IActionResult GetStudent(int userID)
        {
            clsUser? user = clsUser.FindStudentByUserID(userID);

            if (user == null)
                return StudentHousingTM.Controllers.ApiResponse.NotFound(this, $"Student with UserID {userID} not found.");

            return StudentHousingTM.Controllers.ApiResponse.Ok(this, new
            {
                user.UserID,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.Nationality,
                user.NationalityID,
                user.Gender,
                user.GenderID,
                user.ProfilePhoto,
                user.CreatedAt,
                user.StudentProfileID,
                user.University,
                user.FieldOfStudy,
                user.YearOfStudyID,
                user.YearOfStudy,
                user.IsSmoker,
                user.HasPets,
            });
        }
    }
}