using System.Text.Json.Serialization;

namespace CollegeLostAndFound.API.Models
{
    public class Location
    {
        public int LocationID { get; set; }
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
