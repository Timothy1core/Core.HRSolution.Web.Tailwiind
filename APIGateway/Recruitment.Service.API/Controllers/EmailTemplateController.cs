using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Persistence.Applications;
using System.Security.Claims;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EmailTemplateController(
		IEmailTemplateServices emailTemplateServices,
		IFileService fileService

	) : ControllerBase
	{

		private readonly IEmailTemplateServices _emailTemplateServices = emailTemplateServices;
		private readonly IFileService _fileService = fileService;

		[Authorize]
		[Permission("create.email.template")]
		[HttpPost("create")]
		public async Task<IActionResult> CreateEmailTemplate([FromForm] EmailTemplateRequestDto emailTemplateRequest)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var emailTemplate = new EmailTemplate()
			{
				Name = emailTemplateRequest.Name,
				Subject = emailTemplateRequest.Subject,
				EmailBody = emailTemplateRequest.EmailBody,
				CreatedDate = DateTime.UtcNow.AddHours(8),
				CreatedBy = loggedEmployee,
				Cc = emailTemplateRequest.EmailCc,
				EmailActionId = emailTemplateRequest.EmailAction,
				IsActive = true

			};
			var result = await _emailTemplateServices.CreateEmailTemplate(emailTemplate);

			return result;
		}

		[Authorize]
		[Permission("update.email.template")]
		[HttpPut("update/{id}")]
		public async Task<IActionResult> UpdateEmailTemplate([FromForm] EmailTemplateRequestDto emailTemplateRequest, int id)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var emailTemplate = new EmailTemplate()
			{
				Id = id,
				Name = emailTemplateRequest.Name,
				Subject = emailTemplateRequest.Subject,
				EmailBody = emailTemplateRequest.EmailBody,
				Cc = emailTemplateRequest.EmailCc

			};

			var result = await _emailTemplateServices.UpdateEmailTemplate(emailTemplate);

			return result;
		}


		[Authorize]
		[Permission("email.template.list")]
		[HttpGet("dashboard")]
		public async Task<IActionResult> RetrieveEmailTemplateDashboard()
		{

			var result = await _emailTemplateServices.RetrieveEmailTemplateDashboard();

			return result;
		}


		[Authorize]
		[Permission("create.email.automation")]
		[HttpPost("create_automation")]
		public async Task<IActionResult> CreateEmailAutomation([FromForm] EmailAutomationRequestDto emailAutomationRequest)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var emailTemplate = new EmailAutomation()
			{
				JobId = emailAutomationRequest.Job,
				EmailTemplate = emailAutomationRequest.Template,
				ApplicationId = emailAutomationRequest.Stage ?? 1,
				Disqualified = emailAutomationRequest.Disqualified,
				Type = emailAutomationRequest.Type,

				CreatedDate = DateTime.UtcNow.AddHours(8),
				CreatedBy = loggedEmployee,

				IsActive = true

			};
			var result = await _emailTemplateServices.CreateEmailAutomation(emailTemplate);

			return result;
		}

		[Authorize]
		[Permission("update.email.automation")]
		[HttpPut("update_automation/{id}")]
		public async Task<IActionResult> UpdateEmailAutomation([FromForm] EmailAutomationRequestDto emailAutomationRequest, int id)
		{

			var emailTemplate = new EmailAutomation()
			{
				Id = id,
				JobId = emailAutomationRequest.Job,
				EmailTemplate = emailAutomationRequest.Template,
				ApplicationId = emailAutomationRequest.Stage ?? 1,
				Disqualified = emailAutomationRequest.Disqualified,
				Type = emailAutomationRequest.Type,
			};
			var result = await _emailTemplateServices.UpdateEmailAutomation(emailTemplate);

			return result;
		}


		[Authorize]
		[Permission("email.automation.list")]
		[HttpGet("dashboard_automation")]
		public async Task<IActionResult> RetrieveEmailAutomationDashboard()
		{

			var result = await _emailTemplateServices.RetrieveEmailAutomationDashboard();

			return result;
		}

		[Authorize]
		[HttpGet("retrieve_dropdown")]
		public async Task<IActionResult> RetrieveJobProfileApplicationProcess()
		{

			var result = await _emailTemplateServices.SelectEmailTemplateDropDown();

			return result;
		}

		[Authorize]
		[HttpGet("retrieve_email_action_dropdown")]
		public async Task<IActionResult> RetrieveEmailActionDropDown()
		{

			var result = await _emailTemplateServices.SelectEmailActionDropDown();

			return result;
		}


	}
}
