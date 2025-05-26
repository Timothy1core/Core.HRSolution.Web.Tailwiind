namespace HRIS.Service.API.Core.Applications
{
	public interface IEmployeeDocumentServices
	{
		Task<(string filePath, string contentType)> RetrieveEmployeeDocumentService(string employeeId, string documentType, int documentGroup);
	}
}
