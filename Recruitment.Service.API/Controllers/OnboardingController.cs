using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OutlookServiceLibrary;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.WorkFromHome;
using Recruitment.Service.API.Persistence.Applications;
using System.Security.Claims;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class OnboardingController(
		IOnboardingServices onboardingServices,
		IApplicationProcessHelper applicationProcessHelper,
		IFileService fileService,
		GraphService graphService

	) : ControllerBase
	{

		private readonly IOnboardingServices _onboardingServices = onboardingServices;
		private readonly IApplicationProcessHelper _applicationProcessHelper = applicationProcessHelper;
		private readonly IFileService _fileService = fileService;
		private readonly GraphService _graphService = graphService;

		[AllowAnonymous]
		[HttpPost("save_onboarding_info")]
		public async Task<IActionResult> SaveOnboardingInformationSheet([FromForm] OnboardingInformationSheetRequestDto onboardingInfoDto)
		{

			var result = await _onboardingServices.SaveOnboardingInformationSheetService(onboardingInfoDto);

			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_onboarding_info/{id}")]
		public async Task<IActionResult> RetrieveOnboardingInformationSheet(int id)
		{

			var result = await _onboardingServices.RetrieveOnboardingInformationSheetService(id);

			return result;

		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("onboarding_form_infos/{id}")]
		public async Task<IActionResult> RetrieveOnboardingFormInformations(string id)
		{

			var result = await _onboardingServices.RetrieveOnboardingFormInformations(id);

			return result;

		}

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpPost("list_onboarding_info")]
		public async Task<IActionResult> RetrieveDashboardOnboardingInformationSheet([FromForm] string? search)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;

			var result = await _onboardingServices.RetrieveAllOnboardingInformationSheetService(
				search, start, length, draw,
				sortColumnName, sortDirection);
			;
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_onboarding_info/{id}")]
		public async Task<IActionResult> UpdateOnboardingInformation(string id, [FromForm] OnboardingInformationSheetRequestDto onboardinInfoRequestDto)
		{
			var result = await _onboardingServices.UpdateOnboardingInformationService(id, onboardinInfoRequestDto);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("acknowledged_onboarding_form/{id}")]
		public async Task<IActionResult> AcknowledgeOnboardingForm(string id, [FromForm] bool isAcknowledged)
		{
			var result = await _onboardingServices.AcknowledgeOnboardingFormService(id, isAcknowledged);
			return result;
		}

		[RequestSizeLimit(104857600)] // 100 MB
		[AllowAnonymous]
		[HttpPost("save_onboarding_document")]
		public async Task<IActionResult> SaveOnboardingDocument([FromForm] List<OnboardingDocumentRequestDto> onboardingDocuDto)
		{

			var result = await _onboardingServices.SaveOnboardingDocumentService(onboardingDocuDto);

			return result;
		}


		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_onboarding_document/{id}")]
		public async Task<IActionResult> RetrieveOnboardingDocument(int id)
		{

			var result = await _onboardingServices.RetrieveOnboardingDocumentService(id);

			return result;

		}

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpPost("list_onboarding_document")]
		public async Task<IActionResult> RetrieveDashboardOnboardingDocument([FromForm] int id)
		{

			var result = await _onboardingServices.RetrieveAllOnboardingDocumentService(id);
			;
			return result;
		}

		[AllowAnonymous]
		[HttpPost("save_wfh_info")]
		public async Task<IActionResult> SaveWorkFromHomeInformation([FromForm] WorkFromHomeInformationRequestDto workFromHomeInfo)
		{

			var result = await _onboardingServices.SaveWorkFromHomeInformationService(workFromHomeInfo);

			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.retrieve.assessment.info")]
		[HttpGet("info_wfh_info/{id}")]
		public async Task<IActionResult> RetrieveWorkFromHomeInformationSheet(int id)
		{

			var result = await _onboardingServices.RetrieveWorkFromHomeInformationService(id);

			return result;

		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("update_wfh_info/{id}")]
		public async Task<IActionResult> UpdateWorkFromHomeInformation(string id, [FromForm] WorkFromHomeInformationRequestDto workFromHomeInfoRequestDto)
		{
			var result = await _onboardingServices.UpdateWorkFromHomeInformationService(id, workFromHomeInfoRequestDto);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("wfh_info_hr_approve/{id}")]
		public async Task<IActionResult> WorkFromHomeInfoHrApprove(int id, [FromForm] string HrApprover)
		{
			var result = await _onboardingServices.WorkFromHomeInformationHrApproveService(id, HrApprover);
			return result;
		}

		[AllowAnonymous]
		// [Authorize]
		// [Permission("system.update.assessment")]
		[HttpPut("wfh_info_it_approve/{id}")]
		public async Task<IActionResult> WorkFromHomeInfoItApprove(int id, [FromForm] string ItApprover)
		{
			var result = await _onboardingServices.WorkFromHomeInformationItApproveService(id, ItApprover);
			return result;
		}

		[AllowAnonymous]
		[HttpGet("candidate_document/{id}/{documentType}")]
		public async Task<IActionResult> CandidateDocument(int id, string documentType)
		{

			var document = await _onboardingServices.RetrieveSpecificOnboardingDocument(id, documentType);

			return PhysicalFile(document.filePath, document.contentType);
		}

		[AllowAnonymous]
		[HttpGet("candidate_documents/{id}/{documentType}")]
		public async Task<IActionResult> CandidateDocuments(int id, string documentType)
		{
			var documents = await _onboardingServices.RetrieveAllOnboardingDocuments(id, documentType);

			if (documents == null || !documents.Any())
				return NotFound("No documents found for this candidate and type.");

			var baseUrl = $"{Request.Scheme}://{Request.Host}/api/onboarding";

			var result = documents.Select(d => new
			{
				url = $"{baseUrl}/candidate_document/{id}/{documentType}",
				contentType = d.contentType
			});

			return Ok(result);
		}

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpGet("send_email_pending_pre_docs/{id}")]
		public async Task<IActionResult> SendEmailForPendingDocuments(int id)
		{

			var result = await _applicationProcessHelper.SendEmailPendingPreDocsTemplate(id, 10);
			return Ok(result);
		}

		// [Authorize]
		// [Permission("recruitment.retrieve.dashboard.candidate")]
		[AllowAnonymous]
		[HttpGet("send_email_pending_general_docs/{id}")]
		public async Task<IActionResult> SendEmailForPendingGeneralDocuments(int id)
		{

			var result = await _applicationProcessHelper.SendEmailPendingGeneralDocsTemplate(id, 11);
			return Ok(result);
		}

	}
}
