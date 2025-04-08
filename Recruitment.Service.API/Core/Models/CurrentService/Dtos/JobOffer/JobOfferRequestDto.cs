namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;

public class JobOfferRequestDto
{
	public int TotalRenderingPeriod { get; set; }

	public DateTime TargetStartDate { get; set; }

	public string ProbitionarySalary { get; set; }

	public string ProbitionaryDeminimis { get; set; }

	public string RegularSalary { get; set; }

	public string RegularDeminimis { get; set; }

	public int JobOfferStatusId { get; set; }

	public int CandidateId { get; set; }

	public string ApproverId { get; set; }
}