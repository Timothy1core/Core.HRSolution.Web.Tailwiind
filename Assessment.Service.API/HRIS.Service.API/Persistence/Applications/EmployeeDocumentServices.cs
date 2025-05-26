
using FileServiceLibrary;
using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Persistence.UnitOfWork;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace HRIS.Service.API.Persistence.Applications
{
	public class EmployeeDocumentServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<EmployeeServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IFileService fileService
	) : IEmployeeDocumentServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<EmployeeServices> _logger = logger;
		private readonly IFileService _fileService = fileService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task<(string filePath, string contentType)> RetrieveEmployeeDocumentService(string employeeId, string documentType, int documentGroup)
		{
			try
			{
				var candidate = await _uoWForCurrentService.EmployeeDocumentRepository.RetrieveEmployeeDocument(employeeId, documentType);
				var rootFilePath = Path.Combine(_fileRootFolder!, "employee_documents", employeeId, documentGroup == 1 ? "201" : "202" , candidate.FileName);

				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{rootFilePath}");

				return (filePath, contentType);

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate resume: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}
	}
}
