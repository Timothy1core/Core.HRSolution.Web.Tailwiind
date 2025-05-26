namespace HRIS.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IEmployeeDocumentRepository
	{
		Task<EmployeeDocument> RetrieveEmployeeDocument(string employeeId, string documentType);
	}
}
