namespace OnlineGroceryStore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("orders", Schema = "public")]
public class Orders
{
    [Key]
    public int OrderID { get; set; }
    public int UserID { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string PurchaseStatus { get; set; }
    public double TotalPrice { get; set; }
    public string ProductNames { get; set; }
}