using Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Persistence.Applications;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EmployeeController(
		IEmployeeServices employeeServices

	) : ControllerBase
	{
		private readonly IEmployeeServices _employeeServices = employeeServices;

		[Authorize]
		[Permission("create.employee.information")]
		[HttpPost("save_employee_info")]
		public async Task<IActionResult> SaveEmployeeInformation([FromForm] int candidateId)
		{
			var result = await _employeeServices.SaveEmployeeInformationService(candidateId);
			return result;
		}
	}
}
