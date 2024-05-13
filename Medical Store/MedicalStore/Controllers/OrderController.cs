using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using MedicalStore.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace MedicalStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        public OrderController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }

        // GET: api/Contacts
        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(_dbContext.orders.ToList());
        }

        // GET: api/Contacts/1
        [HttpGet("{id}")]
        public IActionResult GetOrder(int id)
        {
            var order=_dbContext.orders.FirstOrDefault(order=>order.OrderID==id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        //Adding a new medicine
        // POST: api/Contacts
        [HttpPost]
        public IActionResult PostOrder([FromBody] Orders order)
        {
            _dbContext.orders.Add(order);
            _dbContext.SaveChanges();
            return Ok();
        }

        // Updating an existing medicine
        // PUT: api/Contacts/1
        [HttpPut("{id}")]
        public IActionResult PutOrder(int id, [FromBody]  Orders order)
        {
            var orderOld=_dbContext.orders.FirstOrDefault(order=>order.OrderID==id);
            if(orderOld==null)
            {
                return NotFound();
            }
            orderOld.MedicineID=order.MedicineID;
            orderOld.UserID=order.UserID;
            orderOld.MedicineName=order.MedicineName;
            orderOld.MedicineCount=order.MedicineCount;
            orderOld.OrderStatusCancel=order.OrderStatusCancel;
            _dbContext.SaveChanges();
            return Ok();
        }

        // Deleting an existing medicine
        // DELETE: api/Contacts/1
        [HttpDelete("{id}")]
        public IActionResult DeleteOrder(int id)
        {
           var order=_dbContext.orders.FirstOrDefault(order=>order.MedicineID==id);
            if (order == null)
            {
                return NotFound();
            }
              _dbContext.orders.Remove(order);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
