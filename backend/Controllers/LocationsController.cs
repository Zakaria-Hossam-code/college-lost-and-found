using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;
using CollegeLostAndFound.API.Models;

namespace CollegeLostAndFound.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;

        public LocationsController(LostAndFoundDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<LocationDto>>> GetAll()
        {
            var locations = await _context.Locations
                .Select(l => new LocationDto
                {
                    LocationID = l.LocationID,
                    Name = l.Name,
                    ReportsCount = l.Reports.Count
                })
                .OrderBy(l => l.Name)
                .ToListAsync();

            return Ok(locations);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<LocationDto>> Create([FromBody] CreateLocationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var name = dto.Name.Trim();
            if (await _context.Locations.AnyAsync(l => l.Name.ToLower() == name.ToLower()))
                return BadRequest(new { message = "A location with this name already exists." });

            var location = new Location { Name = name };
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new LocationDto
            {
                LocationID = location.LocationID,
                Name = location.Name,
                ReportsCount = 0
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<LocationDto>> Update(int id, [FromBody] CreateLocationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var location = await _context.Locations.FindAsync(id);
            if (location == null)
                return NotFound(new { message = "Location not found." });

            var name = dto.Name.Trim();
            if (await _context.Locations.AnyAsync(l => l.Name.ToLower() == name.ToLower() && l.LocationID != id))
                return BadRequest(new { message = "A location with this name already exists." });

            location.Name = name;
            await _context.SaveChangesAsync();

            var count = await _context.Reports.CountAsync(r => r.LocationID == id);

            return Ok(new LocationDto
            {
                LocationID = location.LocationID,
                Name = location.Name,
                ReportsCount = count
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var location = await _context.Locations
                .Include(l => l.Reports)
                .FirstOrDefaultAsync(l => l.LocationID == id);

            if (location == null)
                return NotFound(new { message = "Location not found." });

            if (location.Reports.Count > 0)
                return BadRequest(new { message = "Cannot delete location with associated reports. Reassign reports first." });

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Location deleted successfully." });
        }
    }
}
