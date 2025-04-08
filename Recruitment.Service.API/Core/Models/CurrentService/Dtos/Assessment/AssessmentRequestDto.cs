namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class AssessmentRequestDto
{

    public string Name { get; set; }

    public string Instruction { get; set; }

    public int Duration { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }

    public IList<QuestionRequestDto> Questions { get; set; }

}