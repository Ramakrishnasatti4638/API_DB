using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MedicalStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
      

        private readonly ApplicationDBContext _dbContext;
        public UserController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        // GET: api/Contacts
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_dbContext.users.ToList());
        }

        // GET: api/Contacts/1
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var user=_dbContext.users.FirstOrDefault(user=>user.UserID==id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        //Adding a new medicine
        // POST: api/Contacts
        [HttpPost]
        public IActionResult PostUser([FromBody] Users user)
        {
            _dbContext.users.Add(user);
            _dbContext.SaveChanges();
            return Ok();

        }

        // Updating an existing medicine
        // PUT: api/Contacts/1
        [HttpPut("{id}")]
        public IActionResult PutUser(int id, [FromBody] Users user)
        {
            var userOld=_dbContext.users.FirstOrDefault(user=>user.UserID==id);
           if(userOld==null)
            {
                return NotFound();
            }
            
            userOld.Name=user.Name;
            userOld.UserName=user.UserName;
            userOld.UserPassword=user.UserPassword;
            userOld.UserBalance=user.UserBalance;
            userOld.UserImage=user.UserImage;
             _dbContext.SaveChanges();
            return Ok();
        }

        // Deleting an existing medicine
        // DELETE: api/Contacts/1
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
             var user=_dbContext.users.FirstOrDefault(user=>user.UserID==id);
            if (user == null)
            {
                return NotFound();
            }
            _dbContext.users.Remove(user);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
