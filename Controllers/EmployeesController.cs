using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("/[controller]")]
    public class EmployeesController : Controller
    {
        private readonly IEmployeeRepository _repository;
        private readonly ILogger<EmployeesController> _logger;
        public EmployeesController(IEmployeeRepository repository, ILogger<EmployeesController> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var data = await _repository.GetAllAsync();
                return Json(new { data = data }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees");
                return StatusCode(500, "Error fetching employees");
            }
        }
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var emp = await _repository.GetByIdAsync(id);
                if (emp == null) return NotFound();
                return Json(emp);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employee {Id}", id);
                return StatusCode(500);
            }
        }

        [HttpPost("Save")]
       
        public async Task<IActionResult> Save([FromForm] Employee model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                if (model.empId == 0)
                {
                    var newId = await _repository.InsertAsync(model);
                    return Ok(new { success = true, newId });
                }
                else
                {
                    var ok = await _repository.UpdateAsync(model);
                    return Ok(new { success = ok });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving employee");
                return StatusCode(500, "Error saving employee");
            }
        }
        [HttpPost("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var ok = await _repository.DeleteAsync(id);
                return Ok(new { success = ok });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee {Id}", id);
                return StatusCode(500, "Error deleting employee");
            }
        }

        [HttpPost("CheckEmail")]
       
        public async Task<IActionResult> CheckEmail(string email, int id = 0)
        {
            var exists = await _repository.EmailExistsAsync(email, id);
            return Json(!exists); 
        }

    }
}
