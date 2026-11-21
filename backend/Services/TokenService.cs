using System.IdentityModel.Tokens.Jwt;
using System.Text;
using CollegeLostAndFound.API.Models;
using Microsoft.IdentityModel.Tokens;
using SecurityClaim = System.Security.Claims.Claim;
using SecurityClaimsIdentity = System.Security.Claims.ClaimsIdentity;
using SecurityClaimTypes = System.Security.Claims.ClaimTypes;

namespace CollegeLostAndFound.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(User user)
        {
            var keyString = _config["Jwt:Key"] ?? "CollegeLostAndFoundSuperSecretKeyThatIsAtLeast32BytesLong!";
            var issuer = _config["Jwt:Issuer"] ?? "CollegeLostAndFound";
            var audience = _config["Jwt:Audience"] ?? "CollegeLostAndFoundApp";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<SecurityClaim>
            {
                new(SecurityClaimTypes.NameIdentifier, user.UserID.ToString()),
                new(SecurityClaimTypes.Name, user.Username),
                new(SecurityClaimTypes.Email, user.Email),
                new(SecurityClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new SecurityClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
