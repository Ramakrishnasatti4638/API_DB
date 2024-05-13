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
    public class OrderController : ControllerBase
    {


        private readonly ApplicationDBContext _dbContext;
        public OrderController(ApplicationDBContext applicationDBContext)
        {
            _dbContext = applicationDBContext;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(_dbContext.orders.ToList());
        }


        [HttpGet("{id}")]
        public IActionResult GetOrder(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var order = _dbContext.orders.FirstOrDefault(order => order.OrderID == id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }


        [HttpPost]
        public IActionResult PostItem([FromBody] Orders order)
        {
            _dbContext.orders.Add(order);
            _dbContext.SaveChanges();
            return Ok();

        }


        [HttpPut("{id}")]
        public IActionResult PutItem(int id, [FromBody] Orders order)
        {
            var orderOld = _dbContext.orders.FirstOrDefault(order => order.OrderID == id);
            if (orderOld == null)
            {
                return NotFound();
            }

            orderOld.UserID = order.UserID;
            orderOld.PurchaseDate = order.PurchaseDate;
            orderOld.PurchaseStatus = order.PurchaseStatus;
            orderOld.TotalPrice = order.TotalPrice;
            orderOld.ProductNames=order.ProductNames;
            _dbContext.SaveChanges();
            return Ok();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var item = _dbContext.items.FirstOrDefault(item => item.ItemID == id);
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
