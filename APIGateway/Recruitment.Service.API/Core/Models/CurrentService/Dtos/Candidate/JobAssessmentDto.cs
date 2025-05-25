namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class JobAssessmentDto
{
    public int Id { get; set; }
    public virtual List<AssessmentCorrectionDto> AssessmentDetails { get; set; } = new List<AssessmentCorrectionDto>();
    public int CorrectCount { get; set; }
    public int NeedToCheck { get; set; }
    public int TotalQuestions { get; set; }
    public int WrongCount { get; set; }
    public string AssessmentName { get; set; }
    public int JobId { get; set; }
}