using FileServiceLibrary;
using Microsoft.AspNetCore.Mvc;
using NETCore.Encrypt;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.WorkFromHome;
using Recruitment.Service.API.Core.UnitOfWork;
using System.Text;
using Spire.Doc;
using System.Linq.Dynamic.Core;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.Graph.Models;
using Recruitment.Service.API.Core.Helpers;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class OnboardingServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<JobOfferServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IFileService fileService,
		IApplicationProcessHelper applicationProcess
	) : IOnboardingServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<JobOfferServices> _logger = logger;
		private readonly IFileService _fileService = fileService;
		private readonly IApplicationProcessHelper _applicationProcess = applicationProcess;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;
		public async Task<JsonResult> SaveOnboardingInformationSheetService(OnboardingInformationSheetRequestDto onboardingInformationSheetDto)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(onboardingInformationSheetDto.CandidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var onboardingInformationSheet = new OnboardingInformationSheet()
				{
					CandidateId = recordId,
					FirstName = onboardingInformationSheetDto.FirstName,
					LastName = onboardingInformationSheetDto.LastName,
					MiddleName = onboardingInformationSheetDto.MiddleName,
					MiddleNamePrefix = onboardingInformationSheetDto.MiddleNamePrefix,
					Suffix = onboardingInformationSheetDto.Suffix,
					Salutation = onboardingInformationSheetDto.Salutation,
					Gender = onboardingInformationSheetDto.Gender,
					CivilStatus = onboardingInformationSheetDto.CivilStatus,
					DateOfBirth = onboardingInformationSheetDto.DateOfBirth,
					CurrentAddress = onboardingInformationSheetDto.CurrentAddress,
					CurrentLocation = onboardingInformationSheetDto.CurrentLocation,
					CurrentCityProvince = onboardingInformationSheetDto.CurrentCityProvince,
					CurrentZipcode = onboardingInformationSheetDto.CurrentZipcode,
					PermanentAddress = onboardingInformationSheetDto.PermanentAddress,
					PermanentLocation = onboardingInformationSheetDto.PermanentLocation,
					PermanentCityProvince = onboardingInformationSheetDto.PermanentCityProvince,
					PermanentZipcode = onboardingInformationSheetDto.PermanentZipcode,
					EducationalAttainment = onboardingInformationSheetDto.EducationalAttainment,
					LandlineNo = onboardingInformationSheetDto.LandlineNo,
					MobileNo = onboardingInformationSheetDto.MobileNo,
					AlternativeMobileNo = onboardingInformationSheetDto.AlternativeMobileNo,
					PersonalEmail = onboardingInformationSheetDto.PersonalEmail,
					EmergencyContactPerson = onboardingInformationSheetDto.EmergencyContactPerson,
					EmergencyContactNo = onboardingInformationSheetDto.EmergencyContactNo,
					EmergencyRelation = onboardingInformationSheetDto.EmergencyRelation,
					SssidNo = onboardingInformationSheetDto.SssidNo,
					TinidNo = onboardingInformationSheetDto.TinidNo,
					PhilhealthIdNo = onboardingInformationSheetDto.PhilhealthIdNo,
					PagibigIdNo = onboardingInformationSheetDto.PagibigIdNo,
					CurrentStep = 2,
					CreatedDate = DateTime.Now,
					OnboardingStatusId = 1
				};


				await _uoWForCurrentService.OnboardingRepository.SaveOnboardingInformation(onboardingInformationSheet);
				await _uoWForCurrentService.CommitAsync();

				await _applicationProcess.SendEmailCompletedCoreInformationTemplate(recordId, 19);

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating onboarding information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating onboarding information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveOnboardingInformationSheetService(int candidateId)
		{
			JsonResult result;
			try
			{

				var onboardingInfo =
					await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(candidateId);
				var wfhInfo =
					await _uoWForCurrentService.WorkFromHomeInformationRepository.RetrieveWorkFromHomeInformation(candidateId);
				var statusList = await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingStatusList();
				var jobOfferInfo = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferAcceptedDate(candidateId);

				result = new JsonResult(new { onboardingInfo, wfhInfo, statusList, jobOfferInfo })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboarding information sheet: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving onboarding information sheet: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveOnboardingFormInformations(string candidateId)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(candidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);

				var onboardingInfo =
					await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(recordId);

				var onboardingDocuments =
					await _uoWForCurrentService.OnboardingRepository.RetrieveCandidateOnboardingDocuments(recordId);

				var wfhInformations =
					await _uoWForCurrentService.WorkFromHomeInformationRepository.RetrieveWorkFromHomeInformation(recordId);

				result = new JsonResult(new { onboardingInfo, onboardingDocuments, wfhInformations })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboarding information sheet: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving onboarding information sheet: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateOnboardingInformationService(string candidateId, OnboardingInformationSheetRequestDto onboardingInformationSheetDto)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(candidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var onboardingInformation = new OnboardingInformationSheet()
				{
					CandidateId = recordId,
					FirstName = onboardingInformationSheetDto.FirstName,
					LastName = onboardingInformationSheetDto.LastName,
					MiddleName = onboardingInformationSheetDto.MiddleName,
					MiddleNamePrefix = onboardingInformationSheetDto.MiddleNamePrefix,
					Suffix = onboardingInformationSheetDto.Suffix,
					Salutation = onboardingInformationSheetDto.Salutation,
					Gender = onboardingInformationSheetDto.Gender,
					CivilStatus = onboardingInformationSheetDto.CivilStatus,
					DateOfBirth = onboardingInformationSheetDto.DateOfBirth,
					CurrentAddress = onboardingInformationSheetDto.CurrentAddress,
					CurrentLocation = onboardingInformationSheetDto.CurrentLocation,
					CurrentCityProvince = onboardingInformationSheetDto.CurrentCityProvince,
					CurrentZipcode = onboardingInformationSheetDto.CurrentZipcode,
					PermanentAddress = onboardingInformationSheetDto.PermanentAddress,
					PermanentLocation = onboardingInformationSheetDto.PermanentLocation,
					PermanentCityProvince = onboardingInformationSheetDto.PermanentCityProvince,
					PermanentZipcode = onboardingInformationSheetDto.PermanentZipcode,
					EducationalAttainment = onboardingInformationSheetDto.EducationalAttainment,
					LandlineNo = onboardingInformationSheetDto.LandlineNo,
					MobileNo = onboardingInformationSheetDto.MobileNo,
					AlternativeMobileNo = onboardingInformationSheetDto.AlternativeMobileNo,
					PersonalEmail = onboardingInformationSheetDto.PersonalEmail,
					EmergencyContactPerson = onboardingInformationSheetDto.EmergencyContactPerson,
					EmergencyContactNo = onboardingInformationSheetDto.EmergencyContactNo,
					EmergencyRelation = onboardingInformationSheetDto.EmergencyRelation,
					SssidNo = onboardingInformationSheetDto.SssidNo,
					TinidNo = onboardingInformationSheetDto.TinidNo,
					PhilhealthIdNo = onboardingInformationSheetDto.PhilhealthIdNo,
					PagibigIdNo = onboardingInformationSheetDto.PagibigIdNo,
				};
				await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingInformation(onboardingInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Onboarding Information Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Onboarding Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Onboarding Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateOnboardingInformationInternalService(int candidateId, OnboardingInformationSheetRequestDto onboardingInformationSheetDto)
		{
			JsonResult result;
			try
			{
				var onboardingInformation = new OnboardingInformationSheet()
				{
					CandidateId = candidateId,
					FirstName = onboardingInformationSheetDto.FirstName,
					LastName = onboardingInformationSheetDto.LastName,
					MiddleName = onboardingInformationSheetDto.MiddleName,
					MiddleNamePrefix = onboardingInformationSheetDto.MiddleNamePrefix,
					Suffix = onboardingInformationSheetDto.Suffix,
					Salutation = onboardingInformationSheetDto.Salutation,
					Gender = onboardingInformationSheetDto.Gender,
					CivilStatus = onboardingInformationSheetDto.CivilStatus,
					DateOfBirth = onboardingInformationSheetDto.DateOfBirth,
					CurrentAddress = onboardingInformationSheetDto.CurrentAddress,
					CurrentLocation = onboardingInformationSheetDto.CurrentLocation,
					CurrentCityProvince = onboardingInformationSheetDto.CurrentCityProvince,
					CurrentZipcode = onboardingInformationSheetDto.CurrentZipcode,
					PermanentAddress = onboardingInformationSheetDto.PermanentAddress,
					PermanentLocation = onboardingInformationSheetDto.PermanentLocation,
					PermanentCityProvince = onboardingInformationSheetDto.PermanentCityProvince,
					PermanentZipcode = onboardingInformationSheetDto.PermanentZipcode,
					EducationalAttainment = onboardingInformationSheetDto.EducationalAttainment,
					LandlineNo = onboardingInformationSheetDto.LandlineNo,
					MobileNo = onboardingInformationSheetDto.MobileNo,
					AlternativeMobileNo = onboardingInformationSheetDto.AlternativeMobileNo,
					PersonalEmail = onboardingInformationSheetDto.PersonalEmail,
					EmergencyContactPerson = onboardingInformationSheetDto.EmergencyContactPerson,
					EmergencyContactNo = onboardingInformationSheetDto.EmergencyContactNo,
					EmergencyRelation = onboardingInformationSheetDto.EmergencyRelation,
					SssidNo = onboardingInformationSheetDto.SssidNo,
					TinidNo = onboardingInformationSheetDto.TinidNo,
					PhilhealthIdNo = onboardingInformationSheetDto.PhilhealthIdNo,
					PagibigIdNo = onboardingInformationSheetDto.PagibigIdNo,
					OrientationDate = onboardingInformationSheetDto.OrientationDate,
					StartDate = onboardingInformationSheetDto.StartDate,
					DepartmentId = onboardingInformationSheetDto.DepartmentId
				};
				await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingInformation(onboardingInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Onboarding Information Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Onboarding Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Onboarding Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> AcknowledgeOnboardingFormService(string candidateId, bool isAcknowledged)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(candidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				await _uoWForCurrentService.OnboardingRepository.AcknowledgeOnboardingForm(recordId, isAcknowledged);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Onboarding Information Successfully Acknowledged" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while Acknowledging Onboarding Form: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while Acknowledging Onboarding Form: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateOnboardingStatusService(int candidateId, int onboardingStatusId)
		{
			JsonResult result;
			try
			{
				var onboardingInformation = new OnboardingInformationSheet()
				{
					CandidateId = candidateId,
					OnboardingStatusId = onboardingStatusId,
				};
				await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingStatus(onboardingInformation);
				await _uoWForCurrentService.CommitAsync();

				if (onboardingStatusId == 4)
				{ 
					await _applicationProcess.SendEmailReadyToStartToTeamTemplate(candidateId, 20);
					await _applicationProcess.SendEmailReadyToStartToCandidateTemplate(candidateId, 21);
				};

				result = new JsonResult(new { success = true, responseText = "Onboarding Status Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Onboarding Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Onboarding Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateTemporaryEmployeeIdService(int candidateId, int temporaryEmployeeId)
		{
			JsonResult result;
			try
			{
				var onboardingInformation = new OnboardingInformationSheet()
				{
					CandidateId = candidateId,
					TemporaryEmployeeId = temporaryEmployeeId,
				};
				await _uoWForCurrentService.OnboardingRepository.UpdateTemporaryEmployeeId(onboardingInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Temporary Employee Id Successfully Added" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Onboarding Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Onboarding Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveAllOnboardingInformationSheetService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection, int status)
		{
			JsonResult result;
			try
			{
				var onboardingInformation =
					await _uoWForCurrentService.OnboardingRepository.RetrieveCandidateOnboardingInfoList();
				var statuses = await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingStatusList();
				Dictionary<int, string> applicationStatusMap;

				applicationStatusMap = statuses.ToDictionary(
				status => status.Id,
				status => status.Status
				);


				var totalRows = onboardingInformation.Count;

				// Apply search filter
				if (!string.IsNullOrEmpty(search))
				{
					onboardingInformation = onboardingInformation.Where(x =>
						(x.FirstName?.ToLower().Contains(search.ToLower()) ?? false)).ToList();
				}
				var statusCounts = applicationStatusMap
				.Select(ap => new
				{
					statusId = ap.Key,
					Status = ap.Value,
					CandidateCount = onboardingInformation.Count(c => c.OnboardingStatusId == ap.Key)
				})
				.ToList();
				if (status > 0)
				{
					onboardingInformation = onboardingInformation.Where(x => x.OnboardingStatusId == status).ToList();

				}
				var totalRowsAfterFiltering = onboardingInformation.Count;

				// Apply sorting
				onboardingInformation = onboardingInformation.AsQueryable()
												 .OrderBy(sortColumnName + " " + sortDirection)
												 .ToList();

				// Apply pagination
				if (length != -1)
				{
					onboardingInformation = onboardingInformation.Skip(start).Take(length).ToList();
				}

				// Prepare result
				result = new JsonResult(new
				{
					data = onboardingInformation,
					draw,
					recordsTotal = totalRows,
					recordsFiltered = totalRowsAfterFiltering,
					statusList = statusCounts
				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboardingInformation: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving onboardingInformation: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}
		public async Task<JsonResult> SaveOnboardingDocumentService(List<OnboardingDocumentRequestDto> onboardingDocumentDtoList)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(onboardingDocumentDtoList[0].CandidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);

				bool hasDocumentGroupThree = false;

				foreach (var onboardingDocumentDto in onboardingDocumentDtoList)
				{

					var onboardingDocument = new OnboardingDocument()
					{
						CandidateId = recordId,
						FileName = onboardingDocumentDto.FileName,
						DocumentType = onboardingDocumentDto.DocumentType,
						IsSubmitted = onboardingDocumentDto.IsSubmitted,
						IsHrverification = onboardingDocumentDto.IsHrverification,
						DateSubmitted = onboardingDocumentDto.DateSubmitted,
						DocumentGroup = onboardingDocumentDto.DocumentGroup,

					};

					await _uoWForCurrentService.OnboardingRepository.SaveOnboardingDocument(onboardingDocument);


					var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_documents", recordId.ToString());
					if (!Directory.Exists(rootFilePath))
					{
						Directory.CreateDirectory(rootFilePath);
					}
					await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath, onboardingDocumentDto.FormFile.FileName), FileMode.Create);
					await onboardingDocumentDto.FormFile.CopyToAsync(preRequisiteFileStream);

					if (onboardingDocumentDto.DocumentGroup == 3)
					{
						hasDocumentGroupThree = true;
					}
				}

				if (hasDocumentGroupThree)
				{
					await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingStep(recordId, 4);
				}
				else
				{
					await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingStep(recordId, 3);
				}
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating onboarding document: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating onboarding document: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveOnboardingDocumentService(int candidateId)
		{
			JsonResult result;
			try
			{

				var onboardingDocument =
					await _uoWForCurrentService.OnboardingRepository.RetrieveCandidateOnboardingDocuments(candidateId);

				result = new JsonResult(new { onboardingDocument })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboarding document: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving onboarding document: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveAllOnboardingDocumentService(int candidateId)
		{
			JsonResult result;
			try
			{
				var onboardingDocuments =
					await _uoWForCurrentService.OnboardingRepository.RetrieveCandidateOnboardingDocuments(candidateId);


				// Prepare result
				result = new JsonResult(new
				{
					data = onboardingDocuments,

				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboarding documents: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving onboarding documents: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}
		public async Task<JsonResult> SaveWorkFromHomeInformationService(WorkFromHomeInformationRequestDto workFromHomeInformationSheetDto)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(workFromHomeInformationSheetDto.CandidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var workFromHomeInformation = new WorkFromHomeInformation()
				{
					CandidateId = recordId,
					WorkLocation = workFromHomeInformationSheetDto.WorkLocation,
					PinLocation = workFromHomeInformationSheetDto.PinLocation,
					InternetProvider = workFromHomeInformationSheetDto.InternetProvider,
					InternetService = workFromHomeInformationSheetDto.InternetService,
					UploadInternetSpeed = workFromHomeInformationSheetDto.UploadInternetSpeed,
					DownloadInternetSpeed = workFromHomeInformationSheetDto.DownloadInternetSpeed,
					PlatformVideoCall = workFromHomeInformationSheetDto.PlatformVideoCall,
					MessengerAccount = workFromHomeInformationSheetDto.MessengerAccount,
					AvailabilityCall = workFromHomeInformationSheetDto.AvailabilityCall,
					SetUpWorkStation1 = workFromHomeInformationSheetDto.SetUpWorkStation1,
					SetUpWorkStation2 = workFromHomeInformationSheetDto.SetUpWorkStation2,
					SetUpWorkStation3 = workFromHomeInformationSheetDto.SetUpWorkStation3,
					SetUpWorkStation4 = workFromHomeInformationSheetDto.SetUpWorkStation4,
					SetUpWorkStation5 = workFromHomeInformationSheetDto.SetUpWorkStation5,
					SetUpWorkStation6 = workFromHomeInformationSheetDto.SetUpWorkStation6,
					SurroundAreas1 = workFromHomeInformationSheetDto.SurroundAreas1,
					SurroundAreas2 = workFromHomeInformationSheetDto.SurroundAreas2,
					SurroundAreas3 = workFromHomeInformationSheetDto.SurroundAreas3,
					SurroundAreas4 = workFromHomeInformationSheetDto.SurroundAreas4,
					SurroundAreas5 = workFromHomeInformationSheetDto.SurroundAreas5,
					SurroundAreas6 = workFromHomeInformationSheetDto.SurroundAreas6,
					SurroundAreas7 = workFromHomeInformationSheetDto.SurroundAreas7,
					SurroundAreas8 = workFromHomeInformationSheetDto.SurroundAreas8,
					SurroundAreas9 = workFromHomeInformationSheetDto.SurroundAreas9,
					SurroundAreas10 = workFromHomeInformationSheetDto.SurroundAreas10,
					WorkFromHomeApproval = workFromHomeInformationSheetDto.WorkFromHomeApproval,
					WorkFromHomeApprovalBy = workFromHomeInformationSheetDto.WorkFromHomeApprovalBy,
					WorkFromHomeApproval1 = workFromHomeInformationSheetDto.WorkFromHomeApproval1,
					WorkFromHomeApprovalBy1 = workFromHomeInformationSheetDto.WorkFromHomeApprovalBy1,
				};
				await _uoWForCurrentService.WorkFromHomeInformationRepository.SaveWorkFromHomeInformation(workFromHomeInformation);

				if (workFromHomeInformationSheetDto.OnboardingDocuDto != null)
				{
					foreach (var onboardingDocumentDto in workFromHomeInformationSheetDto.OnboardingDocuDto)
					{
						var onboardingDocument = new OnboardingDocument()
						{
							CandidateId = recordId,
							FileName = onboardingDocumentDto.FileName,
							DocumentType = onboardingDocumentDto.DocumentType,
							IsSubmitted = onboardingDocumentDto.IsSubmitted,
							IsHrverification = onboardingDocumentDto.IsHrverification,
							DateSubmitted = onboardingDocumentDto.DateSubmitted,
							DocumentGroup = onboardingDocumentDto.DocumentGroup,

						};

						await _uoWForCurrentService.OnboardingRepository.SaveOnboardingDocument(onboardingDocument);

						var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_documents", workFromHomeInformation.CandidateId.ToString());
						if (!Directory.Exists(rootFilePath))
						{
							Directory.CreateDirectory(rootFilePath);
						}
						await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath, onboardingDocumentDto.FormFile.FileName), FileMode.Create);
						await onboardingDocumentDto.FormFile.CopyToAsync(preRequisiteFileStream);
					}
				}

				await _uoWForCurrentService.OnboardingRepository.UpdateOnboardingStep(recordId, 5);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating work from home information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating work from home information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveWorkFromHomeInformationService(int candidateId)
		{
			JsonResult result;
			try
			{

				var workFromHomeInfo =
					await _uoWForCurrentService.WorkFromHomeInformationRepository.RetrieveWorkFromHomeInformation(candidateId);

				result = new JsonResult(new { workFromHomeInfo })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving work from home information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving work from home information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateWorkFromHomeInformationService(string candidateId, WorkFromHomeInformationRequestDto workFromHomeInformationRequestDto)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(candidateId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var workFromHomeInformation = new WorkFromHomeInformation()
				{
					CandidateId = recordId,
					WorkLocation = workFromHomeInformationRequestDto.WorkLocation,
					PinLocation = workFromHomeInformationRequestDto.PinLocation,
					InternetProvider = workFromHomeInformationRequestDto.InternetProvider,
					InternetService = workFromHomeInformationRequestDto.InternetService,
					UploadInternetSpeed = workFromHomeInformationRequestDto.UploadInternetSpeed,
					DownloadInternetSpeed = workFromHomeInformationRequestDto.DownloadInternetSpeed,
					PlatformVideoCall = workFromHomeInformationRequestDto.PlatformVideoCall,
					MessengerAccount = workFromHomeInformationRequestDto.MessengerAccount,
					AvailabilityCall = workFromHomeInformationRequestDto.AvailabilityCall,
					SetUpWorkStation1 = workFromHomeInformationRequestDto.SetUpWorkStation1,
					SetUpWorkStation2 = workFromHomeInformationRequestDto.SetUpWorkStation2,
					SetUpWorkStation3 = workFromHomeInformationRequestDto.SetUpWorkStation3,
					SetUpWorkStation4 = workFromHomeInformationRequestDto.SetUpWorkStation4,
					SetUpWorkStation5 = workFromHomeInformationRequestDto.SetUpWorkStation5,
					SetUpWorkStation6 = workFromHomeInformationRequestDto.SetUpWorkStation6,
					SurroundAreas1 = workFromHomeInformationRequestDto.SurroundAreas1,
					SurroundAreas2 = workFromHomeInformationRequestDto.SurroundAreas2,
					SurroundAreas3 = workFromHomeInformationRequestDto.SurroundAreas3,
					SurroundAreas4 = workFromHomeInformationRequestDto.SurroundAreas4,
					SurroundAreas5 = workFromHomeInformationRequestDto.SurroundAreas5,
					SurroundAreas6 = workFromHomeInformationRequestDto.SurroundAreas6,
					SurroundAreas7 = workFromHomeInformationRequestDto.SurroundAreas7,
					SurroundAreas8 = workFromHomeInformationRequestDto.SurroundAreas8,
					SurroundAreas9 = workFromHomeInformationRequestDto.SurroundAreas9,
					SurroundAreas10 = workFromHomeInformationRequestDto.SurroundAreas10,
					WorkFromHomeApproval = workFromHomeInformationRequestDto.WorkFromHomeApproval,
					WorkFromHomeApprovalBy = workFromHomeInformationRequestDto.WorkFromHomeApprovalBy,
					WorkFromHomeApproval1 = workFromHomeInformationRequestDto.WorkFromHomeApproval1,
					WorkFromHomeApprovalBy1 = workFromHomeInformationRequestDto.WorkFromHomeApprovalBy1,
				};
				await _uoWForCurrentService.WorkFromHomeInformationRepository.UpdateWorkFromHomeInformation(workFromHomeInformation);

				if (workFromHomeInformationRequestDto.OnboardingDocuDto != null)
				{
					foreach (var onboardingDocumentDto in workFromHomeInformationRequestDto.OnboardingDocuDto)
					{
						var onboardingDocument = new OnboardingDocument()
						{
							CandidateId = recordId,
							FileName = onboardingDocumentDto.FileName,
							DocumentType = onboardingDocumentDto.DocumentType,
							IsSubmitted = onboardingDocumentDto.IsSubmitted,
							IsHrverification = onboardingDocumentDto.IsHrverification,
							DateSubmitted = onboardingDocumentDto.DateSubmitted,
							DocumentGroup = onboardingDocumentDto.DocumentGroup,

						};

						await _uoWForCurrentService.OnboardingRepository.SaveOnboardingDocument(onboardingDocument);

						var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_documents", recordId.ToString());
						if (!Directory.Exists(rootFilePath))
						{
							Directory.CreateDirectory(rootFilePath);
						}
						await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath, onboardingDocumentDto.FormFile.FileName), FileMode.Create);
						await onboardingDocumentDto.FormFile.CopyToAsync(preRequisiteFileStream);
					}
				}

				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Work From Home Information Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Work From Home Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Work From Home Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> WorkFromHomeInformationHrApproveService(int candidateId, string workFromHomeApprovalBy)
		{
			JsonResult result;
			try
			{
				var workFromHomeInformation = new WorkFromHomeInformation()
				{
					CandidateId = candidateId,
					WorkFromHomeApprovalBy = workFromHomeApprovalBy,

				};
				await _uoWForCurrentService.WorkFromHomeInformationRepository.WorkFromHomeInformationHrApproved(workFromHomeInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Work From Home Information Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Work From Home Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Work From Home Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> WorkFromHomeInformationItApproveService(int candidateId, string workFromHomeApprovalBy1)
		{
			JsonResult result;
			try
			{
				var workFromHomeInformation = new WorkFromHomeInformation()
				{
					CandidateId = candidateId,
					WorkFromHomeApprovalBy1 = workFromHomeApprovalBy1,

				};
				await _uoWForCurrentService.WorkFromHomeInformationRepository.WorkFromHomeInformationITApproved(workFromHomeInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Work From Home Information Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating Work From Home Information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating Work From Home Information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<(string filePath, string contentType)> RetrieveSpecificOnboardingDocument(int candidateId, string documentType)
		{
			try
			{
				var candidate = await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingDocument(candidateId, documentType);
				var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_documents", candidate.CandidateId.ToString(), candidate.FileName);

				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{rootFilePath}");

				return (filePath, contentType);

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate resume: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}
		public async Task<List<(string filePath, string contentType)>> RetrieveAllOnboardingDocuments(int candidateId, string documentType)
		{
			try
			{
				// Fetch all documents that match the documentType for the candidate
				var documents = await _uoWForCurrentService.OnboardingRepository.RetrieveAllOnboardingDocuments(candidateId, documentType);

				var documentList = new List<(string filePath, string contentType)>();

				foreach (var doc in documents)
				{
					var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_documents", doc.CandidateId.ToString(), doc.FileName);
					var (filePath, contentType) = await _fileService.GetDocumentUrlAsync(rootFilePath);

					documentList.Add((filePath, contentType));
				}

				return documentList;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving documents for candidateId {candidateId}, documentType {documentType}: {e.Message}");
				throw;
			}
		}
		public async Task<JsonResult> RetrieveInformationForContractGenerationService(int candidateId)
		{
			JsonResult result;
			try
			{

				var onboardingInfo =
					await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(candidateId);

				var jobOfferInfo = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(candidateId);

				result = new JsonResult(new { onboardingInfo, jobOfferInfo })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving contract information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving contract information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<byte[]?> GenerateContractPdfService(int candidateId, string loggedEmployee)
		{
			var onboardingInfo = await _uoWForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(candidateId);
			var jobOfferInfo = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(candidateId);

			if (onboardingInfo == null && jobOfferInfo == null)
				return null;

			try
			{
				// Create a temporary copy of the template to avoid locking the original
				string templatePath = Path.Combine(_fileRootFolder, "document_template", "contract_template.docx");
				string tempTemplatePath = Path.GetTempFileName().Replace(".tmp", ".docx");
				File.Copy(templatePath, tempTemplatePath, true);

				var document = new Document();
				document.LoadFromFile(tempTemplatePath);

				// Replace placeholders
				document.Replace("[start_date]", jobOfferInfo.TargetStartDate.ToString("dd/MM/yyyy"), false, true);
				document.Replace("[employee_name]", jobOfferInfo.CandidateName, false, true);
				document.Replace("[employee_address]", $"{onboardingInfo.CurrentAddress} {onboardingInfo.CurrentCityProvince} {onboardingInfo.CurrentLocation}", false, true);
				document.Replace("[position]", onboardingInfo.Position, false, true);
				document.Replace("[monthly_salary]", (jobOfferInfo.ProbitionarySalary + jobOfferInfo.ProbitionaryDeminimis).ToString(), false, true);
				document.Replace("[employer_representative]", loggedEmployee, false, true);

				// Generate PDF
				using var stream = new MemoryStream();
				document.SaveToStream(stream, Spire.Doc.FileFormat.PDF);

				// Clean up temp file
				File.Delete(tempTemplatePath);

				return stream.ToArray();
			}
			catch (Exception ex)
			{
				// Optionally log the error
				return null;
			}
		}
		public async Task<JsonResult> RetrieveExistingTemporaryIdListService()
		{
			JsonResult result;
			try
			{ 
				var temporaryIds = await _uoWForCurrentService.OnboardingRepository.RetrieveExistingTemporaryIdList();

				result = new JsonResult(new
				{
					data = temporaryIds,
				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving onboarding information: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving onboarding information: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}
	}
}
