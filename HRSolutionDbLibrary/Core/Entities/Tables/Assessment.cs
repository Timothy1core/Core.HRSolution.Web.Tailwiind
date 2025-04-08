#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class Assessment
{
	public int Id { get; set; }

	public string Name { get; set; }

	public string Instruction { get; set; }

	public string CreatedBy { get; set; }

	public DateTime CreatedDate { get; set; }

	public bool IsActive { get; set; }

	public int Duration { get; set; }

	public string? Description { get; set; }

	public string? ModifiedBy { get; set; }

	public DateTime? ModifiedDate { get; set; }

	public virtual ICollection<JobAssessment> JobAssessments { get; set; } = new List<JobAssessment>();

	public virtual ICollection<AssessmentRemainingTimer> AssessmentRemainingTimers { get; set; } = new List<AssessmentRemainingTimer>();


	public virtual ICollection<AssessmentQuestion> AssessmentQuestions { get; set; } = new List<AssessmentQuestion>();

    public virtual ICollection<AssessmentCorrection> AssessmentCorrections { get; set; } = new List<AssessmentCorrection>();
}