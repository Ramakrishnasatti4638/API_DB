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
    public class MedicineController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        public MedicineController(ApplicationDBContext applicationDBContext )
        {
            _dbContext=applicationDBContext;
        }

        // GET: api/Contacts
        [HttpGet]
        public IActionResult GetContacts()
        {
            return Ok(_dbContext.medicines.ToList());
        }

        // GET: api/Contacts/1
        [HttpGet("{id}")]
        public IActionResult GetMedicine(int id)
        {
            var medicine=_dbContext.medicines.FirstOrDefault(medicine=>medicine.MedicineID==id);
            if(medicine==null)
            {
                return NotFound();
            }
            return Ok(medicine);
        }

        //Adding a new medicine
        // POST: api/Contacts
        [HttpPost]
        public IActionResult PostMedicine([FromBody] Medicines medicine)
        {
            _dbContext.medicines.Add(medicine);
            _dbContext.SaveChanges();
            return Ok();
        }

        // Updating an existing medicine
        // PUT: api/Contacts/1
        [HttpPut("{id}")]
        public IActionResult PutMedicine(int id,[FromBody] Medicines medicine)
        {
            var medicineOld=_dbContext.medicines.FirstOrDefault(medicine=>medicine.MedicineID==id);
            if(medicine==null)
            {
                return NotFound();
            }

            
            medicineOld.MedicineName=medicine.MedicineName;
            medicineOld.MedicinePrice=medicine.MedicinePrice;
            medicineOld.MedicineCount=medicine.MedicineCount;
            medicineOld.MedicineExpiry=medicine.MedicineExpiry;
            medicineOld.MedicineImage=medicine.MedicineImage;
            _dbContext.SaveChanges();
            return Ok();
        }

        // Deleting an existing medicine
        // DELETE: api/Contacts/1
        [HttpDelete("{id}")]
        public IActionResult DeleteMedicine(int id)
        {
        var medicine=_dbContext.medicines.FirstOrDefault(medicine=>medicine.MedicineID==id);
            if(medicine==null)
            {
                return NotFound();
            }
            _dbContext.medicines.Remove(medicine);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
