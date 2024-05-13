namespace MedicalStore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("medicines", Schema = "public")]
public class Medicines
{
    [Key]
    public int MedicineID { get; set; }
    public string MedicineName { get; set; }
    public double MedicinePrice { get; set; }
    public int MedicineCount { get; set; }
    public DateTime MedicineExpiry { get; set; }
    public byte[] MedicineImage {get; set;}
}