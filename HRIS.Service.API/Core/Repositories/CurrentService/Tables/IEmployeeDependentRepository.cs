using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;

namespace HRIS.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IEmployeeDependentRepository
	{
		Task SaveEmployeeDependent(EmployeeDependent employeeDependents);
		Task UpdateEmployeeDependent(EmployeeDependent employeeDependentDto);
		Task<List<EmployeeDependentDto>> RetrieveEmployeeDependent(string employeeId);
	}
}
