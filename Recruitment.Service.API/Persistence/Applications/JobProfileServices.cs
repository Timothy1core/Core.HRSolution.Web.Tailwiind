using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.ExtendedProperties;
using FileServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;
using Recruitment.Service.API.Core.UnitOfWork;
using Recruitment.Service.API.Persistence.Helpers;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class JobProfileServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<JobProfileServices> logger,
		IJobProfileHelper jobProfileHelper,
		IFileService fileService,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration

		) : IJobProfileServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly IJobProfileHelper _helper = jobProfileHelper;
		private readonly IFileService _fileService = fileService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;
		private readonly ILogger<JobProfileServices> _logger = logger;

		public async Task<JsonResult> CreateClientJobProfile(ClientJobProfileRequestDto jobProfileRequest, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var defaultAssessments = Enumerable.Range(1, 5).Select(assessmentId => new JobAssessment { AssessmentId = null }).ToList();
				var jobProfile = new JobProfile()
				{
					DepartmentId = jobProfileRequest.DepartmentId,
					Position = jobProfileRequest.Position,
					EmploymentTypeId = jobProfileRequest.EmploymentTypeId,
					JobStatusId = jobProfileRequest.JobStatusId,
					JobDescription = jobProfileRequest.JobDescription,
					Education = jobProfileRequest.Education,
					Experience = jobProfileRequest.Experience,
					KeyResponsibility = jobProfileRequest.KeyResponsibility,
					Qualifications = jobProfileRequest.Qualifications,
					CreatedBy = loggedEmployee,
					CreatedDate = DateTime.UtcNow.AddHours(8),
					IsActive = true,
					JobAssessments = defaultAssessments.Select(s=> new JobAssessment()
					{
						CreatedBy = loggedEmployee,
						CreatedDate = DateTime.UtcNow.AddHours(8)
					}).ToList()
				};
				await _uoWForCurrentService.JobProfileRepository.CreateNewJobProfile(jobProfile);
				await _uoWForCurrentService.CommitAsync();

				if (jobProfileRequest.MarketScanFile != null)
				{
					var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", jobProfileRequest.DepartmentId.ToString(), "market_research");

					// Ensure directory exists
					if (!Directory.Exists(rootFilePath))
					{
						Directory.CreateDirectory(rootFilePath);
					}

					// Generate new file name (you can customize the naming pattern)
					var fileExtension = Path.GetExtension(jobProfileRequest.MarketScanFile.FileName);
					var newFileName = $"market_research_job_id_{jobProfile.Id}{fileExtension}";
					var fullFilePath = Path.Combine(rootFilePath, newFileName);

					// Save file
					await using var marketResearchFile = new FileStream(fullFilePath, FileMode.Create);
					await jobProfileRequest.MarketScanFile.CopyToAsync(marketResearchFile);

				}


				result = new JsonResult(new
				{
					success = true,
					responseText = "Successfully Saved",
					jobId = jobProfile.Id

				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> CreateJobApplicationForm(List<JobApplicationQuestionRequestDto> jobApplicationQuestionRequest, string loggedEmployee)
		{
			JsonResult result;
			try
			{


				var jobApplicationQuestions = jobApplicationQuestionRequest.Select(s => new JobApplicationQuestion()
				{
					Id = s.Id??0,
					JobId = s.JobId,
					Body = s.Body,
					Type = s.Type,
					Required = s.Required,
					IsActive = true,
					CreatedBy = loggedEmployee,
					CreatedDate = DateTime.UtcNow.AddHours(8),
					JobApplicationChoices = s.ApplicationChoices?.Select(ss => new JobApplicationChoice()
					{
						Id = ss.Id??0,
						Body = ss.Body,
						IsActive = true
					}).ToList()
				}).ToList();

				await _uoWForCurrentService.ApplicationRepository.SaveJobApplicationQuestions(jobApplicationQuestions);
				await _uoWForCurrentService.CommitAsync();


				result = new JsonResult(new
				{
					success = true,
					responseText = "Successfully Saved",

				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating application form: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating application form: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> CreateClientJobProfileApplicationProcess(JobApplicationProcessRequestDto jobApplicationQuestionRequest)
		{
			JsonResult result;
			try
			{

				var applicationProcess = jobApplicationQuestionRequest.ApplicationProcessId
					.Select(s => new JobApplicationProcess()
					{
						ApplicationProcessId = s,
						JobId = jobApplicationQuestionRequest.JobId,
						IsActive = true,
					})
					.ToList();

				await _uoWForCurrentService.JobProfileRepository.CreateJobProfileApplicationProcess(applicationProcess);
				await _uoWForCurrentService.CommitAsync();


				result = new JsonResult(new
				{
					success = true,
					responseText = "Successfully Saved"
				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> CreateClientJobProfileAssessment(List<JobApplicationAssessmentRequestDto> jobApplicationAssessmentRequests, string loggedEmployee)
		{
			JsonResult result;
			try
			{

				var assessments = jobApplicationAssessmentRequests
					.Select(s => new JobAssessment()
					{
						Id = s.Id,
						AssessmentId = s.AssessmentId,
						IsActive = true,
						CreatedBy = loggedEmployee,
						CreatedDate = DateTime.UtcNow.AddHours(8)
					})
					.ToList();

				await _uoWForCurrentService.JobProfileRepository.CreateJobProfileAssessment(assessments);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new
				{
					success = true,
					responseText = "Successfully Saved"
				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveClientJobProfileDashboard(int companyId)
		{
			JsonResult result;
			try
			{
				var jobProfiles = await _uoWForCurrentService.JobProfileRepository.SelectJobProfileDashboard(companyId);

				result = new JsonResult(new
				{
					jobProfiles,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveClientJobProfileInformation(int jobId)
		{
			JsonResult result;
			try
			{

				var jobProfile = await _uoWForCurrentService.JobProfileRepository.SelectJobProfileInformation(jobId);

				var folderPath = Path.Combine(_fileRootFolder!, "client_profile", jobProfile.ClientJobProfile.DepartmentId.ToString(), "market_research");


				if (Directory.Exists(folderPath))
				{
					jobProfile.ClientJobProfile.MarketScanFileName = Directory
						.GetFiles(folderPath)
						.Where(f => Path.GetFileName(f).Contains($"market_research_job_id_{jobId}", StringComparison.OrdinalIgnoreCase))
						.Select(Path.GetFileName) // Return only the file name, not the full path
						.FirstOrDefault();
				}
				

				result = new JsonResult(new
				{
					jobProfile,
				})
				{
					StatusCode = 200
				};

				return result;



			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving job profile information: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving job profile information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateClientJobProfile(ClientJobProfileRequestDto jobProfileRequest, int jobId)
		{
			JsonResult result;
			try
			{
				var jobProfile = new JobProfile()
				{
					DepartmentId = jobProfileRequest.DepartmentId,
					Position = jobProfileRequest.Position,
					EmploymentTypeId = jobProfileRequest.EmploymentTypeId,
					JobStatusId = jobProfileRequest.JobStatusId,
					JobDescription = jobProfileRequest.JobDescription,
					Education = jobProfileRequest.Education,
					Experience = jobProfileRequest.Experience,
					KeyResponsibility = jobProfileRequest.KeyResponsibility,
					Qualifications = jobProfileRequest.Qualifications,
					ShowInCareerPage = jobProfileRequest.ShowInCareerPage,
				};
				await _uoWForCurrentService.JobProfileRepository.UpdateJobProfile(jobProfile, jobId);
				await _uoWForCurrentService.CommitAsync();

				if (jobProfileRequest.MarketScanFile != null)
				{
					var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", jobProfileRequest.DepartmentId.ToString(), "market_research");

					// Ensure directory exists
					if (!Directory.Exists(rootFilePath))
					{
						Directory.CreateDirectory(rootFilePath);
					}

					// Generate new file name (you can customize the naming pattern)
					var fileExtension = Path.GetExtension(jobProfileRequest.MarketScanFile.FileName);
					var newFileName = $"market_research_job_id_{jobId}{fileExtension}";
					var fullFilePath = Path.Combine(rootFilePath, newFileName);

					// Save file
					await using var marketResearchFile = new FileStream(fullFilePath, FileMode.Create);
					await jobProfileRequest.MarketScanFile.CopyToAsync(marketResearchFile);

				}
				result = new JsonResult(new
				{
					success = true,
					responseText = "Successfully Saved"
				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveApplicationFormJobProfile(int jobId)
		{
			JsonResult result;
			try
			{

				var jId = jobId.ToString().Substring(0, jobId.ToString().Length - 1);


				var jobProfile = await _uoWForCurrentService.JobProfileRepository.SelectApplicationFormJobDetails(Convert.ToInt32(jId));

				result = new JsonResult(new
				{
					jobProfile,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving job profile information: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving job profile information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveApplicationProcess()
		{
			JsonResult result;
			try
			{

				var applicationProcess = await _uoWForCurrentService.ApplicationProcessRepository.SelectApplicationProcess();

				result = new JsonResult(new
				{
					applicationProcess,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveCareersJobProfileDashboard()
		{
			JsonResult result;
			try
			{

				var jobProfiles = await _uoWForCurrentService.JobProfileRepository.SelectCareersJobProfile();

				result = new JsonResult(new
				{
					jobProfiles,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving jobs: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving jobs: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> SelectAllJobProfileDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.JobProfileRepository.SelectAllJobProfilesDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving job profile drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving job profile drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> SelectApplicationProcessDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.ApplicationProcessRepository.SelectApplicationProcessDropDown();

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

		public async Task<JsonResult> RetrieveJobProfileDashboard()
		{
			JsonResult result;
			try
			{
				var jobProfiles = await _uoWForCurrentService.JobProfileRepository.JobProfileDashboard();

				result = new JsonResult(new
				{
					jobProfiles,
				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<(string filePath, string contentType)> GenerateJobProfilePdf(int jobId)

		{
			JsonResult result;
			try
			{
				var jobProfile = await _uoWForCurrentService.JobProfileRepository.SelectJobProfileRawData(jobId);

				await _helper.GenerateJobProfilePdfAsync(jobProfile);

				var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", jobProfile.Department.Id.ToString(), "job_profile");
				var pdfPath = Path.Combine(rootFilePath, $"Job Profile - {jobProfile.Position}.pdf");


				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{pdfPath}");

				return (filePath, contentType);
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}


		public async Task<(string filePath, string contentType)> ViewMarketScanFile(int jobId,string filename)

		{
			JsonResult result;
			try
			{
				var jobProfile = await _uoWForCurrentService.JobProfileRepository.SelectJobProfileRawData(jobId);


				var rootFilePath = Path.Combine(_fileRootFolder!, "client_profile", jobProfile.DepartmentId.ToString(), "market_research");
				var pdfPath = Path.Combine(rootFilePath, filename);


				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{pdfPath}");

				return (filePath, contentType);
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving department: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}
	}
}
