using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;
using Microsoft.AspNetCore.Mvc;

namespace HRIS.Service.API.Core.Applications
{
	public interface IEmployeeDependentServices
	{
		Task<JsonResult> SaveEmployeeDependentService(EmployeeDependent employeeDependent);
		Task<JsonResult> UpdateEmployeeDependentService(string employeeId,
			EmployeeDependentDto employeeDependentDto);
	}
}
