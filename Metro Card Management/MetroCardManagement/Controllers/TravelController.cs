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
    public class TravelController : ControllerBase
    {
      

        private readonly ApplicationDBContext _dbContext;
        public TravelController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        // GET: api/Contacts
        [HttpGet]
        public IActionResult GetTravels()
        {
            return Ok(_dbContext.travels.ToList());
        }

        // GET: api/Contacts/1
        [HttpGet("{id}")]
        public IActionResult GetTravel(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var travel=_dbContext.travels.FirstOrDefault(travel=>travel.TravelID==id);
            if (travel == null)
            {
                return NotFound();
            }
            return Ok(travel);
        }

        //Adding a new medicine
        // POST: api/Contacts
        [HttpPost]
        public IActionResult PostTravel([FromBody] Travel travel)
        {
            _dbContext.travels.Add(travel);
            _dbContext.SaveChanges();
            return Ok();

        }

        // Updating an existing medicine
        // PUT: api/Contacts/1
        [HttpPut("{id}")]
        public IActionResult PutTravel(int id, [FromBody] Travel travel)
        {
            var travelOld=_dbContext.travels.FirstOrDefault(travel=>travel.TravelID==id);
           if(travelOld==null)
            {
                return NotFound();
            }
            
            travelOld.CardNumber=travel.CardNumber;
            travelOld.FromLocation=travel.FromLocation;
            travelOld.ToLocation=travel.ToLocation;
            travelOld.Date=travel.Date;
            travelOld.TravelCost=travel.TravelCost;
             _dbContext.SaveChanges();
            return Ok();
        }

        // Deleting an existing medicine
        // DELETE: api/Contacts/1
        [HttpDelete("{id}")]
        public IActionResult DeleteTravel(int id)
        {
             var travel=_dbContext.travels.FirstOrDefault(travel=>travel.TravelID==id);
            if (travel == null)
            {
                return NotFound();
            }
            _dbContext.travels.Remove(travel);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
