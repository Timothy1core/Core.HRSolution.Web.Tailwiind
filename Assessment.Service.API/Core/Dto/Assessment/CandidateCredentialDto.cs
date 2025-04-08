using HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateCredentialDto
{
    public int Id { get; set; }

    public int CandidateId { get; set; }

    public DateTime Expiration { get; set; }

    public bool IsAssessmentStarted { get; set; }

    public bool IsFullscreenExit { get; set; }

    public bool IsMouseExited { get; set; }

    public bool IsAssessmentFinished { get; set; }
    public int CurrentAssessmentId { get; set; }

    public int? MouseOutsideCounter { get; set; }
    public int? AssessmentTimerId { get; set; }

    public virtual AssessmentRemainingTimer? AssessmentTimer { get; set; } = new AssessmentRemainingTimer();

    public bool HasAssessmentTimer => AssessmentTimer != null;
}