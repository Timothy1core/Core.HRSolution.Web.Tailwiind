using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Core.UnitOfWork;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class EmployeeServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<EmployeeServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration

	) : IEmployeeServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<EmployeeServices> _logger = logger;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;
		public async Task<JsonResult> SaveEmployeeInformationService(int candidateId)
		{
			JsonResult result;
			try
			{
				var onboardingInfo = await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(candidateId);
				var jobOfferInfo = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(candidateId);
				var candidateInfo = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateInfo(candidateId);
				var jobProfileInfo = await _uoWForCurrentService.JobProfileRepository.SelectJobProfileInformation(candidateInfo.JobId);
				var onboardingDocuments = await _uoWForCurrentService.OnboardingRepository.RetrieveCandidateOnboardingDocuments(candidateId);

				var jobOffer = new EmployeeInformation()
				{
					EmployeeId = onboardingInfo.TemporaryEmployeeId?.ToString(),
					OnboardingId = onboardingInfo.CandidateId,
					YearId = DateTime.UtcNow.Year.ToString(),
					FirstName = onboardingInfo.FirstName,
					LastName = onboardingInfo.LastName,
					MiddleName = onboardingInfo.MiddleName,
					MiddleNamePrefix = onboardingInfo.MiddleNamePrefix,
					Suffix = onboardingInfo.Suffix,
					Salutation = onboardingInfo.Salutation,
					Gender = onboardingInfo.Gender,
					CivilStatus = onboardingInfo.CivilStatus,
					DateOfBirth = onboardingInfo.DateOfBirth,
					EducationalAttainment = onboardingInfo.EducationalAttainment,
					CurrentAddress = onboardingInfo.CurrentAddress,
					CurrentLocation = onboardingInfo.CurrentLocation,
					CurrentCityProvince = onboardingInfo.CurrentCityProvince,
					CurrentZipcode = onboardingInfo.CurrentZipcode,
					PermanentAddress = onboardingInfo.PermanentAddress,
					PermanentLocation = onboardingInfo.PermanentLocation,
					PermanentCityProvince = onboardingInfo.PermanentCityProvince,
					PermanentZipcode = onboardingInfo.PermanentZipcode,
					LandlineNo = onboardingInfo.LandlineNo,
					MobileNo = onboardingInfo.MobileNo,
					AlternativeMobileNo = onboardingInfo.AlternativeMobileNo,
					PersonalEmail = onboardingInfo.PersonalEmail,
					EmergencyContactPerson = onboardingInfo.EmergencyContactPerson,
					EmergencyContactNo = onboardingInfo.EmergencyContactNo,
					EmergencyRelation = onboardingInfo.EmergencyRelation,
					DateHired = (DateTime)(onboardingInfo.StartDate),
					RegularizationDate = (DateTime)(onboardingInfo.StartDate?.AddMonths(6)),
					EmploymentStatus = "Probationary",
					ContractType = jobProfileInfo.ClientJobProfile.EmploymentTypeName,
					Position = jobProfileInfo.ClientJobProfile.Position,
					DepartmentId = onboardingInfo.DepartmentId,
					EmployeeLevel = "Rank & File",
					Sss = onboardingInfo.SssidNo,
					Tin = onboardingInfo.TinidNo,
					Philhealth = onboardingInfo.PhilhealthIdNo,
					Pagibig = onboardingInfo.PagibigIdNo,
					WorkHours = (decimal?)9.00,
					HasPerfectAttendance = false,
					BasicPay = jobOfferInfo.ProbitionarySalary,
					Deminimis = jobOfferInfo.ProbitionaryDeminimis,
					MealAllowance = (decimal.Parse(jobOfferInfo.ProbitionaryDeminimis) / 5m).ToString("F2"),
					RiceAllowance = (decimal.Parse(jobOfferInfo.ProbitionaryDeminimis) / 5m).ToString("F2"),
					ClothingAllowance = (decimal.Parse(jobOfferInfo.ProbitionaryDeminimis) / 5m).ToString("F2"),
					LaundryAllowance = (decimal.Parse(jobOfferInfo.ProbitionaryDeminimis) / 5m).ToString("F2"),
					MedicalCashAllowance = (decimal.Parse(jobOfferInfo.ProbitionaryDeminimis) / 5m).ToString("F2"),
					TaxableAllowance = jobOfferInfo.ProbitionarySalary,
					IsActive = true,
				};


				// Define source and destination directory roots
				var sourceDirPath = Path.Combine(_fileRootFolder, "candidate_documents", candidateId.ToString());
				var destDirPath = Path.Combine(_fileRootFolder, "employee_documents", onboardingInfo.TemporaryEmployeeId?.ToString()!, "201");

				// Create destination folder if it doesn't exist
				if (!Directory.Exists(destDirPath))
				{
					Directory.CreateDirectory(destDirPath);
				}

				// Move each file listed in onboardingDocuments
				foreach (var doc in onboardingDocuments)
				{
					try
					{
						var sourceFilePath = Path.Combine(sourceDirPath, doc.FileName);
						var destFilePath = Path.Combine(destDirPath, doc.FileName);

						if (File.Exists(sourceFilePath))
						{
							// Overwrite if file already exists
							if (File.Exists(destFilePath))
								File.Delete(destFilePath);

							File.Move(sourceFilePath, destFilePath);

							var employeeDocument = new EmployeeDocument
							{
								EmployeeId = onboardingInfo.TemporaryEmployeeId?.ToString(),
								FileName = doc.FileName,
								DocumentType = doc.DocumentType,
								DocumentGroup = doc.DocumentGroup,
								DateSubmitted = DateTime.UtcNow,
							};

							await _uoWForCurrentService.EmployeeRepository.SaveEmployeeDocument(employeeDocument);
						}
						else
						{
							_logger.LogWarning($"Missing file: {sourceFilePath}");
						}
					}
					catch (Exception ex)
					{
						_logger.LogError($"Failed to move file '{doc.FileName}': {ex.Message}");
					}
				}

				await _uoWForCurrentService.EmployeeRepository.SaveEmployeeInformation(jobOffer);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating employee information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating employee information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
	}
}
