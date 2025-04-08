namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateAnswer
{
    public int Id { get; set; }

    public string AssessmentAnswerBody { get; set; }

    public int CandidateId { get; set; }

    public int QuestionId { get; set; }

    public virtual Candidate Candidate { get; set; }

    public virtual AssessmentQuestion AssessmentQuestion { get; set; }
}