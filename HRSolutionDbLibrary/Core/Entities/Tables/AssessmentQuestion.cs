#nullable disable
using HRSolutionDbLibrary.Core.Entities.Tables;

public class AssessmentQuestion
{
	public int Id { get; set; }

	public int AssessmentId { get; set; }

	public string Body { get; set; }

	public int Type { get; set; }

	public bool Required { get; set; }
	public int Marks { get; set; }
	public bool IsActive { get; set; }

	public virtual ICollection<AssessmentAnswer> AssessmentAnswers { get; set; } = new List<AssessmentAnswer>();

	public virtual Assessment Assessment { get; set; }

	public virtual ICollection<AssessmentChoice> AssessmentChoices { get; set; } = new List<AssessmentChoice>();
	public virtual ICollection<AssessmentVideoDuration> AssessmentVideoDurations { get; set; } = new List<AssessmentVideoDuration>();
	public virtual ICollection<CandidateAnswer> CandidateAnswers { get; set; } = new List<CandidateAnswer>();
}