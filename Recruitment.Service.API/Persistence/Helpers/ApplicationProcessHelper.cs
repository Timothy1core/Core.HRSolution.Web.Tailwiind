using EmailServiceLibrary.Core.Model.Dto;
using EmailServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Recruitment.Service.API.Core.UnitOfWork;
using Novacode.NETCorePort;
using Recruitment.Service.API.Core.Helpers;
using System.Text;
using NETCore.Encrypt;
using Microsoft.AspNetCore.Mvc;

namespace Recruitment.Service.API.Persistence.Helpers
{
	public class ApplicationProcessHelper(
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IEmailService emailService,
		IUoWForCurrentService uoWForCurrentService
	)
	: IApplicationProcessHelper
	{
		private readonly IEmailService _emailService = emailService;
		private readonly IUoWForCurrentService _uniForCurrentService = uoWForCurrentService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task SendEmailAppliedAutomation(int candidateId, int type)
		{
			var emailTemplatePath = Path.Combine(_fileRootFolder ?? string.Empty, "document_template", "EmailTemplate.html");

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var candidate = await _uniForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);


			var getAutomation = await _uniForCurrentService.EmailTemplateRepository.SelectEmailAutomation(candidate.JobId, candidate.ApplicationStatusId, type);

			{
				var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(getAutomation.EmailTemplate);


				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_full_name]", $"{candidate.FirstName} {candidate.LastName}");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_email]", $"{candidate.Email}");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[job_title]", $"{candidate.Job.Position}");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[job_link]", "");
				emailContent.EmailBody = emailContent.EmailBody.Replace("[assessment_password]", candidate.LastName.ToLower() + candidate.Id);
				emailContent.EmailBody = emailContent.EmailBody.Replace("[assessment_link]", "https://172.16.254.4/assessment-auth");


				mailText = mailText.Replace("[EmailTo]", "Hi " + $"{candidate.FirstName} {candidate.LastName}");
				mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
				mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);


				var emailDto = new EmailDto()
				{
					SentTo = [candidate.Email],
					SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
					Body = mailText,
					Subject = emailContent.Subject
				};



				await emailService.SendEmailAsyncNew(emailDto);
			}
		}

		public async Task SendEmailOnboardingAutomation(int candidateId, int type)
		{
			var emailTemplatePath = webHostEnvironment.ContentRootFileProvider.GetFileInfo("document_template/EmailTemplate.html").PhysicalPath;

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var candidate = await _uniForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);


			var getAutomation = await _uniForCurrentService.EmailTemplateRepository.SelectEmailAutomation(candidate.JobId, candidate.ApplicationStatusId, type);

			{
				var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(getAutomation.EmailTemplate);


				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");

				var encryptedId = EncryptProvider.Base64Encrypt(candidateId.ToString(), Encoding.Unicode);

				emailContent.EmailBody = emailContent.EmailBody.Replace("[onboarding_form_link]", "https://172.16.254.4/onboarding/onboardinginformation/" + $"{encryptedId}");




				mailText = mailText.Replace("[EmailTo]", "Hi " + $"{candidate.FirstName} {candidate.LastName}");
				mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
				mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);


				var emailDto = new EmailDto()
				{
					SentTo = [candidate.Email],
					SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
					Body = mailText,
					Subject = emailContent.Subject
				};



				await emailService.SendEmailAsyncNew(emailDto);
			}
		}

		public async Task<JsonResult> SendEmailPendingPreDocsTemplate(int candidateId, int templateId)
		{
			var emailTemplatePath = webHostEnvironment.ContentRootFileProvider.GetFileInfo("document_template/EmailTemplate.html").PhysicalPath;

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var candidate = await _uniForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);
			var documents = await _uniForCurrentService.OnboardingRepository.RetrieveCandidatePreRequisiteDocumentsResult(candidateId);

			var documentList = new List<string>();
			if (!documents.HasNbiClearance) documentList.Add("Updated and original NBI/Police/Barangay Clearance");

			if (!documents.HasBirthCertificate) documentList.Add("PSA/NSO Birth Certificate");

			if (!documents.HasMedicalExam) documentList.Add("Pre-Employment Medical Exam");
			{
				var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(templateId);

				var documentText = string.Join("<br/>• ", documentList);
				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");

				emailContent.EmailBody = emailContent.EmailBody.Replace("[documents]", $"<br/>• {documentText}");

				mailText = mailText.Replace("[EmailTo]", "Hi " + $"{candidate.FirstName} {candidate.LastName}");
				mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
				mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);


				var emailDto = new EmailDto()
				{
					SentTo = [candidate.Email],
					SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
					Body = mailText,
					Subject = emailContent.Subject
				};



				await emailService.SendEmailAsyncNew(emailDto);
			}

			var result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Declined" })
			{
				StatusCode = 200
			};
			return result;
		}

		public async Task<JsonResult> SendEmailPendingGeneralDocsTemplate(int candidateId, int templateId)
		{
			var emailTemplatePath = webHostEnvironment.ContentRootFileProvider.GetFileInfo("document_template/EmailTemplate.html").PhysicalPath;

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var candidate = await _uniForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);
			var candidateSheet = await _uniForCurrentService.OnboardingRepository.RetrieveOnboardingInformation(candidateId);
			var documents = await _uniForCurrentService.OnboardingRepository.RetrieveCandidateGeneralDocumentsResult(candidateId);

			var documentList = new List<string>();
			if (!documents.HasPagibig) documentList.Add("PagIBIG/MID");

			if (!documents.HasPhilhealth) documentList.Add("Philhealth");

			if (!documents.HasTin) documentList.Add("Tax Identification Number (Tin)");

			if (!documents.HasSss) documentList.Add("Social Security System (SSS)");

			if (!documents.HasDiploma) documentList.Add("Diploma/Transcript of Records/Any proof of educational attainment");
			if (candidateSheet.CivilStatus == "Married")
			{
				if (!documents.HasMarriageCert) documentList.Add("PSA/NSO Marriage Certificate (if married)");
			}
			if (!documents.HasDependentCert) documentList.Add("Dependent/s PSA/ NSO Birth Certificate");

			if (!documents.HasEmploymentCert) documentList.Add("Certificate of Employment from most recent employer/Signed resignation letter/Clearance");

			if (!documents.HasForm2316) documentList.Add("Current Year’s 2316");
			{
				var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(templateId);

				var documentText = string.Join("<br/>• ", documentList);
				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");

				emailContent.EmailBody = emailContent.EmailBody.Replace("[documents]", $"<br/>• {documentText}");

				mailText = mailText.Replace("[EmailTo]", "Hi " + $"{candidate.FirstName} {candidate.LastName}");
				mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
				mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);


				var emailDto = new EmailDto()
				{
					SentTo = [candidate.Email],
					SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
					Body = mailText,
					Subject = emailContent.Subject
				};



				await emailService.SendEmailAsyncNew(emailDto);
			}

			var result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Declined" })
			{
				StatusCode = 200
			};
			return result;
		}

		public async Task<JsonResult> SendEmailJobOfferTemplate(int candidateId, int templateId)
		{
			var emailTemplatePath = webHostEnvironment.ContentRootFileProvider.GetFileInfo("document_template/EmailTemplate.html").PhysicalPath;

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var candidate = await _uniForCurrentService.CandidateRepository.SelectCandidateInformation(candidateId);

			{
				var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(templateId);



				emailContent.EmailBody = emailContent.EmailBody.Replace("[candidate_first_name]", $"{candidate.FirstName}");

				var encryptedId = EncryptProvider.Base64Encrypt(candidateId.ToString(), Encoding.Unicode);

				emailContent.EmailBody = emailContent.EmailBody.Replace("[job_offer_link]", "https://172.16.254.4/joboffer/acceptance/" + $"{encryptedId}");




				mailText = mailText.Replace("[EmailTo]", "Hi " + $"{candidate.FirstName} {candidate.LastName}");
				mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
				mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);


				var emailDto = new EmailDto()
				{
					SentTo = [candidate.Email],
					SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
					Body = mailText,
					Subject = emailContent.Subject
				};



				await emailService.SendEmailAsyncNew(emailDto);
			}

			var result = new JsonResult(new { success = true, responseText = "Job Offer Successfully Declined" })
			{
				StatusCode = 200
			};
			return result;
		}
	}
}
