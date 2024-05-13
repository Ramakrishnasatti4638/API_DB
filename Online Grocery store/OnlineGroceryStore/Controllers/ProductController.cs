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
    public class ProductController : ControllerBase
    {
      

        private readonly ApplicationDBContext _dbContext;
        public ProductController(ApplicationDBContext applicationDBContext)
        {
            _dbContext=applicationDBContext;
        }
        
        [HttpGet]
        public IActionResult GetProducts()
        {
            return Ok(_dbContext.products.ToList());
        }

       
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            // var medicine = _Users.Find(m => m.UserID == id);
            var product=_dbContext.products.FirstOrDefault(product=>product.ProductID==id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        
        [HttpPost]
        public IActionResult PostProduct([FromBody] Products product)
        {
            _dbContext.products.Add(product);
            _dbContext.SaveChanges();
            return Ok();

        }

        
        [HttpPut("{id}")]
        public IActionResult PutProduct(int id, [FromBody] Products product)
        {
            var productOld=_dbContext.products.FirstOrDefault(product=>product.ProductID==id);
           if(productOld==null)
            {
                return NotFound();
            }
            
            productOld.ProductName=product.ProductName;
            productOld.QuantityAvailable=product.QuantityAvailable;
            productOld.PricePerQuantity=product.PricePerQuantity;
            productOld.ProductExpiry=product.ProductExpiry;
            productOld.ProductImage=product.ProductImage;
             _dbContext.SaveChanges();
            return Ok();
        }

        
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
             var product=_dbContext.products.FirstOrDefault(product=>product.ProductID==id);
            if (product == null)
            {
                return NotFound();
            }
            _dbContext.products.Remove(product);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
