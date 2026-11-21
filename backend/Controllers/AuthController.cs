using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;
using CollegeLostAndFound.API.Models;
using CollegeLostAndFound.API.Services;

namespace CollegeLostAndFound.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(LostAndFoundDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var normalizedUsername = dto.Username.Trim().ToLower();
            var normalizedEmail = dto.Email.Trim().ToLower();

            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == normalizedUsername))
                return BadRequest(new { message = "Username is already taken." });

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail))
                return BadRequest(new { message = "Email is already registered." });

            var user = new User
            {
                Username = dto.Username.Trim(),
                Email = normalizedEmail,
                Phone = dto.Phone.Trim(),
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User", // Default role
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserProfileDto
                {
                    UserID = user.UserID,
                    Username = user.Username,
                    Email = user.Email,
                    Phone = user.Phone,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var input = dto.UsernameOrEmail.Trim().ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == input || u.Email.ToLower() == input);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized(new { message = "Invalid username/email or password." });

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserProfileDto
                {
                    UserID = user.UserID,
                    Username = user.Username,
                    Email = user.Email,
                    Phone = user.Phone,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                }
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(new UserProfileDto
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var normalizedEmail = dto.Email.Trim().ToLower();
            if (user.Email.ToLower() != normalizedEmail &&
                await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail && u.UserID != userId))
            {
                return BadRequest(new { message = "Email is already in use by another account." });
            }

            user.Email = normalizedEmail;
            user.Phone = dto.Phone.Trim();

            if (!string.IsNullOrEmpty(dto.NewPassword))
            {
                if (string.IsNullOrEmpty(dto.CurrentPassword) || !BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                {
                    return BadRequest(new { message = "Current password is required and must match." });
                }
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok(new UserProfileDto
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }
    }
}
