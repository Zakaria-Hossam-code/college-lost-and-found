using CollegeLostAndFound.API.Models;

namespace CollegeLostAndFound.API.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
