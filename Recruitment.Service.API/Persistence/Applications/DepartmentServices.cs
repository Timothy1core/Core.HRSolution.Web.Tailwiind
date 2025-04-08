using FileServiceLibrary;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;
using Recruitment.Service.API.Core.UnitOfWork;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class DepartmentServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<DepartmentServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IFileService fileService
		) : IDepartmentServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<DepartmentServices> _logger = logger;
		private readonly IFileService _fileService = fileService;

		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task<JsonResult> CreateDepartment(DepartmentRequestDto department,string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var company = new Department()
				{
					Logo = department.Logo.FileName,
					Name = department.Name,
					Industry = department.Industry,
					Alias = department.Alias,
					Website = department.Website,
					Timezone = department.Timezone,
					TimezoneOffset = department.TimezoneOffset,
					CoreServiceId = department.CoreServiceId,
					DepartmentStatusId = department.DepartmentStatusId,
					IsActive = true,
					CreatedBy = loggedEmployee,
					CreatedDate = DateTime.UtcNow.AddHours(8),
					DepartmentGroupId = 2,
					DepartmentIndividuals = department.Individuals.Select( x => new DepartmentIndividual()
					{
						Name = x.Name,
						Email = x.Email,
						Position = x.Position,
						IsActive = true
					} ).ToList()
					
				};
				await _uoWForCurrentService.DepartmentRepository.CreateDepartment(company);
				await _uoWForCurrentService.CommitAsync();

				var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", company.Id.ToString());
				if (!Directory.Exists(rootFilePath))
				{
					Directory.CreateDirectory(rootFilePath);
				}
				await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath, department.Logo.FileName), FileMode.Create);
				await department.Logo.CopyToAsync(preRequisiteFileStream);



				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating department: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating department: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveDepartmentDashboard(int groupId, int serviceId, int statusId)
		{
			JsonResult result;
			try
			{
				
				

				var companies = await _uoWForCurrentService.DepartmentRepository.RetrieveDepartmentProfileDashboard(groupId, serviceId, statusId);
				
				result = new JsonResult(new
				{
					companies,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving department: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveDepartmentInfo(int id)
		{
			JsonResult result;
			try
			{
				var profile =await _uoWForCurrentService.DepartmentRepository.RetrieveDepartmentProfileInfo(id);
				
				result = new JsonResult(new
				{
					profile
					
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving department: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateDepartment(int id,DepartmentRequestDto department)
		{
			JsonResult result;
			try
			{
				
				await _uoWForCurrentService.DepartmentRepository.UpdateDepartment(id, department);
				await _uoWForCurrentService.CommitAsync();

				if (department.Logo != null)
				{
					var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", id.ToString(), department.Logo.FileName);
					if (!File.Exists(rootFilePath))
					{
						await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath), FileMode.Create);
						await department.Logo.CopyToAsync(preRequisiteFileStream);
					}
				}
				
				

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating department: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating department: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> CreateDepartmentIndividuals(int companyId, List<DepartmentIndividualDto> departmentIndividuals)
		{
			JsonResult result;
			try
			{
				var individuals = departmentIndividuals.Select(s => new DepartmentIndividual()
				{
					DepartmentId = companyId,
					Name = s.Name,
					Email = s.Email,
					Position = s.Position
				}).ToList();
				
				await _uoWForCurrentService.DepartmentRepository.CreateDepartmentIndividual(individuals);
				await _uoWForCurrentService.CommitAsync();

				


				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating department individuals: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating department individuals: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveDepartmentIndividualDashboard(int clientCompanyId)
		{
			JsonResult result;
			try
			{

				var individuals = await _uoWForCurrentService.DepartmentRepository.RetrieveDepartmentIndividuals(clientCompanyId);

				result = new JsonResult(new
				{
					individuals,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department individuals: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving department individuals: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateDepartmentIndividual(int id, DepartmentIndividualDto departmentIndividual)
		{
			JsonResult result;
			try
			{
				departmentIndividual.Id = id;
				await _uoWForCurrentService.DepartmentRepository.UpdateDepartmentIndividual(departmentIndividual);
				await _uoWForCurrentService.CommitAsync();


				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating department: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating department: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		

		#region MyRegion

		public async Task<JsonResult> RetrieveCoreServicesDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.CoreServiceRepository.SelectCoreServiceDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving core services drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving core services drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveDepartmentStatusDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.DepartmentStatusRepository.SelectDepartmentStatusDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving client status drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving client status drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveDepartmentDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.DepartmentRepository.SelectDepartmentDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving client drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving client drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveEmploymentDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.EmploymentTypeRepository.SelectCoreServiceDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving employment drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while employment client drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveJobStatusDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.JobStatusRepository.SelectJobStatusDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving job status drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving job status drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> DepartmentGroupDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.DepartmentGroupRepository.SelectClientCompanyGroup();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving departments drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving departments drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> DepartmentIndividualDropDown(int id)
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.DepartmentRepository.SelectDepartmentIndividualDropDown(id);

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> DepartmentJobProfileDropDown(int id)
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.JobProfileRepository.SelectJobProfilesDropDown(id);

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<(string filePath, string contentType)> RetrieveDepartmentLogo(int companyId)
		{
			try
			{
				var company = await _uoWForCurrentService.DepartmentRepository.RetrieveDepartmentProfileInfo(companyId);
				var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", company.Id.ToString(), company.Logo);

				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{rootFilePath}");

				return (filePath, contentType);

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}

		#endregion

	}
}
