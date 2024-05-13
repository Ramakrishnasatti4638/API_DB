namespace SyncfusionLibrary;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("users", Schema ="public")]

public class Users{
    [Key]
    public int UserID { get; set; }
    public string Name { get; set; }
    public string Gender { get; set; }
    public string Department { get; set; }
    public string UserPhone { get; set; }
    public string UserEmail { get; set; }
    public string UserPassword { get; set; }
    public double WalletBalance { get; set; }
}