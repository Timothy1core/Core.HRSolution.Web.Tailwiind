using EmailServiceLibrary;
using EmailServiceLibrary.Core.Model.Dto;
using FileServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;
using Recruitment.Service.API.Core.UnitOfWork;
using Recruitment.Service.API.Persistence.Helpers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Linq.Dynamic.Core;
namespace Recruitment.Service.API.Persistence.Applications
{
	public class TalentAcquisitionFormServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<DepartmentServices> logger,
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		ITalentAcquisitionFormHelper talentAcquisitionFormHelper

	) : ITalentAcquisitionFormServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<DepartmentServices> _logger = logger;
		private readonly ITalentAcquisitionFormHelper _helper = talentAcquisitionFormHelper;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task<JsonResult> RetrieveTAFStatusDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.TalentAcquisitionStatusRepository.SelectTalentAcquisitionStatusDropDown();

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

		public async Task<JsonResult> RetrieveTAFReasonDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.TalentAcquisitionReasonRepository.SelectTalentAcquisitionReasonDropDown();

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

		public async Task<JsonResult> RetrieveWorkArrangementDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.WorkArrangementRepository.SelectWorkArrangementDropDown();

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

		public async Task<JsonResult> RetrieveTAFDropDown(int departmentId)
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.TalentAcquisitionFormRepository.SelectTalentAcquisitionFormDropDown(departmentId);

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

		public async Task<JsonResult> CreateTalentAcquisitionForm(TalentAcquisitionFormRequestDto tafRequest,string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var taf = new TalentAcquisitionForm()
				{
				  DepartmentId = tafRequest.DepartmentId,
				  RequestDate = tafRequest.RequestDate,
				  StatusId = tafRequest.StatusId,
				  ReasonId = tafRequest.ReasonId,
				  Headcount = tafRequest.Headcount,
				  JobId = tafRequest.JobId,
				  TargetStartDate = tafRequest.TargetStartDate,
				  TargetSalaryRange = tafRequest.TargetSalaryRange,
				  WorkArrangement = tafRequest.WorkArrangement,
				  Schedule = tafRequest.Schedule,
				  Equipment = tafRequest.Equipment,
				  Notes = tafRequest.Notes,
				  Negotiable = tafRequest.Negotiable,
				  NonNegotiable = tafRequest.NonNegotiable,
				  InterviewSchedule = tafRequest.InterviewSchedule,
				  HiringManager = tafRequest.HiringManager,
				  CreatedBy = loggedEmployee,
				  CreatedDate = DateTime.UtcNow.AddHours(8)
				};
				await _uoWForCurrentService.TalentAcquisitionFormRepository.CreateTalentAcquisitionForm(taf);
				await _uoWForCurrentService.CommitAsync();

				
				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateTalentAcquisitionForm(TalentAcquisitionFormRequestDto tafRequest, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				var taf = new TalentAcquisitionForm()
				{
					Id = tafRequest.Id!.Value,
					DepartmentId = tafRequest.DepartmentId,
					RequestDate = tafRequest.RequestDate,
					StatusId = tafRequest.StatusId,
					ReasonId = tafRequest.ReasonId,
					Headcount = tafRequest.Headcount,
					JobId = tafRequest.JobId,
					TargetStartDate = tafRequest.TargetStartDate,
					TargetSalaryRange = tafRequest.TargetSalaryRange,
					WorkArrangement = tafRequest.WorkArrangement,
					Schedule = tafRequest.Schedule,
					Equipment = tafRequest.Equipment,
					Notes = tafRequest.Notes,
					Negotiable = tafRequest.Negotiable,
					NonNegotiable = tafRequest.NonNegotiable,
					InterviewSchedule = tafRequest.InterviewSchedule,
					HiringManager = tafRequest.HiringManager,
					CreatedBy = loggedEmployee,
					CreatedDate = DateTime.UtcNow.AddHours(8)
				};
				await _uoWForCurrentService.TalentAcquisitionFormRepository.UpdateTalentAcquisitionForm(taf);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> SelectTalentAcquisitionFormDetail(int id)
		{
			JsonResult result;
			try
			{


				var info = await _uoWForCurrentService.TalentAcquisitionFormRepository.SelectTalentAcquisitionFormInfo(id);

				var taf = new 
				{
					Id = info.Id,
					requestDate = info.RequestDate,
					StatusId = info.StatusId,
					ReasonId = info.ReasonId,
					Headcount = info.Headcount,
					DepartmentId = info.DepartmentId,
					JobId = info.JobId,
					Negotiable = info.Negotiable,
					NonNegotiable = info.NonNegotiable,
					TargetSalaryRange = info.TargetSalaryRange,
					InterviewSchedule = info.InterviewSchedule,
					HiringManager = info.HiringManager,
					TargetStartDate = info.TargetStartDate,
					WorkArrangement = info.WorkArrangement,
					Schedule = info.Schedule,
					Equipment = info.Equipment,
					Notes = info.Notes,
				};

				result = new JsonResult(new { taf })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveTalentAcquisitionFormDashboard(int group,int client,int status, int reason, string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
		{
			JsonResult result;
			try
			{

				var taf = await _uoWForCurrentService.TalentAcquisitionFormRepository.SelectTalentAcquisitionFormDashboard(group, client, status, reason);

				var totalRows = taf.Count();

				taf = !string.IsNullOrEmpty(search) ? taf.Where(x =>
					x.Position.ToLower().Contains(search.ToLower()) ||
					x.WorkArrangement.ToLower().Contains(search.ToLower()) ||
					x.TargetStartDate.ToLower().Contains(search.ToLower())).ToList() : taf.ToList();

				var totalRowsAfterFiltering = taf.Count();

				taf = taf.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
				taf = length != -1 ? taf.Skip(start).Take(length).ToList() : taf.ToList();

				result = new JsonResult(new { data = taf, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
				{
					StatusCode = 200
				};
				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		
		public async Task<JsonResult> SendTalentAcquisitionForm(TalentAcquisitionFormBatchDto batchDto, string loggedEmployee)
		{
			JsonResult result;
			try
			{
				
				var batch = new TalentAcquisitionFormBatch()
				{
					Approver = batchDto.ClientApprover,
					SendDate = DateTime.UtcNow.AddHours(8),
					SendBy = loggedEmployee
				};
				await _uoWForCurrentService.TalentAcquisitionFormBatchRepository.CreateTalentAcquisitionFormBatch(batch,batchDto.TafId);
				await _uoWForCurrentService.CommitAsync();
				var info =await _uoWForCurrentService.TalentAcquisitionFormBatchRepository.SelectTalentAcquisitionFormBatchInfo(batch.Id);
				await _helper.SendEmailForAcknowledgement(info);
				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> SelectTalentAcquisitionForm(int id)
		{
			JsonResult result;
			try
			{

				
				var info = await _uoWForCurrentService.TalentAcquisitionFormBatchRepository.SelectTalentAcquisitionFormBatchInfo(id);


				var taf = new ClientTalentAcquisitionFormInfoDto()
				{
					Id = info.Id,
					ClientApproverName = info.ApproverDetail.Name,
					ClientApproverEmail = info.ApproverDetail.Email,
					CompanyName = info.ApproverDetail.Department.Name,
					Signature = info.Signature,
					ApproveDate = info.ApprovalDate.HasValue? info.ApprovalDate.Value.ToString("MM/dd/yyyy hh:mm:ss tt") : "MM/dd/yyyy",
					TalentAcquisitionForms = info.TalentAcquisitionForms.Select(s=> new TalentAcquisitionFormDashboardDto()
					{
						Id = s.Id,
						Headcount = s.Headcount,
						Position = s.Job.Position,
						Reason = s.Reason.Reason,
						Status = s.Status.Status,
						TargetStartDate = s.TargetStartDate.ToString("MMMM dd, yyyy"),
						WorkArrangement = s.WorkArrangementDetail.Arrangement
					}).ToList()
				};

				result = new JsonResult(new { taf })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> SaveClientAcknowledgment(TalentAcquisitionClientAcknowledgmentDto requestDto)
		{
			JsonResult result;
			try
			{


				await _uoWForCurrentService.TalentAcquisitionFormBatchRepository.SaveAcknowledgement(requestDto);
				await _uoWForCurrentService.CommitAsync();

				var info = await _uoWForCurrentService.TalentAcquisitionFormBatchRepository.SelectTalentAcquisitionFormBatchInfo(requestDto.Id);

				await _helper.CreateDocumentSigned(info);
				await _helper.SendEmailForSignedDocument(info);


				result = new JsonResult(new { success = true, responseText = "Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating taf: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating taf: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

	}
}
