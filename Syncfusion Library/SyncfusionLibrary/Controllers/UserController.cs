using Microsoft.AspNetCore.Mvc;

namespace SyncfusionLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController:ControllerBase
    {
        private readonly ApplicationDBContext _dbcontext;
        public UserController(ApplicationDBContext applicationDBContext)
        {
            _dbcontext=applicationDBContext;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_dbcontext.users.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user=_dbcontext.users.FirstOrDefault(user=>user.UserID==id);
            if(user==null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult PostUser([FromBody] Users user)
        {
            _dbcontext.users.Add(user);
            _dbcontext.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult PutUser(int id,[FromBody] Users user)
        {
            var userOld=_dbcontext.users.FirstOrDefault(user=>user.UserID==id);
            if(userOld==null)
            {
                return NotFound();
            }

            userOld.Name=user.Name;
            userOld.Department=user.Department;
            userOld.Gender=user.Gender;
            userOld.UserEmail=user.UserEmail;
            userOld.UserPassword=user.UserPassword;
            userOld.UserPhone=user.UserPhone;
            userOld.WalletBalance=user.WalletBalance;
            _dbcontext.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user=_dbcontext.users.FirstOrDefault(user=>user.UserID==id);
            if(user==null)
            {
                return NotFound();
            }
            _dbcontext.users.Remove(user);
            _dbcontext.SaveChanges();
            return Ok();
        }
    }
}