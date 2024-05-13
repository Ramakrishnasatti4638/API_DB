using Microsoft.AspNetCore.Mvc;
 
namespace SyncfusionLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController: ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        public BookController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        [HttpGet]
        public IActionResult GetBooks()
        {
            return Ok(_dbContext.books.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            var book=_dbContext.books.FirstOrDefault(book=>book.BookID==id);
            if(book==null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpPost]
        public IActionResult PostBook([FromBody] Books book)
        {
            _dbContext.books.Add(book);
            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult PutBook(int id,[FromBody] Books book)
        {
            var bookOld=_dbContext.books.FirstOrDefault(book=>book.BookID==id);
            if(bookOld==null)
            {
                return NotFound();
            }

            bookOld.AuthorName=book.AuthorName;
            bookOld.BookCount=book.BookCount;
            bookOld.BookName=book.BookName;
            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book=_dbContext.books.FirstOrDefault(book=>book.BookID==id);
            if(book==null)
            {
                return NotFound();
            }
            _dbContext.books.Remove(book);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}