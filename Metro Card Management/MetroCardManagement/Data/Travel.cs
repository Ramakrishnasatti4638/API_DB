namespace MetroCardManagement;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("travel", Schema = "public")]
public class Travel
{
    [Key]
    public int TravelID { get; set; }
    public int CardNumber { get; set; }
    public string FromLocation { get; set; }
    public string ToLocation { get; set; }    
    public DateTime Date { get; set; }
    public double TravelCost { get; set; }
}