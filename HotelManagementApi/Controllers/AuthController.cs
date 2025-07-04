// Controllers/AuthController.cs
using HotelManagementApi.Data;
using HotelManagementApi.Models;
using HotelManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;
using BCrypt.Net;

namespace HotelManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;


        public AuthController(ApplicationDbContext context, AuthService authService, IConfiguration configuration)
        {
            _context = context;
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null || !VerifyPassword(model.Password, user.Password))
            {
                return Unauthorized(new { Message = "Invalid username or password" });
            }

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                Role = user.Role,
                Username = user.Username,
                UserId = user.UserId
            });
        }

        [Authorize(Roles = "Admin")] // Only admins can register new users
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest(new { Message = "Username already exists" });
            }

            // Validate role
            if (model.Role != "Admin" && model.Role != "Receptionist")
            {
                return BadRequest(new { Message = "Invalid role specified" });
            }

            var user = new User
            {
                Username = model.Username,
                Password = HashPassword(model.Password), // Hash the password
                Role = model.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully" });
        }

        // Password hashing function (use a proper hashing algorithm like BCrypt in production)
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password + _configuration["Auth:Pepper"]);
        }


        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword + _configuration["Auth:Pepper"], storedHash);
        }

        public class LoginModel
        {
            [Required]
            public string Username { get; set; }

            [Required]
            public string Password { get; set; }
        }

        public class RegisterModel
        {
            [Required]
            [StringLength(50, MinimumLength = 3)]
            public string Username { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 6)]
            public string Password { get; set; }

            [Required]
            public string Role { get; set; } // Admin or Receptionist
        }
    }
}