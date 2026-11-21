using System.Text.Json.Serialization;

namespace CollegeLostAndFound.API.Models
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
