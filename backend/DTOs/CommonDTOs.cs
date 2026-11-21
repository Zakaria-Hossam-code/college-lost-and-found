using System.ComponentModel.DataAnnotations;

namespace CollegeLostAndFound.API.DTOs
{
    public class CategoryDto
    {
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ReportsCount { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }

    public class LocationDto
    {
        public int LocationID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ReportsCount { get; set; }
    }

    public class CreateLocationDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;
    }
}
