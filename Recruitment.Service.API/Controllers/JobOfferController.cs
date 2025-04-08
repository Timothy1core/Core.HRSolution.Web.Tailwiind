using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OutlookServiceLibrary;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Persistence.Helpers;
using Spire.Doc;
using System.Security.Claims;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class JobOfferController(
		IJobOfferServices jobOfferServices,
		IFileService fileService,
		GraphService graphService,
		IApplicationProcessHelper applicationProcessHelper

	) : ControllerBase
	{

		private readonly IJobOfferServices _jobOfferServices = jobOfferServices;
		private readonly IFileService _fileService = fileService;
		private readonly GraphService _graphService = graphService;
		private readonly IApplicationProcessHelper _applicationProcessHelper = applicationProcessHelper;

		[AllowAnonymous]
		[HttpPost("save_job_offer_info")]
		public async Task<IActionResult> SaveJobOfferInformation([FromForm] JobOfferRequestDto jobOffer)
		{

			var result = await _jobOfferServices.SaveJobOfferInformationService(jobOffer);

			return result;
		}

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpPost("list_for_job_offer")]
		public async Task<IActionResult> RetrieveDashboardForJobOffer([FromForm] string? search)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;
			var status = Convert.ToInt32(HttpContext.Request.Form["status"]);


			var result = await _jobOfferServices.RetrieveAllCandidateForJobOfferService(
				search, start, length, draw,
				sortColumnName, sortDirection,
				status);
			;
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_job_offer/{id}")]
		public async Task<IActionResult> RetrieveJobOfferInfo(int id)
		{

			var result = await _jobOfferServices.RetrieveJobOfferInfoService(id);

			return result;

		}


		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_job_offer_info/{id}")]
		public async Task<IActionResult> UpdateJobOfferInformation(int id, [FromForm] JobOfferRequestDto jobOfferInfoRequest)
		{
			var result = await _jobOfferServices.UpdateJobOfferInformationService(id, jobOfferInfoRequest);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("job_offer_approved/{id}")]
		public async Task<IActionResult> JobOfferApproved(int id, [FromForm] string approverSignature)
		{
			var result = await _jobOfferServices.JobOfferApprovedService(id, approverSignature);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("job_offer_salary_declined/{id}")]
		public async Task<IActionResult> JobOfferSalaryDeclined(int id, [FromForm] string approverNotes)
		{
			var result = await _jobOfferServices.JobOfferSalaryDeclinedService(id, approverNotes);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("job_offer_accepted/{id}")]
		public async Task<IActionResult> JobOfferAccepted(int id, [FromForm] string candidateSignature)
		{
			var result = await _jobOfferServices.JobOfferAcceptedService(id, candidateSignature);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("job_offer_declined/{id}")]
		public async Task<IActionResult> JobOfferDeclined(int id, [FromForm] string candidateNotes)
		{
			var result = await _jobOfferServices.JobOfferDeclinedService(id, candidateNotes);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_job_offer_status/{id}")]
		public async Task<IActionResult> UpdateJobOfferStatus(int id, [FromForm] int jobOfferStatusId)
		{
			var result = await _jobOfferServices.UpdateJobOfferStatusService(id, jobOfferStatusId);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpGet("retrieve_email_body_content/{id}")]
		public async Task<IActionResult> RetrieveEmailBodyContent(int id)
		{
			var result = await _jobOfferServices.RetrieveEmailBodyContentService(id);
			return result;
		}

		[AllowAnonymous]
		[HttpGet("send_email_job_offer/{id}")]
		public async Task<IActionResult> SendEmailForPendingDocuments(int id)
		{

			var result = await _applicationProcessHelper.SendEmailJobOfferTemplate(id, 12);
			return Ok(result);
		}

		[AllowAnonymous]
		[HttpGet("job_offer_export_excel/{id}")]
		public async Task<IActionResult> ExportCandidateToExcel(int id)
		{
			var fileContent = await _jobOfferServices.ExportCandidateToExcelService(id);

			if (fileContent == null)
				return NotFound("Candidate not found or export failed.");

			var fileName = $"Candidate_{id}.xlsx";
			return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
		}

	}
}
