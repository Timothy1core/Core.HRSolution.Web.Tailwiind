using HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateCredential
{
	public int Id { get; set; }

	public int CandidateId { get; set; }

	public string CandidateStringId => CandidateId.ToString();

	public string Email { get; set; }

	public string Password { get; set; }

	public bool IsActive { get; set; }

	public int LogInAttempt { get; set; }

	public bool IsLockOut { get; set; }

	public DateTime Expiration { get; set; }

    public bool IsAssessmentStarted { get; set; }

    public bool IsFullscreenExit { get; set; }

    public bool IsMouseExited { get; set; }

	public bool IsAssessmentFinished { get; set; }

    public int CurrentAssessmentId { get; set; }

    public int? MouseOutsideCounter { get; set; }
    public int? AssessmentTimerId { get; set; }
    public virtual AssessmentRemainingTimer AssessmentRemainingTimer { get; set; }

    public virtual Candidate Candidate { get; set; }
}