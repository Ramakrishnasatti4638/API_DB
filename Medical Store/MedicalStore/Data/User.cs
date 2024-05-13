namespace MedicalStore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("users", Schema = "public")]
public class Users
{
    [Key]
    public int UserID { get; set; }
    public string Name { get; set; }
    public string UserName { get; set; }    
    public string UserPassword { get; set; }
    public double UserBalance { get; set; }
    public byte[] UserImage { get; set; }
}