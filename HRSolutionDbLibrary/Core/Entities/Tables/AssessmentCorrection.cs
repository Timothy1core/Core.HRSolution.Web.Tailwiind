namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class AssessmentCorrection
{
    public int Id { get; set; }

    public int AssessmentId { get; set; }

    public int QuestionId { get; set; }

    public int CandidateId { get; set; }

    public string AnswerBody { get; set; }

    public bool? IsCorrect { get; set; }

    public int Marks { get; set; }
    public bool IsMultipleChoice { get; set; }
    public virtual Assessment Assessment { get; set; }
}