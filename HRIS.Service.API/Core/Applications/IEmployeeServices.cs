using HRIS.Service.API.Core.Models.CurrentService.Dto;
using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HRIS.Service.API.Core.Applications
{
	public interface IEmployeeServices
	{
		Task<JsonResult> RetrieveAllEmployeeService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection);
		Task<JsonResult> RetrieveEmployeeInfoService(string employeeId);
		Task<JsonResult> UpdatePersonalDetailsService(string employeeId,PersonalDetailsDto personalDetailsDto);
		Task<JsonResult> UpdateWorkDetailsService(string employeeId, WorkDetailsDto workDetailsDto);
		Task<JsonResult> UpdateEmployeeMedicardService(string employeeId, EmployeeMedicardDto employeeMedicard);

		Task<JsonResult> UpdateCostingDetailsService(CostingDetailsDto costingDetailsDto);
		Task<JsonResult> RetrieveCostingDetailsService(string employeeId);
		Task<ExportFileResultDto> ExportEmployeeCostingDetailsService(string loggedEmployee);
		
	}
}
