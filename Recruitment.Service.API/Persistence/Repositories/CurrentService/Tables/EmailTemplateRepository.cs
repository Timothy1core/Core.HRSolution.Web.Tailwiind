using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class EmailTemplateRepository(CurrentServiceDbContext context) : IEmailTemplateRepository
	{
		public async Task CreateEmailTemplate(EmailTemplate emailTemplate)
		{
			await context.EmailTemplates.AddAsync(emailTemplate);
		}

		public async Task UpdateEmailTemplate(EmailTemplate emailTemplate)
		{
			var template = await context.EmailTemplates.FirstOrDefaultAsync(x=> x.Id == emailTemplate.Id);

			if (template != null)
			{
				template.Name = emailTemplate.Name;
				template.Subject = emailTemplate.Subject;
				template.EmailBody = emailTemplate.EmailBody;
			}
		}

		public async Task RemoveEmailTemplate(int id)
		{
			var template = await context.EmailTemplates.FirstOrDefaultAsync(x => x.Id == id);

			if (template != null)
			{
				template.IsActive = false;
			}
		}

		public async Task<List<EmailTemplateActionDto>> SelectEmailTemplate()
		{
			var templates = await context.EmailActions
				.Include(i => i.EmailTemplates)
				.Select(s => new EmailTemplateActionDto
				{
					Id = s.Id,
					ActionName = s.EmailAction1,
					EmailTemplateDashboard = s.EmailTemplates.Select(ss => new EmailTemplateDashboardDto()
					{
						Id = ss.Id,
						Name = ss.Name,
						Subject = ss.Subject,
						Body = ss.EmailBody,
						Cc = ss.Cc,
					}).ToList()
				}).ToListAsync();

			return templates;
		}

		public async Task<EmailTemplate> SelectEmailTemplateInformation(int id)
		{
			var template = await context.EmailTemplates.FindAsync(id);

			return template;
		}

		public async Task<List<DropDownValueDto>> SelectTemplateDropDown()
		{
			var profiles = await context.EmailTemplates
				.Where(w => w.EmailActionId == 3)
				.ToListAsync();


			var dropDownValueDtos = profiles.Select(s => new DropDownValueDto()
			{
				Id = s.Id,
				Value = s.Id.ToString(),
				Label = s.Name
			}).ToList();

			return dropDownValueDtos;

		}


		public async Task CreateEmailAutomation(EmailAutomation emailAutomation)
		{
			await context.EmailAutomations.AddAsync(emailAutomation);
		}

		public async Task UpdateEmailAutomation(EmailAutomation emailAutomation)
		{
			var automation = await context.EmailAutomations.FirstOrDefaultAsync(x => x.Id == emailAutomation.Id);

			if (automation != null)
			{

				automation.JobId = emailAutomation.JobId;
				automation.EmailTemplate = emailAutomation.EmailTemplate;
				automation.ApplicationId = emailAutomation.ApplicationId;
				automation.Disqualified = emailAutomation.Disqualified;
				automation.Type = emailAutomation.Type;
			}
		}
		public async Task<List<EmailAutomationDashboardDto>> SelectEmailAutomationDashboard()
		{
			var templates = await context.EmailAutomations
				.Include(x=> x.Application)
				.Include(x=> x.Job)
				.Include(x=> x.EmailTemplateNavigation)
				.Select(s => new EmailAutomationDashboardDto
				{
					Id = s.Id,
					JobId = s.JobId,
					StageId = s.ApplicationId,
					TemplateId = s.EmailTemplate,
					TypeId = s.Type,
					JobName = s.Job.Position,
					StageName = s.Application.ProcessName,
					TemplateName = s.EmailTemplateNavigation.Name,
				}).ToListAsync();

			return templates;
		}

		public async Task<EmailAutomation> SelectEmailAutomation(int jobId,int applicationId, int type)
		{
			var automations = await context.EmailAutomations
				.Include(x => x.Application)
				.Include(x => x.Job)
				.Include(x => x.EmailTemplateNavigation)
				.Where(w=> w.Type== type)
				.ToListAsync();
			EmailAutomation? data = null;

			if (type == 1)
			{
				data = automations.FirstOrDefault(w => w.JobId == jobId) ?? automations.FirstOrDefault(w => w.JobId == null);

			}
			else if (type == 2)
			{
				automations.Where(w => w.Disqualified).ToList();

				data = automations.FirstOrDefault(w => w.JobId == jobId && w.ApplicationId == applicationId) ?? automations.FirstOrDefault(w => w.JobId == null && w.ApplicationId == applicationId) ?? automations.FirstOrDefault(w => w.JobId == null && w.ApplicationId == null);
			}
			else if (type == 3)
			{
				data = automations.FirstOrDefault(w => w.JobId == jobId && w.ApplicationId == applicationId) ?? automations.FirstOrDefault(w => w.JobId == null && w.ApplicationId == applicationId);


			}
			else if (type == 4)
			{
				data = automations.FirstOrDefault(w => w.JobId == jobId && w.ApplicationId == applicationId) ?? automations.FirstOrDefault(w => w.JobId == null && w.ApplicationId == applicationId);

			}
			else
			{
				data = automations.FirstOrDefault(w => w.JobId == jobId) ?? automations.FirstOrDefault(w => w.JobId == null);

			}



			return data;
		}
	}
}
