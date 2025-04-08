using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class JobApplicationRepository (CurrentServiceDbContext context) : IJobApplicationRepository
	{
		public async Task SaveJobApplicationQuestions(List<JobApplicationQuestion> question)
		{
			foreach (var q in question)
			{
				if (q.Id != 0) // Update existing q
				{
					var existingQuestion = await context.JobApplicationQuestions.FindAsync(q.Id);
					if (existingQuestion == null) continue;
					existingQuestion.Body = q.Body;
					existingQuestion.Type = q.Type;
					existingQuestion.Required = q.Required;
				}
				else
				{
					await context.JobApplicationQuestions.AddAsync(q);
				}
			}


		}


	

	}
}
