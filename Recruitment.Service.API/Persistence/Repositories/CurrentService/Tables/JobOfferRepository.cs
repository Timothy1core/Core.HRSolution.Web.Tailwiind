using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

public class JobOfferRepository(CurrentServiceDbContext context) : IJobOfferRepository
{
	public async Task SaveJobOfferInformation(JobOfferInformation jobOfferInformation)
	{
		await context.JobOfferInformations.AddAsync(jobOfferInformation);
	}



	public async Task<List<JobOfferDashboardDto>> RetrieveCandidateForJobOfferList(int status)
	{
		var candidatesForJobOffer = await context.JobOfferInformations
			.Include(x => x.Candidate)
			.ThenInclude(i => i.Job)
			.Include(i => i.JobOfferStatus)
		.ToListAsync();

		candidatesForJobOffer = status == 0 ? candidatesForJobOffer.ToList() : candidatesForJobOffer.Where(x => x.JobOfferStatusId == status).ToList();

		var candidatesForJobOfferDtos = candidatesForJobOffer.Select(s => new JobOfferDashboardDto()
		{
			// Id = s.Id,
			TotalRenderingPeriod = s.TotalRenderingPeriod,
			TargetStartDate = s.TargetStartDate,
			ProbitionarySalary = s.ProbitionarySalary,
			ProbitionaryDeminimis = s.ProbitionaryDeminimis,
			RegularDeminimis = s.RegularDeminimis,
			RegularSalary = s.RegularSalary,
			CandidateId = s.CandidateId,
			JobOfferStatus = s.JobOfferStatus.Status,
			JobOfferStatusId = s.JobOfferStatus.Id,
			CandidateName = s.Candidate.FirstName + " " + s.Candidate.LastName,
			Position = s.Candidate.Job.Position
		})
			.ToList();
		return candidatesForJobOfferDtos;

	}

	public async Task<JobOfferDto> RetrieveJobOfferInfo(int candidateId)
	{
		var jobOfferInfo = await context.JobOfferInformations
			.Include(x => x.Candidate)
			.ThenInclude(i => i.Job)
			.Include(i => i.JobOfferStatus)
			.Where(w=>w.CandidateId == candidateId)
			.Select(s => new JobOfferDto
			{
				// Id = s.Id,
				TotalRenderingPeriod = s.TotalRenderingPeriod,
				TargetStartDate = s.TargetStartDate,
				ProbitionarySalary = s.ProbitionarySalary,
				ProbitionaryDeminimis = s.ProbitionaryDeminimis,
				RegularDeminimis = s.RegularDeminimis,
				RegularSalary = s.RegularSalary,
				CandidateId = s.CandidateId,
				JobOfferStatus = s.JobOfferStatus.Status,
				JobOfferStatusId = s.JobOfferStatus.Id,
				CandidateName = s.Candidate.FirstName + " " + s.Candidate.LastName,
				CandidateEmail = s.Candidate.Email,
				CandidateSignature = s.CandidateSignature,
				CandidateNotes = s.CandidateNotes,
				Position = s.Candidate.Job.Position,
				ClientId = s.Candidate.Job.DepartmentId,
				CurrentSalary = s.Candidate.CurrentSalary,
				ExpectedSalary = s.Candidate.ExpectedSalary,
				ApproverId = s.ApproverId,
				IsApproved = s.IsApproved,
				ApproverSignature = s.ApproverSignature,
				ApprovedDate = s.ApprovedDate,
				ApproverNotes = s.ApproverNotes,
			})
			.FirstOrDefaultAsync();
		return jobOfferInfo!;
	}

	public async Task UpdateJobOffer(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.ApproverId = jobOfferInformationDto.ApproverId;
			jobOfferInformation.TotalRenderingPeriod = jobOfferInformationDto.TotalRenderingPeriod;
			jobOfferInformation.TargetStartDate = jobOfferInformationDto.TargetStartDate;
			jobOfferInformation.ProbitionarySalary = jobOfferInformationDto.ProbitionarySalary;
			jobOfferInformation.ProbitionaryDeminimis = jobOfferInformationDto.ProbitionaryDeminimis;
			jobOfferInformation.RegularSalary = jobOfferInformationDto.RegularSalary;
			jobOfferInformation.RegularDeminimis = jobOfferInformationDto.RegularDeminimis;
		}
	}

	public async Task JobOfferApproved(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.ApproverSignature = jobOfferInformationDto.ApproverSignature;
			jobOfferInformation.ApprovedDate = jobOfferInformationDto.ApprovedDate;
			jobOfferInformation.IsApproved = jobOfferInformationDto.IsApproved;
			jobOfferInformation.JobOfferStatusId = 2;
		}
	}
	public async Task JobOfferSalaryDeclined(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.IsApproved = jobOfferInformationDto.IsApproved;
			jobOfferInformation.ApproverNotes = jobOfferInformationDto.ApproverNotes;
		}
	}
	public async Task JobOfferAccepted(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.CandidateSignature = jobOfferInformationDto.CandidateSignature;
			jobOfferInformation.IsCandidateAccepted = jobOfferInformationDto.IsCandidateAccepted;
			jobOfferInformation.AcceptedDate = jobOfferInformationDto.AcceptedDate;
			jobOfferInformation.JobOfferStatusId = 5;
		}
	}

	public async Task JobOfferDeclined(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.IsApproved = jobOfferInformationDto.IsApproved;
			jobOfferInformation.CandidateNotes = jobOfferInformationDto.CandidateNotes;
			jobOfferInformation.JobOfferStatusId = 7;
		}
	}

	public async Task UpdateJobOfferStatus(JobOfferInformation jobOfferInformationDto)
	{
		var jobOfferInformation = await context.JobOfferInformations.FirstOrDefaultAsync(x => x.CandidateId == jobOfferInformationDto.CandidateId);

		if (jobOfferInformation != null)
		{
			jobOfferInformation.JobOfferStatusId = jobOfferInformationDto.JobOfferStatusId;
		}
	}
}