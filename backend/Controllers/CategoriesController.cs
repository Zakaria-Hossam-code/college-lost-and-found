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
    public class CategoriesController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;

        public CategoriesController(LostAndFoundDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDto
                {
                    CategoryID = c.CategoryID,
                    Name = c.Name,
                    ReportsCount = c.Reports.Count
                })
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(categories);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var name = dto.Name.Trim();
            if (await _context.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower()))
                return BadRequest(new { message = "A category with this name already exists." });

            var category = new Category { Name = name };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new CategoryDto
            {
                CategoryID = category.CategoryID,
                Name = category.Name,
                ReportsCount = 0
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDto>> Update(int id, [FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found." });

            var name = dto.Name.Trim();
            if (await _context.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower() && c.CategoryID != id))
                return BadRequest(new { message = "A category with this name already exists." });

            category.Name = name;
            await _context.SaveChangesAsync();

            var count = await _context.Reports.CountAsync(r => r.CategoryID == id);

            return Ok(new CategoryDto
            {
                CategoryID = category.CategoryID,
                Name = category.Name,
                ReportsCount = count
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Reports)
                .FirstOrDefaultAsync(c => c.CategoryID == id);

            if (category == null)
                return NotFound(new { message = "Category not found." });

            if (category.Reports.Count > 0)
                return BadRequest(new { message = "Cannot delete category with associated reports. Reassign reports first." });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully." });
        }
    }
}
