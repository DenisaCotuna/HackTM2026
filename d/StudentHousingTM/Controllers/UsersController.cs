using BCrypt.Net;
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
            string Password,        // plain text — gets hashed before Insert
            string? PhoneNumber,
            int NationalityID,
            int GenderID,
            string Role,            // "Student" | "Owner"
            string? ProfilePhoto,

        string     University ,
    string FieldOfStudy ,
    int YearOfStudyID ,
  bool IsSmoker ,
   bool HasPets ,

    //Owner-only
    int NumberOfProperties,
       bool RequiresInsurance ,
    bool AcceptsInternational
    
        );

        public record LoginRequest(
            string Email,
            string Password         // plain text — verified against stored hash
        );

        public record UpdateUserRequest(
            string FullName,
            string? PhoneNumber,
            int NationalityID,
            int GenderID,
            string? ProfilePhoto
        );

        public record UpdatePasswordRequest(
            string OldPassword,     // must verify before changing
            string NewPassword      // plain text — gets hashed before Update
        );

        // ── Safe response: never expose PasswordHash ────────────────────────────

        private static object SafeUser(UserBLL u) => new
        {
            u.UserID,
            u.FullName,
            u.Email,
            u.PhoneNumber,
            u.NationalityID,
            u.GenderID,
            u.Role,
            u.ProfilePhoto,
            u.CreatedAt,
            u.IsActive
        };

        // ── Endpoints ───────────────────────────────────────────────────────────

        // GET /api/users
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = UserBLL.GetAllUsers();
            return Ok(users.Select(SafeUser));
        }

        // GET /api/users/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetByID(int id)
        {
            var user = UserBLL.GetByID(id);
            if (user == null) return NotFound(new { message = "User not found." });
            return Ok(SafeUser(user));
        }

        // POST /api/users/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Email and password are required." });

            Console.WriteLine("Email: " + req.Email + "Password: " + req.Password);
            var user = UserBLL.GetByEmail(req.Email);




            // Same message for both "not found" and "wrong password" — no user enumeration
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password." });

            if (!user.IsActive)
                return Unauthorized(new { message = "Account is deactivated." });

            return Ok(SafeUser(user));
        }

        // POST /api/users  (Register)
        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (req.Role != "Student" && req.Role != "Owner")
                return BadRequest(new { message = "Role must be 'Student' or 'Owner'." });

            if (string.IsNullOrWhiteSpace(req.Password) || req.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters." });

            Console.WriteLine("Role: " + req.Role + " Full name: " + req.FullName + " Email: " + req.Email + " Password: " + 
                req.Password + " Phone number: " + req.PhoneNumber + " Nationality: " + req.NationalityID + " Gender: " + req.GenderID 
                + "Profile photo: " + req.ProfilePhoto);

            // Hash before storing
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            int newID = UserBLL.Insert(
                req.FullName, req.Email, passwordHash,
                req.PhoneNumber, req.NationalityID, req.GenderID,
                req.Role, req.ProfilePhoto,req.University,req.FieldOfStudy, req.YearOfStudyID, req.IsSmoker,
                req.HasPets, req.NumberOfProperties, req.RequiresInsurance, req.AcceptsInternational
            );

            return CreatedAtAction(nameof(GetByID), new { id = newID }, new { userID = newID });
        }

        // PUT /api/users/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateUserRequest req)
        {
            int rows = UserBLL.Update(
                id, req.FullName, req.PhoneNumber,
                req.NationalityID, req.GenderID, req.ProfilePhoto
            );

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
            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
                return BadRequest(new { message = "New password must be at least 6 characters." });

            // Verify old password first
            var user = UserBLL.GetByID(id);
            if (user == null) return NotFound(new { message = "User not found." });

            if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, user.PasswordHash))
                return Unauthorized(new { message = "Old password is incorrect." });

            string newHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            UserBLL.UpdatePassword(id, newHash);

            return NoContent();
        }
    }
}