namespace MetroCardManagement;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("fair", Schema = "public")]
public class Fair
{
    [Key]
    public int TicketID { get; set; }
    public string FromLocation { get; set; }
    public string ToLocation { get; set; }      
    public double Price { get; set; }
}