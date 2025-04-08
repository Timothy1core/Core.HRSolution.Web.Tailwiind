using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;
using Recruitment.Service.API.Core.UnitOfWork;

namespace Recruitment.Service.API.Persistence.Applications
{
	public class EmailTemplateServices(
		IUoWForCurrentService uoWForCurrentService,
		ILogger<DepartmentServices> logger
	) : IEmailTemplateServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly ILogger<DepartmentServices> _logger = logger;

		public async Task<JsonResult> CreateEmailTemplate(EmailTemplate emailTemplateRequest)
		{
			JsonResult result;
			try
			{
				
				await _uoWForCurrentService.EmailTemplateRepository.CreateEmailTemplate(emailTemplateRequest);
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
				_logger.LogError($"Error occurred while creating email template: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating email template: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> UpdateEmailTemplate(EmailTemplate emailTemplateRequest)
		{
			JsonResult result;
			try
			{
				var emailTemplate = new EmailTemplate()
				{
					Name = emailTemplateRequest.Name,
					Subject = emailTemplateRequest.Subject,
					EmailBody = emailTemplateRequest.EmailBody

				};
				await _uoWForCurrentService.EmailTemplateRepository.UpdateEmailTemplate(emailTemplateRequest);
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
				_logger.LogError($"Error occurred while updating email template: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating email template: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RemoveEmailTemplate(int id)
		{
			JsonResult result;
			try
			{
				
				await _uoWForCurrentService.EmailTemplateRepository.RemoveEmailTemplate(id);
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
				_logger.LogError($"Error occurred while remove email template: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while remove email template: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> RetrieveEmailTemplateDashboard()
		{
			JsonResult result;
			try
			{



				var templates = await _uoWForCurrentService.EmailTemplateRepository.SelectEmailTemplate();

				result = new JsonResult(new
				{
					templates,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving email template: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving email template: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> SelectEmailTemplateDropDown()
		{
			JsonResult result;
			try
			{
				var values = await _uoWForCurrentService.EmailTemplateRepository.SelectTemplateDropDown();

				result = new JsonResult(new { values })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving email template drop down value: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving email template drop down value: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> CreateEmailAutomation(EmailAutomation emailAutomation)
		{
			JsonResult result;
			try
			{

				await _uoWForCurrentService.EmailTemplateRepository.CreateEmailAutomation(emailAutomation);
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
				_logger.LogError($"Error occurred while creating email template: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating email template: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateEmailAutomation(EmailAutomation emailAutomationRequest)
		{
			JsonResult result;
			try
			{
				var emailAutomation = new EmailAutomation()
				{
					Id = emailAutomationRequest.Id,
					JobId = emailAutomationRequest.JobId,
					EmailTemplate = emailAutomationRequest.EmailTemplate,
					ApplicationId = emailAutomationRequest.ApplicationId ?? 1,
					Disqualified = emailAutomationRequest.Disqualified,
					Type = emailAutomationRequest.Type,

				};
				await _uoWForCurrentService.EmailTemplateRepository.UpdateEmailAutomation(emailAutomation);
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
				_logger.LogError($"Error occurred while updating email automation: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating email automation: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> RetrieveEmailAutomationDashboard()
		{
			JsonResult result;
			try
			{



				var automations = await _uoWForCurrentService.EmailTemplateRepository.SelectEmailAutomationDashboard();

				result = new JsonResult(new
				{
					automations,
				})
				{
					StatusCode = 200
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving email automation: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving email automation: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

	}
}
