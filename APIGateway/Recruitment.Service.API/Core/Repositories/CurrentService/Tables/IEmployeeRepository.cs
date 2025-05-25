using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IEmployeeRepository
	{
		Task SaveEmployeeInformation(EmployeeInformation employeeInformation);
		Task SaveEmployeeDocument(EmployeeDocument employeeDocument);
	}
}
