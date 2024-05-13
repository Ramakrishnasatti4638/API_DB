using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MetroCardManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FairController : ControllerBase
    {
      

        private readonly ApplicationDBContext _dbContext;
        public FairController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        // GET: api/Contacts
        [HttpGet]
        public IActionResult GetFairs()
        {
            return Ok(_dbContext.fairs.ToList());
        }

        // GET: api/Contacts/1
        [HttpGet("{id}")]
        public IActionResult GetFair(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var fair=_dbContext.fairs.FirstOrDefault(fair=>fair.TicketID==id);
            if (fair == null)
            {
                return NotFound();
            }
            return Ok(fair);
        }

        //Adding a new medicine
        // POST: api/Contacts
        [HttpPost]
        public IActionResult PostFair([FromBody] Fair fair)
        {
            _dbContext.fairs.Add(fair);
            _dbContext.SaveChanges();
            return Ok();

        }

        // Updating an existing medicine
        // PUT: api/Contacts/1
        [HttpPut("{id}")]
        public IActionResult PutFair(int id, [FromBody] Fair fair)
        {
            var fairOld=_dbContext.fairs.FirstOrDefault(fair=>fair.TicketID==id);
           if(fairOld==null)
            {
                return NotFound();
            }
            
            fairOld.FromLocation=fair.FromLocation;
            fairOld.ToLocation=fair.ToLocation;
            fairOld.Price=fair.Price;
             _dbContext.SaveChanges();
            return Ok();
        }

        // Deleting an existing medicine
        // DELETE: api/Contacts/1
        [HttpDelete("{id}")]
        public IActionResult DeleteFair(int id)
        {
             var fair=_dbContext.fairs.FirstOrDefault(fair=>fair.TicketID==id);
            if (fair == null)
            {
                return NotFound();
            }
            _dbContext.fairs.Remove(fair);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
