using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class AssessmentCheckingDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<QuestionDetailsDto> QuestionDetails { get; set; } = new List<QuestionDetailsDto>();
}