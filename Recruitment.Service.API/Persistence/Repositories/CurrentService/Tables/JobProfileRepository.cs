using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class JobProfileRepository(CurrentServiceDbContext context) : IJobProfileRepository
	{
		public async Task<List<DropDownValueDto>> SelectJobProfilesDropDown(int id)
		{
			var profiles = await context.JobProfiles
				.Where(w => w.DepartmentId == id)
				.ToListAsync();
// =======
	// public class JobProfileRepository(CurrentServiceDbContext context) : IJobProfileRepository
	// {
	//     public async Task<List<DropDownValueDto>> SelectJobProfilesDropDown(int id, int deptId)
	//     {
	//         var profiles = await context.JobProfiles
	//             .Where(w => w.ClientCompanyId == id)
	//             .ToListAsync();

			// profiles = deptId == 0 ? profiles.ToList() : profiles.Where(w => w.DepartmentId == deptId).ToList();

			var dropDownValueDtos = profiles.Select(s => new DropDownValueDto()
			{
				Id = s.Id,
				Value = s.Id.ToString(),
				Label = s.Position
			}).ToList();

			return dropDownValueDtos;

		}
		public async Task CreateNewJobProfile(JobProfile jobProfile)
		{
			await context.JobProfiles.AddAsync(jobProfile);
		}

		// public async Task<List<ClientJobProfileDashboardDto>> SelectJobProfileDashboard(int clientId)
		// {
		//     var profiles = await context.JobProfiles
		//         .Where(w=> w.ClientCompanyId== clientId)
		//         .Include(i => i.EmploymentType)
		//         .Include(i => i.JobStatus)
		//         .Include(i => i.ClientCompany)
		//         .Include(i=> i.Department)
		//         .Include(i=>i.JobApplicationProcesses)
		//         .ThenInclude(i=> i.ApplicationProcess)
		//         .Select(s => new ClientJobProfileDashboardDto()
		//         {
		//             Id = s.Id,
		//             Position = s.Position,
		//             ClientCompany = s.ClientCompany.Name,
		//             EmploymentType = s.EmploymentType.TypeName,
		//             JobStatus = s.JobStatus.Status,
		//             Department = s.Department.Name,
		//
		//         }).ToListAsync();
		//     return  profiles;
		//
		// }
		public async Task<List<ClientJobProfileDashboardDto>> JobProfileDashboard()
		{
			var profiles = await context.JobProfiles
				.Where(w => w.IsActive == true)
				.Include(i => i.EmploymentType)
				.Include(i => i.JobStatus)
				.Include(i => i.Department)
				.Select(s => new ClientJobProfileDashboardDto()
				{
					Id = s.Id,
					Position = s.Position,
					DateCreated = s.CreatedDate.ToString("MM/dd/yyyy"),
					EmploymentType = s.EmploymentType.TypeName,
					JobStatus = s.JobStatus.Status,
					JobApplicationProcesses = s.JobApplicationProcesses.Where(x => x.JobId == s.Id).Select(x => new JobApplicationProcess()
					{
						Id = x.Id,
						ApplicationProcessId = x.ApplicationProcessId,
						ApplicationProcess = x.ApplicationProcess
					}).ToList()
				}).ToListAsync();
			return profiles;
		
		}


		public async Task<ClientJobProfileDashboardDto> SelectJobProfileApplicationProcess(int jobId)
		{
			var profile = await context.JobProfiles
				.Where(w => w.IsActive == true && w.Id == jobId)

				.Select(s => new ClientJobProfileDashboardDto()
				{
					Id = s.Id,
					JobApplicationProcesses = s.JobApplicationProcesses.Select(x => new JobApplicationProcess()
					{
						Id = x.Id,
						ApplicationProcessId = x.ApplicationProcessId,
						ApplicationProcess = x.ApplicationProcess
					}).ToList()
				}).FirstOrDefaultAsync();
			return profile;

		}

		// public async Task<ClientJobProfileInformationDto> SelectJobProfileInformation(int jobId)
		// {
		//     var jobProfile = await context.JobProfiles
		//         .Include(i => i.JobApplicationQuestions)
		//         .ThenInclude(t => t.JobApplicationChoices)
		//         .Include(i => i.JobApplicationProcesses)
		//         .Select(s=> new ClientJobProfileInformationDto()
		//         {
		//             HasApplicationProcess = s.JobApplicationProcesses.Count>0,
		//             ClientJobProfile = new ClientJobProfileRequestDto()
		//             {
		//                 Id = s.Id,
		//                 ClientCompanyId = s.ClientCompanyId,
		//                 DepartmentId = s.DepartmentId,
		//                 Position = s.Position,
		//                 EmploymentTypeId = s.EmploymentTypeId,
		//                 JobStatusId = s.JobStatusId,
		//                 JobDescription = s.JobDescription,
		//                 Education = s.Education,
		//                 Experience = s.Experience,
		//                 KeyResponsibility = s.KeyResponsibility,
		//                 Qualifications = s.Qualifications,
		//                 ShowInCareerPage = s.ShowInCareerPage
		//             },
		//             ApplicationQuestions = s.JobApplicationQuestions.Select(ss=> new JobApplicationQuestionRequestDto()
		//             {
		//                 Id = ss.Id,
		//                 Body = ss.Body,
		//                 Required = ss.Required,
		//                 JobId = ss.JobId,
		//                 Type = ss.Type,
		//                 ApplicationChoices = ss.JobApplicationChoices.Select(sss=> new JobApplicationChoicesRequestDto()
		//                 {
		//                     Id = sss.Id,
		//                     Body = sss.Body,
		//                     ApplicationQuestionId = sss.ApplicationQuestionId
		//                 }).ToList()
		//             }).ToList(),
		//             Assessments = s.JobAssessments.Select(ss => new JobAssessmentDto()
		//             {
		//                 Id = ss.Id,
		//                 AssessmentId = ss.AssessmentId
		//             }).ToList()
		//
		//         })
		//         .FirstOrDefaultAsync(f => f.ClientJobProfile.Id == jobId);
		//     return jobProfile;
		// }

		// public async Task CreateJobProfileApplicationProcess(List<JobApplicationProcess> applicationProcesses)
		// {
		//     await context.JobApplicationProcesses.AddRangeAsync(applicationProcesses);
		// }

		// public async Task CreateJobProfileAssessment(List<JobAssessment> jobAssessments)
		// {
		//     foreach (var assessment in jobAssessments)
		//     {
		//         var existingEntity = await context.JobAssessments.FindAsync(assessment.Id);
		//         if (existingEntity == null) continue;
		//         existingEntity.AssessmentId = assessment.AssessmentId == 0? null : assessment.AssessmentId;
		//         existingEntity.CreatedBy = assessment.CreatedBy;
		//         existingEntity.CreatedDate = assessment.CreatedDate;
		//         existingEntity.IsActive = assessment.IsActive;
		//     }
		// }

		// public async Task UpdateJobProfile(JobProfile jobProfile,int id)
		// {
		//     var job = await context.JobProfiles.FindAsync(id);
		//
		//     if (job != null)
		//     {
		//         job.ClientCompanyId = jobProfile.ClientCompanyId;
		//         job.DepartmentId = jobProfile.DepartmentId;
		//         job.Position = jobProfile.Position;
		//         job.EmploymentTypeId = jobProfile.EmploymentTypeId;
		//         job.JobStatusId = jobProfile.JobStatusId;
		//         job.JobDescription = jobProfile.JobDescription;
		//         job.Education = jobProfile.Education;
		//         job.Experience = jobProfile.Experience;
		//         job.KeyResponsibility = jobProfile.KeyResponsibility;
		//         job.Qualifications = jobProfile.Qualifications;
		//         job.ShowInCareerPage = jobProfile.ShowInCareerPage;
		//     }
		// }
// >>>>>>> Stashed changes


		// 	var dropDownValueDtos = profiles.Select(s => new DropDownValueDto()
		// 	{
		// 		Id = s.Id,
		// 		Value = s.Id.ToString(),
		// 		Label = s.Position
		// 	}).ToList();
		//
		// 	return dropDownValueDtos;
		//
		// }

		public async Task<List<DropDownValueDto>> SelectAllJobProfilesDropDown()
		{
			var profiles = await context.JobProfiles
				.Where(w => w.IsActive == true)
				.ToListAsync();


			var dropDownValueDtos = profiles.Select(s => new DropDownValueDto()
			{
				Id = s.Id,
				Value = s.Id.ToString(),
				Label = s.Position
			}).ToList();

			return dropDownValueDtos;

		}
		// public async Task CreateNewJobProfile(JobProfile jobProfile)
		// {
		// 	var a = context.JobProfiles.ToList();
		//
		// 	await context.JobProfiles.AddAsync(jobProfile);
		// }

		public async Task<List<ClientJobProfileDashboardDto>> SelectJobProfileDashboard(int clientId)
		{
			var profiles = await context.JobProfiles
				.Where(w=> w.DepartmentId== clientId)
				.Include(i => i.EmploymentType)
				.Include(i => i.JobStatus)
				.Include(i => i.Department)
				.Select(s => new ClientJobProfileDashboardDto()
				{
					Id = s.Id,
					Position = s.Position,
					DateCreated = s.CreatedDate.ToString("MM/dd/yyyy"),
					EmploymentType = s.EmploymentType.TypeName,
					JobStatus = s.JobStatus.Status,
				}).ToListAsync();
			return  profiles;

		}

		public async Task<ClientJobProfileInformationDto> SelectJobProfileInformation(int jobId)
		{
			var jobProfile = await context.JobProfiles
				.Include(i => i.JobApplicationQuestions)
				.ThenInclude(t => t.JobApplicationChoices)
				.Include(i => i.JobApplicationProcesses)
				.Select(s=> new ClientJobProfileInformationDto()
				{
					HasApplicationProcess = s.JobApplicationProcesses.Count>0,
					ClientJobProfile = new ClientJobProfileRequestDto()
					{
						Id = s.Id,
						DepartmentId = s.DepartmentId,
						Position = s.Position,
						EmploymentTypeId = s.EmploymentTypeId,
						JobStatusId = s.JobStatusId,
						JobDescription = s.JobDescription,
						Education = s.Education,
						Experience = s.Experience,
						KeyResponsibility = s.KeyResponsibility,
						Qualifications = s.Qualifications,
						ShowInCareerPage = s.ShowInCareerPage
					},
					ApplicationQuestions = s.JobApplicationQuestions.Select(ss=> new JobApplicationQuestionRequestDto()
					{
						Id = ss.Id,
						Body = ss.Body,
						Required = ss.Required,
						JobId = ss.JobId,
						Type = ss.Type,
						ApplicationChoices = ss.JobApplicationChoices.Select(sss=> new JobApplicationChoicesRequestDto()
						{
							Id = sss.Id,
							Body = sss.Body,
							ApplicationQuestionId = sss.ApplicationQuestionId
						}).ToList()
					}).ToList(),
					Assessments = s.JobAssessments.Select(ss => new JobAssessmentDto()
					{
						Id = ss.Id,
						AssessmentId = ss.AssessmentId
					}).ToList()

				})
				.FirstOrDefaultAsync(f => f.ClientJobProfile.Id == jobId);
			return jobProfile;
		}

		public async Task CreateJobProfileApplicationProcess(List<JobApplicationProcess> applicationProcesses)
		{
			await context.JobApplicationProcesses.AddRangeAsync(applicationProcesses);
		}

		public async Task CreateJobProfileAssessment(List<JobAssessment> jobAssessments)
		{
			foreach (var assessment in jobAssessments)
			{
				var existingEntity = await context.JobAssessments.FindAsync(assessment.Id);
				if (existingEntity == null) continue;
				existingEntity.AssessmentId = assessment.AssessmentId == 0? null : assessment.AssessmentId;
				existingEntity.CreatedBy = assessment.CreatedBy;
				existingEntity.CreatedDate = assessment.CreatedDate;
				existingEntity.IsActive = assessment.IsActive;
			}
		}

		public async Task UpdateJobProfile(JobProfile jobProfile,int id)
		{
			var job = await context.JobProfiles.FindAsync(id);

			if (job != null)
			{
				job.DepartmentId = jobProfile.DepartmentId;
				job.Position = jobProfile.Position;
				job.EmploymentTypeId = jobProfile.EmploymentTypeId;
				job.JobStatusId = jobProfile.JobStatusId;
				job.JobDescription = jobProfile.JobDescription;
				job.Education = jobProfile.Education;
				job.Experience = jobProfile.Experience;
				job.KeyResponsibility = jobProfile.KeyResponsibility;
				job.Qualifications = jobProfile.Qualifications;
				job.ShowInCareerPage = jobProfile.ShowInCareerPage;
			}
		}


		public async Task<ApplicationFormJobProfileDetailsDto> SelectApplicationFormJobDetails(int jobId)
		{
			var jobProfile = await context.JobProfiles
				.Where(w => w.Id == jobId)
				.Select(s => new ApplicationFormJobProfileDetailsDto()
				{
					CompanyName = s.Department.Name,
					EmploymentType = s.EmploymentType.TypeName,
					Education = s.Education,
					Experience = s.Experience,
					JobDescription = s.JobDescription,
					KeyResponsibility = s.KeyResponsibility,
					Position = s.Position,
					Qualifications = s.Qualifications,
					Questions = s.JobApplicationQuestions.Select(ss=> new JobApplicationQuestionRequestDto
					{
						Id = ss.Id,
						Body = ss.Body,
						Required = ss.Required,
						Type = ss.Type,
						ApplicationChoices = ss.JobApplicationChoices.Select(c=> new JobApplicationChoicesRequestDto()
						{
							Body = c.Body,
						}).ToList()
					}).ToList()
				}).FirstOrDefaultAsync();
			
			return jobProfile ?? throw new InvalidOperationException();
		}

		public async Task<List<JobProfilePostedDto>> SelectCareersJobProfile()
		{
			var profiles = await context.JobProfiles
				.Where(w => w.ShowInCareerPage)
				.Include(i => i.EmploymentType)
				.Include(i => i.JobStatus)
				.Include(i => i.Department)
				.Select(s => new JobProfilePostedDto()
				{
					Id = s.Id,
					Position = s.Position,
					EmploymentType = s.EmploymentType.TypeName,
					JobStatus = s.JobStatus.Status,
					DatePosted = s.CreatedDate
				}).ToListAsync();
			return profiles;

		}

		public async Task<JobProfile> SelectJobProfileRawData(int jobId)
		{
			var profile = await context.JobProfiles.Include(i=> i.Department).FirstOrDefaultAsync(w=> w.Id==jobId);

			return profile;
		}
	}
}
