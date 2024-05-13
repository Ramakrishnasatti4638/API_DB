namespace SyncfusionLibrary;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table ("borrows",Schema ="public")]

public class Borrows{
    [Key]
    public int BorrowID { get; set; }
    public int BookID { get; set; }
    public int UserID { get; set; }
    public DateTime BorrowedDate { get; set; }
    public int BorrowedBookCount { get; set; }
    public string Status { get; set; }
    public double PaidFineAmount { get; set; }
}