using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class QuestionDto
{
    public int Id { get; set; }

    public int AssessmentId { get; set; }

    public string Body { get; set; }

    public int Type { get; set; }

    public bool Required { get; set; }
    public int Marks { get; set; }
    public bool IsActive { get; set; }

    public virtual AssessmentAnswer Answers { get; set; }
}