namespace Assessment.Service.API.Core.Dto.NewFolder;

public class AssessmentAnswerDto
{
    public string AssessmentAnswerBody { get; set; }

    public int CandidateId { get; set; }

    public int QuestionId { get; set; }

    public IFormFile? VideoFile { get; set; }

    public int AssessmentId { get; set; }

    public int Marks { get; set; }

    public int Type { get; set; }
}