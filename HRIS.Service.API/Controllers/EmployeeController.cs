using System.Security.Claims;
using System.Threading.Tasks;
using Authentication;
using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;
using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeSummary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRIS.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EmployeeController(
			IEmployeeServices employeeServices,
			IEmployeeDependentServices employeeDependentServices,
			IEmployeeDocumentServices employeeDocumentServices

		) : ControllerBase
	{
		private readonly IEmployeeServices _employeeServices = employeeServices;
		private readonly IEmployeeDependentServices _employeeDependentServices = employeeDependentServices;
		private readonly IEmployeeDocumentServices _employeeDocumentServices = employeeDocumentServices;

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpPost("employee_list")]
		public async Task<IActionResult> RetrieveDashboardForJobOffer([FromForm] string? search)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;

			var result = await _employeeServices.RetrieveAllEmployeeService(
				search, start, length, draw,
				sortColumnName, sortDirection);
			;
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_employee/{id}")]
		public async Task<IActionResult> RetrieveEmployeeInfo(string id)
		{

			var result = await _employeeServices.RetrieveEmployeeInfoService(id);

			return result;

		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_personal_details/{id}")]
		public async Task<IActionResult> UpdatePersonalDetails(string id, [FromForm] PersonalDetailsDto personalDetailsDto)
		{
			var result = await _employeeServices.UpdatePersonalDetailsService(id, personalDetailsDto);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_work_details/{id}")]
		public async Task<IActionResult> UpdateWorkDetails(string id, [FromForm] WorkDetailsDto workDetailsDto)
		{
			var result = await _employeeServices.UpdateWorkDetailsService(id, workDetailsDto);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_employee_medicard/{id}")]
		public async Task<IActionResult> UpdateEmployeeMedicard(string id, [FromForm] EmployeeMedicardDto employeeMedicardDto)
		{
			var result = await _employeeServices.UpdateEmployeeMedicardService(id, employeeMedicardDto);
			return result;
		}

		[AllowAnonymous]
		[HttpPost("save_employee_dependent")]
		public async Task<IActionResult> SaveEmployeeDependent([FromForm] EmployeeDependent employeeDependentDto)
		{

			var result = await _employeeDependentServices.SaveEmployeeDependentService(employeeDependentDto);

			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_employee_dependent/{id}")]
		public async Task<IActionResult> UpdateEmployeeDependent(string id, [FromForm] EmployeeDependentDto employeeDependent)
		{
			var result = await _employeeDependentServices.UpdateEmployeeDependentService(id, employeeDependent);
			return result;
		}

		[AllowAnonymous]
		[HttpGet("employee_document/{id}/{documentType}")]
		public async Task<IActionResult> CandidateDocument(string id, string documentType, int documentGroup)
		{

			var document = await _employeeDocumentServices.RetrieveEmployeeDocumentService(id, documentType, documentGroup);

			return PhysicalFile(document.filePath, document.contentType);
		}

		#region costing

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_employee_costing/{id}")]
		public async Task<IActionResult> RetrieveEmployeeCosting(string id)
		{

			var result = await _employeeServices.RetrieveCostingDetailsService(id);
			return result;

		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPost("update_employee_costing")]
		public async Task<IActionResult> UpdateEmployeeCosting([FromForm] CostingDetailsDto costingDetailsDto)
		{
			var result = await _employeeServices.UpdateCostingDetailsService(costingDetailsDto);
			return result;
		}


		[Authorize]
		// [Permission("hris.export.employee.costing")]
		[HttpGet("export_employee_costing")]
		public async Task<IActionResult> ExportEmployeeCosting()
		{

			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var exportResult = await _employeeServices.ExportEmployeeCostingDetailsService(loggedEmployee);
			return File(exportResult.FileContents, exportResult.ContentType, exportResult.FileName);
		}

		#endregion
	}
}
