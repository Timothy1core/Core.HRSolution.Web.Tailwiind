using Microsoft.AspNetCore.Mvc;

namespace Recruitment.Service.API.Core.Helpers;

public interface IApplicationProcessHelper
{
	Task SendEmailAppliedAutomation(int candidateId, int type);
	Task SendEmailOnboardingAutomation(int candidateId, int type);
	Task<JsonResult> SendEmailPendingPreDocsTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailPendingGeneralDocsTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailJobOfferTemplate(int candidateId, int templateId);
}