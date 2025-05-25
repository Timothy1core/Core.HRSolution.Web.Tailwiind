namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer
{
	public class JobOfferDashboardDto
	{
		public int Id { get; set; }
		public int TotalRenderingPeriod { get; set; }

		public DateTime TargetStartDate { get; set; }

		public string ProbitionarySalary { get; set; }

		public string ProbitionaryDeminimis { get; set; }

		public string RegularSalary { get; set; }

		public string RegularDeminimis { get; set; }

		public string JobOfferStatus { get; set; }

		public int CandidateId { get; set; }
		public string CandidateName { get; set; }
		public string Position { get; set; }
		public object ClientId { get; set; }
		public string ApproverId { get; set; }
		public string CurrentSalary { get; set; }
		public string ExpectedSalary { get; set; }
		public int JobOfferStatusId { get; internal set; }
		public bool? IsApproved { get; internal set; }
	}
}
