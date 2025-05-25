using Microsoft.AspNetCore.Mvc;

namespace Recruitment.Service.API.Core.Helpers;

public interface IApplicationProcessHelper
{
	Task SendEmailAppliedAutomation(int candidateId, int type);
	Task SendEmailOnboardingAutomation(int candidateId, int type);
	Task<JsonResult> SendEmailPendingPreDocsTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailPendingGeneralDocsTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailJobOfferTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailSalaryPackageApprovalTemplate(int offerId, int templateId);
	Task<JsonResult> SendEmailSalaryPackageApprovedTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailSalaryPackageDeclinedTemplate(int candidateId, int templateId);

	Task<JsonResult> SendEmailCompletedCoreInformationTemplate(int candidateId, int templateId);

	Task<JsonResult> SendEmailReadyToStartToCandidateTemplate(int candidateId, int templateId);
	Task<JsonResult> SendEmailReadyToStartToTeamTemplate(int candidateId, int templateId);
}