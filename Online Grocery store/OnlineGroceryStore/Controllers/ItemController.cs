using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using MedicalStore;
using Microsoft.AspNetCore.Mvc;

namespace OnlineGroceryStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
      

        private readonly ApplicationDBContext _dbContext;
        public ItemController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        
        [HttpGet]
        public IActionResult GetItems()
        {
            return Ok(_dbContext.items.ToList());
        }

       
        [HttpGet("{id}")]
        public IActionResult GetItem(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var item=_dbContext.items.FirstOrDefault(item=>item.ItemID==id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        
        [HttpPost]
        public IActionResult PostItem([FromBody] Items item)
        {
            _dbContext.items.Add(item);
            _dbContext.SaveChanges();
            return Ok();

        }

        
        [HttpPut("{id}")]
        public IActionResult PutItem(int id, [FromBody] Items item)
        {
            var itemOld=_dbContext.items.FirstOrDefault(item=>item.ItemID==id);
           if(itemOld==null)
            {
                return NotFound();
            }
            
            itemOld.OrderID=item.OrderID;
            itemOld.ProductID=item.ProductID;
            itemOld.PurchaseCount=item.PurchaseCount;
            itemOld.PurchasePrice=item.PurchasePrice;
            itemOld.ProductName=item.ProductName;
             _dbContext.SaveChanges();
            return Ok();
        }

        
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
             var item=_dbContext.items.FirstOrDefault(item=>item.ItemID==id);
            if (item == null)
            {
                return NotFound();
            }
            _dbContext.items.Remove(item);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
