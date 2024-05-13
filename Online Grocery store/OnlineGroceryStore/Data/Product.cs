namespace MedicalStore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("products", Schema = "public")]
public class Products
{
    [Key]
    public int ProductID { get; set; }
    public string ProductName { get; set; }
    public int QuantityAvailable { get; set; }
    public double  PricePerQuantity { get; set; }
    public DateTime ProductExpiry { get; set; }
    public byte[] ProductImage { get; set; }
}