using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate;

namespace Recruitment.Service.API.Core.Applications;

public interface IEmailTemplateServices

{
	Task<JsonResult> CreateEmailTemplate(EmailTemplate emailTemplateRequest);
	Task<JsonResult> UpdateEmailTemplate(EmailTemplate emailTemplateRequest);
	Task<JsonResult> RemoveEmailTemplate(int id);
	Task<JsonResult> RetrieveEmailTemplateDashboard();
	Task<JsonResult> SelectEmailTemplateDropDown();
	Task<JsonResult> CreateEmailAutomation(EmailAutomation emailAutomation);
	Task<JsonResult> UpdateEmailAutomation(EmailAutomation emailAutomationRequest);
	Task<JsonResult> RetrieveEmailAutomationDashboard();
}