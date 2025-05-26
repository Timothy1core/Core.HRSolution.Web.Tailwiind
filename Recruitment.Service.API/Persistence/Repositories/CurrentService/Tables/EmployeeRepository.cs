using DocumentFormat.OpenXml.InkML;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class EmployeeRepository(CurrentServiceDbContext context) : IEmployeeRepository
	{
		public async Task SaveEmployeeInformation(EmployeeInformation employeeInformation)
		{
			await context.EmployeeInformations.AddAsync(employeeInformation);
		}

		public async Task SaveEmployeeDocument(EmployeeDocument employeeDocument)
		{
			await context.EmployeeDocuments.AddAsync(employeeDocument);
		}
	}
}
