using FileServiceLibrary;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Core.UnitOfWork;
using System.Linq.Dynamic.Core;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Http.HttpResults;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using System.Security.Cryptography.X509Certificates;
using Recruitment.Service.API.Core.Helpers;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class CandidateServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<CandidateServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IFileService fileService,
		IApplicationProcessHelper applicationProcess
	) : ICandidateServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<CandidateServices> _logger = logger;
		private readonly IFileService _fileService = fileService;
		private readonly IApplicationProcessHelper _applicationProcess = applicationProcess;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task<JsonResult> ApplyCandidateApplicationForm(ApplyRequestDto applyRequest)
		{
			JsonResult result;
			try
			{
				var jId = applyRequest.Id.ToString().Substring(0, applyRequest.Id.ToString().Length - 1);
				var sId = applyRequest.Id.ToString().Substring(applyRequest.Id.ToString().Length - 1, 1);

				var candidate = new Candidate()
				{
					JobId = Convert.ToInt32(jId),
					FirstName = applyRequest.FirstName,
					LastName = applyRequest.LastName,
					Email = applyRequest.Email,
					PhoneNumber = applyRequest.Phone,
					CurrentSalary = applyRequest.CurrentSalary,
					ExpectedSalary = applyRequest.ExpectedSalary,
					CurrentEmploymentStatus = applyRequest.CurrentEmploymentStatus,
					NoticePeriod = applyRequest.NoticePeriod,
					Resume = applyRequest.Resume.FileName,
					ApplicationStatusId = 2,
					SourceId = Convert.ToInt32(sId),
					IsActive = true,
					JobApplicationAnswers = applyRequest.Questions.Select(answer => new JobApplicationAnswer()
					{
						Answer = answer.Answer ?? "",
						ApplicationQuestionId = answer.QuestionId
					}).ToList()
				};

				var candidateHistory = new CandidateHistory()
				{
					CandidateId = candidate.Id,
					Name = "Applied",
					Type = "primary",
					Description = "Candidate applied in this item.",
					CreatedDate = DateTime.UtcNow.AddHours(8),
				};

				await _uoWForCurrentService.CandidateRepository.SaveApplicationForm(candidate);
				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);
				await _uoWForCurrentService.CommitAsync();

				var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_profile");
				if (!Directory.Exists(rootFilePath))
				{
					Directory.CreateDirectory(rootFilePath);
				}
				await using var preRequisiteFileStream = new FileStream(Path.Combine(rootFilePath, applyRequest.Resume.FileName), FileMode.Create);
				await applyRequest.Resume.CopyToAsync(preRequisiteFileStream);


				await _applicationProcess.SendEmailAppliedAutomation(candidate.Id, 1);

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveAllCandidateService(string? search, int start, int length, string draw,string sortColumnName, string sortDirection, int client,int clientGroup, int job,int qualification, int applicationProcess, int source) 
		{
			JsonResult result;
			try
			{
				var candidates = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateList();

				Dictionary<int, string> applicationProcessMap = null;

				if (job > 0)
				{
					candidates = candidates.Where(x => x.JobId == job).ToList();

					var profile = await _uoWForCurrentService.JobProfileRepository
						.SelectJobProfileApplicationProcess(job);

					applicationProcessMap = profile.JobApplicationProcesses.ToDictionary(
						process => process.ApplicationProcess.Id,
						process => process.ApplicationProcess.ProcessName
					);
				}
				else
				{
					var profile = await _uoWForCurrentService.ApplicationProcessRepository
						.SelectApplicationProcess();

					applicationProcessMap = profile.ToDictionary(
						process => process.Id,
						process => process.ProcessName
					);
				}
				
				// Apply filters before calculating processCounts
				if (client > 0)
				{
					candidates = candidates.Where(x => x.ClientCompanyId == client).ToList();
				}

				if (clientGroup > 0)
				{
					candidates = candidates.Where(x => x.ClientGroupId == clientGroup).ToList();
				}

				if (source > 0)
				{
					candidates = candidates.Where(x => x.SourceId == source).ToList();
				}

				candidates = qualification == 0
					? candidates.Where(x => !x.IsDisqualified).ToList()
					: candidates.Where(x => x.IsDisqualified).ToList();

				// Calculate processCounts from fully filtered candidates
				var processCounts = applicationProcessMap?
					.Select(ap => new
					{
						ApplicationProcessId = ap.Key,
						ProcessName = ap.Value,
						CandidateCount = candidates.Count(c => c.ApplicationStatusId == ap.Key),
						Candidate = candidates.Where(c => c.ApplicationStatusId == ap.Key)
					})
					.ToList();

				// If applicationProcess > 0, keep only the selected process in processCounts
				if (applicationProcess > 0)
				{
					candidates = candidates.Where(x => x.ApplicationStatusId == applicationProcess).ToList();

					// Filter processCounts to include only the selected process
					// processCounts = processCounts
					//     .Where(p => p.ApplicationProcessId == applicationProcess)
					//     .ToList();
				}

				var totalRows = candidates.Count;

				// Apply search filter
				if (!string.IsNullOrEmpty(search))
				{
					candidates = candidates.Where(x =>
						(x.FirstName?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.LastName?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.Email?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.CurrentEmploymentStatus?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.NoticePeriod?.ToLower().Contains(search.ToLower()) ?? false)).ToList();
				}

				var totalRowsAfterFiltering = candidates.Count;

				// Apply sorting
				candidates = candidates.AsQueryable()
					.OrderBy(sortColumnName + " " + sortDirection)
					.ToList();

				// Apply pagination
				if (length != -1)
				{
					candidates = candidates.Skip(start).Take(length).ToList();
				}

				// Prepare result
				result = new JsonResult(new
				{
					data = candidates,
					draw,
					recordsTotal = totalRows,
					recordsFiltered = totalRowsAfterFiltering,
					processCounts
				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidates: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving candidates: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}

		public async Task<JsonResult> RetrieveCandidateFilterService()
		{
			JsonResult result;
			try
			{

				var client = await _uoWForCurrentService.DepartmentRepository.SelectDepartmentDropDown();
				var clientGroup = await _uoWForCurrentService.DepartmentGroupRepository.SelectClientCompanyGroup();
				var job = await _uoWForCurrentService.JobProfileRepository.JobProfileDashboard();
				var source = await _uoWForCurrentService.CandidateRepository.SelectSourceDropDown();
				var stage = await _uoWForCurrentService.ApplicationProcessRepository.SelectApplicationProcess();
		
				result = new JsonResult(new { client, clientGroup, job, source, stage })
				{
					StatusCode = 200
				};
				return result;
		
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate: {e.Message}");
		
				result = new JsonResult(new
					{ success = false, responseText = $"Error occurred while retrieving candidate: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;
		
			}
		}


		public async Task<JsonResult> RetrieveCandidateService(int candidateId)
		{
			JsonResult result;
			try
			{

				var candidate = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateInfo(candidateId);
				var candidateHistory = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateHistory(candidateId);
				var candidateComment = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateComment(candidateId);
				var candidateAssessment =
					await _uoWForCurrentService.CandidateRepository.RetrieveCandidateAssessmentDetails(candidate.JobId, candidateId);
				var currentProcess = await _uoWForCurrentService.JobProfileRepository
					.SelectJobProfileApplicationProcess(candidate.JobId);
				var assessment =
					await _uoWForCurrentService.CandidateRepository.RetrieveCandidateAssessmentAllDetails(
						candidate.JobId, candidateId);

				result = new JsonResult(new { candidate, candidateHistory, candidateComment, candidateAssessment, currentProcess, assessment })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving candidate: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> CreateCommentService(CandidateCommentRequestDto comment)
		{
			JsonResult result;
			try
			{
				var candidateComment = new CandidateComment()
				{
					
					CandidateId = comment.CandidateId,
					Comment = comment.Comment,
					CreatedBy = comment.CreatedBy,
					CreatedDate = DateTime.UtcNow.AddHours(8),
				};

				await _uoWForCurrentService.CandidateRepository.SaveCommentItem(candidateComment);
				await _uoWForCurrentService.CommitAsync();


				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating comment: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating comment: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> CreateCandidateWriteUpService(CandidateWriteUpRequestDto candidateWriteUpDto, int candidateId , string createdBy)
		{
			JsonResult result;
			try
			{
				var writeUp = new CandidateWriteUp()
				{
					CandidateId = candidateId,
					ProfileOverview = candidateWriteUpDto.ProfileOverview,
					ProfessionalBackground = candidateWriteUpDto.ProfessionalBackground,
					Skills = candidateWriteUpDto.Skills,
					Behavioral = candidateWriteUpDto.Behavioral,
					Notes = candidateWriteUpDto.Notes,
					IsActive = true,
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.AddHours(8),
				};

				await _uoWForCurrentService.CandidateRepository.CreateCandidateWriteUp(writeUp);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Write Up Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating write up: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating write up: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveCandidateWriteUpService(int candidateId)
		{
			JsonResult result;
			try
			{

				var writeUp = await _uoWForCurrentService.CandidateRepository.RetrieveWriteUpInfo(candidateId);
				var hasWriteUp = writeUp.Count > 0 ? true : false;
				result = new JsonResult(new { writeUp, hasWriteUp })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate write up: {e.Message}");

				result = new JsonResult(new
					{ success = false, responseText = $"Error occurred while retrieving candidate write up: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		
		public async Task<JsonResult> UpdateWriteUpService(int writeUpId, CandidateWriteUpRequestDto writeUpRequest)
		{
			JsonResult result;
			try
			{
				var writeUp = new CandidateWriteUpRequestDto()
				{
					ProfileOverview = writeUpRequest.ProfileOverview,
					ProfessionalBackground = writeUpRequest.ProfessionalBackground,
					Skills = writeUpRequest.Skills,
					Behavioral = writeUpRequest.Behavioral,
					Notes = writeUpRequest.Notes,
				};
				await _uoWForCurrentService.CandidateRepository.UpdateWriteUp(writeUpId, writeUp);
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
				_logger.LogError($"Error occurred: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateCandidateStageService(int candidateId, int stageId, string stageName, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var candidateHistory = new CandidateHistory()
				{
					CandidateId = candidateId,
					Name = stageName,
					Type = "success",
					Description = "Moved to " + stageName + " by",
					CreatedDate = DateTime.UtcNow.AddHours(8),
					CreatedBy = loggedEmployee,
				};

				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);
				await _uoWForCurrentService.CandidateRepository.UpdateStage(candidateId, stageId);
				await _uoWForCurrentService.CommitAsync();
				if(stageId == 5)
				{
					await _applicationProcess.SendEmailAppliedAutomation(candidateId, 3);
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

		public async Task<JsonResult> UpdateCandidateJobService(int candidateId, int jobId, int stageId, string jobName, string stageName, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var candidateHistory = new CandidateHistory()
				{
					CandidateId = candidateId,
					Name = stageName,
					Type = "info",
					Description = "Moved to " + jobName + " at " + stageName + " stage by",
					CreatedDate = DateTime.UtcNow.AddHours(8),
					CreatedBy = loggedEmployee,
				};

				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);
				await _uoWForCurrentService.CandidateRepository.UpdateJob(candidateId, jobId, stageId);
				await _uoWForCurrentService.CandidateRepository.RemoveCandidateCredential(candidateId);
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
				_logger.LogError($"Error occurred: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> CopyCandidateToJobService(CopyToJobRequestDto candidateDto, string jobName, string stageName)
		{
			JsonResult result;
			try
			{

				var candidate = new Candidate()
				{
					JobId = candidateDto.JobId,
					FirstName = candidateDto.FirstName,
					LastName = candidateDto.LastName,
					Email = candidateDto.Email,
					PhoneNumber = candidateDto.Phone,
					CurrentSalary = candidateDto.CurrentSalary,
					ExpectedSalary = candidateDto.ExpectedSalary,
					CurrentEmploymentStatus = candidateDto.CurrentEmploymentStatus,
					NoticePeriod = candidateDto.NoticePeriod,
					Resume = candidateDto.Resume,
					ApplicationStatusId = candidateDto.ApplicationStatusId,
					SourceId = candidateDto.SourceId,
					IsActive = true,
				};
				await _uoWForCurrentService.CandidateRepository.SaveApplicationForm(candidate);

				var candidateHistory = new CandidateHistory()
				{
					CandidateId = candidateDto.CandidateId,
					Name = stageName,
					Type = "dark",
					Description = "Copied to " + jobName + " at " + stageName + " stage.",
					CreatedDate = DateTime.UtcNow.AddHours(8),
				};

				
				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);

				await _uoWForCurrentService.CandidateRepository.SetAssessmentCredentialInactive(candidateDto.CandidateId);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating client company: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating client company: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<(string filePath, string contentType)> RetrieveCandidateResume(int candidateId)
		{
			try
			{
				var candidate = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateInfo(candidateId);
				var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_profile", candidate.Resume);

				var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{rootFilePath}");

				return (filePath, contentType);

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidate resume: {e.Message}");

				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

			}
		}

		public async Task<JsonResult> RemoveRoleService(int id)
		{
			JsonResult result;
			try
			{

				await _uoWForCurrentService.CandidateRepository.RemovedCandidate(id);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Candidate Successfully Removed" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while removing candidate: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while removing candidate: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> DisqualifyCandidateService(int id, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var candidateHistory = new CandidateHistory()
				{
					CandidateId = id,
					Name = "Disqualified",
					Type = "danger",
					Description = "Disqualified by",
					CreatedDate = DateTime.UtcNow.AddHours(8),
					CreatedBy = loggedEmployee,
				};

				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);

				await _uoWForCurrentService.CandidateRepository.DisqualifyCandidate(id);
				await _uoWForCurrentService.CommitAsync();
				await _applicationProcess.SendEmailAppliedAutomation(id, 2);

				result = new JsonResult(new { success = true, responseText = "Candidate Successfully Disqualified" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while disqualifying candidate: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while disqualifying candidate: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveAllPipeline()
		{
			JsonResult result;
			try
			{
				var pipeline = await _uoWForCurrentService.CandidateRepository.RetrievePipelineList();

				result = new JsonResult(new { data = pipeline })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving pipeline: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving pipeline: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveCandidateAssessmentCheckingService(int assessmentId, int candidateId)
		{
			JsonResult result;
			try
			{

				var assessmentCheckingDetails = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateAssessmentCheckingDetails(assessmentId, candidateId);

				result = new JsonResult(new { assessmentCheckingDetails })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving assessment details: {e.Message}");

				result = new JsonResult(new
					{ success = false, responseText = $"Error occurred while retrieving assessment details: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> CreateCandidateCredentialForAssessment(candidateCredentialRequestDto candidateRequest, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var candidateInfo = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateInfo(candidateRequest.candidateId);
				var jobInfo =
					await _uoWForCurrentService.JobProfileRepository.SelectJobProfileInformation(candidateInfo.JobId);
				var candidate = new CandidateCredential()
				{
					CandidateId = candidateRequest.candidateId,
					Email = candidateInfo.Email,
					Password = candidateInfo.LastName.ToLower() + candidateInfo.Id,
					IsActive = true,
					LogInAttempt = 0,
					IsLockOut = false,
					Expiration = candidateRequest.Expiration,
					IsAssessmentStarted = false,
					IsFullscreenExit = false,
					IsMouseExited = false,
					IsAssessmentFinished = false,
					CurrentAssessmentId = (int)(jobInfo.Assessments[0].AssessmentId == null ? 0 : jobInfo.Assessments[0].AssessmentId),
					MouseOutsideCounter = 0,
					// AssessmentTimerId = 0,
				};

				var candidateHistory = new CandidateHistory()
				{
					CandidateId = candidateRequest.candidateId,
					Name = "Assessment Invite",
					Type = "warning",
					Description = "Assessment Invite sent by",
					CreatedBy = loggedEmployee,
					CreatedDate = DateTime.UtcNow.AddHours(8),
				};

				await _uoWForCurrentService.CandidateRepository.CreateCandidateCredential(candidate);
				await _uoWForCurrentService.CandidateRepository.SaveHistoryItem(candidateHistory);
				await _uoWForCurrentService.CommitAsync();
				await _applicationProcess.SendEmailAppliedAutomation(candidateInfo.Id, 4);


				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating candidate credential: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating candidate credential: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> SubmitCandidateCorrectionService(int id, bool isCorrect)
		{
			JsonResult result;
			try
			{

				await _uoWForCurrentService.CandidateRepository.SubmitCandidateCorrection(id, isCorrect);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Candidate Successfully Checked" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while checking candidate answer: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while checking candidate answer: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		#region Job Offer

		public async Task<JsonResult> RetrieveCandidateToOfferService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection, int status)
		{
			JsonResult result;
			try
			{
				var candidates = await _uoWForCurrentService.CandidateRepository.RetrieveCandidateToOfferList();

				// Apply filters before calculating processCounts
				if (status > 0)
				{
					candidates = candidates.Where(x => x.JobOfferStatusId == status).ToList();
				}


				var totalRows = candidates.Count;

				// Apply search filter
				if (!string.IsNullOrEmpty(search))
				{
					candidates = candidates.Where(x =>
						(x.FirstName?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.LastName?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.Email?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.CurrentEmploymentStatus?.ToLower().Contains(search.ToLower()) ?? false) ||
						(x.NoticePeriod?.ToLower().Contains(search.ToLower()) ?? false)).ToList();
				}

				var totalRowsAfterFiltering = candidates.Count;

				// Apply sorting
				candidates = candidates.AsQueryable()
					.OrderBy(sortColumnName + " " + sortDirection)
					.ToList();

				// Apply pagination
				if (length != -1)
				{
					candidates = candidates.Skip(start).Take(length).ToList();
				}

				// Prepare result
				result = new JsonResult(new
				{
					data = candidates,
					draw,
					recordsTotal = totalRows,
					recordsFiltered = totalRowsAfterFiltering,
				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving candidates: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving candidates: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}

		#endregion
	}

}
