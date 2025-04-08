#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class JobOfferInformation
{
	public int CandidateId { get; set; }

	public int TotalRenderingPeriod { get; set; }

	public DateTime TargetStartDate { get; set; }

	public string ProbitionarySalary { get; set; }

	public string ProbitionaryDeminimis { get; set; }

	public string RegularSalary { get; set; }

	public string RegularDeminimis { get; set; }

	public int JobOfferStatusId { get; set; }

	public string ApproverId { get; set; }

	public string ApproverSignature { get; set; }

	public DateTime? ApprovedDate { get; set; }

	public string CandidateNotes { get; set; }

	public bool? IsCandidateAccepted { get; set; }

	public DateTime? AcceptedDate { get; set; }

	public virtual Candidate Candidate { get; set; }

	public virtual JobOfferStatus JobOfferStatus { get; set; }
	public bool? IsApproved { get; set; }
	public string ApproverNotes { get; set; }
	public string CandidateSignature { get; set; }
}