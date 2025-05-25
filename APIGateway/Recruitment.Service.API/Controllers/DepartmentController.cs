using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;
using System.Security.Claims;
using static SkiaSharp.HarfBuzz.SKShaper;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DepartmentController(
		IDepartmentServices departmentServices,
		IFileService fileService

	) : ControllerBase
	{
		private readonly IDepartmentServices _departmentServices = departmentServices;
		private readonly IFileService _fileService = fileService;

		[Authorize]
		[Permission("department.create")]
		[HttpPost("create_department")]
		public async Task<IActionResult> CreateDepartment([FromForm] DepartmentRequestDto departmentRequest)
		{
			JsonResult jsonResult;

			try
			{
				var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
				var result = await _departmentServices.CreateDepartment(departmentRequest, loggedEmployee);

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			
		}

		[Authorize]
		[Permission("department.retrieve.list")]
		[HttpGet("retrieve_dashboard_department")]
		public async Task<IActionResult> RetrieveDashboardDepartment([FromQuery] int groupId, [FromQuery] int serviceId, [FromQuery] int statusId)
		{
			JsonResult jsonResult;

			try
			{
				var result = await _departmentServices.RetrieveDepartmentDashboard(groupId, serviceId, statusId);

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { result.DashboardDtos})
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
		}

		[Authorize]
		[Permission("department.retrieve.info")]
		[HttpGet("retrieve_department_profile/{id}")]
		public async Task<IActionResult> RetrieveDepartment(int id)
		{
			JsonResult jsonResult;
			try
			{
				var result = await _departmentServices.RetrieveDepartmentInfo(id);

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { result.departmentInformation })
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
		}


		[Authorize]
		[Permission("department.update")]
		[HttpPut("update_department/{id}")]
		public async Task<IActionResult> UpdateDepartment(int id,[FromForm] DepartmentRequestDto companyRequest)
		{
			JsonResult jsonResult;
			try
			{
				var result = await _departmentServices.UpdateDepartment(id, companyRequest);

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
		}

		[Authorize]
		[Permission("department.individual.create")]
		[HttpPost("create_department_individual")]
		public async Task<IActionResult> CreateDepartmentIndividual([FromForm] int companyId, [FromForm] List<DepartmentIndividualDto> individuals)
		{

			var result = await _departmentServices.CreateDepartmentIndividuals(companyId, individuals);

			return result;
		}


		[Authorize]
		[Permission("department.individual.retrieve")]
		[HttpGet("retrieve_department_individuals/{companyId}")]
		public async Task<IActionResult> RetrieveDepartmentIndividuals(int companyId)
		{

			var result = await _departmentServices.RetrieveDepartmentIndividualDashboard(companyId);

			return result;
		}

		[Authorize]
		[Permission("department.individual.update")]
		[HttpPut("update_department_individual/{id}")]
		public async Task<IActionResult> UpdateDepartmentIndividual(int id, [FromForm] DepartmentIndividualDto individuals)
		{

			var result = await _departmentServices.UpdateDepartmentIndividual(id, individuals);

			return result;
		}



		#region MyRegion

		[AllowAnonymous]
		[HttpGet("department_logo/{id}")]
		public async Task<IActionResult> DepartmentLogo(int id)
		{

			var logo = await _departmentServices.RetrieveDepartmentLogo(id);

			return PhysicalFile(logo.filePath, logo.contentType);
		}

		[Authorize]
		[HttpGet("core_services_dropdown_list")]
		public async Task<IActionResult> CoreServicesDropDownList()
		{
			var value = await _departmentServices.RetrieveCoreServicesDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("department_status_dropdown_list")]
		public async Task<IActionResult> DepartmentStatusDropDownList()
		{
			var value = await _departmentServices.RetrieveDepartmentStatusDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("department_dropdown_list")]
		public async Task<IActionResult> DepartmentDropDownList()
		{
			var value = await _departmentServices.RetrieveDepartmentDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("employment_dropdown_list")]
		public async Task<IActionResult> EmploymentDropDownList()
		{
			var value = await _departmentServices.RetrieveEmploymentDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("job_status_dropdown_list")]
		public async Task<IActionResult> JobStatusDropDownList()
		{
			var value = await _departmentServices.RetrieveJobStatusDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("department_group_list")]
		public async Task<IActionResult> DepartmentGroup()
		{
			var value = await _departmentServices.DepartmentGroupDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("department_individual_list/{id}")]
		public async Task<IActionResult> DepartmentIndividualDropDownList(int id)
		{
			var value = await _departmentServices.DepartmentIndividualDropDown(id);

			return value;
		}

		[Authorize]
		[HttpGet("job_profile_list")]
		public async Task<IActionResult> DepartmentJobProfileDropDownList([FromQuery] int id)
		{
			var value = await _departmentServices.DepartmentJobProfileDropDown(id);

			return value;
		}


		[Authorize]
		[HttpGet("department_industries_dropdown_list")]
		public async Task<IActionResult> DepartmentIndustriesDropDownList()
		{
			JsonResult jsonResult;
			try
			{
				var result = await _departmentServices.RetrieveDepartmentIndustryDropDown();

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { result.DropDownValueDto })
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
		}

		[Authorize]
		[HttpGet("department_timezones_dropdown_list")]
		public async Task<IActionResult> DepartmentTimezonesDropDownList()
		{
			JsonResult jsonResult;
			try
			{
				var result = await _departmentServices.RetrieveDepartmentTimeZoneDropDown();

				if (result.IsSuccess)
				{
					jsonResult = new JsonResult(new { result.DropDownValueDto })
					{
						StatusCode = 200
					};
					return jsonResult;
				}

				jsonResult = new JsonResult(new { success = result.IsSuccess, responseText = result.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}
		}
		#endregion


	}
}
