using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace HRIS.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class EmployeeDocumentRepository(CurrentServiceDbContext context) : IEmployeeDocumentRepository
	{
		public async Task<EmployeeDocument> RetrieveEmployeeDocument(string employeeId, string documentType)
		{
			var employeeDocumentInfo = await context.EmployeeDocuments
				.Where(w => w.EmployeeId == employeeId && w.DocumentType == documentType)
				.Select(s => new EmployeeDocument
				{
					EmployeeId = s.EmployeeId,
					FileName = s.FileName,
					DocumentType = s.DocumentType,
					DateSubmitted = s.DateSubmitted,
					DocumentGroup = s.DocumentGroup,
				})
				.FirstOrDefaultAsync();
			return employeeDocumentInfo!;
		}
	}
}
