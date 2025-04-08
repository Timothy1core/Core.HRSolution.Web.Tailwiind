namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class AssessmentDashboardDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Instruction { get; set; }

    public int Duration { get; set; }
    public string Description { get; set; }
    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }
    public List<AssessmentQuestion> Questions { get; set; }
}