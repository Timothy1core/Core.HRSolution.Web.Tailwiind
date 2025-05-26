using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace HRIS.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IEmployeeDependentRepository
	{
		Task SaveEmployeeDependent(EmployeeDependent employeeDependents);
		Task UpdateEmployeeDependent(EmployeeDependent employeeDependentDto);
		Task<List<EmployeeDependentDto>> RetrieveEmployeeDependent(string employeeId);
	}
}
