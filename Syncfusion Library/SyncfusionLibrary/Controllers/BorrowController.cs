using Microsoft.AspNetCore.Mvc;
 
namespace SyncfusionLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowController: ControllerBase
    {
        private readonly ApplicationDBContext _dbcontext;
        public BorrowController(ApplicationDBContext applicationDBContext)
        {
            _dbcontext=applicationDBContext;
        }
        [HttpGet]
        public IActionResult GetBorrows()
        {
            return Ok(_dbcontext.borrows.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetBorrow(int id)
        {
            var borrow=_dbcontext.borrows.FirstOrDefault(borrow=>borrow.BorrowID==id);
            if(borrow==null)
            {
                return NotFound();
            }
            return Ok(borrow);
        }

        [HttpPost]
        public IActionResult PostBorrow([FromBody] Borrows borrow)
        {
            _dbcontext.borrows.Add(borrow);
            _dbcontext.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult PutBorrow(int id,[FromBody] Borrows borrow)
        {
            var borrowOld=_dbcontext.borrows.FirstOrDefault(borrow=>borrow.BorrowID==id);
            if(borrowOld==null)
            {
                return NotFound();
            }

            borrowOld.BookID=borrow.BookID;
            borrowOld.BorrowedBookCount=borrow.BorrowedBookCount;
            borrowOld.BorrowedDate=borrow.BorrowedDate;
            borrowOld.PaidFineAmount=borrow.PaidFineAmount;
            borrowOld.Status=borrow.Status;
            borrowOld.UserID=borrow.UserID;
            _dbcontext.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBorrow(int id)
        {
            var borrow=_dbcontext.borrows.FirstOrDefault(borrow=>borrow.BorrowID==id);
            if(borrow==null)
            {
                return NotFound();
            }
            _dbcontext.borrows.Remove(borrow);
            _dbcontext.SaveChanges();
            return Ok();
        }
    }
}