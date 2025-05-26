using EncryptionLibrary;
using FileServiceLibrary;
using Microsoft.AspNetCore.Mvc;
using NETCore.Encrypt;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Core.UnitOfWork;
using Spire.Doc;
using System.Linq.Dynamic.Core;
using System.Text;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class JobOfferServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<JobOfferServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IApplicationProcessHelper applicationProcess
	) : IJobOfferServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<JobOfferServices> _logger = logger;
		private readonly IApplicationProcessHelper _applicationProcess = applicationProcess;


		public async Task<JsonResult> SaveJobOfferInformationService(JobOfferRequestDto jobOfferRequestDto)
		{
			JsonResult result;
			try
			{

				var jobOffer = new JobOfferInformation()
				{
					TotalRenderingPeriod = jobOfferRequestDto.TotalRenderingPeriod,
					TargetStartDate = jobOfferRequestDto.TargetStartDate,
					ProbitionarySalary = EncryptionServices.Encrypt(jobOfferRequestDto.ProbitionarySalary),
					ProbitionaryDeminimis = EncryptionServices.Encrypt(jobOfferRequestDto.ProbitionaryDeminimis),
					RegularSalary = EncryptionServices.Encrypt(jobOfferRequestDto.RegularSalary),
					RegularDeminimis = EncryptionServices.Encrypt(jobOfferRequestDto.RegularDeminimis),
					JobOfferStatusId = jobOfferRequestDto.JobOfferStatusId,
					CandidateId = jobOfferRequestDto.CandidateId,
					ApproverId = jobOfferRequestDto.ApproverId,
				};


				await _uoWForCurrentService.JobOfferRepository.SaveJobOfferInformation(jobOffer);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating job offer information: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while creating job offer information: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveAllCandidateForJobOfferService(string? search, int start, int length,
			string draw, string sortColumnName, string sortDirection, int status)
		{
			JsonResult result;
			try
			{
				var candidates =
					await _uoWForCurrentService.JobOfferRepository.RetrieveCandidateForJobOfferList();
				var statuses = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferStatusList();
				Dictionary<int, string> applicationStatusMap;

				applicationStatusMap = statuses.ToDictionary(
				status => status.Id,
				status => status.Status
				);

				var totalRows = candidates.Count;

				// Apply search filter
				if (!string.IsNullOrEmpty(search))
				{
					candidates = candidates.Where(x =>
						(x.CandidateName?.ToLower().Contains(search.ToLower()) ?? false)).ToList();
				}
				var statusCounts = applicationStatusMap
				.Select(ap => new
				{
					statusId = ap.Key,
					Status = ap.Value,
					CandidateCount = candidates.Count(c => c.JobOfferStatusId == ap.Key)
				})
				.ToList();
				if (status > 0)
				{
					candidates = candidates.Where(x => x.JobOfferStatusId == status).ToList();

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
					statusList = statusCounts
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

		public async Task<JsonResult> RetrieveJobOfferInfoService(int jobOfferId)
		{
			JsonResult result;
			try
			{
				
				var jobOfferInfo =
					await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(jobOfferId);
				var statusList = await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferStatusList();
				result = new JsonResult(new { jobOfferInfo, statusList })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving jobOffer: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving jobOffer: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveJobOfferInfoPublicService(string jobOfferId)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(jobOfferId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var jobOfferInfo =
					await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(recordId);

				result = new JsonResult(new { jobOfferInfo })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving jobOffer: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving jobOffer: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateJobOfferInformationService(int jobOfferInfoId,
			JobOfferRequestDto jobOfferRequestDto)
		{
			JsonResult result;
			try
			{
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = jobOfferInfoId,
					TotalRenderingPeriod = jobOfferRequestDto.TotalRenderingPeriod,
					TargetStartDate = jobOfferRequestDto.TargetStartDate,
					ProbitionarySalary = EncryptionServices.Encrypt(jobOfferRequestDto.ProbitionarySalary),
					ProbitionaryDeminimis = EncryptionServices.Encrypt(jobOfferRequestDto.ProbitionaryDeminimis),
					RegularSalary = EncryptionServices.Encrypt(jobOfferRequestDto.RegularSalary),
					RegularDeminimis = EncryptionServices.Encrypt(jobOfferRequestDto.RegularDeminimis),
					ApproverId = jobOfferRequestDto.ApproverId,
					JobOfferStatusId = jobOfferRequestDto.JobOfferStatusId
				};
				await _uoWForCurrentService.JobOfferRepository.UpdateJobOffer(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating jobOfferInformation: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating jobOfferInformation: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> JobOfferApprovedService(string jobOfferInfoId,
			string approverSignature)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(jobOfferInfoId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = recordId,
					ApproverSignature = approverSignature,
					IsApproved = true,
					ApprovedDate = DateTime.Now
				};
				await _uoWForCurrentService.JobOfferRepository.JobOfferApproved(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				await _applicationProcess.SendEmailSalaryPackageApprovedTemplate(recordId, 4);

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Approved" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while approving: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while approving: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> JobOfferSalaryDeclinedService(string jobOfferInfoId, string approverNotes)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(jobOfferInfoId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = recordId,
					IsApproved = false,
					ApproverNotes = approverNotes,
				};
				await _uoWForCurrentService.JobOfferRepository.JobOfferSalaryDeclined(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				await _applicationProcess.SendEmailSalaryPackageDeclinedTemplate(recordId, 5);

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Declined" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while approving: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while approving: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> JobOfferAcceptedService(string jobOfferInfoId, string candidateSignature)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(jobOfferInfoId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = recordId,
					CandidateSignature = candidateSignature,
					IsCandidateAccepted = true,
					AcceptedDate = DateTime.Now
				};
				await _uoWForCurrentService.JobOfferRepository.JobOfferAccepted(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				await _applicationProcess.SendEmailOnboardingAutomation(recordId, 4);

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Accepted" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while accepting: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while accepting: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> JobOfferDeclinedService(string jobOfferInfoId, string candidateNotes)
		{
			JsonResult result;
			try
			{
				var decrypted = EncryptProvider.Base64Decrypt(jobOfferInfoId, Encoding.Unicode);
				var recordId = Convert.ToInt32(decrypted);
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = recordId,
					IsApproved = false,
					CandidateNotes = candidateNotes,
				};
				await _uoWForCurrentService.JobOfferRepository.JobOfferDeclined(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Declined" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while approving: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while approving: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateJobOfferStatusService(int jobOfferInfoId,
			int jobOfferStatusId)
		{
			JsonResult result;
			try
			{
				var jobOfferInformation = new JobOfferInformation()
				{
					CandidateId = jobOfferInfoId,
					JobOfferStatusId = jobOfferStatusId,
					OfferSentDate = jobOfferStatusId == 3 ? DateTime.Now : null
				};
				await _uoWForCurrentService.JobOfferRepository.UpdateJobOfferStatus(jobOfferInformation);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating jobOfferInformation: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating jobOfferInformation: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveEmailBodyContentService(int candidateId)
		{
			JsonResult result;
			try
			{
				var candidate = await _uoWForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);
				var emailContent = await _uoWForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(12);

				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");

				var encryptedId = EncryptProvider.Base64Encrypt(candidateId.ToString(), Encoding.Unicode);

				emailContent.EmailBody = emailContent.EmailBody.Replace("[job_offer_link]", "https://172.16.254.4/joboffer/acceptance/" + $"{encryptedId}");

				result = new JsonResult(new { emailContent })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating jobOfferInformation: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating jobOfferInformation: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<byte[]> ExportCandidateToExcelService(int candidateId)
		{
			try
			{
				var jobOfferInfo =
					await _uoWForCurrentService.JobOfferRepository.RetrieveJobOfferInfo(candidateId);
				ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
				using var package = new ExcelPackage();
				//{
				var worksheet = package.Workbook.Worksheets.Add("Candidate Info");

				// Sample Excel population
				worksheet.Cells["A1"].Value = "Candidate Name";
				worksheet.Cells["B1"].Value = "Position";
				worksheet.Cells["C1"].Value = "Probationary Basic Pay";
				worksheet.Cells["D1"].Value = "Probationary Non Taxable (Deminimis)";
				worksheet.Cells["E1"].Value = "Probationary Total Compensation";
				worksheet.Cells["F1"].Value = "Regular Basic Pay";
				worksheet.Cells["G1"].Value = "Regular Non Taxable (Deminimis)";
				worksheet.Cells["H1"].Value = "Regular Total Compensation";
				worksheet.Cells["I1"].Value = "Probationary Deminimis";
				worksheet.Cells["J1"].Value = "Regular Deminimis";

				using (var range = worksheet.Cells[1, 1, 1, 10])
				{
					range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
					range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(38, 38, 38));
					range.Style.Font.Color.SetColor(System.Drawing.Color.White);
					range.Style.Font.Bold = true;
					range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
				}

				worksheet.Cells["A2"].Value = jobOfferInfo.CandidateName;
				worksheet.Cells["B2"].Value = jobOfferInfo.Position;

				worksheet.Cells["C2"].Value = Convert.ToInt32(jobOfferInfo.ProbitionarySalary);
				worksheet.Cells["C2"].Style.Numberformat.Format = "0";
				worksheet.Cells["C2"].Style.Numberformat.Format = "₱#,##0.00";

				worksheet.Cells["D2"].Value = Convert.ToInt32(jobOfferInfo.ProbitionaryDeminimis);
				worksheet.Cells["D2"].Style.Numberformat.Format = "₱#,##0.00";
				worksheet.Cells["D2"].Style.Numberformat.Format = "0";

				worksheet.Cells["E2"].Value = Convert.ToInt32(jobOfferInfo.ProbitionarySalary) + Convert.ToInt32(jobOfferInfo.ProbitionaryDeminimis);
				worksheet.Cells["E2"].Style.Numberformat.Format = "0";
				worksheet.Cells["E2"].Style.Numberformat.Format = "₱#,##0.00";

				worksheet.Cells["F2"].Value = Convert.ToInt32(jobOfferInfo.RegularSalary);
				worksheet.Cells["F2"].Style.Numberformat.Format = "₱#,##0.00";
				worksheet.Cells["F2"].Style.Numberformat.Format = "0";

				worksheet.Cells["G2"].Value = Convert.ToInt32(jobOfferInfo.RegularDeminimis);
				worksheet.Cells["G2"].Style.Numberformat.Format = "₱#,##0.00";
				worksheet.Cells["G2"].Style.Numberformat.Format = "0";

				worksheet.Cells["H2"].Value = Convert.ToInt32(jobOfferInfo.RegularSalary) + Convert.ToInt32(jobOfferInfo.RegularDeminimis);
				worksheet.Cells["H2"].Style.Numberformat.Format = "0";
				worksheet.Cells["H2"].Style.Numberformat.Format = "₱#,##0.00";

				worksheet.Cells["I2"].Value = Convert.ToInt32(jobOfferInfo.ProbitionaryDeminimis) / 5;
				worksheet.Cells["I2"].Style.Numberformat.Format = "0";
				worksheet.Cells["I2"].Style.Numberformat.Format = "₱#,##0.00";

				worksheet.Cells["J2"].Value = Convert.ToInt32(jobOfferInfo.RegularDeminimis) / 5;
				worksheet.Cells["J2"].Style.Numberformat.Format = "0";
				worksheet.Cells["J2"].Style.Numberformat.Format = "₱#,##0.00";

				using (var range = worksheet.Cells[2, 1, 2, 10])
				{
					range.Style.Font.Bold = true;
					range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
				}

				worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

				return package.GetAsByteArray();
			}
			catch (Exception ex)
			{
				// Log error or debug breakpoint
				throw new Exception("Error generating Excel file: " + ex.Message, ex);
			}

		}
	}
}