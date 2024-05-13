namespace SyncfusionLibrary;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("books",Schema ="public")]

public class Books{
    [Key]
    public int BookID { get; set; }
    public string BookName { get; set; }
    public string AuthorName { get; set; }
    public int BookCount { get; set; }
}