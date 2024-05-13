namespace MedicalStore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("items", Schema = "public")]
public class Items
{
    [Key]
    public int ItemID { get; set; }
    public int OrderID { get; set; }
    public int ProductID { get; set; }
    public int PurchaseCount { get; set; }
    public double PurchasePrice { get; set; }
    public string ProductName { get; set; }
}