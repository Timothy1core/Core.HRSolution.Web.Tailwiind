using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IEmailTemplateRepository
{
	Task CreateEmailTemplate(EmailTemplate emailTemplate);
	Task UpdateEmailTemplate(EmailTemplate emailTemplate);
	Task RemoveEmailTemplate(int id);
	Task<List<EmailTemplateActionDto>> SelectEmailTemplate();

	Task<EmailTemplate> SelectEmailTemplateInformation(int id);

	Task<List<DropDownValueDto>> SelectTemplateDropDown();

	Task CreateEmailAutomation(EmailAutomation emailAutomation);
	Task UpdateEmailAutomation(EmailAutomation emailAutomation);

	Task<List<EmailAutomationDashboardDto>> SelectEmailAutomationDashboard();
	Task<EmailAutomation> SelectEmailAutomation(int jobId, int applicationId, int type);

}