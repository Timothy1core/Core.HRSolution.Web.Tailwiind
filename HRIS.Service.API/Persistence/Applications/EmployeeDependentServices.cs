using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;
using HRIS.Service.API.Persistence.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace HRIS.Service.API.Persistence.Applications
{
	public class EmployeeDependentServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<EmployeeServices> logger
	) : IEmployeeDependentServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<EmployeeServices> _logger = logger;

		public async Task<JsonResult> SaveEmployeeDependentService(EmployeeDependent employeeDependent)
		{
			JsonResult result;
			try
			{
				var employeeDependentDto = new EmployeeDependent()
				{
					EmployeeId = employeeDependent.EmployeeId,
					MemberCode = employeeDependent.MemberCode,
					FirstName = employeeDependent.FirstName,
					LastName = employeeDependent.LastName,
					BirthDate = employeeDependent.BirthDate,
					Effectivity = employeeDependent.Effectivity,
				};


				await _uoWForCurrentService.EmployeeDependentRepository.SaveEmployeeDependent(employeeDependentDto);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating employee dependent: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating employee dependent: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateEmployeeDependentService(string employeeId,
			EmployeeDependentDto employeeDependentDto)
		{
			JsonResult result;
			try
			{
				var employeeDependent = new EmployeeDependent()
				{
					EmployeeId = employeeId,
					MemberCode = employeeDependentDto.MemberCode,
					FirstName = employeeDependentDto.FirstName,
					LastName = employeeDependentDto.LastName,
					BirthDate = employeeDependentDto.BirthDate,
					Effectivity = employeeDependentDto.Effectivity,
				};
				await _uoWForCurrentService.EmployeeDependentRepository.UpdateEmployeeDependent(employeeDependent);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Employee Dependent Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating employee dependent: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating employee dependent: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
	}
}
