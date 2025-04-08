namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class AssessmentCorrectionDto
{
    public int Id { get; set; }

    public int AssessmentId { get; set; }

    public int QuestionId { get; set; }

    public int CandidateId { get; set; }

    public string AnswerBody { get; set; }

    public bool? IsCorrect { get; set; }

    public int Marks { get; set; }
    public bool IsMultipleChoice { get; set; }

    public int CorrectAnswers { get; set; }

    public int NeedManualChecking { get; set; }
}